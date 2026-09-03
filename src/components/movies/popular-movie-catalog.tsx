"use client";

import { useQuery } from "@tanstack/react-query";
import {
  movieListQueryOptions,
  popularMovieListRequest,
} from "@/lib/movie-list-query";
import { EmptyState, ErrorState } from "./catalog-feedback";
import { CatalogHeading } from "./catalog-heading";
import { MovieCard } from "./movie-card";
import { MovieGrid } from "./movie-grid";
import { SkeletonCard } from "./skeleton-card";

const SKELETON_COUNT = 10;

export function PopularMovieCatalog() {
  const { data, isError, isFetching, isPending, refetch } = useQuery(
    movieListQueryOptions(popularMovieListRequest),
  );

  if (isPending) {
    return <PopularCatalogLoading />;
  }

  const retryAction = (
    <button
      type="button"
      onClick={() => void refetch()}
      disabled={isFetching}
      aria-label={
        isFetching ? "Retrying popular movies" : "Retry loading popular movies"
      }
      className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isFetching ? "Trying again…" : "Try again"}
    </button>
  );

  return (
    <section
      className="mt-10"
      aria-labelledby="catalog-heading"
      aria-busy={isFetching}
    >
      <CatalogHeading resultCount={data?.results.length} />

      {isError ? (
        <ErrorState
          title="We could not load the catalog"
          description="Popular movies are temporarily unavailable. Please try again."
          action={retryAction}
        />
      ) : data.results.length === 0 ? (
        <EmptyState
          title="No popular movies available"
          description="There are no movies to show right now. Refresh the catalog to check again."
          action={retryAction}
        />
      ) : (
        <>
          {isFetching ? (
            <span className="sr-only">Refreshing popular movies</span>
          ) : null}
          <MovieGrid>
            {data.results.map((movie, index) => (
              <li key={movie.id} className="min-w-0">
                <MovieCard
                  movie={movie}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </li>
            ))}
          </MovieGrid>
        </>
      )}
    </section>
  );
}

export function PopularCatalogLoading() {
  return (
    <section
      className="mt-10"
      aria-busy="true"
      aria-labelledby="catalog-heading"
      aria-describedby="catalog-loading-status"
    >
      <CatalogHeading />
      <span id="catalog-loading-status" className="sr-only">
        Loading popular movies
      </span>
      <MovieGrid>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </MovieGrid>
    </section>
  );
}
