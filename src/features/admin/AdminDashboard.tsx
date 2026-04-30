"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CatalogPaginationBar } from "@/components/book/CatalogPaginationBar";
import { CatalogToolbar } from "@/components/book/CatalogToolbar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useToast } from "@/components/ui/Toast";
import { SORT_OPTIONS } from "@/constants/catalog";
import {
  ADMIN_BOOKS_PAGE_SIZE,
  DEFAULT_BOOK_AUTHOR,
  DEFAULT_BOOK_DESCRIPTION_PREFIX,
  DEFAULT_BOOK_COVER_IMAGE_URL
} from "@/constants/config";
import { APP_COPY } from "@/constants/copy";
import { ROUTES } from "@/constants/routes";
import type {
  AdminApiErrorResponse,
  AdminBookListMeta,
  AdminBookSortKey,
  AdminBookInput,
  AdminBookSuccessResponse,
  AdminBooksSuccessResponse,
  AdminSummary
} from "@/features/admin/admin-api";
import { formatCurrency } from "@/lib/format";
import type { Book } from "@/types/book";

type AdminDashboardProps = {
  admin: AdminSummary;
};

type BookFormState = {
  sku: string;
  title: string;
  author: string;
  description: string;
  priceCents: string;
  coverImageUrl: string;
};

type ModalMode = "create" | "detail";

type PendingAction =
  | {
      type: "save";
    }
  | {
      book: Book;
      type: "delete";
    }
  | {
      type: "logout";
    };

type ConfirmationCopy = {
  actionLabel: string;
  message: string;
  title: string;
};

const emptyForm: BookFormState = {
  sku: "",
  title: "",
  author: "",
  description: "",
  priceCents: "",
  coverImageUrl: ""
};

const defaultMeta: AdminBookListMeta = {
  currentPage: 1,
  hasNextPage: false,
  hasPreviousPage: false,
  query: "",
  sort: "newest",
  totalItems: 0,
  totalPages: 1
};

function getShowingRange(meta: AdminBookListMeta, visibleCount: number) {
  if (meta.totalItems === 0 || visibleCount === 0) {
    return {
      start: 0,
      end: 0
    };
  }

  const start = (meta.currentPage - 1) * ADMIN_BOOKS_PAGE_SIZE + 1;

  return {
    start,
    end: Math.min(start + visibleCount - 1, meta.totalItems)
  };
}

function getFormFromBook(book: Book): BookFormState {
  return {
    sku: book.sku,
    title: book.title,
    author: book.author,
    description: book.description,
    priceCents: String(book.priceCents),
    coverImageUrl: book.coverImageUrl
  };
}

function getCoverPreviewUrl(value: string): string {
  if (!value) {
    return DEFAULT_BOOK_COVER_IMAGE_URL;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : DEFAULT_BOOK_COVER_IMAGE_URL;
  } catch {
    return DEFAULT_BOOK_COVER_IMAGE_URL;
  }
}

function buildPayload(form: BookFormState, mode: ModalMode): AdminBookInput {
  const priceCents = Number.parseInt(form.priceCents, 10);
  const payload: AdminBookInput = {
    title: form.title,
    priceCents
  };

  if (mode === "detail" || form.sku.trim()) {
    payload.sku = form.sku;
  }

  if (mode === "detail" || form.author.trim()) {
    payload.author = form.author || DEFAULT_BOOK_AUTHOR;
  }

  if (mode === "detail" || form.description.trim()) {
    payload.description =
      form.description || `${DEFAULT_BOOK_DESCRIPTION_PREFIX} ${form.title}.`;
  }

  if (mode === "detail" || form.coverImageUrl.trim()) {
    payload.coverImageUrl = form.coverImageUrl || DEFAULT_BOOK_COVER_IMAGE_URL;
  }

  return payload;
}

function getConfirmationCopy(action: PendingAction): ConfirmationCopy {
  if (action.type === "delete") {
    return {
      actionLabel: APP_COPY.adminConfirmDeleteAction,
      message: APP_COPY.adminDeleteConfirmMessage,
      title: APP_COPY.adminConfirmDeleteTitle
    };
  }

  if (action.type === "logout") {
    return {
      actionLabel: APP_COPY.adminConfirmLogoutAction,
      message: APP_COPY.adminConfirmLogoutMessage,
      title: APP_COPY.adminConfirmLogoutTitle
    };
  }

  return {
    actionLabel: APP_COPY.adminConfirmSaveAction,
    message: APP_COPY.adminConfirmSaveMessage,
    title: APP_COPY.adminConfirmSaveTitle
  };
}

async function readAdminResponse<T>(response: Response): Promise<T | AdminApiErrorResponse> {
  return await response.json() as T | AdminApiErrorResponse;
}

async function fetchAdminBooks({
  page,
  query,
  sort
}: {
  page: number;
  query: string;
  sort: AdminBookSortKey;
}): Promise<{
  books: Book[];
  meta: AdminBookListMeta;
}> {
  const params = new URLSearchParams({
    page: String(page),
    sort
  });

  if (query) {
    params.set("q", query);
  }

  const response = await fetch(`/api/admin/books?${params.toString()}`);
  const body = await readAdminResponse<AdminBooksSuccessResponse>(response);

  if (!response.ok || "error" in body) {
    throw new Error(
      "error" in body ? body.error.message : APP_COPY.adminGenericErrorMessage
    );
  }

  return {
    books: body.data.books,
    meta: body.meta
  };
}

export function AdminDashboard({ admin }: AdminDashboardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [meta, setMeta] = useState<AdminBookListMeta>(defaultMeta);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<AdminBookSortKey>("newest");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [form, setForm] = useState<BookFormState>(emptyForm);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const modalTitle = useMemo(() => {
    return modalMode === "create"
      ? APP_COPY.adminCreateTitle
      : APP_COPY.adminDetailTitle;
  }, [modalMode]);
  const showingRange = useMemo(
    () => getShowingRange(meta, books.length),
    [books.length, meta]
  );
  const coverPreviewUrl = getCoverPreviewUrl(form.coverImageUrl);
  const confirmationCopy = pendingAction
    ? getConfirmationCopy(pendingAction)
    : null;

  async function loadAdminData() {
    setError("");
    setIsLoading(true);

    try {
      const data = await fetchAdminBooks({
        page,
        query,
        sort
      });
      setBooks(data.books);
      setMeta(data.meta);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : APP_COPY.adminGenericErrorMessage
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialAdminData() {
      try {
        const data = await fetchAdminBooks({
          page,
          query,
          sort
        });

        if (!isMounted) {
          return;
        }

        setBooks(data.books);
        setMeta(data.meta);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : APP_COPY.adminGenericErrorMessage
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialAdminData();

    return () => {
      isMounted = false;
    };
  }, [page, query, sort]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || isSaving) {
        return;
      }

      if (pendingAction) {
        setPendingAction(null);
        return;
      }

      if (modalMode) {
        setModalMode(null);
        setSelectedBook(null);
        setForm(emptyForm);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isSaving, modalMode, pendingAction]);

  function handleClearSearch() {
    setSearchInput("");
    setQuery("");
    setSort("newest");
    setPage(1);
  }

  function handleSortChange(value: string) {
    const nextSort = SORT_OPTIONS.some((option) => option.value === value)
      ? value as AdminBookSortKey
      : "newest";
    setSort(nextSort);
    setPage(1);
  }

  function openCreateModal() {
    setSelectedBook(null);
    setForm(emptyForm);
    setModalMode("create");
  }

  function openDetailModal(book: Book) {
    setSelectedBook(book);
    setForm(getFormFromBook(book));
    setModalMode("detail");
  }

  function closeModal() {
    setModalMode(null);
    setSelectedBook(null);
    setForm(emptyForm);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!modalMode) {
      return;
    }

    setPendingAction({
      type: "save"
    });
  }

  async function saveBook() {
    if (!modalMode) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const selectedBookId = selectedBook?.id;

      if (modalMode === "detail" && !selectedBookId) {
        setError(APP_COPY.adminGenericErrorMessage);
        showToast(APP_COPY.adminSaveFailure);
        return;
      }

      const response = await fetch(
        modalMode === "create"
          ? "/api/admin/books"
          : `/api/admin/books/${selectedBookId}`,
        {
          method: modalMode === "create" ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(buildPayload(form, modalMode))
        }
      );
      const body = await readAdminResponse<AdminBookSuccessResponse>(response);

      if (!response.ok || "error" in body) {
        const message =
          "error" in body ? body.error.message : APP_COPY.adminSaveFailure;
        setError(message);
        showToast(message);
        return;
      }

      showToast(APP_COPY.adminSaveSuccess);
      closeModal();
      await loadAdminData();
    } catch {
      setError(APP_COPY.adminSaveFailure);
      showToast(APP_COPY.adminSaveFailure);
    } finally {
      setIsSaving(false);
    }
  }

  function handleDelete(book: Book) {
    setPendingAction({
      book,
      type: "delete"
    });
  }

  async function deleteBook(book: Book) {
    setError("");

    try {
      const response = await fetch(`/api/admin/books/${book.id}`, {
        method: "DELETE"
      });
      const body = await readAdminResponse<AdminBookSuccessResponse>(response);

      if (!response.ok || "error" in body) {
        const message =
          "error" in body ? body.error.message : APP_COPY.adminDeleteFailure;
        setError(message);
        showToast(message);
        return;
      }

      showToast(APP_COPY.adminDeleteSuccess);
      await loadAdminData();
    } catch {
      setError(APP_COPY.adminDeleteFailure);
      showToast(APP_COPY.adminDeleteFailure);
    }
  }

  function handleLogout() {
    setPendingAction({
      type: "logout"
    });
  }

  async function logout() {
    try {
      const response = await fetch("/api/admin/session", {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(APP_COPY.adminLogoutFailure);
      }

      showToast(APP_COPY.adminLogoutSuccess);
      router.replace(ROUTES.adminLogin);
      router.refresh();
    } catch {
      setError(APP_COPY.adminLogoutFailure);
      showToast(APP_COPY.adminLogoutFailure);
    }
  }

  async function confirmPendingAction() {
    const action = pendingAction;

    if (!action) {
      return;
    }

    setPendingAction(null);

    if (action.type === "delete") {
      await deleteBook(action.book);
      return;
    }

    if (action.type === "logout") {
      await logout();
      return;
    }

    await saveBook();
  }

  return (
    <>
      <header className="mb-6 border-b border-line pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-ink">
              {APP_COPY.adminShellTitle}
            </p>
            <p className="mt-1 text-xs font-medium text-muted">
              {APP_COPY.adminSignedInAsLabel}: {admin.displayName}
            </p>
          </div>
          <Button
            className="w-full sm:w-auto"
            onClick={handleLogout}
            variant="secondary"
          >
            {APP_COPY.adminLogoutAction}
          </Button>
        </div>
      </header>

      <section className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {APP_COPY.adminDashboardTitle}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            {APP_COPY.adminDashboardIntro}
          </p>
        </div>
        <Button className="w-full sm:w-auto" onClick={openCreateModal}>
          {APP_COPY.adminCreateAction}
        </Button>
      </section>

      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-line bg-white p-4">
          <p className="text-xs font-semibold uppercase text-muted">
            {APP_COPY.adminTotalBooksLabel}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">{meta.totalItems}</p>
        </div>
        <div className="rounded-md border border-line bg-white p-4">
          <p className="text-xs font-semibold uppercase text-muted">
            {APP_COPY.adminCurrentPageLabel}
          </p>
          <p className="mt-2 text-2xl font-bold text-ink">
            {meta.currentPage}/{meta.totalPages}
          </p>
        </div>
        <div className="rounded-md border border-line bg-white p-4">
          <p className="text-xs font-semibold uppercase text-muted">
            {APP_COPY.adminServerSearchLabel}
          </p>
          <p className="mt-2 truncate text-sm font-semibold text-ink">
            {query || sort}
          </p>
        </div>
      </section>

      {error ? (
        <ErrorState
          message={error}
          title={APP_COPY.adminGenericErrorMessage}
        />
      ) : null}

      {isLoading ? (
        <LoadingState message={APP_COPY.adminLoadingBooks} />
      ) : (
        <Card className="overflow-hidden">
          <CatalogToolbar
            heading={APP_COPY.adminBookListTitle}
            hasActiveQuery={Boolean(query) || sort !== "newest"}
            onClearSearch={handleClearSearch}
            onSearchChange={setSearchInput}
            onSearchSubmit={() => {
              setQuery(searchInput.trim());
              setPage(1);
            }}
            onSortChange={handleSortChange}
            searchPlaceholder={APP_COPY.adminSearchPlaceholder}
            searchValue={searchInput}
            sortValue={sort}
            summary={`${APP_COPY.adminShowingLabel} ${showingRange.start}-${showingRange.end} ${APP_COPY.ofLabel} ${meta.totalItems} ${APP_COPY.resultsLabel}`}
          />
            {books.length === 0 ? (
              <div className="p-4 sm:p-5">
                <EmptyState
                  message={APP_COPY.adminEmptyBooksMessage}
                  title={APP_COPY.adminEmptyBooksTitle}
                />
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto sm:block">
                  <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-muted">
                    <tr>
                      <th className="w-[36%] px-4 py-3">
                        {APP_COPY.adminTitleLabel}
                      </th>
                      <th className="w-[22%] px-4 py-3">
                        {APP_COPY.authorLabel}
                      </th>
                      <th className="w-[18%] px-4 py-3">
                        {APP_COPY.adminSkuLabel}
                      </th>
                      <th className="w-[12%] px-4 py-3 text-right">
                        {APP_COPY.priceLabel}
                      </th>
                      <th className="w-[12%] px-4 py-3 text-right">
                        {APP_COPY.adminActionsLabel}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {books.map((book) => (
                      <tr
                        key={book.id}
                        className="align-middle transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 font-semibold text-ink">
                          <button
                            className="text-left transition hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                            onClick={() => openDetailModal(book)}
                            type="button"
                          >
                            {book.title}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-muted">{book.author}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted">
                          {book.sku}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-ink">
                          {formatCurrency(book.priceCents)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              className="min-h-9 px-3"
                              onClick={() => openDetailModal(book)}
                              variant="secondary"
                            >
                              {APP_COPY.adminEditAction}
                            </Button>
                            <Button
                              className="min-h-9 px-3"
                              onClick={() => handleDelete(book)}
                              variant="ghost"
                            >
                              {APP_COPY.adminDeleteAction}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
                <div className="grid gap-3 p-4 sm:hidden">
                  {books.map((book) => (
                    <article
                      className="rounded-md border border-line bg-white p-4"
                      key={book.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-bold text-ink">
                            {book.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted">
                            {book.author} &middot;{" "}
                            <span className="font-mono text-xs">{book.sku}</span>
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-ink">
                          {formatCurrency(book.priceCents)}
                        </p>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button
                          className="min-h-10"
                          onClick={() => openDetailModal(book)}
                          variant="secondary"
                        >
                          {APP_COPY.adminEditAction}
                        </Button>
                        <Button
                          className="min-h-10"
                          onClick={() => handleDelete(book)}
                          variant="ghost"
                        >
                          {APP_COPY.adminDeleteAction}
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
            <CatalogPaginationBar
              currentPage={meta.currentPage}
              endItem={showingRange.end}
              hasNextPage={meta.hasNextPage}
              hasPreviousPage={meta.hasPreviousPage}
              onNext={() => setPage((currentPage) => currentPage + 1)}
              onPrevious={() =>
                setPage((currentPage) => Math.max(1, currentPage - 1))
              }
              startItem={showingRange.start}
              totalItems={meta.totalItems}
              totalPages={meta.totalPages}
            />
        </Card>
      )}

      {modalMode ? (
        <div
          aria-modal="true"
          aria-labelledby="admin-book-modal-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/45 p-2 sm:items-center sm:p-6"
          role="dialog"
        >
          <Card className="flex max-h-[calc(100vh-1rem)] w-full max-w-[720px] overflow-hidden rounded-md p-0 sm:max-h-[90vh]">
            <form className="flex min-h-0 w-full flex-col" onSubmit={handleSave}>
              <div className="shrink-0 border-b border-line bg-white px-4 py-3 sm:px-6">
                <h2
                  className="text-xl font-bold text-ink sm:text-2xl"
                  id="admin-book-modal-title"
                >
                  {modalTitle}
                </h2>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                <div className="grid gap-5">
                  <section>
                    <h3 className="text-sm font-bold text-ink">
                      {APP_COPY.adminRequiredFieldsTitle}
                    </h3>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold text-ink">
                        {APP_COPY.adminTitleLabel}
                        <input
                          className="min-h-11 rounded-md border border-line px-3 text-sm font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              title: event.target.value
                            }))
                          }
                          placeholder={APP_COPY.adminTitlePlaceholder}
                          required
                          value={form.title}
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold text-ink">
                        {APP_COPY.priceLabel}
                        <input
                          className="min-h-11 rounded-md border border-line px-3 text-sm font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
                          min="1"
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              priceCents: event.target.value
                            }))
                          }
                          placeholder={APP_COPY.adminPricePlaceholder}
                          required
                          type="number"
                          value={form.priceCents}
                        />
                      </label>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-ink">
                      {APP_COPY.adminOptionalFieldsTitle}
                    </h3>
                    <div className="mt-3 grid gap-4 sm:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold text-ink">
                        {APP_COPY.adminSkuLabel}
                        <input
                          className="min-h-11 rounded-md border border-line px-3 text-sm font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              sku: event.target.value
                            }))
                          }
                          placeholder={APP_COPY.adminSkuPlaceholder}
                          value={form.sku}
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold text-ink">
                        {APP_COPY.authorLabel}
                        <input
                          className="min-h-11 rounded-md border border-line px-3 text-sm font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              author: event.target.value
                            }))
                          }
                          placeholder={APP_COPY.adminAuthorPlaceholder}
                          value={form.author}
                        />
                      </label>
                    </div>
                    <label className="mt-4 grid gap-2 text-sm font-semibold text-ink">
                      {APP_COPY.adminDescriptionLabel}
                      <textarea
                        className="min-h-28 rounded-md border border-line px-3 py-3 text-sm font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            description: event.target.value
                          }))
                        }
                        placeholder={APP_COPY.adminDescriptionPlaceholder}
                        value={form.description}
                      />
                    </label>
                    <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px]">
                      <label className="grid gap-2 text-sm font-semibold text-ink">
                        {APP_COPY.adminCoverImageUrlLabel}
                        <input
                          className="min-h-11 rounded-md border border-line px-3 text-sm font-normal outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              coverImageUrl: event.target.value
                            }))
                          }
                          placeholder={APP_COPY.adminCoverImageUrlPlaceholder}
                          type="url"
                          value={form.coverImageUrl}
                        />
                      </label>
                      <div>
                        <p className="mb-2 text-sm font-semibold text-ink">
                          {APP_COPY.adminDefaultCoverPreview}
                        </p>
                        <div
                          aria-label={APP_COPY.adminDefaultCoverPreview}
                          className="h-28 w-full rounded-md border border-line bg-cover bg-center"
                          role="img"
                          style={{
                            backgroundImage: `url(${coverPreviewUrl})`
                          }}
                        />
                      </div>
                    </div>
                  </section>
                </div>
              </div>
              <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-line bg-white px-4 py-3 sm:flex sm:justify-end sm:px-6">
                <Button onClick={closeModal} type="button" variant="secondary">
                  {APP_COPY.adminCancelAction}
                </Button>
                <Button disabled={isSaving} type="submit">
                  {APP_COPY.adminSaveAction}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      ) : null}

      {confirmationCopy ? (
        <div
          aria-labelledby="admin-confirmation-title"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4"
          role="alertdialog"
        >
          <Card className="w-full max-w-[420px] p-0">
            <div className="border-b border-line px-5 py-4">
              <h2
                className="text-lg font-bold text-ink"
                id="admin-confirmation-title"
              >
                {confirmationCopy.title}
              </h2>
            </div>
            <div className="px-5 py-4">
              <p className="text-sm leading-6 text-muted">
                {confirmationCopy.message}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-line px-5 py-4">
              <Button
                onClick={() => setPendingAction(null)}
                type="button"
                variant="secondary"
              >
                {APP_COPY.adminConfirmCancelAction}
              </Button>
              <Button onClick={() => void confirmPendingAction()} type="button">
                {confirmationCopy.actionLabel}
              </Button>
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
}
