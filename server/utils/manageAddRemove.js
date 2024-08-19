function reorderChapters(queryDb, startChapterIndex) {
  queryDb.slice(startChapterIndex).forEach((chapter, index) => {
    // Riordina gli ID dei capitoli
    chapter.id = (startChapterIndex + index + 1).toString();

    // Riordina gli ID dei paragrafi nel capitolo
    reorderParagraphs(chapter, 0);
  });
}

function removeChapter(queryDb, id) {
  const chapterIndex = queryDb.findIndex((chapter) => chapter.id === id);
  if (chapterIndex !== -1) {
    queryDb.splice(chapterIndex, 1);
    reorderChapters(queryDb, chapterIndex);
    return true;
  }
  return false;
}

function reorderParagraphs(chapter) {
  chapter.paragrafi.forEach((paragrafo, index) => {
    // Riordina gli ID dei paragrafi come "id" del capitolo + "." + (index + 1)
    paragrafo.id = `${chapter.id}.${index + 1}`;
  });
}

function removeParagraph(queryDb, id) {
  for (let chapter of queryDb) {
    const paragraphIndex = chapter.paragrafi.findIndex(
      (paragraph) => paragraph.id === id
    );
    if (paragraphIndex !== -1) {
      chapter.paragrafi.splice(paragraphIndex, 1);
      reorderParagraphs(chapter);
      return true;
    }
  }
  return false;
}

function insertChapter(queryDb, query) {
  query.id = (queryDb.length + 1).toString();
  query.paragrafi[0].id = `${queryDb.length + 1}.1`;
  queryDb.push(query);
}

// Funzione per inserire un paragrafo
function insertParagraph(queryDb, query) {
  const capitolo = queryDb.find((c) => c.id === query.id);
  query.paragrafi[0].id = `${query.id}.${capitolo.paragrafi.length + 1}`;
  capitolo.paragrafi.push(query.paragrafi[0]);
}

module.exports = {
  removeChapter,
  removeParagraph,
  insertChapter,
  insertParagraph,
};
