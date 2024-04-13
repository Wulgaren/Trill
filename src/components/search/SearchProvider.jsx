import React, { createContext, useContext, useState } from "react";
import LastFm from "../lastfm/LastFm";

const SearchContext = createContext(null);
export const UseSearchContext = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
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

  return (
    <SearchContext.Provider
      value={{ artist, setArtist, artists, setSearchedArtists, handleSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
