import { useInfiniteQuery } from "@tanstack/react-query";
import { UseNavigateResult } from "@tanstack/react-router";
import { FormEvent, Suspense, lazy, useRef } from "react";
import { DiscogsSearchQuery } from "../../types/Discogs/DiscogsTypes";
import Discogs from "../discogs/Discogs";
import ErrorResult from "../error-result/ErrorResult";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import NoSearchResult from "./NoSearchResult";
const SearchResult = lazy(() => import("./SearchResult"));

function Search({
  params,
  navigate,
}: {
  params: DiscogsSearchQuery;
  navigate: UseNavigateResult<"/search">;
}) {
  console.log(params);
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
    queryKey: [searchQueryKey, params],
    queryFn: ({ pageParam = 1 }) =>
      Discogs.Search({
        pageParam,
        queryKey: [searchQueryKey, params],
      }),
    getNextPageParam: (lastPage) => {
      const page = lastPage?.pagination?.page ?? 0;
      const allPages = lastPage?.pagination?.pages ?? 0;
      if (page == allPages) return null;
      return page + 1;
    },
    enabled: !!params?.query,
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchInput?.current?.value)
      navigate({
        search: (prev) => ({ ...prev, query: searchInput?.current?.value }),
      });
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
      {!isLoading && params?.query && !data?.pages[0]?.results?.length && (
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
