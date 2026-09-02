import "server-only";

import {
  normalizeMovieDetails,
  normalizeMoviePage,
  type TmdbMovieDetailsResponse,
  type TmdbMovieListResponse,
} from "@/lib/movie-normalizers";
import { getTmdbClient } from "@/lib/tmdb.server";
import type { MovieCategory, MovieDetails, MoviePage } from "@/types/movie";

const TMDB_LANGUAGE = "en-US";

const categoryEndpoints: Record<MovieCategory, string> = {
  now_playing: "/movie/now_playing",
  popular: "/movie/popular",
  top_rated: "/movie/top_rated",
  upcoming: "/movie/upcoming",
};

type GetMoviesInput = {
  category: MovieCategory;
  page: number;
  query: string;
};

export async function getMovies({
  category,
  page,
  query,
}: GetMoviesInput): Promise<MoviePage> {
  const client = getTmdbClient();

  if (query) {
    const { data } = await client.get<TmdbMovieListResponse>("/search/movie", {
      params: {
        query,
        page,
        language: TMDB_LANGUAGE,
        include_adult: false,
      },
    });

    return normalizeMoviePage(data);
  }

  const { data } = await client.get<TmdbMovieListResponse>(
    categoryEndpoints[category],
    {
      params: {
        page,
        language: TMDB_LANGUAGE,
      },
    },
  );

  return normalizeMoviePage(data);
}

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const client = getTmdbClient();
  const { data } = await client.get<TmdbMovieDetailsResponse>(
    `/movie/${movieId}`,
    {
      params: {
        append_to_response: "credits",
        language: TMDB_LANGUAGE,
      },
    },
  );

  return normalizeMovieDetails(data);
}
