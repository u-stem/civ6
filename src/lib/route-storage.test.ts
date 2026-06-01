import { describe, expect, test } from "bun:test";
import { parseSessions, type RouteSession } from "./route-storage";

const valid: RouteSession = {
  id: "s1",
  name: "セッション1",
  routeId: "babylon-culture",
  createdAt: "2026-06-01T00:00:00.000Z",
  state: { turn: 12, counters: { slinger: 3 }, flags: { "tech.mining": true } },
};

describe("parseSessions", () => {
  test("null は空配列", () => {
    expect(parseSessions(null)).toEqual([]);
  });

  test("不正な JSON は空配列", () => {
    expect(parseSessions("{x")).toEqual([]);
  });

  test("壊れた要素は除外し正常な要素を残す", () => {
    const raw = JSON.stringify([valid, { id: "broken" }]);
    expect(parseSessions(raw)).toHaveLength(1);
  });

  test("正常な配列を復元する", () => {
    expect(parseSessions(JSON.stringify([valid]))[0]?.state.turn).toBe(12);
  });
});
