import type { Civilization, TaskFragment, VictoryType } from "@/lib/schema";
import { babylon } from "./civilizations/babylon";
import { commonFragments } from "./common/economy";
import { cultureFragments } from "./victories/culture";

// 収録済みの文明。指導者の追加は必要になったら行う。
export const CIVILIZATIONS: Civilization[] = [babylon];

export function getCivilization(id: string): Civilization | undefined {
  return CIVILIZATIONS.find((c) => c.id === id);
}

// 合成エンジンに渡す全タスク断片。
export const ALL_FRAGMENTS: TaskFragment[] = [
  ...commonFragments,
  ...cultureFragments,
];

// セットアップで選択可能な勝利条件(R&F に実在する4種。外交勝利は嵐の訪れ専用のため除く)。
export const IMPLEMENTED_VICTORIES: VictoryType[] = [
  "science",
  "culture",
  "religion",
  "domination",
];

// 勝利条件ごとの概要(wiki 表示用)。全5種を guides.ts で定義。
export { VICTORY_GUIDES } from "./victories/guides";
