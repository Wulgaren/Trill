export function FindArtistImage(mbid) {
  let lastCalled = 0;
  return new Promise((resolve, reject) => {
    const now = Date.now();
    if (now - lastCalled < 1000) {
      reject("Throttled");
      return;
    }
    lastCalled = now;
    fetch(`/api/musicbrainz/artist/${mbid}?inc=url-rels&fmt=json`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data?.relations?.find((x) => x.type == "image"));
        resolve(data?.relations?.find((x) => x.type == "image")?.url?.resource);
      })
      .catch(reject);
  });
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
    `/api/lastfm/?method=artist.search&artist=${artist}&format=json&page=${page}&limit=50`
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
