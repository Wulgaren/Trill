import React from "react";
import Navbar from "./components/navbar/Navbar";
import Search from "./components/search/Search";
import { SearchProvider } from "./components/search/SearchProvider";
import SearchResult from "./components/search/SearchResult";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <div className="blob"></div>
        <SearchProvider>
          <Search />
          <SearchResult />
        </SearchProvider>
      </main>
    </>
  );
}

export default App;
