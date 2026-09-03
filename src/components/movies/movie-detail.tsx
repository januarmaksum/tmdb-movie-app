"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { movieDetailQueryOptions } from "@/lib/movie-detail-query";
import type { CastMember, MovieDetails } from "@/types/movie";
import { CatalogLink } from "./catalog-link";

const POSTER_FALLBACK_URL = "/poster-placeholder.svg";

export type MovieDetailProps = {
  movieId: number;
};

export function MovieDetail({ movieId }: MovieDetailProps) {
  const { data: movie } = useSuspenseQuery(movieDetailQueryOptions(movieId));

  return (
    <article className="pb-6 sm:pb-10">
      <section className="relative left-1/2 -mt-8 w-screen -translate-x-1/2 overflow-hidden sm:-mt-10 lg:-mt-12">
        {movie.backdropUrl ? (
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src={movie.backdropUrl}
              alt=""
              fill
              sizes="100vw"
              className="scale-105 object-cover blur-sm"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/70 to-background" />
          </div>
        ) : null}

        <div className="relative z-10 mx-auto w-full max-w-7xl px-(--page-gutter) pt-8 pb-12 sm:pt-10 sm:pb-14 lg:pt-12">
          <CatalogLink />

          <div className="mt-8 grid items-start gap-8 sm:mt-10 md:grid-cols-[minmax(14rem,20rem)_minmax(0,1fr)] md:gap-10 lg:gap-14">
            <MoviePoster movie={movie} />

            <div className="min-w-0">
              <h1 className="text-4xl leading-tight font-semibold tracking-[-0.04em] text-balance wrap-anywhere sm:text-5xl lg:text-6xl">
                {movie.title}
              </h1>

              {movie.tagline ? (
                <p className="mt-4 max-w-2xl text-lg leading-7 text-foreground/80 italic">
                  “{movie.tagline}”
                </p>
              ) : null}

              <MovieFacts movie={movie} />

              <section className="mt-8" aria-labelledby="synopsis-heading">
                <h2
                  id="synopsis-heading"
                  className="text-xl font-semibold tracking-[-0.02em] text-foreground"
                >
                  Synopsis
                </h2>
                <p className="mt-3 max-w-3xl text-base leading-7 text-foreground/80 sm:text-lg sm:leading-8">
                  {movie.overview ?? "Synopsis unavailable."}
                </p>
              </section>

              <section className="mt-8" aria-labelledby="director-heading">
                <h2
                  id="director-heading"
                  className="text-xl font-semibold tracking-[-0.02em] text-foreground"
                >
                  Director
                </h2>
                <p className="mt-3 text-base leading-7 text-foreground/80">
                  {movie.directors.length > 0
                    ? movie.directors
                        .map((director) => director.name)
                        .join(", ")
                    : "Director unavailable."}
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <CastSection cast={movie.cast} />
    </article>
  );
}

function MoviePoster({ movie }: { movie: MovieDetails }) {
  const isFallback = movie.posterUrl === POSTER_FALLBACK_URL;

  return (
    <div className="mx-auto w-full max-w-80 md:mx-0">
      <div className="relative aspect-2/3 overflow-hidden rounded-lg border border-border bg-surface">
        <Image
          src={movie.posterUrl}
          alt={
            isFallback
              ? `Poster unavailable for ${movie.title}`
              : `${movie.title} movie poster`
          }
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 768px) 320px, calc(100vw - 2rem)"
          className="object-cover"
        />
      </div>
    </div>
  );
}

function MovieFacts({ movie }: { movie: MovieDetails }) {
  const facts = [
    movie.releaseYear?.toString() ?? "Year unavailable",
    formatRuntime(movie.runtime),
    ...movie.genres,
  ].filter((fact): fact is string => Boolean(fact));

  return (
    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Movie facts">
      {facts.map((fact, index) => (
        <li
          key={`${fact}:${index}`}
          className="rounded-full border border-border bg-background/70 px-3 py-1.5 text-sm leading-5 text-foreground/80 backdrop-blur-sm"
        >
          {fact}
        </li>
      ))}
    </ul>
  );
}

function CastSection({ cast }: { cast: CastMember[] }) {
  return (
    <section className="mt-12 sm:mt-14" aria-labelledby="cast-heading">
      <div className="border-t border-border pt-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-primary uppercase">
          Credits
        </p>
        <h2
          id="cast-heading"
          className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl"
        >
          Main cast
        </h2>
      </div>

      {cast.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {cast.map((member, index) => (
            <li
              key={`${member.id}:${index}`}
              className="min-w-0 overflow-hidden rounded-lg border border-border bg-surface"
            >
              <CastProfile member={member} />
              <div className="p-4">
                <h3 className="font-semibold leading-6 text-foreground wrap-anywhere">
                  {member.name || "Unknown cast member"}
                </h3>
                <p className="mt-1 text-sm leading-5 text-muted-foreground wrap-anywhere">
                  {member.character ?? "Character unavailable"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Cast information unavailable.
        </p>
      )}
    </section>
  );
}

function CastProfile({ member }: { member: CastMember }) {
  if (!member.profileUrl) {
    return (
      <div
        role="img"
        aria-label={`Profile image unavailable for ${member.name}`}
        className="flex aspect-2/3 items-center justify-center border-b border-border bg-surface-raised text-3xl font-semibold text-muted-foreground"
      >
        {getInitials(member.name)}
      </div>
    );
  }

  return (
    <div className="relative aspect-2/3 border-b border-border bg-surface-raised">
      <Image
        src={member.profileUrl}
        alt={`${member.name} profile`}
        fill
        sizes="(min-width: 1024px) 224px, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover"
      />
    </div>
  );
}

function formatRuntime(runtime: number | null) {
  if (!runtime) {
    return null;
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "?";
}
