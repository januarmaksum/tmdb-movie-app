import { queryOptions } from "@tanstack/react-query";
import { movieKeys } from "@/lib/movie-query-keys";
import type { ApiError, MovieDetails } from "@/types/movie";

async function fetchMovieDetails(
  movieId: number,
  signal: AbortSignal,
): Promise<MovieDetails> {
  const response = await fetch(`/api/movies/${movieId}`, { signal });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(
      payload?.error.message ?? "The movie details could not be loaded.",
    );
  }

  return response.json() as Promise<MovieDetails>;
}

export function movieDetailQueryOptions(movieId: number) {
  return queryOptions<
    MovieDetails,
    Error,
    MovieDetails,
    ReturnType<typeof movieKeys.detail>
  >({
    queryKey: movieKeys.detail(movieId),
    queryFn: ({ signal }) => fetchMovieDetails(movieId, signal),
    retry: false,
  });
}
