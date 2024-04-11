import react from "react";

const API_KEY = "83ac8a002c2d325d41833fd18489a310";

export function findArtistImage(mbid) {
  return fetch(`/musicbrainz/artist/${mbid}?inc=url-rels&fmt=json`).then(
    (data) => {
      if (!data?.ok || data?.type != "image") return "";

      console.log(data);
      return data?.url;
    },
  );
}

export function searchForArtist(artist, setSearch) {
  if (!artist) return;

  fetch(
    `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artist}&api_key=${API_KEY}&format=json&limit=250`,
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data?.results?.artistmatches?.artist);
      setSearch(data?.results?.artistmatches?.artist ?? []);
    });
}

function LastFM() {}

export default LastFM;
