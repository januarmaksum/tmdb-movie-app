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
