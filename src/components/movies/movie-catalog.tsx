"use client";

import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  normalizeMovieQuery,
  parseMovieCatalogUrlSearchParams,
  type MovieCatalogState,
} from "@/lib/movie-catalog-state";
import { movieListInfiniteQueryOptions } from "@/lib/movie-list-query";
import type { MovieCategory, MoviePage, MovieSummary } from "@/types/movie";
import { EmptyState, ErrorState } from "./catalog-feedback";
import { CatalogHeading } from "./catalog-heading";
import { CategoryFilter, getCategoryLabel } from "./category-filter";
import { MovieCard } from "./movie-card";
import { MovieGrid } from "./movie-grid";
import { SearchInput } from "./search-input";
import { SkeletonCard } from "./skeleton-card";

const SEARCH_DEBOUNCE_MS = 350;
const SKELETON_COUNT = 10;

export function MovieCatalog() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const catalogState = parseMovieCatalogUrlSearchParams(searchParams);
  const queryResult = useInfiniteQuery(
    movieListInfiniteQueryOptions(catalogState),
  );
  const movies = useMemo(
    () => collectUniqueMovies(queryResult.data),
    [queryResult.data],
  );
  const isSearchMode = catalogState.query.length > 0;

  const updateCatalogUrl = useCallback(
    (nextState: MovieCatalogState, historyMode: "push" | "replace") => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.set("category", nextState.category);
      nextSearchParams.delete("page");

      if (nextState.query) {
        nextSearchParams.set("q", nextState.query);
      } else {
        nextSearchParams.delete("q");
      }

      const queryString = nextSearchParams.toString();
      const nextUrl = `${pathname}${queryString ? `?${queryString}` : ""}${window.location.hash}`;

      if (historyMode === "push") {
        window.history.pushState(null, "", nextUrl);
      } else {
        window.history.replaceState(null, "", nextUrl);
      }
    },
    [pathname, searchParams],
  );

  const commitSearch = useCallback(
    (value: string) => {
      const normalizedQuery = normalizeMovieQuery(value);

      if (normalizedQuery !== catalogState.query) {
        updateCatalogUrl(
          { category: catalogState.category, query: normalizedQuery },
          "replace",
        );
      }
    },
    [catalogState.category, catalogState.query, updateCatalogUrl],
  );

  useEffect(() => {
    const canonicalSearchParams = new URLSearchParams(searchParams.toString());
    canonicalSearchParams.set("category", catalogState.category);
    canonicalSearchParams.delete("page");

    if (catalogState.query) {
      canonicalSearchParams.set("q", catalogState.query);
    } else {
      canonicalSearchParams.delete("q");
    }

    const canonicalQuery = canonicalSearchParams.toString();

    if (canonicalQuery !== searchParams.toString()) {
      const canonicalUrl = `${pathname}?${canonicalQuery}${window.location.hash}`;
      window.history.replaceState(null, "", canonicalUrl);
    }
  }, [catalogState.category, catalogState.query, pathname, searchParams]);

  const handleCategoryChange = useCallback(
    (category: MovieCategory) => {
      if (category !== catalogState.category || isSearchMode) {
        updateCatalogUrl({ category, query: "" }, "push");
      }
    },
    [catalogState.category, isSearchMode, updateCatalogUrl],
  );

  const clearSearch = useCallback(() => {
    commitSearch("");
  }, [commitSearch]);

  const headingProps = isSearchMode
    ? {
        eyebrow: "Search results",
        heading: `Results for “${catalogState.query}”`,
      }
    : {
        eyebrow: getCategoryLabel(catalogState.category),
        heading: "Movies to explore",
      };
  const loadingStatus =
    queryResult.isFetching && !queryResult.isFetchingNextPage
    ? isSearchMode
      ? `Searching for “${catalogState.query}”…`
      : `Updating ${getCategoryLabel(catalogState.category)} movies…`
    : undefined;

  return (
    <section
      aria-labelledby="catalog-heading"
      aria-busy={queryResult.isFetching}
    >
      <SearchControls
        key={`search-controls:${catalogState.category}:${catalogState.query}`}
        initialQuery={catalogState.query}
        selectedCategory={isSearchMode ? null : catalogState.category}
        onSearchCommit={commitSearch}
        onCategoryChange={handleCategoryChange}
      />

      <CatalogHeading
        {...headingProps}
        resultCount={loadingStatus ? undefined : movies.length}
        status={loadingStatus}
      />

      <CatalogContent
        key={`catalog-content:${catalogState.category}:${catalogState.query}`}
        catalogState={catalogState}
        isSearchMode={isSearchMode}
        movies={movies}
        queryResult={queryResult}
        onClearSearch={clearSearch}
      />
    </section>
  );
}

type SearchControlsProps = {
  initialQuery: string;
  selectedCategory: MovieCategory | null;
  onSearchCommit: (value: string) => void;
  onCategoryChange: (category: MovieCategory) => void;
};

function SearchControls({
  initialQuery,
  selectedCategory,
  onSearchCommit,
  onCategoryChange,
}: SearchControlsProps) {
  const [searchValue, setSearchValue] = useState(initialQuery);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDebounceTimer = useCallback(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearDebounceTimer();

    if (normalizeMovieQuery(searchValue) === initialQuery) {
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearchCommit(searchValue);
      debounceTimerRef.current = null;
    }, SEARCH_DEBOUNCE_MS);

    return clearDebounceTimer;
  }, [clearDebounceTimer, initialQuery, onSearchCommit, searchValue]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearDebounceTimer();
    onSearchCommit(searchValue);
  }

  function handleCategoryChange(category: MovieCategory) {
    clearDebounceTimer();
    setSearchValue("");
    onCategoryChange(category);
  }

  return (
    <div className="mb-10 rounded-lg border border-border bg-surface/60 p-4 sm:p-6">
      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <form role="search" onSubmit={handleSearchSubmit} className="min-w-0">
          <SearchInput
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by title"
            aria-describedby="search-helper-text"
          />
        </form>
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>
    </div>
  );
}

type CatalogContentProps = {
  catalogState: MovieCatalogState;
  isSearchMode: boolean;
  movies: MovieSummary[];
  queryResult: UseInfiniteQueryResult<
    InfiniteData<MoviePage, number>,
    Error
  >;
  onClearSearch: () => void;
};

function CatalogContent({
  catalogState,
  isSearchMode,
  movies,
  queryResult,
  onClearSearch,
}: CatalogContentProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchNextPageError,
    isFetchingNextPage,
    isPending,
    refetch,
  } = queryResult;
  const [retryKind, setRetryKind] = useState<
    "error" | "empty" | "next-page" | null
  >(null);

  async function retryCatalog(kind: "error" | "empty") {
    setRetryKind(kind);

    try {
      await refetch();
    } finally {
      setRetryKind(null);
    }
  }

  async function loadNextPage(isRetry = false) {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    if (isRetry) {
      setRetryKind("next-page");
    }

    try {
      await fetchNextPage({ cancelRefetch: false });
    } finally {
      if (isRetry) {
        setRetryKind(null);
      }
    }
  }

  const errorTitle = isSearchMode
    ? "We could not load the search results"
    : "We could not load the catalog";
  const retryAction = (kind: "error" | "empty") => (
    <CatalogActionButton
      onClick={() => void retryCatalog(kind)}
      disabled={retryKind === kind}
      ariaLabel={
        retryKind === kind
          ? "Retrying movie results"
          : "Retry loading movie results"
      }
    >
      {retryKind === kind ? "Trying again…" : "Try again"}
    </CatalogActionButton>
  );

  if (retryKind === "error") {
    return (
      <ErrorState
        title={errorTitle}
        description="Movie results are temporarily unavailable. Please try again."
        action={retryAction("error")}
      />
    );
  }

  if (isPending) {
    return <CatalogGridSkeleton />;
  }

  if (isError && !data) {
    return (
      <ErrorState
        title={errorTitle}
        description="Movie results are temporarily unavailable. Please try again."
        action={retryAction("error")}
      />
    );
  }

  if (movies.length === 0) {
    return isSearchMode ? (
      <EmptyState
        title="No movies found"
        description={`Try another title or clear the search for “${catalogState.query}”.`}
        action={
          <CatalogActionButton
            onClick={onClearSearch}
            ariaLabel="Clear movie search"
          >
            Clear search
          </CatalogActionButton>
        }
      />
    ) : (
      <EmptyState
        title={`No ${getCategoryLabel(catalogState.category)} movies available`}
        description="There are no movies to show right now. Refresh the catalog to check again."
        action={retryAction("empty")}
      />
    );
  }

  const isRetryingNextPage = retryKind === "next-page";

  return (
    <>
      <MovieGrid>
        {movies.map((movie, index) => (
          <li key={movie.id} className="min-w-0">
            <MovieCard
              movie={movie}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </li>
        ))}
      </MovieGrid>

      {isFetchNextPageError || isRetryingNextPage ? (
        <div
          role="alert"
          className="mt-10 rounded-lg border border-destructive/60 bg-surface px-5 py-6 text-center"
        >
          <p className="font-semibold text-foreground">
            We could not load more movies.
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your loaded movies are still here. Try loading the next page again.
          </p>
          <div className="mt-5">
            <CatalogActionButton
              onClick={() => void loadNextPage(true)}
              disabled={isRetryingNextPage}
              ariaLabel={
                isRetryingNextPage
                  ? "Retrying the next page of movies"
                  : "Retry loading the next page of movies"
              }
            >
              {isRetryingNextPage ? "Trying again…" : "Try loading more again"}
            </CatalogActionButton>
          </div>
        </div>
      ) : hasNextPage ? (
        <div className="mt-10 flex flex-col items-center gap-3">
          <CatalogActionButton
            onClick={() => void loadNextPage()}
            disabled={isFetchingNextPage}
            ariaLabel={
              isFetchingNextPage
                ? "Loading the next page of movies"
                : "Load more movies"
            }
          >
            {isFetchingNextPage ? "Loading more…" : "Load more"}
          </CatalogActionButton>
          <p role="status" aria-live="polite" className="sr-only">
            {isFetchingNextPage ? "Loading more movies" : ""}
          </p>
        </div>
      ) : null}
    </>
  );
}

function collectUniqueMovies(data?: InfiniteData<MoviePage, number>) {
  const moviesById = new Map<number, MovieSummary>();

  for (const page of data?.pages ?? []) {
    for (const movie of page.results) {
      if (!moviesById.has(movie.id)) {
        moviesById.set(movie.id, movie);
      }
    }
  }

  return [...moviesById.values()];
}

type CatalogActionButtonProps = {
  ariaLabel: string;
  children: string;
  disabled?: boolean;
  onClick: () => void;
};

function CatalogActionButton({
  ariaLabel,
  children,
  disabled = false,
  onClick,
}: CatalogActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function CatalogGridSkeleton() {
  return (
    <div aria-label="Loading movie results">
      <span className="sr-only">Loading movie results</span>
      <MovieGrid>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </MovieGrid>
    </div>
  );
}

export function MovieCatalogLoading() {
  return (
    <section
      className="mt-10"
      aria-busy="true"
      aria-labelledby="catalog-heading"
      aria-describedby="catalog-loading-status"
    >
      <CatalogHeading status="Loading movies…" />
      <span id="catalog-loading-status" className="sr-only">
        Loading movies
      </span>
      <CatalogGridSkeleton />
    </section>
  );
}
