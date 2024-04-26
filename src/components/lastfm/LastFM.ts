import {
  LastFMArtistSearchResponse,
  LastFMUserGetTopArtistsResponse,
  LastFmArtist,
} from "../../types/LastFm/LastFmTypes";

const LastFm = {
  FindArtistImage: async function (mbid: string) {
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
    } catch (error: any) {
      console.error("Error during finding artists image:", error.message);
      throw error;
    }
  },

  SearchForArtist: async function ({
    pageParam = 1,
    queryKey,
  }: {
    pageParam: number;
    queryKey: string;
  }) {
    try {
      const [_, artist] = queryKey;
      if (!artist) return [];

      const response = await fetch(
        `/api/lastfm-api/?method=artist.search&artist=${artist}&format=json&page=${pageParam}&limit=50`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: LastFMArtistSearchResponse = await response.json();

      return data?.results?.artistmatches?.artist ?? [];
    } catch (error: any) {
      console.error(
        "Error during searching for artist on lastfm:",
        error.message,
      );
      throw error;
    }
  },

  GetUserArtist: async function (): Promise<LastFmArtist[] | undefined> {
    try {
      let topArtists: LastFmArtist[] = JSON.parse(
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

      const artists: LastFmArtist[] =
        data?.topartists?.artist?.map(({ name, mbid }) => ({
          name,
          mbid,
        })) ?? [];
      localStorage.setItem("lastFmTopArtists", JSON.stringify(artists));

      return artists;
    } catch (error: any) {
      console.error("Error during getting user's top artists:", error.message);
      throw error;
    }
  },
};

export default LastFm;
