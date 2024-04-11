import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Search from "./components/search/Search";
import SearchResult from "./components/search-result/SearchResult";

function App() {
  const [artists, setSearchedArtists] = useState([]);

  return (
    <>
      <Navbar />
      <div>
        <Search setSearchedArtists={setSearchedArtists} />

        <SearchResult artists={artists} />
      </div>
    </>
  );
}

export default App;
