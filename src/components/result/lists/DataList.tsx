import { Link } from "@tanstack/react-router";
import { ElementType } from "react";
import {
  DiscogsAllowedPageTypes,
  DiscogsArtist,
  DiscogsArtistAlias,
  DiscogsCompany,
  DiscogsEntityArtist,
  DiscogsFormat,
  DiscogsLabel,
} from "../../../types/Discogs/DiscogsTypes";
import {
  calculateComma,
  getSimpleLink,
  removeNumberFromName,
} from "../../functions/Functions";
import LinkIcon from "../../link-icon/LinkIcon";

type combinedTypes =
  | DiscogsLabel
  | DiscogsArtist
  | DiscogsArtistAlias
  | DiscogsEntityArtist
  | DiscogsCompany;

function DataList({
  title,
  titleAs: TitleElement = "span",
  items,
  type,
  isLink = false,
  isInline = false,
  className,
}: {
  title: string;
  titleAs?: ElementType;
  items: (combinedTypes | DiscogsFormat | string)[];
  type?: DiscogsAllowedPageTypes | "search";
  isLink?: boolean;
  isInline?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <TitleElement
        className={`${TitleElement == "h2" ? "text-xl" : TitleElement == "h3" ? "text-lg" : ""}`}
      >
        {items.length > 1
          ? title.endsWith("s")
            ? `${title}es`
            : `${title}s`
          : title}
        :
      </TitleElement>

      <ul className="flex flex-wrap">
        {items.map((item, index) => (
          <li
            key={index}
            className={`${isInline ? "" : "py-1"} inline-block max-w-full`}
          >
            {isLink && type ? (
              <Link
                to={type === "search" ? "/search" : "/result/$type/$id"}
                params={
                  type === "search"
                    ? {}
                    : { id: (item as combinedTypes).id.toString(), type }
                }
                search={
                  type === "search" ? { [title.toLowerCase()]: item } : {}
                }
                title={(item as combinedTypes).name}
                className={`${isInline ? "mx-1" : "mx-2"} relative ml-0 py-1 text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white`}
              >
                <span
                  className={`overflow-hidden text-ellipsis whitespace-nowrap ${(item as DiscogsArtistAlias).active == false ? "line-through" : ""}`}
                >
                  {removeNumberFromName(
                    typeof item === "string" ? item : item.name,
                  ) + calculateComma(items.length ?? 0, index)}
                </span>
              </Link>
            ) : isLink ? (
              <a
                className="relative mx-2 ml-0 flex gap-2 py-1 text-black after:absolute after:bottom-0 after:right-0 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-[''] hover:after:left-0 hover:after:w-full dark:text-white dark:after:bg-white"
                href={item as string}
                target="_blank"
                rel="noreferrer"
              >
                <LinkIcon url={item as string} />
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {getSimpleLink(item as string) +
                    calculateComma(items?.length ?? 0, index)}
                </span>
              </a>
            ) : (
              <span
                className={`overflow-hidden text-ellipsis whitespace-nowrap ${(item as DiscogsArtistAlias).active == false ? "line-through" : ""}`}
              >
                {removeNumberFromName(
                  typeof item === "string" ? item : item.name,
                )}
                {(item as DiscogsFormat).descriptions
                  ? " - " + (item as DiscogsFormat).descriptions?.join(", ")
                  : ""}
                {calculateComma(items.length ?? 0, index)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DataList;
