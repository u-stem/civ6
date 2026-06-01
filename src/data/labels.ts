import type {
  Era,
  GameMode,
  GamePhase,
  GameSpeed,
  Ruleset,
  VictoryType,
} from "@/lib/schema";

// 表示用の日本語ラベル(用語は日本語特化)。enum を網羅し型で抜けを防ぐ。

export const VICTORY_LABELS: Record<VictoryType, string> = {
  culture: "文化",
  science: "科学",
  religion: "宗教",
  domination: "制覇",
  diplomatic: "外交",
};

export const PHASE_LABELS: Record<GamePhase, string> = {
  early: "序盤",
  mid: "中盤",
  late: "終盤",
};

export const ERA_LABELS: Record<Era, string> = {
  ancient: "古代",
  classical: "古典",
  medieval: "中世",
  renaissance: "ルネサンス",
  industrial: "産業",
  modern: "現代",
  atomic: "原子力",
  information: "情報",
};

export const RULESET_LABELS: Record<Ruleset, string> = {
  base: "ベースゲーム",
  "rise-and-fall": "文明の興亡",
  "gathering-storm": "嵐の訪れ",
};

export const SPEED_LABELS: Record<GameSpeed, string> = {
  online: "オンライン",
  quick: "クイック",
  standard: "標準",
  epic: "エピック",
  marathon: "マラソン",
};

export const MODE_LABELS: Record<GameMode, string> = {
  "secret-societies": "秘密結社",
  "barbarian-clans": "蛮族の部族",
  "dramatic-ages": "劇的な時代",
  "heroes-legends": "英雄と伝説",
  "monopolies-corporations": "独占と企業",
  "tech-civic-shuffle": "テクノロジーと社会制度のシャッフル",
  apocalypse: "黙示録",
  "zombie-defense": "ゾンビ襲来",
};
