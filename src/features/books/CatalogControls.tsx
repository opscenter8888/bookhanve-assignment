"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { CatalogToolbar } from "@/components/book/CatalogToolbar";
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

  function handleClearFilters() {
    setSearchValue("");

    startTransition(() => {
      router.push(pathname);
    });
  }

  return (
    <section
      aria-label={APP_COPY.catalogControlsLabel}
      className="mb-6 overflow-hidden rounded-md border border-line bg-white shadow-soft"
    >
      <CatalogToolbar
        heading={APP_COPY.adminBookListTitle}
        hasActiveQuery={Boolean(query) || sort !== "newest"}
        onClearSearch={handleClearFilters}
        onSearchChange={setSearchValue}
        onSearchSubmit={() => updateParam("q", searchValue.trim())}
        onSortChange={(value) => updateParam("sort", value)}
        searchValue={searchValue}
        sortValue={sort}
        summary={`${totalItems} ${APP_COPY.resultsLabel}`}
      />
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-muted">
        {isPending ? APP_COPY.loadingBooks : ""}
      </p>
    </section>
  );
}
