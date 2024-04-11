import react from "react";

const API_KEY = "83ac8a002c2d325d41833fd18489a310";

export function FindArtistImage(mbid) {
  return "";
  // return fetch(`/musicbrainz/artist/${mbid}?inc=url-rels&fmt=json`).then(
  //   (data) => {
  //     if (!data?.ok || data?.type != "image") return "";

  //     console.log(data);
  //     return data?.url;
  //   },
  // );
}

export function SearchForArtist(artist, setSearch, page = 1) {
  if (!artist) return;

  fetch(
    `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artist}&api_key=${API_KEY}&format=json&page=${page}&limit=50`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data?.results?.artistmatches?.artist);
      setSearch(data?.results?.artistmatches?.artist ?? []);
    });
}
