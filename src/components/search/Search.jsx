import React, { useState } from "react";
import LastFm from "../lastfm/LastFm";
import SearchResult from "./SearchResult";

function Search() {
  const [artist, setArtist] = useState("");
  const [artists, setSearchedArtists] = useState([]);

  const handleSearch = async (page) => {
    return await LastFm.SearchForArtist(
      artist,
      artists,
      setSearchedArtists,
      page
    );
  };

  function HandleFormSubmit(e) {
    e.preventDefault();
    handleSearch();
  }

  return (
    <>
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
      {artists?.length > 0 && (
        <SearchResult artists={artists} handleSearch={handleSearch} />
      )}
    </>
  );
}

export default Search;
