import React from "react";
import { RiLogoutBoxRFill } from "react-icons/ri";
import Discogs from "./Discogs";

function ConnectDiscogs() {
  const inputText = localStorage.OAuthAccessToken ? (
    <>
      <RiLogoutBoxRFill /> Discogs
    </>
  ) : (
    "Connect to Discogs"
  );
  const handleClick = () => {
    if (!localStorage.OAuthAccessToken) Discogs.Login();
    else {
      localStorage.removeItem("OAuthAccessToken");
      localStorage.removeItem("OAuthAccessTokenSecret");
    }
  };

  return (
    <button
      type="button"
      tabIndex={3}
      className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-900 text-white"
      onClick={handleClick}
    >
      {inputText}
    </button>
  );
}

export default ConnectDiscogs;
