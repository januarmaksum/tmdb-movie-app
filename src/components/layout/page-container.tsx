import type { HTMLAttributes } from "react";

export type PageContainerProps = HTMLAttributes<HTMLDivElement>;

export function PageContainer({ className = "", ...props }: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-7xl px-(--page-gutter) ${className}`}
      {...props}
    />
  );
}
