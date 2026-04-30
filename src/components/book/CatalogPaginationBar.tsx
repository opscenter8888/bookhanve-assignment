"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { APP_COPY } from "@/constants/copy";

type CatalogPaginationBarProps = {
  currentPage: number;
  endItem: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startItem: number;
  totalItems: number;
  totalPages: number;
  nextHref?: string;
  previousHref?: string;
  onNext?: () => void;
  onPrevious?: () => void;
};

function pageButtonClasses(isDisabled: boolean): string {
  const disabledClasses = isDisabled
    ? "border-line bg-slate-50 text-slate-400"
    : "border-line bg-white text-ink hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-brand";

  return `inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${disabledClasses}`;
}

export function CatalogPaginationBar({
  currentPage,
  endItem,
  hasNextPage,
  hasPreviousPage,
  startItem,
  totalItems,
  totalPages,
  nextHref,
  previousHref,
  onNext,
  onPrevious
}: CatalogPaginationBarProps) {
  const summary = `${APP_COPY.adminShowingLabel} ${startItem}-${endItem} ${APP_COPY.ofLabel} ${totalItems}`;

  return (
    <nav
      aria-label={APP_COPY.catalogPaginationLabel}
      className="flex flex-col gap-3 border-t border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <p className="text-sm font-semibold text-muted">{summary}</p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex">
        {hasPreviousPage && previousHref ? (
          <Link className={pageButtonClasses(false)} href={previousHref}>
            {APP_COPY.previousPage}
          </Link>
        ) : (
          <Button
            className="min-h-10"
            disabled={!hasPreviousPage}
            onClick={onPrevious}
            variant="secondary"
          >
            {APP_COPY.previousPage}
          </Button>
        )}
        <span className="text-center text-sm font-semibold text-muted">
          {currentPage}/{totalPages}
        </span>
        {hasNextPage && nextHref ? (
          <Link className={pageButtonClasses(false)} href={nextHref}>
            {APP_COPY.nextPage}
          </Link>
        ) : (
          <Button
            className="min-h-10"
            disabled={!hasNextPage}
            onClick={onNext}
            variant="secondary"
          >
            {APP_COPY.nextPage}
          </Button>
        )}
      </div>
    </nav>
  );
}
