import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const DataTable = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => setTableData(data));
  }, []);

  const handleProcessRowUpdate = (newRow, oldRow) => {
    // Gestisci l'aggiornamento dei dati
    const updatedData = tableData.map((row) =>
      row.id === oldRow.id ? { ...row, ...newRow } : row
    );
    setTableData(updatedData);

    // Se c'è stato un aggiornamento lato server, qui potresti inviare una richiesta al server

    return newRow; // Restituisci la nuova riga
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "title", headerName: "TITOLO", width: 300, editable: true }, // Titolo editabile
    { field: "body", headerName: "TESTO", width: 600, editable: true }, // Testo editabile
  ];

  return (
    <div style={{ height: 700, width: "100%" }}>
      <DataGrid
        rows={tableData}
        columns={columns}
        pageSize={12}
        processRowUpdate={handleProcessRowUpdate} // Gestisce l'aggiornamento dei dati
        experimentalFeatures={{ newEditingApi: true }} // Abilita la nuova API di editing
      />
    </div>
  );
};

export default DataTable;
