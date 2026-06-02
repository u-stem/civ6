import { z } from "zod";
import { RULESET_RANK, type Ruleset } from "./schema";

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
// reached: 一度 done に到達した sequence ノードの記録。カウンターを減らす操作
// (投石兵を倒す・弓兵を弩兵化する等)で完了が巻き戻らないようラッチする。
// 旧セッション(reached 無し)は default({}) で後方互換に復元する。
export const GameStateSchema = z.object({
  turn: z.number().int().nonnegative(),
  counters: z.record(z.string(), z.number()),
  flags: z.record(z.string(), z.boolean()),
  reached: z.record(z.string(), z.boolean()).default({}),
});
export type GameState = z.infer<typeof GameStateSchema>;

export function emptyState(): GameState {
  return { turn: 1, counters: {}, flags: {}, reached: {} };
}

// counters/flags は存在しないキーを 0 / false として安全に読む。
export function counter(state: GameState, key: string): number {
  return state.counters[key] ?? 0;
}
export function flag(state: GameState, key: string): boolean {
  return state.flags[key] ?? false;
}

// ルールセット(拡張)で限定される要素が持つ最低ルールセット。
// 未指定なら無印(base)= 全ルールセットで表示。
export type RulesetGated = { minRuleset?: Ruleset };

// 順序付きの手。done は GameState の述語。
export type SequenceNode = RulesetGated & {
  type: "sequence";
  id: string;
  lane: Lane;
  label: string;
  detail: string;
  done: (s: GameState) => boolean;
};

// 順序でなく条件で随時発火する手。trigger は人が読む条件テキスト。
export type ConditionalNode = RulesetGated & {
  type: "conditional";
  id: string;
  lane: Lane;
  label: string;
  trigger: string;
  detail: string;
};

// 手ではなく原則・役割の判断軸。
export type PrincipleNode = RulesetGated & {
  type: "principle";
  id: string;
  lane: Lane;
  label: string;
  body: string;
};

export type RouteNode = SequenceNode | ConditionalNode | PrincipleNode;

export type Warning = RulesetGated & {
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
// relevant: 現在の状態でこの入力が意味を持つか。未指定は常に表示。
// 未解放の段階で出さない・陳腐化したら消す、を宣言的に表現する。
// RulesetGated: 拡張限定の入力は filterRoute で除外する。
export type CounterDef = RulesetGated & {
  key: string;
  label: string;
  relevant?: (s: GameState) => boolean;
};
export type FlagDef = RulesetGated & {
  key: string;
  label: string;
  relevant?: (s: GameState) => boolean;
};

// 状態に応じて活性化する分岐(対AI方針など)。active なときだけその手を取る。
export type Branch = RulesetGated & {
  id: string;
  label: string;
  detail: string;
  when: (s: GameState) => boolean;
  nodes: RouteNode[];
};

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
  branches: Branch[];
};

// --- ルールセット(拡張)フィルタ ---

// active なルールセットが min を満たす(同等以上)か。min 未指定は無印扱いで常に true。
export function meetsRuleset(
  min: Ruleset | undefined,
  active: Ruleset,
): boolean {
  return RULESET_RANK[min ?? "base"] <= RULESET_RANK[active];
}

// 選択ルールセットで表示すべき要素だけを残したルートを返す。
// 分岐は分岐自体と内側ノードの両方をフィルタする。
export function filterRoute(route: Route, ruleset: Ruleset): Route {
  const ok = <T extends RulesetGated>(x: T): boolean =>
    meetsRuleset(x.minRuleset, ruleset);
  return {
    ...route,
    counters: route.counters.filter(ok),
    flags: route.flags.filter(ok),
    nodes: route.nodes.filter(ok),
    warnings: route.warnings.filter(ok),
    branches: route.branches
      .filter(ok)
      .map((b) => ({ ...b, nodes: b.nodes.filter(ok) })),
  };
}

// --- エンジン(純粋関数) ---

export function evaluateWarnings(route: Route, state: GameState): Warning[] {
  return route.warnings.filter((w) => w.when(state));
}

// 現在の状態で active な分岐。
export function activeBranches(route: Route, state: GameState): Branch[] {
  return route.branches.filter((b) => b.when(state));
}

export function isBranchActive(branch: Branch, state: GameState): boolean {
  return branch.when(state);
}

// 現在の状態で入力する意味があるカウンター/フラグだけを返す。
// relevant 未指定は常に対象。未解放・陳腐化した入力を状態入力UIから外す。
export function visibleCounters(route: Route, state: GameState): CounterDef[] {
  return route.counters.filter((c) => c.relevant?.(state) ?? true);
}
export function visibleFlags(route: Route, state: GameState): FlagDef[] {
  return route.flags.filter((f) => f.relevant?.(state) ?? true);
}

// sequence の完了判定。現在の done 述語が真、または過去に一度到達済み(ラッチ)なら完了。
// カウンターを減らす操作で完了が巻き戻らないよう reached を併用する。
export function isDone(node: RouteNode, state: GameState): boolean {
  if (node.type !== "sequence") return false;
  return node.done(state) || (state.reached[node.id] ?? false);
}

// 現在 done に到達している sequence を reached に焼き付けた新 state を返す。
// commit のたびと、セッション復元直後に通すことで達成を単調増加に保つ。
export function latchReached(route: Route, state: GameState): GameState {
  let reached = state.reached;
  for (const n of route.nodes) {
    if (n.type === "sequence" && !reached[n.id] && n.done(state)) {
      reached = { ...reached, [n.id]: true };
    }
  }
  return reached === state.reached ? state : { ...state, reached };
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

// あるレーンの sequence の進捗(完了数 / 総数)。ラッチを尊重する。
export function laneProgress(
  route: Route,
  lane: Lane,
  state: GameState,
): { done: number; total: number } {
  const seq = sequenceNodes(route, lane);
  return {
    done: seq.filter((n) => isDone(n, state)).length,
    total: seq.length,
  };
}

// ルート全体の sequence の進捗(完了数 / 総数)。ラッチを尊重する。
export function sequenceProgress(
  route: Route,
  state: GameState,
): { done: number; total: number } {
  const seq = route.nodes.filter(
    (n): n is SequenceNode => n.type === "sequence",
  );
  return {
    done: seq.filter((n) => isDone(n, state)).length,
    total: seq.length,
  };
}
