"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { ERA_LABELS } from "@/data/labels";
import type { GameSpeed, TaskFragment } from "@/lib/schema";
import { estimateTurn } from "@/lib/speed";

export type Prereq = { title: string; done: boolean };

type Props = {
  task: TaskFragment;
  speed: GameSpeed;
  checked: boolean;
  note: string;
  prereqs: Prereq[];
  onToggle: (checked: boolean) => void;
  onNote: (note: string) => void;
};

export function TaskItem({
  task,
  speed,
  checked,
  note,
  prereqs,
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
  const civOnly = (task.applies.civs?.length ?? 0) > 0;
  const gsOnly = task.applies.minRuleset === "gathering-storm";
  const pending = prereqs.filter((p) => !p.done);

  function saveNote() {
    if (draft !== note) {
      onNote(draft);
      toast.success("メモを保存しました");
    }
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={`rounded-lg border bg-card transition-opacity ${checked ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3 p-3">
        <Checkbox
          checked={checked}
          onCheckedChange={(c) => onToggle(c === true)}
          aria-label={task.title}
          className="mt-0.5"
        />
        <CollapsibleTrigger className="flex-1 text-left">
          <span
            className={`text-sm font-medium ${checked ? "line-through" : ""}`}
          >
            {task.title}
          </span>
        </CollapsibleTrigger>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
          {era && (
            <Badge variant="outline" className="text-xs">
              {era}
            </Badge>
          )}
          {turn && (
            <Badge variant="outline" className="text-xs tabular-nums">
              {turn}
            </Badge>
          )}
          {civOnly && (
            <Badge variant="secondary" className="text-xs">
              文明固有
            </Badge>
          )}
          {gsOnly && (
            <Badge variant="secondary" className="text-xs">
              嵐の訪れ
            </Badge>
          )}
        </div>
      </div>

      {pending.length > 0 && (
        <div className="px-3 pb-2 pl-10">
          <Badge
            variant="outline"
            className="border-amber-500/50 text-xs text-amber-600 dark:text-amber-400"
          >
            前提未完了: {pending.map((p) => p.title).join(" / ")}
          </Badge>
        </div>
      )}

      <CollapsibleContent className="px-3 pb-3 pl-10">
        {task.detail && (
          <p className="mb-2 text-sm leading-relaxed text-muted-foreground">
            {task.detail}
          </p>
        )}
        <Textarea
          rows={2}
          placeholder="メモ（任意）"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={saveNote}
          className="text-sm"
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
