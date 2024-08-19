import { configureStore } from "@reduxjs/toolkit";
import capitoliReducer from "./capitoliSlice";

const store = configureStore({
  reducer: {
    capitoli: capitoliReducer, //nomi delle variabili di stato e la funzione che aggiornato le proprieta. il nome della variabile è definita nello slice
  },
});

export default store;
