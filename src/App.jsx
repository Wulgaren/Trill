import React, { useEffect, useState } from "react";
import Discogs from "./components/discogs/Discogs";
import Navbar from "./components/navbar/Navbar";
import Search from "./components/search/Search";

function App() {
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    if (window.location.search?.includes("oauth_verifier")) {
      if (localStorage.OAuthAccessToken)
        window.location.href = window.location.origin;
      else {
        const params = new URLSearchParams(window.location.search);
        console.log("oauth verifier", params?.get("oauth_verifier"));
        localStorage.setItem("oauth_verifier", params?.get("oauth_verifier"));

        Discogs.GetToken();
      }
    }
  }, []);

  const handleSearchIconClick = () => {
    setIsSearchActive(!isSearchActive);
  };

  return (
    <>
      <Navbar onSearchIconClick={handleSearchIconClick} />
      <main>
        <div className="blob"></div>
        {isSearchActive && <Search />}
        <div className="blob"></div>
      </main>
    </>
  );
}

export default App;
