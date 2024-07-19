import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useInView } from "react-intersection-observer";
import { DiscogsSearchRelease } from "../../types/Discogs/DiscogsTypes";
import { LastFMAlbumParams } from "../../types/LastFm/LastFmTypes";
import Discogs from "../discogs/Discogs";
import { removeAsterisk } from "../functions/Functions";
import SearchImage from "../search-image/SearchImage";

function LastFmAlbum({
  release: lastFmRelease,
}: {
  release: LastFMAlbumParams;
}) {
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    rootMargin: "0px 0px 200px 0px",
  });

  const {
    data: release,
    isError,
    isFetching,
  } = useQuery({
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

  if (isFetching || isError || !release || !release?.results[0])
    return (
      <li className="min-w-[180px]" ref={inViewRef}>
        <div className="flex flex-col flex-nowrap items-center justify-center gap-3 text-center">
          <div className="w-full">
            <SearchImage url={""} title={lastFmRelease.album} />
          </div>

          <div className="flex flex-col">
            <h3 className="relative break-words pb-1 text-xl text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white">
              {lastFmRelease.artist + " - " + lastFmRelease.album}
            </h3>
          </div>
        </div>
      </li>
    );

  //todo obsluga bledu zeby wyszukiwal przy kliknieciu

  return (
    <li className="min-w-[180px]">
      <Link
        to="/result/$type/$id"
        params={{
          id: release.results[0].id.toString(),
          type: release.results[0].type,
        }}
        title={release.results[0].title}
      >
        <div className="flex flex-col flex-nowrap items-center justify-center gap-3 text-center">
          <div className="w-full">
            <SearchImage
              url={release.results[0].cover_image ?? ""}
              title={release.results[0].title}
            />
          </div>

          <div className="flex flex-col">
            <h3 className="relative break-words pb-1 text-xl text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white">
              {removeAsterisk(release.results[0].title)}
            </h3>
            <span>{(release.results[0] as DiscogsSearchRelease).year}</span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default LastFmAlbum;
