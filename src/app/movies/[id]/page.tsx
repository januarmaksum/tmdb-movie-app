import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { CatalogLink } from "@/components/movies/catalog-link";
import { MovieDetail } from "@/components/movies/movie-detail";
import {
  getMovieDetailsForPage,
  parseMoviePageId,
} from "@/lib/movie-detail.server";
import { movieDetailQueryOptions } from "@/lib/movie-detail-query";
import { getQueryClient } from "@/lib/query-client";

export async function generateMetadata({
  params,
}: PageProps<"/movies/[id]">): Promise<Metadata> {
  const { id } = await params;
  const movieId = parseMoviePageId(id);

  try {
    const movie = await getMovieDetailsForPage(movieId);

    return {
      title: `${movie.title} | Movie Explorer`,
      description:
        movie.overview ?? `Explore details, cast, and credits for ${movie.title}.`,
    };
  } catch {
    return {
      title: "Movie details | Movie Explorer",
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
    <>
      <CatalogLink />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MovieDetail movieId={movieId} />
      </HydrationBoundary>
    </>
  );
}
