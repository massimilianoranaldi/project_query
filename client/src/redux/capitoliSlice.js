import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//const API_BASE_URL = "http://localhost:3000";

//const API_BASE_URL = "https://project-query.onrender.com"; (server)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//funzione per estrarre timestamp
function getTimestamp() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(now.getDate()).padStart(2, "0")} ${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
    now.getSeconds()
  ).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}`;
}

// Azione asincrona per fare l'upload su GitHub
export const downloadFromGit = createAsyncThunk(
  "capitoli/downloadFromGit",
  async (_, { getState, rejectWithValue }) => {
    try {
      const system = getState().capitoli.system; // Ricava il valore di `system` dallo stato
      const url = `${API_BASE_URL}/downloadFromGit/${system}`;
      const response = await axios.post(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//questa funzione viene utilizzata per la creazione di task asincroni al di fuori dello slice (es. chiamate api)
export const fetchCapitoli = createAsyncThunk(
  "capitoli/fetchCapitoli",
  async (systems = [], { getState }) => {
    // Se non vengono passati sistemi, usa quello attuale nello stato
    if (systems.length === 0) {
      systems = [getState().capitoli.system];
    }

    // Funzione per ottenere i capitoli da un singolo sistema per le singole pagine
    //---------------------------------------------------------------------------------
    // const fetchCapitoliForSystem = async (system) => {
    //   const url = `${API_BASE_URL}/getCapitoliParagrafi/${system}`;
    //   const response = await axios.get(url);
    //   return response.data.data.map((item) => ({
    //     ...item,
    //     sistem: system, // Aggiungi il nome del sistema per identificare la provenienza
    //   }));
    // };
    const fetchCapitoliForSystem = async (system) => {
      const url = `${API_BASE_URL}/getCapitoliParagrafi/${system}`;
      const response = await axios.get(url);

      // Mappare i dati ricevuti e concatenare l'ID del sistema con gli ID dei capitoli e paragrafi
      return response.data.data.map((capitolo) => ({
        ...capitolo,
        id: `${system}-${capitolo.id}`, // Concatenazione dell'ID del sistema con l'ID del capitolo
        paragrafi: capitolo.paragrafi.map((paragrafo) => ({
          id: `${system}-${paragrafo.id}`, // Concatenazione dell'ID del sistema con l'ID del paragrafo
          nomeParagrafo: paragrafo.nomeParagrafo,
          codicePlSql: paragrafo.codicePlSql,
          outPutSql: paragrafo.outPutSql,
        })),
        sistem: system, // Aggiungi il nome del sistema per identificare la provenienza
      }));
    };

    // Recupera i dati per tutti i sistemi in parallelo
    const allData = await Promise.all(
      systems.map((system) => fetchCapitoliForSystem(system))
    );

    // Combina tutti i dati in un unico array
    return allData.flat();
  }
);

// Funzione per aggiungere un paragrafo NEW
export const addParagrafo = createAsyncThunk(
  "capitoli/addParagrafo",

  async (payload, { getState }) => {
    const system = getState().capitoli.system;
    const url = `${API_BASE_URL}/inserisciCapitolo/${system}`;
    console.log(getTimestamp(), "client : ", url);

    const response = await axios.post(
      //"http://localhost:3000/inserisciCapitolo",
      url,
      payload
    );

    return response.data.data; // Assumi che il server ritorni i dati aggiornati
  }
);

// Funzione per modificare capitolo
export const modificaCapitolo = createAsyncThunk(
  "capitoli/modificaCapitolo",
  async (payload, { getState }) => {
    const system = getState().capitoli.system;
    const url = `${API_BASE_URL}/modificaNomeCapitolo/${system}`;
    console.log(getTimestamp(), "client : ", url);

    const response = await axios.post(
      //"http://localhost:3000/modificaNomeCapitolo",
      url,
      payload
    );
    return response.data.data; // Assumi che il server ritorni i dati aggiornati
  }
);

// Funzione per modificare paragrafo
export const modificaParagrafo = createAsyncThunk(
  "capitoli/modificaParagrafo",
  async (payload, { getState }) => {
    const system = getState().capitoli.system;
    const url = `${API_BASE_URL}/modificaParagrafo/${system}`;
    console.log(getTimestamp(), "client : ", url);

    const response = await axios.post(
      //"http://localhost:3000/modificaParagrafo",
      url,
      payload
    );
    return response.data.data; // Assumi che il server ritorni i dati aggiornati
  }
);
// Azione asincrona per eliminare un paragrafo
export const eliminaParagrafo = createAsyncThunk(
  "capitoli/eliminaParagrafo",
  async (objectId, { getState, dispatch, rejectWithValue }) => {
    try {
      const system = getState().capitoli.system;
      const url = `${API_BASE_URL}/eliminaCapitoloParagrafo/${system}/${objectId}`;
      console.log(getTimestamp(), "client : ", url);

      await axios.post(url);
      // Dopo aver eliminato il paragrafo, recupera di nuovo i capitoli
      dispatch(fetchCapitoli());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const importCapitoli = createAsyncThunk(
  "capitoli/importCapitoli",
  async (jsonData, { getState }) => {
    const system = getState().capitoli.system;
    const url = `${API_BASE_URL}/caricaCapitoli/${system}`;
    console.log(getTimestamp(), "client : ", url);

    const response = await axios.post(url, jsonData);

    return response.data.data;
  }
);

const capitoliSlice = createSlice({
  name: "capitoli", // è il nome della variabile definita nello store.js
  initialState: {
    //inizializzazione della variabile capitoli. questo oggetto viene referenziato mediante state.data, state.loading,state.error
    data: [],
    loading: false,
    error: null,
    system: "ESB", // Inizializza il sistema a "ESB"
  },
  reducers: {
    setSystem: (state, action) => {
      state.system = action.payload; // Aggiorna il valore di system
    },
    resetCapitoli: (state) => {
      //consente di azzerare il contenuto della pagina da uno switch di pagina all0'altra
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  }, //usata se le azioni sono sincrone e svlote nello slice
  extraReducers: (builder) => {
    //usata se le azioni sono a-sincrone e non svlote nello slice
    builder
      .addCase(fetchCapitoli.pending, (state) => {
        //è il tempo di attesa mentre viene svolta  l'azione asincrona e aggiorna lo stato come segue
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCapitoli.fulfilled, (state, action) => {
        //quando l'azione asincrona finisce. In questo caso il risultato della chiamata viene messo dentro state.data mediante action.payload come risultato della chiamata fetchCapitoli.fulfilled, (state, action)
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCapitoli.rejected, (state, action) => {
        //quando l'azione va in errore
        state.loading = false;
        state.error = action.error.message;
      })
      //-------------------
      //NEW aggiunge capitoli o paragrafi
      .addCase(addParagrafo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addParagrafo.fulfilled, (state, action) => {
        state.loading = false;
        // Puoi aggiornare lo stato con i dati aggiornati, se necessario
        // Supponiamo che action.payload contenga i dati aggiornati
        // Aggiorniamo lo stato con i nuovi dati
        state.data = action.payload;
      })
      .addCase(addParagrafo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //-------------------
      // Aggiungi il caso per gestire l'eliminazione del paragrafo
      .addCase(eliminaParagrafo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminaParagrafo.fulfilled, (state) => {
        // Lo stato verrà aggiornato dal fetchCapitoli
        state.loading = false;
      })
      .addCase(eliminaParagrafo.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Errore durante l'eliminazione del paragrafo.";
      })

      //-------------------
      //NEW Modifica Capitolo
      .addCase(modificaCapitolo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(modificaCapitolo.fulfilled, (state, action) => {
        state.loading = false;
        // Puoi aggiornare lo stato con i dati aggiornati, se necessario
        // Supponiamo che action.payload contenga i dati aggiornati
        // Aggiorniamo lo stato con i nuovi dati
        state.data = action.payload;
      })
      .addCase(modificaCapitolo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      //-------------------
      //NEW Modifica paragrafo
      .addCase(modificaParagrafo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(modificaParagrafo.fulfilled, (state, action) => {
        state.loading = false;
        // Puoi aggiornare lo stato con i dati aggiornati, se necessario
        // Supponiamo che action.payload contenga i dati aggiornati
        // Aggiorniamo lo stato con i nuovi dati
        state.data = action.payload;
      })
      .addCase(modificaParagrafo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //-----------------------------
      .addCase(importCapitoli.pending, (state) => {
        state.loading = true;
      })
      .addCase(importCapitoli.fulfilled, (state, action) => {
        state.data = action.payload; // Aggiorna i dati con i nuovi importati
        state.loading = false;
      })
      .addCase(importCapitoli.rejected, (state, action) => {
        state.error = action.error;
        state.loading = false;
      })

      //---------------------------------------
      // Gestione delle altre azioni
      .addCase(downloadFromGit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadFromGit.fulfilled, (state, action) => {
        state.loading = false;
        // Aggiornamenti allo stato, se necessari
      })
      .addCase(downloadFromGit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default capitoliSlice.reducer;
export const { setSystem, resetCapitoli } = capitoliSlice.actions;
