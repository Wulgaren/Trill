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

export async function SearchForArtist(
  artist,
  artists,
  setSearchedArtists,
  page = 1
) {
  if (!artist) return;
  if (!artists?.length) setSearchedArtists(["loading"]);

  return await fetch(
    `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artist}&api_key=${API_KEY}&format=json&page=${page}&limit=50`
  )
    .then((res) => res.json())
    .then((data) => {
      let receivedArtists = data?.results?.artistmatches?.artist ?? [];

      if (artists?.length && receivedArtists?.length && artists[0] != "loading")
        receivedArtists = [...artists, ...receivedArtists];

      console.log(receivedArtists);

      setSearchedArtists(receivedArtists);

      return receivedArtists;
    });
}
