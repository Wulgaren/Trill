const LastFm = {
  FindArtistImage: async function (mbid) {
    if (!mbid) return;

    return await fetch(`/api/musicbrainz/artist/${mbid}?inc=url-rels&fmt=json`)
      .then((res) => res.json())
      .then((data) => {
        let url = data?.relations?.find((x) => x.type == "image")?.url
          ?.resource;
        if (!url) return;
        url = url.replace("/File:", "/Special:FilePath/");
        return url;
      });
  },

  SearchForArtist: async function (artist, setSearchedArtists, page = 1) {
    if (!artist) return;

    return await fetch(
      `/api/lastfm/?method=artist.search&artist=${artist}&format=json&page=${page}&limit=50`
    )
      .then((res) => res.json())
      .then((data) => {
        let receivedArtists = data?.results?.artistmatches?.artist ?? [];
        // Add previous artists

        let artistsList = [];

        setSearchedArtists((prevArtists) => {
          artistsList = [...prevArtists, ...receivedArtists];
          console.log(artistsList);
          return artistsList;
        });

        return artistsList;
      });
  },

  GetUserArtist: async function () {
    if (localStorage?.lastFmTopArtists)
      return JSON.parse(localStorage.lastFmTopArtists);

    const username = localStorage.lastFmUsername ?? "";
    if (!username) return;

    return await fetch(
      `/api/lastfm/?method=user.getTopArtists&user=${username}&period=overall&format=json&limit=100`
    )
      .then((res) => res.json())
      .then((data) => {
        let artists =
          data?.topartists?.artist?.map(({ name, mbid }) => ({ name, mbid })) ??
          [];
        console.log("GetUserArtist", artists);
        localStorage.setItem("lastFmTopArtists", JSON.stringify(artists));

        return artists;
      });
  },
};

export default LastFm;
