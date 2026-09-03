import {
  MOVIE_CATEGORIES,
  type MovieCategory,
} from "@/services/movie-list/types";

export const DEFAULT_MOVIE_CATEGORY: MovieCategory = "popular";

export type MovieCatalogState = {
  category: MovieCategory;
  query: string;
};

type SearchParamValue = string | string[] | undefined;

function getFirstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

export function normalizeMovieCategory(
  value: string | null | undefined,
): MovieCategory {
  return MOVIE_CATEGORIES.some((category) => category === value)
    ? (value as MovieCategory)
    : DEFAULT_MOVIE_CATEGORY;
}

export function normalizeMovieQuery(value: string | null | undefined) {
  return value?.trim() ?? "";
}

export function parseMovieCatalogSearchParams(searchParams: {
  category?: SearchParamValue;
  q?: SearchParamValue;
}): MovieCatalogState {
  return {
    category: normalizeMovieCategory(getFirstValue(searchParams.category)),
    query: normalizeMovieQuery(getFirstValue(searchParams.q)),
  };
}

export function parseMovieCatalogUrlSearchParams(
  searchParams: Pick<URLSearchParams, "get">,
): MovieCatalogState {
  return {
    category: normalizeMovieCategory(searchParams.get("category")),
    query: normalizeMovieQuery(searchParams.get("q")),
  };
}
