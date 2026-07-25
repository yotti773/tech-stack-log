"use client";

import { useActionState, useState } from "react";
import { authenticate, signInWithGithub, type LoginState } from "./actions";
import { PASSWORD_LOGIN_ENABLED } from "./config";

export function LoginForm({ confirmError }: { confirmError?: string }) {
  const initialState: LoginState = confirmError
    ? { status: "error", message: confirmError }
    : { status: "idle" };

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [state, formAction, pending] = useActionState(authenticate, initialState);

  return (
    <div className="flex w-full flex-col gap-5">
      <form action={signInWithGithub}>
        <button
          type="submit"
          className="btn-term flex w-full items-center justify-center gap-2 px-3 py-2 font-semibold"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 fill-current">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
          GitHubでログイン
        </button>
      </form>

      {PASSWORD_LOGIN_ENABLED && (
        <>
          <div className="flex items-center gap-3 text-xs text-dim">
            <span className="h-px flex-1 bg-border" />
            または
            <span className="h-px flex-1 bg-border" />
          </div>

          <form action={formAction} className="flex w-full flex-col gap-3">
            <input type="hidden" name="mode" value={mode} />

            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full border border-border bg-surface px-3 py-2 text-text"
            />
            <input
              type="password"
              name="password"
              placeholder="パスワード"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
              minLength={mode === "signup" ? 6 : undefined}
              className="w-full border border-border bg-surface px-3 py-2 text-text"
            />

            <button
              type="submit"
              disabled={pending}
              className="btn-term w-full px-3 py-2 font-semibold"
            >
              {pending
                ? "処理中..."
                : mode === "signup"
                  ? "この内容で登録する"
                  : "ログイン"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-xs text-dim underline decoration-border underline-offset-2 hover:text-accent hover:decoration-accent"
          >
            {mode === "signin"
              ? "アカウントをお持ちでない方はこちら"
              : "すでにアカウントをお持ちの方はこちら"}
          </button>
        </>
      )}

      {/* /auth/callback や /auth/confirm から返されるエラーもここに出るので、
          パスワードフォームを隠していても表示する */}
      {state.message && <p className="text-sm text-bad">{state.message}</p>}
    </div>
  );
}
