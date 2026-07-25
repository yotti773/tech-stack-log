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
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-black dark:text-zinc-50">
        ユーザー名
        <input
          type="text"
          name="username"
          defaultValue={username}
          placeholder="例: yotti773"
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-black dark:text-zinc-50">
        表示名
        <input
          type="text"
          name="display_name"
          defaultValue={displayName}
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-black dark:text-zinc-50">
        自己紹介
        <textarea
          name="bio"
          defaultValue={bio}
          rows={4}
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-black dark:text-zinc-50">
        <input type="checkbox" name="is_public" defaultChecked={isPublic} />
        プロフィールを公開する（今後、公開ページから見られるようになります）
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-black"
      >
        {pending ? "保存中..." : "保存する"}
      </button>

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
    </form>
  );
}
