export type CatalogHeadingProps = {
  heading?: string;
  resultCount?: number;
  status?: string;
};

export function CatalogHeading({
  heading = "Popular",
  resultCount,
  status,
}: CatalogHeadingProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h2
          id="catalog-heading"
          className="text-3xl font-semibold text-primary"
        >
          {heading}
        </h2>
      </div>
      {status || resultCount !== undefined ? (
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-sm text-muted-foreground"
        >
          {status ?? `${resultCount} ${resultCount === 1 ? "movie" : "movies"}`}
        </p>
      ) : null}
    </div>
  );
}
