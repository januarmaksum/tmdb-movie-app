import {
  MOVIE_CATEGORIES,
  type MovieCategory,
} from "@/types/movie";

const MAX_TMDB_MOVIE_ID = 2_147_483_647;

export type MovieListRequest = {
  category: MovieCategory;
  page: number;
  query: string;
};

export class InvalidMovieRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMovieRequestError";
  }
}

function isMovieCategory(value: string): value is MovieCategory {
  return MOVIE_CATEGORIES.some((category) => category === value);
}

function parsePositiveInteger(
  value: string,
  label: string,
  maximum = Number.MAX_SAFE_INTEGER,
) {
  if (!/^\d+$/.test(value)) {
    throw new InvalidMovieRequestError(`${label} must be a positive integer.`);
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed <= 0 || parsed > maximum) {
    throw new InvalidMovieRequestError(`${label} must be a positive integer.`);
  }

  return parsed;
}

export function parseMovieListRequest(
  searchParams: URLSearchParams,
): MovieListRequest {
  const categoryValue = searchParams.get("category") ?? "popular";

  if (!isMovieCategory(categoryValue)) {
    throw new InvalidMovieRequestError("Unsupported movie category.");
  }

  const pageValue = searchParams.get("page") ?? "1";

  return {
    category: categoryValue,
    page: parsePositiveInteger(pageValue, "Page"),
    query: searchParams.get("query")?.trim() ?? "",
  };
}

export function parseMovieId(value: string) {
  return parsePositiveInteger(value, "Movie ID", MAX_TMDB_MOVIE_ID);
}
