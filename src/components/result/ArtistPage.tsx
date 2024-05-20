import { DiscogsArtist } from "../../types/Discogs/DiscogsTypes";

function ArtistPage({ data }: { data: DiscogsArtist }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row flex-wrap gap-5 md:flex-nowrap">
        {data.images?.length && (
          <img
            className="max-w-1/4 min-h-80 w-80 rounded-lg object-cover shadow-sm"
            src={data.images[0]?.resource_url}
          />
        )}
        <div className="flex w-3/4">
          <h1>{data.name}</h1>
        </div>
      </div>
    </div>
  );
}

export default ArtistPage;
