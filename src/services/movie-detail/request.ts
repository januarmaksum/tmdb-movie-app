import { InvalidMovieRequestError } from "@/services/_shared/request-error";

const MAX_TMDB_MOVIE_ID = 2_147_483_647;

export function parseMovieId(value: string) {
  if (!/^\d+$/.test(value)) {
    throw new InvalidMovieRequestError("Movie ID must be a positive integer.");
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed <= 0 || parsed > MAX_TMDB_MOVIE_ID) {
    throw new InvalidMovieRequestError("Movie ID must be a positive integer.");
  }

  return parsed;
}
