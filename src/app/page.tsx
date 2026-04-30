import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { APP_COPY } from "@/constants/copy";
import { ROUTES } from "@/constants/routes";
import { BookCatalog } from "@/features/books/BookCatalog";
import type { CatalogParams } from "@/features/books/catalog";
import { getCatalog } from "@/features/books/data";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams?: Promise<CatalogParams>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = (await searchParams) ?? {};
  const viewModel = await getCatalog(params);

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
        {viewModel.totalItems > 0 || viewModel.query ? (
          <BookCatalog viewModel={viewModel} />
        ) : (
          <ErrorState title={APP_COPY.emptyBooksTitle} message={APP_COPY.emptyBooksMessage} />
        )}
      </Container>
    </main>
  );
}
