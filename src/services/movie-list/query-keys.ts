import type { MovieListKeyInput } from "@/services/movie-list/types";

const movieRootKey = ["movies"] as const;

function normalizeListKey({ category, query }: MovieListKeyInput) {
  const normalizedQuery = query?.trim() ?? "";

  return {
    mode: normalizedQuery ? ("search" as const) : ("category" as const),
    category,
    query: normalizedQuery,
  };
}

export const movieListKeys = {
  all: movieRootKey,
  lists: () => [...movieRootKey, "list"] as const,
  list: (input: MovieListKeyInput) =>
    [...movieRootKey, "list", normalizeListKey(input)] as const,
};
