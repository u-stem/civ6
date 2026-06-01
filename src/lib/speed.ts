import type { GameSpeed } from "./schema";

// 標準スピードを 1.0 とした、各ゲームスピードのおおよそのコスト・進行係数。
// 目安ターンの換算表示にのみ使う概算値(Civ6 のスピード仕様に基づく)。
// online ≈ 1/3、quick ≈ 2/3、epic ≈ 3/2、marathon ≈ 3。
export const SPEED_FACTOR: Record<GameSpeed, number> = {
  online: 0.33,
  quick: 0.67,
  standard: 1,
  epic: 1.5,
  marathon: 3,
};

// 標準スピードでの目安ターンを、指定スピードのおおよそのターンに換算する。
export function estimateTurn(standardTurn: number, speed: GameSpeed): number {
  return Math.max(1, Math.round(standardTurn * SPEED_FACTOR[speed]));
}
