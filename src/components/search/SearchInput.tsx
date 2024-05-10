import { UseNavigateResult } from "@tanstack/react-router";
import { FormEvent, useRef, useState } from "react";
import countries from "../../data/countries";
import genres from "../../data/genres";
import styles from "../../data/styles";
import {
  DiscogsSearchQuery,
  DiscogsSearchTypes,
} from "../../types/Discogs/DiscogsTypes";
import { GetSelectedValues } from "../functions/Functions";

function SearchInput({
  params,
  navigate,
}: {
  params: DiscogsSearchQuery;
  navigate: UseNavigateResult<"/search">;
}) {
  const searchQuery = useRef<HTMLInputElement>(null);
  const searchCountry = useRef<HTMLSelectElement>(null);
  const searchGenre = useRef<HTMLSelectElement>(null);
  const searchStyle = useRef<HTMLSelectElement>(null);
  const searchYear = useRef<HTMLInputElement>(null);
  const searchCredit = useRef<HTMLInputElement>(null);
  const [searchType, setSearchType] = useState<DiscogsSearchTypes[]>();

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = GetSelectedValues(e);
    const newSearchType: DiscogsSearchTypes[] = selectedOptions.map(
      (x) => x as DiscogsSearchTypes,
    );
    setSearchType(newSearchType);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchQuery?.current?.value) {
      const countries = GetSelectedValues(searchCountry);
      const genres = GetSelectedValues(searchGenre);
      const styles = GetSelectedValues(searchStyle);

      navigate({
        search: (prev) => ({
          ...prev,
          query: searchQuery?.current?.value,
          type: searchType,
          style: styles,
          genre: genres,
          country: countries,
          year: searchYear?.current?.value,
          credit: searchCredit?.current?.value,
        }),
      });
    }
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSearch}>
      <div className="flex w-full">
        <label className="w-full" htmlFor="searchInput">
          <span>Search for an artist, release or a label...</span>
          <input
            id="searchInput"
            ref={searchQuery}
            className="w-full"
            type="search"
            defaultValue={params.query}
            aria-label="Search for an artist, release or a label..."
            tabIndex={0}
          />
        </label>
        <button className="w-24" tabIndex={0} type="submit">
          Search
        </button>
      </div>

      <div className="flex flex-row flex-wrap gap-2 [&>label]:flex-1">
        <label htmlFor="searchType">
          <span>Search type</span>
          <select
            multiple
            id="searchType"
            defaultValue={params.type}
            value={searchType}
            tabIndex={0}
            aria-label="Type of results to search"
            onChange={handleSearchTypeChange}
          >
            <option>--None--</option>
            <option value={"artist"}>Artist</option>
            <option value={"master"}>Release</option>
            <option value={"label"}>Label</option>
          </select>
        </label>

        <label htmlFor="searchCountry">
          <span>Country</span>
          <select
            multiple
            id="searchCountry"
            ref={searchCountry}
            defaultValue={params.country}
            tabIndex={0}
            aria-label="Country"
          >
            <option>--None--</option>
            {countries?.map((country, index) => {
              return (
                <option key={index} value={country}>
                  {country}
                </option>
              );
            })}
          </select>
        </label>

        <label htmlFor="searchGenre">
          <span>Genre</span>
          <select
            multiple
            id="searchGenre"
            ref={searchGenre}
            defaultValue={params.genre}
            tabIndex={0}
            aria-label="Genre"
          >
            <option>--None--</option>
            {genres?.map((genre, index) => {
              return (
                <option key={index} value={genre}>
                  {genre}
                </option>
              );
            })}
          </select>
        </label>

        <label htmlFor="searchStyle">
          <span>Style</span>{" "}
          <select
            multiple
            id="searchStyle"
            ref={searchStyle}
            defaultValue={params.style}
            tabIndex={0}
            aria-label="Style"
          >
            <option>--None--</option>
            {styles?.map((style, index) => {
              return (
                <option key={index} value={style}>
                  {style}
                </option>
              );
            })}
          </select>
        </label>

        {searchType?.length === 1 && searchType?.includes("master") && (
          <>
            <label htmlFor="searchYear">
              <span>Year</span>{" "}
              <input
                id="searchYear"
                ref={searchYear}
                defaultValue={params.year}
                aria-label="Year"
                type="number"
                min="1500"
                max="2299"
                step="1"
                tabIndex={0}
              />
            </label>

            <label htmlFor="searchCredit">
              <span>Release credit</span>
              <input
                id="searchCredit"
                ref={searchCredit}
                defaultValue={params.credit}
                aria-label="Release credit"
                type="text"
                tabIndex={0}
              />
            </label>
          </>
        )}
      </div>
    </form>
  );
}

export default SearchInput;
