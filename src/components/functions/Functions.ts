import {
  DiscogsArtist,
  DiscogsGetPageResponse,
  DiscogsLabel,
  DiscogsMaster,
  DiscogsPagination,
  DiscogsSearchQuery,
  DiscogsSearchResult,
} from "../../types/Discogs/DiscogsTypes";
import { LastFMItemParams } from "../../types/LastFm/LastFmTypes";

export function GetSelectedValues(
  selectInput:
    | HTMLSelectElement
    | React.ChangeEvent<HTMLSelectElement>
    | React.RefObject<HTMLSelectElement>,
): string[];
export function GetSelectedValues(selectInput: unknown): string[] {
  let options: HTMLCollectionOf<HTMLOptionElement> | [];

  if ("current" in (selectInput as object)) {
    options =
      (selectInput as React.RefObject<HTMLSelectElement>)?.current
        ?.selectedOptions ?? [];
  } else if ("target" in (selectInput as object)) {
    options = (selectInput as React.ChangeEvent<HTMLSelectElement>)?.target
      ?.selectedOptions;
  } else {
    options = (selectInput as HTMLSelectElement)?.selectedOptions;
  }

  const value = Array.from(options, (option) => option.value);

  return value;
}

export function generateQueryString(obj: Record<string, string>) {
  return (
    "?" +
    Object.entries(obj)
      .filter(([, value]) => value) // Filter out undefined values
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")
  );
}

export function generateQueries(
  obj: Record<string, string | string[]> | DiscogsSearchQuery,
): string[] {
  const keys = Object.keys(obj);

  function generateVariations(
    index: number,
    current: Record<string, string>,
  ): Record<string, string>[] {
    if (index === keys.length) return [current];

    const key = keys[index];
    const values = Array.isArray(obj[key]) ? obj[key] : [obj[key]];
    const variations = (values as string[]).map((value) =>
      generateVariations(index + 1, { ...current, [key]: value }),
    );
    return variations.flat();
  }

  const queryObjs = generateVariations(0, {});
  return queryObjs.map(generateQueryString);
}

export function getNextPage(lastPage: DiscogsPagination | undefined) {
  const page = lastPage?.page ?? 0;
  const allPages = lastPage?.pages ?? 0;
  if (page == allPages) return null;
  return page + 1;
}

export function createFormObject(formEntries: [string, FormDataEntryValue][]) {
  const result: Record<string, string | string[]> = {};

  formEntries.forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      if (Array.isArray(result[key])) {
        (result[key] as string[]).push(value as string);
      } else {
        result[key] = [result[key] as string, value as string];
      }
    } else {
      result[key] = value as string;
    }
  });

  return result;
}

export function removeTags(text: string): string {
  // Replace [x=name] and ("2323")
  if (!text) return text;

  text = text
    .replaceAll(/\[([a-zA-Z])=([^\]]+)\]/g, "$2")
    .replaceAll(/\s*\("\d+"\)/g, "");

  return text;
}

export function removeNumberFromName(text: string): string {
  // Remove number
  if (!text) return text;

  text = text.replaceAll(/\s*\(\d+\)/g, "");

  return text;
}

export function getSimpleLink(link: string): string {
  if (!link) return link;

  link = link.split("://")[1].split("/")[0].replace("www.", "");

  return link;
}

export function convertHTMLTags(text: string): string {
  if (!text) return text;

  text = text
    .replaceAll("[b]", "<b>")
    .replaceAll("[/b]", "</b>")
    .replaceAll("[i]", "<i>")
    .replaceAll("[/i]", "</i>")
    .replaceAll("[u]", "<ul>")
    .replaceAll("[/u]", "</ul>")
    .replaceAll(/(.*?)(\[url=([^\]]+)\])/g, '$1<a href="$3">')
    .replaceAll("[/url]", "</a>");

  return text;
}

export function calculateComma(len: number, index: number): string {
  return len - (index + 1) != 0 ? "," : "";
}

export function groupByProperty<T>(
  arr: Array<T>,
  property: keyof T,
): Record<string, Array<T>> {
  const groupedArtists: Record<string, Array<T>> = {};

  arr.forEach((x) => {
    const key = String(x[property]); // Convert the property value to a string
    if (!groupedArtists[key]) {
      groupedArtists[key] = [];
    }
    groupedArtists[key].push(x);
  });

  return groupedArtists;
}

export function removeAsterisk(text: string): string {
  if (text?.endsWith("*")) text = text.slice(0, -1);
  else if (text?.includes("* -")) text = text.replace("* -", " -");

  return text;
}
interface Identifiable {
  id: number;
  [key: string]: unknown;
}

export function removeDuplicates<T extends Identifiable>(data: T[]): T[] {
  const seenIds = new Set<number>();
  return data.filter((item) => {
    if (seenIds.has(item.id)) {
      return false;
    } else {
      seenIds.add(item.id);
      return true;
    }
  });
}

export function capitalizeFirstLetter(string: string = ""): string {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function addSpacesBeforeCapitalLetters(string: string = ""): string {
  if (!string) return string;
  const result = string.replace(/([a-z])([A-Z])/g, "$1 $2");
  return result;
}

export function matchesLastFmTitle(
  isArtist: boolean,
  results: DiscogsSearchResult[] | undefined,
  lastFmItem: LastFMItemParams,
) {
  if (!results) return;

  const result = isArtist
    ? results.find(
        (x) =>
          x.type == "artist" &&
          x.title.toLowerCase().includes(lastFmItem.artist.toLowerCase()),
      )
    : results.find(
        (x) =>
          x.type != "artist" &&
          x.type != "label" &&
          x.title
            .toLowerCase()
            .includes(lastFmItem.album?.toLowerCase()?.split(" ep")[0] ?? "") &&
          x.title.toLowerCase().includes(lastFmItem.artist.toLowerCase()),
      );

  return result;
}

export function setSiteTitle(data?: string | DiscogsGetPageResponse) {
  let title = "";

  if (data != null) {
    switch (typeof data) {
      case "string":
        title = "Search";
        if (data) title += " for " + data;
        break;
      case "object":
        if ((data as DiscogsMaster).artists?.[0]?.name) {
          title = (data as DiscogsMaster).artists?.[0]?.name + " - ";
        }

        if ((data as DiscogsMaster).title) {
          title += (data as DiscogsMaster).title;
        }

        if ((data as DiscogsArtist | DiscogsLabel).name) {
          title = (data as DiscogsArtist | DiscogsLabel).name;
        }

        break;
    }

    title = title + " [Trill - Music Finder]";
  } else title = "Trill - Music Finder";

  document.title = title;
  return title;
}
