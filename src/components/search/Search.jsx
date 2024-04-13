import React from "react";
import { UseSearchContext } from "./SearchProvider";

function Search() {
  const { artist, setArtist, handleSearch } = UseSearchContext();

  function HandleFormSubmit(e) {
    e.preventDefault();
    handleSearch();
  }

  return (
    <form className="flex w-full" onSubmit={HandleFormSubmit}>
      <input
        className="w-full"
        type="search"
        placeholder="Search for an artist..."
        tabIndex={4}
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <button tabIndex={5} type="submit">
        Search
      </button>
    </form>
  );
}

export default Search;
