import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { fetchCapitoli, resetCapitoli } from "../redux/capitoliSlice";
import Loading from "../components/Loading"; // Importa il componente Loading

const DataQuerySearch = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.capitoli.data);
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [loading, setLoading] = useState(false); // Stato per il caricamento se true simula timeout

  //per testare il timeout
  //--------------------------------------------------------
  // useEffect(() => {
  //   // Simula un timeout per testare il caricamento
  //   const fetchDataWithDelay = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 2000)); // Ritarda di 2 secondi (2000 ms)
  //     dispatch(fetchCapitoli(["ESB", "COM", "CRM"])).then(() => {
  //       setLoading(false); // Imposta loading su false dopo che i dati sono stati caricati
  //     });
  //   };

  //   fetchDataWithDelay();

  //   // Funzione di cleanup per resettare lo stato quando il componente viene smontato
  //   return () => {
  //     dispatch(resetCapitoli());
  //   };
  // }, [dispatch]);
  //--------------------------------------------------------

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
      id: paragrafo.id + capitolo.sistem,
      nomeCapitolo: capitolo.nomeCapitolo,
      nomeParagrafo: paragrafo.nomeParagrafo,
      codicePlSql: paragrafo.codicePlSql,
      sistem: capitolo.sistem,
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
      {loading ? ( // Mostra il componente Loading se lo stato di caricamento è true
        <Loading />
      ) : (
        // Mostra la tabella dei dati quando il caricamento è completato
        <DataGrid
          rows={transformedData}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          rowHeight={30}
          disableSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell": {
              fontSize: "0.75rem",
            },
            "& .MuiDataGrid-columnHeaders": {
              fontSize: "0.875rem",
              backgroundColor: "#f1f5f9 !important",
            },
          }}
        />
      )}

      {/* Dialog per mostrare i dettagli del paragrafo */}
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
