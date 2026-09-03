import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";

export default function MovieDetailLayout({ children }: LayoutProps<"/movies/[id]">) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1 py-8 sm:py-10 lg:py-12">
        <PageContainer>{children}</PageContainer>
      </main>
    </div>
  );
}
