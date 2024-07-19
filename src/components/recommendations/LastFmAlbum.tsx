import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  DiscogsSearchRelease,
  DiscogsSearchResult,
} from "../../types/Discogs/DiscogsTypes";
import { LastFMAlbumParams } from "../../types/LastFm/LastFmTypes";
import Discogs from "../discogs/Discogs";
import { removeAsterisk, removeNumberFromName } from "../functions/Functions";
import SearchImage from "../search-image/SearchImage";

function LastFmAlbum({
  release,
  handleItemChange,
}: {
  release: LastFMAlbumParams | DiscogsSearchResult;
  handleItemChange: (newValue: DiscogsSearchResult) => void;
}) {
  const { data: discogsRelease, isError } = useQuery({
    queryKey: [
      "DiscogsAlbumSearch",
      release,
      (release as LastFMAlbumParams).album,
      (release as LastFMAlbumParams).artist,
    ],
    queryFn: async () => {
      const result = await Discogs.Search({
        searchParams: {
          query:
            (release as LastFMAlbumParams).album +
            " " +
            (release as LastFMAlbumParams).artist,
        },
        pageParam: 1,
      });

      const album =
        result?.results.find((x) => x.type != "artist" && x.type != "label") ??
        result?.results[0];

      if (album) handleItemChange(album);

      return result;
    },
    refetchOnWindowFocus: false,
    enabled: !!(release as LastFMAlbumParams).album,
  });

  const album =
    discogsRelease?.results.find(
      (x) => x.type != "artist" && x.type != "label",
    ) ??
    discogsRelease?.results[0] ??
    (release as DiscogsSearchResult);

  return (
    <li className="h-full min-w-[180px]">
      <Link
        to={isError ? "/search" : "/result/$type/$id"}
        params={
          isError
            ? {}
            : {
                id: album?.id ? album.id.toString() : "-1",
                type: album?.type ?? "release",
              }
        }
        search={
          isError
            ? {
                query:
                  (release as LastFMAlbumParams).album +
                  " " +
                  (release as LastFMAlbumParams).artist,
              }
            : {}
        }
        title={album?.title ?? (release as LastFMAlbumParams).album}
      >
        <div className="flex flex-col flex-nowrap items-center justify-center gap-3 text-center">
          <div className="flex h-48 w-full justify-center">
            <SearchImage
              url={album?.cover_image ?? ""}
              title={album?.title ?? (release as LastFMAlbumParams).album}
            />
          </div>

          <div className="flex flex-col">
            <h3 className="relative line-clamp-2 text-ellipsis break-words text-lg text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white">
              {removeNumberFromName(
                removeAsterisk(
                  album?.title ??
                    (release as LastFMAlbumParams).artist +
                      " - " +
                      (release as LastFMAlbumParams).album,
                ),
              )}
            </h3>
            {(album as DiscogsSearchRelease)?.year && (
              <span className="text-md">
                {(album as DiscogsSearchRelease)?.year}
              </span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

export default LastFmAlbum;
