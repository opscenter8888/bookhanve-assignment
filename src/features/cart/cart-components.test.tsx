import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartBadge } from "@/features/cart/CartBadge";
import { CartItemRow } from "@/features/cart/CartItemRow";
import { CartSummary } from "@/features/cart/CartSummary";
import { useCartStore } from "@/features/cart/cart-store";
import type { CartItem } from "@/types/cart";

const cartItem: CartItem = {
  book: {
    id: "cart-book",
    sku: "BKH-CART",
    title: "Cart Patterns",
    author: "Grace Buyer",
    description: "A cart fixture book.",
    priceCents: 1250,
    coverImageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    createdAt: "2026-01-01T00:00:00.000Z"
  },
  quantity: 2
};

beforeEach(() => {
  localStorage.clear();
  useCartStore.setState({ items: [] });
});

test("renders cart item quantity controls, summary total, and cart badge count", async () => {
  const user = userEvent.setup();
  const handleDecrement = jest.fn();
  const handleIncrement = jest.fn();
  const handleRemove = jest.fn();

  useCartStore.getState().addItem(cartItem.book);
  useCartStore.getState().addItem(cartItem.book);

  render(
    <>
      <CartBadge />
      <CartItemRow
        item={cartItem}
        onDecrement={handleDecrement}
        onIncrement={handleIncrement}
        onRemove={handleRemove}
      />
      <CartSummary totalItems={2} totalPrice={2500} />
    </>
  );

  await waitFor(() =>
    expect(screen.getByLabelText("View cart: 2 items")).toHaveTextContent("2")
  );
  expect(screen.getAllByText("2")).toHaveLength(3);
  expect(screen.getAllByText("$25.00")).toHaveLength(2);

  await user.click(screen.getByLabelText("Decrease quantity: Cart Patterns"));
  await user.click(screen.getByLabelText("Increase quantity: Cart Patterns"));

  expect(handleDecrement).toHaveBeenCalledWith(cartItem.book.id);
  expect(handleIncrement).toHaveBeenCalledWith(cartItem.book.id);
});
