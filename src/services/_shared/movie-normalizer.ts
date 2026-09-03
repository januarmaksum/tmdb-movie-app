import type { MovieSummary } from "@/services/_shared/movie-summary.types";

export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
export const POSTER_FALLBACK_URL = "/poster-placeholder.svg";

export type TmdbMovie = {
  id: number;
  title?: string | null;
  original_title?: string | null;
  overview?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string | null;
  vote_average?: number | null;
};

export function normalizeText(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export function normalizeNonNegativeInteger(value: number) {
  return Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

export function normalizeImageUrl(
  path: string | null | undefined,
  size: "w185" | "w500" | "w1280",
) {
  const normalizedPath = normalizeText(path);

  if (!normalizedPath?.startsWith("/")) {
    return null;
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${normalizedPath}`;
}

function requirePositiveInteger(value: number, field: string) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new TypeError(`TMDB response contains an invalid ${field}.`);
  }

  return value;
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
