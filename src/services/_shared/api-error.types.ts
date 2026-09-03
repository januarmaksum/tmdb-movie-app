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
