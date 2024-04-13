import React from "react";
import { FaSearch } from "react-icons/fa";
import ConnectLastFm from "../lastfm/ConnectLastFm";
import "./Navbar.css";

function Navbar({ onSearchIconClick }) {
  return (
    <nav>
      <ul className="flex flex-row items-center">
        <li className="title">
          <p>TRILL</p>
          <p>MUSIC FINDER</p>
        </li>
        <li className="ml-auto" onClick={onSearchIconClick}>
          <button
            title="search"
            type="button"
            tabIndex={1}
            className="text-white shadow-none"
          >
            <FaSearch size={25} />
          </button>
        </li>
        <li>
          <ConnectLastFm />
        </li>
        <li>
          <button
            type="button"
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
