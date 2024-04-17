import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { RiLogoutBoxRFill } from "react-icons/ri";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import Discogs from "./Discogs";

const handleRequestToken = (requestTokenRes, setRequestToken) => {
  if (!requestTokenRes) return;

  const requestToken = requestTokenRes?.get("oauth_token") || "";
  const requestTokenSecret = requestTokenRes?.get("oauth_token_secret") || "";
  localStorage.setItem("OAuthRequestToken", requestToken);
  localStorage.setItem("OAuthRequestTokenSecret", requestTokenSecret);
  setRequestToken(requestToken);

  if (requestToken)
    window.location.href = `https://discogs.com/oauth/authorize?oauth_token=${requestToken}`;
};

const handleAccessToken = (accessTokenRes, setAccessToken) => {
  if (!accessTokenRes) return;

  const accessToken = accessTokenRes?.get("oauth_token") || "";
  const accessTokenSecret = accessTokenRes?.get("oauth_token_secret") || "";
  localStorage.setItem("OAuthAccessToken", accessToken);
  localStorage.setItem("OAuthAccessTokenSecret", accessTokenSecret);
  history.pushState({}, "", window.location.origin);
  setAccessToken(accessToken);

  // Save user's identity after successful authentication
  Discogs.GetUserIdentity();
};

const handleTokenRemoval = (forceDelete, setRequestToken, setAccessToken) => {
  if (!forceDelete) return;

  localStorage.removeItem("OAuthAccessToken");
  localStorage.removeItem("OAuthAccessTokenSecret");
  localStorage.removeItem("OAuthRequestToken");
  localStorage.removeItem("OAuthRequestTokenSecret");
  localStorage.removeItem("discogsUser");
  setRequestToken("");
  setAccessToken("");
};

function ConnectDiscogs() {
  const [accessToken, setAccessToken] = useState(localStorage.OAuthAccessToken);
  const [requestToken, setRequestToken] = useState(
    localStorage.OAuthRequestToken
  );
  const [buttonClicked, setButtonClicked] = useState(false);

  const {
    data: requestTokenRes,
    isFetching: isRequestTokenFetching,
    isError: isRequestTokenError,
  } = useQuery({
    queryKey: ["discogs_request_token"],
    queryFn: Discogs.Login,
    enabled: !!(!accessToken && buttonClicked),
  });

  const {
    data: accessTokenRes,
    isFetching: isAccessTokenFetching,
    isError: isAccessTokenError,
  } = useQuery({
    queryKey: ["discogs_access_token"],
    queryFn: Discogs.GetToken,
    enabled: !!(
      !accessToken &&
      requestToken &&
      window.location.search?.includes("oauth_verifier")
    ),
  });

  useEffect(() => {
    handleTokenRemoval(
      isRequestTokenError || isAccessTokenError,
      setRequestToken,
      setAccessToken
    );
    handleRequestToken(requestTokenRes, setRequestToken);
    handleAccessToken(accessTokenRes, setAccessToken);
  }, [
    isRequestTokenError,
    isAccessTokenError,
    requestTokenRes,
    accessTokenRes,
  ]);

  const handleClick = () => {
    if (!accessToken) {
      setButtonClicked(true);
    } else {
      handleTokenRemoval(true, setRequestToken, setAccessToken);
    }
  };

  return (
    <button
      type="button"
      tabIndex={3}
      className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-900 text-white"
      onClick={handleClick}
    >
      {(isRequestTokenFetching || isAccessTokenFetching) && !accessToken ? (
        <LoadingAnimation />
      ) : (
        <>
          {accessToken ? (
            <>
              <RiLogoutBoxRFill />
              <span>Discogs</span>
            </>
          ) : (
            "Connect to Discogs"
          )}
        </>
      )}
    </button>
  );
}

export default ConnectDiscogs;
