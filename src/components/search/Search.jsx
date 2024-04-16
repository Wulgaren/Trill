import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import LastFm from "../lastfm/LastFm";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import SearchResult from "./SearchResult";

function Search() {
  const [artist, setArtist] = useState("");
  const [input, setInput] = useState("");
  const searchQueryKey = "lastFmSearchedArtists";

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
      LastFm.SearchForArtist({ pageParam, queryKey: [searchQueryKey, artist] }),
    getNextPageParam: (lastPage, allPages) => {
      const page = allPages?.length ?? 0;
      return page + 1;
    },
    enabled: !!artist,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setArtist(input);
  };

  return (
    <>
      <form className="flex w-full" onSubmit={handleSearch}>
        <input
          className="w-full"
          type="search"
          placeholder="Search for an artist..."
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
          artists={data.pages.flatMap((page) => page)}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      )}
    </>
  );
}

export default Search;
