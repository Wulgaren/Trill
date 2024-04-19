import { useQuery } from "@tanstack/react-query";
import React from "react";
import defaultArtistImage from "../../assets/img/default_artist.webp";
import LastFm from "../lastfm/LastFm";
import LoadingAnimation from "../loading-animation/LoadingAnimation";

function ArtistImage({ artist }) {
  const {
    data: imageUrl,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["artistImage", artist.name + " " + artist.mbid],
    queryFn: () => LastFm.FindArtistImage(artist.mbid),
    enabled: !!artist.mbid,
  });

  if (isLoading) return <LoadingAnimation />;

  let imgUrl = isError && !imageUrl ? defaultArtistImage : imageUrl;

  return (
    <img
      className="h-full w-full object-cover"
      src={imgUrl}
      alt={artist.name + " Image"}
    />
  );
}

export default ArtistImage;
