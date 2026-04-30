"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { SORT_OPTIONS } from "@/constants/catalog";
import { APP_COPY } from "@/constants/copy";
import type { SortKey } from "@/features/books/catalog";

type CatalogControlsProps = {
  query: string;
  sort: SortKey;
  totalItems: number;
};

export function CatalogControls({ query, sort, totalItems }: CatalogControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(query);
  const [isPending, startTransition] = useTransition();

  function pushParams(params: URLSearchParams) {
    const queryString = params.toString();

    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    });
  }

  function updateParam(name: "q" | "sort", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    params.set("page", "1");

    if (params.get("sort") === "newest") {
      params.delete("sort");
    }

    pushParams(params);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParam("q", searchValue.trim());
  }

  function handleClearFilters() {
    setSearchValue("");

    startTransition(() => {
      router.push(pathname);
    });
  }

  return (
    <section
      aria-label={APP_COPY.catalogControlsLabel}
      className="mb-6 rounded-lg border border-line bg-white p-4 shadow-soft"
    >
      <div className="grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
        <form className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end" onSubmit={handleSearchSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-ink">{APP_COPY.searchLabel}</span>
            <input
              className="mt-2 min-h-11 w-full rounded-md border border-line px-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-blue-100"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={APP_COPY.searchPlaceholder}
              type="search"
              value={searchValue}
            />
          </label>
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            type="submit"
          >
            {APP_COPY.searchAction}
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            onClick={handleClearFilters}
            type="button"
          >
            {APP_COPY.clearFiltersAction}
          </button>
        </form>
        <label className="block">
          <span className="text-sm font-semibold text-ink">{APP_COPY.sortLabel}</span>
          <select
            className="mt-2 min-h-11 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
            onChange={(event) => updateParam("sort", event.target.value)}
            value={sort}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="rounded-md bg-slate-50 px-3 py-2 text-sm font-semibold text-muted">
          {totalItems} {APP_COPY.resultsLabel}
        </p>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted">
        {isPending ? APP_COPY.loadingBooks : ""}
      </p>
    </section>
  );
}
