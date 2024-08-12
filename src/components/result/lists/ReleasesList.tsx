import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { memo, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroller";
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

  const handleScrollToBottom = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

  return (
    <>
      {isFetching && !releases && <LoadingAnimation />}
      {!isLoading && !releases?.pages[0]?.releases?.length && (
        <NoSearchResult />
      )}
      {!isLoading && !!releases?.pages[0]?.releases?.length && (
        <div className="overflow-scroll overscroll-contain">
          <InfiniteScroll
            element="ul"
            className="mt-3 grid max-h-96 gap-5"
            pageStart={2}
            loadMore={handleScrollToBottom}
            hasMore={hasNextPage}
            useWindow={false}
            loader={
              <li
                className="flex flex-col items-center justify-center p-2"
                key={0}
              >
                <LoadingAnimation />
              </li>
            }
          >
            {releases?.pages
              ?.flatMap(
                (page) =>
                  page.releases as (
                    | DiscogsArtistRelease
                    | DiscogsArtistMaster
                    | DiscogsLabelRelease
                  )[],
              )
              .map((release, index) => {
                return (
                  <li key={index}>
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
                      <div className="flex flex-col flex-wrap items-center justify-center gap-3 text-center sm:flex-row sm:flex-nowrap sm:justify-start sm:text-start">
                        <div className="flex aspect-square max-w-40 items-center justify-center sm:w-2/12">
                          <SearchImage
                            url={release.thumb}
                            title={release.title}
                            index={index}
                          />
                        </div>

                        <div className="flex flex-col">
                          {!!(
                            (release as DiscogsArtistRelease).role &&
                            (release as DiscogsArtistRelease).role != "Main"
                          ) && (
                            <span className="text-xs">
                              ({(release as DiscogsArtistRelease).role})
                            </span>
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
                  </li>
                );
              })}
          </InfiniteScroll>
        </div>
      )}

      {error && <ErrorResult />}
    </>
  );
}

const ReleasesList = memo(ReleasesListComponent);

export default ReleasesList;
