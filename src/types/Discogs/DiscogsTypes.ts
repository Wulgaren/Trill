// Authorization

export type DiscogsAuthorization = {
  Authorization: string;
};

// User

export type DiscogsUser = {
  id: number;
  username: string;
  resource_url: URL;
  consumer_name: string;
};

// Artist

export type DiscogsArtist = {
  profile: string;
  releases_url: string;
  name: string;
  namevariations?: string[];
  uri: string;
  members?: DiscogsArtistAlias[];
  urls?: string[];
  images?: DiscogsImage[];
  resource_url: string;
  aliases?: DiscogsArtistAlias[];
  id: number;
  data_quality: string;
  realname?: string;
  groups?: DiscogsArtistAlias[];
};

export type DiscogsArtistAlias = {
  resource_url: string;
  id: number;
  name: string;
  active?: boolean;
};

// ArtistMaster

export type DiscogsArtistMaster = {
  stats: {
    community: {
      in_collection: number;
      in_wantlist: number;
    };
  };
  thumb: string;
  title: string;
  main_release: number;
  artist: string;
  role: string;
  year?: number;
  resource_url: string;
  type: "master";
  id: number;
};

// ArtistRelease

export type DiscogsArtistRelease = {
  status: string;
  stats: {
    community: {
      in_collection: number;
      in_wantlist: number;
    };
  };
  thumb: string;
  format: string;
  title: string;
  label: string;
  role: string;
  year?: number;
  resource_url: string;
  artist: string;
  type: "release";
  id: number;
  trackinfo?: string;
};

// EntityArtist

export type DiscogsEntityArtist = {
  join: string;
  name: string;
  anv: string;
  tracks: string;
  role: string;
  resource_url: string;
  id: number;
};

// Image

export type DiscogsImage = {
  uri: string;
  height: number;
  width: number;
  resource_url: string;
  type: "primary" | "secondary";
  uri150: string;
};

// Label

export type DiscogsLabel = {
  profile?: string;
  releases_url: string;
  name: string;
  contact_info?: string;
  uri: string;
  urls?: string[];
  images?: DiscogsImage[];
  resource_url: string;
  id: number;
  data_quality: string;
};

// LabelRelease

export type DiscogsLabelRelease = {
  status: string;
  artist: string;
  catno: string;
  thumb: string;
  format: string;
  resource_url: string;
  title: string;
  year: number;
  id: number;
};

// Master

export type DiscogsMaster = {
  styles?: string[];
  genres?: string[];
  videos?: DiscogsVideo[];
  num_for_sale: number;
  title: string;
  most_recent_release: number | null;
  main_release: number;
  notes?: string;
  main_release_url: string;
  uri: string;
  artists: DiscogsEntityArtist[];
  versions_url: string;
  data_quality: string;
  most_recent_release_url: string;
  year: number;
  images?: DiscogsImage[];
  resource_url: string;
  lowest_price: number | null;
  id: number;
  tracklist: DiscogsMasterTrack[];
};

export type DiscogsMasterTrack = {
  duration: string;
  position: string;
  type_: string;
  title: string;
  extraartists?: DiscogsEntityArtist[];
};

// MasterVersions

export type DiscogsMasterVersions = {
  filter_facets: DiscogsFilterFacet[];
  filters: DiscogsFilters;
  versions: DiscogsVersion[];
};

export type DiscogsFilterFacet = {
  allows_multiple_values: boolean;
  values: DiscogsValue[];
  id: string;
  title: string;
};

export type DiscogsValue = {
  count: number;
  value: string;
  title: string;
};

export type DiscogsFilters = {
  applied: DiscogsApplied;
  available: DiscogsAvailable;
};

export type DiscogsApplied = Record<string, unknown>;

export type DiscogsAvailable = {
  country: { [key: string]: number };
  label: { [key: string]: number };
  released: { [key: string]: number };
  format: { [key: string]: number };
};

export type DiscogsVersion = {
  status: string;
  stats: {
    community: {
      in_collection: number;
      in_wantlist: number;
    };
  };
  thumb: string;
  format: string;
  country: string;
  title: string;
  label: string;
  released: string;
  major_formats: string[];
  catno: string;
  resource_url: string;
  id: number;
};

// Pagination

export type DiscogsPagination = {
  per_page: number;
  pages: number;
  page: number;
  urls: {
    last?: string;
    next?: string;
    prev?: string;
    first?: string;
  };
  items: number;
};

// query

export type DiscogsSearchQuery = {
  [key: string]: unknown;
  per_page?: number;
  page?: number;
  query?: string;
  type?: DiscogsSearchTypes | DiscogsSearchTypes[];
  title?: string;
  release_title?: string;
  credit?: string;
  artist?: string;
  anv?: string;
  label?: string;
  genre?: string | string[];
  style?: string | string[];
  country?: string | string[];
  year?: string | number;
  format?: string;
  catno?: string;
  barcode?: string;
  track?: string;
  submitter?: string;
  contributor?: string;
};

export type DiscogsSearchTypes = "artist" | "master" | "release" | "label";

export type DiscogsPaginationOpts = {
  page?: number;
  per_page?: number;
};

export type DiscogsGetArtistReleasesOpts = {
  sort?: "year" | "title" | "format";
} & DiscogsPaginationOpts;

export type DiscogsGetMasterVersionsOpts = {
  format?: string;
  label?: string;
  country?: string;
  sort?: "released" | "title" | "format" | "label" | "catno" | "country";
  sort_order?: "asc" | "desc";
} & DiscogsPaginationOpts;

// Release

export type DiscogsRelease = {
  identifiers: Identifier[];
  series: unknown[];
  labels: Company[];
  community: ReleaseCommunity;
  year: number;
  images?: DiscogsImage[];
  format_quantity: number;
  id: number;
  artists_sort: string;
  genres: string[];
  thumb: string;
  num_for_sale: number;
  title: string;
  artists: DiscogsEntityArtist[];
  date_changed: Date | null;
  lowest_price: number | null;
  status: string;
  released_formatted?: string;
  released?: string;
  date_added: Date | null;
  extraartists: DiscogsEntityArtist[];
  country?: string;
  notes?: string;
  tracklist: ReleaseTrack[];
  companies: Company[];
  uri: string;
  formats: Format[];
  resource_url: string;
  data_quality: string;
  estimated_weight?: number;
  styles?: string[];
  videos?: DiscogsVideo[];
  master_id?: number;
  master_url?: string;
};

export interface ReleaseCommunity {
  status: string;
  rating: Rating;
  want: number;
  contributors: Contributor[];
  have: number;
  submitter: Contributor | null;
  data_quality: string;
}

export interface Contributor {
  username: string;
  resource_url: string;
}

export interface Rating {
  count: number;
  average: number;
}

export interface Company {
  name: string;
  entity_type: string;
  catno: string;
  resource_url: string;
  id: number;
  entity_type_name: string;
}

export interface Format {
  qty: string;
  descriptions?: string[];
  name: string;
  text?: string;
}

export interface Identifier {
  type: string;
  value: string;
  description?: string;
}

export interface ReleaseTrack {
  duration: string;
  position: string;
  type_: string;
  artists?: DiscogsEntityArtist[];
  title: string;
  extraartists?: DiscogsEntityArtist[];
}

// SearchArtist

export type DiscogsSearchArtist = {
  thumb: string;
  title: string;
  uri: string;
  master_url: null;
  cover_image: string;
  resource_url: string;
  master_id: null;
  type: "artist";
  id: number;
  user_data?: {
    in_collection: boolean;
    in_wantlist: boolean;
  };
};

// SearchLabel

export type DiscogsSearchLabel = {
  thumb: string;
  title: string;
  uri: string;
  master_url: null;
  cover_image: string;
  resource_url: string;
  master_id: null;
  type: "label";
  id: number;
  user_data?: {
    in_collection: boolean;
    in_wantlist: boolean;
  };
};

// SearchMaster

export type DiscogsSearchMaster = {
  style: string[];
  thumb: string;
  format: string[];
  country: string;
  barcode: string[];
  uri: string;
  master_url: string;
  label: string[];
  genre: string[];
  catno: string;
  community: {
    want: number;
    have: number;
  };
  year?: string;
  cover_image: string;
  title: string;
  resource_url: string;
  master_id: number;
  type: "master";
  id: number;
  user_data?: {
    in_collection: boolean;
    in_wantlist: boolean;
  };
};

// SearchRelease

export type DiscogsSearchRelease = {
  style: string[];
  barcode: string[];
  thumb: string;
  title: string;
  type: "release";
  format: string[];
  uri: string;
  community: {
    want: number;
    have: number;
  };
  label: string[];
  country: string;
  cover_image: string;
  catno: string;
  master_url: null | string;
  year?: string;
  genre: string[];
  resource_url: string;
  master_id: number;
  format_quantity: number;
  id: number;
  formats: DiscogsFormat[];
  user_data?: {
    in_collection: boolean;
    in_wantlist: boolean;
  };
};

type DiscogsFormat = {
  qty: string;
  descriptions?: string[];
  name: string;
  text?: string;
};

// Video

export type DiscogsVideo = {
  duration: number;
  description: string;
  embed: boolean;
  uri: string;
  title: string;
};

// Index

export type DiscogsGetArtistResponse = DiscogsArtist;
export type DiscogsGetMasterResponse = DiscogsMaster;
export type DiscogsGetReleaseResponse = DiscogsRelease;
export type DiscogsGetLabelResponse = DiscogsLabel;

export type DiscogsGetPageResponse =
  | DiscogsLabel
  | DiscogsMaster
  | DiscogsArtist
  | DiscogsRelease;

export type DiscogsAllowedPageTypes = "artist" | "master" | "label" | "release";

export type DiscogsPageParams = {
  id: string;
  type: DiscogsAllowedPageTypes;
};

export type DiscogsGetArtistReleasesResponse = {
  pagination: DiscogsPagination;
  releases: (DiscogsArtistRelease | DiscogsArtistMaster)[];
};
export type DiscogsSearchResponse = {
  pagination?: DiscogsPagination;
  results: DiscogsSearchResult[];
};
export type DiscogsGetLabelReleasesResponse = {
  pagination: DiscogsPagination;
  releases: DiscogsLabelRelease[];
};
export type DiscogsGetMasterVersionsResponse = DiscogsMasterVersions & {
  pagination: DiscogsPagination;
};

export type DiscogsSearchResult =
  | DiscogsSearchArtist
  | DiscogsSearchLabel
  | DiscogsSearchMaster
  | DiscogsSearchRelease;

export type DiscogsGetReleaseRatingByUserResponse = {
  username: string;
  release: string;
  rating: string;
};

export type DiscogsGetCommunityReleaseRatingResponse = {
  rating: {
    count: number;
    average: number;
  };
  release_id: number;
};
