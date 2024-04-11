import React from 'react';
import * as LastFM from '../lastfm/LastFM';

const handleImageLoad = (mbid, setImageLoading) => {
    if (!mbid) return false;
    console.log(mbid);

    setImageLoading((prevState) => ({
        ...prevState,
        [mbid]: false,
    }));
};

const handleImageError = (mbid, setImageLoading) => {
    if (!mbid) return false;

    setImageLoading((prevState) => ({
        ...prevState,
        [mbid]: false,
    }));
};

function ArtistImage( { artist, setImageLoading } ) {
    if (!artist) {
        handleImageError(artist.mbid, setImageLoading)
        
        return;
    }

    let imageUrl;
    LastFM.findArtistImage(artist.mbid).then((data) => {
        imageUrl = data;
    });

    console.log(imageUrl);
    return (<>
        <img
            src={imageUrl}
            alt={artist.name + " Image"}
            onLoad={() => handleImageLoad(artist.mbid, setImageLoading)}
            onError={() => handleImageError(artist.mbid, setImageLoading)}
        />
    </>)
}

export default ArtistImage