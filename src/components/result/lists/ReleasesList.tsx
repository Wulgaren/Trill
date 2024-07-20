import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { memo, useCallback, useRef } from "react";
import {
  DiscogsArtist,
  DiscogsArtistMaster,
  DiscogsArtistRelease,
  DiscogsLabel,
  DiscogsLabelRelease,
} from "../../../types/Discogs/DiscogsTypes";
import Discogs from "../../discogs/Discogs";
import ErrorResult from "../../error-result/ErrorResult";
import { getNextPage, removeAsterisk } from "../../functions/Functions";
import LoadingAnimation from "../../loading-animation/LoadingAnimation";
import SearchImage from "../../search-image/SearchImage";
import NoSearchResult from "../../search/NoSearchResult";

function ReleasesListComponent({
  data,
  type,
}: {
  data: DiscogsArtist | DiscogsLabel;
  type: "artists" | "labels";
}) {
  const queryKey = type + "Releases";

  const {
    data: releases,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: [queryKey, data.id],
    queryFn: ({ pageParam = 1 }) =>
      Discogs.GetReleases({
        pageParam,
        id: data.id.toString(),
        requestType: queryKey,
      }),
    getNextPageParam: (lastPage) => {
      return getNextPage(lastPage.pagination);
    },
    initialPageParam: 1,
  });

  const parentRef = useRef<HTMLDivElement>(null);

  const releasesList =
    releases?.pages.flatMap(
      (page) =>
        page.releases as (
          | DiscogsArtistRelease
          | DiscogsArtistMaster
          | DiscogsLabelRelease
        )[],
    ) || [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? releasesList.length + 1 : releasesList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 127, // Estimate the height of each item
    overscan: 2, // Number of items to render beyond the viewport
    gap: 25,
  });

  const handleScrollToBottom = useCallback(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
    if (!lastItem) return;

    // If we've reached the end of the list, fetch the next page
    if (
      lastItem.index >= releasesList.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    fetchNextPage,
    releasesList.length,
    rowVirtualizer,
    isFetchingNextPage,
    hasNextPage,
  ]);

  return (
    <>
      {isFetching && !releases && <LoadingAnimation />}
      {!isLoading && !releasesList?.length && <NoSearchResult />}
      {!isLoading && !!releasesList?.length && (
        <div
          ref={parentRef}
          className="mt-3 max-h-96 overflow-auto overscroll-contain"
          onScroll={handleScrollToBottom}
        >
          <ul
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const isLoaderRow = virtualRow.index > releasesList.length - 1;
              const release = releasesList[virtualRow.index];

              return (
                <li
                  key={virtualRow.index}
                  className="absolute left-0 top-0 w-full"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {isLoaderRow ? (
                    hasNextPage ? (
                      <LoadingAnimation key={virtualRow.index} />
                    ) : (
                      ""
                    )
                  ) : (
                    <Link
                      to="/result/$type/$id"
                      params={{
                        id: release.id.toString(),
                        type:
                          (
                            release as
                              | DiscogsArtistRelease
                              | DiscogsArtistMaster
                          ).type ?? "release",
                      }}
                      title={release.title}
                    >
                      <div className="flex flex-col flex-wrap items-center justify-center gap-3 text-center md:flex-row md:flex-nowrap md:justify-start md:text-start">
                        <div className="flex aspect-square items-center justify-center md:w-2/12">
                          <SearchImage
                            url={release.thumb}
                            title={release.title}
                            index={virtualRow.index}
                          />
                        </div>

                        <div className="flex flex-col">
                          {(release as DiscogsArtistRelease).role != "Main" ? (
                            <span className="text-xs">
                              ({(release as DiscogsArtistRelease).role})
                            </span>
                          ) : (
                            ""
                          )}
                          {(type == "labels" ||
                            (release as DiscogsArtistRelease).role !=
                              "Main") && (
                            <h3 className="text-lg">
                              {removeAsterisk(release.artist)}
                            </h3>
                          )}
                          <h3 className="relative mx-2 ml-0 pb-1 text-xl text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white">
                            {release.title}
                          </h3>
                          {type == "labels" && (
                            <span className="text-sm">
                              {(release as DiscogsLabelRelease).format}
                            </span>
                          )}
                          {type == "labels" && (
                            <span className="pb-1 text-xs">
                              Catalog Number:
                              {(release as DiscogsLabelRelease).catno}
                            </span>
                          )}
                          <span>{release.year}</span>
                        </div>
                      </div>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {error && <ErrorResult />}
    </>
  );
}

const ReleasesList = memo(ReleasesListComponent);

export default ReleasesList;
