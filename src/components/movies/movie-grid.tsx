import type { ReactNode } from "react";

export type MovieGridProps = {
  children: ReactNode;
};

export function MovieGrid({ children }: MovieGridProps) {
  return (
    <ul className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 xl:grid-cols-5">
      {children}
    </ul>
  );
}
