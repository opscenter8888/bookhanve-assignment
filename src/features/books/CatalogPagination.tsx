import Link from "next/link";
import { APP_COPY } from "@/constants/copy";
import type { CatalogViewModel } from "@/features/books/catalog";

type CatalogPaginationProps = Pick<
  CatalogViewModel,
  "currentPage" | "totalPages" | "hasPreviousPage" | "hasNextPage" | "query" | "sort"
>;

function buildPageHref({
  page,
  query,
  sort
}: {
  page: number;
  query: string;
  sort: string;
}): string {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (sort !== "newest") {
    params.set("sort", sort);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();
  return queryString ? `/?${queryString}` : "/";
}

export function CatalogPagination({
  currentPage,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  query,
  sort
}: CatalogPaginationProps) {
  const previousHref = buildPageHref({
    page: currentPage - 1,
    query,
    sort
  });
  const nextHref = buildPageHref({
    page: currentPage + 1,
    query,
    sort
  });

  return (
    <nav
      aria-label={APP_COPY.catalogPaginationLabel}
      className="mt-8 flex flex-col items-center justify-between gap-4 rounded-lg border border-line bg-white p-4 sm:flex-row"
    >
      {hasPreviousPage ? (
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          href={previousHref}
        >
          {APP_COPY.previousPage}
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-400"
        >
          {APP_COPY.previousPage}
        </span>
      )}
      <p className="text-sm font-semibold text-muted">
        {APP_COPY.pageStatus} {currentPage} {APP_COPY.ofLabel} {totalPages}
      </p>
      {hasNextPage ? (
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          href={nextHref}
        >
          {APP_COPY.nextPage}
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-400"
        >
          {APP_COPY.nextPage}
        </span>
      )}
    </nav>
  );
}
