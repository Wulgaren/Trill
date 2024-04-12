import React from "react";
import { UseSearchContext } from "./SearchProvider";

function Search() {
  const { artist, setArtist, handleSearch } = UseSearchContext();

  function HandleFormSubmit(e) {
    e.preventDefault();
    handleSearch();
  }

  return (
    <form onSubmit={HandleFormSubmit}>
      <input
        type="search"
        placeholder="Search for an artist..."
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default Search;
