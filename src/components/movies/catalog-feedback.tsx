import type { ReactNode } from "react";

export type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <section className="rounded-lg border border-border bg-surface px-5 py-12 text-center sm:px-8">
      <h2 className="text-xl font-semibold tracking-[-0.02em] text-foreground">{title}</h2>
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
};

export function ErrorState({ title, description, action }: ErrorStateProps) {
  return (
    <section
      role="alert"
      className="rounded-lg border border-destructive/60 bg-surface px-5 py-12 text-center sm:px-8"
    >
      <p className="text-sm font-semibold tracking-[0.14em] text-destructive uppercase">
        Something went wrong
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-base leading-7 text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </section>
  );
}
