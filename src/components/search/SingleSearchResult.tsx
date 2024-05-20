import { Link } from "@tanstack/react-router";
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
    <li className="relative flex flex-col items-center justify-center rounded-md bg-white bg-opacity-40 shadow-sm backdrop-blur-sm dark:bg-black">
      <Link
        to={`/result/$type/$id`}
        params={{
          id: result.id.toString(),
          type: result.type,
        }}
        className="h-full w-full overflow-clip"
        alt={"Page for " + result.title}
      >
        <SearchImage result={result} index={index} />
        <p className="absolute bottom-0 w-full rounded-bl-md rounded-br-md bg-white bg-opacity-40 p-2 text-center text-black backdrop-blur-sm dark:bg-black dark:text-white">
          {result.title}
        </p>
      </Link>
    </li>
  );
}

const SingleSearchResult = memo(SingleSearchResultComponent);

export default SingleSearchResult;
