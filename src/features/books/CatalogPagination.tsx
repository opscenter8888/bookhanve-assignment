import { CatalogPaginationBar } from "@/components/book/CatalogPaginationBar";
import { CATALOG_PAGE_SIZE } from "@/constants/catalog";
import type { CatalogViewModel } from "@/features/books/catalog";

type CatalogPaginationProps = Pick<
  CatalogViewModel,
  | "currentPage"
  | "totalItems"
  | "totalPages"
  | "hasPreviousPage"
  | "hasNextPage"
  | "query"
  | "sort"
> & {
  visibleCount: number;
};

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
  totalItems,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  query,
  sort,
  visibleCount
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
  const startItem =
    totalItems === 0 || visibleCount === 0
      ? 0
      : (currentPage - 1) * CATALOG_PAGE_SIZE + 1;
  const endItem =
    totalItems === 0 || visibleCount === 0
      ? 0
      : Math.min(startItem + visibleCount - 1, totalItems);

  return (
    <div className="mt-8 overflow-hidden rounded-md border border-line bg-white">
      <CatalogPaginationBar
        currentPage={currentPage}
        endItem={endItem}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        nextHref={nextHref}
        previousHref={previousHref}
        startItem={startItem}
        totalItems={totalItems}
        totalPages={totalPages}
      />
    </div>
  );
}
