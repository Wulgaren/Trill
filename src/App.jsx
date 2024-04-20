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
      <main className="p-5">{isSearchActive && <Search />}</main>

      <div className="absolute top-0 z-[-1] h-full w-full overflow-hidden">
        <div className="blob"></div>
        <div className="blob"></div>
      </div>
    </>
  );
}

export default App;
