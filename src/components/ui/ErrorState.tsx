import type { ReactNode } from "react";
import { APP_COPY } from "@/constants/copy";

type ErrorStateProps = {
  action?: ReactNode;
  title?: string;
  message?: string;
  tone?: "danger" | "info";
};

export function ErrorState({
  action,
  title = APP_COPY.booksErrorTitle,
  message = APP_COPY.booksErrorMessage,
  tone = "danger"
}: ErrorStateProps) {
  const toneClasses =
    tone === "info"
      ? "border-blue-200 bg-blue-50 text-blue-900"
      : "border-red-200 bg-red-50 text-red-900";
  const messageClasses = tone === "info" ? "text-blue-700" : "text-red-700";

  return (
    <div className={`rounded-lg border p-6 ${toneClasses}`} role="alert">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className={`mt-2 text-sm ${messageClasses}`}>{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
