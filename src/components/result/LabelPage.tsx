import { Suspense, lazy } from "react";
import { DiscogsLabel } from "../../types/Discogs/DiscogsTypes";
import CollapsibleText from "../collapsible-text/CollapsibleText";
import {
  convertHTMLTags,
  removeNumberFromName,
  removeTags,
} from "../functions/Functions";
import LoadingAnimation from "../loading-animation/LoadingAnimation";
import SearchImage from "../search-image/SearchImage";
import DataList from "./lists/DataList";
const ReleasesList = lazy(() => import("./lists/ReleasesList"));

function LabelPage({ data }: { data: DiscogsLabel }) {
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

          {data.profile && (
            <CollapsibleText
              text={convertHTMLTags(
                removeNumberFromName(removeTags(data.profile)),
              )}
              maxLength={350}
            />
          )}
        </div>
      </div>

      {(data.sublabels || data.urls) && (
        <div className="flex flex-col rounded-md bg-white !bg-opacity-40 p-5 md:col-span-2 dark:bg-black dark:text-white">
          {data.sublabels && (
            <DataList
              title="Sublabel"
              titleAs={"h2"}
              isLink={true}
              items={data.sublabels}
              type="label"
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
          <ReleasesList data={data} type="labels" />
        </Suspense>
      </div>
    </div>
  );
}

export default LabelPage;
