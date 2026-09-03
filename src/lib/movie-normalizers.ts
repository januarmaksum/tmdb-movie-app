import type {
  CastMember,
  Director,
  MovieDetails,
  MoviePage,
  MovieSummary,
} from "@/types/movie";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const POSTER_FALLBACK_URL = "/poster-placeholder.svg";
const MAIN_CAST_LIMIT = 10;

type TmdbMovie = {
  id: number;
  title?: string | null;
  original_title?: string | null;
  overview?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
};

type TmdbCastMember = {
  id: number;
  name?: string | null;
  character?: string | null;
  profile_path?: string | null;
  order?: number | null;
};

type TmdbCrewMember = {
  id: number;
  name?: string | null;
  job?: string | null;
};

type TmdbCredits = {
  cast?: TmdbCastMember[] | null;
  crew?: TmdbCrewMember[] | null;
};

export type TmdbMovieListResponse = {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbMovie[];
};

export type TmdbMovieDetailsResponse = TmdbMovie & {
  tagline?: string | null;
  runtime?: number | null;
  genres?: Array<{ id: number; name?: string | null }> | null;
  credits?: TmdbCredits | null;
};

function normalizeText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function requirePositiveInteger(value: number, field: string) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new TypeError(`TMDB response contains an invalid ${field}.`);
  }

  return value;
}

function normalizeNonNegativeInteger(value: number) {
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function normalizeImageUrl(
  path: string | null | undefined,
  size: "w185" | "w500" | "w1280",
) {
  const normalizedPath = normalizeText(path);

  if (!normalizedPath?.startsWith("/")) {
    return null;
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${normalizedPath}`;
}

function normalizeReleaseDate(value: string | null | undefined) {
  const releaseDate = normalizeText(value);

  if (!releaseDate) {
    return { releaseDate: null, releaseYear: null };
  }

  const year = Number.parseInt(releaseDate.slice(0, 4), 10);

  return {
    releaseDate,
    releaseYear: Number.isInteger(year) && year > 0 ? year : null,
  };
}

export function normalizeMovieSummary(movie: TmdbMovie): MovieSummary {
  const release = normalizeReleaseDate(movie.release_date);

  return {
    id: requirePositiveInteger(movie.id, "movie ID"),
    title:
      normalizeText(movie.title) ??
      normalizeText(movie.original_title) ??
      "Untitled",
    overview: normalizeText(movie.overview),
    posterUrl:
      normalizeImageUrl(movie.poster_path, "w500") ?? POSTER_FALLBACK_URL,
    backdropUrl: normalizeImageUrl(movie.backdrop_path, "w1280"),
    releaseDate: release.releaseDate,
    releaseYear: release.releaseYear,
    voteAverage:
      typeof movie.vote_average === "number" &&
      Number.isFinite(movie.vote_average)
        ? movie.vote_average
        : null,
  };
}

function normalizeCast(credits: TmdbCredits | null | undefined) {
  return [...(credits?.cast ?? [])]
    .filter(
      (member) =>
        Number.isSafeInteger(member.id) &&
        member.id > 0,
    )
    .sort((left, right) => (left.order ?? Infinity) - (right.order ?? Infinity))
    .slice(0, MAIN_CAST_LIMIT)
    .map<CastMember>((member) => ({
      id: member.id,
      name: normalizeText(member.name) ?? "Unknown cast member",
      character: normalizeText(member.character),
      profileUrl: normalizeImageUrl(member.profile_path, "w185"),
    }));
}

function normalizeDirectors(credits: TmdbCredits | null | undefined) {
  const directors = new Map<number, Director>();

  for (const member of credits?.crew ?? []) {
    const name = normalizeText(member.name);

    if (
      member.job === "Director" &&
      Number.isSafeInteger(member.id) &&
      member.id > 0 &&
      name
    ) {
      directors.set(member.id, { id: member.id, name });
    }
  }

  return [...directors.values()];
}

export function normalizeMoviePage(
  response: TmdbMovieListResponse,
): MoviePage {
  return {
    page: normalizeNonNegativeInteger(response.page),
    totalPages: normalizeNonNegativeInteger(response.total_pages),
    totalResults: normalizeNonNegativeInteger(response.total_results),
    results: (response.results ?? []).map(normalizeMovieSummary),
  };
}

export function normalizeMovieDetails(
  movie: TmdbMovieDetailsResponse,
): MovieDetails {
  return {
    ...normalizeMovieSummary(movie),
    tagline: normalizeText(movie.tagline),
    runtime:
      typeof movie.runtime === "number" &&
      Number.isSafeInteger(movie.runtime) &&
      movie.runtime > 0
        ? movie.runtime
        : null,
    genres: (movie.genres ?? [])
      .map((genre) => normalizeText(genre.name))
      .filter((name): name is string => name !== null),
    directors: normalizeDirectors(movie.credits),
    cast: normalizeCast(movie.credits),
  };
}
