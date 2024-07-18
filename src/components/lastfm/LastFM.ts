import {
  LastFMAlbumParams,
  LastFMArtistGetSimilarResponse,
  LastFMArtistSearchResponse,
  LastFMTagGetTopAlbumsResponse,
  LastFMUserGetTopArtistsResponse,
  LastFMUserGetTopTagsResponse,
} from "../../types/LastFm/LastFmTypes";

import GetErrorMessage from "../error-handling/ErrorHandling";

const LastFm = {
  FindArtistImage: async (mbid: string) => {
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
        data?.relations?.find((x: { type: string }) => x.type == "image")?.url
          ?.resource ?? "";

      url = url.replace("/File:", "/Special:FilePath/");
      return url;
    } catch (error) {
      console.error(
        "Error during finding artists image:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },

  SearchForArtist: async ({
    pageParam = 1,
    artist,
  }: {
    pageParam: number;
    artist: string;
  }) => {
    try {
      if (!artist) return [];

      const response = await fetch(
        `/api/lastfm-api/?method=artist.search&artist=${artist}&format=json&page=${pageParam}&limit=50`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: LastFMArtistSearchResponse = await response.json();

      return data?.results?.artistmatches?.artist ?? [];
    } catch (error) {
      console.error(
        "Error during searching for artist on lastfm:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },

  GetUserArtist: async (): Promise<string[] | undefined> => {
    try {
      let topArtists: string[] = JSON.parse(
        localStorage.lastFmTopArtists ?? null,
      );
      if (topArtists) return topArtists;

      const username: string = localStorage.lastFmUsername ?? "";
      if (!username) return;

      const response = await fetch(
        `/api/lastfm-api/?method=user.getTopArtists&user=${username}&period=overall&format=json&limit=100`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: LastFMUserGetTopArtistsResponse = await response.json();

      topArtists = data?.topartists?.artist?.map(({ name }) => name) ?? [];
      localStorage.setItem("lastFmTopArtists", JSON.stringify(topArtists));

      return topArtists;
    } catch (error) {
      console.error(
        "Error during getting user's top artists:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },

  GetUserTags: async (): Promise<string[] | undefined> => {
    try {
      let userTags: string[] =
        JSON.parse(localStorage.lastFmUserTags ?? null) ?? [];
      if (userTags?.length) return userTags;

      const username: string = localStorage.lastFmUsername ?? "";
      if (!username) return;

      const topArtists: string[] | undefined = await LastFm.GetUserArtist();
      if (!topArtists?.length) return;
      console.log("lastfm top artists", topArtists);

      const responses = topArtists
        .slice(0, 10)
        .map((x) =>
          fetch(
            `/api/lastfm-api/?method=artist.getTopTags&artist=${encodeURIComponent(x)}&autocorrect=1&format=json&limit=100`,
          ),
        );

      for await (const response of responses) {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: LastFMUserGetTopTagsResponse = await response.json();

        if (data.error) continue;

        const tags = data?.toptags?.tag?.map((x) => x.name);
        userTags = [...userTags, ...tags];
      }

      localStorage.setItem("lastFmUserTags", JSON.stringify(userTags));

      return userTags;
    } catch (error) {
      console.error(
        "Error during getting user's top artists:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },

  GetSimilarArtists: async ({
    artist,
  }: {
    artist: string;
  }): Promise<string[]> => {
    try {
      const response = await fetch(
        `/api/lastfm-api/?method=artist.getSimilar&artist=${artist}&autocorrect=1&limit=50&format=json`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: LastFMArtistGetSimilarResponse = await response.json();

      return data?.similarartists?.artist?.map(({ name }) => name) ?? [];
    } catch (error) {
      console.error(
        "Error during getting similar artists:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },

  GetTopAlbumsFromTag: async ({
    pageParam = 1,
    tag,
  }: {
    pageParam: number;
    tag: string;
  }): Promise<LastFMAlbumParams[] | undefined> => {
    try {
      if (!tag) throw new Error("No tag");

      const response = await fetch(
        `/api/lastfm-api/?method=tag.getTopAlbums&tag=${tag}&page=${pageParam}&limit=100&format=json`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: LastFMTagGetTopAlbumsResponse = await response.json();

      return (
        data?.albums?.album?.map(({ name, artist }) => ({
          album: name,
          artist: artist.name,
        })) ?? []
      );
    } catch (error) {
      console.error(
        "Error during getting top albums from tag:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },

  GetFavGenreRecommendations: async ({
    startGenreNum = 1,
  }: {
    startGenreNum: number;
  }): Promise<
    (
      | Readonly<{
          album: string;
          artist: string;
        }>[]
      | undefined
    )[]
  > => {
    try {
      const topGenres: string[] | undefined = await LastFm.GetUserTags();
      if (!topGenres?.length) return [];

      const lastGenreNum = (startGenreNum - 1) * 4;
      const genresToDownload = topGenres.slice(lastGenreNum, lastGenreNum + 4);
      console.log("lastfm recommendations to download", genresToDownload);

      if (!genresToDownload.length) return [];

      const promises = genresToDownload.map((genre) =>
        LastFm.GetTopAlbumsFromTag({
          pageParam: startGenreNum,
          tag: genre,
        }),
      );

      const responses = await Promise.all(promises);

      console.log("lastfm fav genre albums", responses);

      //TODO - add keys for each genre, append to this list every time theres a new call so its a little cache for less requests
      localStorage.setItem(
        "lastFmFavGenreRecommendations",
        JSON.stringify(responses),
      );

      return responses;
    } catch (error) {
      console.error(
        "Error during getting top albums from tag:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },
};

export default LastFm;
