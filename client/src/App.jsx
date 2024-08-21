// App.jsx

import React, { useEffect, useState, useCallback } from "react";
import IndiceCapitoliParagrafi from "./components/IndiceCapitoliParagrafi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCapitoli, addParagrafo } from "./redux/capitoliSlice";
import ListaCapitoliParagrafi from "./components/ListaCapitoliParagrafi";
import CapitoloParagrafoForm from "./components/CapitoloParagrafoForm";
import paragrafoIcon4 from "./assets/aggiungi_capitolo.png";

function App() {
  const dispatch = useDispatch();
  const {
    data: dataCapitoli,
    loading,
    adding,
    error,
  } = useSelector((state) => state.capitoli);
  const [showAddCapitoloForm, setShowAddCapitoloForm] = useState({
    id: null,
    operazione: null,
  });

  useEffect(() => {
    dispatch(fetchCapitoli());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  //----------------

  const handleAddCapitoloClick = () => {
    setShowAddCapitoloForm({ id: null, operazione: "addChapter" });
  };

  const handleCancelAddCapitolo = () => {
    setShowAddCapitoloForm({ id: null, operazione: null });
  };

  const handleSave = (newCapitolo) => {
    // Implementa la logica per salvare un nuovo capitolo
    console.log("Saving new capitolo:", newCapitolo);
    // Dopo il salvataggio, nascondi il modulo

    // Potresti voler rifare il fetch dei capitoli per aggiornare la lista
    dispatch(fetchCapitoli());
    setShowAddCapitoloForm({ id: null, operazione: null });
  };
  //------------------

  return (
    <>
      <div className="mb-4 p-0 bg-white text-left border-yellow-500 border-b-4 border-l-4">
        <h1 className="text-left text-3xl font-bold bg-gradient-to-r from-white to-yellow-500 ">
          INDICE dei Capitoli
        </h1>
        <IndiceCapitoliParagrafi capitoli={dataCapitoli} />
      </div>

      <div className=" bg-white border-yellow-500 border-b-4 border-l-4">
        <div className="p-1 flex items-center justify-between bg-gradient-to-r from-white to-yellow-500 ">
          <h1 className="text-left text-3xl font-bold">Lista dei Capitoli</h1>
          <div className="ml-auto flex gap-2">
            <button
              title="Aggiungi Capitolo"
              className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-yellow-600 justify-end"
              onClick={handleAddCapitoloClick}
            >
              <img
                src={paragrafoIcon4}
                alt="Aggiungi Capitolo"
                className="w-5 h-5" // Imposta dimensioni appropriate per l'icona
              />
            </button>
          </div>
        </div>

        {/* Condiziona la visualizzazione del modulo */}
        {showAddCapitoloForm.operazione === "addChapter" && (
          <CapitoloParagrafoForm
            capitolo={null}
            operazione={showAddCapitoloForm.operazione}
            onSave={handleSave}
            onCancel={handleCancelAddCapitolo}
          />
        )}
        <ListaCapitoliParagrafi capitoli={dataCapitoli} />
      </div>
    </>
  );
}

export default App;
