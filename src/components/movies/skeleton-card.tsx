export function SkeletonCard() {
  return (
    <li aria-hidden="true">
      <div className="aspect-[2/3] animate-pulse rounded-lg border border-border bg-muted motion-reduce:animate-none" />
      <div className="mt-3 h-5 w-4/5 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
      <div className="mt-2 h-4 w-1/3 animate-pulse rounded-sm bg-muted motion-reduce:animate-none" />
    </li>
  );
}
