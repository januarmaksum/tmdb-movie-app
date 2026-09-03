import {
  defaultShouldDehydrateQuery,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import {
  MovieCatalog,
  MovieCatalogLoading,
} from "@/components/movies/movie-catalog";
import { parseMovieCatalogSearchParams } from "@/lib/movie-catalog-state";
import { movieListInfiniteQueryOptions } from "@/lib/movie-list-query";
import { getQueryClient } from "@/lib/query-client";
import { getMovies } from "@/lib/tmdb-movies.server";

type HomeProps = {
  searchParams: Promise<{
    category?: string | string[];
    q?: string | string[];
  }>;
};

export default function Home({ searchParams }: HomeProps) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      <main id="main-content" className="flex-1 pb-10 sm:pb-14 lg:pb-16">
        <PageContainer>
          <Suspense fallback={<MovieCatalogLoading />}>
            <MovieCatalogData searchParams={searchParams} />
          </Suspense>
        </PageContainer>
      </main>
    </div>
  );
}

async function MovieCatalogData({ searchParams }: HomeProps) {
  const catalogState = parseMovieCatalogSearchParams(await searchParams);
  const queryClient = getQueryClient();

  await queryClient
    .infiniteQuery({
      ...movieListInfiniteQueryOptions(catalogState),
      queryFn: ({ pageParam }) =>
        getMovies({ ...catalogState, page: pageParam }),
    })
    .catch(() => undefined);

  return (
    <HydrationBoundary
      state={dehydrate(queryClient, {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      })}
    >
      <MovieCatalog />
    </HydrationBoundary>
  );
}
