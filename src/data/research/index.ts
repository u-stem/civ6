import { ERAS, type Era, type ResearchNode } from "@/lib/schema";
import { civics } from "./civics";
import { technologies } from "./technologies";

export const TECHNOLOGIES: ResearchNode[] = technologies;
export const CIVICS: ResearchNode[] = civics;
export const ALL_RESEARCH: ResearchNode[] = [...technologies, ...civics];

const NODE_BY_ID = new Map(ALL_RESEARCH.map((n) => [n.id, n]));

export function getNode(id: string): ResearchNode | undefined {
  return NODE_BY_ID.get(id);
}

// ノード群を時代順にグルーピングする(空の時代は除外)。
export function groupByEra(
  nodes: ResearchNode[],
): { era: Era; nodes: ResearchNode[] }[] {
  return ERAS.map((era) => ({
    era,
    nodes: nodes.filter((n) => n.era === era),
  })).filter((group) => group.nodes.length > 0);
}
