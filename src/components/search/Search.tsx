import { useInfiniteQuery } from "@tanstack/react-query";
import { UseNavigateResult } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { DiscogsSearchQuery } from "../../types/Discogs/DiscogsTypes";
import Discogs from "../discogs/Discogs";
import ErrorResult from "../error-result/ErrorResult";
import { hasMorePages } from "../functions/Functions";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import NoSearchResult from "./NoSearchResult";
import SearchInput from "./SearchInput";
const SearchResult = lazy(() => import("./SearchResult"));

function Search({
  params,
  navigate,
}: {
  params: DiscogsSearchQuery;
  navigate: UseNavigateResult<"/search">;
}) {
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
      return hasMorePages(lastPage);
    },
    enabled: !!params?.query,
  });

  return (
    <>
      <SearchInput params={params} navigate={navigate} />
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
