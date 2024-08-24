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
import paragrafoIcon4 from "./assets/aggiungi_capitolo.png";
import paragrafoIcon6 from "./assets/importa.png";
import paragrafoIcon5 from "./assets/esporta.png";
import { handleImportData, handleExportData } from "./utils/dataUtils.js";
import Sidebar from "./components/Sidebar";
import { useLocation } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  // gestisce le chiamate alle api
  const {
    data: dataCapitoli,
    loading,
    error,
    system,
  } = useSelector((state) => state.capitoli);

  useEffect(() => {
    dispatch(resetCapitoli());

    // Imposta il sistema in base al percorso
    const path = location.pathname;
    if (path === "/SystemCOM") {
      dispatch(setSystem("COM"));
      dispatch(fetchCapitoli("COM"));
    } else if (path === "/SystemESB") {
      dispatch(setSystem("ESB"));
      dispatch(fetchCapitoli("ESB"));
    } else if (path === "/SystemCRM") {
      dispatch(setSystem("CRM"));
      dispatch(fetchCapitoli("CRM"));
    } else if (path === "/SystemCOMB") {
      dispatch(setSystem("COMB"));
      dispatch(fetchCapitoli("COMB"));
    } else {
      dispatch(setSystem("default"));
    }
  }, [dispatch, location.pathname]);

  // Gestisce il download da Git
  const [isDownloadFromGit, setDownloadFromGit] = useState(false);
  useEffect(() => {
    if (!isDownloadFromGit && location.pathname !== "/") {
      console.log(
        ">>>>>>>>>>>>>>>     chiamata alla DOWNLOAD DA GIT <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ",
        system
      );
      dispatch(downloadFromGit());
      setDownloadFromGit(true);
    }
  }, [dispatch, isDownloadFromGit, location.pathname, system]);

  //gestisce la visualizzazione dei componenti nella pagina
  const [showAddCapitoloForm, setShowAddCapitoloForm] = useState({
    id: null,
    operazione: null,
  });

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
    dispatch(fetchCapitoli());
    setShowAddCapitoloForm({ id: null, operazione: null });
  };

  return (
    <>
      <Sidebar />
      <div className="ml-60 h-screen flex flex-col">
        <div className="ml-0 p-4">
          {/* Sezione dell'indice con scorrimento */}
          <div className="sticky top-0 z-10 mb-4 p-0 bg-white text-left border-yellow-500 border-b-4 border-l-4">
            <div className="flex items-center justify-between bg-gradient-to-r from-yellow-500 to-white p-2">
              <h1 className="text-left text-3xl font-bold">
                {`INDICE dei Capitoli ${system}`}
              </h1>
              <div className="flex gap-1">
                <button
                  title="Esporta Dati"
                  className="bg-transparent text-white px-2 py-1 rounded-2xl hover:bg-yellow-600"
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
                  className="bg-transparent text-white px-2 py-1 rounded-2xl hover:bg-yellow-600"
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
              style={{ maxHeight: "250px", overflowY: "auto" }}
              className="mb-4"
            >
              <IndiceCapitoliParagrafi capitoli={dataCapitoli} />
            </div>
          </div>

          {/* Sezione della lista dei capitoli e paragrafi */}
          <div className="flex-1 overflow-y-auto bg-white border-yellow-500 border-b-4 border-l-4">
            <div className="sticky top-0 z-10 mb-4 p-2 bg-gradient-to-r from-yellow-500 to-white flex items-center justify-between">
              <h1 className="text-left text-3xl font-bold">
                Lista dei Capitoli
              </h1>
              <div className="flex gap-2">
                <button
                  title="Aggiungi Capitolo"
                  className="bg-transparent text-white px-2 py-1 rounded-2xl hover:bg-yellow-600"
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
                  className="bg-transparent text-white px-2 py-1 rounded-2xl hover:bg-yellow-600"
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
                  className="bg-transparent text-white px-2 py-1 rounded-2xl hover:bg-yellow-600"
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
              style={{ maxHeight: "calc(100vh - 250px)" }}
              className="overflow-y-auto"
            >
              <ListaCapitoliParagrafi capitoli={dataCapitoli} />
            </div>

            {showAddCapitoloForm.operazione === "addChapter" && (
              <CapitoloParagrafoForm
                capitolo={null}
                operazione={showAddCapitoloForm.operazione}
                onSave={handleSave}
                onCancel={handleCancelAddCapitolo}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
