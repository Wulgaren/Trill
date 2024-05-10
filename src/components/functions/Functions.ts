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
