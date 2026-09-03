import { MOVIE_CATEGORIES, type MovieCategory } from "@/types/movie";

const categoryLabels: Record<MovieCategory, string> = {
  now_playing: "Now Playing",
  popular: "Popular",
  top_rated: "Top Rated",
  upcoming: "Upcoming",
};

export type CategoryFilterProps = {
  selectedCategory: MovieCategory | null;
  onCategoryChange?: (category: MovieCategory) => void;
  disabled?: boolean;
};

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  disabled = false,
}: CategoryFilterProps) {
  return (
    <div className="shrink-0">
      <label htmlFor="mobile-movie-category" className="sr-only">
        Movie category
      </label>
      <div className="relative sm:hidden">
        <select
          id="mobile-movie-category"
          value={selectedCategory ?? ""}
          disabled={disabled}
          onChange={(event) =>
            onCategoryChange?.(event.target.value as MovieCategory)
          }
          className="min-h-11 w-31 cursor-pointer appearance-none rounded-full border border-border bg-surface py-2 pr-9 pl-3 text-xs font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled>
            Category
          </option>
          {MOVIE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {categoryLabels[category]}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        >
          <path
            d="m5 7.5 5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.75"
          />
        </svg>
      </div>

      <div
        className="hidden flex-wrap gap-2 sm:flex"
        role="group"
        aria-label="Movie categories"
      >
        {MOVIE_CATEGORIES.map((category) => {
          const isSelected = category === selectedCategory;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isSelected}
              disabled={disabled}
              onClick={() => onCategoryChange?.(category)}
              className={`min-h-11 cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
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
