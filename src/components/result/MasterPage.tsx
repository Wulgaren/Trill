import { Link } from "@tanstack/react-router";
import {
  DiscogsMaster,
  DiscogsRelease,
} from "../../types/Discogs/DiscogsTypes";
import SearchImage from "../search-image/SearchImage";

function MasterPage({ data }: { data: DiscogsMaster & DiscogsRelease }) {
  console.log(data);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-row flex-wrap gap-3 md:flex-nowrap">
        {data?.images?.[0]?.resource_url && (
          <div className="md:max-w-md">
            <SearchImage
              url={data?.images?.[0]?.resource_url}
              title={data.title}
              className="rounded-lg object-contain"
            />
          </div>
        )}

        <div className="flex w-full flex-col rounded-md bg-white !bg-opacity-40 p-5 dark:bg-black dark:text-white">
          <h2 className="mb-1 break-words text-2xl">
            {data.artists.map((artist) => artist.name).join(", ")}
          </h2>
          <h1 className="mb-3 break-words text-4xl">{data.title}</h1>
          <span>Released: {data.year}</span>

          {data.genres?.length > 0 && (
            <div className="flex gap-1">
              <span>{data.genres.length > 1 ? "Genres" : "Genre"}: </span>

              <ul className="flex">
                {data.genres.map((genre, index) => {
                  return (
                    <li key={index}>
                      <Link
                        to="/search"
                        search={{ genre: genre }}
                        className="relative mx-1 ml-0 py-1 text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white"
                      >
                        {genre +
                          (data.genres.length - (index + 1) != 0 ? "," : "")}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {data.styles && (
            <div className="flex gap-1">
              <span>{data.styles.length > 1 ? "Styles" : "Style"}: </span>

              <ul className="flex">
                {data.styles.map((style, index) => {
                  return (
                    <li key={index}>
                      <Link
                        to="/search"
                        search={{ style: style }}
                        className="relative mx-1 ml-0 py-1 text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white"
                      >
                        {style +
                          ((data.styles?.length ?? 0) - (index + 1) != 0
                            ? ","
                            : "")}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {data.labels?.length > 0 && (
            <div className="flex gap-1">
              <span>{data.labels.length > 1 ? "Labels" : "Label"}: </span>

              <ul className="flex gap-2">
                {data.labels.map((label, index) => {
                  return (
                    <li key={index}>
                      <Link
                        to="/result/$type/$id"
                        params={{ id: label.id.toString(), type: "label" }}
                        className="relative mx-1 ml-0 py-1 text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white"
                      >
                        {label.name +
                          (data.labels.length - (index + 1) != 0 ? "," : "")}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {data.formats?.length > 0 && (
            <div className="flex gap-1">
              <span>{data.formats.length > 1 ? "Formats" : "Format"}: </span>

              <ul className="flex gap-1">
                {data.formats.map((format, index) => {
                  return (
                    <li key={index}>
                      {format.name +
                        (data.formats.length - (index + 1) != 0 ? "," : "")}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {data.country && (
            <div className="flex gap-1">
              <span>Country: </span>
              <Link
                to="/search"
                search={{ country: data.country }}
                className="relative pb-1 text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white"
              >
                {data.country}
              </Link>
            </div>
          )}
        </div>
      </div>

      {data.tracklist?.length > 0 && (
        <div className="flex flex-col rounded-md bg-white !bg-opacity-40 p-5 md:col-span-2 dark:bg-black dark:text-white">
          <h2 className="text-xl">Tracklist: </h2>

          <ol className="list-decimal pl-6">
            {data.tracklist?.map((track, index) => {
              return (
                <li className="py-1" key={index}>
                  <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                      <span className="break-words">{track.title}</span>

                      {track.extraartists && (
                        <ul className="flex gap-1">
                          {track.extraartists?.map((artist, index) => {
                            return (
                              <li key={index}>
                                <Link
                                  to="/result/$type/$id"
                                  params={{
                                    id: artist.id.toString(),
                                    type: "artist",
                                  }}
                                  className="relative pb-1 text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white"
                                >
                                  {artist.role}:
                                  {artist.name +
                                    (data.extraartists.length - (index + 1) != 0
                                      ? ","
                                      : "")}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    <span className="text-sm">{track.duration}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}

export default MasterPage;
