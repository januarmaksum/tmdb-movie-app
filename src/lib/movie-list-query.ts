import {
  infiniteQueryOptions,
  keepPreviousData,
  type InfiniteData,
} from "@tanstack/react-query";
import { movieKeys } from "@/lib/movie-query-keys";
import type { ApiError, MovieCategory, MoviePage } from "@/types/movie";

export type MovieListQueryInput = {
  category: MovieCategory;
  query: string;
};

async function fetchMovieList(
  input: MovieListQueryInput,
  page: number,
  signal: AbortSignal,
): Promise<MoviePage> {
  const searchParams = new URLSearchParams({
    category: input.category,
    page: String(page),
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

export function movieListInfiniteQueryOptions(input: MovieListQueryInput) {
  return infiniteQueryOptions<
    MoviePage,
    Error,
    InfiniteData<MoviePage, number>,
    ReturnType<typeof movieKeys.list>,
    number
  >({
    queryKey: movieKeys.list(input),
    queryFn: ({ pageParam, signal }) =>
      fetchMovieList(input, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < 1 || lastPage.page >= lastPage.totalPages) {
        return undefined;
      }

      return lastPage.page + 1;
    },
    placeholderData: keepPreviousData,
    retry: false,
  });
}
