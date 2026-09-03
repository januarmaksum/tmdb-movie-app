import {
  normalizeImageUrl,
  normalizeMovieSummary,
  normalizeText,
  type TmdbMovie,
} from "@/services/_shared/movie-normalizer";
import type { CastMember, Director, MovieDetails } from "@/services/movie-detail/types";

const MAIN_CAST_LIMIT = 10;
type TmdbCastMember = { id: number; name?: string | null; character?: string | null; profile_path?: string | null; order?: number | null };
type TmdbCrewMember = { id: number; name?: string | null; job?: string | null };
type TmdbCredits = { cast?: TmdbCastMember[] | null; crew?: TmdbCrewMember[] | null };

export type TmdbMovieDetailsResponse = TmdbMovie & {
  tagline?: string | null;
  runtime?: number | null;
  genres?: Array<{ id: number; name?: string | null }> | null;
  credits?: TmdbCredits | null;
};

function normalizeCast(credits: TmdbCredits | null | undefined) {
  return [...(credits?.cast ?? [])]
    .filter((member) => Number.isSafeInteger(member.id) && member.id > 0)
    .sort((left, right) => (left.order ?? Infinity) - (right.order ?? Infinity))
    .slice(0, MAIN_CAST_LIMIT)
    .map<CastMember>((member) => ({
      id: member.id,
      name: normalizeText(member.name) ?? "Unknown cast member",
      character: normalizeText(member.character),
      profileUrl: normalizeImageUrl(member.profile_path, "w185"),
    }));
}

function normalizeDirectors(credits: TmdbCredits | null | undefined) {
  const directors = new Map<number, Director>();
  for (const member of credits?.crew ?? []) {
    const name = normalizeText(member.name);
    if (member.job === "Director" && Number.isSafeInteger(member.id) && member.id > 0 && name) {
      directors.set(member.id, { id: member.id, name });
    }
  }
  return [...directors.values()];
}

export function normalizeMovieDetails(movie: TmdbMovieDetailsResponse): MovieDetails {
  return {
    ...normalizeMovieSummary(movie),
    tagline: normalizeText(movie.tagline),
    runtime:
      typeof movie.runtime === "number" && Number.isSafeInteger(movie.runtime) && movie.runtime > 0
        ? movie.runtime
        : null,
    genres: (movie.genres ?? [])
      .map((genre) => normalizeText(genre.name))
      .filter((name): name is string => name !== null),
    directors: normalizeDirectors(movie.credits),
    cast: normalizeCast(movie.credits),
  };
}
