"use client";

import { Button } from "@/components/ui/Button";
import { APP_COPY } from "@/constants/copy";
import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/types/cart";

type CartItemRowProps = {
  item: CartItem;
  onDecrement: (bookId: string) => void;
  onIncrement: (bookId: string) => void;
  onRemove: (bookId: string) => void;
};

export function CartItemRow({
  item,
  onDecrement,
  onIncrement,
  onRemove
}: CartItemRowProps) {
  const itemTotal = item.book.priceCents * item.quantity;

  return (
    <article className="grid gap-4 border-b border-line py-5 opacity-100 transition duration-200 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {APP_COPY.skuLabel}: {item.book.sku}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-ink">{item.book.title}</h2>
        <p className="mt-1 text-sm text-muted">{item.book.author}</p>
        <dl className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
          <div>
            <dt className="font-medium text-ink">{APP_COPY.quantityLabel}</dt>
            <dd className="mt-1 inline-flex items-center overflow-hidden rounded-md border border-line bg-white">
              <Button
                aria-label={`${APP_COPY.decreaseQuantity}: ${item.book.title}`}
                className="min-h-9 rounded-none border-r border-line px-3 py-1"
                onClick={() => onDecrement(item.book.id)}
                variant="ghost"
              >
                -
              </Button>
              <span className="min-w-10 px-3 text-center font-semibold text-ink">
                {item.quantity}
              </span>
              <Button
                aria-label={`${APP_COPY.increaseQuantity}: ${item.book.title}`}
                className="min-h-9 rounded-none border-l border-line px-3 py-1"
                onClick={() => onIncrement(item.book.id)}
                variant="ghost"
              >
                +
              </Button>
            </dd>
          </div>
          <div>
            <dt className="font-medium text-ink">{APP_COPY.priceLabel}</dt>
            <dd>{formatCurrency(item.book.priceCents)}</dd>
          </div>
          <div>
            <dt className="font-medium text-ink">{APP_COPY.itemTotalLabel}</dt>
            <dd>{formatCurrency(itemTotal)}</dd>
          </div>
        </dl>
      </div>
      <Button
        aria-label={`${APP_COPY.removeItem}: ${item.book.title}`}
        onClick={() => onRemove(item.book.id)}
        variant="secondary"
      >
        {APP_COPY.removeItem}
      </Button>
    </article>
  );
}
