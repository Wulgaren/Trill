const Discogs = {
  GetLoggedUserName: async () => {
    const user = await Discogs.GetUserIdentity();

    return user?.username;
  },

  GetAuthHeader: () => {
    const accessToken = localStorage.OAuthAccessToken;
    const accessTokenSecret = localStorage.OAuthAccessTokenSecret;

    return {
      Authorization:
        !accessToken || !accessTokenSecret
          ? ""
          : `OAuth oauth_token="${accessToken}", oauth_signature="&${accessTokenSecret}"`,
    };
  },

  GetUserIdentity: async () => {
    try {
      const username = localStorage.discogsUser;
      if (username) return JSON.parse(username);

      const response = await fetch("/api/discogs-api/oauth/identity", {
        method: "GET",
        headers: Discogs.GetAuthHeader(),
      });
      if (!response.ok) {
        throw new Error("Error requesting user's identity.");
      }

      const parsed = await response.json();
      console.log(parsed);

      localStorage.setItem("discogsUser", JSON.stringify(parsed));

      return parsed;
    } catch (error) {
      console.error("Error during getting user's identity:", error.message);
      throw error;
    }
  },

  Login: async () => {
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
      console.error("Error during login:", error.message);
      throw error;
    }
  },

  GetToken: async () => {
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
      console.error("Error during getting token:", error.message);
      throw error;
    }
  },

  GetUserCollection: async ({ pageParam = 1, queryKey }) => {
    try {
      let [_, username] = queryKey;

      if (!username) {
        const savedCollection = sessionStorage.userCollection;
        if (savedCollection) return JSON.parse(savedCollection);

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

      const parsed = await response.json();
      console.log("collection", parsed);

      return parsed;
    } catch (error) {
      console.error("Error during getting user's collection:", error.message);
      throw error;
    }
  },

  Search: async ({ pageParam = 1, queryKey }) => {
    try {
      const [_, query] = queryKey;
      if (!query) throw new Error("No search query");

      const response = await fetch(
        `/api/discogs-api/database/search?q=${query}&per_page=50&page=${pageParam}`,
        {
          method: "GET",
          headers: Discogs.GetAuthHeader(),
        },
      );

      if (!response.ok) {
        throw new Error("Error getting search results.");
      }

      const parsed = await response.json();

      const customOrder = { artist: 0, label: 1, master: 2 };

      // Filter and sort search results
      const filtered = {
        pagination: parsed.pagination,
        results: parsed.results
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
      console.error("Error during getting search results:", error.message);
      throw error;
    }
  },
};

export default Discogs;
