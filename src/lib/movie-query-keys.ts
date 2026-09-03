import type { MovieListKeyInput } from "@/types/movie";

export type { MovieCategory, MovieListKeyInput } from "@/types/movie";

const movieRootKey = ["movies"] as const;

function normalizeListKey({ category, query }: MovieListKeyInput) {
  const normalizedQuery = query?.trim() ?? "";

  return {
    mode: normalizedQuery ? ("search" as const) : ("category" as const),
    category,
    query: normalizedQuery,
  };
}

export const movieKeys = {
  all: movieRootKey,
  lists: () => [...movieRootKey, "list"] as const,
  list: (input: MovieListKeyInput) =>
    [...movieRootKey, "list", normalizeListKey(input)] as const,
  details: () => [...movieRootKey, "detail"] as const,
  detail: (movieId: number) => {
    if (!Number.isSafeInteger(movieId) || movieId <= 0) {
      throw new RangeError("Movie ID must be a positive integer.");
    }

    return [...movieRootKey, "detail", movieId] as const;
  },
};
