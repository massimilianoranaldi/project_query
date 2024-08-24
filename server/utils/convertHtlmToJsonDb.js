//node convertHtlmToJsonDb.js

const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Funzione per convertire una tabella HTML in CSV
function tableToCsv(table) {
  const rows = table.querySelectorAll("tr");
  return Array.from(rows)
    .map((row) => {
      const cells = row.querySelectorAll("th, td");
      return Array.from(cells)
        .map((cell) => cell.textContent.trim())
        .join(";");
    })
    .join("\n");
}

// Funzione per creare l'array JSON
function createJsonFromHtml(htmlContent) {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const chapters = document.querySelectorAll(".chapter-container");
  const data = Array.from(chapters).map((chapter, chapterIndex) => {
    const chapterId = (chapterIndex + 1).toString();
    const chapterTitle = chapter
      .querySelector(".chapter-title")
      .textContent.trim();

    const sections = chapter.querySelectorAll(".section");
    const paragrafi = Array.from(sections).map((section, sectionIndex) => {
      const sectionId = `${chapterId}.${sectionIndex + 1}`;
      const sectionTitle = section
        .querySelector(".section-title")
        .textContent.trim();
      const sqlCode = section.querySelector(".language-sql").textContent.trim();
      const outputTable = section.querySelector("table");

      let outputSql = "";
      if (outputTable) {
        outputSql = tableToCsv(outputTable);
      }

      return {
        id: sectionId,
        nomeParagrafo: sectionTitle,
        codicePlSql: sqlCode,
        outPutSql: outputSql,
      };
    });

    return {
      id: chapterId,
      nomeCapitolo: chapterTitle,
      paragrafi: paragrafi,
    };
  });

  return JSON.stringify(data, null, 4);
}

// Leggi il file HTML e genera il JSON
fs.readFile("prova2.html", "utf-8", (err, htmlContent) => {
  if (err) {
    console.error("Errore nel caricamento del file HTML:", err);
    return;
  }

  const jsonResult = createJsonFromHtml(htmlContent);
  console.log(jsonResult);

  // Salva il JSON in un file
  fs.writeFileSync("output.json", jsonResult);
});
