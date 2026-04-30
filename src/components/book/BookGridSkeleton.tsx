import { CATALOG_PAGE_SIZE } from "@/constants/catalog";
import { APP_COPY } from "@/constants/copy";

export function BookGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status">
      {Array.from({ length: CATALOG_PAGE_SIZE }).map((_, index) => (
        <div
          className="overflow-hidden rounded-lg border border-line bg-white shadow-soft"
          key={index}
        >
          <div className="aspect-[4/3] animate-pulse bg-slate-100" />
          <div className="space-y-4 p-5">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
            </div>
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 animate-pulse rounded bg-slate-100" />
              <div className="h-11 w-28 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">{APP_COPY.loadingBooks}</span>
    </div>
  );
}
