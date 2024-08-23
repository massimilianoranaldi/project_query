const express = require("express");
const cors = require("cors");
const app = express();
const { readFile, writeFileSync, writeFile, readFileSync } = require("fs");
const {
  removeChapter,
  removeParagraph,
  insertChapter,
  insertParagraph,
  rinominaId,
  getTimestamp,
  getDbJson,
} = require("./utils/manageAddRemove");
const {
  uploadFileToGitHub,
  downloadFileFromGitHub,
} = require("./utils/manageGit");

//app.use(cors()); //permette alle risorse su un server web di essere richieste da un dominio diverso

app.use(
  cors({
    origin: "*", // Permette tutte le origini
    methods: ["GET", "POST", "PUT", "DELETE"], // Metodi permessi
    allowedHeaders: ["Content-Type", "Authorization"], // Intestazioni permessi
  })
);
// Configura body-parser per accettare payloads più grandi
app.use(express.json({ limit: "50mb" })); // Aumenta il limite per JSON
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Aumenta il limite per URL-encoded

app.use(express.json()); //uso questo middleware per gestoire i json

//QUESTA FUNZIONE INSERISCE UN OGGETTO NELL'ARRAY : O UN CAPITOLO O UN PARAGRAFO
//---------------------------------------------------------------------------------------------------------

// http://localhost:3000/inserisciCapitolo
// {
//     "id": "2",
//     "nomeCapitolo": "",
//     "paragrafi": [
//         {
//             "id": "999",
//             "nomeParagrafo": "",
//             "codicePlSql": "select * from dual where pippo='b'",
//             "outPutSql": ""
//         }
//     ]
// }

app.post("/inserisciCapitolo/:system", (req, res) => {
  console.log(
    getTimestamp(),
    "inserisciCapitolo parametro sistema",
    req.params.system
  );
  readFile(getDbJson(req.params.system), (err, data) => {
    if (err) {
      console.error("Errore durante la lettura del file:", err);
      res.status(500).json({
        success: false,
        data: "",
        message: "KO - Errore durante la lettura del file",
      });
    }
    const query = req.body;
    let jsonString = [{}];
    if (data.length == 0) {
      console.log("DEBUG 1");
      query.id = "1";
      query.paragrafi[0].id = "1.1";
      jsonString = JSON.stringify(query, null, 2);
    } else {
      const queryDb = Array.isArray(JSON.parse(data))
        ? JSON.parse(data)
        : [JSON.parse(data)]; //se c'è un solo elemento utilizza una variabile oggetto altrimenti un array

      console.log("---------------------", queryDb);
      const capitolo = queryDb.find((c) => c.id === query.id); // è un riferimento a queryDb quindi se modifico capitolo si modifica anche queryDb

      if (!capitolo) {
        insertChapter(queryDb, query);
      } else {
        insertParagraph(queryDb, query);
      }

      jsonString = JSON.stringify(queryDb, null, 2);
    }
    console.log(">>>>>>>>>>>>>>>>>>>>      ", jsonString);

    writeFile(getDbJson(req.params.system), jsonString, "utf8", (err) => {
      if (err) {
        console.error("Errore durante il salvataggio dei dati su file:", err);
        res
          .status(500)
          .json({ message: "Errore durante il salvataggio dei dati" });
      } else {
        console.log("Dati salvati correttamente su data.json");
      }
    });
    res
      .status(200)
      .json({ success: true, data: JSON.parse(jsonString), message: "OK" });
  });
});

//QUESTA FUNZIONE ELIMINA UN ELEMENTO DALL'ARRAY O CAPITOLO O PARAGRAFO
//---------------------------------------------------------------------------------------------------------
//http://localhost:3000/eliminaCapitoloParagrafo/1
//http://localhost:3000/eliminaCapitoloParagrafo/1.1

app.post("/eliminaCapitoloParagrafo/:system/:id", (req, res) => {
  console.log(
    getTimestamp(),
    "eliminaCapitoloParagrafo parametro sistema",
    req.params.system
  );
  readFile(getDbJson(req.params.system), (err, data) => {
    let message = "";
    if (err) {
      console.error("Errore durante la lettura del file:", err);
      res.status(500).json({
        success: false,
        data: "",
        message: "KO - Errore durante la lettura del file",
      });
      return;
    }

    if (data.length == 0) {
      res.status(200).json({
        success: true,
        data: null,
        message: "OK - Nessun Record da cancellare",
      });
      return;
    }

    const { id } = req.params;

    console.log(">>> ELIMINO L'OGGETTO [", id, "]");

    const queryDb = Array.isArray(JSON.parse(data))
      ? JSON.parse(data)
      : [JSON.parse(data)]; //se c'è un solo elemento utilizza una variabile oggetto altrimenti un array

    console.log(">>> STAMPO IL CONTENUTO DEL FILE : ", queryDb);

    //gestione rimozione capitolo o paragrafo
    if (removeChapter(queryDb, id)) {
      message = "OK - Elemento capitolo cancellato";
    } else if (removeParagraph(queryDb, id)) {
      // Rimuovi paragrafo
      message = "OK - Elemento paragrafo cancellato";
    } else {
      message = "OK - Elemento non trovato";
    }

    jsonString = JSON.stringify(queryDb, null, 2);

    console.log(">>> STAMPO IL CONTENUTO DELL'ARRAY : ", jsonString);

    writeFile(getDbJson(req.params.system), jsonString, "utf8", (err) => {
      if (err) {
        console.error("Errore durante il salvataggio dei dati su file:", err);
        res
          .status(500)
          .json({ message: "Errore durante il salvataggio dei dati" });
      } else {
        console.log("Dati salvati correttamente su data.json");
      }
    });
    res.status(200).json({
      success: true,
      data: JSON.parse(jsonString),
      message: message,
    });
  });
});

//QUESTA FUNZIONE RECUPERA OGGETTI
//---------------------------------------------------------------------------------------------------------
//http://localhost:3000/getCapitoliParagrafi
app.get("/getCapitoliParagrafi/:system", (req, res) => {
  console.log(
    getTimestamp(),
    "getCapitoliParagrafi parametro sistema",
    req.params.system,
    getDbJson(req.params.system)
  );
  readFile(getDbJson(req.params.system), (err, data) => {
    if (err) {
      console.error("Errore durante la lettura del file:", err);
      res.status(500).json({
        success: false,
        data: "",
        message: "KO - Errore durante la lettura del file",
      });
    }

    if (data.length == 0) {
      res.status(200).json({
        success: true,
        data: null,
        message: "OK - Nessun Record da recuperare",
      });
      return;
    }

    res
      .status(200)
      .json({ success: true, data: JSON.parse(data), message: "OK" });
  });
});

//QUESTA FUNZIONE MODIFICA TITOLO CAPITOLO
//---------------------------------------------------------------------------------------------------------
//http://localhost:3000/modificaNomeCapitolo/1

app.post("/modificaNomeCapitolo/:system", (req, res) => {
  console.log(
    getTimestamp(),
    "modificaNomeCapitolo parametro sistema",
    req.params.system
  );
  const { id, nuovoNomeCapitolo } = req.body; // Dati inviati nel corpo della richiesta

  readFile(getDbJson(req.params.system), (err, data) => {
    if (err) {
      console.error("Errore durante la lettura del file:", err);
      return res.status(500).json({
        success: false,
        message: "Errore durante la lettura del file",
      });
    }

    let queryDb;
    try {
      queryDb = Array.isArray(JSON.parse(data))
        ? JSON.parse(data)
        : [JSON.parse(data)];
    } catch (parseError) {
      console.error("Errore durante il parsing del file:", parseError);
      return res.status(500).json({
        success: false,
        message: "Errore durante il parsing del file",
      });
    }

    // Trova il capitolo da modificare
    const capitolo = queryDb.find((c) => c.id === id);

    if (!capitolo) {
      return res.status(404).json({
        success: false,
        message: "Capitolo non trovato",
      });
    }

    // Aggiorna il nome del capitolo
    capitolo.nomeCapitolo = nuovoNomeCapitolo;

    const jsonString = JSON.stringify(queryDb, null, 2);

    writeFile(getDbJson(req.params.system), jsonString, "utf8", (err) => {
      if (err) {
        console.error("Errore durante il salvataggio dei dati su file:", err);
        return res.status(500).json({
          success: false,
          message: "Errore durante il salvataggio dei dati",
        });
      }

      res.status(200).json({
        success: true,
        data: JSON.parse(jsonString),
        message: "Nome del capitolo aggiornato con successo",
      });
    });
  });
});

// MODIFICA I CAMPI DEL PARAGRAFO
app.post("/modificaParagrafo/:system", (req, res) => {
  console.log(
    getTimestamp(),
    "modificaParagrafo parametro sistema",
    req.params.system
  );
  const { id, nuovoNomeParagrafo, nuovoCodicePlSql, nuovoOutPutSql } = req.body;

  if (
    !id ||
    (nuovoNomeParagrafo === undefined &&
      nuovoCodicePlSql === undefined &&
      nuovoOutPutSql === undefined)
  ) {
    return res.status(400).json({
      success: false,
      message: "ID e almeno un attributo da modificare sono richiesti.",
    });
  }

  readFile(getDbJson(req.params.system), (err, data) => {
    if (err) {
      console.error("Errore durante la lettura del file:", err);
      return res.status(500).json({
        success: false,
        message: "Errore durante la lettura del file",
      });
    }

    let queryDb;
    try {
      queryDb = Array.isArray(JSON.parse(data))
        ? JSON.parse(data)
        : [JSON.parse(data)];
    } catch (parseError) {
      console.error("Errore durante il parsing del file:", parseError);
      return res.status(500).json({
        success: false,
        message: "Errore durante il parsing del file",
      });
    }

    // Trova il capitolo che contiene il paragrafo da modificare
    const capitolo = queryDb.find((c) => c.paragrafi.some((p) => p.id === id));

    if (!capitolo) {
      return res
        .status(404)
        .json({ success: false, message: "Paragrafo non trovato" });
    }

    // Trova il paragrafo e aggiorna i suoi attributi
    const paragrafo = capitolo.paragrafi.find((p) => p.id === id);
    if (nuovoNomeParagrafo !== undefined)
      paragrafo.nomeParagrafo = nuovoNomeParagrafo;
    if (nuovoCodicePlSql !== undefined)
      paragrafo.codicePlSql = nuovoCodicePlSql;
    if (nuovoOutPutSql !== undefined) paragrafo.outPutSql = nuovoOutPutSql;

    const jsonString = JSON.stringify(queryDb, null, 2);

    writeFile(getDbJson(req.params.system), jsonString, "utf8", (err) => {
      if (err) {
        console.error("Errore durante il salvataggio dei dati su file:", err);
        return res.status(500).json({
          success: false,
          message: "Errore durante il salvataggio dei dati",
        });
      }

      res.status(200).json({
        success: true,
        data: JSON.parse(jsonString),
        message: "Paragrafo aggiornato con successo",
      });
    });
  });
});

//INSERISCE UN INSIEME DI CAPITOLI E PARAGRAFI

app.post("/caricaCapitoli/:system", (req, res) => {
  console.log(
    getTimestamp(),
    "caricaCapitoli parametro sistema",
    req.params.system
  );
  const capitoli = req.body;

  // Rinomina gli ID dei capitoli e paragrafi
  rinominaId(capitoli);

  // Converti i dati in formato JSON
  const jsonString = JSON.stringify(capitoli, null, 2);

  // Sovrascrivi il contenuto del file con i nuovi dati
  writeFile(getDbJson(req.params.system), jsonString, "utf8", (err) => {
    if (err) {
      console.error("Errore durante il salvataggio dei dati su file:", err);
      return res.status(500).json({
        success: false,
        message: "Errore durante il salvataggio dei dati",
      });
    } else {
      console.log("Dati salvati correttamente su file db.json");
      return res.status(200).json({
        success: true,
        data: capitoli,
        message: "Dati caricati e salvati con successo",
      });
    }
  });
});

app.post("/uploadToGit/:system", async (req, res) => {
  try {
    console.log(
      getTimestamp(),
      "uploadToGit parametro sistema",
      req.params.system
    );
    await uploadFileToGitHub(req.params.system);
    res.status(200).send("File uploaded and changes pushed to Git.");
  } catch (error) {
    res.status(500).send("Failed to upload file to Git.");
  }
});

app.post("/downloadFromGit/:system", async (req, res) => {
  try {
    console.log(
      getTimestamp(),
      "downloadFromGit parametro sistema",
      req.params.system
    );
    await downloadFileFromGitHub(req.params.system);
    res.status(200).send("File uploaded and changes pushed to Git.");
  } catch (error) {
    res.status(500).send("Failed to upload file to Git.");
  }
});

app.listen(3000, () => {
  console.log("Server in ascolto sulla porta 3000");
});
