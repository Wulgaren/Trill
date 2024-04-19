import React, { useState } from "react";
import defaultArtistImage from "../../assets/img/default_artist.webp";
import LoadingAnimation from "../loading-animation/LoadingAnimation";

function SearchImage({ result }) {
  const [loading, setLoading] = useState(true);

  let imgUrl =
    result?.thumb?.length > 0 ? result.cover_image : defaultArtistImage;

  return (
    <>
      {loading && <LoadingAnimation />}
      <img
        onLoad={() => setLoading(false)}
        className="h-full w-full object-cover"
        src={imgUrl}
        alt={result.name + " Image"}
      />
    </>
  );
}

export default SearchImage;
