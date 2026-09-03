"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  normalizeMovieQuery,
  parseMovieCatalogUrlSearchParams,
  type MovieCatalogState,
} from "@/lib/movie-catalog-state";
import { movieListQueryOptions } from "@/lib/movie-list-query";
import type { MovieCategory, MoviePage } from "@/types/movie";
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
  const movieListRequest = {
    ...catalogState,
    page: 1,
  };
  const queryResult = useQuery(movieListQueryOptions(movieListRequest));
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
  const loadingStatus = queryResult.isFetching
    ? isSearchMode
      ? `Searching for “${catalogState.query}”…`
      : `Updating ${getCategoryLabel(catalogState.category)} movies…`
    : undefined;

  return (
    <section
      className="mt-10"
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
        resultCount={
          loadingStatus ? undefined : queryResult.data?.results.length
        }
        status={loadingStatus}
      />

      <CatalogContent
        key={`catalog-content:${catalogState.category}:${catalogState.query}`}
        catalogState={catalogState}
        isSearchMode={isSearchMode}
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
      <p
        id="search-helper-text"
        className="mt-4 text-sm leading-6 text-muted-foreground"
      >
        Results update after you pause typing. Press Enter to search immediately.
      </p>
    </div>
  );
}

type CatalogContentProps = {
  catalogState: MovieCatalogState;
  isSearchMode: boolean;
  queryResult: UseQueryResult<MoviePage, Error>;
  onClearSearch: () => void;
};

function CatalogContent({
  catalogState,
  isSearchMode,
  queryResult,
  onClearSearch,
}: CatalogContentProps) {
  const { data, isError, isPending, refetch } = queryResult;
  const [retryKind, setRetryKind] = useState<"error" | "empty" | null>(null);

  async function retryCatalog(kind: "error" | "empty") {
    setRetryKind(kind);

    try {
      await refetch();
    } finally {
      setRetryKind(null);
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

  if (isError) {
    return (
      <ErrorState
        title={errorTitle}
        description="Movie results are temporarily unavailable. Please try again."
        action={retryAction("error")}
      />
    );
  }

  if (data.results.length === 0) {
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

  return (
    <MovieGrid>
      {data.results.map((movie, index) => (
        <li key={movie.id} className="min-w-0">
          <MovieCard movie={movie} loading={index === 0 ? "eager" : "lazy"} />
        </li>
      ))}
    </MovieGrid>
  );
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
