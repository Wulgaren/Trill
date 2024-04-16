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
      className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] auto-rows-[250px] p-5 relative"
      pageStart={2}
      loadMore={handleScrollToBottom}
      hasMore={hasNextPage}
      loader={
        <li className="flex flex-col justify-center items-center p-2" key={0}>
          <LoadingAnimation />
        </li>
      }
    >
      {artists?.map((artist, index) => {
        return (
          <li
            className="flex flex-col justify-center items-center m-2 rounded-md border-2 bg-white dark:bg-black border-transparent relative overflow-hidden"
            key={artist.mbid + index}
            tabIndex={100 + index}
          >
            <a className="w-full h-full" href={artist.url} target="_blank">
              <ArtistImage artist={artist} />
              <p className="text-center absolute bg-white text-black dark:bg-black dark:text-white w-full bottom-0 py-2">
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
