import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import Modal from "../modal/Modal";
import LastFm from "./LastFm";

function ConnectLastFm() {
  const [isOpenLastFmDialog, setIsOpenLastFmDialog] = useState(false);
  const [username, setUsername] = useState(localStorage.lastFmUsername);

  const {
    data: getTopArtistsReq,
    isFetching: isTopArtistsFetching,
    isError: isTopArtistsError,
  } = useQuery({
    queryKey: ["last_fm_top_artists"],
    queryFn: LastFm.GetUserArtist,
    enabled: !!(
      username &&
      !isOpenLastFmDialog &&
      (localStorage.lastFmUsername != username ||
        !localStorage.lastFmTopArtists)
    ),
  });

  useEffect(() => {
    if (isOpenLastFmDialog) return;

    if (!username) localStorage.removeItem("lastFmTopArtists");
  }, [isOpenLastFmDialog]);

  const SetLastFmUser = (e) => {
    e.preventDefault();
    setIsOpenLastFmDialog(false);
  };

  return (
    <>
      <button
        type="button"
        title="Last.fm Options"
        tabIndex={2}
        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-700 text-white"
        onClick={() => setIsOpenLastFmDialog(true)}
      >
        {isTopArtistsFetching ? (
          <LoadingAnimation />
        ) : (
          <>
            {username ? (
              <>
                <FaCog />
                <span>Last.fm</span>
              </>
            ) : (
              "Connect to Last.fm"
            )}
          </>
        )}
      </button>
      <Modal
        onClose={() => setIsOpenLastFmDialog(false)}
        open={isOpenLastFmDialog}
      >
        <form
          className="flex items-center justify-center flex-col gap-5"
          onSubmit={SetLastFmUser}
        >
          <label htmlFor="LastFmUsername">
            Input your username to get personalized Last.FM recommendations.
          </label>
          <input
            type="text"
            name="LastFmUsername"
            placeholder="Last.FM Username"
            value={username}
            tabIndex={10}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={SetLastFmUser}
          />
        </form>
      </Modal>
    </>
  );
}

export default ConnectLastFm;
