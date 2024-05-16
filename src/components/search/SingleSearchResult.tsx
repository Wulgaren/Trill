import { memo } from "react";
import { DiscogsSearchResult } from "../../types/Discogs/DiscogsTypes";
import SearchImage from "../search-image/SearchImage";

function SingleSearchResultComponent({
  result,
  index,
}: {
  result: DiscogsSearchResult;
  index: number;
}) {
  return (
    <li
      className="relative m-2 flex flex-col items-center justify-center overflow-hidden rounded-md border-2 border-transparent bg-white dark:bg-black"
      tabIndex={0}
    >
      <a
        className="h-full w-full"
        href={result.resource_url}
        target="_blank"
        rel="noreferrer"
      >
        <SearchImage result={result} index={index} />
        <p className="absolute bottom-0 w-full bg-white py-2 text-center text-black dark:bg-black dark:text-white">
          {result.title}
        </p>
      </a>
    </li>
  );
}

const SingleSearchResult = memo(SingleSearchResultComponent);

export default SingleSearchResult;
