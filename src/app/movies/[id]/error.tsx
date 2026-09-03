"use client";

import { useTransition } from "react";
import { CatalogLink } from "@/components/movies/catalog-link";
import { ErrorState } from "@/components/movies/catalog-feedback";

export default function MovieDetailError({ retry }: { retry: () => void }) {
  const [isRetrying, startTransition] = useTransition();

  return (
    <ErrorState
      headingLevel="h1"
      title="We could not load this movie"
      description="The movie service may be temporarily unavailable. Try again or return to the catalog."
      action={
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <button
            type="button"
            disabled={isRetrying}
            onClick={() => startTransition(retry)}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-sm bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRetrying ? "Trying again…" : "Try again"}
          </button>
          <CatalogLink />
        </div>
      }
    />
  );
}
