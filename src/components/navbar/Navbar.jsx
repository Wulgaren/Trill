import React from "react";
import { FaSearch } from "react-icons/fa";
import ConnectDiscogs from "../discogs/ConnectDiscogs";
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
          <ConnectDiscogs />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
