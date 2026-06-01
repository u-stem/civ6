import { describe, expect, test } from "bun:test";
import {
  currentPhase,
  evaluateWarnings,
  type GameState,
  isDone,
  laneProgress,
  type Route,
} from "./route";

function makeState(o: Partial<GameState> = {}): GameState {
  return { turn: 1, counters: {}, flags: {}, ...o };
}

const route: Route = {
  id: "t",
  name: "テスト",
  civId: "babylon",
  victory: "culture",
  premise: "",
  counters: [{ key: "slinger", label: "投石兵" }],
  flags: [{ key: "tech.archery", label: "弓術" }],
  nodes: [
    {
      type: "sequence",
      id: "s1",
      lane: "tech",
      label: "採掘",
      detail: "",
      done: (s) => s.flags["tech.mining"] === true,
    },
    {
      type: "sequence",
      id: "s2",
      lane: "production",
      label: "投石兵3",
      detail: "",
      done: (s) => (s.counters.slinger ?? 0) >= 3,
    },
    {
      type: "conditional",
      id: "c1",
      lane: "production",
      label: "拡張",
      trigger: "条件",
      detail: "",
    },
    {
      type: "principle",
      id: "p1",
      lane: "military",
      label: "原則",
      body: "本文",
    },
  ],
  warnings: [
    {
      id: "w1",
      severity: "danger",
      when: (s) =>
        (s.counters.slinger ?? 0) < 3 && s.flags["tech.archery"] !== true,
      message: "投石兵3未満",
    },
  ],
  phases: [
    { id: "ph1", fromTurn: 1, label: "序盤", hint: "" },
    { id: "ph2", fromTurn: 30, label: "中盤", hint: "" },
  ],
};

describe("evaluateWarnings", () => {
  test("条件を満たすと発火する", () => {
    expect(evaluateWarnings(route, makeState()).map((w) => w.id)).toEqual([
      "w1",
    ]);
  });

  test("条件を外すと消える", () => {
    const s = makeState({ counters: { slinger: 3 } });
    expect(evaluateWarnings(route, s)).toHaveLength(0);
  });
});

describe("isDone", () => {
  test("sequence は done 述語で判定", () => {
    const node = route.nodes[0];
    expect(
      node && isDone(node, makeState({ flags: { "tech.mining": true } })),
    ).toBe(true);
  });

  test("conditional は常に未完扱い", () => {
    const node = route.nodes[2];
    expect(node && isDone(node, makeState())).toBe(false);
  });
});

describe("currentPhase", () => {
  test("turn 1 は序盤", () => {
    expect(currentPhase(route, makeState({ turn: 1 }))?.id).toBe("ph1");
  });

  test("turn 35 は中盤", () => {
    expect(currentPhase(route, makeState({ turn: 35 }))?.id).toBe("ph2");
  });
});

describe("laneProgress", () => {
  test("生産レーンの完了数を数える", () => {
    const s = makeState({ counters: { slinger: 3 } });
    expect(laneProgress(route, "production", s)).toEqual({ done: 1, total: 1 });
  });
});
