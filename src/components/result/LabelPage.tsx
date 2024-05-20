import { DiscogsLabel } from "../../types/Discogs/DiscogsTypes";

function LabelPage({ data }: { data: DiscogsLabel }) {
  return (
    <div>
      {data.images?.length && <img src={data.images[0]?.resource_url} />}
      <div>
        <h1>{data.name}</h1>
      </div>
    </div>
  );
}

export default LabelPage;
