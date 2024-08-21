import React, { useState } from "react";
import ParagrafoForm from "./CapitoloParagrafoForm"; // Assicurati di avere il percorso corretto
import { useDispatch } from "react-redux";
import { eliminaParagrafo } from "../redux/capitoliSlice";
import paragrafoIcon from "../assets/aggiungi_paragrafo.png";
import paragrafoIcon2 from "../assets/elimina_paragrafo.png";
import paragrafoIcon3 from "../assets/elimina_capitolo.png";
import paragrafoIcon7 from "../assets/modifica_paragrafo.png";
import paragrafoIcon8 from "../assets/modifica_capitolo.png";
import paragrafoIcon9 from "../assets/copia_plsql.png";
import paragrafoIcon10 from "../assets/torna_su.png";

const ListaCapitoliParagrafi = ({ capitoli }) => {
  const [visibleForm, setVisibleForm] = useState({
    id: null,
    operazione: null,
  });
  const dispatch = useDispatch(); //NEW

  const renderTableFromCSV = (csv) => {
    if (!csv) return null;

    // Funzione per gestire la separazione multipla
    const splitRow = (row) => {
      // Divide usando \t e ; come separatori
      return row.split(/[\t;]/);
    };

    const rows = csv.split("\n").map(splitRow);

    return (
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full text-xs mt-4">
          <thead>
            <tr>
              {rows[0].map((cell, index) => (
                <th
                  key={index}
                  className="border border-black px-1 py-1 whitespace-nowrap bg-yellow-100"
                >
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-black px-1 py-1 whitespace-nowrap"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  //SAVE-CANCEL
  const handleSave = (capitoloId, formValues) => {
    // Implement the save logic here
    console.log("Saving:", formValues, "for capitolo:", capitoloId);
    // After saving, you might want to reset the form and hide it
    setVisibleForm({ id: null, operazione: null });
  };
  const handleCancel = () => {
    setVisibleForm({ id: null, operazione: null });
  };

  //ADD-DELETE-MODIFY
  const handleAddParagraph = (capitoloId) => {
    setVisibleForm({ id: capitoloId, operazione: "addParagraph" });
  };
  const handleDeleteParagraph = (objectId, objectName) => {
    const confirmDelete = window.confirm(
      `Sei sicuro di voler eliminare oggetto "${objectName}" (ID: ${objectId})?`
    );

    if (confirmDelete) {
      dispatch(eliminaParagrafo(objectId));
    }
  };

  //-------------------
  const handleModifyChapter = (capitoloId) => {
    setVisibleForm({ id: capitoloId, operazione: "modChapter" });
  };

  const handleModifyPar = (paragrafoId) => {
    setVisibleForm({ id: paragrafoId, operazione: "modPar" });
  };

  //-----------------

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert("Testo copiato nella clipboard!");
      },
      (err) => {
        console.error("Errore durante la copia: ", err);
      }
    );
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="flex flex-col p-4 h-full">
      {capitoli.map((capitolo) => (
        <div id={capitolo.id} key={capitolo.id} className="mb-6">
          <div className="flex items-center justify-end mb-0  bg-gradient-to-r from-white to-yellow-500 ">
            <div className="font-bold text-xl justify-end">
              {`Cap ${capitolo.id} - ${capitolo.nomeCapitolo}`}
            </div>
            <div className="relative ml-auto justify-end">
              <button
                title="Aggiungi Paragrafo"
                className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-yellow-600"
                onClick={() => handleAddParagraph(capitolo.id)}
              >
                <img
                  src={paragrafoIcon}
                  alt="Aggiungi Paragrafo"
                  className="w-5 h-5" // Imposta dimensioni appropriate per l'icona
                />
              </button>
              <button
                title="Elimina Capitolo"
                className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-yellow-600"
                onClick={() =>
                  handleDeleteParagraph(capitolo.id, capitolo.nomeCapitolo)
                }
              >
                <img
                  src={paragrafoIcon3}
                  alt="Elimina Capitolo"
                  className="w-5 h-5" // Imposta dimensioni appropriate per l'icona
                />
              </button>

              <button
                title="Modifica Capitolo"
                className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-yellow-600"
              >
                <img
                  src={paragrafoIcon8}
                  alt="Elimina Capitolo"
                  className="w-5 h-5" // Imposta dimensioni appropriate per l'icona
                  onClick={() => handleModifyChapter(capitolo.id)}
                />
              </button>
            </div>
          </div>

          {visibleForm.id === capitolo.id &&
            visibleForm.operazione !== "modPar" &&
            visibleForm.operazione !== "addChapter" && (
              <ParagrafoForm
                capitolo={capitolo}
                operazione={visibleForm.operazione}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}

          {capitolo.paragrafi.map((paragrafo) => (
            <div
              id={paragrafo.id}
              key={paragrafo.id}
              className="mb-4 p-4  border-yellow-500 border-b-4 border-l-4"
            >
              <div className="flex items-center justify-between font-semibold bg-gradient-to-r from-white to-yellow-500">
                <span>{`Par ${paragrafo.id} - ${paragrafo.nomeParagrafo}`}</span>

                <div className="relative ml-auto ">
                  <button
                    title="Torna Su"
                    className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-yellow-600"
                    onClick={scrollToTop}
                  >
                    <img
                      src={paragrafoIcon10}
                      alt="Torna Su"
                      className="w-5 h-5"
                    />
                  </button>

                  <button
                    title="Copia Codice SQL"
                    className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-yellow-600"
                    onClick={() => handleCopy(paragrafo.codicePlSql)}
                  >
                    <img
                      src={paragrafoIcon9}
                      alt="Copia Codice SQL"
                      className="w-5 h-5"
                    />
                  </button>

                  <button
                    title="Elimina Paragrafo"
                    className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-yellow-600"
                    onClick={() =>
                      handleDeleteParagraph(
                        paragrafo.id,
                        paragrafo.nomeParagrafo
                      )
                    }
                  >
                    <img
                      src={paragrafoIcon2}
                      alt="Elimina Paragrafo"
                      className="w-5 h-5" // Imposta dimensioni appropriate per l'icona
                    />
                  </button>

                  <button
                    title="Modifica Paragrafo"
                    className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-yellow-600"
                  >
                    <img
                      src={paragrafoIcon7}
                      alt="Modifica Paragrafo"
                      className="w-5 h-5" // Imposta dimensioni appropriate per l'icona
                      onClick={() => handleModifyPar(paragrafo.id)}
                    />
                  </button>
                </div>
              </div>
              {visibleForm.id === paragrafo.id &&
                visibleForm.operazione === "modPar" && (
                  <ParagrafoForm
                    capitolo={capitolo}
                    paragrafo={paragrafo}
                    operazione={visibleForm.operazione}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                )}
              <div className="overflow-x-auto bg-gray-200 p-2">
                <pre
                  className="p-2 rounded whitespace-pre"
                  style={{ fontSize: "9px" }}
                >
                  <code>{paragrafo.codicePlSql}</code>
                </pre>
              </div>
              <div>{renderTableFromCSV(paragrafo.outPutSql)}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ListaCapitoliParagrafi;
