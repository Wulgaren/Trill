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
  Login: async function () {
    try {
      const response = await fetch("/api/discogs/oauth/request_token");

      const parsed = await response.text();
      console.log(parsed);

      const data = new URLSearchParams(parsed);

      if (!data.get("oauth_token")) return new Error("No token received.");

      localStorage.setItem("OAuthRequestToken", data.get("oauth_token"));
      localStorage.setItem(
        "OAuthRequestTokenSecret",
        data.get("oauth_token_secret")
      );

      window.location.href = `https://discogs.com/oauth/authorize?oauth_token=${data.get(
        "oauth_token"
      )}`;
    } catch (error) {
      console.error("Error getting request token:", error);
    }
  },

  GetToken: async function () {
    if (localStorage.getItem("OAuthAccessToken")) return;

    try {
      const requestToken = localStorage.OAuthRequestToken;
      const requestTokenSecret = localStorage.OAuthRequestTokenSecret;
      const verifier = localStorage.oauth_verifier;

      console.log("handleGetAccessToken", verifier, requestToken);
      const response = await fetch("/api/discogs/oauth/access_token", {
        method: "POST",
        headers: {
          Authorization: `OAuth oauth_token="${requestToken}", oauth_signature="&${requestTokenSecret}", oauth_verifier="${verifier}"`,
        },
      });

      const parsed = await response.text();
      console.log(parsed);
      const data = new URLSearchParams(parsed);
      if (!data.get("oauth_token")) return new Error("No token received.");

      console.log(data.get("oauth_token"));
      localStorage.setItem("OAuthAccessToken", data.get("oauth_token"));
      localStorage.setItem(
        "OAuthAccessTokenSecret",
        data.get("oauth_token_secret")
      );
    } catch (error) {
      console.error("Error getting access token:", error);
    }
  },
};

export default Discogs;
