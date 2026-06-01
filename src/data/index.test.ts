import { describe, expect, test } from "bun:test";
import type { GameSetup } from "@/lib/schema";
import { synthesize } from "@/lib/synthesize";
import { ALL_FRAGMENTS } from "./index";

const babylonCulture: GameSetup = {
  civId: "babylon",
  leaderId: "hammurabi",
  victories: ["culture"],
  ruleset: "rise-and-fall",
  speed: "online",
  modes: [],
};

describe("バビロン×文化×文明の興亡 の合成", () => {
  test("序盤にバビロン専用の劇場広場タスクが出る", () => {
    const result = synthesize(babylonCulture, ALL_FRAGMENTS);
    const ids = result.early.map((f) => f.id);
    expect(ids).toContain("culture-early-theater-babylon");
  });

  test("GS専用のキュレーターは文明の興亡では出ない", () => {
    const result = synthesize(babylonCulture, ALL_FRAGMENTS);
    const ids = result.late.map((f) => f.id);
    expect(ids).not.toContain("culture-late-curator");
  });

  test("嵐の訪れ環境ならキュレーターが出る", () => {
    const gs: GameSetup = { ...babylonCulture, ruleset: "gathering-storm" };
    const result = synthesize(gs, ALL_FRAGMENTS);
    const ids = result.late.map((f) => f.id);
    expect(ids).toContain("culture-late-curator");
  });

  test("3フェーズすべてにタスクが存在する", () => {
    const result = synthesize(babylonCulture, ALL_FRAGMENTS);
    const counts = [result.early.length, result.mid.length, result.late.length];
    expect(counts.every((n) => n > 0)).toBe(true);
  });
});
