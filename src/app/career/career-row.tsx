"use client";

import { useActionState } from "react";
import { updateCareer, deleteCareer, type ActionState } from "./actions";

const initialState: ActionState = { status: "idle" };

export function CareerRow({
  id,
  company,
  role,
  startedOn,
  endedOn,
  summary,
  isPublic,
  technologyIds,
  technologies,
}: {
  id: string;
  company: string;
  role: string;
  startedOn: string;
  endedOn: string | null;
  summary: string | null;
  isPublic: boolean;
  technologyIds: string[];
  technologies: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(updateCareer, initialState);

  return (
    <li className="flex flex-col gap-3 border-b border-border px-4 py-4 last:border-b-0">
      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="id" value={id} />

        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1 text-sm text-text">
            <span className="text-xs uppercase tracking-wide text-dim">会社名</span>
            <input
              type="text"
              name="company"
              defaultValue={company}
              required
              className="w-48 border border-border bg-bg px-2 py-1.5 text-text"
            />
          </div>

          <div className="flex flex-col gap-1 text-sm text-text">
            <span className="text-xs uppercase tracking-wide text-dim">役割</span>
            <input
              type="text"
              name="role"
              defaultValue={role}
              required
              className="w-48 border border-border bg-bg px-2 py-1.5 text-text"
            />
          </div>

          <div className="flex flex-col gap-1 text-sm text-text">
            <span className="text-xs uppercase tracking-wide text-dim">開始年月</span>
            <input
              type="date"
              name="started_on"
              defaultValue={startedOn}
              required
              className="border border-border bg-bg px-2 py-1.5 text-text"
            />
          </div>

          <div className="flex flex-col gap-1 text-sm text-text">
            <span className="text-xs uppercase tracking-wide text-dim">終了年月</span>
            <input
              type="date"
              name="ended_on"
              defaultValue={endedOn ?? ""}
              className="border border-border bg-bg px-2 py-1.5 text-text"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm text-text">
          <span className="text-xs uppercase tracking-wide text-dim">概要</span>
          <textarea
            name="summary"
            rows={2}
            defaultValue={summary ?? ""}
            className="border border-border bg-bg px-2 py-1.5 text-text"
          />
        </div>

        <div className="flex flex-col gap-1 text-sm text-text">
          <span className="text-xs uppercase tracking-wide text-dim">使用技術</span>
          <select
            name="technology_ids"
            multiple
            defaultValue={technologyIds}
            className="h-32 border border-border bg-bg px-2 py-1.5 text-text"
          >
            {technologies.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm text-dim">
            <input type="checkbox" name="is_public" defaultChecked={isPublic} />
            公開
          </label>
          <button type="submit" disabled={pending} className="btn-term px-3 py-1 text-sm">
            保存
          </button>
        </div>
      </form>

      <div className="flex items-center justify-end">
        <form action={deleteCareer}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="text-xs text-bad underline">
            削除
          </button>
        </form>
      </div>

      {state.message && (
        <p className={state.status === "error" ? "text-sm text-bad" : "text-sm text-good"}>
          {state.message}
        </p>
      )}
    </li>
  );
}
