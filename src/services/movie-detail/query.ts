import { queryOptions } from "@tanstack/react-query";
import type { ApiError } from "@/services/_shared/api-error.types";
import type { MovieDetails } from "@/services/movie-detail/types";

const movieRootKey = ["movies"] as const;

export const movieDetailKeys = {
  details: () => [...movieRootKey, "detail"] as const,
  detail: (movieId: number) => {
    if (!Number.isSafeInteger(movieId) || movieId <= 0) {
      throw new RangeError("Movie ID must be a positive integer.");
    }
    return [...movieRootKey, "detail", movieId] as const;
  },
};

async function fetchMovieDetails(movieId: number, signal: AbortSignal): Promise<MovieDetails> {
  const response = await fetch(`/api/movies/${movieId}`, { signal });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(payload?.error.message ?? "The movie details could not be loaded.");
  }

  return response.json() as Promise<MovieDetails>;
}

export function movieDetailQueryOptions(movieId: number) {
  return queryOptions<MovieDetails, Error, MovieDetails, ReturnType<typeof movieDetailKeys.detail>>({
    queryKey: movieDetailKeys.detail(movieId),
    queryFn: ({ signal }) => fetchMovieDetails(movieId, signal),
    retry: false,
  });
}
