import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useInView } from "react-intersection-observer";
import { DiscogsSearchRelease } from "../../types/Discogs/DiscogsTypes";
import { LastFMAlbumParams } from "../../types/LastFm/LastFmTypes";
import Discogs from "../discogs/Discogs";
import { removeAsterisk, removeNumberFromName } from "../functions/Functions";
import SearchImage from "../search-image/SearchImage";

function LastFmAlbum({
  release: lastFmRelease,
}: {
  release: LastFMAlbumParams;
}) {
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    rootMargin: "0px 200px 0px 0px",
  });

  const { data: release, isError } = useQuery({
    queryKey: ["DiscogsAlbumSearch", lastFmRelease.album, lastFmRelease.artist],
    queryFn: () =>
      Discogs.Search({
        searchParams: {
          query: lastFmRelease.album + " " + lastFmRelease.artist,
        },
        pageParam: 1,
      }),
    refetchOnWindowFocus: false,
    enabled: !!inView,
  });

  return (
    <li className="h-full min-w-[180px]" ref={inViewRef}>
      <Link
        to={isError ? "/search" : "/result/$type/$id"}
        params={
          isError
            ? {}
            : {
                id: release?.results[0]?.id
                  ? release?.results[0].id.toString()
                  : "-1",
                type: release?.results[0]?.type ?? "release",
              }
        }
        search={
          isError
            ? { query: lastFmRelease.album + " " + lastFmRelease.artist }
            : {}
        }
        title={release?.results[0]?.title ?? lastFmRelease.album}
      >
        <div className="flex flex-col flex-nowrap items-center justify-center gap-3 text-center">
          <div className="flex h-48 w-full justify-center">
            <SearchImage
              url={release?.results[0]?.cover_image ?? ""}
              title={release?.results[0]?.title ?? lastFmRelease.album}
            />
          </div>

          <div className="flex flex-col">
            <h3 className="relative line-clamp-2 text-ellipsis break-words text-lg text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white">
              {removeNumberFromName(
                removeAsterisk(
                  release?.results[0]?.title ??
                    lastFmRelease.artist + " - " + lastFmRelease.album,
                ),
              )}
            </h3>
            {(release?.results[0] as DiscogsSearchRelease)?.year && (
              <span className="text-md">
                {(release?.results[0] as DiscogsSearchRelease)?.year}
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

export default LastFmAlbum;
