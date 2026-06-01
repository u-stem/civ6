import { describe, expect, test } from "bun:test";
import { estimateTurn } from "./speed";

describe("estimateTurn", () => {
  test("standard は目安ターンをそのまま返す", () => {
    expect(estimateTurn(30, "standard")).toBe(30);
  });

  test("online は標準より短いターンになる", () => {
    expect(estimateTurn(30, "online")).toBeLessThan(30);
  });

  test("marathon は標準より長いターンになる", () => {
    expect(estimateTurn(30, "marathon")).toBeGreaterThan(30);
  });

  test("最低でも 1 ターンを返す", () => {
    expect(estimateTurn(1, "online")).toBe(1);
  });
});
