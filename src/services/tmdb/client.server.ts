import "server-only";

import axios, { type AxiosInstance } from "axios";

const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_REQUEST_TIMEOUT_MS = 10_000;
let tmdbClient: AxiosInstance | undefined;

export class TmdbConfigurationError extends Error {
  constructor() {
    super("TMDB API credentials are not configured.");
    this.name = "TmdbConfigurationError";
  }
}

export function getTmdbClient() {
  const accessToken = process.env.TMDB_API_TOKEN?.trim();
  if (!accessToken) throw new TmdbConfigurationError();

  tmdbClient ??= axios.create({
    baseURL: TMDB_API_BASE_URL,
    timeout: TMDB_REQUEST_TIMEOUT_MS,
    headers: { Accept: "application/json", Authorization: `Bearer ${accessToken}` },
  });
  return tmdbClient;
}
