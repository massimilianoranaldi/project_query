// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";

import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "/SystemESB",
    element: <App></App>,
  },
  {
    path: "/SystemCOM",
    element: <App></App>,
  },
  {
    path: "/SystemCRM",
    element: <App></App>,
  },
  {
    path: "/SystemCOMB",
    element: <App></App>,
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
    </Provider>
  </React.StrictMode>
);
