import { React, useState, useEffect } from "react";
import * as LastFM from "../lastfm/LastFM"

function Search({ setSearchedArtists }) {
    const [artist, setArtist] = useState("");

    useEffect(() => {
        LastFM.searchForArtist(artist, setSearchedArtists);
    }, [artist]);

    return (
        <form onSubmit={e => e.preventDefault()}>
            <input
                type="search"
                placeholder="Search for an artist..."
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full"
            />
            <button type="submit">Search</button>
        </form>
    )
}

export default Search