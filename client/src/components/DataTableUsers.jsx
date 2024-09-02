import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import "./styles.css"; // Assicurati di importare il file CSS

const DataTableUsers = () => {
  // Dati della tabella
  const [tableData] = useState([
    // Record esistenti
    {
      id: 1,
      sistema: "ESB",
      ambiente: "PROD",
      host: "test",
      port: 1567,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 2,
      sistema: "ESB",
      ambiente: "PROD",
      host: "test",
      port: 1567,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 3,
      sistema: "ESB",
      ambiente: "PROD",
      host: "test",
      port: 1567,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 4,
      sistema: "ESB",
      ambiente: "PROD",
      host: "test",
      port: 1567,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 5,
      sistema: "ESB",
      ambiente: "PROD",
      host: "test",
      port: 1567,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 6,
      sistema: "ESB",
      ambiente: "PROD",
      host: "test",
      port: 1567,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 7,
      sistema: "ESB",
      ambiente: "HIST ESB OLD",
      host: "test",
      port: 1521,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 8,
      sistema: "ESB",
      ambiente: "HIST ESB OLD",
      host: "test",
      port: 1521,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 9,
      sistema: "ESB",
      ambiente: "HIST ESB NEW",
      host: "test",
      port: 1521,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 10,
      sistema: "ESB",
      ambiente: "HIST ESB NEW",
      host: "test",
      port: 1521,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 11,
      sistema: "ESB",
      ambiente: "HIST ESB NEW",
      host: "test",
      port: 1521,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 12,
      sistema: "ESB",
      ambiente: "HIST ESB NEW",
      host: "test",
      port: 1521,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 13,
      sistema: "ESB",
      ambiente: "CLONE ESB",
      host: "test",
      port: 1667,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 14,
      sistema: "ESB",
      ambiente: "CLONE ESB",
      host: "test",
      port: 1667,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 15,
      sistema: "ESB",
      ambiente: "CLONE ESB",
      host: "test",
      port: 1667,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 16,
      sistema: "ESB",
      ambiente: "CLONE ESB",
      host: "test",
      port: 1667,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 17,
      sistema: "ESB",
      ambiente: "CLONE ESB",
      host: "test",
      port: 1667,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 18,
      sistema: "ESB",
      ambiente: "INTEGRATO HOT FIX",
      host: "test",
      port: 1522,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 19,
      sistema: "ESB",
      ambiente: "INTEGRATION TEST",
      host: "test",
      port: 1522,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 20,
      sistema: "ESB",
      ambiente: "INTEGRATION TEST",
      host: "test",
      port: 1522,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 21,
      sistema: "ESB",
      ambiente: "INTEGRATION TEST",
      host: "test",
      port: 1522,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 22,
      sistema: "ESB",
      ambiente: "INTEGRATION TEST",
      host: "test",
      port: 1522,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 23,
      sistema: "ESB",
      ambiente: "SYSTEM TEST",
      host: "test",
      port: 1522,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 24,
      sistema: "ESB",
      ambiente: "SYSTEM TEST",
      host: "test",
      port: 1522,
      serviceName: "test",
      console: "test",
      consoleDetails: "n.a.",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    // Nuovi record aggiunti
    {
      id: 25,
      sistema: "COM",
      ambiente: "PROD",
      host: "test",
      port: 1567,
      serviceName: "test",
      console: "test",
      consoleDetails: "test",
      consoleReprocesser: "test",
      user: "test",
      password: "test",
    },
    {
      id: 26,
      sistema: "COM",
      ambiente: "INT",
      host: "test",
      port: 1522,
      serviceName: "test",
      console: "test",
      consoleDetails: "test",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
    {
      id: 27,
      sistema: "COM",
      ambiente: "HT",
      host: "test",
      port: 1522,
      serviceName: "test",
      console: "test",
      consoleDetails: "test",
      consoleReprocesser: "n.a.",
      user: "test",
      password: "test",
    },
  ]);

  // Stati per la visibilità della password e la gestione della finestra di dialogo
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  // Gestisce l'apertura della finestra di dialogo e memorizza l'ID della riga
  const handleTogglePasswordVisibility = (id) => {
    // Se la password è già visibile, nascondila senza richiedere codice
    if (passwordVisibility[id]) {
      setPasswordVisibility((prev) => ({
        ...prev,
        [id]: false,
      }));
    } else {
      setSelectedRowId(id);
      setOpenDialog(true);
    }
  };

  // Chiude la finestra di dialogo e resetta il codice e l'errore
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCode("");
    setError("");
  };

  // Verifica il codice e aggiorna la visibilità della password
  const handleConfirm = () => {
    if (code === "ComEsb#2024") {
      // Codice corretto
      setPasswordVisibility((prev) => ({
        ...prev,
        [selectedRowId]: true,
      }));
      handleCloseDialog();
    } else {
      setError("Codice errato. Riprova.");
    }
  };

  // Aggiorna il valore del codice inserito
  const handleChangeCode = (event) => {
    setCode(event.target.value);
  };

  // Definizione delle colonne per DataGrid
  const columns = [
    { field: "sistema", headerName: "Sistema", width: 120 },
    { field: "ambiente", headerName: "Ambiente", width: 150 },
    { field: "host", headerName: "Host", width: 150 },
    { field: "port", headerName: "Port", width: 100 },
    { field: "serviceName", headerName: "Service Name", width: 180 },
    {
      field: "console",
      headerName: "Console",
      width: 250,
      renderCell: (params) => {
        const value = params.value;
        return value !== "n.a." && value !== "n.a" ? (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ) : (
          value
        );
      },
    },
    {
      field: "consoleDetails",
      headerName: "Console Details",
      width: 250,
      renderCell: (params) => {
        const value = params.value;
        return value !== "n.a." && value !== "n.a" ? (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ) : (
          value
        );
      },
    },
    {
      field: "consoleReprocesser",
      headerName: "Console Reprocesser",
      width: 250,
      renderCell: (params) => {
        const value = params.value;
        return value !== "n.a." && value !== "n.a" ? (
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ) : (
          value
        );
      },
    },
    { field: "user", headerName: "User", width: 180 },
    {
      field: "password",
      headerName: "Password",
      width: 180,
      renderCell: (params) => {
        const { id, password } = params.row;
        const isVisible = passwordVisibility[id];
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: 10 }}>
              {isVisible ? password : "********"}
            </span>
            <button onClick={() => handleTogglePasswordVisibility(id)}>
              {isVisible ? "Hide" : "Show"}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      className="custom-header text-gray-700 font-sans "
    >
      <DataGrid
        rows={tableData}
        columns={columns}
        pageSize={15}
        autoHeight={false}
        rowHeight={30}
        className="text-xs" // Font piccolo per tutte le celle
        sx={{
          "& .MuiDataGrid-cell": {
            fontSize: "0.75rem", // Riduzione del font per celle
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: "0.875rem", // Riduzione del font per intestazioni
            backgroundColor: "#f1f5f9 !important", // Colore di sfondo per intestazioni
          },
        }}
      />

      {/* Dialog per inserire il codice */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Inserisci Codice</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="code"
            label="Codice"
            type="password"
            fullWidth
            variant="standard"
            value={code}
            onChange={handleChangeCode}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annulla</Button>
          <Button onClick={handleConfirm}>Conferma</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DataTableUsers;
