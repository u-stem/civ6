import { z } from "zod";

// ルート伴走(状態機械)のドメイン型とエンジン。
// Route は warning/done に純粋関数を含むため Zod ではなく TS で定義する。
// 永続化する GameState のみ Zod で検証する。

export const LANES = ["production", "tech", "civic", "military"] as const;
export type Lane = (typeof LANES)[number];

export const LANE_LABELS: Record<Lane, string> = {
  production: "生産",
  tech: "技術",
  civic: "社会制度",
  military: "軍事・外交",
};

// プレイヤーが画面で入力する現在のゲーム状態。
export const GameStateSchema = z.object({
  turn: z.number().int().nonnegative(),
  counters: z.record(z.string(), z.number()),
  flags: z.record(z.string(), z.boolean()),
});
export type GameState = z.infer<typeof GameStateSchema>;

export function emptyState(): GameState {
  return { turn: 1, counters: {}, flags: {} };
}

// counters/flags は存在しないキーを 0 / false として安全に読む。
export function counter(state: GameState, key: string): number {
  return state.counters[key] ?? 0;
}
export function flag(state: GameState, key: string): boolean {
  return state.flags[key] ?? false;
}

// 順序付きの手。done は GameState の述語。
export type SequenceNode = {
  type: "sequence";
  id: string;
  lane: Lane;
  label: string;
  detail: string;
  done: (s: GameState) => boolean;
};

// 順序でなく条件で随時発火する手。trigger は人が読む条件テキスト。
export type ConditionalNode = {
  type: "conditional";
  id: string;
  lane: Lane;
  label: string;
  trigger: string;
  detail: string;
};

// 手ではなく原則・役割の判断軸。
export type PrincipleNode = {
  type: "principle";
  id: string;
  lane: Lane;
  label: string;
  body: string;
};

export type RouteNode = SequenceNode | ConditionalNode | PrincipleNode;

export type Warning = {
  id: string;
  severity: "danger" | "warn";
  when: (s: GameState) => boolean;
  message: string;
};

export type Phase = {
  id: string;
  fromTurn: number;
  label: string;
  hint: string;
};

// 状態入力UIが宣言的に使う、このルートで扱うカウンター/フラグ。
export type CounterDef = { key: string; label: string };
export type FlagDef = { key: string; label: string };

export type Route = {
  id: string;
  name: string;
  civId: string;
  victory: string;
  premise: string;
  counters: CounterDef[];
  flags: FlagDef[];
  nodes: RouteNode[];
  warnings: Warning[];
  phases: Phase[];
};

// --- エンジン(純粋関数) ---

export function evaluateWarnings(route: Route, state: GameState): Warning[] {
  return route.warnings.filter((w) => w.when(state));
}

export function isDone(node: RouteNode, state: GameState): boolean {
  return node.type === "sequence" ? node.done(state) : false;
}

// 現在のフェーズ(turn 以下で最大の fromTurn)。
export function currentPhase(
  route: Route,
  state: GameState,
): Phase | undefined {
  const sorted = [...route.phases].sort((a, b) => a.fromTurn - b.fromTurn);
  let current: Phase | undefined;
  for (const p of sorted) {
    if (state.turn >= p.fromTurn) current = p;
  }
  return current;
}

export function sequenceNodes(route: Route, lane: Lane): SequenceNode[] {
  return route.nodes.filter(
    (n): n is SequenceNode => n.type === "sequence" && n.lane === lane,
  );
}

export function conditionalNodes(route: Route, lane: Lane): ConditionalNode[] {
  return route.nodes.filter(
    (n): n is ConditionalNode => n.type === "conditional" && n.lane === lane,
  );
}

export function principleNodes(route: Route): PrincipleNode[] {
  return route.nodes.filter((n): n is PrincipleNode => n.type === "principle");
}

// あるレーンの sequence の進捗(完了数 / 総数)。
export function laneProgress(
  route: Route,
  lane: Lane,
  state: GameState,
): { done: number; total: number } {
  const seq = sequenceNodes(route, lane);
  return { done: seq.filter((n) => n.done(state)).length, total: seq.length };
}
