import { Suspense, useMemo } from "react";
import { FaList } from "react-icons/fa";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import RecommendationsFriend from "../recommendations/Recommendations";
import RecommendationsCollection from "../recommendations/RecommendationsCollection";
import RecommendationsList from "../recommendations/RecommendationsList";
import RecommendationsTrending from "../recommendations/RecommendationsTrending";
import { useNavbarContext } from "./NavbarContextUtils";

function StartPage() {
  const { triggerClick, discogsUsername, lastFmUsername } = useNavbarContext();
  const savedInlocalStorage =
    localStorage.lastFmUsername != null && localStorage.discogsUser != null;

  // Memoize the existence check to avoid re-renders unless dependencies change
  const exists = useMemo(() => {
    return discogsUsername && lastFmUsername;
  }, [discogsUsername, lastFmUsername]);

  if (!exists && !savedInlocalStorage) {
    return (
      <div className="flex flex-col gap-5">
        <Suspense fallback={<LoadingAnimation />}>
          <RecommendationsTrending title="Trending artists" />
        </Suspense>

        <div
          onClick={triggerClick}
          className="flex flex-row items-center justify-center text-gray-600"
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
        <RecommendationsList title="Based on your favorite artists' genres" />
      </Suspense>

      <Suspense fallback={<LoadingAnimation />}>
        <RecommendationsCollection title="Based on your recent tracks" />
      </Suspense>

      <Suspense fallback={<LoadingAnimation />}>
        <RecommendationsFriend title="Lucky picks from your friend" />
      </Suspense>
    </div>
  );
}

export default StartPage;
