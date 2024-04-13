import React, { useState } from "react";
import Navbar from "./components/navbar/Navbar";
import Search from "./components/search/Search";
import { SearchProvider } from "./components/search/SearchProvider";
import SearchResult from "./components/search/SearchResult";

function App() {
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchIconClick = () => {
    setIsSearchActive(!isSearchActive);
  };

  return (
    <>
      <Navbar onSearchIconClick={handleSearchIconClick} />
      <main>
        <div className="blob"></div>
        {isSearchActive && (
          <SearchProvider>
            <Search />
            <SearchResult />
          </SearchProvider>
        )}
      </main>
    </>
  );
}

export default App;
