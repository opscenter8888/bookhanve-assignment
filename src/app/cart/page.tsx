import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { APP_COPY } from "@/constants/copy";
import { ROUTES } from "@/constants/routes";
import { CartView } from "@/features/cart/CartView";

export default function CartPage() {
  return (
    <main>
      <Container className="py-10 sm:py-14">
        <section className="mb-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-ink">
              {APP_COPY.cartTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
              {APP_COPY.cartIntro}
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            href={ROUTES.home}
          >
            {APP_COPY.homeLink}
          </Link>
        </section>
        <CartView />
      </Container>
    </main>
  );
}
