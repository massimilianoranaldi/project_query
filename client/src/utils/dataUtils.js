import { importCapitoli } from "../redux/capitoliSlice";

// Funzione per importare i dati
export const handleImportData = async (dispatch) => {
  try {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";

    fileInput.onchange = async () => {
      const file = fileInput.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = async () => {
          try {
            const jsonString = reader.result;
            const jsonData = JSON.parse(jsonString);

            await dispatch(importCapitoli(jsonData));
            alert("Dati importati con successo!");
          } catch (error) {
            console.error("Errore durante l'importazione dei dati:", error);
            alert("Errore durante l'importazione dei dati.");
          }
        };

        reader.readAsText(file);
      }
    };

    fileInput.click();
  } catch (error) {
    console.error("Errore durante l'importazione dei dati:", error);
  }
};

// Funzione per esportare i dati
export const handleExportData = async (dataCapitoli, system) => {
  try {
    // Serializza i dati in formato JSON
    const jsonString = JSON.stringify(dataCapitoli, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    // Usa la API File System Access per salvare il file
    const fileHandle = await window.showSaveFilePicker({
      //suggestedName: "queryDb.json",
      suggestedName: `queryDb${system}.json`,
      types: [
        {
          description: "JSON file",
          accept: { "application/json": [".json"] },
        },
      ],
    });

    // Crea un flusso scrivibile e scrivi il contenuto
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();

    alert("File salvato con successo!");
  } catch (error) {
    console.error("Errore durante l'esportazione dei dati:", error);
    alert("Errore durante il salvataggio del file.");
  }
};

export function extractOriginalId(concatenatedId) {
  // Dividi l'ID concatenato sul trattino
  const parts = concatenatedId.split("-");

  // Se l'ID è stato correttamente concatenato, l'originale è l'ultima parte
  return parts.length > 1 ? parts.slice(1).join("-") : concatenatedId;
}
