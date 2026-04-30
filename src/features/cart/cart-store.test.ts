import { CART_STORAGE_KEY } from "@/constants/config";
import { useCartStore } from "@/features/cart/cart-store";
import type { Book } from "@/types/book";

const testBook: Book = {
  id: "test-book",
  sku: "BKH-TEST",
  title: "Test Driven Book",
  author: "Ada Reader",
  description: "A test fixture book.",
  priceCents: 1500,
  coverImageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
  createdAt: "2026-01-01T00:00:00.000Z"
};

beforeEach(() => {
  localStorage.clear();
  useCartStore.setState({ items: [] });
});

test("adds a new book and adjusts quantity", () => {
  useCartStore.getState().addItem(testBook);
  useCartStore.getState().addItem(testBook);
  useCartStore.getState().incrementItem(testBook.id);
  useCartStore.getState().decrementItem(testBook.id);

  expect(useCartStore.getState().items).toEqual([
    {
      book: testBook,
      quantity: 2
    }
  ]);
});

test("removes a book explicitly and when quantity reaches zero", () => {
  useCartStore.getState().addItem(testBook);
  useCartStore.getState().decrementItem(testBook.id);

  expect(useCartStore.getState().items).toEqual([]);

  useCartStore.getState().addItem(testBook);
  useCartStore.getState().addItem(testBook);
  useCartStore.getState().removeItem(testBook.id);

  expect(useCartStore.getState().items).toEqual([]);
});

test("calculates total item count and total price", () => {
  useCartStore.getState().addItem(testBook);
  useCartStore.getState().addItem(testBook);

  expect(useCartStore.getState().getTotalItems()).toBe(2);
  expect(useCartStore.getState().getTotalPrice()).toBe(3000);
});

test("persists cart state through localStorage", () => {
  useCartStore.getState().addItem(testBook);

  const storedCart = localStorage.getItem(CART_STORAGE_KEY);

  expect(storedCart).toContain(testBook.id);
});
