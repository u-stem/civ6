import { describe, expect, test } from "bun:test";
import type { GameSetup, TaskFragment } from "./schema";
import { matchesSetup, synthesize } from "./synthesize";

function makeSetup(overrides: Partial<GameSetup> = {}): GameSetup {
  return {
    civId: "babylon",
    leaderId: "hammurabi",
    victories: ["culture"],
    ruleset: "rise-and-fall",
    speed: "online",
    modes: [],
    ...overrides,
  };
}

function makeFragment(overrides: Partial<TaskFragment> = {}): TaskFragment {
  return {
    id: "f1",
    title: "タスク",
    phase: "early",
    applies: { victories: "any" },
    priority: 100,
    ...overrides,
  };
}

describe("matchesSetup", () => {
  test("victories=any は常にマッチする", () => {
    const result = matchesSetup(
      makeFragment({ applies: { victories: "any" } }),
      makeSetup(),
    );
    expect(result).toBe(true);
  });

  test("勝利条件が交差すればマッチする", () => {
    const fragment = makeFragment({ applies: { victories: ["culture"] } });
    expect(matchesSetup(fragment, makeSetup({ victories: ["culture"] }))).toBe(
      true,
    );
  });

  test("勝利条件が交差しなければマッチしない", () => {
    const fragment = makeFragment({ applies: { victories: ["science"] } });
    expect(matchesSetup(fragment, makeSetup({ victories: ["culture"] }))).toBe(
      false,
    );
  });

  test("文明限定は他文明を除外する", () => {
    const fragment = makeFragment({
      applies: { victories: "any", civs: ["rome"] },
    });
    expect(matchesSetup(fragment, makeSetup({ civId: "babylon" }))).toBe(false);
  });

  test("minRuleset 未満のルールセットでは除外する", () => {
    const fragment = makeFragment({
      applies: { victories: "any", minRuleset: "gathering-storm" },
    });
    expect(
      matchesSetup(fragment, makeSetup({ ruleset: "rise-and-fall" })),
    ).toBe(false);
  });

  test("minRuleset 以上のルールセットでは出現する", () => {
    const fragment = makeFragment({
      applies: { victories: "any", minRuleset: "rise-and-fall" },
    });
    expect(
      matchesSetup(fragment, makeSetup({ ruleset: "rise-and-fall" })),
    ).toBe(true);
  });

  test("requiresModes を満たさなければ除外する", () => {
    const fragment = makeFragment({
      applies: { victories: "any", requiresModes: ["secret-societies"] },
    });
    expect(matchesSetup(fragment, makeSetup({ modes: [] }))).toBe(false);
  });
});

describe("synthesize", () => {
  test("フェーズごとに振り分ける", () => {
    const fragments = [
      makeFragment({ id: "a", phase: "early" }),
      makeFragment({ id: "b", phase: "late" }),
    ];
    const result = synthesize(makeSetup(), fragments);
    expect(result.early.map((f) => f.id)).toEqual(["a"]);
  });

  test("同一 id は重複排除する", () => {
    const fragments = [
      makeFragment({ id: "dup" }),
      makeFragment({ id: "dup" }),
    ];
    const result = synthesize(makeSetup(), fragments);
    expect(result.early).toHaveLength(1);
  });

  test("未実装勝利のみのタスクはフィルタされる", () => {
    const fragments = [
      makeFragment({ id: "sci", applies: { victories: ["science"] } }),
    ];
    const result = synthesize(makeSetup({ victories: ["culture"] }), fragments);
    expect(result.early).toHaveLength(0);
  });

  test("priority 昇順で並ぶ", () => {
    const fragments = [
      makeFragment({ id: "late", priority: 200 }),
      makeFragment({ id: "early", priority: 50 }),
    ];
    const result = synthesize(makeSetup(), fragments);
    expect(result.early.map((f) => f.id)).toEqual(["early", "late"]);
  });

  test("priority 同値なら targetTurnStandard で並ぶ", () => {
    const fragments = [
      makeFragment({ id: "t20", priority: 100, targetTurnStandard: 20 }),
      makeFragment({ id: "t5", priority: 100, targetTurnStandard: 5 }),
    ];
    const result = synthesize(makeSetup(), fragments);
    expect(result.early.map((f) => f.id)).toEqual(["t5", "t20"]);
  });
});
