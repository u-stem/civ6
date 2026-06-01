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

// タスク断片の適用条件。
export const AppliesSchema = z.object({
  // 対象勝利条件。"any" は勝利条件非依存(内政基盤など)。
  victories: z.union([z.array(VictoryTypeSchema), z.literal("any")]),
  // 文明限定。省略時は全文明汎用。
  civs: z.array(z.string()).optional(),
  // この拡張以上で出現(総督・忠誠心など R&F 要素の分岐)。
  minRuleset: RulesetSchema.optional(),
  // 特定モード前提。
  requiresModes: z.array(GameModeSchema).optional(),
});
export type Applies = z.infer<typeof AppliesSchema>;

// ルールベース合成の最小単位。
export const TaskFragmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  detail: z.string().optional(),
  phase: GamePhaseSchema,
  applies: AppliesSchema,
  priority: z.number(),
  targetEra: EraSchema.optional(),
  // 標準スピードでのおおよその目安ターン。表示時に speed.ts で各スピードへ換算する。
  targetTurnStandard: z.number().int().positive().optional(),
  dependsOn: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});
export type TaskFragment = z.infer<typeof TaskFragmentSchema>;

// 文明・指導者(wiki / セットアップ用)。
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

// ユーザーが選ぶゲーム構成。
export const GameSetupSchema = z.object({
  civId: z.string(),
  leaderId: z.string(),
  victories: z.array(VictoryTypeSchema).min(1),
  ruleset: RulesetSchema,
  speed: GameSpeedSchema,
  modes: z.array(GameModeSchema),
});
export type GameSetup = z.infer<typeof GameSetupSchema>;

// 保存される 1 ゲーム(進捗込み)。
export const SavedGameSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  setup: GameSetupSchema,
  checked: z.record(z.string(), z.boolean()),
  notes: z.record(z.string(), z.string()).optional(),
});
export type SavedGame = z.infer<typeof SavedGameSchema>;
