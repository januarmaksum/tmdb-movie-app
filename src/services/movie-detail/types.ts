import type { MovieSummary } from "@/services/_shared/movie-summary.types";

export type CastMember = {
  id: number;
  name: string;
  character: string | null;
  profileUrl: string | null;
};

export type Director = { id: number; name: string };

export type MovieDetails = MovieSummary & {
  tagline: string | null;
  runtime: number | null;
  genres: string[];
  directors: Director[];
  cast: CastMember[];
};
