import "server-only";

import axios from "axios";
import { notFound } from "next/navigation";
import { cache } from "react";
import { InvalidMovieRequestError } from "@/services/_shared/request-error";
import { normalizeMovieDetails, type TmdbMovieDetailsResponse } from "@/services/movie-detail/normalizer";
import { parseMovieId } from "@/services/movie-detail/request";
import type { MovieDetails } from "@/services/movie-detail/types";
import { getTmdbClient } from "@/services/tmdb/client.server";

const TMDB_LANGUAGE = "en-US";

async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  const { data } = await getTmdbClient().get<TmdbMovieDetailsResponse>(`/movie/${movieId}`, {
    params: { append_to_response: "credits", language: TMDB_LANGUAGE },
  });
  return normalizeMovieDetails(data);
}

const getCachedMovieDetails = cache(getMovieDetails);

export function parseMoviePageId(value: string) {
  try {
    return parseMovieId(value);
  } catch (error) {
    if (error instanceof InvalidMovieRequestError) notFound();
    throw error;
  }
}

export async function getMovieDetailsForPage(movieId: number) {
  try {
    return await getCachedMovieDetails(movieId);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) notFound();
      throw new Error("Movie data is temporarily unavailable.");
    }
    throw error;
  }
}

export { getMovieDetails };
