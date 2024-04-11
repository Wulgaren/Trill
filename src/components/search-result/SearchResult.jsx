import { React, useState } from "react";
import ArtistImage from "../artist-image/ArtistImage";

function SearchResult({ artists }) {
    const [imageLoading, setImageLoading] = useState({});

    return (
        <ul>
            {artists?.map((artist, index) => {
                const isLoading = imageLoading[artist.mbid] || false;

                return (
                    <li key={artist.mbid + index}>
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                <ArtistImage artist={artist} setImageLoading={setImageLoading} />
                                <a href={artist.url}>{artist.name}</a>
                            </>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}

export default SearchResult