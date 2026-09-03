export type CatalogHeadingProps = {
  resultCount?: number;
};

export function CatalogHeading({ resultCount }: CatalogHeadingProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-primary">Popular</p>
        <h2
          id="catalog-heading"
          className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl"
        >
          Movies to explore
        </h2>
      </div>
      {resultCount !== undefined ? (
        <p className="text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? "movie" : "movies"}
        </p>
      ) : null}
    </div>
  );
}
