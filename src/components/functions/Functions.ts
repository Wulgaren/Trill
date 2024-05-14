import {
  DiscogsSearchQuery,
  DiscogsSearchResponse,
} from "../../types/Discogs/DiscogsTypes";

export function GetSelectedValues(
  selectInput: React.RefObject<HTMLSelectElement>,
): string[];
export function GetSelectedValues(selectInput: HTMLSelectElement): string[];
export function GetSelectedValues(
  selectInput: React.ChangeEvent<HTMLSelectElement>,
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

export function hasMorePages(lastPage: DiscogsSearchResponse) {
  if (!lastPage.pagination) return 1;

  const paginations = Array.isArray(lastPage?.pagination)
    ? lastPage.pagination
    : [lastPage.pagination];
  const morePages = paginations?.filter((pag) => pag.page != pag.pages);

  if (!morePages?.length) return null;
  return morePages[0].page + 1;
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
