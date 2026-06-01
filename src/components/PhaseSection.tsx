"use client";

import { PHASE_LABELS } from "@/data/labels";
import type {
  GamePhase,
  GameSpeed,
  SavedGame,
  TaskFragment,
} from "@/lib/schema";
import { TaskItem } from "./TaskItem";

type Props = {
  phase: GamePhase;
  tasks: TaskFragment[];
  game: SavedGame;
  speed: GameSpeed;
  onToggle: (taskId: string, checked: boolean) => void;
  onNote: (taskId: string, note: string) => void;
};

export function PhaseSection({
  phase,
  tasks,
  game,
  speed,
  onToggle,
  onNote,
}: Props) {
  const done = tasks.filter((t) => game.checked[t.id]).length;

  return (
    <section className={`phase phase-${phase}`}>
      <div className="phase-head">
        <h2>{PHASE_LABELS[phase]}</h2>
        <span className="phase-count">
          {done} / {tasks.length}
        </span>
      </div>
      {tasks.length === 0 ? (
        <p className="hint">この構成では該当タスクがありません。</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            speed={speed}
            checked={Boolean(game.checked[task.id])}
            note={game.notes?.[task.id] ?? ""}
            onToggle={(checked) => onToggle(task.id, checked)}
            onNote={(note) => onNote(task.id, note)}
          />
        ))
      )}
    </section>
  );
}
