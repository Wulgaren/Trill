export enum ItunesMedia {
  Movie = "movie",
  Podcast = "podcast",
  Music = "music",
  MusicVideo = "musicVideo",
  AudioBook = "audiobook",
  ShortFilm = "shortFilm",
  TvShow = "tvShow",
  Software = "software",
  Ebook = "ebook",
  All = "all",
}

export enum ItunesEntityMovie {
  MovieArtist = "movieArtist",
  Movie = "movie",
}

export enum ItunesEntityPodcast {
  PodcastAuthor = "podcastAuthor",
  Podcast = "podcast",
}

export enum ItunesEntityMusic {
  MusicArtist = "musicArtist",
  MusicTrack = "musicTrack",
  Album = "album",
  MusicVideo = "musicVideo",
  Mix = "mix",
  Song = "song",
}

export enum ItunesEntityMusicVideo {
  MusicArtist = "musicArtist",
  MusicVideo = "musicVideo",
}

export enum ItunesEntityAudioBook {
  AudioBookAuthor = "audiobookAuthor",
  AudioBook = "audiobook",
}

export enum ItunesEntityShortFilm {
  ShortFilmArtist = "shortFilmArtist",
  ShortFilm = "shortFilm",
}

export enum ItunesEntityTvShow {
  TvEpisode = "tvEpisode",
  TvSeason = "tvSeason",
}

export enum ItunesEntitySoftware {
  Software = "software",
  IPadSoftware = "iPadSoftware",
  MacSoftware = "macSoftware",
}

export enum ItunesEntityEbook {
  Ebook = "ebook",
}

export enum ItunesEntityAll {
  Movie = "movie",
  Album = "album",
  AllArtist = "allArtist",
  Podcast = "podcast",
  MusicVideo = "musicVideo",
  Mix = "mix",
  AudioBook = "audiobook",
  TvSeason = "tvSeason",
  AllTrack = "allTrack",
}

export interface ISearchOptions {
  // A query to search for.
  term: string;

  // TODO: Add ISO 3166 2 npm package to compare entry to valid countries.
  // A valid ISO 3166-1-alpha-2 country code.
  country?: string;

  // The type of media to search for, the default is 'all'
  media?: ItunesMedia;

  // The type of results wanted,
  entity?:
    | ItunesEntityMovie
    | ItunesEntityPodcast
    | ItunesEntityMusic
    | ItunesEntityMusicVideo
    | ItunesEntityAudioBook
    | ItunesEntityShortFilm
    | ItunesEntityTvShow
    | ItunesEntitySoftware
    | ItunesEntityEbook
    | ItunesEntityAll;

  // Maximum number of results to return.
  limit?: number;

  // Language to return the results in. (default is "en_us")
  lang?: "en_us" | "ja_jp";

  // JS object with any extra search parameters not found in this class.
  extras?: object;
}

export class ItunesSearchOptions {
  term: string;
  country?: string;
  media?: ItunesMedia;
  entity?:
    | ItunesEntityMovie
    | ItunesEntityPodcast
    | ItunesEntityMusic
    | ItunesEntityMusicVideo
    | ItunesEntityAudioBook
    | ItunesEntityShortFilm
    | ItunesEntityTvShow
    | ItunesEntitySoftware
    | ItunesEntityEbook
    | ItunesEntityAll;
  limit?: number;
  lang?: "en_us" | "ja_jp";
  extras?: object;

  constructor(options: {
    term: string;
    country?: string;
    media?: ItunesMedia;
    entity?:
      | ItunesEntityMovie
      | ItunesEntityPodcast
      | ItunesEntityMusic
      | ItunesEntityMusicVideo
      | ItunesEntityAudioBook
      | ItunesEntityShortFilm
      | ItunesEntityTvShow
      | ItunesEntitySoftware
      | ItunesEntityEbook
      | ItunesEntityAll;
    limit?: number;
    lang?: "en_us" | "ja_jp";
    extras?: object;
  }) {
    this.term = options.term;
    this.country = options.country;
    this.media = options.media;
    this.entity = options.entity;
    this.limit = options.limit;
    this.lang = options.lang;
    this.extras = options.extras;
  }

  static from = (options: ISearchOptions): ItunesSearchOptions =>
    new ItunesSearchOptions({
      term: options.term,
      country: options.country,
      media: options.media,
      entity: options.entity,
      limit: options.limit,
      lang: options.lang,
      extras: options.extras,
    });
}

export type itunesProperties = {
  artistId?: number;
  collectionId?: number;
  trackId?: number;

  artistName?: string;
  collectionName: string;
  trackName?: string;
  collectionCensoredName?: string;
  trackCensoredName?: string;

  artistLinkUrl?: string;
  collectionViewUrl?: string;
  trackViewUrl?: string;
  previewUrl?: string;
  artworkUrl30?: string;
  artworkUrl60?: string;
  artworkUrl100?: string;

  collectionPrice?: number;
  trackPrice?: number;
  releaseDate?: string;

  discCount?: number;
  discNumber?: number;
  trackCount?: number;
  trackNumber?: number;
  trackTimeMillis?: number;

  country?: string;
  currency?: string;
  primaryGenreName?: string;
  isStreamable?: boolean;
};

export type SongLinkData = {
  pageUrl: string;
  linksByPlatform: MusicServices;
};
// Define a type for the common structure of each music service entry
interface MusicServiceEntry {
  country: string;
  url: string;
  entityUniqueId: string;
  nativeAppUriMobile?: string;
  nativeAppUriDesktop?: string;
}

// Define an interface for the complete object containing all music services
interface MusicServices {
  amazonMusic: MusicServiceEntry;
  amazonStore: MusicServiceEntry;
  anghami: MusicServiceEntry;
  bandcamp: MusicServiceEntry;
  boomplay: MusicServiceEntry;
  deezer: MusicServiceEntry;
  napster: MusicServiceEntry;
  pandora: MusicServiceEntry;
  soundcloud: MusicServiceEntry;
  spotify: MusicServiceEntry;
  tidal: MusicServiceEntry;
  yandex: MusicServiceEntry;
  youtube: MusicServiceEntry;
  youtubeMusic: MusicServiceEntry;
  appleMusic: MusicServiceEntry;
  itunes: MusicServiceEntry;
}

export type itunesSearchParams = {
  artist?: string;
  track?: string;
  album?: string;
}