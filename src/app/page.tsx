import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import { MovieCatalogPreview } from "@/components/movies/movie-catalog-preview";
import { MovieGrid } from "@/components/movies/movie-grid";
import { SkeletonCard } from "@/components/movies/skeleton-card";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1 py-10 sm:py-14 lg:py-16">
        <PageContainer>
          <header className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
              Cinematic discovery
            </p>
            <h1 className="mt-3 text-4xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              Find a movie worth watching.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Explore current releases and timeless favorites through a focused,
              poster-first catalog.
            </p>
          </header>

          <Suspense fallback={<CatalogPreviewFallback />}>
            <MovieCatalogPreview />
          </Suspense>
        </PageContainer>
      </main>
    </div>
  );
}

function CatalogPreviewFallback() {
  return (
    <section className="mt-10" aria-busy="true" aria-label="Loading movie catalog">
      <span className="sr-only">Loading movies</span>
      <MovieGrid>
        {Array.from({ length: 10 }, (_, index) => (
          <SkeletonCard key={index} />
        ))}
      </MovieGrid>
    </section>
  );
}
