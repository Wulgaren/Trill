import { useEffect, useState } from "react";
import { FaList } from "react-icons/fa";
import { useNavbarContext } from "./NavbarContextUtils";

function StartPage() {
  const { triggerClick, discogsUsername, lastFmUsername } = useNavbarContext();
  const [exists, setExists] = useState(false);
  const savedInlocalStorage =
    localStorage.lastFmUsername != null && localStorage.discogsUser != null;

  useEffect(() => {
    setExists(discogsUsername != null && lastFmUsername != null);
  }, [discogsUsername, lastFmUsername]);

  if (!exists && !savedInlocalStorage) {
    return (
      <div
        onClick={triggerClick}
        className="m-3 mx-auto flex size-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-full border-white bg-gray-200 bg-opacity-25 p-5 text-center text-lg text-gray-600 dark:text-white"
      >
        <FaList size={60} className="p-3" />
        <span>
          Connect to Discogs and Last.fm for personalized recommendations.
        </span>
      </div>
    );
  }

  return <div>{/* <RecommendationsList title="fav-artists" /> */}</div>;
}

export default StartPage;
