import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Discogs from "../discogs/Discogs";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
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
    error,
  } = useInfiniteQuery({
    queryKey: [searchQueryKey],
    queryFn: ({ pageParam = 1 }) =>
      Discogs.Search({
        pageParam,
        queryKey: [searchQueryKey, searchQuery],
      }),
    getNextPageParam: (lastPage, allPages) => {
      const page = lastPage?.pagination?.page ?? 0;
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
      {error && <div>Error fetching data.</div>}
      {data && (
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
