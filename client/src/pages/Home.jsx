import Sidebar from "../components/Sidebar";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCapitoli } from "../redux/capitoliSlice";

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Precarica i dati per SystemESB
    dispatch(fetchCapitoli("ESB"));

    // Precarica i dati per SystemCOM
    dispatch(fetchCapitoli("COM"));
  }, [dispatch]);
  return (
    <>
      <Sidebar />
      <div className="ml-64 p-4">
        {" "}
        {/* Aggiunta di margine per il pannello */}
        <div className="mb-4 p-0 bg-white text-left border-yellow-500 border-b-4 border-l-4">
          <h1 className="text-left text-3xl font-bold bg-gradient-to-r to-white from-yellow-500 ">
            BENVENUTI
          </h1>
        </div>
      </div>
    </>
  );
}

export default Home;
