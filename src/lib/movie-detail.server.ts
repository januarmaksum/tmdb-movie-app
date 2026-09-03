import "server-only";

import axios from "axios";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  InvalidMovieRequestError,
  parseMovieId,
} from "@/lib/movie-request";
import { getMovieDetails } from "@/lib/tmdb-movies.server";

const getCachedMovieDetails = cache(getMovieDetails);

export function parseMoviePageId(value: string) {
  try {
    return parseMovieId(value);
  } catch (error) {
    if (error instanceof InvalidMovieRequestError) {
      notFound();
    }

    throw error;
  }
}

export async function getMovieDetailsForPage(movieId: number) {
  try {
    return await getCachedMovieDetails(movieId);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        notFound();
      }

      throw new Error("Movie data is temporarily unavailable.");
    }

    throw error;
  }
}
