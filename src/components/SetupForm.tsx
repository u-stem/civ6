"use client";

import { useMemo, useState } from "react";
import { CIVILIZATIONS, IMPLEMENTED_VICTORIES } from "@/data";
import {
  MODE_LABELS,
  RULESET_LABELS,
  SPEED_LABELS,
  VICTORY_LABELS,
} from "@/data/labels";
import {
  GAME_MODES,
  GAME_SPEEDS,
  type GameMode,
  type GameSetup,
  GameSetupSchema,
  RULESETS,
  type Ruleset,
  VICTORY_TYPES,
  type VictoryType,
} from "@/lib/schema";

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

export function SetupForm({
  onCreate,
  onCancel,
}: {
  onCreate: (name: string, setup: GameSetup) => void;
  onCancel: () => void;
}) {
  const [civId, setCivId] = useState(CIVILIZATIONS[0]?.id ?? "babylon");
  const civ = useMemo(() => CIVILIZATIONS.find((c) => c.id === civId), [civId]);
  const [leaderId, setLeaderId] = useState(civ?.leaders[0]?.id ?? "");
  const [victories, setVictories] = useState<VictoryType[]>(["culture"]);
  const [ruleset, setRuleset] = useState<Ruleset>("rise-and-fall");
  const [speed, setSpeed] = useState("online");
  const [modes, setModes] = useState<GameMode[]>([]);
  const [name, setName] = useState("");

  const defaultName = `${civ?.name ?? ""}・${victories
    .map((v) => VICTORY_LABELS[v])
    .join("/")}`;

  function submit() {
    const parsed = GameSetupSchema.safeParse({
      civId,
      leaderId,
      victories,
      ruleset,
      speed,
      modes,
    });
    if (!parsed.success) return;
    onCreate(name.trim() || defaultName, parsed.data);
  }

  return (
    <div className="card">
      <h3>新規ゲーム</h3>

      <div className="field">
        <label htmlFor="civ">文明</label>
        <select
          id="civ"
          value={civId}
          onChange={(e) => {
            setCivId(e.target.value);
            const next = CIVILIZATIONS.find((c) => c.id === e.target.value);
            setLeaderId(next?.leaders[0]?.id ?? "");
          }}
        >
          {CIVILIZATIONS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="leader">指導者</label>
        <select
          id="leader"
          value={leaderId}
          onChange={(e) => setLeaderId(e.target.value)}
        >
          {civ?.leaders.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <span className="field-label">勝利条件（複数可）</span>
        <div className="checks">
          {VICTORY_TYPES.map((v) => {
            const ready = IMPLEMENTED_VICTORIES.includes(v);
            return (
              <label key={v} className={ready ? "" : "disabled"}>
                <input
                  type="checkbox"
                  disabled={!ready}
                  checked={victories.includes(v)}
                  onChange={() => setVictories((prev) => toggle(prev, v))}
                />
                {VICTORY_LABELS[v]}
                {!ready && "（準備中）"}
              </label>
            );
          })}
        </div>
      </div>

      <div className="field">
        <label htmlFor="ruleset">拡張</label>
        <select
          id="ruleset"
          value={ruleset}
          onChange={(e) => {
            const next = RULESETS.find((r) => r === e.target.value);
            if (next) setRuleset(next);
          }}
        >
          {RULESETS.map((r) => (
            <option key={r} value={r}>
              {RULESET_LABELS[r]}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="speed">ゲームスピード</label>
        <select
          id="speed"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
        >
          {GAME_SPEEDS.map((s) => (
            <option key={s} value={s}>
              {SPEED_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <span className="field-label">ゲームモード（任意）</span>
        <div className="checks">
          {GAME_MODES.map((m) => (
            <label key={m}>
              <input
                type="checkbox"
                checked={modes.includes(m)}
                onChange={() => setModes((prev) => toggle(prev, m))}
              />
              {MODE_LABELS[m]}
            </label>
          ))}
        </div>
        <p className="hint">
          現在モード別のタスク補正は未収録です（選択しても標準タスクが表示されます）。
        </p>
      </div>

      <div className="field">
        <label htmlFor="name">ゲーム名</label>
        <input
          id="name"
          type="text"
          placeholder={defaultName}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={submit}
          disabled={victories.length === 0}
        >
          作成
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          キャンセル
        </button>
      </div>
    </div>
  );
}
