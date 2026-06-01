import Link from "next/link";
import { CIVILIZATIONS, VICTORY_GUIDES } from "@/data";
import { VICTORY_LABELS } from "@/data/labels";
import { VICTORY_TYPES } from "@/lib/schema";

export default function WikiIndex() {
  return (
    <main className="container">
      <h1>wiki</h1>

      <h2>文明</h2>
      {CIVILIZATIONS.map((c) => (
        <div className="card" key={c.id}>
          <h3>
            <Link href={`/wiki/civ/${c.id}`}>{c.name}</Link>
          </h3>
          <p className="meta">
            {c.ability.name} ／ 指導者：
            {c.leaders.map((l) => l.name).join("、")}
          </p>
        </div>
      ))}

      <h2>勝利条件</h2>
      {VICTORY_TYPES.map((v) => {
        const guide = VICTORY_GUIDES[v];
        return (
          <div className="card" key={v}>
            <h3>{VICTORY_LABELS[v]}勝利</h3>
            {guide ? (
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{guide}</p>
            ) : (
              <p className="hint" style={{ margin: 0 }}>
                準備中
              </p>
            )}
          </div>
        );
      })}
    </main>
  );
}
