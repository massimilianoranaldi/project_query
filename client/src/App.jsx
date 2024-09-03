import React, { useEffect, useState } from "react";
import IndiceCapitoliParagrafi from "./components/IndiceCapitoliParagrafi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCapitoli,
  setSystem,
  resetCapitoli,
  downloadFromGit,
} from "./redux/capitoliSlice";
import ListaCapitoliParagrafi from "./components/ListaCapitoliParagrafi";
import CapitoloParagrafoForm from "./components/CapitoloParagrafoForm";
import Loading from "./components/Loading"; // Assicurati che questo import punti al componente corretto
import Error from "./components/Error"; // Assicurati che questo import punti al componente corretto
import paragrafoIcon4 from "./assets/aggiungi_capitolo.png";
import paragrafoIcon6 from "./assets/importa.png";
import paragrafoIcon5 from "./assets/esporta.png";
import { handleImportData, handleExportData } from "./utils/dataUtils.js";
import Sidebar from "./components/Sidebar";
import { useLocation } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    data: dataCapitoli,
    loading,
    error,
    system,
  } = useSelector((state) => state.capitoli);

  //per simulare il timeout
  //-----------------------------------------------
  const [isSimulatedLoading, setSimulatedLoading] = useState(true); // Stato per la simulazione del timeoutdeve stare a TRUE altrimenti false

  useEffect(() => {
    // Simula un timeout di caricamento di 2 secondi
    const timeoutId = setTimeout(() => {
      setSimulatedLoading(false); // Imposta lo stato di caricamento a false dopo 2 secondi
    }, 2000);

    return () => clearTimeout(timeoutId); // Pulizia al termine dell'effetto
  }, []);
  //-----------------------------------------------

  useEffect(() => {
    dispatch(resetCapitoli());

    const path = location.pathname;
    if (path === "/SystemCOM") {
      dispatch(setSystem("COM"));
      dispatch(fetchCapitoli(["COM"]));
    } else if (path === "/SystemESB") {
      dispatch(setSystem("ESB"));
      dispatch(fetchCapitoli(["ESB"]));
    } else if (path === "/SystemCRM") {
      dispatch(setSystem("CRM"));
      dispatch(fetchCapitoli(["CRM"]));
    } else if (path === "/SystemCOMB") {
      dispatch(setSystem("COMB"));
      dispatch(fetchCapitoli(["COMB"]));
    } else {
      dispatch(setSystem("default"));
    }

    console.log(dataCapitoli);
  }, [dispatch, location.pathname]);

  const [isDownloadFromGit, setDownloadFromGit] = useState(false);
  useEffect(() => {
    if (!isDownloadFromGit && location.pathname !== "/") {
      dispatch(downloadFromGit());
      setDownloadFromGit(true);
    }
  }, [dispatch, isDownloadFromGit, location.pathname, system]);

  const [showAddCapitoloForm, setShowAddCapitoloForm] = useState({
    id: null,
    operazione: null,
  });

  // Mostra il componente di caricamento se `isSimulatedLoading` è true o se `loading` dallo stato redux è true
  if (isSimulatedLoading || loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Error />
      </div>
    );
  }

  const handleAddCapitoloClick = () => {
    setShowAddCapitoloForm({ id: null, operazione: "addChapter" });
  };

  const handleCancelAddCapitolo = () => {
    setShowAddCapitoloForm({ id: null, operazione: null });
  };

  const handleSave = (newCapitolo) => {
    dispatch(fetchCapitoli());
    setShowAddCapitoloForm({ id: null, operazione: null });
  };

  return (
    <>
      <Sidebar />
      <div className="ml-60 h-screen flex flex-col">
        {/* Sezione dell'indice */}
        <div className="bg-white border-customColor1 border-b-4 border-l-4">
          <div className="flex items-center justify-between bg-customColor2 sticky top-0 z-10">
            <h1 className="text-left text-3xl font-bold">
              {`INDICE dei Capitoli ${system}`}
            </h1>
            <div className="flex gap-0">
              <button
                title="Esporta Dati"
                className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-customColor3"
                onClick={() => handleExportData(dataCapitoli, system)}
              >
                <img
                  src={paragrafoIcon5}
                  alt="Esporta Dati"
                  className="w-5 h-5"
                />
              </button>
              <button
                title="Importa Dati"
                className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-customColor3 mr-4"
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
          <div
            style={{ maxHeight: "500px", overflowY: "auto" }}
            className="mb-4"
          >
            <IndiceCapitoliParagrafi capitoli={dataCapitoli} />
          </div>
        </div>

        {/* Sezione della lista dei capitoli e paragrafi */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white border-customColor1 border-b-4 border-l-4 mt-4">
          <div className="flex items-center justify-between bg-customColor2 border-customColor1  border-l-0 ">
            <h1 className="text-left text-3xl font-bold">Lista dei Capitoli</h1>
            <div className="ml-auto flex gap-2">
              <div className="relative ml-auto justify-end mr-4">
                <button
                  title="Aggiungi Capitolo"
                  className="bg-transparent text-white mr-4 rounded-2xl hover:bg-customColor3 "
                  onClick={handleAddCapitoloClick}
                >
                  <img
                    src={paragrafoIcon4}
                    alt="Aggiungi Capitolo"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto bg-white p-2 mb-4">
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
      </div>
    </>
  );
}

export default App;
