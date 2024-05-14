import {
  DiscogsAuthorization,
  DiscogsPagination,
  DiscogsSearchQuery,
  DiscogsSearchResponse,
  DiscogsSearchResult,
  DiscogsUser,
} from "../../types/Discogs/DiscogsTypes";

import GetErrorMessage from "../error-handling/ErrorHandling";
import { generateQueries } from "../functions/Functions";

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
      if (!params?.query) throw new Error("No search query");

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
};

export default Discogs;
