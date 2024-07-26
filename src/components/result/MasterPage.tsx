import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import {
  DiscogsMaster,
  DiscogsRelease,
} from "../../types/Discogs/DiscogsTypes";
import CollapsibleText from "../collapsible-text/CollapsibleText";
import Discogs from "../discogs/Discogs";
import {
  calculateComma,
  convertHTMLTags,
  removeNumberFromName,
  removeTags,
} from "../functions/Functions";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import SearchImage from "../search-image/SearchImage";
import DataList from "./lists/DataList";
import TrackList from "./lists/TrackList";
const Recommendations = lazy(
  () => import("../recommendations/Recommendations"),
);

function MasterPage({ data }: { data: DiscogsMaster & DiscogsRelease }) {
  const { data: bonusTracks, isFetching: bonusTracksFetching } = useQuery({
    queryKey: ["bonus tracks", data.id, data.tracklist],
    queryFn: () =>
      Discogs.GetBonusTracks({
        id: data.id,
        originalTracklist: data.tracklist,
      }),
    enabled: !!(data.id && data.tracklist),
  });

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-row flex-wrap gap-3 md:flex-nowrap">
        {data?.images?.[0]?.resource_url && (
          <div className="mx-auto md:max-w-md">
            <SearchImage
              url={data?.images?.[0]?.resource_url}
              title={data.title}
              className="rounded-lg object-contain"
            />
          </div>
        )}

        <div className="flex w-full flex-col rounded-md bg-white !bg-opacity-40 p-5 dark:bg-black dark:text-white">
          <h2 className="mb-1 break-words text-2xl">
            <ul>
              {data.artists.map((artist, index) => {
                return (
                  <li key={index}>
                    <Link
                      title={artist.name}
                      to="/result/$type/$id"
                      params={{ id: artist.id.toString(), type: "artist" }}
                      className="relative mx-1 ml-0 py-1 text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white"
                    >
                      {artist.name + calculateComma(data.artists.length, index)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </h2>
          <h1 className="mb-3 break-words text-4xl">{data.title}</h1>
          <span>Released: {data.year}</span>

          {data.genres?.length > 0 && (
            <DataList
              title="Genre"
              items={data.genres}
              type="search"
              isLink={true}
              isInline={true}
              className="flex gap-1"
            />
          )}

          {data.styles && (
            <DataList
              title="Style"
              items={data.styles}
              type="search"
              isLink={true}
              isInline={true}
              className="flex gap-1"
            />
          )}

          {data.labels?.length > 0 && (
            <DataList
              title="Label"
              items={data.labels}
              type="label"
              isLink={true}
              isInline={true}
              className="flex gap-1"
            />
          )}

          {data.formats?.length > 0 && (
            <DataList
              title="Format"
              items={data.formats}
              isLink={false}
              isInline={true}
              className="flex gap-1"
            />
          )}

          {data.country && (
            <div className="flex gap-1">
              <span>Country: </span>
              <Link
                title={"Search by " + data.country}
                to="/search"
                search={{ country: data.country }}
                className="relative pb-1 text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white"
              >
                {data.country}
              </Link>
            </div>
          )}

          {data.notes && (
            <span className="break-words pt-3">
              <CollapsibleText
                text={convertHTMLTags(
                  removeNumberFromName(removeTags(data.notes)),
                )}
                maxLength={100}
              />
            </span>
          )}
        </div>
      </div>

      {data.tracklist?.length > 0 && (
        <div className="flex flex-col rounded-md bg-white !bg-opacity-40 p-5 md:col-span-2 dark:bg-black dark:text-white">
          <TrackList tracklist={data.tracklist} />

          {bonusTracksFetching && <LoadingAnimation />}
          {!bonusTracksFetching && bonusTracks && bonusTracks?.length > 0 && (
            <TrackList
              tracklist={bonusTracks}
              title="Bonus tracks"
              ordered={false}
            />
          )}
        </div>
      )}

      {data.extraartists?.length > 0 && (
        <div className="flex flex-col gap-2 md:col-span-2 dark:text-white">
          <h2 className="text-xl">Credits: </h2>

          <ul className="grid grid-flow-row grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-stretch justify-between gap-2">
            {data.extraartists?.map((artist, index) => {
              return (
                <li
                  className="flex flex-col items-center justify-center rounded-lg bg-white !bg-opacity-40 p-5 text-center shadow-sm backdrop-blur-sm dark:bg-black"
                  key={index}
                >
                  <Link
                    to="/result/$type/$id"
                    params={{ id: artist.id.toString(), type: "artist" }}
                    title={artist.name}
                    className="flex flex-col gap-2"
                  >
                    <span className="break-words text-sm text-secondary">
                      {artist.role}
                    </span>
                    <span className="relative break-words pb-1 text-lg text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white">
                      {artist.name}
                    </span>
                    <span className="break-words text-xs">{artist.tracks}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {data.artists?.length > 0 && data.tracklist.length > 0 && (
        <Suspense fallback={<LoadingAnimation />}>
          <Recommendations
            title="Similar albums"
            type="SimilarAlbums"
            artist={data.artists[0].name}
            trackName={data.tracklist[0].title}
          />
        </Suspense>
      )}
    </div>
  );
}

export default MasterPage;
