import type { ReactNode } from "react";

export type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  headingLevel?: "h1" | "h2";
};

export function EmptyState({
  title,
  description,
  action,
  headingLevel = "h2",
}: EmptyStateProps) {
  const Heading = headingLevel;

  return (
    <section className="rounded-lg border border-border bg-surface px-5 py-12 text-center sm:px-8">
      <Heading className="text-xl font-semibold tracking-[-0.02em] text-foreground">
        {title}
      </Heading>
      <p className="mx-auto mt-2 max-w-md text-base leading-7 text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </section>
  );
}

export type ErrorStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  headingLevel?: "h1" | "h2";
};

export function ErrorState({
  title,
  description,
  action,
  headingLevel = "h2",
}: ErrorStateProps) {
  const Heading = headingLevel;

  return (
    <section
      role="alert"
      className="rounded-lg border border-destructive/60 bg-surface px-5 py-12 text-center sm:px-8"
    >
      <p className="text-sm font-semibold tracking-[0.14em] text-destructive uppercase">
        Something went wrong
      </p>
      <Heading className="mt-3 text-xl font-semibold tracking-[-0.02em] text-foreground">
        {title}
      </Heading>
      <p className="mx-auto mt-2 max-w-md text-base leading-7 text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </section>
  );
}
