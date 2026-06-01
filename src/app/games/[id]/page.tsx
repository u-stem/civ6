"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PhaseSection } from "@/components/PhaseSection";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { ALL_FRAGMENTS, getCivilization } from "@/data";
import { RULESET_LABELS, SPEED_LABELS, VICTORY_LABELS } from "@/data/labels";
import { GAME_PHASES, type SavedGame, type TaskFragment } from "@/lib/schema";
import { getGame, setChecked, setNote } from "@/lib/storage";
import { synthesize } from "@/lib/synthesize";

const TITLE_BY_ID = new Map(ALL_FRAGMENTS.map((f) => [f.id, f.title]));

export default function GamePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [game, setGame] = useState<SavedGame | null>(null);
  const [ready, setReady] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);

  useEffect(() => {
    setGame(getGame(id) ?? null);
    setReady(true);
  }, [id]);

  function handleToggle(taskId: string, checked: boolean) {
    setChecked(id, taskId, checked);
    setGame(getGame(id) ?? null);
  }

  function handleNote(taskId: string, note: string) {
    setNote(id, taskId, note);
    setGame(getGame(id) ?? null);
  }

  if (!ready) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-8">
        <Skeleton className="h-40 w-full" />
      </main>
    );
  }

  if (!game) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-8">
        <p className="text-muted-foreground">
          ゲームが見つかりません。
          <Link href="/" className="ml-1 underline">
            一覧へ戻る
          </Link>
        </p>
      </main>
    );
  }

  const g = game;
  const tasks = synthesize(g.setup, ALL_FRAGMENTS);
  const all = [...tasks.early, ...tasks.mid, ...tasks.late];
  const done = all.filter((t) => g.checked[t.id]).length;
  const pct = all.length > 0 ? Math.round((done / all.length) * 100) : 0;
  const civ = getCivilization(g.setup.civId);

  const prereqOf = (task: TaskFragment) =>
    (task.dependsOn ?? []).map((pid) => ({
      title: TITLE_BY_ID.get(pid) ?? pid,
      done: Boolean(g.checked[pid]),
    }));

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
        <Link href="/">
          <ArrowLeft className="size-4" />
          一覧
        </Link>
      </Button>

      <div className="sticky top-14 z-30 -mx-5 mb-4 border-b bg-background/80 px-5 py-3 backdrop-blur-sm">
        <h1 className="text-xl font-semibold tracking-tight">{g.name}</h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">{civ?.name ?? g.setup.civId}</Badge>
          {g.setup.victories.map((v) => (
            <Badge key={v}>{VICTORY_LABELS[v]}勝利</Badge>
          ))}
          <span className="text-xs text-muted-foreground">
            {RULESET_LABELS[g.setup.ruleset]} ・ {SPEED_LABELS[g.setup.speed]}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Progress value={pct} className="flex-1" />
          <span className="text-sm tabular-nums text-muted-foreground">
            {done}/{all.length}（{pct}%）
          </span>
        </div>
        <div className="mt-2 flex items-center justify-end gap-2">
          <Label htmlFor="hide" className="font-normal text-muted-foreground">
            完了を隠す
          </Label>
          <Switch
            id="hide"
            checked={hideCompleted}
            onCheckedChange={setHideCompleted}
          />
        </div>
      </div>

      <Accordion
        type="multiple"
        defaultValue={[...GAME_PHASES]}
        className="space-y-2"
      >
        {GAME_PHASES.map((phase) => (
          <PhaseSection
            key={phase}
            phase={phase}
            tasks={tasks[phase]}
            game={g}
            speed={g.setup.speed}
            hideCompleted={hideCompleted}
            prereqOf={prereqOf}
            onToggle={handleToggle}
            onNote={handleNote}
          />
        ))}
      </Accordion>

      {civ && (
        <p className="mt-6 text-xs text-muted-foreground">
          目安ターンは{SPEED_LABELS[g.setup.speed]}スピードでの概算です。
          {civ.name}の攻略は{" "}
          <Link href={`/wiki/civ/${civ.id}`} className="underline">
            wiki
          </Link>{" "}
          を参照。
        </p>
      )}
    </main>
  );
}
