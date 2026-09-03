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

export type MovieSummary = {
  id: number;
  title: string;
  overview: string | null;
  posterUrl: string;
  backdropUrl: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  voteAverage: number | null;
};

export type CastMember = {
  id: number;
  name: string;
  character: string | null;
  profileUrl: string | null;
};

export type Director = {
  id: number;
  name: string;
};

export type MovieDetails = MovieSummary & {
  tagline: string | null;
  runtime: number | null;
  genres: string[];
  directors: Director[];
  cast: CastMember[];
};

export type MoviePage = {
  page: number;
  totalPages: number;
  totalResults: number;
  results: MovieSummary[];
};

export type ApiErrorCode =
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "CONFIGURATION_ERROR"
  | "TMDB_AUTH_ERROR"
  | "RATE_LIMITED"
  | "UPSTREAM_TIMEOUT"
  | "UPSTREAM_ERROR";

export type ApiError = {
  error: {
    code: ApiErrorCode;
    message: string;
  };
};
