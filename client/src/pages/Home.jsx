import Sidebar from "../components/Sidebar";
import React, { useEffect } from "react";
import DataTableUsers from "../components/DataTableUsers.jsx";
import DataQuerySearch from "../components/DataQuerySearch.jsx";
// or
import HomeIcon from "@mui/icons-material/AddHomeTwoTone";

function Home() {
  return (
    <>
      <Sidebar />

      <div className="ml-64 p-4">
        {" "}
        {/* <div className="flex items-center space-x-2">
          <HomeIcon
            className="text-blue-500"
            style={{ fontSize: 20 }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#FF6A06")} // Colore su hover
            onMouseOut={(e) => (e.currentTarget.style.color = "#000")} // Ritorna al colore originale
          />{" "}
          
          <p className="text-xl text-gray-700">Go to homepage</p>
        </div> */}
        {/* Aggiunta di margine per il pannello */}
        <div className="mb-4 p-0 bg-white text-left border-yellow-500 border-b-4 border-l-4">
          <h1 className="text-left text-3xl font-bold bg-gradient-to-r to-white from-yellow-500 ">
            PUNTAMENTI
          </h1>
        </div>
        <div style={{ height: 700, width: "100%" }}>
          <DataTableUsers />
        </div>
        <div className="mt-4 p-0 bg-white text-left border-yellow-500 border-b-4 border-l-4">
          <h1 className="text-left text-3xl font-bold bg-gradient-to-r to-white from-yellow-500 ">
            SEARCH
          </h1>
        </div>
        <div style={{ height: 700, width: "100%" }}>
          <DataQuerySearch />
        </div>
      </div>
    </>
  );
}

export default Home;
