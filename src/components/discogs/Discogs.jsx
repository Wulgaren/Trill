const Discogs = {
  GetAuthHeader: function () {
    const accessToken = localStorage.OAuthAccessToken;
    const accessTokenSecret = localStorage.OAuthAccessTokenSecret;

    if (!accessToken || !accessTokenSecret)
      return new Error("Not connected to Discogs");

    return {
      Authorization: `OAuth oauth_token="${accessToken}", oauth_token_secret="&${accessTokenSecret}"`,
    };
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
      console.error("Error during login:", error.message);
      throw error; // Rethrow the error to be handled by the caller
    }
  },
};

export default Discogs;
