"use client";

import { useActionState } from "react";
import {
  updateUserTechnology,
  deleteUserTechnology,
  type ActionState,
} from "./actions";

const initialState: ActionState = { status: "idle" };

export function TechRow({
  id,
  name,
  level,
  years,
  note,
  isPublic,
}: {
  id: string;
  name: string;
  level: number;
  years: number | null;
  note: string | null;
  isPublic: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    updateUserTechnology,
    initialState
  );

  return (
    <li className="flex flex-col gap-2 border-b border-zinc-200 py-3 dark:border-zinc-800">
      <form action={formAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="id" value={id} />
        <span className="font-medium text-black dark:text-zinc-50">
          {name}
        </span>

        <label className="flex items-center gap-1 text-sm">
          Lv
          <input
            type="number"
            name="level"
            min={1}
            max={5}
            defaultValue={level}
            required
            className="w-14 rounded border border-zinc-300 bg-white px-1 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </label>

        <label className="flex items-center gap-1 text-sm">
          年数
          <input
            type="number"
            name="years"
            min={0}
            step={0.5}
            defaultValue={years ?? ""}
            className="w-16 rounded border border-zinc-300 bg-white px-1 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
        </label>

        <input
          type="text"
          name="note"
          placeholder="メモ"
          defaultValue={note ?? ""}
          className="min-w-32 flex-1 rounded border border-zinc-300 bg-white px-2 text-sm text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />

        <label className="flex items-center gap-1 text-sm">
          <input type="checkbox" name="is_public" defaultChecked={isPublic} />
          公開
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded border border-zinc-300 px-2 py-1 text-sm text-black disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-50"
        >
          保存
        </button>
      </form>

      <form action={deleteUserTechnology}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="text-sm text-red-600 underline"
        >
          削除
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
    </li>
  );
}
