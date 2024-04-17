const Discogs = {
  GetLoggedUserName: async () => {
    const user = await Discogs.GetUserIdentity();

    return JSON.parse(user)?.username;
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
      if (username) return username;

      const response = await fetch("/api/discogs/oauth/identity", {
        method: "GET",
        headers: Discogs.GetAuthHeader(),
      });
      if (!response.ok) {
        throw new Error("Error requesting user's identity.");
      }

      const parsed = await response.text();
      console.log(parsed);

      localStorage.setItem("discogsUser", parsed);

      return parsed;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error during getting user's identity:", error.message);
      throw error; // Rethrow the error to be handled by the caller
    }
  },

  Login: async () => {
    try {
      const response = await fetch("/api/discogs/oauth/request_token");
      if (!response.ok) {
        throw new Error("Error requesting the token.");
      }

      const parsed = await response.text();
      console.log("login", parsed);

      const data = new URLSearchParams(parsed);

      if (!data.get("oauth_token")) {
        throw new Error("No token received.");
      }

      return data;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error during login:", error.message);
      throw error; // Rethrow the error to be handled by the caller
    }
  },

  GetToken: async () => {
    try {
      const requestToken = localStorage.OAuthRequestToken;
      const requestTokenSecret = localStorage.OAuthRequestTokenSecret;
      const params = new URLSearchParams(window.location.search);
      const verifier = params?.get("oauth_verifier");

      console.log("handleGetAccessToken", verifier, requestToken);
      const response = await fetch("/api/discogs/oauth/access_token", {
        method: "POST",
        headers: {
          Authorization: `OAuth oauth_token="${requestToken}", oauth_signature="&${requestTokenSecret}", oauth_verifier="${verifier}"`,
        },
      });

      if (!response.ok) {
        throw new Error("Error requesting the token.");
      }

      const parsed = await response.text();
      console.log("token", parsed);

      const data = new URLSearchParams(parsed);

      if (!data.get("oauth_token")) {
        throw new Error("No token received.");
      }

      return data;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error during getting token:", error.message);
      throw error; // Rethrow the error to be handled by the caller
    }
  },

  GetUserCollection: async (username) => {
    try {
      if (!username) username = await Discogs.GetLoggedUserName();

      const response = await fetch(
        `/api/discogs/users/${username}/collection/folders/0/releases`,
        {
          method: "GET",
          headers: Discogs.GetAuthHeader(),
        }
      );

      if (!response.ok) {
        throw new Error("Error requesting the token.");
      }

      const parsed = await response.json();
      console.log("collection", parsed);

      return parsed;
    } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error during getting user's collection:", error.message);
      throw error; // Rethrow the error to be handled by the caller
    }
  },
};

export default Discogs;
