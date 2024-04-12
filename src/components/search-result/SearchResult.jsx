import React, { useEffect, useState } from "react";
import ArtistImage from "../artist-image/ArtistImage";
import { UseSearchContext } from "../search/SearchProvider";

function SearchResult() {
  const { artist, artists, handleSearch } = UseSearchContext();

  let page = 1;
  let loadMore = true;

  useEffect(() => {
    const handleScroll = () => {
      let pxToBottom =
        document.body.offsetHeight - (window.innerHeight + window.scrollY);

      if (loadMore && pxToBottom < 0) {
        handleScrollToBottom();
      }
    };

    const handleScrollToBottom = async () => {
      loadMore = false;
      page++;
      await handleSearch(page);
      loadMore = true;
    };

    window.addEventListener("scroll", handleScroll);

    // Remove scroll event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [artist, artists]);

  const [imageLoading, setImageLoading] = useState({});

  if (artists[0] == "loading") {
    return <p>Loading...</p>;
  }

  return (
    <ul className="grid grid-cols-4 p-5">
      {artists?.map((artist, index) => {
        const isLoading = imageLoading[artist.mbid] || false;

        return (
          <li
            className="flex flex-col justify-center items-center p-2"
            key={artist.mbid + index}
            tabIndex={5 + index}
          >
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                <ArtistImage
                  artist={artist}
                  setImageLoading={setImageLoading}
                />
                <a className="text-center" href={artist.url}>
                  {artist.name}
                </a>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default SearchResult;
