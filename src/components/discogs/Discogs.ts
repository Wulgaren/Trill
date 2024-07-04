import {
  DiscogsAuthorization,
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
  DiscogsSearchResult,
  DiscogsUser,
  ReleaseTrack,
} from "../../types/Discogs/DiscogsTypes";

import GetErrorMessage from "../error-handling/ErrorHandling";
import { generateQueries, removeTags } from "../functions/Functions";

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
        throw new Error("Error requesting user's identity.");
      }

      discogsUser = await response.json();
      console.log(discogsUser);

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
        throw new Error("Error requesting the token.");
      }

      const parsed = await response.json();
      console.log("login", parsed);

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

      console.log("handleGetAccessToken", verifier, requestToken);
      const response = await fetch("/api/discogs-oauth-access-token", {
        method: "POST",
        headers: {
          Authorization: `OAuth oauth_token="${requestToken}", oauth_signature="&${requestTokenSecret}", oauth_verifier="${verifier}"`,
        },
      });

      if (!response.ok) {
        throw new Error("Error requesting the token.");
      }

      const parsed = await response.json();
      console.log("token", parsed);

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
    queryKey,
  }: {
    pageParam: number;
    queryKey: string[];
  }): Promise<DiscogsSearchResponse> => {
    try {
      let username = queryKey[1];
      let userCollection: DiscogsSearchResponse;

      if (!username) {
        const savedCollection: DiscogsSearchResult[] = JSON.parse(
          sessionStorage.userCollection ?? null,
        );
        if (savedCollection) {
          userCollection = {
            results: savedCollection,
          };

          return userCollection;
        }

        username = await Discogs.GetLoggedUserName();
      }

      console.log(username);

      const response = await fetch(
        `/api/discogs-api/users/${username}/collection/folders/0/releases?per_page=50&page=${pageParam}`,
        {
          method: "GET",
          headers: Discogs.GetAuthHeader(),
        },
      );

      if (!response.ok) {
        throw new Error("Error requesting the user's collection.");
      }

      userCollection = await response.json();
      console.log("collection", userCollection);

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
    queryKey,
  }: {
    pageParam: number;
    queryKey: [string, DiscogsSearchQuery];
  }): Promise<DiscogsSearchResponse> => {
    try {
      const params = queryKey[1];
      if (!Object.values(params)?.filter((x) => x)?.length)
        throw new Error("No search params");

      const url = `/api/discogs-api/database/search`;
      const generatedQueries = generateQueries({ ...params, page: pageParam });

      const requestOptions = {
        method: "GET",
        headers: Discogs.GetAuthHeader(),
      };

      console.log(url, generatedQueries);

      const promises = generatedQueries.map((query) =>
        fetch(url + query, requestOptions),
      );
      const responses = await Promise.all(promises);

      const parsedResponses: DiscogsSearchResponse = {
        results: [],
      };

      for (const response of responses) {
        if (!response.ok) {
          throw new Error("Error getting search results.");
        }

        const parsed: DiscogsSearchResponse = await response.json();
        const pagination = parsedResponses.pagination as DiscogsPagination;
        if (!pagination) parsedResponses.pagination = parsed.pagination;
        else {
          pagination.items += (parsed.pagination as DiscogsPagination)?.items;
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
      console.log("search", filtered);

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
  }: DiscogsPageParams): Promise<DiscogsGetPageResponse> => {
    try {
      const url = `/api/discogs-api/${type}s/${id}`;

      const requestOptions = {
        method: "GET",
        headers: Discogs.GetAuthHeader(),
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error("Error getting page.");
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
    queryKey,
  }: {
    pageParam: number;
    queryKey: string[];
  }): Promise<
    DiscogsGetArtistReleasesResponse | DiscogsGetLabelReleasesResponse
  > => {
    try {
      const id = queryKey[1];
      const type = queryKey[0].toLowerCase().includes("label")
        ? "labels"
        : "artists";
      console.log(id, type);

      const response = await fetch(
        `/api/discogs-api/${type}/${id}/releases?per_page=50&page=${pageParam}`,
        {
          method: "GET",
          headers: Discogs.GetAuthHeader(),
        },
      );

      if (!response.ok) {
        throw new Error(`Error requesting ${type} releases.`);
      }

      const parsed:
        | DiscogsGetArtistReleasesResponse
        | DiscogsGetLabelReleasesResponse = await response.json();

      parsed.releases.forEach((x) => {
        if (x.thumb)
          x.thumb = "/api/discogs-image" + x.thumb?.split("discogs.com")[1];
      });
      console.log(`${type} releases`, parsed);

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
    id: number;
    originalTracklist: DiscogsMasterTrack[] & ReleaseTrack[];
  }): Promise<ReleaseTrack[]> => {
    try {
      const response = await fetch(`/api/discogs-api/masters/${id}/versions?`, {
        method: "GET",
        headers: Discogs.GetAuthHeader(),
      });

      if (!response.ok) {
        throw new Error("Error getting bonus tracks.");
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
      const responses = await Promise.all(requests);

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

      console.log("bonus tracks", bonusTracks);

      return bonusTracks;
    } catch (error) {
      console.error(
        "Error during getting bonus tracks:",
        GetErrorMessage(error),
      );
      throw error;
    }
  },
};

export default Discogs;
