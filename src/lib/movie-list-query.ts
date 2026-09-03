import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { movieKeys } from "@/lib/movie-query-keys";
import type { ApiError, MovieCategory, MoviePage } from "@/types/movie";

export type MovieListQueryInput = {
  category: MovieCategory;
  page: number;
  query: string;
};

async function fetchMovieList(
  input: MovieListQueryInput,
  signal: AbortSignal,
): Promise<MoviePage> {
  const searchParams = new URLSearchParams({
    category: input.category,
    page: String(input.page),
  });

  if (input.query) {
    searchParams.set("query", input.query);
  }

  const response = await fetch(`/api/movies?${searchParams.toString()}`, {
    signal,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiError | null;
    throw new Error(
      payload?.error.message ?? "The movie catalog could not be loaded.",
    );
  }

  return response.json() as Promise<MoviePage>;
}

export function movieListQueryOptions(input: MovieListQueryInput) {
  return queryOptions({
    queryKey: movieKeys.list(input),
    queryFn: ({ signal }) => fetchMovieList(input, signal),
    placeholderData: keepPreviousData,
    retry: false,
  });
}
