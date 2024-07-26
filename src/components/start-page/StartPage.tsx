import { lazy, Suspense, useMemo } from "react";
import { FaList } from "react-icons/fa";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import { useNavbarContext } from "./NavbarContextUtils";
const Recommendations = lazy(
  () => import("../recommendations/Recommendations"),
);

function StartPage() {
  const { triggerClick, discogsUsername, lastFmUsername } = useNavbarContext();
  const savedInlocalStorage =
    localStorage.lastFmUsername && localStorage.discogsUser;

  // Memoize the existence check to avoid re-renders unless dependencies change
  const exists = useMemo(() => {
    return discogsUsername && lastFmUsername;
  }, [discogsUsername, lastFmUsername]);

  if (!exists && !savedInlocalStorage) {
    return (
      <div className="flex flex-col gap-5">
        <Suspense fallback={<LoadingAnimation />}>
          <Recommendations title="Trending artists" type="TrendingArtists" />
        </Suspense>

        <div
          onClick={triggerClick}
          className="flex flex-row items-center justify-center text-gray-600 dark:text-white"
        >
          <FaList size={48} className="p-3" />
          <span>
            Connect to Discogs and Last.fm for personalized recommendations.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Suspense fallback={<LoadingAnimation />}>
        <Recommendations
          title="Based on your favorite artists' genres"
          type="FavGenresAlbums"
        />
      </Suspense>

      <Suspense fallback={<LoadingAnimation />}>
        <Recommendations
          title="Lucky picks from your friend"
          type="FriendAlbums"
        />
      </Suspense>

      <Suspense fallback={<LoadingAnimation />}>
        <Recommendations
          title="Based on your recent tracks"
          type="RecentTracks"
        />
      </Suspense>
    </div>
  );
}

export default StartPage;
