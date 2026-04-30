import { APP_COPY } from "@/constants/copy";
import { formatCurrency } from "@/lib/format";

type CartSummaryProps = {
  totalItems: number;
  totalPrice: number;
};

export function CartSummary({ totalItems, totalPrice }: CartSummaryProps) {
  return (
    <aside className="rounded-lg border border-line bg-slate-50 p-5">
      <h2 className="text-lg font-semibold text-ink">{APP_COPY.totalLabel}</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted">{APP_COPY.quantityLabel}</dt>
          <dd className="font-semibold text-ink">{totalItems}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-line pt-3">
          <dt className="text-muted">{APP_COPY.totalLabel}</dt>
          <dd className="text-xl font-bold text-ink">{formatCurrency(totalPrice)}</dd>
        </div>
      </dl>
    </aside>
  );
}
