import type { Civilization } from "@/lib/schema";

// バビロン(New Frontier Pass / バビロン・パック)。
// 名称・効果は Civilopedia 日本語版(公式準拠)で確認した正式表記。
//   出典: https://www.civilopedia.net/ja/ の civilization_babylon / leader_hammurabi /
//          unit_babylonian_sabum_kibittum、および公式サイト(civilization.2k.com/ja-JP)。
export const babylon = {
  id: "babylon",
  name: "バビロン",
  ability: {
    name: "エヌマ・アヌ・エンリル",
    description:
      "ひらめき(技術ブースト)を得ると、その技術の研究に必要な科学力をすべて獲得し、即座に解禁する。代償として毎ターンの科学力の産出が50%減少する。社会制度(文化)の進行はこの影響を受けない。",
  },
  leaders: [
    {
      id: "hammurabi",
      name: "ハンムラビ",
      ability: {
        name: "ニヌ・イル・シルム",
        description:
          "各専門区域を初めて建設すると、その時点でその区域に建設できる建造物のうち生産コストが最も低いものを無償で得る(政府複合施設を除く)。それ以外の区域を初めて建設した場合は、代表団を1つ得る。",
      },
      agenda: {
        name: "文明のゆりかご",
        description:
          "多様な区域を築きたがり、同じようにする文明を好む。1種類の区域に集中する文明や、建設できるのに建設していない区域の種類がある文明を嫌う。",
      },
    },
  ],
  uniqueUnits: [
    {
      name: "サブン・キビタム",
      description:
        "バビロン固有の太古の近接戦闘ユニット(他ユニットを置換しない)。戦闘力17、移動力3、視界3。重騎兵・軽騎兵のクラスを持つユニットに対して戦闘力+17。早期の偵察と対騎兵防衛に優れ、後に剣士などへアップグレードできる。",
    },
  ],
  uniqueInfrastructure: [
    {
      name: "パルグム",
      replaces: "水車小屋",
      description:
        "灌漑で解禁される、水車小屋に代わる建造物。生産力と住宅を追加する。都市が川に隣接している場合は、真水タイルから得られる食料も増加する。",
    },
  ],
} satisfies Civilization;
