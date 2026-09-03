import Link from "next/link";
import { PageContainer } from "./page-container";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <PageContainer className="flex min-h-16 items-center py-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-sm text-base font-semibold tracking-[-0.02em] text-foreground transition-colors hover:text-primary active:text-primary"
        >
          Movie Explorer
        </Link>
      </PageContainer>
    </header>
  );
}
