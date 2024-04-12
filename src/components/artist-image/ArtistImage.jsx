import React from "react";
import defaultArtistImage from "../../assets/img/default_artist.webp";
import * as LastFM from "../lastfm/LastFm";

const HandleImageLoad = (mbid, setImageLoading) => {
  if (!mbid) return false;

  setImageLoading((prevState) => ({
    ...prevState,
    [mbid]: false,
  }));
};

const HandleImageError = (mbid, setImageLoading) => {
  if (!mbid) return false;

  setImageLoading((prevState) => ({
    ...prevState,
    [mbid]: false,
  }));
};

function ArtistImage({ artist, setImageLoading }) {
  if (!artist) {
    HandleImageError(artist.mbid, setImageLoading);

    return;
  }

  let imageUrl = defaultArtistImage;
  LastFM.FindArtistImage(artist.mbid).then((data) => {
    imageUrl = data;
  });

  return (
    <>
      <img
        src={imageUrl}
        alt={artist.name + " Image"}
        onLoad={() => HandleImageLoad(artist.mbid, setImageLoading)}
        onError={() => HandleImageError(artist.mbid, setImageLoading)}
      />
    </>
  );
}

export default ArtistImage;
