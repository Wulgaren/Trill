import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { memo, useRef, useState } from "react";
import { DiscogsSearchResult } from "../../types/Discogs/DiscogsTypes";
import {
  LastFMAlbumParams,
  LastFMPaginatedResponse,
} from "../../types/LastFm/LastFmTypes";
import { getNextPage } from "../functions/Functions";
import LastFm from "../lastfm/LastFM";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import LastFmAlbum from "./LastFmAlbum";

function RecommendationsDiscogsUserComponent({ title }: { title: string }) {
  const [startGenreNum] = useState(Math.floor(Math.random() * 50));
  const parentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["FavGenresAlbums", startGenreNum],
    queryFn: ({ pageParam = 1 }) =>
      LastFm.GetFriendTopAlbums({
        startGenreNum,
        pageParam: pageParam as number,
      }),
    getNextPageParam: (lastPage) => {
      return getNextPage(lastPage?.pagination);
    },
    initialPageParam: 1,
  });

  const recs =
    data?.pages?.flatMap((page) => page?.results)?.filter((x) => x != null) ||
    [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? recs.length + 1 : recs.length,
    horizontal: true,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180,
    overscan: 1,
    gap: 30,
  });

  const handleScroll = async () => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;

    // If we've reached the end of the list, fetch the next page
    if (
      lastItem.index >= recs.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      await fetchNextPage();
    }
  };

  //sprawdzic czy inview potrzebny jest
  //reszte infinite scrolling zamieniec

  const handleItemChange = (newValue: DiscogsSearchResult) => {
    // Use queryClient to update the query data
    queryClient.setQueryData<
      InfiniteData<
        LastFMPaginatedResponse<(LastFMAlbumParams | DiscogsSearchResult)[]>
      >
    >(["FavGenresAlbums", startGenreNum], (oldData) => {
      if (!oldData) return oldData;

      const newPages = {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          results: page.results.map((res) => {
            if (
              Object.prototype.hasOwnProperty.call(
                res as LastFMAlbumParams,
                "album",
              ) &&
              newValue?.title?.includes((res as LastFMAlbumParams).album) &&
              newValue?.title?.includes((res as LastFMAlbumParams).artist)
            ) {
              return newValue;
            } else return res;
          }),
        })),
      };

      return newPages;
    });
  };

  if ((!isLoading && !hasNextPage && !recs.length) || error) {
    return <></>;
  }

  return (
    <div className="rounded-md bg-white !bg-opacity-40 p-5 pb-0 md:col-span-2 dark:bg-black dark:text-white">
      <h2 className="text-xl text-black dark:text-white">
        {title} ({data?.pages[0]?.info}):
      </h2>

      {isFetching && !recs?.length && <LoadingAnimation />}
      {!isLoading && !error && !!recs.length && (
        <div
          ref={parentRef}
          onScroll={handleScroll}
          className="h-80 w-full overflow-y-hidden overflow-x-scroll overscroll-contain"
        >
          <ul
            className="relative my-3 h-full"
            style={{ width: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const isLoaderRow = virtualItem.index > recs.length - 1;

              return (
                <div
                  key={virtualItem.index}
                  className="absolute left-0 top-0 flex h-full items-center justify-center"
                  style={{
                    width: virtualItem.size,
                    transform: `translateX(${virtualItem.start}px)`,
                  }}
                >
                  {isLoaderRow ? (
                    hasNextPage ? (
                      <LoadingAnimation key={virtualItem.index} />
                    ) : (
                      ""
                    )
                  ) : (
                    <LastFmAlbum
                      release={recs[virtualItem.index]}
                      handleItemChange={handleItemChange}
                    />
                  )}
                </div>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

const RecommendationsDiscogsUser = memo(RecommendationsDiscogsUserComponent);

export default RecommendationsDiscogsUser;
