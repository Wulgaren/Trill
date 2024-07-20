import {
  LastFMAlbumParams,
  LastFMArtistGetSimilarResponse,
  LastFMArtistSearchResponse,
  LastFMPaginatedResponse,
  LastFMTagGetTopAlbumsResponse,
  LastFMUserGetFriendsResponse,
  LastFMUserGetTopAlbumsResponse,
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
        throw new Error(response.statusText);
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
        throw new Error(response.statusText);
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
        throw new Error(response.statusText);
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

  GetUserTags: async ({
    startGenreNum = 0,
    pageParam = 1,
  }: {
    startGenreNum: number;
    pageParam: number;
  }): Promise<string[] | undefined> => {
    try {
      const lastFmUserTags = JSON.parse(
        localStorage.getItem("lastFmUserTags") ?? "",
      );
      let userTags: Set<string> = new Set();

      // Check if tags exist and if the date is older than 7 days
      if (lastFmUserTags?.tags?.length && lastFmUserTags?.date) {
        userTags = new Set(lastFmUserTags.tags);
        const storedDate = new Date(lastFmUserTags.date);
        const currentDate = new Date();

        // Calculate the difference in milliseconds
        const diffInMilliseconds =
          currentDate.getMilliseconds() - storedDate.getMilliseconds();

        // Convert the difference to days
        const diffInDays = Math.floor(
          diffInMilliseconds / (1000 * 60 * 60 * 24),
        );

        if (diffInDays > 3) {
          if (process.env.NODE_ENV === "development")
            console.log("last fm user tag expired");
          userTags = new Set();
        }
      }

      if (userTags?.size) return [...userTags];

      const username: string = localStorage.lastFmUsername ?? "";
      if (!username) return;

      const topArtists: string[] | undefined = await LastFm.GetUserArtist();
      if (!topArtists?.length) return;

      if (process.env.NODE_ENV === "development")
        console.log("lastfm top artists", topArtists);

      const startIndex = startGenreNum + (5 * pageParam - 1);

      const responses = topArtists
        .slice(startIndex, startIndex + 5)
        .map((x) =>
          fetch(
            `/api/lastfm-api/?method=artist.getTopTags&artist=${encodeURIComponent(x)}&autocorrect=1&format=json&limit=30`,
          ),
        );

      for await (const response of responses) {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data: LastFMUserGetTopTagsResponse = await response.json();

        if (data.error) continue;

        const tags = data?.toptags?.tag?.map((x) => x.name);
        tags.forEach((item) => userTags.add(item));
      }

      localStorage.setItem(
        "lastFmUserTags",
        JSON.stringify({ date: Date.now(), tags: [...userTags] }),
      );

      return [...userTags];
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
        throw new Error(response.statusText);
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
        `/api/lastfm-api/?method=tag.getTopAlbums&tag=${tag}&page=${pageParam}&limit=25&format=json`,
      );

      if (!response.ok) {
        throw new Error(response.statusText);
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
    pageParam = 1,
  }: {
    startGenreNum: number;
    pageParam: number;
  }): Promise<LastFMPaginatedResponse<LastFMAlbumParams[]> | undefined> => {
    try {
      const topGenres: string[] | undefined = await LastFm.GetUserTags({
        startGenreNum,
        pageParam,
      });
      if (!topGenres?.length) return;

      if (process.env.NODE_ENV === "development")
        console.log("lastfm recommendations to download", topGenres);

      let responses: LastFMAlbumParams[] = [];
      while (responses.length == 0) {
        const promises = topGenres
          .slice(
            Math.floor(Math.random() * 30),
            Math.floor(Math.random() * 30) + 5,
          )
          .map((genre) =>
            LastFm.GetTopAlbumsFromTag({
              pageParam: Math.floor(Math.random() * 30) + pageParam,
              tag: genre,
            }),
          );

        responses = (await Promise.all(promises))
          .flat()
          .filter((x) => x != null);
      }

      if (process.env.NODE_ENV === "development")
        console.log("lastfm fav genre albums", responses);

      return {
        results: responses,
        pagination: {
          page: pageParam,
          pages: responses.length > 0 ? pageParam + 1 : pageParam,
        },
      };
    } catch (error) {
      console.error(
        "Error during getting top albums from tag:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },

  GetFriends: async ({
    pageParam = 1,
  }: {
    pageParam: number;
  }): Promise<LastFMPaginatedResponse<string[]> | undefined> => {
    try {
      const username = localStorage.getItem("lastFmUsername");
      if (!username) throw new Error("No username");

      const response = await fetch(
        `/api/lastfm-api/?method=user.getfriends&user=${username}&page=${pageParam}&limit=50&format=json`,
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data: LastFMUserGetFriendsResponse = await response.json();
      if (!data?.friends?.user.length) return;

      if (process.env.NODE_ENV === "development")
        console.log("last fm friends", data);

      const result: LastFMPaginatedResponse<string[]> = {
        pagination: {
          page: Number(data?.friends["@attr"].page),
          pages: Number(data?.friends["@attr"].totalPages),
        },
        results: data?.friends?.user?.map(({ name }) => name) ?? [],
      };

      return result;
    } catch (error) {
      console.error("Error during getting friends:", GetErrorMessage(error));
      throw error;
    }
  },

  GetUserTopAlbums: async ({
    username = localStorage.getItem("lastFmUsername") ?? "",
    pageParam = 1,
  }: {
    username: string;
    pageParam: number;
  }): Promise<LastFMPaginatedResponse<LastFMAlbumParams[]> | undefined> => {
    try {
      if (!username) throw new Error("No username");

      const response = await fetch(
        `/api/lastfm-api/?method=user.getTopAlbums&user=${username}&period=overall&page=${pageParam}&limit=50&format=json`,
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data: LastFMUserGetTopAlbumsResponse = await response.json();
      if (process.env.NODE_ENV === "development")
        console.log("last fm user albums", data);

      const result: LastFMPaginatedResponse<LastFMAlbumParams[]> = {
        pagination: {
          page: Number(data?.topalbums["@attr"].page),
          pages: Number(data?.topalbums["@attr"].totalPages),
        },
        results:
          data?.topalbums?.album?.map(({ name, artist }) => ({
            album: name,
            artist: artist.name,
          })) ?? [],
      };

      return result;
    } catch (error) {
      console.error(
        "Error during getting user's top albums:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },

  GetFriendTopAlbums: async ({
    startGenreNum = 1,
    pageParam = 1,
  }: {
    startGenreNum: number;
    pageParam: number;
  }): Promise<LastFMPaginatedResponse<LastFMAlbumParams[]> | undefined> => {
    try {
      if (!localStorage.getItem("lastFmUsername"))
        throw new Error("No username");

      let friend: string = "";
      let pages = 15;
      while (!friend) {
        const page = Math.floor(Math.random() * pages) + 1;
        const result = await LastFm.GetFriends({
          pageParam: page,
        }).catch((ex: Error) => {
          if (ex.message.includes("Bad Request")) pages = page - 1;
        });

        if (result?.pagination.page == 1 && !result?.results?.length) return;
        if (!result) continue;

        friend =
          result.results[Math.floor(Math.random() * result.results.length)];
        break;
      }

      let albums: LastFMPaginatedResponse<LastFMAlbumParams[]> | undefined;
      const albumsPage = pageParam + Math.floor(Math.random() * startGenreNum);
      if (process.env.NODE_ENV === "development")
        console.log("lastfm user albums page", albumsPage);

      while (!albums?.results?.length) {
        albums = await LastFm.GetUserTopAlbums({
          username: friend,
          pageParam: albumsPage,
        }).catch((ex: Error) => {
          if (ex.message.includes("Bad Request"))
            startGenreNum = albumsPage - 5;
          return undefined;
        });
      }

      if (albums) albums.info = friend;

      if (process.env.NODE_ENV === "development")
        console.log("last fm friend albums", albums);

      return albums;
    } catch (error) {
      console.error(
        "Error during getting user's top albums:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },
};

export default LastFm;
