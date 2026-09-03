import axios from "axios";
import { NextResponse } from "next/server";
import { InvalidMovieRequestError } from "@/lib/movie-request";
import { TmdbConfigurationError } from "@/lib/tmdb.server";
import type { ApiError, ApiErrorCode } from "@/types/movie";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

function errorResponse(
  code: ApiErrorCode,
  message: string,
  status: number,
  headers?: Record<string, string>,
) {
  return NextResponse.json<ApiError>(
    { error: { code, message } },
    {
      status,
      headers: {
        ...NO_STORE_HEADERS,
        ...headers,
      },
    },
  );
}

function getSafeRetryAfter(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return /^\d+$/.test(normalized) ? normalized : null;
}

export function invalidRequestResponse(error: InvalidMovieRequestError) {
  return errorResponse("INVALID_REQUEST", error.message, 400);
}

export function tmdbErrorResponse(error: unknown) {
  if (error instanceof InvalidMovieRequestError) {
    return invalidRequestResponse(error);
  }

  if (error instanceof TmdbConfigurationError) {
    return errorResponse(
      "CONFIGURATION_ERROR",
      "Movie data is temporarily unavailable.",
      500,
    );
  }

  if (!axios.isAxiosError(error)) {
    return errorResponse(
      "UPSTREAM_ERROR",
      "Movie data is temporarily unavailable.",
      500,
    );
  }

  const upstreamStatus = error.response?.status;

  if (upstreamStatus === 404) {
    return errorResponse("NOT_FOUND", "Movie not found.", 404);
  }

  if (upstreamStatus === 401 || upstreamStatus === 403) {
    return errorResponse(
      "TMDB_AUTH_ERROR",
      "Movie data is temporarily unavailable.",
      502,
    );
  }

  if (upstreamStatus === 429) {
    const retryAfter = getSafeRetryAfter(
      error.response?.headers?.["retry-after"],
    );

    return errorResponse(
      "RATE_LIMITED",
      "Too many movie requests. Please try again shortly.",
      429,
      retryAfter ? { "Retry-After": retryAfter } : undefined,
    );
  }

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return errorResponse(
      "UPSTREAM_TIMEOUT",
      "The movie service took too long to respond.",
      504,
    );
  }

  return errorResponse(
    "UPSTREAM_ERROR",
    "Movie data is temporarily unavailable.",
    502,
  );
}
