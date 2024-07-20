import { useQuery } from "@tanstack/react-query";
import { FormEvent, useEffect, useState } from "react";
import { FaCog, FaLastfm } from "react-icons/fa";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import Modal from "../modal/Modal";
import { useNavbarContext } from "../start-page/NavbarContextUtils";
import LastFm from "./LastFM";

function ConnectLastFm() {
  const [isOpenLastFmDialog, setIsOpenLastFmDialog] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(
    localStorage.lastFmUsername ?? "",
  );
  const { setLastFmUsername } = useNavbarContext();

  const { isFetching: isTopArtistsFetching } = useQuery({
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

    if (!username) {
      localStorage.removeItem("lastFmTopArtists");
    }

    setLastFmUsername(username);
  }, [isOpenLastFmDialog, username, setLastFmUsername]);

  const SetLastFmUser = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem("lastFmUsername", username);
    setIsOpenLastFmDialog(false);
  };

  return (
    <>
      <button
        type="button"
        title="Last.fm Options"
        tabIndex={0}
        className="flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-700"
        onClick={() => setIsOpenLastFmDialog(true)}
      >
        {isTopArtistsFetching ? (
          <LoadingAnimation />
        ) : (
          <>
            {username ? (
              <>
                <FaLastfm />
                <span>Last.fm</span>
                <FaCog />
              </>
            ) : (
              <>
                <FaLastfm />
                <span>Connect to Last.fm</span>
              </>
            )}
          </>
        )}
      </button>
      <Modal
        onClose={() => setIsOpenLastFmDialog(false)}
        open={isOpenLastFmDialog}
      >
        <form
          className="flex flex-col items-center justify-center gap-5"
          onSubmit={SetLastFmUser}
        >
          <label htmlFor="LastFmUsername">
            Input your username to get personalized Last.FM recommendations.
          </label>
          <input
            type="text"
            id="LastFmUsername"
            name="LastFmUsername"
            placeholder="Last.FM Username"
            value={username}
            tabIndex={0}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={SetLastFmUser}
          />
        </form>
      </Modal>
    </>
  );
}

export default ConnectLastFm;
