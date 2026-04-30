"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/Toast";
import { APP_COPY } from "@/constants/copy";
import { ROUTES } from "@/constants/routes";
import type {
  AdminApiErrorResponse,
  AdminSessionSuccessResponse
} from "@/features/admin/admin-api";

export function AdminLoginForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      });
      const body = await response.json() as
        | AdminSessionSuccessResponse
        | AdminApiErrorResponse;

      if (!response.ok || "error" in body) {
        const message =
          "error" in body ? body.error.message : APP_COPY.adminGenericErrorMessage;
        setError(message);
        showToast(message);
        return;
      }

      showToast(APP_COPY.adminLoginSuccess);
      router.replace(ROUTES.admin);
      router.refresh();
    } catch {
      setError(APP_COPY.adminGenericErrorMessage);
      showToast(APP_COPY.adminGenericErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md p-6">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            {APP_COPY.adminLoginTitle}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            {APP_COPY.adminLoginIntro}
          </p>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          {APP_COPY.adminUsernameLabel}
          <input
            autoComplete="username"
            className="min-h-11 rounded-md border border-line px-3 text-sm font-normal text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
            onChange={(event) => setUsername(event.target.value)}
            required
            value={username}
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          {APP_COPY.adminPasswordLabel}
          <input
            autoComplete="current-password"
            className="min-h-11 rounded-md border border-line px-3 text-sm font-normal text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-blue-100"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </label>
        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {error}
          </p>
        ) : null}
        <Button disabled={isSubmitting} type="submit">
          {APP_COPY.adminLoginAction}
        </Button>
      </form>
    </Card>
  );
}
