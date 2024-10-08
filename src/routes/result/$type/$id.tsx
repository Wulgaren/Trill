import { createFileRoute } from "@tanstack/react-router";
import Discogs from "../../../components/discogs/Discogs.ts";
import { setSiteTitle } from "../../../components/functions/Functions.ts";
import LoadingAnimation from "../../../components/loading-animation/LoadingAnimation.tsx";
import ArtistPage from "../../../components/result/ArtistPage.tsx";
import LabelPage from "../../../components/result/LabelPage.tsx";
import MasterPage from "../../../components/result/MasterPage.tsx";
import NoSearchResult from "../../../components/search/NoSearchResult.tsx";
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
  const { type, id } = Route.useParams();
  const data = Route.useLoaderData();
  if (process.env.NODE_ENV === "development")
    console.log("result page data", data);

  if (!data || id == "-1") {
    return <NoSearchResult />;
  }

  setSiteTitle(data);

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
