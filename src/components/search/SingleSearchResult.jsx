import React, { memo } from "react";
import SearchImage from "../search-image/SearchImage";

function SingleSearchResult({ result, index }) {
  return (
    <li
      className="relative m-2 flex flex-col items-center justify-center overflow-hidden rounded-md border-2 border-transparent bg-white dark:bg-black"
      tabIndex={0}
    >
      <a className="h-full w-full" href={result.resource_url} target="_blank">
        <SearchImage result={result} />
        <p className="absolute bottom-0 w-full bg-white py-2 text-center text-black dark:bg-black dark:text-white">
          {result.title}
        </p>
      </a>
    </li>
  );
}

export default memo(SingleSearchResult);
