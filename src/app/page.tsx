import {
  defaultShouldDehydrateQuery,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import {
  MovieCatalog,
  MovieCatalogLoading,
} from "@/components/movies/movie-catalog";
import { parseMovieCatalogSearchParams } from "@/lib/movie-catalog-state";
import { movieListQueryOptions } from "@/lib/movie-list-query";
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
      <SiteHeader />
      <main id="main-content" className="flex-1 py-10 sm:py-14 lg:py-16">
        <PageContainer>
          <header className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
              Cinematic discovery
            </p>
            <h1 className="mt-3 text-4xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              Find a movie worth watching.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Explore current releases and timeless favorites through a focused,
              poster-first catalog.
            </p>
          </header>

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
  const movieListRequest = {
    ...catalogState,
    page: 1,
  };
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery({
    ...movieListQueryOptions(movieListRequest),
    queryFn: () => getMovies(movieListRequest),
  });

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
