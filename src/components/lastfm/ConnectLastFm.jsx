import React, { useState } from "react";
import { FaCog } from "react-icons/fa";
import Modal from "../modal/Modal";
import LastFm from "./LastFm";

function ConnectLastFm({}) {
  const [isOpenLastFmDialog, setIsOpenLastFmDialog] = useState(false);

  const username = localStorage.lastFmUsername ?? "";

  const inputText = username ? (
    <>
      <FaCog /> Last.fm
    </>
  ) : (
    "Connect to Last.fm"
  );

  if (username) LastFm.GetUserArtist();

  const SetLastFmUser = (e) => {
    e.preventDefault();
    let username = e?.target?.querySelector("input")?.value ?? "";
    if (!username) return;

    localStorage.setItem("lastFmUsername", username);
    setIsOpenLastFmDialog(false);
    LastFm.GetUserArtist();
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
        {inputText}
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
            defaultValue={username}
            tabIndex={10}
            onBlur={SetLastFmUser}
          />
        </form>
      </Modal>
    </>
  );
}

export default ConnectLastFm;
