import { describe, expect, test } from "bun:test";
import { ALL_RESEARCH, CIVICS, getNode, TECHNOLOGIES } from "./index";

describe("研究ツリーの整合性", () => {
  test("id は全体で重複しない", () => {
    const ids = ALL_RESEARCH.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("すべての前提ノードが実在する", () => {
    const ok = ALL_RESEARCH.every((n) =>
      n.prerequisites.every((p) => getNode(p) !== undefined),
    );
    expect(ok).toBe(true);
  });

  test("前提ノードは同じ種類(tech/civic)を指す", () => {
    const ok = ALL_RESEARCH.every((n) =>
      n.prerequisites.every((p) => getNode(p)?.kind === n.kind),
    );
    expect(ok).toBe(true);
  });

  test("テクノロジーはすべて kind=tech", () => {
    expect(TECHNOLOGIES.every((n) => n.kind === "tech")).toBe(true);
  });

  test("社会制度はすべて kind=civic", () => {
    expect(CIVICS.every((n) => n.kind === "civic")).toBe(true);
  });

  test("テクノロジーは複数の時代にまたがる", () => {
    const eras = new Set(TECHNOLOGIES.map((n) => n.era));
    expect(eras.size).toBeGreaterThanOrEqual(6);
  });
});
