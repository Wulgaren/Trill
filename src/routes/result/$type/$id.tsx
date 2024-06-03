import { createFileRoute } from "@tanstack/react-router";
import Discogs from "../../../components/discogs/Discogs.ts";
import LoadingAnimation from "../../../components/loading-animation/LoadingAnimation.tsx";
import ArtistPage from "../../../components/result/ArtistPage.tsx";
import LabelPage from "../../../components/result/LabelPage.tsx";
import MasterPage from "../../../components/result/MasterPage.tsx";
import {
  DiscogsArtist,
  DiscogsLabel,
  DiscogsMaster,
  DiscogsPageParams,
  DiscogsRelease,
} from "../../../types/Discogs/DiscogsTypes.ts";

export const Route = createFileRoute("/result/$type/$id")({
  component: () => <ResultPageParams />,
  pendingComponent: LoadingAnimation,
  loader: async ({ params }: { params: DiscogsPageParams }) =>
    await Discogs.GetPageData(params),
});

function ResultPageParams() {
  const { type } = Route.useParams();
  const data = Route.useLoaderData();
  console.log(data);

  switch (type) {
    case "artist":
      return <ArtistPage data={data as DiscogsArtist} />;
    case "label":
      return <LabelPage data={data as DiscogsLabel} />;
    case "master":
    case "release":
      return <MasterPage data={data as DiscogsMaster & DiscogsRelease} />;
  }
}
