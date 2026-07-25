"use client";

import { useActionState, useState } from "react";
import { addUserTechnology, type ActionState } from "./actions";
import { LevelPicker } from "./level-picker";

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
      className="flex flex-wrap items-end gap-4 rounded-lg border border-border bg-surface p-5"
    >
      <div className="flex flex-col gap-1 text-sm text-text">
        <span className="text-xs font-semibold uppercase tracking-wide text-dim">
          技術
        </span>
        <select
          name="technology_id"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded-md border border-border bg-bg px-2 py-1.5 text-text"
        >
          <option value="">-- 新しい技術を追加 --</option>
          {technologies.map((tech) => (
            <option key={tech.id} value={tech.id}>
              {tech.name}
            </option>
          ))}
        </select>
      </div>

      {!selected && (
        <div className="flex flex-col gap-1 text-sm text-text">
          <span className="text-xs font-semibold uppercase tracking-wide text-dim">
            新しい技術名
          </span>
          <input
            type="text"
            name="new_technology_name"
            placeholder="例: Rust"
            className="rounded-md border border-border bg-bg px-2 py-1.5 text-text"
          />
        </div>
      )}

      <div className="flex flex-col gap-1 text-sm text-text">
        <span className="text-xs font-semibold uppercase tracking-wide text-dim">
          習熟度
        </span>
        <LevelPicker defaultValue={3} />
      </div>

      <div className="flex flex-col gap-1 text-sm text-text">
        <span className="text-xs font-semibold uppercase tracking-wide text-dim">
          経験年数
        </span>
        <input
          type="number"
          name="years"
          min={0}
          step={0.5}
          className="w-20 rounded-md border border-border bg-bg px-2 py-1.5 text-text"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 text-sm text-text">
        <span className="text-xs font-semibold uppercase tracking-wide text-dim">
          メモ
        </span>
        <input
          type="text"
          name="note"
          placeholder="メモ"
          className="rounded-md border border-border bg-bg px-2 py-1.5 text-text"
        />
      </div>

      <label className="flex items-center gap-2 pb-2 text-sm text-text">
        <input type="checkbox" name="is_public" />
        公開する
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-accent px-4 py-1.5 font-semibold text-accent-fg disabled:opacity-50"
      >
        {pending ? "登録中..." : "追加する"}
      </button>

      {state.message && (
        <p
          className={
            state.status === "error"
              ? "w-full text-sm text-red-600"
              : "w-full text-sm text-good"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
