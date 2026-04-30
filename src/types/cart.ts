import type { Book } from "@/types/book";

export type CartItem = {
  book: Book;
  quantity: number;
};
