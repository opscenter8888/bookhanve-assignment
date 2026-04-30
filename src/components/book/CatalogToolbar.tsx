"use client";

import { Button } from "@/components/ui/Button";
import { SORT_OPTIONS } from "@/constants/catalog";
import { APP_COPY } from "@/constants/copy";

type CatalogToolbarProps = {
  heading: string;
  searchPlaceholder?: string;
  searchValue: string;
  sortValue: string;
  summary: string;
  hasActiveQuery?: boolean;
  onClearSearch: () => void;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSortChange: (value: string) => void;
};

export function CatalogToolbar({
  heading,
  searchPlaceholder = APP_COPY.searchPlaceholder,
  searchValue,
  sortValue,
  summary,
  hasActiveQuery = false,
  onClearSearch,
  onSearchChange,
  onSearchSubmit,
  onSortChange
}: CatalogToolbarProps) {
  return (
    <div className="border-b border-line p-4 sm:p-5">
      <div className="grid gap-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">{heading}</h2>
            <p className="mt-1 text-sm text-muted">{summary}</p>
          </div>
        </div>
        <form
          className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit();
          }}
        >
          <label className="sr-only" htmlFor="catalog-search">
            {APP_COPY.searchLabel}
          </label>
          <input
            className="min-h-10 min-w-0 rounded-md border border-line px-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-blue-100"
            id="catalog-search"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            type="search"
            value={searchValue}
          />
          <Button className="min-h-10" type="submit">
            {APP_COPY.searchAction}
          </Button>
          {hasActiveQuery ? (
            <Button
              className="min-h-10"
              onClick={onClearSearch}
              type="button"
              variant="secondary"
            >
              {APP_COPY.clearFiltersAction}
            </Button>
          ) : null}
        </form>
        <label className="grid max-w-sm gap-1 text-sm font-semibold text-ink">
          {APP_COPY.sortLabel}
          <select
            className="min-h-10 rounded-md border border-line bg-white px-3 text-sm font-normal text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
            onChange={(event) => onSortChange(event.target.value)}
            value={sortValue}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
