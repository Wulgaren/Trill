import {
  DiscogsAuthorization,
  DiscogsCollectionItem,
  DiscogsCollectionResponse,
  DiscogsGetArtistReleasesResponse,
  DiscogsGetArtistResponse,
  DiscogsGetLabelReleasesResponse,
  DiscogsGetMasterResponse,
  DiscogsGetMasterVersionsResponse,
  DiscogsGetPageResponse,
  DiscogsGetReleaseResponse,
  DiscogsMasterTrack,
  DiscogsPageParams,
  DiscogsPagination,
  DiscogsSearchQuery,
  DiscogsSearchResponse,
  DiscogsUser,
  ReleaseTrack,
} from "../../types/Discogs/DiscogsTypes";
import { LastFMItemParams } from "../../types/LastFm/LastFmTypes";

import GetErrorMessage from "../error-handling/ErrorHandling";
import {
  generateQueries,
  removeDuplicates,
  removeTags,
} from "../functions/Functions";

const Discogs = {
  GetLoggedUserName: async (): Promise<string> => {
    const user: DiscogsUser = await Discogs.GetUserIdentity();

    return user?.username ?? "";
  },

  GetAuthHeader: (): DiscogsAuthorization => {
    const accessToken = localStorage.OAuthAccessToken;
    const accessTokenSecret = localStorage.OAuthAccessTokenSecret;

    return {
      Authorization:
        !accessToken || !accessTokenSecret
          ? ""
          : `OAuth oauth_token="${accessToken}", oauth_signature="&${accessTokenSecret}"`,
    };
  },

  GetUserIdentity: async (): Promise<DiscogsUser> => {
    try {
      let discogsUser: DiscogsUser = JSON.parse(
        localStorage.discogsUser ?? null,
      );
      if (discogsUser) return discogsUser;

      const response = await fetch("/api/discogs-api/oauth/identity", {
        method: "GET",
        headers: Discogs.GetAuthHeader(),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      discogsUser = await response.json();
      if (process.env.NODE_ENV === "development")
        console.log("discogs Username", discogsUser);

      localStorage.setItem("discogsUser", JSON.stringify(discogsUser));

      return discogsUser;
    } catch (error) {
      console.error(
        "Error during getting user's identity:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },

  Login: async (): Promise<URLSearchParams> => {
    try {
      const response = await fetch("/api/discogs-oauth-request-token");
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const parsed = await response.json();
      if (process.env.NODE_ENV === "development")
        console.log("discogs login", parsed);

      const data = new URLSearchParams(parsed);

      if (!data.get("oauth_token")) {
        throw new Error("No token received.");
      }

      return data;
    } catch (error) {
      console.error("Error during login:", GetErrorMessage(error));
      throw error;
    }
  },

  GetToken: async (): Promise<URLSearchParams> => {
    try {
      const requestToken = localStorage.OAuthRequestToken;
      const requestTokenSecret = localStorage.OAuthRequestTokenSecret;
      const params = new URLSearchParams(window.location.search);
      const verifier = params?.get("oauth_verifier");

      if (process.env.NODE_ENV === "development")
        console.log("discogs handleGetAccessToken", verifier, requestToken);
      const response = await fetch("/api/discogs-oauth-access-token", {
        method: "POST",
        headers: {
          Authorization: `OAuth oauth_token="${requestToken}", oauth_signature="&${requestTokenSecret}", oauth_verifier="${verifier}"`,
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const parsed = await response.json();
      if (process.env.NODE_ENV === "development")
        console.log("discogs token", parsed);

      const data = new URLSearchParams(parsed);

      if (!data.get("oauth_token")) {
        throw new Error("No token received.");
      }

      return data;
    } catch (error) {
      console.error("Error during getting token:", GetErrorMessage(error));
      throw error;
    }
  },

  GetUserCollection: async ({
    pageParam = 1,
    username,
  }: {
    pageParam: number;
    username: string;
  }): Promise<DiscogsCollectionResponse> => {
    try {
      let userCollection: DiscogsCollectionResponse;

      if (!username) {
        const savedCollection: DiscogsCollectionItem[] = JSON.parse(
          sessionStorage.userCollection ?? null,
        );
        if (savedCollection) {
          userCollection = {
            releases: savedCollection,
          };

          return userCollection;
        }

        username = await Discogs.GetLoggedUserName();
      }

      if (process.env.NODE_ENV === "development")
        console.log("discogs logged in username", username);

      const response = await fetch(
        `/api/discogs-api/users/${username}/collection/folders/0/releases?per_page=50&page=${pageParam}`,
        {
          method: "GET",
          headers: Discogs.GetAuthHeader(),
        },
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const parsed: DiscogsCollectionResponse = await response.json();
      userCollection = {
        pagination: parsed.pagination,
        releases: parsed.releases,
      };
      if (process.env.NODE_ENV === "development")
        console.log("discogs collection", userCollection);

      return userCollection;
    } catch (error) {
      console.error(
        "Error during getting user's collection:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },

  Search: async ({
    pageParam = 1,
    searchParams,
  }: {
    pageParam: number;
    searchParams: DiscogsSearchQuery;
  }): Promise<DiscogsSearchResponse> => {
    try {
      if (!Object.values(searchParams)?.filter((x) => x)?.length)
        throw new Error("No search params");

      const url = `/api/discogs-api/database/search`;
      const generatedQueries = generateQueries({
        ...searchParams,
        page: pageParam,
      });

      if (process.env.NODE_ENV === "development")
        console.log("discogs generated queries", generatedQueries);

      const requestOptions = {
        method: "GET",
        headers: Discogs.GetAuthHeader(),
      };

      const promises = generatedQueries.map((query) =>
        fetch(url + query, requestOptions),
      );
      const responses = (await Promise.allSettled(promises))
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      const parsedResponses: DiscogsSearchResponse = {
        results: [],
      };

      for (const response of responses) {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const parsed: DiscogsSearchResponse = await response.json();
        const pagination = parsedResponses.pagination as DiscogsPagination;
        if (!pagination) parsedResponses.pagination = parsed.pagination;
        else {
          if (
            (parsed.pagination as DiscogsPagination)?.pages < pagination.pages
          )
            pagination.pages = (parsed.pagination as DiscogsPagination)?.pages;
        }

        parsedResponses.results = [
          ...parsedResponses.results,
          ...parsed.results,
        ];
      }

      const customOrder = { artist: 0, label: 1, master: 2, release: 3 };

      // Filter and sort search results
      const filtered: DiscogsSearchResponse = {
        pagination: parsedResponses.pagination,
        results: parsedResponses.results
          .filter((x) => x.type !== "release")
          .sort((a, b) => customOrder[a.type] - customOrder[b.type])
          .map((result) => ({
            ...result,
            cover_image:
              "/api/discogs-image" +
              result?.cover_image?.split("discogs.com")[1],
          })),
      };
      if (process.env.NODE_ENV === "development")
        console.log("discogs search results", searchParams.query, filtered);

      return filtered;
    } catch (error) {
      console.error(
        "Error during getting search results:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },

  GetPageData: async ({
    id,
    type,
  }: DiscogsPageParams): Promise<DiscogsGetPageResponse | undefined> => {
    try {
      if (!id || !type) throw new Error("No id or type");

      if (id == "-1") return;

      const url = `/api/discogs-api/${type}s/${id}`;

      const requestOptions = {
        method: "GET",
        headers: Discogs.GetAuthHeader(),
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      let parsed: DiscogsGetPageResponse = await response.json();

      if (type == "master") {
        // master doesn't have tracklist
        const releaseFromMaster = await fetch(
          `/api/discogs-api/releases/${(parsed as DiscogsGetMasterResponse).main_release}`,
          requestOptions,
        );
        const parsedRelease: DiscogsGetReleaseResponse =
          await releaseFromMaster.json();

        parsed = { ...parsedRelease, ...parsed };

        (parsed as DiscogsGetMasterResponse).artists = removeDuplicates(
          (parsed as DiscogsGetMasterResponse).artists,
        );
      } else if (type == "artist") {
        const artistResponse = parsed as DiscogsGetArtistResponse;

        if (artistResponse.profile) {
          (parsed as DiscogsGetArtistResponse).profile = removeTags(
            artistResponse.profile,
          );
        }
      }

      parsed.images?.forEach((x) => {
        if (x.resource_url)
          x.resource_url =
            "/api/discogs-image" + x.resource_url?.split("discogs.com")[1];
      });

      return parsed;
    } catch (error) {
      console.error("Error during getting page:", GetErrorMessage(error));
      throw error;
    }
  },

  GetReleases: async ({
    pageParam = 1,
    id,
    requestType,
  }: {
    pageParam: number;
    id: string;
    requestType: string;
  }): Promise<
    DiscogsGetArtistReleasesResponse | DiscogsGetLabelReleasesResponse
  > => {
    try {
      const type = requestType?.toLowerCase()?.includes("label")
        ? "labels"
        : "artists";

      if (!id) throw new Error("No id");
      if (!type) throw new Error("No type");

      if (process.env.NODE_ENV === "development")
        console.log("discogs get releases", id, type);

      const response = await fetch(
        `/api/discogs-api/${type}/${id}/releases?per_page=50&page=${pageParam}`,
        {
          method: "GET",
          headers: Discogs.GetAuthHeader(),
        },
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const parsed:
        | DiscogsGetArtistReleasesResponse
        | DiscogsGetLabelReleasesResponse = await response.json();

      parsed.releases.forEach((x) => {
        if (x.thumb)
          x.thumb = "/api/discogs-image" + x.thumb?.split("discogs.com")[1];
      });

      if (process.env.NODE_ENV === "development")
        console.log(`discogs ${type} releases`, parsed);

      return parsed;
    } catch (error) {
      console.error(`Error during getting releases:`, GetErrorMessage(error));
      throw error;
    }
  },

  GetBonusTracks: async ({
    id,
    originalTracklist,
  }: {
    id: number | undefined;
    originalTracklist: DiscogsMasterTrack[] & ReleaseTrack[];
  }): Promise<ReleaseTrack[]> => {
    try {
      if (!id) throw new Error("No id");

      const response = await fetch(`/api/discogs-api/masters/${id}/versions?`, {
        method: "GET",
        headers: Discogs.GetAuthHeader(),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const parsed: DiscogsGetMasterVersionsResponse = await response.json();

      const filtered = parsed.versions.filter(
        (x) =>
          !x.format.includes("Promo") &&
          !x.format.includes("Club Edition") &&
          (x.country === "Japan" ||
            x.format.includes("Vinyl") ||
            x.format.includes("LP") ||
            x.format.includes("Cassette") ||
            x.format.includes("Edition")),
      );

      const requests = filtered.map((x) =>
        Discogs.GetPageData({
          id: x.id.toString(),
          type: "release",
        }),
      );
      const responses = await (await Promise.allSettled(requests))
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      const bonusTracks: ReleaseTrack[] = [];
      for (const response of responses) {
        (response as DiscogsGetReleaseResponse).tracklist.forEach((track) => {
          if (
            !originalTracklist.find((y) => y.title === track.title) &&
            !bonusTracks.find((z) => z.title === track.title)
          ) {
            bonusTracks.push(track);
          }
        });
      }

      if (process.env.NODE_ENV === "development")
        console.log("discogs bonus tracks", bonusTracks);

      return bonusTracks;
    } catch (error) {
      console.error(
        "Error during getting bonus tracks:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },

  GetRecommendations: async ({
    query,
    pageParam = 1,
  }: {
    query: string | (unknown[] | undefined)[] | undefined;
    pageParam: number;
  }): Promise<DiscogsSearchResponse | undefined> => {
    try {
      if (!query?.length) throw new Error("No query");

      const recsToSearch = Array.isArray(query)
        ? query.map((x) => x?.slice(pageParam - 1, pageParam)[0])
        : [query];

      const search = recsToSearch
        .filter((x) => x)
        .map((x) => {
          if (typeof x === "string") return x;
          if (typeof x === "object") {
            if (Object.prototype.hasOwnProperty.call(x, "album")) {
              return (
                (x as LastFMItemParams).artist +
                " - " +
                (x as LastFMItemParams).album
              );
            }
            return Object.values(x as Record<string, string>)?.join(" - ");
          }
        });

      if (process.env.NODE_ENV === "development")
        console.log("discogs recommendations albums", search);

      const promises = search.map((rec) =>
        Discogs.Search({
          pageParam,
          searchParams: {
            query: rec,
          },
        }),
      );

      const results = await (await Promise.allSettled(promises))
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

      const parsedResponses: DiscogsSearchResponse = {
        results: [],
      };

      results.forEach((result, index) => {
        if (!result.results.length) {
          parsedResponses.results.push({
            id: -1,
            title: search[index] ?? "",
            type: "master",
          });
        } else {
          if (!parsedResponses.pagination)
            parsedResponses.pagination = result.pagination;

          parsedResponses.results = [
            ...parsedResponses.results,
            ...result.results,
          ];
        }
      });

      if (process.env.NODE_ENV === "development")
        console.log("Discogs recommendations results", parsedResponses);

      return parsedResponses;
    } catch (error) {
      console.error(
        "Error during getting recommendations:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },
};

export default Discogs;
