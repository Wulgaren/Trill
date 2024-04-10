import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import * as LastFM from "./components/lastfm/LastFM";

function App() {
  const [artist, setArtist] = useState("");
  const [artists, setSearch] = useState([]);
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    LastFM.searchForArtist(artist, setSearch);
  }, [artist]);

  function handleSubmit(e) {
    e.preventDefault();
    // call API
  }

  const handleImageLoad = (mbid) => {
    console.log(mbid);
    if (!mbid) return false;

    setImageLoading((prevState) => ({
      ...prevState,
      [mbid]: false,
    }));
  };

  const handleImageError = (mbid) => {
    if (!mbid) return false;

    setImageLoading((prevState) => ({
      ...prevState,
      [mbid]: false,
    }));
  };

  return (
    <>
      <Navbar />
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <ul>
          {artists?.map((artist, index) => {
            const isLoading = imageLoading[artist.mbid] || false;
            let imageUrl;
            LastFM.findArtistImage(artist.mbid).then((data) => {
              imageUrl = data;
            });
            console.log(imageUrl, isLoading);
            {
              isLoading ? (
                <p>Loading...</p>
              ) : (
                <li key={artist.mbid + index}>
                  <img
                    src={imageUrl}
                    alt={artist.name + " Image"}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                  <a href={artist.url}>{artist.name}</a>
                </li>
              );
            }
          })}
        </ul>
      </div>
    </>
  );
}

export default App;
