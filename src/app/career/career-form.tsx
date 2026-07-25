"use client";

import { useActionState } from "react";
import { addCareer, type ActionState } from "./actions";

const initialState: ActionState = { status: "idle" };

export function CareerForm({
  technologies,
}: {
  technologies: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(addCareer, initialState);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 border border-border bg-surface p-5"
    >
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1 text-sm text-text">
          <span className="text-xs uppercase tracking-wide text-dim">会社名</span>
          <input
            type="text"
            name="company"
            required
            className="w-48 border border-border bg-bg px-2 py-1.5 text-text"
          />
        </div>

        <div className="flex flex-col gap-1 text-sm text-text">
          <span className="text-xs uppercase tracking-wide text-dim">役割</span>
          <input
            type="text"
            name="role"
            required
            placeholder="例: バックエンドエンジニア"
            className="w-48 border border-border bg-bg px-2 py-1.5 text-text"
          />
        </div>

        <div className="flex flex-col gap-1 text-sm text-text">
          <span className="text-xs uppercase tracking-wide text-dim">開始年月</span>
          <input
            type="date"
            name="started_on"
            required
            className="border border-border bg-bg px-2 py-1.5 text-text"
          />
        </div>

        <div className="flex flex-col gap-1 text-sm text-text">
          <span className="text-xs uppercase tracking-wide text-dim">終了年月</span>
          <input
            type="date"
            name="ended_on"
            className="border border-border bg-bg px-2 py-1.5 text-text"
          />
          <span className="text-xs text-dim">空欄なら在籍中</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 text-sm text-text">
        <span className="text-xs uppercase tracking-wide text-dim">概要</span>
        <textarea
          name="summary"
          rows={3}
          className="border border-border bg-bg px-2 py-1.5 text-text"
        />
      </div>

      <div className="flex flex-col gap-1 text-sm text-text">
        <span className="text-xs uppercase tracking-wide text-dim">使用技術</span>
        <select
          name="technology_ids"
          multiple
          className="h-32 border border-border bg-bg px-2 py-1.5 text-text"
        >
          {technologies.map((tech) => (
            <option key={tech.id} value={tech.id}>
              {tech.name}
            </option>
          ))}
        </select>
        <span className="text-xs text-dim">Ctrl/Cmdで複数選択できます</span>
      </div>

      <label className="flex items-center gap-2 text-sm text-text">
        <input type="checkbox" name="is_public" />
        公開する
      </label>

      <button
        type="submit"
        disabled={pending}
        className="btn-term self-start px-4 py-1.5 font-semibold"
      >
        {pending ? "登録中..." : "追加する"}
      </button>

      {state.message && (
        <p className={state.status === "error" ? "text-sm text-bad" : "text-sm text-good"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
