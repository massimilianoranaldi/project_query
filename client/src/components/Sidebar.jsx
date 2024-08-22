// components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      className="fixed top-0 left-0 h-full w-60 bg-yellow-500 text-white flex flex-col items-start pl-4 shadow-lg"
      style={{ zIndex: 7000 }}
    >
      <h2 className="mt-4 text-l font-bold text-left">Menu</h2>
      <nav className="mt-8 w-full">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="hover:text-gray-200 ml-2">
              HOME
            </Link>
          </li>
          <li>
            <Link to="/SystemESB" className="hover:text-gray-200 ml-2">
              Query per il sistema ESB
            </Link>
          </li>
          <li>
            <Link to="/SystemCOM" className="hover:text-gray-200 ml-2">
              Query per il sistema COM
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
