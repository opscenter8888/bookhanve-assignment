"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookGrid } from "@/components/book/BookGrid";
import { BookGridSkeleton } from "@/components/book/BookGridSkeleton";
import { ErrorState } from "@/components/ui/ErrorState";
import { APP_COPY } from "@/constants/copy";
import { CatalogControls } from "@/features/books/CatalogControls";
import { CatalogPagination } from "@/features/books/CatalogPagination";
import {
  parseSort,
  type CatalogApiResponse,
  type CatalogViewModel
} from "@/features/books/catalog";
import { useCartStore } from "@/features/cart/cart-store";

type CatalogState = {
  hasError: boolean;
  queryString: string;
  viewModel: CatalogViewModel | null;
};

export function BookCatalog() {
  const addItem = useCartStore((state) => state.addItem);
  const searchParams = useSearchParams();
  const [catalogState, setCatalogState] = useState<CatalogState>({
    hasError: false,
    queryString: "",
    viewModel: null
  });
  const queryString = searchParams.toString();

  useEffect(() => {
    const controller = new AbortController();
    const requestUrl = queryString ? `/api/books?${queryString}` : "/api/books";

    async function loadCatalog() {
      try {
        const response = await fetch(requestUrl, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(APP_COPY.booksErrorMessage);
        }

        const data = (await response.json()) as CatalogApiResponse;
        setCatalogState({
          hasError: false,
          queryString,
          viewModel: data.catalog
        });
      } catch {
        if (!controller.signal.aborted) {
          setCatalogState({
            hasError: true,
            queryString,
            viewModel: null
          });
        }
      }
    }

    void loadCatalog();

    return () => controller.abort();
  }, [queryString]);

  const isCurrentRequest = catalogState.queryString === queryString;
  const viewModel = isCurrentRequest ? catalogState.viewModel : null;

  if (isCurrentRequest && catalogState.hasError) {
    return <ErrorState />;
  }

  if (!viewModel) {
    return (
      <div>
        <CatalogControls
          key={queryString}
          query={searchParams.get("q") ?? ""}
          sort={parseSort(searchParams.get("sort") ?? undefined)}
          totalItems={0}
        />
        <BookGridSkeleton />
      </div>
    );
  }

  const hasActiveQuery = viewModel.query.length > 0;

  return (
    <div>
      <CatalogControls
        key={queryString}
        query={viewModel.query}
        sort={viewModel.sort}
        totalItems={viewModel.totalItems}
      />
      <BookGrid
        books={viewModel.books}
        emptyTitle={
          hasActiveQuery ? APP_COPY.noMatchingBooksTitle : APP_COPY.emptyBooksTitle
        }
        emptyMessage={
          hasActiveQuery
            ? APP_COPY.noMatchingBooksMessage
            : APP_COPY.emptyBooksMessage
        }
        onAddToCart={addItem}
      />
      <CatalogPagination
        currentPage={viewModel.currentPage}
        hasNextPage={viewModel.hasNextPage}
        hasPreviousPage={viewModel.hasPreviousPage}
        query={viewModel.query}
        sort={viewModel.sort}
        totalPages={viewModel.totalPages}
      />
    </div>
  );
}
