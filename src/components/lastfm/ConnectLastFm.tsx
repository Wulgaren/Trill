import { useQuery } from "@tanstack/react-query";
import { FocusEvent, FormEvent, useState } from "react";
import { FaCog, FaLastfm } from "react-icons/fa";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import Modal from "../modal/Modal";
import { useNavbarContext } from "../start-page/NavbarContextUtils";
import LastFm from "./LastFM";

function ConnectLastFm() {
  const [isOpenLastFmDialog, setIsOpenLastFmDialog] = useState<boolean>(false);
  const { lastFmUsername, setLastFmUsername, triggerClick } =
    useNavbarContext();

  const { isFetching: isTopArtistsFetching } = useQuery({
    queryKey: ["last_fm_top_artists"],
    queryFn: () => LastFm.GetUserArtist,
    enabled: !!(
      lastFmUsername &&
      !isOpenLastFmDialog &&
      !localStorage.lastFmTopArtists
    ),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsOpenLastFmDialog(false);
  };

  const SetLastFmUser = (e: FocusEvent<HTMLInputElement>) => {
    const username = e.target.value;

    if (username != localStorage.lastFmUsername) {
      localStorage.removeItem("lastFmTopArtists");
    }
    localStorage.setItem("lastFmUsername", username);
    setLastFmUsername(username);
    triggerClick();
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
            {lastFmUsername ? (
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
          onSubmit={handleSubmit}
        >
          <label htmlFor="LastFmUsername">
            Input your username to get personalized Last.FM recommendations.
          </label>
          <input
            type="text"
            id="LastFmUsername"
            name="LastFmUsername"
            placeholder="Last.FM Username"
            defaultValue={lastFmUsername}
            tabIndex={0}
            onBlur={SetLastFmUser}
          />
        </form>
      </Modal>
    </>
  );
}

export default ConnectLastFm;
