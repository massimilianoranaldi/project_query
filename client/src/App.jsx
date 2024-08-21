import React, { useEffect, useState } from "react";
import IndiceCapitoliParagrafi from "./components/IndiceCapitoliParagrafi";
import { useDispatch, useSelector } from "react-redux";
import { fetchCapitoli } from "./redux/capitoliSlice";
import ListaCapitoliParagrafi from "./components/ListaCapitoliParagrafi";
import CapitoloParagrafoForm from "./components/CapitoloParagrafoForm";
import paragrafoIcon4 from "./assets/aggiungi_capitolo.png";
import paragrafoIcon6 from "./assets/importa.png";
import paragrafoIcon5 from "./assets/esporta.png";
import { handleImportData, handleExportData } from "./utils/dataUtils.js";

function Sidebar() {
  return (
    <div
      className="fixed top-0 left-0 h-full w-48 bg-yellow-500 text-white flex flex-col items-center shadow-lg"
      style={{ zIndex: 1000 }}
    >
      <h2 className="mt-4 text-xl font-bold">Menu</h2>
      <nav className="mt-2">
        <ul className="space-y-2">
          <li>
            <a href="/" className="hover:text-gray-200">
              Query per il sistema ESB
            </a>
          </li>
          <li>
            <a href="/about" className="hover:text-gray-200">
              Query per il sistema COM
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const {
    data: dataCapitoli,
    loading,
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

  const handleAddCapitoloClick = () => {
    setShowAddCapitoloForm({ id: null, operazione: "addChapter" });
  };

  const handleCancelAddCapitolo = () => {
    setShowAddCapitoloForm({ id: null, operazione: null });
  };

  const handleSave = (newCapitolo) => {
    console.log("Saving new capitolo:", newCapitolo);
    dispatch(fetchCapitoli());
    setShowAddCapitoloForm({ id: null, operazione: null });
  };

  return (
    <>
      <Sidebar />
      <div className="ml-48 p-4">
        {" "}
        {/* Aggiunta di margine per il pannello */}
        <div className="mb-4 p-0 bg-white text-left border-yellow-500 border-b-4 border-l-4">
          <h1 className="text-left text-3xl font-bold bg-gradient-to-r to-white from-yellow-500 ">
            INDICE dei Capitoli
          </h1>
          <IndiceCapitoliParagrafi capitoli={dataCapitoli} />
        </div>
        <div className="bg-white border-yellow-500 border-b-4 border-l-4">
          <div className="flex items-center justify-between bg-gradient-to-r to-white from-yellow-500">
            <h1 className="text-left text-3xl font-bold">Lista dei Capitoli</h1>
            <div className="ml-auto flex gap-2">
              <div className="relative ml-auto justify-end">
                <button
                  title="Aggiungi Capitolo"
                  className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-yellow-600"
                  onClick={handleAddCapitoloClick}
                >
                  <img
                    src={paragrafoIcon4}
                    alt="Aggiungi Capitolo"
                    className="w-5 h-5"
                  />
                </button>
                <button
                  title="Esporta Dati"
                  className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-yellow-600"
                  onClick={() => handleExportData(dataCapitoli)}
                >
                  <img
                    src={paragrafoIcon5}
                    alt="Esporta Dati"
                    className="w-5 h-5"
                  />
                </button>
                <button
                  title="Importa Dati"
                  className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-yellow-600"
                  onClick={() => handleImportData(dispatch)}
                >
                  <img
                    src={paragrafoIcon6}
                    alt="Importa Dati"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
          </div>

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
      </div>
    </>
  );
}

export default App;
