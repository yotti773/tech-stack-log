"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-sm flex-col items-center gap-6 px-8 py-32">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          ログイン
        </h1>
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          メールアドレス宛にログインリンクを送ります。
        </p>

        <form action={formAction} className="flex w-full flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded bg-black px-3 py-2 text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-black"
          >
            {pending ? "送信中..." : "ログインリンクを送る"}
          </button>
        </form>

        {state.message && (
          <p
            className={
              state.status === "error"
                ? "text-sm text-red-600"
                : "text-sm text-green-600"
            }
          >
            {state.message}
          </p>
        )}
      </main>
    </div>
  );
}
