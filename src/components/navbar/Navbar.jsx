import React from "react";
import { FaSearch } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  return (
    <nav>
      <ul className="flex flex-row items-center">
        <li className="title">
          <p>TRILL</p>
          <p>MUSIC FINDER</p>
        </li>
        <li className="ml-auto">
          <button tabIndex={1} className="text-white shadow-none">
            <FaSearch size={25} />
          </button>
        </li>
        <li>
          <button
            tabIndex={2}
            className="bg-red-500 hover:bg-red-700 text-white"
          >
            Connect to Last.FM
          </button>
        </li>
        <li>
          <button
            tabIndex={3}
            className="bg-gray-700 hover:bg-gray-900 text-white"
          >
            Connect to Discogs
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
