import React, { useRef } from "react";
import ParagrafoForm from "./CapitoloParagrafoForm";
import { useDispatch } from "react-redux";
import { eliminaParagrafo } from "../redux/capitoliSlice";
import paragrafoIcon from "../assets/aggiungi_paragrafo.png";
import paragrafoIcon2 from "../assets/elimina_paragrafo.png";
import paragrafoIcon3 from "../assets/elimina_capitolo.png";
import paragrafoIcon7 from "../assets/modifica_paragrafo.png";
import paragrafoIcon8 from "../assets/modifica_capitolo.png";
import paragrafoIcon9 from "../assets/copia_plsql.png";
import paragrafoIcon10 from "../assets/torna_su.png";

import HomeIcon from "@mui/icons-material/AddHomeTwoTone";
const ListaCapitoliParagrafi = ({ capitoli }) => {
  const [visibleForm, setVisibleForm] = React.useState({
    id: null,
    operazione: null,
  });
  const dispatch = useDispatch();
  const heightLimitTable = 300; // Altezza limite per la tabella in pixel
  const heightLimitCode = 300; // Altezza limite per il codice in pixel

  // Create refs for each capitolo
  const capitoloRefs = useRef({});

  const calculateTableHeight = (rows) => rows.length * 24; // Altezza stimata per ogni riga della tabella

  const calculateCodeHeight = (code) => {
    // Stimiamo che ogni riga del codice abbia una certa altezza
    const lines = code.split("\n");
    return lines.length * 10; // Altezza stimata per ogni riga del codice
  };

  const renderTableFromCSV = (csv) => {
    if (!csv) return null;

    const splitRow = (row) => row.split(/[\t;]/);
    const rows = csv.split("\n").map(splitRow);

    const tableHeight = calculateTableHeight(rows);

    return (
      <div
        className={`overflow-x-auto ${
          tableHeight > heightLimitTable ? "border-r-0 border-white" : ""
        }`}
        style={{ maxHeight: `${heightLimitTable}px`, overflowY: "auto" }}
      >
        <table className="table-auto border-collapse border border-gray-300 w-full text-xs mt-4">
          <thead>
            <tr>
              {rows[0].map((cell, index) => (
                <th
                  key={index}
                  className="border border-black px-1 py-1 whitespace-nowrap bg-blue-100"
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

  const renderCodeBlock = (code) => {
    if (!code) return null;

    const codeHeight = calculateCodeHeight(code);

    return (
      <div
        className={`overflow-x-auto ${
          codeHeight > heightLimitCode ? "border-r-0 border-white" : ""
        }`}
        style={{
          maxHeight: `${heightLimitCode}px`,
          overflowY: "auto",
        }}
      >
        <pre
          className="p-0 rounded whitespace-pre"
          style={{ fontSize: "10px" }}
        >
          <code className="italic text-blue-600">{code}</code>
        </pre>
      </div>
    );
  };

  const handleSave = (capitoloId, formValues) => {
    console.log("Saving:", formValues, "for capitolo:", capitoloId);
    setVisibleForm({ id: null, operazione: null });
  };

  const handleCancel = () => {
    setVisibleForm({ id: null, operazione: null });
  };

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

  const handleModifyChapter = (capitoloId) => {
    setVisibleForm({ id: capitoloId, operazione: "modChapter" });
  };

  const handleModifyPar = (paragrafoId) => {
    setVisibleForm({ id: paragrafoId, operazione: "modPar" });
  };

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

  const scrollToTop = (capitoloId) => {
    if (capitoloRefs.current[capitoloId]) {
      capitoloRefs.current[capitoloId].scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col pl-4 pt-4 pb-4 h-full">
      {capitoli.map((capitolo) => (
        <div
          id={capitolo.id}
          key={capitolo.id}
          className="mb-6"
          ref={(el) => (capitoloRefs.current[capitolo.id] = el)}
        >
          {/* <div className="flex items-center justify-end mb-0 bg-gradient-custom-2"> */}
          <div className="flex items-center justify-end mb-0 bg-gradient-custom-2">
            <div className="font-bold text-l justify-end text-black">
              {`Cap ${capitolo.id} - ${capitolo.nomeCapitolo}`}
            </div>
            <div className="relative ml-auto justify-end">
              <button
                title="Aggiungi Paragrafo"
                className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-customColor3"
                onClick={() => handleAddParagraph(capitolo.id)}
              >
                <img
                  src={paragrafoIcon}
                  alt="Aggiungi Paragrafo"
                  className="w-5 h-5"
                />
              </button>
              <button
                title="Elimina Capitolo"
                className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-customColor3"
                onClick={() =>
                  handleDeleteParagraph(capitolo.id, capitolo.nomeCapitolo)
                }
              >
                <img
                  src={paragrafoIcon3}
                  alt="Elimina Capitolo"
                  className="w-5 h-5"
                />
              </button>

              <button
                title="Modifica Capitolo"
                className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-customColor3"
                onClick={() => handleModifyChapter(capitolo.id)}
              >
                <img
                  src={paragrafoIcon8}
                  alt="Modifica Capitolo"
                  className="w-5 h-5"
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
              className="pb-3 pl-4 pt-4  border-black   "
            >
              {/* <div className="flex items-center justify-between font-semibold bg-gradient-custom-1 text-black"> */}
              <div className="flex items-center justify-between text-black ">
                <span>{`Par ${paragrafo.id} - ${paragrafo.nomeParagrafo}`}</span>

                <div className="relative ml-auto">
                  <button
                    title="Torna Su"
                    className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-customColor3"
                    onClick={() => scrollToTop(capitolo.id)}
                  >
                    <img
                      src={paragrafoIcon10}
                      alt="Torna Su"
                      className="w-5 h-5"
                    />
                  </button>

                  <button
                    title="Copia Codice SQL"
                    className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-customColor3"
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
                    className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-customColor3"
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
                      className="w-5 h-5"
                    />
                  </button>

                  <button
                    title="Modifica Paragrafo"
                    className="bg-transparent text-white px-3 py-1 rounded-2xl hover:bg-customColor3"
                    onClick={() => handleModifyPar(paragrafo.id)}
                  >
                    <img
                      src={paragrafoIcon7}
                      alt="Modifica Paragrafo"
                      className="w-5 h-5"
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

              <div className="overflow-x-auto bg-gray-200 p-0 mt-4">
                {renderCodeBlock(paragrafo.codicePlSql)}
              </div>
              <div className="mt-4">
                {renderTableFromCSV(paragrafo.outPutSql)}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ListaCapitoliParagrafi;
