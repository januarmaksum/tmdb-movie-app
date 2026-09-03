import type { InputHTMLAttributes } from "react";

export type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

export function SearchInput({
  id = "movie-search",
  label = "Search movies",
  className = "",
  ...props
}: SearchInputProps) {
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        {...props}
        id={id}
        type="search"
        className={`min-h-12 w-full min-w-0 rounded-md border border-border bg-surface px-4 text-base text-foreground transition-colors placeholder:text-muted-foreground hover:border-muted-foreground active:border-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      />
    </div>
  );
}
