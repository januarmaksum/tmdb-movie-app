import Link from "next/link";

export function CatalogLink() {
  return (
    <Link
      href="/"
      className="inline-flex min-h-11 items-center rounded-sm border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/70 hover:text-primary active:border-primary active:text-primary"
    >
      Back to catalog
    </Link>
  );
}
