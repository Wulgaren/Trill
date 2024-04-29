import { useInfiniteQuery } from "@tanstack/react-query";
import { FormEvent, Suspense, lazy, useRef, useState } from "react";
import Discogs from "../discogs/Discogs";
import ErrorResult from "../error-result/ErrorResult";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import NoSearchResult from "./NoSearchResult";
const SearchResult = lazy(() => import("./SearchResult"));

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
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

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput.current) setSearchQuery(searchInput.current.value);
  };

  return (
    <>
      <form className="flex w-full" onSubmit={handleSearch}>
        <input
          ref={searchInput}
          className="w-full"
          type="search"
          placeholder="Search for an artist, release or a label..."
          tabIndex={0}
        />
        <button tabIndex={0} type="submit">
          Search
        </button>
      </form>
      {isFetching && !data && <LoadingAnimation />}
      {error && <ErrorResult />}
      {!isLoading && searchQuery && !data?.pages[0]?.results?.length && (
        <NoSearchResult />
      )}
      {!isLoading && !!data?.pages[0]?.results?.length && (
        <Suspense fallback={<LoadingAnimation />}>
          <SearchResult
            searchResults={data?.pages
              .flatMap((page) => page.results)
              .filter(
                (result, index, self) =>
                  self.findIndex((r) => r.id === result.id) === index,
              )}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        </Suspense>
      )}
    </>
  );
}

export default Search;
