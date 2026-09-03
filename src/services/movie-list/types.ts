import type { MovieSummary } from "@/services/_shared/movie-summary.types";

export const MOVIE_CATEGORIES = [
  "now_playing",
  "popular",
  "top_rated",
  "upcoming",
] as const;

export type MovieCategory = (typeof MOVIE_CATEGORIES)[number];

export type MovieListKeyInput = {
  category: MovieCategory;
  query?: string;
};

export type MovieListRequest = {
  category: MovieCategory;
  page: number;
  query: string;
};

export type MoviePage = {
  page: number;
  totalPages: number;
  totalResults: number;
  results: MovieSummary[];
};
