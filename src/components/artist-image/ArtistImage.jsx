import React, { useState } from "react";
import defaultArtistImage from "../../assets/img/default_artist.webp";

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
  const [imageUrl, setImageUrl] = useState(defaultArtistImage);

  // LastFM.FindArtistImage(artist.mbid)
  //   .then((data) => {
  //     setImageUrl(data);
  //     HandleImageLoad(artist.mbid, setImageLoading);
  //   })
  //   .catch((error) => {
  //     console.error("Error fetching artist image:", error);
  //     HandleImageError(artist.mbid, setImageLoading);
  //   });

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
