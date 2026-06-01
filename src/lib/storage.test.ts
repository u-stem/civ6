import { describe, expect, test } from "bun:test";
import type { SavedGame } from "./schema";
import { parseSavedGames } from "./storage";

const validGame: SavedGame = {
  id: "g1",
  name: "テストゲーム",
  createdAt: "2026-06-01T00:00:00.000Z",
  setup: {
    civId: "babylon",
    leaderId: "hammurabi",
    victories: ["culture"],
    ruleset: "rise-and-fall",
    speed: "online",
    modes: [],
  },
  checked: { t1: true },
};

describe("parseSavedGames", () => {
  test("null は空配列を返す", () => {
    expect(parseSavedGames(null)).toEqual([]);
  });

  test("不正な JSON は空配列を返す", () => {
    expect(parseSavedGames("{not json")).toEqual([]);
  });

  test("配列でない JSON は空配列を返す", () => {
    expect(parseSavedGames('{"a":1}')).toEqual([]);
  });

  test("壊れた要素は除外し正常な要素だけ残す", () => {
    const raw = JSON.stringify([validGame, { id: "broken" }]);
    expect(parseSavedGames(raw)).toHaveLength(1);
  });

  test("正常な配列はそのまま復元する", () => {
    const raw = JSON.stringify([validGame]);
    expect(parseSavedGames(raw)[0]?.id).toBe("g1");
  });
});
