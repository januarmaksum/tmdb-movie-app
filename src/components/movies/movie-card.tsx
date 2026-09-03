import Image from "next/image";
import type { MovieSummary } from "@/types/movie";

const POSTER_FALLBACK_URL = "/poster-placeholder.svg";

export type MovieCardProps = {
  movie: MovieSummary;
  loading?: "eager" | "lazy";
};

export function MovieCard({ movie, loading = "lazy" }: MovieCardProps) {
  const posterAlt =
    movie.posterUrl === POSTER_FALLBACK_URL
      ? `Poster unavailable for ${movie.title}`
      : `${movie.title} movie poster`;

  return (
    <article className="min-w-0">
      <div className="relative aspect-2/3 overflow-hidden rounded-lg border border-border bg-surface">
        <Image
          src={movie.posterUrl}
          alt={posterAlt}
          fill
          loading={loading}
          sizes="(min-width: 1280px) 236px, (min-width: 1024px) calc((100vw - 8rem) / 4), (min-width: 768px) calc((100vw - 6rem) / 3), calc((100vw - 3rem) / 2)"
          className="object-cover"
        />
      </div>
      <div className="pt-3">
        <h3 className="min-w-0 text-base leading-6 font-semibold text-foreground wrap-anywhere">
          {movie.title}
        </h3>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {movie.releaseYear ?? "Year unavailable"}
        </p>
      </div>
    </article>
  );
}
