import type { InputHTMLAttributes } from "react";

export type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  onClear?: () => void;
};

export function SearchInput({
  id = "movie-search",
  className = "",
  onClear,
  value,
  ...props
}: SearchInputProps) {
  const hasValue = value !== undefined && String(value).length > 0;

  return (
    <div className="relative min-w-0 flex-1">
      <input
        {...props}
        id={id}
        type="search"
        value={value}
        className={`movie-search-input min-h-11 w-full min-w-0 rounded-full border border-border bg-surface px-4 text-base text-foreground transition-colors placeholder:text-muted-foreground hover:border-muted-foreground active:border-primary disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-12 ${hasValue && onClear ? "pr-14" : ""} ${className}`}
      />
      {hasValue && onClear ? (
        <button
          type="button"
          aria-label="Clear search"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onClear}
          className="absolute right-1 top-1/2 inline-flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground active:text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <path d="M0 0h32v32H0z" fill="none" />
            <path
              fill="currentColor"
              d="M17.414 16L26 7.414L24.586 6L16 14.586L7.414 6L6 7.414L14.586 16L6 24.586L7.414 26L16 17.414L24.586 26L26 24.586z"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
