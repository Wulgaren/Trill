import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav>
      <ul className="flex flex-row">
        <li className="title flex items-center">
          <ul className="Words">
            <li className="Words-line">
              <p>&nbsp;</p>
              <p>TRILL</p>
            </li>
            <li className="Words-line">
              <p>TRILL</p>
              <p>MUSIC FINDER</p>
            </li>
            <li className="Words-line">
              <p>MUSIC FINDER</p>
              <p>&nbsp;</p>
            </li>
          </ul>
        </li>
        <li className="ml-auto">
          <button
            tabIndex={1}
            className="bg-red-500 hover:bg-red-700 border-red-200 text-white"
          >
            Connect to Last.FM
          </button>
        </li>
        <li>
          <button
            tabIndex={2}
            className="bg-gray-700 hover:bg-gray-900 border-gray-400 text-white"
          >
            Connect to Discogs
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
