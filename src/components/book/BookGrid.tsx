import { BookCard } from "@/components/book/BookCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { APP_COPY } from "@/constants/copy";
import type { Book } from "@/types/book";

type BookGridProps = {
  books: Book[];
  onAddToCart: (book: Book) => void;
  emptyMessage?: string;
  emptyTitle?: string;
};

export function BookGrid({
  books,
  onAddToCart,
  emptyMessage = APP_COPY.emptyBooksMessage,
  emptyTitle = APP_COPY.emptyBooksTitle
}: BookGridProps) {
  if (books.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
