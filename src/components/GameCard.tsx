"use client";

import { ALL_FRAGMENTS, getCivilization } from "@/data";
import { RULESET_LABELS, SPEED_LABELS, VICTORY_LABELS } from "@/data/labels";
import type { SavedGame } from "@/lib/schema";
import { synthesize } from "@/lib/synthesize";
import { ProgressBar } from "./ProgressBar";

export function GameCard({
  game,
  onOpen,
  onDelete,
}: {
  game: SavedGame;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const civ = getCivilization(game.setup.civId);
  const tasks = synthesize(game.setup, ALL_FRAGMENTS);
  const all = [...tasks.early, ...tasks.mid, ...tasks.late];
  const done = all.filter((t) => game.checked[t.id]).length;

  return (
    <div className="card">
      <h3>{game.name}</h3>
      <div className="meta">
        {civ?.name ?? game.setup.civId} ・{" "}
        {game.setup.victories.map((v) => VICTORY_LABELS[v]).join("/")}勝利 ・{" "}
        {RULESET_LABELS[game.setup.ruleset]} ・ {SPEED_LABELS[game.setup.speed]}
      </div>
      <ProgressBar done={done} total={all.length} />
      <div className="row" style={{ marginTop: "0.7rem" }}>
        <button type="button" className="btn btn-primary" onClick={onOpen}>
          開く
        </button>
        <div className="spacer" />
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            if (confirm(`「${game.name}」を削除しますか？`)) onDelete();
          }}
        >
          削除
        </button>
      </div>
    </div>
  );
}
