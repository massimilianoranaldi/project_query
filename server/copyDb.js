const fs = require("fs");
const path = require("path");

// Percorso al file JSON nella directory assets
const dbPath = path.join(__dirname, "assets", "queryDb.json");

// Percorso alla cartella dove si trova il file di backup
const backupPath = path.join(__dirname, "backup", "queryDb.json");

// Verifica se il file `queryDb.json` esiste nella cartella assets
if (!fs.existsSync(dbPath)) {
  // Se non esiste, copialo dalla cartella di backup
  fs.copyFileSync(backupPath, dbPath);
  console.log("assets/queryDb.json non trovato, ripristinato da backup.");
} else {
  console.log("assets/queryDb.json già presente, nessuna azione necessaria.");
}
