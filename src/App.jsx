import React, { useState } from "react";
import Navbar from "./components/navbar/Navbar";
import Search from "./components/search/Search";

function App() {
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleSearchIconClick = () => {
    setIsSearchActive(!isSearchActive);
  };

  return (
    <>
      <Navbar onSearchIconClick={handleSearchIconClick} />
      <main>{isSearchActive && <Search />}</main>

      <div className="blob-container">
        <div className="blob"></div>
        <div className="blob"></div>
      </div>
    </>
  );
}

export default App;
