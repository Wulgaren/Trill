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
      <main>
        <div className="blob"></div>
        {isSearchActive && <Search />}
      </main>
    </>
  );
}

export default App;
