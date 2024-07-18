import { useQuery } from "@tanstack/react-query";
import { memo } from "react";
import { FaCompactDisc } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import LoadingAnimation from "../loading-animation/LoadingAnimation";

function SearchImage({
  url,
  title = "",
  index = 0,
  className = "object-cover w-full h-full rounded-md",
}: {
  url: string;
  title?: string;
  index?: number;
  className?: string;
}) {
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    rootMargin: "0px 0px 200px 0px",
  });

  const { data, error, isFetching } = useQuery({
    queryKey: ["ResultImage", url],
    queryFn: async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Error downloading image.");

      const blob = await res.blob();
      if (blob.size <= 0) throw new Error("Error image.");

      const objectUrl = URL.createObjectURL(blob);
      return objectUrl;
    },
    retryDelay: 5000 + 100 * (index + 1),
    enabled: !!(url && inView),
  });

  if (!url || error) {
    return (
      <FaCompactDisc
        size={50}
        className={`p-5 pb-12 opacity-70 ${className}`}
      />
    );
  }

  if (isFetching) {
    return <LoadingAnimation />;
  }

  return (
    <img
      ref={inViewRef}
      className={`${className}`}
      src={data}
      loading="lazy"
      alt={title + " Image"}
    />
  );
}

const MemoizedSearchImage = memo(SearchImage);

export default MemoizedSearchImage;
