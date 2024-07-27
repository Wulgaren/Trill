import {
  itunesProperties,
  itunesSearchParams,
  SongLinkData,
} from "../../types/SongLink/SongLinkTypes";
import GetErrorMessage from "../error-handling/ErrorHandling";

const SongLink = {
  Search: async ({
    artist = "",
    track = "",
    album = "",
  }: itunesSearchParams): Promise<string | undefined> => {
    try {
      if (!artist && !track && !album) return;

      const type = album ? "album" : track ? "song" : "";
      const term = (artist + " " + track + " " + album).trim();

      const response = await fetch(
        `/api/itunes-search/search?term=${encodeURIComponent(term)}&entity=${type}&callback=__jp9`,
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      if (!data?.results?.length) return;

      const item: itunesProperties = data.results?.find(
        (x: itunesProperties) => {
          switch (type) {
            case "album":
              return (
                x.collectionName?.includes(album) && x.artistName === artist
              );
            case "song":
              return x.trackName?.includes(track) && x.artistName === artist;
          }
        },
      );

      let url: string | undefined;

      if (process.env.NODE_ENV === "development")
        console.log("itunes search item", item);

      switch (type) {
        case "album":
          url = item?.collectionViewUrl;
          break;
        case "song":
          url = item?.trackViewUrl;
          break;
      }

      if (!url) throw new Error("Error finding link");

      if (process.env.NODE_ENV === "development") console.log("itunes", url);

      return url;
    } catch (error) {
      console.error("Error during finding link:", GetErrorMessage(error));
      throw error;
    }
  },

  SongLink: async (url: string): Promise<SongLinkData> => {
    try {
      if (!url) throw new Error("No url");

      const response = await fetch(
        `/api/song-link?url=${encodeURIComponent(url)}`,
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data: SongLinkData = await response.json();

      if (process.env.NODE_ENV === "development")
        console.log("song link", data);

      if (!Object.values(data?.linksByPlatform)?.length)
        throw new Error("No links found");

      return data;
    } catch (error) {
      console.error("Error during getting link:", GetErrorMessage(error));
      throw error;
    }
  },

  GetSongLink: async ({
    artist = "",
    track = "",
    album = "",
  }: itunesSearchParams = {}): Promise<SongLinkData> => {
    try {
      const url = await SongLink.Search({ artist, track, album });
      if (!url) throw new Error("Error finding link");

      const data = await SongLink.SongLink(url);
      if (!data) throw new Error("Error getting link");

      return data;
    } catch (error) {
      console.error("Error during getting link:", GetErrorMessage(error));
      throw error;
    }
  },
};

export default SongLink;
