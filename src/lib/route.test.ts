import { describe, expect, test } from "bun:test";
import {
  activeBranches,
  currentPhase,
  evaluateWarnings,
  filterRoute,
  type GameState,
  isDone,
  laneProgress,
  meetsRuleset,
  type Route,
  visibleCounters,
  visibleFlags,
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
  branches: [
    {
      id: "b1",
      label: "分岐A",
      detail: "",
      when: (s) => s.flags["ai.adjacent"] === true,
      nodes: [],
    },
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

describe("activeBranches", () => {
  test("条件を満たす分岐だけ active", () => {
    const s = makeState({ flags: { "ai.adjacent": true } });
    expect(activeBranches(route, s).map((b) => b.id)).toEqual(["b1"]);
  });

  test("満たさなければ active なし", () => {
    expect(activeBranches(route, makeState())).toHaveLength(0);
  });
});

describe("visibleCounters / visibleFlags", () => {
  const gated: Route = {
    ...route,
    counters: [
      { key: "slinger", label: "投石兵" }, // 常時(relevant 未指定)
      {
        key: "crossbow",
        label: "弩兵",
        relevant: (s) => s.flags["tech.machinery"] === true, // 機械後のみ
      },
    ],
    flags: [
      { key: "tech.machinery", label: "機械" }, // 常時
      {
        key: "hero",
        label: "偉人",
        relevant: (s) => s.turn >= 50, // 50ターン以降のみ
      },
    ],
  };

  test("relevant 未指定は常に表示", () => {
    expect(visibleCounters(gated, makeState()).map((c) => c.key)).toContain(
      "slinger",
    );
    expect(visibleFlags(gated, makeState()).map((f) => f.key)).toContain(
      "tech.machinery",
    );
  });

  test("未解放のカウンターは隠れる", () => {
    expect(visibleCounters(gated, makeState()).map((c) => c.key)).not.toContain(
      "crossbow",
    );
  });

  test("条件を満たすと表示される", () => {
    const s = makeState({ flags: { "tech.machinery": true } });
    expect(visibleCounters(gated, s).map((c) => c.key)).toContain("crossbow");
  });

  test("フラグも relevant で出し分ける", () => {
    expect(
      visibleFlags(gated, makeState({ turn: 1 })).map((f) => f.key),
    ).not.toContain("hero");
    expect(
      visibleFlags(gated, makeState({ turn: 60 })).map((f) => f.key),
    ).toContain("hero");
  });
});

describe("meetsRuleset", () => {
  test("min 未指定は全ルールセットで true", () => {
    expect(meetsRuleset(undefined, "base")).toBe(true);
    expect(meetsRuleset(undefined, "gathering-storm")).toBe(true);
  });

  test("active が min 以上なら true", () => {
    expect(meetsRuleset("gathering-storm", "gathering-storm")).toBe(true);
    expect(meetsRuleset("rise-and-fall", "gathering-storm")).toBe(true);
  });

  test("active が min 未満なら false", () => {
    expect(meetsRuleset("gathering-storm", "rise-and-fall")).toBe(false);
    expect(meetsRuleset("rise-and-fall", "base")).toBe(false);
  });
});

describe("filterRoute", () => {
  const gated: Route = {
    ...route,
    nodes: [
      ...route.nodes,
      {
        type: "conditional",
        id: "c-gs",
        lane: "civic",
        label: "GS専用",
        trigger: "",
        detail: "",
        minRuleset: "gathering-storm",
      },
    ],
    warnings: [
      ...route.warnings,
      {
        id: "w-gs",
        severity: "warn",
        when: () => true,
        message: "GS警告",
        minRuleset: "gathering-storm",
      },
    ],
    branches: [
      {
        id: "b-gs",
        label: "GS分岐",
        detail: "",
        when: () => true,
        nodes: [],
        minRuleset: "gathering-storm",
      },
      {
        id: "b-mixed",
        label: "混在分岐",
        detail: "",
        when: () => true,
        nodes: [
          {
            type: "conditional",
            id: "c-mixed-gs",
            lane: "production",
            label: "内側GS",
            trigger: "",
            detail: "",
            minRuleset: "gathering-storm",
          },
          {
            type: "conditional",
            id: "c-mixed-base",
            lane: "production",
            label: "内側base",
            trigger: "",
            detail: "",
          },
        ],
      },
    ],
  };

  test("R&F では GS専用ノード/警告/分岐を除外する", () => {
    const f = filterRoute(gated, "rise-and-fall");
    expect(f.nodes.map((n) => n.id)).not.toContain("c-gs");
    expect(f.warnings.map((w) => w.id)).not.toContain("w-gs");
    expect(f.branches.map((b) => b.id)).not.toContain("b-gs");
  });

  test("R&F では分岐内の GS専用ノードだけ除外し base ノードは残す", () => {
    const f = filterRoute(gated, "rise-and-fall");
    const mixed = f.branches.find((b) => b.id === "b-mixed");
    expect(mixed?.nodes.map((n) => n.id)).toEqual(["c-mixed-base"]);
  });

  test("GS では全要素を残す", () => {
    const f = filterRoute(gated, "gathering-storm");
    expect(f.nodes.map((n) => n.id)).toContain("c-gs");
    expect(f.branches.map((b) => b.id)).toContain("b-gs");
  });
});
