"use client";

import { Card } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import { useToast } from "@/components/ui/Toast";
import { APP_COPY } from "@/constants/copy";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { CartItemRow } from "@/features/cart/CartItemRow";
import { CartSummary } from "@/features/cart/CartSummary";
import { EmptyCart } from "@/features/cart/EmptyCart";
import { useCartStore } from "@/features/cart/cart-store";

export function CartView() {
  const { showToast } = useToast();
  const hasMounted = useHasMounted();
  const items = useCartStore((state) => state.items);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  function handleDecrement(bookId: string) {
    const item = items.find((cartItem) => cartItem.book.id === bookId);
    decrementItem(bookId);

    if (item) {
      const message =
        item.quantity === 1
          ? APP_COPY.removedFromCartMessage
          : APP_COPY.decreasedQuantityMessage;

      showToast(`${message}: ${item.book.title}`);
    }
  }

  function handleIncrement(bookId: string) {
    const item = items.find((cartItem) => cartItem.book.id === bookId);
    incrementItem(bookId);

    if (item) {
      showToast(`${APP_COPY.increasedQuantityMessage}: ${item.book.title}`);
    }
  }

  function handleRemove(bookId: string) {
    const item = items.find((cartItem) => cartItem.book.id === bookId);
    removeItem(bookId);

    if (item) {
      showToast(`${APP_COPY.removedFromCartMessage}: ${item.book.title}`);
    }
  }

  if (!hasMounted) {
    return <LoadingState message={APP_COPY.loadingBooks} />;
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card className="p-5">
        {items.map((item) => (
          <CartItemRow
            key={item.book.id}
            item={item}
            onDecrement={handleDecrement}
            onIncrement={handleIncrement}
            onRemove={handleRemove}
          />
        ))}
      </Card>
      <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
    </div>
  );
}
