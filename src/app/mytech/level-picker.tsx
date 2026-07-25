"use client";

import { Fragment, useId } from "react";

export function LevelPicker({ defaultValue = 3 }: { defaultValue?: number }) {
  const id = useId();
  const levels = [5, 4, 3, 2, 1];

  return (
    <div className="level-picker" aria-label="習熟度(1〜5)">
      {levels.map((n) => (
        <Fragment key={n}>
          <input
            type="radio"
            name="level"
            id={`${id}-level-${n}`}
            value={n}
            defaultChecked={n === defaultValue}
            required
          />
          <label htmlFor={`${id}-level-${n}`} title={`習熟度 ${n}`} />
        </Fragment>
      ))}
    </div>
  );
}
