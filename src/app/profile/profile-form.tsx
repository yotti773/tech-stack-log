"use client";

import { useActionState } from "react";
import { updateProfile, type ActionState } from "./actions";

const initialState: ActionState = { status: "idle" };

export function ProfileForm({
  username,
  displayName,
  bio,
  isPublic,
}: {
  username: string;
  displayName: string;
  bio: string;
  isPublic: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState
  );

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6"
    >
      <label className="flex flex-col gap-1 text-sm text-text">
        ユーザー名
        <input
          type="text"
          name="username"
          defaultValue={username}
          placeholder="例: techstacklog"
          className="rounded-md border border-border bg-bg px-2 py-1.5 text-text"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-text">
        表示名
        <input
          type="text"
          name="display_name"
          defaultValue={displayName}
          className="rounded-md border border-border bg-bg px-2 py-1.5 text-text"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-text">
        自己紹介
        <textarea
          name="bio"
          defaultValue={bio}
          rows={4}
          className="rounded-md border border-border bg-bg px-2 py-1.5 text-text"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-text">
        <input type="checkbox" name="is_public" defaultChecked={isPublic} />
        プロフィールを公開する（今後、公開ページから見られるようになります）
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent px-3 py-2 font-semibold text-accent-fg disabled:opacity-50"
      >
        {pending ? "保存中..." : "保存する"}
      </button>

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
    </form>
  );
}
