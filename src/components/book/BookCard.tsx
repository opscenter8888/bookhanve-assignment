"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { APP_COPY } from "@/constants/copy";
import { formatCurrency } from "@/lib/format";
import type { Book } from "@/types/book";

type BookCardProps = {
  book: Book;
  onAddToCart: (book: Book) => void;
};

export function BookCard({ book, onAddToCart }: BookCardProps) {
  const { showToast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!isAdded) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setIsAdded(false), 1200);
    return () => window.clearTimeout(timeoutId);
  }, [isAdded]);

  function handleAddToCart() {
    onAddToCart(book);
    setIsAdded(true);
    showToast(`${APP_COPY.addedToCartMessage}: ${book.title}`);
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] bg-slate-100">
        <Image
          alt={`${book.title} cover`}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          src={book.coverImageUrl}
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            {APP_COPY.skuLabel}: {book.sku}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-ink">{book.title}</h2>
          <p className="mt-1 text-sm text-muted">
            {APP_COPY.authorLabel}: {book.author}
          </p>
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
            {book.description}
          </p>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-ink">
            {formatCurrency(book.priceCents)}
          </p>
          <Button
            aria-label={`${APP_COPY.addToCart}: ${book.title}`}
            className={isAdded ? "bg-emerald-600 hover:bg-emerald-700" : ""}
            onClick={handleAddToCart}
          >
            {isAdded ? APP_COPY.addedToCart : APP_COPY.addToCart}
          </Button>
        </div>
        <p
          aria-live="polite"
          className={`mt-3 min-h-5 text-sm font-medium transition ${
            isAdded ? "text-emerald-700 opacity-100" : "text-emerald-700 opacity-0"
          }`}
        >
          {APP_COPY.addedToCartMessage}
        </p>
      </div>
    </Card>
  );
}
