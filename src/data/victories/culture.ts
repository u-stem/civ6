import type { TaskFragment } from "@/lib/schema";

// 文化勝利。
// 出典(2026-06 時点で確認):
// - Tourism (Civ6) / Culture victory (Civ6) Fandom, gamerant, thegamer: 勝利条件と観光力ソース
// - Connoisseur / Curator / Pingala (Civ6) Fandom: 総督ピンガラの昇進
//   * 重要: Curator(大著作物の観光力2倍)とロックバンドは「嵐の訪れ(GS)」専用。
//     文明の興亡(R&F)環境では使えないため minRuleset: "gathering-storm" で分離する。

// wiki 表示用の文化勝利の概要。
export const CULTURE_GUIDE = `文化勝利の条件は「自分の外国人観光客(Visiting Tourists)が、他のどの文明の国内観光客(Domestic Tourists)よりも多くなること」。

- 国内観光客: 累計文化100ごとに1人増える。文化が高い文明ほど数が多く、これが他者の文化勝利に対する「防御」になる。
- 外国人観光客: 観光力(Tourism)を蓄積して他文明の国内観光客プールから引き寄せた数。これが文化勝利の「攻撃」。

観光力の主なソース: 大著作物(著述家/芸術家/音楽家/考古学者/殉教者由来)、博物館(遺物・絵画、テーマボーナスで倍化)、文化遺産(古い時代の遺産ほど時代差で観光力が伸びる)、シーサイドリゾート(タイルの魅力に依存)、国立公園、宗教遺物。

外国人観光客の獲得は、相手との交易路・開かれた国境・同じ宗教・同じ政府で加速する。多数の交易商と良好な外交関係が攻めの速度を大きく上げる。

バビロン視点: 科学が50%減でも文化による社会制度の進行は通常どおり。劇場広場・社会制度ツリーを軸にした文化路線は科学ペナルティの影響を受けにくく、ハンムラビの無償建物で区域の立ち上げも速い。`;

export const cultureFragments = [
  // --- 序盤(古代〜古典) ---
  {
    id: "culture-early-monument",
    title: "各都市に記念碑を建てて文化を伸ばす",
    detail:
      "記念碑(Monument)で文化を確保し、社会制度ツリーを進める。文化は国内観光客(防御)も増やす。バビロンは社会制度の進行が通常どおりなので、ここは科学ペナルティの影響を受けない。",
    phase: "early",
    applies: { victories: ["culture"] },
    priority: 10,
    targetEra: "ancient",
    targetTurnStandard: 20,
  },
  {
    id: "culture-early-drama-civic",
    title: "社会制度「演劇と詩」を解禁する",
    detail:
      "劇場広場は社会制度「演劇と詩(Drama and Poetry)」で解禁される。技術ではなく社会制度由来なので、バビロンでも普通の速度で到達できる。",
    phase: "early",
    applies: { victories: ["culture"] },
    priority: 20,
    targetEra: "classical",
    targetTurnStandard: 30,
    dependsOn: ["culture-early-monument"],
  },
  {
    id: "culture-early-theater-babylon",
    title: "劇場広場を建設(ハンムラビの無償建物を活用)",
    detail:
      "専門区域を初めて建設するとニヌ・イル・シルムで最安建物(劇場広場なら円形劇場)が無償。劇場広場は大著作スロットと偉人ポイントの起点になる。早めに各種区域を1つずつ建てて無償建物を回収するのが効率的。",
    phase: "early",
    applies: { victories: ["culture"], civs: ["babylon"] },
    priority: 30,
    targetEra: "classical",
    targetTurnStandard: 35,
    dependsOn: ["culture-early-drama-civic"],
  },
  {
    id: "culture-early-pingala-connoisseur",
    title: "総督ピンガラをコニサーで劇場広場の都市へ配属",
    detail:
      "ピンガラのコニサー(Connoisseur, Lv1)は劇場広場建物の生産+20%、市民1人あたり文化+1。文化生産の中心都市に置く。(文明の興亡で利用可能)",
    phase: "early",
    applies: { victories: ["culture"], minRuleset: "rise-and-fall" },
    priority: 40,
    targetEra: "classical",
    targetTurnStandard: 45,
  },
  {
    id: "culture-early-great-people",
    title: "大著述家・大芸術家ポイントを稼ぐ",
    detail:
      "劇場広場と建物で偉人ポイントを蓄積し、大著述家・大芸術家を獲得する。生み出される大著作物が観光力の主力になる。",
    phase: "early",
    applies: { victories: ["culture"] },
    priority: 50,
    targetEra: "classical",
    targetTurnStandard: 55,
  },

  // --- 中盤(中世〜ルネサンス) ---
  {
    id: "culture-mid-museums",
    title: "美術博物館と考古学博物館を建てる",
    detail:
      "劇場広場に美術博物館(絵画3枠)と考古学博物館(遺物3枠)を建て、大著作物・遺物の収蔵枠を確保する。観光力の器を一気に広げる工程。",
    phase: "mid",
    applies: { victories: ["culture"] },
    priority: 10,
    targetEra: "medieval",
    targetTurnStandard: 90,
  },
  {
    id: "culture-mid-theming",
    title: "テーマボーナスを成立させて観光力を倍化",
    detail:
      "博物館は条件を満たす作品の組み合わせ(例: 異なる作者の同種3作品)でテーマボーナスが付き、観光力が大きく増える。作品の配置を入れ替えて成立させる。",
    phase: "mid",
    applies: { victories: ["culture"] },
    priority: 20,
    targetEra: "renaissance",
    targetTurnStandard: 110,
    dependsOn: ["culture-mid-museums"],
  },
  {
    id: "culture-mid-archaeology",
    title: "考古学者を育成し遺物を発掘する",
    detail:
      "考古学博物館から考古学者を生産し、古戦場・難破船などから遺物(Artifacts)を発掘して博物館に収める。遺物は観光力源かつテーマ成立に使える。",
    phase: "mid",
    applies: { victories: ["culture"] },
    priority: 30,
    targetEra: "renaissance",
    targetTurnStandard: 120,
    dependsOn: ["culture-mid-museums"],
  },
  {
    id: "culture-mid-wonders",
    title: "文化遺産を建設する(古い時代ほど有利)",
    detail:
      "遺産(Wonders)の観光力は、その遺産が登場できる時代からの経過時代に応じて増える(時代ごとに+1)。早い時代に建てた遺産ほど後半に観光力が伸びる。",
    phase: "mid",
    applies: { victories: ["culture"] },
    priority: 40,
    targetEra: "medieval",
    targetTurnStandard: 100,
  },
  {
    id: "culture-mid-trade-open",
    title: "交易路と開かれた国境を全文明と結ぶ",
    detail:
      "相手との交易路・開かれた国境・同じ宗教・同じ政府は、その文明から外国人観光客を引き寄せる速度を上げる。交易商を増やし、良好な外交関係を広く保つ。",
    phase: "mid",
    applies: { victories: ["culture"] },
    priority: 50,
    targetEra: "renaissance",
    targetTurnStandard: 130,
  },
  {
    id: "culture-mid-music",
    title: "大音楽家を確保する",
    detail:
      "ルネサンス以降の大音楽家は劇場広場の音楽枠を埋め、後半は演奏で観光力をまとめて稼げる。偉人ポイント争奪を意識して確保する。",
    phase: "mid",
    applies: { victories: ["culture"] },
    priority: 60,
    targetEra: "renaissance",
    targetTurnStandard: 150,
  },

  // --- 終盤(産業〜情報) ---
  {
    id: "culture-late-seaside",
    title: "シーサイドリゾートを魅力の高い海岸に造成",
    detail:
      "シーサイドリゾートは隣接タイルの魅力に応じた観光力を生む。エッフェル塔などで魅力を底上げすると効果が大きい。海岸都市で量産する。",
    phase: "late",
    applies: { victories: ["culture"] },
    priority: 10,
    targetEra: "industrial",
    targetTurnStandard: 180,
  },
  {
    id: "culture-late-national-park",
    title: "国立公園を造成する",
    detail:
      "自然主義者(Naturalist)で魅力の高いタイル群に国立公園を設け、観光力と快適性を得る。山岳・自然遺産まわりが好適地。",
    phase: "late",
    applies: { victories: ["culture"] },
    priority: 20,
    targetEra: "industrial",
    targetTurnStandard: 190,
  },
  {
    id: "culture-late-policies",
    title: "観光力増幅の政策と修正子を最大化",
    detail:
      "観光力を増やす政策カード(印刷術・自由連盟などの文化系)を挿し、できるだけ多くの文明と同じ政府・宗教・開かれた国境・交易路を維持して外国人観光客の獲得を加速する。",
    phase: "late",
    applies: { victories: ["culture"] },
    priority: 30,
    targetEra: "modern",
    targetTurnStandard: 200,
  },
  {
    id: "culture-late-curator",
    title: "ピンガラをキュレーターに昇進(大著作物の観光力2倍)",
    detail:
      "キュレーター(Curator)は配属都市の大著作物の観光力を2倍にする、文化勝利の決め手。ただし「嵐の訪れ(GS)」専用の昇進で、文明の興亡では利用できない。",
    phase: "late",
    applies: { victories: ["culture"], minRuleset: "gathering-storm" },
    priority: 40,
    targetEra: "modern",
    targetTurnStandard: 210,
  },
  {
    id: "culture-late-rockband",
    title: "ロックバンドで観光力をスパイクさせる",
    detail:
      "ロックバンドは遺産・区域で公演して大量の観光力を一度に稼げる。こちらも「嵐の訪れ(GS)」専用ユニットで、文明の興亡では使えない。",
    phase: "late",
    applies: { victories: ["culture"], minRuleset: "gathering-storm" },
    priority: 50,
    targetEra: "modern",
    targetTurnStandard: 220,
  },
  {
    id: "culture-late-finish",
    title: "外国人観光客で全文明の国内観光客を上回る",
    detail:
      "勝利画面で各文明の国内観光客数を確認し、最も多い相手を超えるまで観光力を伸ばし切る。残り1〜2文明は交易路・開かれた国境・偉人音楽家の演奏で押し込む。",
    phase: "late",
    applies: { victories: ["culture"] },
    priority: 100,
    targetEra: "information",
    targetTurnStandard: 240,
  },
] satisfies TaskFragment[];
