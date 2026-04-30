import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookCard } from "@/components/book/BookCard";
import { ToastProvider } from "@/components/ui/Toast";
import type { Book } from "@/types/book";

const book: Book = {
  id: "book-card",
  sku: "BKH-CARD",
  title: "Readable Interfaces",
  author: "Lin Component",
  description: "A practical book about interface design.",
  priceCents: 2199,
  coverImageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
  createdAt: "2026-01-01T00:00:00.000Z"
};

test("renders required book data, adds to cart, and shows feedback", async () => {
  const user = userEvent.setup();
  const onAddToCart = jest.fn();

  render(
    <ToastProvider>
      <BookCard book={book} onAddToCart={onAddToCart} />
    </ToastProvider>
  );

  expect(screen.getByAltText("Readable Interfaces cover")).toBeInTheDocument();
  expect(screen.getByText("Readable Interfaces")).toBeInTheDocument();
  expect(screen.getByText("Author: Lin Component")).toBeInTheDocument();
  expect(screen.getByText("SKU: BKH-CARD")).toBeInTheDocument();
  expect(screen.getByText("$21.99")).toBeInTheDocument();

  await user.click(
    screen.getByRole("button", { name: "Add to cart: Readable Interfaces" })
  );

  expect(onAddToCart).toHaveBeenCalledWith(book);
  expect(
    screen.getByRole("button", { name: "Add to cart: Readable Interfaces" })
  ).toHaveTextContent("Added");
  expect(screen.getByRole("status")).toHaveTextContent(
    "Added to cart: Readable Interfaces"
  );
});
