import {
  DiscogsPagination,
  DiscogsSearchQuery,
} from "../../types/Discogs/DiscogsTypes";

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
  // Replace [x=name]
  text = text.replaceAll(/\[([a-z])=([^\]]+)\]/g, "$2");

  return text;
}

export function removeNumberFromName(text: string): string {
  // Remove number
  text = text.replaceAll(/\s*\(\d+\)/g, "");
  text = text.replaceAll(/\s*\[\d+\]/g, "");

  return text;
}

export function getSimpleLink(link: string): string {
  link = link.split("://")[1].split("/")[0].replace("www.", "");

  return link;
}

export function convertHTMLTags(text: string): string {
  text = text
    .replaceAll("[b]", "<b>")
    .replaceAll("[/b]", "</b>")
    .replaceAll("[i]", "<i>")
    .replaceAll("[/i]", "</i>")
    .replaceAll("[u]", "<ul>")
    .replaceAll("[/u]", "</ul>");

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
  return text[text.length - 1] == "*" ? text.replace("*", "") : text;
}
