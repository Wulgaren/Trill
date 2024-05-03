import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Search from "../components/search/Search";
import { DiscogsSearchQuery } from "../types/Discogs/DiscogsTypes";

const validTypes = ["artist", "master", "label"];

export const Route = createFileRoute("/search")({
  validateSearch: (
    searchParams: Record<string, unknown>,
  ): DiscogsSearchQuery => {
    return {
      per_page: undefined,
      page: undefined,
      query:
        typeof searchParams.query === "string" ? searchParams.query : undefined,
      type:
        typeof searchParams.type === "string" &&
        validTypes.includes(searchParams.type as string)
          ? (searchParams.type as "artist" | "master" | "label")
          : undefined,
      title:
        typeof searchParams.title === "string" ? searchParams.title : undefined,
      release_title:
        typeof searchParams.release_title === "string"
          ? searchParams.release_title
          : undefined,
      credit:
        typeof searchParams.credit === "string"
          ? searchParams.credit
          : undefined,
      artist:
        typeof searchParams.artist === "string"
          ? searchParams.artist
          : undefined,
      anv: typeof searchParams.anv === "string" ? searchParams.anv : undefined,
      label:
        typeof searchParams.label === "string" ? searchParams.label : undefined,
      genre:
        typeof searchParams.genre === "string" ? searchParams.genre : undefined,
      style:
        typeof searchParams.style === "string" ? searchParams.style : undefined,
      country:
        typeof searchParams.country === "string"
          ? searchParams.country
          : undefined,
      year:
        typeof searchParams.year === "string" ||
        typeof searchParams.year === "number"
          ? searchParams.year
          : undefined,
      format:
        typeof searchParams.format === "string"
          ? searchParams.format
          : undefined,
      catno:
        typeof searchParams.catno === "string" ? searchParams.catno : undefined,
      barcode:
        typeof searchParams.barcode === "string"
          ? searchParams.barcode
          : undefined,
      track:
        typeof searchParams.track === "string" ? searchParams.track : undefined,
      submitter:
        typeof searchParams.submitter === "string"
          ? searchParams.submitter
          : undefined,
      contributor:
        typeof searchParams.contributor === "string"
          ? searchParams.contributor
          : undefined,
    };
  },
  component: () => <SearchParams />,
});

function SearchParams() {
  const params: DiscogsSearchQuery = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  return <Search params={params} navigate={navigate} />;
}
