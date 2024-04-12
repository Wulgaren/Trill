import React from "react";
import Navbar from "./components/navbar/Navbar";
import SearchResult from "./components/search-result/SearchResult";
import Search from "./components/search/Search";
import { SearchProvider } from "./components/search/SearchProvider";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <SearchProvider>
          <Search />
          <SearchResult />
        </SearchProvider>
      </main>
    </>
  );
}

export default App;
