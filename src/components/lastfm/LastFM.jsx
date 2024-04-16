import defaultArtistImage from "../../assets/img/default_artist.webp";

const LastFm = {
  FindArtistImage: async function (mbid) {
    if (!mbid) return;

    const response = await fetch(
      `/api/musicbrainz/artist/${mbid}?inc=url-rels&fmt=json`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    let url =
      data?.relations?.find((x) => x.type == "image")?.url?.resource ??
      defaultArtistImage;

    url = url.replace("/File:", "/Special:FilePath/");
    return url;
  },

  SearchForArtist: async function ({ pageParam = 1, queryKey }) {
    const [_, artist] = queryKey;
    if (!artist) return [];

    const response = await fetch(
      `/api/lastfm/?method=artist.search&artist=${artist}&format=json&page=${pageParam}&limit=50`
    );
    const data = await response.json();
    return data?.results?.artistmatches?.artist ?? [];
  },

  GetUserArtist: async function () {
    if (localStorage?.lastFmTopArtists)
      return JSON.parse(localStorage.lastFmTopArtists);

    const username = localStorage.lastFmUsername ?? "";
    if (!username) return;

    return await fetch(
      `/api/lastfm/?method=user.getTopArtists&user=${username}&period=overall&format=json&limit=100`
    )
      .then((res) => res.json())
      .then((data) => {
        let artists =
          data?.topartists?.artist?.map(({ name, mbid }) => ({ name, mbid })) ??
          [];
        console.log("GetUserArtist", artists);
        localStorage.setItem("lastFmTopArtists", JSON.stringify(artists));

        return artists;
      });
  },
};

export default LastFm;
