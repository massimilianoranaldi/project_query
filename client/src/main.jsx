// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, Router, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";

import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { fetchCapitoli } from "./redux/capitoliSlice";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
    loader: () => fetchCapitoli("ESB"), // Precarica i dati per ESB
  },
  {
    path: "/SystemESB",
    element: <App></App>,
    loader: () => fetchCapitoli("ESB"), // Carica i dati necessari per SystemESB
  },
  {
    path: "/SystemCOM",
    element: <App></App>,
    loader: () => fetchCapitoli("COM"), // Carica i dati necessari per SystemCOM
  },

  // {
  //   path: "/cards-children",
  //   element: <CardsChildren></CardsChildren>,
  //   children: [
  //     {
  //       path: ":cardID",
  //       element: <Card></Card>,
  //     },
  //   ],
  // },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      {/* <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router> */}
    </Provider>
  </React.StrictMode>
);
