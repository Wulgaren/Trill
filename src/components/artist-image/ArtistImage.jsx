import React, { useState } from "react";
import defaultArtistImage from "../../assets/img/default_artist.webp";
import * as LastFM from "../lastfm/LastFm";
import LoadingAnimation from "../loading-animation/LoadingAnimation";

function ArtistImage({ artist, index }) {
  const [imageReq, setImageReq] = useState({
    loading: true,
    sentRequest: false,
    url: defaultArtistImage,
  });

  if (imageReq.loading && !imageReq.sentRequest && artist?.mbid) {
    setTimeout(() => {
      let imageObj = {
        loading: true,
        sentRequest: true,
        url: defaultArtistImage,
      };

      LastFM.FindArtistImage(artist.mbid)
        .then((data) => {
          if (data) imageObj.url = data;
        })
        .catch((error) => {
          console.error("Error fetching artist image:", error);
        })
        .finally(() => {
          imageObj.loading = false;
          setImageReq(imageObj);
        });
    }, 3000 * index);

    return <LoadingAnimation />;
  }

  return (
    <>
      <img
        className="w-full h-full object-cover rounded-md"
        src={imageReq.url}
        alt={artist.name + " Image"}
      />
    </>
  );
}

export default ArtistImage;
