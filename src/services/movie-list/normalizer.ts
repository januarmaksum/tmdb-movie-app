import {
  normalizeMovieSummary,
  normalizeNonNegativeInteger,
  type TmdbMovie,
} from "@/services/_shared/movie-normalizer";
import type { MoviePage } from "@/services/movie-list/types";

export type TmdbMovieListResponse = {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbMovie[];
};

export function normalizeMoviePage(response: TmdbMovieListResponse): MoviePage {
  return {
    page: normalizeNonNegativeInteger(response.page),
    totalPages: normalizeNonNegativeInteger(response.total_pages),
    totalResults: normalizeNonNegativeInteger(response.total_results),
    results: (response.results ?? []).map(normalizeMovieSummary),
  };
}
