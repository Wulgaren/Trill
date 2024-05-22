import { useInfiniteQuery } from "@tanstack/react-query";
import { UseNavigateResult } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { DiscogsSearchQuery } from "../../types/Discogs/DiscogsTypes";
import Discogs from "../discogs/Discogs";
import ErrorResult from "../error-result/ErrorResult";
import { getNextPage } from "../functions/Functions";
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
  const searchActive = Object.values(params)?.filter((x) => x)?.length > 0;

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
      return getNextPage(lastPage);
    },
    initialPageParam: 1,
    enabled: !!searchActive,
  });

  return (
    <>
      <SearchInput params={params} navigate={navigate} />
      {isFetching && !data && <LoadingAnimation />}
      {!isLoading && searchActive && !data?.pages[0]?.results?.length && (
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

      {error && <ErrorResult />}
    </>
  );
}

export default Search;
