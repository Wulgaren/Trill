import { useInfiniteQuery } from "@tanstack/react-query";
import { memo, useCallback, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { getNextPage } from "../functions/Functions";
import LastFm from "../lastfm/LastFM";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import LastFmAlbum from "./LastFmAlbum";

function RecommendationsListComponent({ title }: { title: string }) {
  const [startGenreNum] = useState(Math.floor(Math.random() * 50));

  console.log(startGenreNum);

  const {
    data: recs,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["FavGenresAlbums", startGenreNum],
    queryFn: ({ pageParam = 1 }) =>
      LastFm.GetFavGenreRecommendations({ startGenreNum, pageParam }),
    getNextPageParam: (lastPage) => {
      console.log(lastPage);
      return;
      return getNextPage(lastPage?.pagination);
    },
    initialPageParam: 1,
  });

  const handleScrollToBottom = useCallback(() => {
    console.log("aa");
    return;
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

  return (
    <div className="rounded-md bg-white !bg-opacity-40 p-5 pb-0 md:col-span-2 dark:bg-black dark:text-white">
      <h2 className="text-xl text-black dark:text-white">{title}:</h2>

      {isFetching && !recs && <LoadingAnimation />}
      {!isLoading && !error && !!recs?.pages[0] && (
        <>
          <div className="overflow-y-hidden overflow-x-scroll overscroll-contain">
            <InfiniteScroll
              element="ul"
              className="my-3 flex flex-nowrap gap-10"
              pageStart={2}
              loadMore={handleScrollToBottom}
              hasMore={hasNextPage}
              useWindow={false}
              loader={
                <li
                  className="flex flex-row items-center justify-center p-2"
                  key={0}
                >
                  <LoadingAnimation />
                </li>
              }
            >
              {recs?.pages
                ?.flatMap((page) => page?.results)
                .filter((x) => x != null)
                .map((release, index) => (
                  <LastFmAlbum key={index} release={release} />
                ))}
            </InfiniteScroll>
          </div>
        </>
      )}
    </div>
  );
}

const RecommendationsList = memo(RecommendationsListComponent);

export default RecommendationsList;
