import React, { useState } from "react";
import LastFm from "../lastfm/LastFm";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import SearchResult from "./SearchResult";

function Search() {
  const [artist, setArtist] = useState("");
  const [artists, setSearchedArtists] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const handleSearch = async (page) => {
    return await LastFm.SearchForArtist(
      artist,
      artists,
      setSearchedArtists,
      page
    );
  };

  async function HandleFormSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await handleSearch();
    setLoading(false);
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
      {isLoading && <LoadingAnimation />}
      {artists?.length > 0 && !isLoading && (
        <SearchResult artists={artists} handleSearch={handleSearch} />
      )}
    </>
  );
}

export default Search;
