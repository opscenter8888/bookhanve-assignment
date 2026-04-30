import Link from "next/link";
import { Suspense } from "react";
import { BookGridSkeleton } from "@/components/book/BookGridSkeleton";
import { Container } from "@/components/ui/Container";
import { APP_COPY } from "@/constants/copy";
import { ROUTES } from "@/constants/routes";
import { BookCatalog } from "@/features/books/BookCatalog";

export default function HomePage() {
  return (
    <main>
      <Container className="py-6 sm:py-8">
        <section className="mb-6 grid gap-4 border-b border-line pb-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand">
              {APP_COPY.name}
            </p>
            <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {APP_COPY.homepageTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              {APP_COPY.homepageIntro}
            </p>
          </div>
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            href={ROUTES.cart}
          >
            {APP_COPY.cartLink}
          </Link>
        </section>
        <Suspense fallback={<BookGridSkeleton />}>
          <BookCatalog />
        </Suspense>
      </Container>
    </main>
  );
}
