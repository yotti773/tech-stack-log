"use client";

import { useActionState, useState } from "react";
import { addUserTechnology, type ActionState } from "./actions";

const initialState: ActionState = { status: "idle" };

export function AddTechForm({
  technologies,
}: {
  technologies: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(
    addUserTechnology,
    initialState
  );
  const [selected, setSelected] = useState("");

  return (
    <form
      action={formAction}
      className="flex flex-col gap-3 rounded border border-zinc-300 p-4 dark:border-zinc-700"
    >
      <h2 className="font-medium text-black dark:text-zinc-50">技術を追加</h2>

      <select
        name="technology_id"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="rounded border border-zinc-300 bg-white px-2 py-1 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
      >
        <option value="">-- 新しい技術を追加 --</option>
        {technologies.map((tech) => (
          <option key={tech.id} value={tech.id}>
            {tech.name}
          </option>
        ))}
      </select>

      {!selected && (
        <input
          type="text"
          name="new_technology_name"
          placeholder="新しい技術名（例: Rust）"
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      )}

      <label className="flex items-center gap-2 text-sm text-black dark:text-zinc-50">
        習熟度(1〜5)
        <input
          type="number"
          name="level"
          min={1}
          max={5}
          defaultValue={3}
          required
          className="w-16 rounded border border-zinc-300 bg-white px-2 py-1 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-black dark:text-zinc-50">
        経験年数
        <input
          type="number"
          name="years"
          min={0}
          step={0.5}
          className="w-20 rounded border border-zinc-300 bg-white px-2 py-1 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>

      <textarea
        name="note"
        placeholder="メモ"
        className="rounded border border-zinc-300 bg-white px-2 py-1 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
      />

      <label className="flex items-center gap-2 text-sm text-black dark:text-zinc-50">
        <input type="checkbox" name="is_public" />
        公開する
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-black"
      >
        {pending ? "登録中..." : "追加する"}
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
