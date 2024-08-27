import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import "./styles.css";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchCapitoli, resetCapitoli } from "../redux/capitoliSlice"; // Importa il tuo thunk

const DataQuerySearch = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.capitoli.data); // Ottieni i dati dallo stato Redux
  const [pageSize, setPageSize] = useState(5); // Imposta la dimensione della pagina a 5 come predefinito
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");

  useEffect(() => {
    // Chiama fetchCapitoli con i sistemi desiderati
    dispatch(fetchCapitoli(["ESB", "COM", "CRM"]));

    // Funzione di cleanup per resettare lo stato quando il componente viene smontato
    return () => {
      dispatch(resetCapitoli());
    };
  }, [dispatch]);

  // Trasforma i dati nel formato desiderato
  const transformedData = data.flatMap((capitolo) =>
    capitolo.paragrafi.map((paragrafo) => ({
      id: paragrafo.id + capitolo.sistem, // Assicurati che ogni paragrafo abbia un ID univoco
      nomeCapitolo: capitolo.nomeCapitolo,
      nomeParagrafo: paragrafo.nomeParagrafo,
      codicePlSql: paragrafo.codicePlSql,
      sistem: capitolo.sistem, // Aggiungi il nome del sistema per identificare la provenienza
    }))
  );

  const handleCellClick = (params) => {
    setDialogContent(params.value);
    setOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(dialogContent).then(() => {
      alert("Contenuto copiato negli appunti!");
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      field: "sistem",
      headerName: "Sistem",
      width: 150,
    },
    {
      field: "nomeCapitolo",
      headerName: "Nome Capitolo",
      width: 200,
      renderCell: (params) => (
        <div onClick={() => handleCellClick(params)}>{params.value}</div>
      ),
    },
    {
      field: "nomeParagrafo",
      headerName: "Nome Paragrafo",
      width: 200,
      renderCell: (params) => (
        <div onClick={() => handleCellClick(params)}>{params.value}</div>
      ),
    },
    {
      field: "codicePlSql",
      headerName: "Codice PLSQL",
      flex: 1,
      renderCell: (params) => (
        <div onClick={() => handleCellClick(params)}>{params.value}</div>
      ),
    },
  ];

  return (
    <div
      style={{ height: "100%", width: "100%" }}
      className="custom-header text-gray-700 font-sans mt-4"
    >
      <DataGrid
        rows={transformedData} // Usa i dati trasformati
        columns={columns}
        pageSize={pageSize} // Imposta la dimensione della pagina dallo stato
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} // Gestisci il cambiamento della dimensione della pagina
        rowsPerPageOptions={[5, 10, 20]} // Opzioni per il numero di righe per pagina
        pagination
        rowHeight={30}
        disableSelectionOnClick
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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Dettagli
          <IconButton
            aria-label="close"
            onClick={handleClose}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
            {dialogContent}
          </Typography>
          <Button
            onClick={handleCopy}
            variant="contained"
            color="primary"
            style={{ marginTop: 16 }}
          >
            Copia negli appunti
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataQuerySearch;
