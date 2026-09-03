export type CatalogHeadingProps = {
  eyebrow?: string;
  heading?: string;
  resultCount?: number;
  status?: string;
};

export function CatalogHeading({
  eyebrow = "Popular",
  resultCount,
  status,
}: CatalogHeadingProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="text-3xl font-semibold text-primary">{eyebrow}</p>
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
