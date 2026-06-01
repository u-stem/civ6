import type { Civilization } from "@/lib/schema";

// バビロン(New Frontier Pass / バビロン・パック)。
// 出典(2026-06 時点で確認):
// - Babylonian (Civ6) Fandom, pcgamesn, screenrant: 文明特性 Enuma Anu Enlil
// - Sabum Kibittum (Civ6) Fandom / civilopedia: UU 仕様
// - Hammurabi 指導者ページ civilopedia(原文) / Fandom: 能力・アジェンダ
export const babylon = {
  id: "babylon",
  name: "バビロン",
  ability: {
    name: "エヌマ・アヌ・エンリル",
    description:
      "ひらめき(技術ブースト)を獲得すると、その技術を前提技術なしで即座に完全解禁する。代償として1ターンあたりの科学産出が50%減少する。天啓(社会制度ブースト)と文化による社会制度の進行は通常どおりのため、文化路線とは相性が良い。",
  },
  leaders: [
    {
      id: "hammurabi",
      name: "ハンムラビ",
      ability: {
        name: "ニヌ・イル・シルム",
        description:
          "各専門区域を初めて建設したとき、その区域で現在建設可能な最も生産コストの低い建物を無償で獲得する(政府複合施設を除く)。それ以外の区域を初めて建設したときは使節を1つ獲得する。",
      },
      agenda: {
        name: "文明のゆりかご",
        description:
          "あらゆる種類の区域を建てようとし、同じように振る舞う文明を好む。一種類の区域に偏る、または全種類の区域を建てない文明を嫌う。",
      },
    },
  ],
  uniqueUnits: [
    {
      name: "サブム・キビットゥム",
      description:
        "太古の近接ユニット(他ユニットを置換しない)。戦闘力17(戦士より3低い)、移動力3・視界3。重騎兵・軽騎兵級ユニットに対して戦闘力+17。早期の偵察と対騎兵防衛に優れる。",
    },
  ],
  uniqueInfrastructure: [
    {
      name: "パルグム",
      replaces: "水車小屋",
      description:
        "河川に隣接する都市にのみ建設可能。灌漑(Irrigation)で解禁。淡水タイルの食料を増やし、生産力と住宅を追加する。",
    },
  ],
} satisfies Civilization;
