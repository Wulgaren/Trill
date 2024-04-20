import React, { useState } from "react";
import { FaCompactDisc } from "react-icons/fa";
import LoadingAnimation from "../loading-animation/LoadingAnimation";

function SearchImage({ result }) {
  const [loading, setLoading] = useState(true);

  if (!result?.thumb?.length)
    return (
      <FaCompactDisc
        size={50}
        className="h-full w-full object-cover p-5 pb-12 opacity-70"
      />
    );

  return (
    <>
      {loading && <LoadingAnimation />}
      <img
        onLoad={() => setLoading(false)}
        className="h-full w-full object-cover"
        src={result.cover_image}
        alt={result.name + " Image"}
      />
    </>
  );
}

export default SearchImage;
