import { Link } from "@tanstack/react-router";
import { Dispatch, SetStateAction } from "react";
import {
  DiscogsMasterTrack,
  ReleaseTrack,
} from "../../../types/Discogs/DiscogsTypes";
import { itunesSearchParams } from "../../../types/SongLink/SongLinkTypes";
import { calculateComma, groupByProperty } from "../../functions/Functions";

function TrackList({
  tracklist,
  title = "Tracklist",
  ordered = true,
  setSongLinkParams,
}: {
  tracklist: (ReleaseTrack & DiscogsMasterTrack)[];
  title?: string;
  ordered?: boolean;
  setSongLinkParams?: Dispatch<SetStateAction<itunesSearchParams>>;
}) {
  const ListType = ordered ? "ol" : "ul";

  return (
    <div>
      <h2 className="text-xl">{title}: </h2>

      <ListType className={`${ordered ? "list-decimal" : "list-disc"} pl-6`}>
        {tracklist?.map((track, trackIndex) => {
          return (
            track.type_ === "track" && (
              <li className="py-1" key={trackIndex}>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col">
                    <span
                      className="relative cursor-pointer break-words pb-1 text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white"
                      onClick={() => {
                        if (setSongLinkParams)
                          setSongLinkParams((prev) => ({
                            ...prev,
                            track: track.title,
                          }));
                      }}
                    >
                      {track.title}
                    </span>

                    {track.extraartists && (
                      <ul className="ps-1">
                        {Object.entries(
                          groupByProperty(track.extraartists, "role"),
                        ).map(([role, roleArtists], roleIndex) => {
                          return (
                            <div key={roleIndex} className="text-xs">
                              <span>{role + ": "}</span>

                              {roleArtists.map((artist, artistIndex) => {
                                return (
                                  <li
                                    className="inline-flex gap-1 pe-1"
                                    key={roleIndex + artistIndex}
                                  >
                                    <Link
                                      to="/result/$type/$id"
                                      params={{
                                        id: artist.id.toString(),
                                        type: "artist",
                                      }}
                                      title={artist.name}
                                      className="relative pb-1 text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white"
                                    >
                                      {artist.name +
                                        calculateComma(
                                          roleArtists?.length ?? 0,
                                          artistIndex,
                                        )}
                                    </Link>
                                  </li>
                                );
                              })}
                            </div>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <span className="text-sm">{track.duration}</span>
                </div>
              </li>
            )
          );
        })}
      </ListType>
    </div>
  );
}

export default TrackList;
