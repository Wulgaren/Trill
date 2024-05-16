import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { PiVinylRecordFill } from "react-icons/pi";
import { RiLogoutBoxRFill } from "react-icons/ri";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import Discogs from "./Discogs";
import UserCollection from "./UserCollection";

const handleRequestToken = (
  requestTokenRes: URLSearchParams | undefined,
  setRequestToken: React.Dispatch<string>,
) => {
  if (!requestTokenRes) return;

  const requestToken = requestTokenRes?.get("oauth_token") ?? "";
  const requestTokenSecret = requestTokenRes?.get("oauth_token_secret") ?? "";
  localStorage.setItem("OAuthRequestToken", requestToken);
  localStorage.setItem("OAuthRequestTokenSecret", requestTokenSecret);
  setRequestToken(requestToken);

  if (requestToken)
    window.location.href = `https://discogs.com/oauth/authorize?oauth_token=${requestToken}`;
};

const handleAccessToken = (
  accessTokenRes: URLSearchParams | undefined,
  setAccessToken: React.Dispatch<string>,
) => {
  if (!accessTokenRes) return;

  const accessToken = accessTokenRes?.get("oauth_token") ?? "";
  const accessTokenSecret = accessTokenRes?.get("oauth_token_secret") ?? "";
  localStorage.setItem("OAuthAccessToken", accessToken);
  localStorage.setItem("OAuthAccessTokenSecret", accessTokenSecret);
  history.pushState({}, "", window.location.origin);
  setAccessToken(accessToken);
};

const handleTokenRemoval = (
  forceDelete: boolean,
  setRequestToken: React.Dispatch<string>,
  setAccessToken: React.Dispatch<string>,
) => {
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
  const [accessToken, setAccessToken] = useState<string>(
    localStorage.OAuthAccessToken,
  );
  const [requestToken, setRequestToken] = useState<string>(
    localStorage.OAuthRequestToken,
  );
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);

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
      setAccessToken,
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
      tabIndex={0}
      className="flex items-center justify-center gap-2 bg-gray-700 text-white hover:bg-gray-900"
      onClick={handleClick}
    >
      {(isRequestTokenFetching || isAccessTokenFetching) && !accessToken ? (
        <LoadingAnimation />
      ) : (
        <>
          {accessToken ? (
            <>
              <PiVinylRecordFill />
              <span>Discogs</span>
              <RiLogoutBoxRFill />
              <UserCollection accessToken={accessToken} />
            </>
          ) : (
            <>
              <PiVinylRecordFill />
              <span>Connect to Discogs</span>
            </>
          )}
        </>
      )}
    </button>
  );
}

export default ConnectDiscogs;
