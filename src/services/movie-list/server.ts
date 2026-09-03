import "server-only";

import { normalizeMoviePage, type TmdbMovieListResponse } from "@/services/movie-list/normalizer";
import type { MovieCategory, MoviePage } from "@/services/movie-list/types";
import { getTmdbClient } from "@/services/tmdb/client.server";

const TMDB_LANGUAGE = "en-US";
const categoryEndpoints: Record<MovieCategory, string> = {
  now_playing: "/movie/now_playing",
  popular: "/movie/popular",
  top_rated: "/movie/top_rated",
  upcoming: "/movie/upcoming",
};

type GetMoviesInput = { category: MovieCategory; page: number; query: string };

export async function getMovies({ category, page, query }: GetMoviesInput): Promise<MoviePage> {
  const client = getTmdbClient();

  if (query) {
    const { data } = await client.get<TmdbMovieListResponse>("/search/movie", {
      params: { query, page, language: TMDB_LANGUAGE, include_adult: false },
    });
    return normalizeMoviePage(data);
  }

  const { data } = await client.get<TmdbMovieListResponse>(categoryEndpoints[category], {
    params: { page, language: TMDB_LANGUAGE },
  });
  return normalizeMoviePage(data);
}
