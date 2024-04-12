import React from "react";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import SearchResult from "./components/search-result/SearchResult";
import Search from "./components/search/Search";
import { SearchProvider } from "./components/search/SearchProvider";

function App() {
  return (
    <>
      <Navbar />
      <div>
        <SearchProvider>
          <Search />
          <SearchResult />
        </SearchProvider>
      </div>
    </>
  );
}

export default App;
