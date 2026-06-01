import { z } from "zod";

// 勝利条件。初期データ投入は culture のみ、列挙は最初から全種定義する。
export const VICTORY_TYPES = [
  "culture",
  "science",
  "religion",
  "domination",
  "diplomatic",
] as const;
export const VictoryTypeSchema = z.enum(VICTORY_TYPES);
export type VictoryType = z.infer<typeof VictoryTypeSchema>;

// ゲーム進行のフェーズ。時代を3区分に丸める。
export const GAME_PHASES = ["early", "mid", "late"] as const;
export const GamePhaseSchema = z.enum(GAME_PHASES);
export type GamePhase = z.infer<typeof GamePhaseSchema>;

// 時代(目安表示用)。
export const ERAS = [
  "ancient",
  "classical",
  "medieval",
  "renaissance",
  "industrial",
  "modern",
  "atomic",
  "information",
] as const;
export const EraSchema = z.enum(ERAS);
export type Era = z.infer<typeof EraSchema>;

// ルールセット(拡張)。minRuleset の充足判定に順序を使う。
export const RULESETS = ["base", "rise-and-fall", "gathering-storm"] as const;
export const RulesetSchema = z.enum(RULESETS);
export type Ruleset = z.infer<typeof RulesetSchema>;

export const RULESET_RANK: Record<Ruleset, number> = {
  base: 0,
  "rise-and-fall": 1,
  "gathering-storm": 2,
};

export const RULESET_LABELS: Record<Ruleset, string> = {
  base: "無印",
  "rise-and-fall": "文明の興亡",
  "gathering-storm": "嵐の訪れ",
};

// ゲームスピード。targetTurn の目安はこのキーで引く。
export const GAME_SPEEDS = [
  "online",
  "quick",
  "standard",
  "epic",
  "marathon",
] as const;
export const GameSpeedSchema = z.enum(GAME_SPEEDS);
export type GameSpeed = z.infer<typeof GameSpeedSchema>;

// 追加ゲームモード。初期は未使用(enum のみ用意)。
export const GAME_MODES = [
  "secret-societies",
  "barbarian-clans",
  "dramatic-ages",
  "heroes-legends",
  "monopolies-corporations",
  "tech-civic-shuffle",
  "apocalypse",
  "zombie-defense",
] as const;
export const GameModeSchema = z.enum(GAME_MODES);
export type GameMode = z.infer<typeof GameModeSchema>;

// 文明・指導者(wiki 用)。
export const UniqueComponentSchema = z.object({
  name: z.string(),
  replaces: z.string().optional(),
  description: z.string(),
});
export type UniqueComponent = z.infer<typeof UniqueComponentSchema>;

const NamedAbilitySchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const LeaderSchema = z.object({
  id: z.string(),
  name: z.string(),
  ability: NamedAbilitySchema,
  agenda: NamedAbilitySchema.optional(),
});
export type Leader = z.infer<typeof LeaderSchema>;

export const CivilizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  ability: NamedAbilitySchema,
  leaders: z.array(LeaderSchema),
  uniqueUnits: z.array(UniqueComponentSchema),
  uniqueInfrastructure: z.array(UniqueComponentSchema),
});
export type Civilization = z.infer<typeof CivilizationSchema>;

// 研究ツリー(テクノロジー / 社会制度)のノード。
export const RESEARCH_KINDS = ["tech", "civic"] as const;
export const ResearchKindSchema = z.enum(RESEARCH_KINDS);
export type ResearchKind = z.infer<typeof ResearchKindSchema>;

export const UNLOCK_TYPES = [
  "unit",
  "building",
  "district",
  "wonder",
  "improvement",
  "project",
  "policy",
  "government",
  "other",
] as const;
export const UnlockTypeSchema = z.enum(UNLOCK_TYPES);
export type UnlockType = z.infer<typeof UnlockTypeSchema>;

export const UnlockSchema = z.object({
  type: UnlockTypeSchema,
  nameEn: z.string(),
  nameJa: z.string(),
});
export type Unlock = z.infer<typeof UnlockSchema>;

export const ResearchNodeSchema = z.object({
  id: z.string(),
  kind: ResearchKindSchema,
  nameEn: z.string(),
  nameJa: z.string(),
  era: EraSchema,
  // 標準スピードでの科学(tech)/文化(civic)コスト。
  cost: z.number().int().nonnegative(),
  // 前提ノード id(同ツリー内)。
  prerequisites: z.array(z.string()),
  // ひらめき(技術)/天啓(社会制度)の発動条件。初期ノードなど無い場合は省略。
  boost: z
    .object({ conditionEn: z.string(), conditionJa: z.string() })
    .optional(),
  unlocks: z.array(UnlockSchema),
});
export type ResearchNode = z.infer<typeof ResearchNodeSchema>;
