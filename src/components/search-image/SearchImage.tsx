import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { FaCompactDisc } from "react-icons/fa";
import type { DiscogsSearchResult } from "../../types/Discogs/DiscogsTypes";
import LoadingAnimation from "../loading-animation/LoadingAnimation";

function SearchImage({
  result,
  index,
}: {
  result: DiscogsSearchResult;
  index: number;
}) {
  const { data, error, isFetching } = useQuery({
    queryKey: ["ResultImage", result.id],
    queryFn: async () => {
      const res = await fetch(result.cover_image);
      if (!res.ok) throw new Error("Error downloading image.");

      const blob = await res?.blob();
      if (blob.size <= 0) throw new Error("Error image.");

      const url = URL.createObjectURL(blob);
      return url;
    },
    retryDelay: 5000 + 100 * (index + 1),
    enabled: !!result?.thumb,
  });

  if (!result?.thumb || error)
    return (
      <FaCompactDisc
        size={50}
        className="h-full w-full object-cover p-5 pb-12 opacity-70"
      />
    );

  if (isFetching) return <LoadingAnimation />;

  return (
    <>
      <img
        className="h-full w-full object-cover"
        src={data}
        loading="lazy"
        alt={result.title + " Image"}
      />
    </>
  );
}

const MemoizedSearchImage = memo(SearchImage);

export default MemoizedSearchImage;
