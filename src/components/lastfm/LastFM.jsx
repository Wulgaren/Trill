const LastFm = {
  FindArtistImage: async function (mbid) {
    try {
      if (!mbid) return;

      const response = await fetch(
        `/api/musicbrainz-api/?mbid=${mbid}&inc=url-rels&fmt=json`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      let url =
        data?.relations?.find((x) => x.type == "image")?.url?.resource ?? "";

      url = url.replace("/File:", "/Special:FilePath/");
      return url;
    } catch (error) {
      console.error("Error during finding artists image:", error.message);
      throw error;
    }
  },

  SearchForArtist: async function ({ pageParam = 1, queryKey }) {
    try {
      const [_, artist] = queryKey;
      if (!artist) return [];

      const response = await fetch(
        `/api/lastfm-api/?method=artist.search&artist=${artist}&format=json&page=${pageParam}&limit=50`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      return data?.results?.artistmatches?.artist ?? [];
    } catch (error) {
      console.error(
        "Error during searching for artist on lastfm:",
        error.message,
      );
      throw error;
    }
  },

  GetUserArtist: async function () {
    try {
      if (localStorage?.lastFmTopArtists)
        return JSON.parse(localStorage.lastFmTopArtists);

      const username = localStorage.lastFmUsername;
      if (!username) return;

      const response = await fetch(
        `/api/lastfm-api/?method=user.getTopArtists&user=${username}&period=overall&format=json&limit=100`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      console.log(data);
      const artists =
        data?.topartists?.artist?.map(({ name, mbid }) => ({ name, mbid })) ??
        [];
      localStorage.setItem("lastFmTopArtists", JSON.stringify(artists));

      return artists;
    } catch (error) {
      console.error("Error during getting user's top artists:", error.message);
      throw error;
    }
  },
};

export default LastFm;
