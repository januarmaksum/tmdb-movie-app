import { MOVIE_CATEGORIES, type MovieCategory } from "@/types/movie";

const categoryLabels: Record<MovieCategory, string> = {
  now_playing: "Now Playing",
  popular: "Popular",
  top_rated: "Top Rated",
  upcoming: "Upcoming",
};

export type CategoryFilterProps = {
  selectedCategory: MovieCategory;
  onCategoryChange?: (category: MovieCategory) => void;
  disabled?: boolean;
};

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  disabled = false,
}: CategoryFilterProps) {
  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-foreground">Category</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Movie categories">
        {MOVIE_CATEGORIES.map((category) => {
          const isSelected = category === selectedCategory;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isSelected}
              disabled={disabled}
              onClick={() => onCategoryChange?.(category)}
              className={`min-h-11 cursor-pointer rounded-md border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80"
                  : "border-border bg-surface text-muted-foreground hover:border-muted-foreground hover:text-foreground active:bg-surface-raised"
              }`}
            >
              {categoryLabels[category]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function getCategoryLabel(category: MovieCategory) {
  return categoryLabels[category];
}
