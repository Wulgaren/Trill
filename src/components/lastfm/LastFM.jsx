import defaultArtistImage from "../../assets/img/default_artist.webp";

const LastFm = {
  FindArtistImage: async function (mbid) {
    try {
      if (!mbid) return;

      const response = await fetch(
        `/api/musicbrainz/artist/${mbid}?inc=url-rels&fmt=json`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      let url =
        data?.relations?.find((x) => x.type == "image")?.url?.resource ??
        defaultArtistImage;

      url = url.replace("/File:", "/Special:FilePath/");
      return url;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error during finding artists image:", error.message);
      throw error; // Rethrow the error to be handled by the caller
    }
  },

  SearchForArtist: async function ({ pageParam = 1, queryKey }) {
    try {
      const [_, artist] = queryKey;
      if (!artist) return [];

      const response = await fetch(
        `/api/lastfm/?method=artist.search&artist=${artist}&format=json&page=${pageParam}&limit=50`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      return data?.results?.artistmatches?.artist ?? [];
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(
        "Error during searching for artist on lastfm:",
        error.message,
      );
      throw error; // Rethrow the error to be handled by the caller
    }
  },

  GetUserArtist: async function () {
    try {
      if (localStorage?.lastFmTopArtists)
        return JSON.parse(localStorage.lastFmTopArtists);

      const username = localStorage.lastFmUsername;
      if (!username) return;

      const response = await fetch(
        `/api/lastfm/?method=user.getTopArtists&user=${username}&period=overall&format=json&limit=100`,
      );
      const data = await response.json();
      const artists =
        data?.topartists?.artist?.map(({ name, mbid }) => ({ name, mbid })) ??
        [];
      localStorage.setItem("lastFmTopArtists", JSON.stringify(artists));

      return artists;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error during getting user's top artists:", error.message);
      throw error; // Rethrow the error to be handled by the caller
    }
  },
};

export default LastFm;
