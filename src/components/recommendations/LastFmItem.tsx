import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useInView } from "react-intersection-observer";
import {
  DiscogsSearchRelease,
  DiscogsSearchResult,
} from "../../types/Discogs/DiscogsTypes";
import { LastFMItemParams } from "../../types/LastFm/LastFmTypes";
import Discogs from "../discogs/Discogs";
import {
  matchesLastFmTitle,
  removeAsterisk,
  removeNumberFromName,
} from "../functions/Functions";
import SearchImage from "../search-image/SearchImage";

function LastFmItem({
  lastFmItem,
  handleItemChange,
}: {
  lastFmItem: LastFMItemParams | DiscogsSearchResult;
  handleItemChange: (newValue: DiscogsSearchResult) => void;
}) {
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    rootMargin: "0px 50px 200px 0px",
  });

  const isArtist =
    ((lastFmItem as LastFMItemParams).artist &&
      !(lastFmItem as LastFMItemParams).album) ||
    (lastFmItem as DiscogsSearchResult).type == "artist";

  let title =
    (lastFmItem as LastFMItemParams).artist +
    ((lastFmItem as LastFMItemParams).album
      ? " - " + (lastFmItem as LastFMItemParams).album
      : "");

  const { data: discogsRelease, isError } = useQuery({
    queryKey: ["DiscogsLastFmSearch", lastFmItem, isArtist, title],
    queryFn: async () => {
      const result = await Discogs.Search({
        searchParams: {
          query: title,
          type: isArtist ? "artist" : "master",
        },
        pageParam: 1,
      });

      const item = matchesLastFmTitle(
        isArtist,
        result?.results,
        lastFmItem as LastFMItemParams,
      );

      if (item) handleItemChange(item);

      return result;
    },
    refetchOnWindowFocus: false,
    enabled: !!((lastFmItem as LastFMItemParams).artist && inView),
  });

  const item =
    matchesLastFmTitle(
      isArtist,
      discogsRelease?.results,
      lastFmItem as LastFMItemParams,
    ) ?? (lastFmItem as DiscogsSearchResult);

  if (item?.title) title = item.title;

  return (
    <li className="h-full min-w-[180px]" ref={inViewRef}>
      <Link
        to={isError || !item?.id ? "/search" : "/result/$type/$id"}
        params={
          isError || !item?.id
            ? {}
            : {
                id: item?.id ? item.id.toString() : "-1",
                type: item?.type ?? "release",
              }
        }
        search={
          isError || !item?.id
            ? {
                query: title,
                type: isArtist ? "artist" : "master",
              }
            : {}
        }
        title={title}
      >
        <div className="flex flex-col flex-nowrap items-center justify-center gap-3 text-center">
          <div className="flex h-48 w-full justify-center">
            <SearchImage url={item?.cover_image ?? ""} title={title} />
          </div>

          <div className="flex flex-col">
            <h3 className="relative line-clamp-2 text-ellipsis break-words text-lg text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white">
              {removeNumberFromName(removeAsterisk(title))}
            </h3>
            {(item as DiscogsSearchRelease)?.year && (
              <span className="text-md">
                {(item as DiscogsSearchRelease)?.year}
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

export default LastFmItem;
