import Link from "next/link";
import { APP_COPY } from "@/constants/copy";
import { ROUTES } from "@/constants/routes";

export function EmptyCart() {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-line bg-white p-6 text-center shadow-soft sm:p-10">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-brand">
        0
      </div>
      <h2 className="text-2xl font-semibold text-ink">{APP_COPY.emptyCartTitle}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
        {APP_COPY.emptyCartMessage}
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        href={ROUTES.home}
      >
        {APP_COPY.homeLink}
      </Link>
    </div>
  );
}
