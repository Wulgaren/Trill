import { useInfiniteQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useCallback } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { DiscogsLabel } from "../../types/Discogs/DiscogsTypes";
import CollapsibleText from "../collapsible-text/CollapsibleText";
import Discogs from "../discogs/Discogs";
import ErrorResult from "../error-result/ErrorResult";
import {
  convertHTMLTags,
  getNextPage,
  removeAsterisk,
  removeNumberFromName,
  removeTags,
} from "../functions/Functions";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import SearchImage from "../search-image/SearchImage";
import NoSearchResult from "../search/NoSearchResult";
import DataList from "./DataList";

function LabelPage({ data }: { data: DiscogsLabel }) {
  console.log(data);

  const queryKey = "labelReleases";

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
      Discogs.GetLabelReleases({
        pageParam,
        queryKey: [queryKey, data.id.toString()],
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
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-row flex-wrap gap-3 md:flex-nowrap">
        {data?.images?.[0]?.resource_url && (
          <div className="mx-auto max-w-md">
            <SearchImage
              url={data?.images?.[0]?.resource_url}
              title={data.name}
              className="rounded-lg object-contain"
            />
          </div>
        )}

        <div className="w-full rounded-md bg-white !bg-opacity-40 p-5 dark:bg-black dark:text-white">
          <h1 className="mb-3 break-words text-4xl">{data.name}</h1>

          {data.profile && (
            <CollapsibleText
              text={convertHTMLTags(
                removeNumberFromName(removeTags(data.profile)),
              )}
              maxLength={350}
            />
          )}
        </div>
      </div>

      {(data.sublabels || data.urls) && (
        <div className="flex flex-col rounded-md bg-white !bg-opacity-40 p-5 md:col-span-2 dark:bg-black dark:text-white">
          {data.sublabels && (
            <DataList
              title="Sublabel"
              titleAs={"h2"}
              isLink={true}
              items={data.sublabels}
              type="label"
            />
          )}

          {data.urls && (
            <DataList
              title="Site"
              titleAs={"h3"}
              isLink={true}
              items={data.urls}
              className="mt-3"
            />
          )}
        </div>
      )}

      <div className="rounded-md bg-white !bg-opacity-40 p-5 md:col-span-2 dark:bg-black dark:text-white">
        <h2 className="text-xl">Releases:</h2>

        {isFetching && !data && <LoadingAnimation />}
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
                ?.flatMap((page) => page.releases)
                .map((release, index) => {
                  return (
                    <li key={index}>
                      <Link
                        to="/result/$type/$id"
                        params={{
                          id: release.id.toString(),
                          type: "release",
                        }}
                      >
                        <div className="flex flex-row flex-wrap items-center justify-center gap-3 text-center md:flex-nowrap md:justify-start md:text-start">
                          <div className="md:w-2/12">
                            <SearchImage
                              url={release.thumb}
                              title={release.title}
                              index={index}
                            />
                          </div>

                          <div className="flex flex-col">
                            <h3 className="text-lg">
                              {removeAsterisk(release.artist)}
                            </h3>
                            <h3 className="relative mx-2 ml-0 pb-1 text-xl text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white">
                              {release.title}
                            </h3>
                            <span className="text-sm">{release.format}</span>
                            <span className="pb-1 text-xs">
                              Catalog Number: {release.catno}
                            </span>
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
      </div>
    </div>
  );
}

export default LabelPage;
