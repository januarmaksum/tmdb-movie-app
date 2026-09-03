import { CatalogLink } from "@/components/movies/catalog-link";
import { EmptyState } from "@/components/movies/catalog-feedback";

export default function MovieNotFound() {
  return (
    <EmptyState
      headingLevel="h1"
      title="Movie not found"
      description="This movie does not exist or is no longer available. Return to the catalog to keep exploring."
      action={<CatalogLink />}
    />
  );
}
