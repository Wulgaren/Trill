import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import SearchImage from "../search-image/SearchImage";

function SearchResult({
  searchResults,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}) {
  const handleScrollToBottom = () => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <InfiniteScroll
      element="ul"
      className="relative grid auto-rows-[250px] grid-cols-[repeat(auto-fill,minmax(200px,1fr))] overflow-x-hidden p-5"
      pageStart={2}
      loadMore={handleScrollToBottom}
      hasMore={hasNextPage}
      loader={
        <li className="flex flex-col items-center justify-center p-2" key={0}>
          <LoadingAnimation />
        </li>
      }
    >
      {searchResults?.map((result, index) => {
        return (
          <li
            className="relative m-2 flex flex-col items-center justify-center overflow-hidden rounded-md border-2 border-transparent bg-white dark:bg-black"
            key={result.id}
            tabIndex={100 + index}
          >
            <a
              className="h-full w-full"
              href={result.resource_url}
              target="_blank"
            >
              <SearchImage result={result} />
              <p className="absolute bottom-0 w-full bg-white py-2 text-center text-black dark:bg-black dark:text-white">
                {result.title}
              </p>
            </a>
          </li>
        );
      })}
    </InfiniteScroll>
  );
}

export default SearchResult;
