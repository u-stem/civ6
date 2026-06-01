import type { GamePhase, GameSetup, TaskFragment } from "./schema";
import { GAME_PHASES, RULESET_RANK } from "./schema";

export type SynthesizedTasks = Record<GamePhase, TaskFragment[]>;

// 1 つのタスク断片がゲーム構成にマッチするか判定する。
export function matchesSetup(
  fragment: TaskFragment,
  setup: GameSetup,
): boolean {
  const { applies } = fragment;

  if (applies.victories !== "any") {
    const overlap = applies.victories.some((v) => setup.victories.includes(v));
    if (!overlap) return false;
  }

  if (applies.civs && !applies.civs.includes(setup.civId)) return false;

  if (
    applies.minRuleset &&
    RULESET_RANK[setup.ruleset] < RULESET_RANK[applies.minRuleset]
  ) {
    return false;
  }

  if (
    applies.requiresModes &&
    !applies.requiresModes.every((m) => setup.modes.includes(m))
  ) {
    return false;
  }

  return true;
}

function compareFragments(a: TaskFragment, b: TaskFragment): number {
  if (a.priority !== b.priority) return a.priority - b.priority;
  const ta = a.targetTurnStandard ?? Number.POSITIVE_INFINITY;
  const tb = b.targetTurnStandard ?? Number.POSITIVE_INFINITY;
  return ta - tb;
}

// ゲーム構成にマッチする断片を抽出し、重複排除・フェーズ分け・整列して返す。
export function synthesize(
  setup: GameSetup,
  fragments: TaskFragment[],
): SynthesizedTasks {
  const seen = new Set<string>();
  const result: SynthesizedTasks = { early: [], mid: [], late: [] };

  for (const fragment of fragments) {
    if (!matchesSetup(fragment, setup)) continue;
    if (seen.has(fragment.id)) continue;
    seen.add(fragment.id);
    result[fragment.phase].push(fragment);
  }

  for (const phase of GAME_PHASES) {
    result[phase].sort(compareFragments);
  }

  return result;
}
