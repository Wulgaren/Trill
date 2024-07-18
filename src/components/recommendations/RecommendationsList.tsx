import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { memo, useCallback, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { DiscogsSearchRelease } from "../../types/Discogs/DiscogsTypes";
import Discogs from "../discogs/Discogs";
import { getNextPage, removeAsterisk } from "../functions/Functions";
import LastFm from "../lastfm/LastFM";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import SearchImage from "../search-image/SearchImage";

function RecommendationsListComponent({ title }: { title: string }) {
  const [startGenreNum, setStartGenreNum] = useState(
    Math.floor(Math.random() * 50 + 1),
  );

  console.log(startGenreNum);

  const {
    data: topAlbums,
    isError: isTopAlbumsError,
    isFetching: isTopAlbumsFetching,
    refetch: refetchTopAlbums,
  } = useQuery({
    queryKey: ["FavGenres", startGenreNum],
    queryFn: () => LastFm.GetFavGenreRecommendations({ startGenreNum }),
    refetchOnWindowFocus: false,
  });

  const {
    data: recs,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["FavGenresAlbumsSearch", topAlbums],
    queryFn: ({ pageParam = 1 }) =>
      Discogs.GetRecommendations({
        query: topAlbums,
        pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const nextPage = getNextPage(lastPage?.pagination) ?? 0;
      console.log("important", nextPage, lastPage);
      if (nextPage == null) {
        setStartGenreNum(Math.floor(Math.random() * 50));

        refetchTopAlbums();

        return nextPage + 1;
      }

      return nextPage;
    },
    initialPageParam: 1,
    enabled: !!(topAlbums && topAlbums?.length > 0),
  });

  const handleScrollToBottom = useCallback(() => {
    console.log("aa");
    return;
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

  return (
    <div className="rounded-md bg-white !bg-opacity-40 p-5 md:col-span-2 dark:bg-black dark:text-white">
      <h2 className="text-xl text-black dark:text-white">{title}:</h2>

      {(isFetching || isTopAlbumsFetching) && !recs && <LoadingAnimation />}
      {!isLoading && !(error || isTopAlbumsError) && !!recs?.pages[0] && (
        <>
          <div className="overflow-y-hidden overflow-x-scroll overscroll-contain">
            <InfiniteScroll
              element="ul"
              className="mt-3 flex flex-nowrap gap-10"
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
                .map((release, index) => {
                  return (
                    <li key={index} className="min-w-[180px]">
                      <Link
                        to="/result/$type/$id"
                        params={{
                          id: release.id.toString(),
                          type: release.type,
                        }}
                        title={release.title}
                      >
                        <div className="flex flex-col flex-nowrap items-center justify-center gap-3 text-center">
                          <div className="w-full">
                            <SearchImage
                              url={release.cover_image ?? ""}
                              title={release.title}
                              index={index}
                            />
                          </div>

                          <div className="flex flex-col">
                            <h3 className="relative break-words pb-1 text-xl text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white">
                              {removeAsterisk(release.title)}
                            </h3>
                            <span>
                              {(release as DiscogsSearchRelease).year}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
            </InfiniteScroll>
          </div>
        </>
      )}
    </div>
  );
}

const RecommendationsList = memo(RecommendationsListComponent);

export default RecommendationsList;
