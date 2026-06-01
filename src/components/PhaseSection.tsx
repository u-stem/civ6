"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { PHASE_LABELS } from "@/data/labels";
import type {
  GamePhase,
  GameSpeed,
  SavedGame,
  TaskFragment,
} from "@/lib/schema";
import { type Prereq, TaskItem } from "./TaskItem";

const PHASE_DOT: Record<GamePhase, string> = {
  early: "bg-phase-early",
  mid: "bg-phase-mid",
  late: "bg-phase-late",
};

type Props = {
  phase: GamePhase;
  tasks: TaskFragment[];
  game: SavedGame;
  speed: GameSpeed;
  hideCompleted: boolean;
  prereqOf: (task: TaskFragment) => Prereq[];
  onToggle: (taskId: string, checked: boolean) => void;
  onNote: (taskId: string, note: string) => void;
};

export function PhaseSection({
  phase,
  tasks,
  game,
  speed,
  hideCompleted,
  prereqOf,
  onToggle,
  onNote,
}: Props) {
  const done = tasks.filter((t) => game.checked[t.id]).length;
  const visible = hideCompleted
    ? tasks.filter((t) => !game.checked[t.id])
    : tasks;
  // 未完を上、完了を下に沈める(元の並びは安定ソートで保持)。
  const sorted = [...visible].sort(
    (a, b) =>
      Number(Boolean(game.checked[a.id])) - Number(Boolean(game.checked[b.id])),
  );

  return (
    <AccordionItem value={phase} className="rounded-lg border px-4">
      <AccordionTrigger className="hover:no-underline">
        <span className="flex items-center gap-2.5">
          <span className={`size-2.5 rounded-full ${PHASE_DOT[phase]}`} />
          <span className="font-medium">{PHASE_LABELS[phase]}</span>
          <Badge variant="secondary" className="tabular-nums">
            {done}/{tasks.length}
          </Badge>
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-2">
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {hideCompleted && tasks.length > 0
              ? "このフェーズはすべて完了しました。"
              : "該当タスクがありません。"}
          </p>
        ) : (
          sorted.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              speed={speed}
              checked={Boolean(game.checked[task.id])}
              note={game.notes?.[task.id] ?? ""}
              prereqs={prereqOf(task)}
              onToggle={(c) => onToggle(task.id, c)}
              onNote={(n) => onNote(task.id, n)}
            />
          ))
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
