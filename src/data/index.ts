import type { Civilization } from "@/lib/schema";
import { babylon } from "./civilizations/babylon";

// 収録済みの文明(wiki 表示用)。指導者の追加は必要になったら行う。
export const CIVILIZATIONS: Civilization[] = [babylon];

export function getCivilization(id: string): Civilization | undefined {
  return CIVILIZATIONS.find((c) => c.id === id);
}

// 勝利条件ごとの概要(wiki 表示用)。
export { VICTORY_GUIDES } from "./victories/guides";
