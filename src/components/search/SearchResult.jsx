import React, { useCallback } from "react";
import InfiniteScroll from "react-infinite-scroller";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import SingleSearchResult from "./SingleSearchResult";

function SearchResult({
  searchResults,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
}) {
  const handleScrollToBottom = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

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
          <SingleSearchResult key={result.id} result={result} index={index} />
        );
      })}
    </InfiniteScroll>
  );
}

export default SearchResult;
