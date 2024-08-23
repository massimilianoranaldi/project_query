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

//---------------------------------------------------------------------------------------------------------
// CONFIGURAZIONE MIDDLEWARE
//---------------------------------------------------------------------------------------------------------
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

//---------------------------------------------------------------------------------------------------------
// CONFIGURAZIONE API
//---------------------------------------------------------------------------------------------------------
//QUESTA FUNZIONE RECUPERA OGGETTI (download da git)
//---------------------------------------------------------------------------------------------------------
//http://localhost:3000/getCapitoliParagrafi
app.get("/getCapitoliParagrafi/:system", async (req, res) => {
  console.log(
    getTimestamp(),
    "getCapitoliParagrafi parametro sistema",
    req.params.system,
    getDbJson(req.params.system)
  );
  try {
    // Scarica il file dal repository GitHub prima di leggerlo
    //await downloadFileFromGitHub(req.params.system);
    //recupero il file dal repository se diverso da quello attuale

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
  } catch (error) {
    console.error("Errore durante il download del file:", error);
    res.status(500).json({
      success: false,
      data: "",
      message: "KO - Errore durante il download del file",
    });
  }
});

//QUESTA FUNZIONE MODIFICA TITOLO CAPITOLO (gestione scrittura su git)
//---------------------------------------------------------------------------------------------------------
//http://localhost:3000/modificaNomeCapitolo/1
app.post("/modificaNomeCapitolo/:system", async (req, res) => {
  console.log(
    getTimestamp(),
    "modificaNomeCapitolo parametro sistema",
    req.params.system
  );

  const { id, nuovoNomeCapitolo } = req.body; // Dati inviati nel corpo della richiesta

  readFile(getDbJson(req.params.system), async (err, data) => {
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

    writeFile(getDbJson(req.params.system), jsonString, "utf8", async (err) => {
      if (err) {
        console.error("Errore durante il salvataggio dei dati su file:", err);
        return res.status(500).json({
          success: false,
          message: "Errore durante il salvataggio dei dati",
        });
      }

      try {
        // Upload del file su GitHub
        await uploadFileToGitHub(req.params.system);
        console.log("File caricato su GitHub con successo");

        res.status(200).json({
          success: true,
          data: JSON.parse(jsonString),
          message:
            "Nome del capitolo aggiornato con successo e file caricato su GitHub",
        });
      } catch (uploadError) {
        console.error(
          "Errore durante l'upload del file su GitHub:",
          uploadError
        );
        res.status(500).json({
          success: false,
          message:
            "Nome del capitolo aggiornato ma errore durante l'upload del file su GitHub",
        });
      }
    });
  });
});

// MODIFICA I CAMPI DEL PARAGRAFO (gestione scrittura su git)
//---------------------------------------------------------------------------------------------------------
app.post("/modificaParagrafo/:system", async (req, res) => {
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

  readFile(getDbJson(req.params.system), async (err, data) => {
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

    writeFile(getDbJson(req.params.system), jsonString, "utf8", async (err) => {
      if (err) {
        console.error("Errore durante il salvataggio dei dati su file:", err);
        return res.status(500).json({
          success: false,
          message: "Errore durante il salvataggio dei dati",
        });
      }

      try {
        // Upload del file su GitHub
        await uploadFileToGitHub(req.params.system);
        console.log("File caricato su GitHub con successo");

        res.status(200).json({
          success: true,
          data: JSON.parse(jsonString),
          message:
            "Paragrafo aggiornato con successo e file caricato su GitHub",
        });
      } catch (uploadError) {
        console.error(
          "Errore durante l'upload del file su GitHub:",
          uploadError
        );
        res.status(500).json({
          success: false,
          message:
            "Paragrafo aggiornato ma errore durante l'upload del file su GitHub",
        });
      }
    });
  });
});

//QUESTA FUNZIONE INSERISCE UN OGGETTO NELL'ARRAY : O UN CAPITOLO O UN PARAGRAFO (gestione scrittura su git)
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
app.post("/inserisciCapitolo/:system", async (req, res) => {
  console.log(
    getTimestamp(),
    "inserisciCapitolo parametro sistema",
    req.params.system
  );

  readFile(getDbJson(req.params.system), async (err, data) => {
    if (err) {
      console.error("Errore durante la lettura del file:", err);
      return res.status(500).json({
        success: false,
        data: "",
        message: "KO - Errore durante la lettura del file",
      });
    }

    const query = req.body;
    let jsonString = [{}];

    if (data.length == 0) {
      query.id = "1";
      query.paragrafi[0].id = "1.1";
      jsonString = JSON.stringify(query, null, 2);
    } else {
      const queryDb = Array.isArray(JSON.parse(data))
        ? JSON.parse(data)
        : [JSON.parse(data)];

      const capitolo = queryDb.find((c) => c.id === query.id);

      if (!capitolo) {
        insertChapter(queryDb, query);
      } else {
        insertParagraph(queryDb, query);
      }

      jsonString = JSON.stringify(queryDb, null, 2);
    }

    writeFile(getDbJson(req.params.system), jsonString, "utf8", async (err) => {
      if (err) {
        console.error("Errore durante il salvataggio dei dati su file:", err);
        return res.status(500).json({
          message: "Errore durante il salvataggio dei dati",
        });
      }

      try {
        // Upload del file su GitHub
        await uploadFileToGitHub(req.params.system);
        console.log("File caricato su GitHub con successo");

        res.status(200).json({
          success: true,
          data: JSON.parse(jsonString),
          message: "Capitolo inserito con successo e file caricato su GitHub",
        });
      } catch (uploadError) {
        console.error(
          "Errore durante l'upload del file su GitHub:",
          uploadError
        );
        res.status(500).json({
          success: false,
          message:
            "Capitolo inserito ma errore durante l'upload del file su GitHub",
        });
      }
    });
  });
});

//QUESTA FUNZIONE ELIMINA UN ELEMENTO DALL'ARRAY O CAPITOLO O PARAGRAFO (gestione scrittura su git)
//---------------------------------------------------------------------------------------------------------
//http://localhost:3000/eliminaCapitoloParagrafo/1
//http://localhost:3000/eliminaCapitoloParagrafo/1.1
app.post("/eliminaCapitoloParagrafo/:system/:id", async (req, res) => {
  console.log(
    getTimestamp(),
    "eliminaCapitoloParagrafo parametro sistema",
    req.params.system
  );

  readFile(getDbJson(req.params.system), async (err, data) => {
    let message = "";
    if (err) {
      console.error("Errore durante la lettura del file:", err);
      return res.status(500).json({
        success: false,
        data: "",
        message: "KO - Errore durante la lettura del file",
      });
    }

    if (data.length == 0) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "OK - Nessun Record da cancellare",
      });
    }

    const { id } = req.params;

    console.log(">>> ELIMINO L'OGGETTO [", id, "]");

    const queryDb = Array.isArray(JSON.parse(data))
      ? JSON.parse(data)
      : [JSON.parse(data)];

    // Gestione rimozione capitolo o paragrafo
    if (removeChapter(queryDb, id)) {
      message = "OK - Elemento capitolo cancellato";
    } else if (removeParagraph(queryDb, id)) {
      message = "OK - Elemento paragrafo cancellato";
    } else {
      message = "OK - Elemento non trovato";
    }

    const jsonString = JSON.stringify(queryDb, null, 2);

    writeFile(getDbJson(req.params.system), jsonString, "utf8", async (err) => {
      if (err) {
        console.error("Errore durante il salvataggio dei dati su file:", err);
        return res
          .status(500)
          .json({ message: "Errore durante il salvataggio dei dati" });
      }

      try {
        // Upload del file su GitHub
        await uploadFileToGitHub(req.params.system);
        console.log("File caricato su GitHub con successo");

        res.status(200).json({
          success: true,
          data: JSON.parse(jsonString),
          message: message + " e file caricato su GitHub",
        });
      } catch (uploadError) {
        console.error(
          "Errore durante l'upload del file su GitHub:",
          uploadError
        );
        res.status(500).json({
          success: false,
          message: message + " ma errore durante l'upload del file su GitHub",
        });
      }
    });
  });
});

//SCRIVE IN UN FILE TUTTI I CAPITOLI PRESENTI DEL queryDB (gestione scrittura su git)
//---------------------------------------------------------------------------------------------------------
app.post("/caricaCapitoli/:system", async (req, res) => {
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
  writeFile(getDbJson(req.params.system), jsonString, "utf8", async (err) => {
    if (err) {
      console.error("Errore durante il salvataggio dei dati su file:", err);
      return res.status(500).json({
        success: false,
        message: "Errore durante il salvataggio dei dati",
      });
    } else {
      console.log("Dati salvati correttamente su file db.json");

      try {
        // Upload del file su GitHub
        await uploadFileToGitHub(req.params.system);
        console.log("File caricato su GitHub con successo");

        return res.status(200).json({
          success: true,
          data: capitoli,
          message:
            "Dati caricati, salvati e file caricato su GitHub con successo",
        });
      } catch (uploadError) {
        console.error(
          "Errore durante l'upload del file su GitHub:",
          uploadError
        );
        return res.status(500).json({
          success: false,
          message:
            "Dati salvati localmente, ma errore durante l'upload del file su GitHub",
        });
      }
    }
  });
});

//UPLOAD TO GIT
//---------------------------------------------------------------------------------------------------------
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
//DOWNLOAD FROM GIT
//---------------------------------------------------------------------------------------------------------
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
