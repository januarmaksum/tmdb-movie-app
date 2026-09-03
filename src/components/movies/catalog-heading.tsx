export type CatalogHeadingProps = {
  eyebrow?: string;
  heading?: string;
  resultCount?: number;
  status?: string;
};

export function CatalogHeading({
  eyebrow = "Popular",
  heading = "Movies to explore",
  resultCount,
  status,
}: CatalogHeadingProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-primary">{eyebrow}</p>
        <h2
          id="catalog-heading"
          className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-foreground wrap-anywhere sm:text-3xl"
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
