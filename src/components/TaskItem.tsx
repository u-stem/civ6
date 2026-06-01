"use client";

import { useState } from "react";
import { ERA_LABELS } from "@/data/labels";
import type { GameSpeed, TaskFragment } from "@/lib/schema";
import { estimateTurn } from "@/lib/speed";

type Props = {
  task: TaskFragment;
  speed: GameSpeed;
  checked: boolean;
  note: string;
  onToggle: (checked: boolean) => void;
  onNote: (note: string) => void;
};

export function TaskItem({
  task,
  speed,
  checked,
  note,
  onToggle,
  onNote,
}: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(note);

  const turn =
    task.targetTurnStandard !== undefined
      ? `〜${estimateTurn(task.targetTurnStandard, speed)}T`
      : null;
  const era = task.targetEra ? ERA_LABELS[task.targetEra] : null;

  return (
    <div className={checked ? "task done" : "task"}>
      <div className="task-main">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
          aria-label={task.title}
        />
        <button
          type="button"
          className="task-title"
          onClick={() => setOpen((v) => !v)}
        >
          {task.title}
        </button>
        <span className="task-tags">
          {era && <span className="tag">{era}</span>}
          {turn && <span className="tag">{turn}</span>}
        </span>
      </div>

      {open && (
        <>
          {task.detail && <p className="task-detail">{task.detail}</p>}
          <div className="task-note">
            <textarea
              rows={2}
              placeholder="メモ（任意）"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => {
                if (draft !== note) onNote(draft);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
