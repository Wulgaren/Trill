import { Suspense, lazy } from "react";
import { DiscogsArtist } from "../../types/Discogs/DiscogsTypes";
import CollapsibleText from "../collapsible-text/CollapsibleText";
import {
  convertHTMLTags,
  removeNumberFromName,
  removeTags,
} from "../functions/Functions";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import SearchImage from "../search-image/SearchImage";
import DataList from "./DataList";
const ReleasesList = lazy(() => import("./ReleasesList"));

function ArtistPage({ data }: { data: DiscogsArtist }) {
  console.log(data);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-row flex-wrap gap-3 md:flex-nowrap">
        {data?.images?.[0]?.resource_url && (
          <div className="mx-auto max-w-md">
            <SearchImage
              url={data?.images?.[0]?.resource_url}
              title={data.name}
              className="rounded-lg object-contain"
            />
          </div>
        )}

        <div className="w-full rounded-md bg-white !bg-opacity-40 p-5 dark:bg-black dark:text-white">
          <h1 className="mb-3 break-words text-4xl">{data.name}</h1>
          <CollapsibleText
            text={convertHTMLTags(
              removeNumberFromName(removeTags(data.profile)),
            )}
            maxLength={250}
          />
        </div>
      </div>

      {(data.members || data.groups || data.aliases || data.urls) && (
        <div className="flex flex-col rounded-md bg-white !bg-opacity-40 p-5 md:col-span-2 dark:bg-black dark:text-white">
          {data.members && (
            <DataList
              title="Member"
              titleAs={"h2"}
              isLink={true}
              items={data.members}
              type="artist"
            />
          )}

          {data.groups && (
            <DataList
              title="Group"
              titleAs={"h2"}
              isLink={true}
              items={data.groups}
              type="artist"
              className="mt-3"
            />
          )}

          {data.aliases && (
            <DataList
              title="Alias"
              titleAs={"h2"}
              isLink={true}
              items={data.aliases}
              type="artist"
              className="mt-3"
            />
          )}

          {data.urls && (
            <DataList
              title="Site"
              titleAs={"h3"}
              isLink={true}
              items={data.urls}
              className="mt-3"
            />
          )}
        </div>
      )}

      <div className="rounded-md bg-white !bg-opacity-40 p-5 md:col-span-2 dark:bg-black dark:text-white">
        <h2 className="text-xl">Releases:</h2>

        <Suspense fallback={<LoadingAnimation />}>
          <ReleasesList data={data} queryKey="artistReleases" />
        </Suspense>
      </div>
    </div>
  );
}

export default ArtistPage;
