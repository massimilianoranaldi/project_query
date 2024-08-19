import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//questa funzione viene utilizzata per la creazione di task asincroni al di fuori dello slice (es. chiamate api)
export const fetchCapitoli = createAsyncThunk(
  "capitoli/fetchCapitoli",
  async () => {
    const response = await axios.get(
      "http://localhost:3000/getCapitoliParagrafi"
    );
    return response.data.data;
  }
);

// Funzione per aggiungere un paragrafo NEW
export const addParagrafo = createAsyncThunk(
  "capitoli/addParagrafo",
  async (payload) => {
    const response = await axios.post(
      "http://localhost:3000/inserisciCapitolo",
      payload
    );
    return response.data.data; // Assumi che il server ritorni i dati aggiornati
  }
);

// Funzione per modificare capitolo
export const modificaCapitolo = createAsyncThunk(
  "capitoli/modificaCapitolo",
  async (payload) => {
    const response = await axios.post(
      "http://localhost:3000/modificaNomeCapitolo",
      payload
    );
    return response.data.data; // Assumi che il server ritorni i dati aggiornati
  }
);

// Funzione per modificare paragrafo
export const modificaParagrafo = createAsyncThunk(
  "capitoli/modificaParagrafo",
  async (payload) => {
    const response = await axios.post(
      "http://localhost:3000/modificaParagrafo",
      payload
    );
    return response.data.data; // Assumi che il server ritorni i dati aggiornati
  }
);
// Azione asincrona per eliminare un paragrafo
export const eliminaParagrafo = createAsyncThunk(
  "capitoli/eliminaParagrafo",
  async (objectId, { dispatch, rejectWithValue }) => {
    try {
      const url = `http://localhost:3000/eliminaCapitoloParagrafo/${objectId}`;
      await axios.post(url);
      // Dopo aver eliminato il paragrafo, recupera di nuovo i capitoli
      dispatch(fetchCapitoli());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const capitoliSlice = createSlice({
  name: "capitoli", // è il nome della variabile definita nello store.js
  initialState: {
    //inizializzazione della variabile capitoli. questo oggetto viene referenziato mediante state.data, state.loading,state.error
    data: [],
    loading: false,
    error: null,
  },
  reducers: {}, //usata se le azioni sono sincrone e svlote nello slice
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
      });
  },
});

export default capitoliSlice.reducer;
