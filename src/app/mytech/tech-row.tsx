"use client";

import { useActionState } from "react";
import {
  updateUserTechnology,
  deleteUserTechnology,
  type ActionState,
} from "./actions";
import { LevelPicker } from "./level-picker";

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
    <li className="flex flex-col gap-2 border-b border-border px-4 py-3 last:border-b-0">
      <form
        action={formAction}
        className="flex flex-wrap items-center gap-x-4 gap-y-2"
      >
        <input type="hidden" name="id" value={id} />
        <span className="min-w-28 font-semibold text-text">{name}</span>

        <LevelPicker defaultValue={level} />

        <input
          type="number"
          name="years"
          min={0}
          step={0.5}
          placeholder="年数"
          defaultValue={years ?? ""}
          className="w-16 border border-border bg-bg px-2 py-1 text-sm text-text"
        />

        <input
          type="text"
          name="note"
          placeholder="メモ"
          defaultValue={note ?? ""}
          className="min-w-32 flex-1 border border-border bg-bg px-2 py-1 text-sm text-text"
        />

        <label className="flex items-center gap-1.5 text-sm text-dim">
          <input type="checkbox" name="is_public" defaultChecked={isPublic} />
          公開
        </label>

        <button type="submit" disabled={pending} className="btn-term px-3 py-1 text-sm">
          保存
        </button>
      </form>

      <div className="flex items-center justify-end">
        <form action={deleteUserTechnology}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="text-xs text-bad underline">
            削除
          </button>
        </form>
      </div>

      {state.message && (
        <p
          className={
            state.status === "error"
              ? "text-sm text-bad"
              : "text-sm text-good"
          }
        >
          {state.message}
        </p>
      )}
    </li>
  );
}
