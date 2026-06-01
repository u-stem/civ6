import type { TaskFragment } from "@/lib/schema";

// 勝利条件に依存しない内政基盤タスク(victories: "any")。
// どの勝利条件を選んでも共通で表示される土台。
export const commonFragments = [
  {
    id: "common-early-settle",
    title: "都市を広げる(開拓者で2〜4都市)",
    detail:
      "序盤は開拓者を出して都市数を確保する。区域・遺産・偉人ポイントの総量は都市数に比例するため、いかなる勝利条件でも拡張が土台になる。淡水(河川)隣接ならバビロンのパルグムも活きる。",
    phase: "early",
    applies: { victories: "any" },
    priority: 10,
    targetEra: "ancient",
    targetTurnStandard: 20,
  },
  {
    id: "common-early-govplaza",
    title: "政府複合施設を建てて総督タイトルを得る",
    detail:
      "政府複合施設(Government Plaza)を完成させると総督タイトルが追加で得られる。文化勝利では総督ピンガラの強化に直結する。文明の興亡ではゲーム開始時に総督タイトルを1つ持っている。",
    phase: "early",
    applies: { victories: "any", minRuleset: "rise-and-fall" },
    priority: 70,
    targetEra: "classical",
    targetTurnStandard: 55,
  },
  {
    id: "common-mid-amenities",
    title: "快適性と住宅を維持し都市を成長させ続ける",
    detail:
      "人口が偉人ポイント・生産力・文化のすべてを底上げする。高級資源・娯楽施設・水道で快適性と住宅を切らさないようにする。",
    phase: "mid",
    applies: { victories: "any" },
    priority: 10,
    targetEra: "medieval",
  },
] satisfies TaskFragment[];
