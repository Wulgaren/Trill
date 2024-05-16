import { UseNavigateResult } from "@tanstack/react-router";
import { ChangeEvent, FormEvent, useState } from "react";
import { BiCalendar } from "react-icons/bi";
import { FaGlobeAmericas } from "react-icons/fa";
import {
  PiMusicNoteSimpleFill,
  PiPianoKeysFill,
  PiUserListFill,
  PiVinylRecordFill,
} from "react-icons/pi";
import { RiFilterFill, RiFilterLine } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";
import countries from "../../data/countries";
import genres from "../../data/genres";
import styles from "../../data/styles";
import {
  DiscogsSearchQuery,
  DiscogsSearchTypes,
} from "../../types/Discogs/DiscogsTypes";
import { GetSelectedValues, createFormObject } from "../functions/Functions";

function SearchInput({
  params,
  navigate,
}: {
  params: DiscogsSearchQuery;
  navigate: UseNavigateResult<"/search">;
}) {
  const [searchType, setSearchType] = useState<DiscogsSearchTypes[]>(
    (params.type as []) ?? [],
  );
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const handleSearchTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = GetSelectedValues(e);
    const newSearchType: DiscogsSearchTypes[] = selectedOptions.map(
      (x) => x as DiscogsSearchTypes,
    );
    setSearchType(newSearchType);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get("query")) {
      const formEntries = createFormObject([...formData.entries()]);
      setShowFilters(false);

      navigate({
        search: (prev) => ({
          ...prev,
          ...formEntries,
        }),
      });
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSearch}>
      <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
        <label className="w-full" htmlFor="searchInput">
          <span className="flex gap-1">
            <PiVinylRecordFill size={16} />
            Search for an artist, release or a label...
          </span>
          <input
            name="query"
            id="searchInput"
            className="w-full"
            type="search"
            defaultValue={params.query}
            aria-label="Search for an artist, release or a label..."
            tabIndex={0}
          />
        </label>
        <button className="mx-0 w-24 flex-1" tabIndex={0} type="submit">
          Search
        </button>
        <button
          className="mx-0 flex max-w-[25%] flex-1 items-center justify-center md:max-w-full"
          tabIndex={0}
          aria-label="Search filters"
          aria-expanded={showFilters}
          aria-controls="#searchFilters"
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          {showFilters ? (
            <RiFilterFill size={24} className="w-8" />
          ) : (
            <RiFilterLine size={24} className="w-8" />
          )}
        </button>
      </div>

      <div
        id="searchFilters"
        aria-hidden={!showFilters}
        className="flex max-h-96 flex-row flex-wrap gap-2 overflow-hidden transition-all duration-500 [&>label]:flex-1"
      >
        <label htmlFor="searchType">
          <span className="flex gap-1">
            <VscSettings size={16} /> Search type
          </span>
          <select
            multiple
            name="type"
            id="searchType"
            value={searchType}
            tabIndex={0}
            aria-label="Type of results to search"
            onChange={handleSearchTypeChange}
          >
            <option value={"artist"}>Artist</option>
            <option value={"master"}>Release</option>
            <option value={"label"}>Label</option>
          </select>
        </label>

        <label htmlFor="searchCountry">
          <span className="flex gap-1">
            <FaGlobeAmericas size={16} />
            Country
          </span>
          <select
            multiple
            name="country"
            id="searchCountry"
            defaultValue={params.country}
            tabIndex={0}
            aria-label="Country"
          >
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
          <span className="flex gap-1">
            <PiPianoKeysFill size={16} />
            Genre
          </span>
          <select
            multiple
            name="genre"
            id="searchGenre"
            defaultValue={params.genre}
            tabIndex={0}
            aria-label="Genre"
          >
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
          <span className="flex gap-1">
            <PiMusicNoteSimpleFill size={16} />
            Style
          </span>
          <select
            multiple
            name="style"
            id="searchStyle"
            defaultValue={params.style}
            tabIndex={0}
            aria-label="Style"
          >
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
              <span className="flex gap-1">
                <BiCalendar size={16} />
                Year
              </span>
              <input
                name="year"
                id="searchYear"
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
              <span className="flex gap-1">
                <PiUserListFill size={16} />
                Release credit
              </span>
              <input
                name="credit"
                id="searchCredit"
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
