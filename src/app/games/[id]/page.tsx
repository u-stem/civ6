"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PhaseSection } from "@/components/PhaseSection";
import { ProgressBar } from "@/components/ProgressBar";
import { ALL_FRAGMENTS, getCivilization } from "@/data";
import { RULESET_LABELS, SPEED_LABELS, VICTORY_LABELS } from "@/data/labels";
import { GAME_PHASES, type SavedGame } from "@/lib/schema";
import { getGame, setChecked, setNote } from "@/lib/storage";
import { synthesize } from "@/lib/synthesize";

export default function GamePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [game, setGame] = useState<SavedGame | null>(null);
  const [ready, setReady] = useState(false);

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
      <main className="container">
        <p className="hint">読み込み中…</p>
      </main>
    );
  }

  if (!game) {
    return (
      <main className="container">
        <p>
          ゲームが見つかりません。<Link href="/">一覧へ戻る</Link>
        </p>
      </main>
    );
  }

  const tasks = synthesize(game.setup, ALL_FRAGMENTS);
  const all = [...tasks.early, ...tasks.mid, ...tasks.late];
  const done = all.filter((t) => game.checked[t.id]).length;
  const civ = getCivilization(game.setup.civId);

  return (
    <main className="container">
      <div className="row">
        <h1 style={{ margin: 0 }}>{game.name}</h1>
        <div className="spacer" />
        <Link href="/" className="btn">
          ← 一覧
        </Link>
      </div>
      <p className="meta">
        {civ?.name ?? game.setup.civId} ・{" "}
        {game.setup.victories.map((v) => VICTORY_LABELS[v]).join("/")}勝利 ・{" "}
        {RULESET_LABELS[game.setup.ruleset]} ・ {SPEED_LABELS[game.setup.speed]}
      </p>
      <ProgressBar done={done} total={all.length} />

      {GAME_PHASES.map((phase) => (
        <PhaseSection
          key={phase}
          phase={phase}
          tasks={tasks[phase]}
          game={game}
          speed={game.setup.speed}
          onToggle={handleToggle}
          onNote={handleNote}
        />
      ))}

      <p className="hint" style={{ marginTop: "2rem" }}>
        タスクのタイトルをクリックすると解説とメモが開きます。目安ターンは
        {SPEED_LABELS[game.setup.speed]}スピードでの概算です。
        {civ && (
          <>
            {" "}
            {civ.name}の詳細は <Link href={`/wiki/civ/${civ.id}`}>wiki</Link>{" "}
            を参照。
          </>
        )}
      </p>
    </main>
  );
}
