import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { MovieDetail } from "@/components/movies/movie-detail";
import { getQueryClient } from "@/lib/query-client";
import { movieDetailQueryOptions } from "@/services/movie-detail/query";
import {
  getMovieDetailsForPage,
  parseMoviePageId,
} from "@/services/movie-detail/server";

export async function generateMetadata({
  params,
}: PageProps<"/movies/[id]">): Promise<Metadata> {
  const { id } = await params;
  const movieId = parseMoviePageId(id);

  try {
    const movie = await getMovieDetailsForPage(movieId);

    return {
      title: movie.title,
      description:
        movie.overview ?? `Explore details, cast, and credits for ${movie.title}.`,
    };
  } catch {
    return {
      title: "Movie details",
      description: "Explore movie details, cast, and credits.",
    };
  }
}

export default async function MovieDetailPage({
  params,
}: PageProps<"/movies/[id]">) {
  const { id } = await params;
  const movieId = parseMoviePageId(id);
  const queryClient = getQueryClient();

  await queryClient.query({
    ...movieDetailQueryOptions(movieId),
    queryFn: () => getMovieDetailsForPage(movieId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MovieDetail movieId={movieId} />
    </HydrationBoundary>
  );
}
