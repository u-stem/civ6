import type { Civilization, TaskFragment, VictoryType } from "@/lib/schema";
import { babylon } from "./civilizations/babylon";
import { commonFragments } from "./common/economy";
import { CULTURE_GUIDE, cultureFragments } from "./victories/culture";

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

// データ投入済み(=セットアップで選択可能)の勝利条件。
export const IMPLEMENTED_VICTORIES: VictoryType[] = ["culture"];

// 勝利条件ごとの概要(wiki 表示用)。
export const VICTORY_GUIDES: Partial<Record<VictoryType, string>> = {
  culture: CULTURE_GUIDE,
};
