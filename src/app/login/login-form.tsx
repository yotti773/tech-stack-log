"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

export function LoginForm({ confirmError }: { confirmError?: string }) {
  const initialState: LoginState = confirmError
    ? { status: "error", message: confirmError }
    : { status: "idle" };
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <>
      <form action={formAction} className="flex w-full flex-col gap-3">
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-text"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-accent px-3 py-2 font-semibold text-accent-fg disabled:opacity-50"
        >
          {pending ? "送信中..." : "ログインリンクを送る"}
        </button>
      </form>

      {state.message && (
        <p
          className={
            state.status === "error"
              ? "text-sm text-red-600"
              : "text-sm text-good"
          }
        >
          {state.message}
        </p>
      )}
    </>
  );
}
