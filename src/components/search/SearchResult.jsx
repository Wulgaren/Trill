import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import ArtistImage from "../artist-image/ArtistImage";
import LoadingAnimation from "../loading-animation/LoadingAnimation";

function SearchResult({
  artists,
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
      className="relative grid auto-rows-[250px] grid-cols-[repeat(auto-fill,minmax(200px,1fr))] p-5"
      pageStart={2}
      loadMore={handleScrollToBottom}
      hasMore={hasNextPage}
      loader={
        <li className="flex flex-col items-center justify-center p-2" key={0}>
          <LoadingAnimation />
        </li>
      }
    >
      {artists?.map((artist, index) => {
        return (
          <li
            className="relative m-2 flex flex-col items-center justify-center overflow-hidden rounded-md border-2 border-transparent bg-white dark:bg-black"
            key={artist.mbid + index}
            tabIndex={100 + index}
          >
            <a className="h-full w-full" href={artist.url} target="_blank">
              <ArtistImage artist={artist} />
              <p className="absolute bottom-0 w-full bg-white py-2 text-center text-black dark:bg-black dark:text-white">
                {artist.name}
              </p>
            </a>
          </li>
        );
      })}
    </InfiniteScroll>
  );
}

export default SearchResult;
