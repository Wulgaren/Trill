import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Discogs from "../discogs/Discogs";
import ErrorResult from "../error-result/ErrorResult";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import NoSearchResult from "./NoSearchResult";
import SearchResult from "./SearchResult";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
  const searchQueryKey = "searchQuery";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: [searchQueryKey, searchQuery],
    queryFn: ({ pageParam = 1 }) =>
      Discogs.Search({
        pageParam,
        queryKey: [searchQueryKey, searchQuery],
      }),
    getNextPageParam: (lastPage) => {
      const page = lastPage?.pagination?.page ?? 0;
      const allPages = lastPage?.pagination?.pages ?? 0;
      if (page == allPages) return null;
      return page + 1;
    },
    enabled: !!searchQuery,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(input);
  };

  return (
    <>
      <form className="flex w-full" onSubmit={handleSearch}>
        <input
          className="w-full"
          type="search"
          placeholder="Search for an artist or release..."
          tabIndex={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button tabIndex={5} type="submit">
          Search
        </button>
      </form>
      {isFetching && !data && <LoadingAnimation />}
      {error && <ErrorResult />}
      {!isLoading && searchQuery && !data?.pages[0]?.results?.length && (
        <NoSearchResult />
      )}
      {!isLoading && data?.pages[0]?.results?.length > 0 && (
        <SearchResult
          searchResults={data.pages.flatMap((page) => page.results)}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
    </>
  );
}

export default Search;
