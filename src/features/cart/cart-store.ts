"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CART_STORAGE_KEY } from "@/constants/config";
import type { Book } from "@/types/book";
import type { CartItem } from "@/types/cart";

type CartState = {
  items: CartItem[];
  addItem: (book: Book) => void;
  decrementItem: (bookId: string) => void;
  incrementItem: (bookId: string) => void;
  removeItem: (bookId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const initialCartState = {
  items: []
};

function totalItems(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

function totalPrice(items: CartItem[]): number {
  return items.reduce(
    (total, item) => total + item.book.priceCents * item.quantity,
    0
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      ...initialCartState,
      addItem: (book) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.book.id === book.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.book.id === book.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          }

          return {
            items: [...state.items, { book, quantity: 1 }]
          };
        }),
      decrementItem: (bookId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.book.id === bookId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0)
        })),
      incrementItem: (bookId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.book.id === bookId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        })),
      removeItem: (bookId) =>
        set((state) => ({
          items: state.items.filter((item) => item.book.id !== bookId)
        })),
      clearCart: () => set(initialCartState),
      getTotalItems: () => totalItems(get().items),
      getTotalPrice: () => totalPrice(get().items)
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
