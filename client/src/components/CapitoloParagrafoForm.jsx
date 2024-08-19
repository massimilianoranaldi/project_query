import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addParagrafo,
  modificaCapitolo,
  modificaParagrafo,
} from "../redux/capitoliSlice"; // Assicurati di avere il percorso corretto

import paragrafoIcon5 from "../assets/salva.png";
import paragrafoIcon6 from "../assets/annulla.png";

const CapitoloParagrafoForm = ({
  capitolo,
  onSave,
  onCancel,
  operazione,
  paragrafo,
}) => {
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({
    nomeCapitolo: "",
    nomeParagrafo: "",
    codicePlSql: "",
    outPutSql: "",
  });

  // Usa useEffect per aggiornare i valori del form quando cambiano capitolo, paragrafo o operazione
  useEffect(() => {
    if (operazione === "modChapter") {
      setFormValues({
        nomeCapitolo: capitolo.nomeCapitolo || "",
        nomeParagrafo: "",
        codicePlSql: "",
        outPutSql: "",
      });
    } else if (operazione === "modPar") {
      setFormValues({
        nomeCapitolo: capitolo.nomeCapitolo || "",
        nomeParagrafo: paragrafo.nomeParagrafo || "",
        codicePlSql: paragrafo.codicePlSql || "",
        outPutSql: paragrafo.outPutSql || "",
      });
    } else if (operazione === "addChapter") {
      setFormValues({
        nomeCapitolo: "Inserisci il nome del Capitolo",
        nomeParagrafo: "Inserisci il nome del Paragrafo",
        codicePlSql: "Scrivi qui il codice PLSQL",
        outPutSql: "Incolla qui la tua tabella",
      });
    } else if (operazione === "addParagraph") {
      setFormValues({
        nomeCapitolo: capitolo.nomeCapitolo || "",
        nomeParagrafo: "Inserisci il nome del Paragrafo",
        codicePlSql: "Scrivi qui il codice PLSQL",
        outPutSql: "Incolla qui la tua tabella",
      });
    }
  }, [capitolo, paragrafo, operazione]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    let payload = {};
    let paragrafoId;
    switch (operazione) {
      case "addChapter":
        paragrafoId = new Date().getTime().toString(); // Genera un ID univoco
        payload = {
          id: capitolo ? capitolo.id : -1,
          nomeCapitolo: formValues.nomeCapitolo,
          paragrafi: [
            {
              id: paragrafoId,
              nomeParagrafo: formValues.nomeParagrafo,
              codicePlSql: formValues.codicePlSql,
              outPutSql: formValues.outPutSql,
            },
          ],
        };
        await dispatch(addParagrafo(payload));
        break;
      case "addParagraph":
        paragrafoId = new Date().getTime().toString();
        payload = {
          id: capitolo.id,
          paragrafi: [
            {
              id: paragrafoId,
              nomeParagrafo: formValues.nomeParagrafo,
              codicePlSql: formValues.codicePlSql,
              outPutSql: formValues.outPutSql,
            },
          ],
        };
        await dispatch(addParagrafo(payload));
        break;
      case "modChapter":
        payload = {
          id: capitolo.id,
          nuovoNomeCapitolo: formValues.nomeCapitolo,
        };
        await dispatch(modificaCapitolo(payload));
        break;

      case "modPar":
        payload = {
          id: paragrafo.id,
          nuovoNomeParagrafo: formValues.nomeParagrafo,
          nuovoCodicePlSql: formValues.codicePlSql,
          nuovoOutPutSql: formValues.outPutSql,
        };
        await dispatch(modificaParagrafo(payload));
        break;

      default:
        console.error("Operazione non riconosciuta:", operazione);
        return;
    }

    onSave(payload);
    setFormValues({
      nomeCapitolo: "",
      nomeParagrafo: "",
      codicePlSql: "",
      outPutSql: "",
    });
  };

  return (
    <div className="mb-4 ml-10 mr-10 mt-4 pl-4  border-b-4 border-l-4 border-black bg-gray-300 p-4 rounded">
      {operazione === "modChapter" ? (
        <div className="mb-2">
          <label
            className="block text-sm font-bold mb-1"
            htmlFor="nomeCapitolo"
          >
            {`Nome Capitolo ${capitolo.id}`}
          </label>
          <input
            type="text"
            id="nomeCapitolo"
            name="nomeCapitolo"
            value={formValues.nomeCapitolo}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded bg-white"
          />
        </div>
      ) : (
        <>
          <div className="mb-2">
            <label
              className="block text-sm font-bold mb-1"
              htmlFor="nomeCapitolo"
            >
              {operazione === "modPar" || operazione === "modChapter"
                ? `Nome Capitolo ${capitolo.id}`
                : "Nome Capitolo"}
            </label>
            <input
              type="text"
              id="nomeCapitolo"
              name="nomeCapitolo"
              value={formValues.nomeCapitolo}
              readOnly={operazione !== "addChapter"}
              onChange={
                operazione === "addChapter" ? handleInputChange : undefined
              }
              className={`w-full px-3 py-2 border rounded ${
                operazione === "addChapter"
                  ? "bg-white"
                  : "bg-gray-200 cursor-not-allowed"
              }`}
            />
          </div>
          <div className="mb-2">
            <label
              className="block text-sm font-bold mb-1"
              htmlFor="nomeParagrafo"
            >
              {operazione === "modPar" || operazione === "modChapter"
                ? `Nome Paragrafo ${paragrafo.id}`
                : "Nome Paragrafo"}
            </label>
            <input
              type="text"
              id="nomeParagrafo"
              name="nomeParagrafo"
              value={formValues.nomeParagrafo}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded bg-white"
            />
          </div>
          <div className="mb-2">
            <label
              className="block text-sm font-bold mb-1"
              htmlFor="codicePlSql"
            >
              {operazione === "modPar" || operazione === "modChapter"
                ? `Codice PL/SQL ${paragrafo.id}`
                : "Codice PL/SQL"}
            </label>
            <textarea
              id="codicePlSql"
              name="codicePlSql"
              value={formValues.codicePlSql}
              onChange={handleInputChange}
              rows="10"
              className="w-full h-10 px-3 py-2 border rounded bg-white"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-bold mb-1" htmlFor="outPutSql">
              {operazione === "modPar" || operazione === "modChapter"
                ? `Output SQL ${paragrafo.id}`
                : "Output SQL"}
            </label>
            <textarea
              id="outPutSql"
              name="outPutSql"
              value={formValues.outPutSql}
              onChange={handleInputChange}
              rows="10"
              className="w-full h-10 px-3 py-2 border rounded bg-white"
            />
          </div>
        </>
      )}
      <div className="flex justify-end space-x-2">
        <button
          className="text-white px-3 py-1 rounded hover:bg-red-700"
          onClick={onCancel}
        >
          <img src={paragrafoIcon6} alt="Annulla" className="w-5 h-5" />
        </button>
        <button
          className="text-white px-3 py-1 rounded hover:bg-green-700"
          onClick={handleSave}
        >
          <img src={paragrafoIcon5} alt="Salva" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default CapitoloParagrafoForm;
