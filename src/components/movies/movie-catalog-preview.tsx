"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { movieFixtures } from "@/data/movie-fixtures";
import type { MovieCategory } from "@/types/movie";
import { EmptyState, ErrorState } from "./catalog-feedback";
import { CategoryFilter, getCategoryLabel } from "./category-filter";
import { MovieCard } from "./movie-card";
import { MovieGrid } from "./movie-grid";
import { SearchInput } from "./search-input";
import { SkeletonCard } from "./skeleton-card";

export type PreviewState = "loaded" | "loading" | "empty" | "error";

const previewStates = new Set<PreviewState>(["loaded", "loading", "empty", "error"]);

export function MovieCatalogPreview() {
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MovieCategory>("popular");
  const previewValue = searchParams.get("preview");
  const previewState: PreviewState =
    previewValue && previewStates.has(previewValue as PreviewState)
      ? (previewValue as PreviewState)
      : "loaded";

  return (
    <section className="mt-10" aria-labelledby="catalog-heading">
      <div className="rounded-lg border border-border bg-surface/60 p-4 sm:p-6">
        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <SearchInput
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by title"
            aria-describedby="fixture-note"
            disabled={previewState === "loading"}
          />
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            disabled={previewState === "loading"}
          />
        </div>
        <p id="fixture-note" className="mt-4 text-sm leading-6 text-muted-foreground">
          This foundation preview uses sample movies. Search and category data wiring arrive in
          the next phase.
        </p>
      </div>

      <div className="mt-10 mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary">{getCategoryLabel(selectedCategory)}</p>
          <h2
            id="catalog-heading"
            className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl"
          >
            Movies to explore
          </h2>
        </div>
        {previewState === "loaded" ? (
          <p className="text-sm text-muted-foreground">{movieFixtures.length} sample movies</p>
        ) : null}
      </div>

      <CatalogContent previewState={previewState} />
    </section>
  );
}

function CatalogContent({ previewState }: { previewState: PreviewState }) {
  if (previewState === "loading") {
    return (
      <div aria-busy="true" aria-label="Loading movie catalog">
        <span className="sr-only">Loading movies</span>
        <MovieGrid>
          {Array.from({ length: 10 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </MovieGrid>
      </div>
    );
  }

  if (previewState === "empty") {
    return (
      <EmptyState
        title="No movies found"
        description="Try a different title or return to the sample catalog."
        action={<StateLink href="/">Clear preview</StateLink>}
      />
    );
  }

  if (previewState === "error") {
    return (
      <ErrorState
        title="We could not load the catalog"
        description="The movie list is temporarily unavailable. Return to the sample catalog and try again."
        action={<StateLink href="/">Try again</StateLink>}
      />
    );
  }

  return (
    <MovieGrid>
      {movieFixtures.map((movie, index) => (
        <li key={movie.id} className="min-w-0">
          <MovieCard movie={movie} loading={index === 0 ? "eager" : "lazy"} />
        </li>
      ))}
    </MovieGrid>
  );
}

function StateLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80"
    >
      {children}
    </Link>
  );
}
