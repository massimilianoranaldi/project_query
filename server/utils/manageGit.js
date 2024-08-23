require("dotenv").config(); // Carica le variabili di ambiente dal file .env
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { getTimestamp } = require("./manageAddRemove");

// Ottieni le variabili di ambiente
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const BRANCH = process.env.BRANCH || "main"; // Nome del branch
const BASE_LOCAL_PATH = process.env.LOCAL_FILE_PATH;
const BASE_REMOTE_PATH = process.env.REMOTE_FILE_PATH;

// Funzione per ottenere i percorsi dei file in base al sistema
function getFilePaths(system) {
  // Definisci i nomi dei file per i diversi sistemi
  const FILE_NAMES = {
    ESB: process.env.FILE_NAME_ESB,
    COM: process.env.FILE_NAME_COM,
    CRM: process.env.FILE_NAME_CRM,
    COMB: process.env.FILE_NAME_COMB,
  };

  const fileName = FILE_NAMES[system] || FILE_NAMES["default"];

  if (!fileName) {
    throw new Error(`File name for system ${system} not found.`);
  }

  return {
    LOCAL_FILE_PATH: path.join(__dirname, BASE_LOCAL_PATH, fileName),
    REMOTE_FILE_PATH: `${BASE_REMOTE_PATH}/${fileName}`,
  };
}

//INVIA IL FILE DA LOCALE A REMOTO ==> SU GIT
//---------------------------------------------------------------
async function uploadFileToGitHub(system) {
  try {
    const { LOCAL_FILE_PATH, REMOTE_FILE_PATH } = getFilePaths(system);
    console.log(getTimestamp(), "uploadFileToGitHub parametro sistema", system);

    // Leggi il contenuto del file locale
    const fileContent = fs.readFileSync(LOCAL_FILE_PATH, "utf-8");
    //console.log(`Local file content:\n${fileContent}`);

    // Codifica il contenuto del file in Base64
    const encodedContent = Buffer.from(fileContent).toString("base64");

    // Ottieni l'ultimo commit per il file se esiste
    const { data: remoteFileData } = await axios
      .get(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REMOTE_FILE_PATH}?ref=${BRANCH}`,
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      )
      .catch(() => ({ data: {} })); // Se il file non esiste, ritorna un oggetto vuoto

    const latestSha = remoteFileData.sha;
    const remoteFileContent = remoteFileData.content
      ? Buffer.from(remoteFileData.content, "base64").toString("utf-8")
      : null;

    console.log("Latest SHA:", latestSha);

    // Confronta i contenuti locale e remoto
    if (remoteFileContent === fileContent) {
      console.log("$$## > File non caricato perché identico.");
      return;
    }

    // Prepara la richiesta per aggiornare il file se i contenuti sono diversi
    const response = await axios.put(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REMOTE_FILE_PATH}`,
      {
        message: "Add or update file",
        content: encodedContent,
        ...(latestSha && { sha: latestSha }), // Aggiungi solo se `latestSha` è presente
        branch: BRANCH,
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    console.log("Status Code:", response.status);
    console.log("$$## > File caricato su GIT.");
  } catch (error) {
    console.error(
      "Error uploading file to GitHub:",
      error.response ? error.response.data : error.message
    );
  }
}

// RECUPERA IL FILE DA REMOTO A LOCALE ==> SU GIT
//---------------------------------------------------------------
async function downloadFileFromGitHub(system) {
  try {
    const { LOCAL_FILE_PATH, REMOTE_FILE_PATH } = getFilePaths(system);
    console.log(
      getTimestamp(),
      "downloadFileFromGitHub parametro sistema",
      system
    );

    // Leggi il contenuto del file locale se esiste
    let localFileContent = "";
    if (fs.existsSync(LOCAL_FILE_PATH)) {
      localFileContent = fs.readFileSync(LOCAL_FILE_PATH, "utf-8");
    }

    // Ottieni il contenuto del file dal repository
    const response = await axios.get(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REMOTE_FILE_PATH}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    // Decodifica il contenuto del file da Base64
    const remoteFileContent = Buffer.from(
      response.data.content,
      "base64"
    ).toString("utf-8");

    // Confronta i contenuti locale e remoto
    if (localFileContent === remoteFileContent) {
      console.log("$$## > File non scaricato perché identico.");
      return;
    }

    // Scrivi il contenuto del file come JSON sul filesystem locale
    fs.writeFileSync(LOCAL_FILE_PATH, remoteFileContent, "utf-8");
    console.log(`File downloaded and saved to ${LOCAL_FILE_PATH}`);
  } catch (error) {
    console.error(
      "Error downloading file from GitHub:",
      error.response ? error.response.data : error.message
    );
  }
}

module.exports = {
  uploadFileToGitHub,
  downloadFileFromGitHub,
};
