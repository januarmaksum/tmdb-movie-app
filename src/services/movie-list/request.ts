import { InvalidMovieRequestError } from "@/services/_shared/request-error";
import {
  MOVIE_CATEGORIES,
  type MovieCategory,
  type MovieListRequest,
} from "@/services/movie-list/types";

export { InvalidMovieRequestError } from "@/services/_shared/request-error";

function isMovieCategory(value: string): value is MovieCategory {
  return MOVIE_CATEGORIES.some((category) => category === value);
}

function parsePositiveInteger(value: string, label: string) {
  if (!/^\d+$/.test(value)) {
    throw new InvalidMovieRequestError(`${label} must be a positive integer.`);
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
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
