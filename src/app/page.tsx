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
      <Container className="py-10 sm:py-14">
        <section className="mb-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              {APP_COPY.name}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              {APP_COPY.homepageTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              {APP_COPY.homepageIntro}
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
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
