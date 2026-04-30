"use client";

import { useEffect, useRef, useState } from "react";
import { APP_COPY } from "@/constants/copy";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { useCartStore } from "@/features/cart/cart-store";

export function CartBadge() {
  const hasMounted = useHasMounted();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [isPulsing, setIsPulsing] = useState(false);
  const previousTotal = useRef(totalItems);

  useEffect(() => {
    if (hasMounted && totalItems > previousTotal.current) {
      setIsPulsing(true);
      const timeoutId = window.setTimeout(() => setIsPulsing(false), 300);
      previousTotal.current = totalItems;
      return () => window.clearTimeout(timeoutId);
    }

    previousTotal.current = totalItems;
    return undefined;
  }, [hasMounted, totalItems]);

  const visibleTotal = hasMounted ? totalItems : 0;

  const itemLabel =
    visibleTotal === 1 ? APP_COPY.itemSingular : APP_COPY.itemPlural;

  return (
    <span
      aria-label={`${APP_COPY.cartLabel}: ${visibleTotal} ${itemLabel}`}
      className={`ml-2 inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-brand px-2 text-xs font-bold text-white transition duration-300 ${
        isPulsing ? "scale-110 shadow-soft" : "scale-100"
      }`}
    >
      {visibleTotal}
    </span>
  );
}
