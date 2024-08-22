require("dotenv").config(); // Carica le variabili di ambiente dal file .env
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Ottieni le variabili di ambiente
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const BRANCH = process.env.BRANCH || "main"; // Nome del branch
const LOCAL_FILE_PATH = path.join(__dirname, process.env.LOCAL_FILE_PATH);
const REMOTE_FILE_PATH = process.env.REMOTE_FILE_PATH;

async function uploadFileToGitHub() {
  try {
    // Leggi il contenuto del file locale
    const fileContent = fs.readFileSync(LOCAL_FILE_PATH, "utf-8");
    console.log(`Local file content:\n${fileContent}`);

    // Codifica il contenuto del file in Base64
    const encodedContent = Buffer.from(fileContent).toString("base64");

    // Ottieni l'ultimo commit per il file se esiste
    const { data: { sha: latestSha } = {} } = await axios
      .get(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REMOTE_FILE_PATH}?ref=${BRANCH}`,
        {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      )
      .catch(() => ({})); // Se il file non esiste, il catch evita di lanciare un errore

    // Prepara la richiesta per aggiornare il file
    const response = await axios.put(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${REMOTE_FILE_PATH}`,
      {
        message: "Add or update queryDb.json file",
        content: encodedContent,
        sha: latestSha, // Solo se il file esiste già
        branch: BRANCH,
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    console.log("File uploaded successfully.");
    console.log(response.data);
  } catch (error) {
    console.error(
      "Error uploading file to GitHub:",
      error.response ? error.response.data : error.message
    );
  }
}

async function downloadFileFromGitHub() {
  try {
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
    const fileContent = Buffer.from(response.data.content, "base64").toString(
      "utf-8"
    );

    // Scrivi il contenuto del file come JSON sul filesystem locale
    fs.writeFileSync(LOCAL_FILE_PATH, fileContent, "utf-8");
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
