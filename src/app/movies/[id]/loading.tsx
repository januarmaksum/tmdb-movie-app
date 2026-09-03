import { CatalogLink } from "@/components/movies/catalog-link";

export default function MovieDetailLoading() {
  return (
    <section aria-busy="true" aria-label="Loading movie details">
      <CatalogLink />
      <div className="mt-8 grid animate-pulse items-start gap-8 md:grid-cols-[minmax(14rem,20rem)_minmax(0,1fr)] md:gap-10 lg:gap-14">
        <div className="mx-auto aspect-2/3 w-full max-w-80 rounded-lg border border-border bg-surface md:mx-0" />
        <div className="min-w-0 pt-2">
          <div className="h-4 w-32 rounded-sm bg-muted" />
          <div className="mt-5 h-12 w-full max-w-xl rounded-md bg-muted" />
          <div className="mt-3 h-12 w-4/5 max-w-lg rounded-md bg-muted" />
          <div className="mt-6 flex gap-2">
            <div className="h-8 w-20 rounded-full bg-muted" />
            <div className="h-8 w-24 rounded-full bg-muted" />
          </div>
          <div className="mt-9 h-6 w-28 rounded-sm bg-muted" />
          <div className="mt-4 h-4 w-full max-w-2xl rounded-sm bg-muted" />
          <div className="mt-3 h-4 w-11/12 max-w-xl rounded-sm bg-muted" />
          <div className="mt-3 h-4 w-3/4 max-w-lg rounded-sm bg-muted" />
        </div>
      </div>
      <p className="sr-only" role="status">
        Loading movie details
      </p>
    </section>
  );
}
