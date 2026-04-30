"use client";

import { BookGrid } from "@/components/book/BookGrid";
import { APP_COPY } from "@/constants/copy";
import { CatalogControls } from "@/features/books/CatalogControls";
import { CatalogPagination } from "@/features/books/CatalogPagination";
import type { CatalogViewModel } from "@/features/books/catalog";
import { useCartStore } from "@/features/cart/cart-store";

type BookCatalogProps = {
  viewModel: CatalogViewModel;
};

export function BookCatalog({ viewModel }: BookCatalogProps) {
  const addItem = useCartStore((state) => state.addItem);
  const hasActiveQuery = viewModel.query.length > 0;

  return (
    <div>
      <CatalogControls
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
