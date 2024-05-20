import { DiscogsMaster } from "../../types/Discogs/DiscogsTypes";

function MasterPage({ data }: { data: DiscogsMaster }) {
  return (
    <div>
      {data.images?.length && <img src={data.images[0]?.resource_url} />}
      <div>
        <h1>{data.title}</h1>
      </div>
    </div>
  );
}

export default MasterPage;
