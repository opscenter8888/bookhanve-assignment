import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { APP_COPY } from "@/constants/copy";
import { ROUTES } from "@/constants/routes";
import { CartBadge } from "@/features/cart/CartBadge";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link className="text-lg font-bold text-ink" href={ROUTES.home}>
          {APP_COPY.name}
        </Link>
        <nav aria-label="Primary navigation">
          <Link
            className="inline-flex min-h-11 items-center rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            href={ROUTES.cart}
          >
            <span>{APP_COPY.cartLink}</span>
            <CartBadge />
          </Link>
        </nav>
      </Container>
    </header>
  );
}
