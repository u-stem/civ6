import type { ResearchNode } from "@/lib/schema";

// 社会制度ツリー(文明の興亡基準。GS 固有要素は含まない)。
// 出典(2026-06 時点で確認): CivFanatics https://civfanatics.com/civ6/info/civic/
// 補正方針:
// - 名称・条件はゲーム内日本語訳に依存せず、英語原文から正確に日本語化(英語名 nameEn を併記)。
// - 解禁物は 政府/区域/建物/遺産/ユニット/改善 と代表的な政策カードを収録(政策カードは多数の
//   ため主要なもののみ。網羅は段階的に追補する)。
// - 区域 Government Plaza は文明の興亡では Political Philosophy で解禁されるため補完している。
export const civics = [
  // --- 古代 ---
  {
    id: "civic-code-of-laws",
    kind: "civic",
    nameEn: "Code of Laws",
    nameJa: "法典",
    era: "ancient",
    cost: 20,
    prerequisites: [],
    unlocks: [
      { type: "policy", nameEn: "Discipline", nameJa: "規律(政策)" },
      { type: "policy", nameEn: "God King", nameJa: "神権王(政策)" },
      { type: "policy", nameEn: "Urban Planning", nameJa: "都市計画(政策)" },
    ],
  },
  {
    id: "civic-craftsmanship",
    kind: "civic",
    nameEn: "Craftsmanship",
    nameJa: "工芸",
    era: "ancient",
    cost: 40,
    prerequisites: ["civic-code-of-laws"],
    boost: {
      conditionEn: "Improve 3 tiles",
      conditionJa: "タイルを3つ改善する",
    },
    unlocks: [
      { type: "policy", nameEn: "Ilkum", nameJa: "イルクム(政策)" },
      { type: "policy", nameEn: "Agoge", nameJa: "アゴーゲー(政策)" },
    ],
  },
  {
    id: "civic-foreign-trade",
    kind: "civic",
    nameEn: "Foreign Trade",
    nameJa: "海外交易",
    era: "ancient",
    cost: 40,
    prerequisites: ["civic-code-of-laws"],
    boost: {
      conditionEn: "Discover a second continent",
      conditionJa: "2つ目の大陸を発見する",
    },
    unlocks: [
      { type: "unit", nameEn: "Trader", nameJa: "交易商" },
      { type: "policy", nameEn: "Caravansaries", nameJa: "隊商宿(政策)" },
      {
        type: "policy",
        nameEn: "Maritime Industries",
        nameJa: "海洋産業(政策)",
      },
    ],
  },
  {
    id: "civic-military-tradition",
    kind: "civic",
    nameEn: "Military Tradition",
    nameJa: "軍事の伝統",
    era: "ancient",
    cost: 50,
    prerequisites: ["civic-craftsmanship"],
    boost: {
      conditionEn: "Clear a Barbarian Outpost",
      conditionJa: "蛮族の前哨地を制圧する",
    },
    unlocks: [
      { type: "policy", nameEn: "Maneuver", nameJa: "機動(政策)" },
      { type: "policy", nameEn: "Strategos", nameJa: "ストラテゴス(政策)" },
    ],
  },
  {
    id: "civic-state-workforce",
    kind: "civic",
    nameEn: "State Workforce",
    nameJa: "国家労働力",
    era: "ancient",
    cost: 70,
    prerequisites: ["civic-craftsmanship"],
    boost: {
      conditionEn: "Build a specialty district",
      conditionJa: "専門区域を1つ建設する",
    },
    unlocks: [
      { type: "policy", nameEn: "Corvée", nameJa: "賦役(政策)" },
      { type: "policy", nameEn: "Conscription", nameJa: "徴兵(政策)" },
    ],
  },
  {
    id: "civic-early-empire",
    kind: "civic",
    nameEn: "Early Empire",
    nameJa: "初期帝国",
    era: "ancient",
    cost: 70,
    prerequisites: ["civic-foreign-trade"],
    boost: {
      conditionEn: "Have 6 population total across your cities",
      conditionJa: "自国の人口の合計が6になる",
    },
    unlocks: [
      { type: "policy", nameEn: "Colonization", nameJa: "植民(政策)" },
      { type: "policy", nameEn: "Land Surveyors", nameJa: "測量士(政策)" },
    ],
  },
  {
    id: "civic-mysticism",
    kind: "civic",
    nameEn: "Mysticism",
    nameJa: "神秘主義",
    era: "ancient",
    cost: 50,
    prerequisites: ["civic-foreign-trade"],
    boost: {
      conditionEn: "Found a Pantheon",
      conditionJa: "パンテオンを創始する",
    },
    unlocks: [
      { type: "wonder", nameEn: "Oracle", nameJa: "オラクル(神託所)" },
      { type: "policy", nameEn: "Revelation", nameJa: "啓示(政策)" },
    ],
  },

  // --- 古典 ---
  {
    id: "civic-games-and-recreation",
    kind: "civic",
    nameEn: "Games and Recreation",
    nameJa: "競技と娯楽",
    era: "classical",
    cost: 110,
    prerequisites: ["civic-state-workforce"],
    boost: {
      conditionEn: "Research the Construction technology",
      conditionJa: "テクノロジー「建築」を研究する",
    },
    unlocks: [
      { type: "district", nameEn: "Entertainment Complex", nameJa: "娯楽施設" },
      { type: "building", nameEn: "Arena", nameJa: "闘技場" },
      { type: "policy", nameEn: "Insulae", nameJa: "集合住宅(政策)" },
    ],
  },
  {
    id: "civic-political-philosophy",
    kind: "civic",
    nameEn: "Political Philosophy",
    nameJa: "政治哲学",
    era: "classical",
    cost: 110,
    prerequisites: ["civic-state-workforce", "civic-early-empire"],
    boost: {
      conditionEn: "Meet 3 city-states",
      conditionJa: "都市国家3つと出会う",
    },
    unlocks: [
      { type: "district", nameEn: "Government Plaza", nameJa: "政府複合施設" },
      { type: "government", nameEn: "Autocracy", nameJa: "専制政治" },
      { type: "government", nameEn: "Oligarchy", nameJa: "寡頭制" },
      {
        type: "government",
        nameEn: "Classical Republic",
        nameJa: "古典共和制",
      },
    ],
  },
  {
    id: "civic-drama-and-poetry",
    kind: "civic",
    nameEn: "Drama and Poetry",
    nameJa: "演劇と詩",
    era: "classical",
    cost: 110,
    prerequisites: ["civic-early-empire"],
    boost: {
      conditionEn: "Build a Wonder",
      conditionJa: "遺産を1つ建設する",
    },
    unlocks: [
      { type: "district", nameEn: "Theater Square", nameJa: "劇場広場" },
      { type: "building", nameEn: "Amphitheater", nameJa: "円形劇場" },
      {
        type: "policy",
        nameEn: "Literary Tradition",
        nameJa: "文学の伝統(政策)",
      },
    ],
  },
  {
    id: "civic-military-training",
    kind: "civic",
    nameEn: "Military Training",
    nameJa: "軍事訓練",
    era: "classical",
    cost: 120,
    prerequisites: ["civic-military-tradition", "civic-games-and-recreation"],
    boost: {
      conditionEn: "Build a district",
      conditionJa: "区域を1つ建設する",
    },
    unlocks: [
      { type: "policy", nameEn: "Veterancy", nameJa: "熟練兵育成(政策)" },
      { type: "policy", nameEn: "Raid", nameJa: "略奪(政策)" },
    ],
  },
  {
    id: "civic-defensive-tactics",
    kind: "civic",
    nameEn: "Defensive Tactics",
    nameJa: "防衛戦術",
    era: "classical",
    cost: 175,
    prerequisites: ["civic-games-and-recreation", "civic-political-philosophy"],
    boost: {
      conditionEn: "Have another civilization declare war on you",
      conditionJa: "他文明から宣戦布告される",
    },
    unlocks: [
      { type: "policy", nameEn: "Bastions", nameJa: "稜堡(政策)" },
      { type: "policy", nameEn: "Limes", nameJa: "リメス(政策)" },
    ],
  },
  {
    id: "civic-recorded-history",
    kind: "civic",
    nameEn: "Recorded History",
    nameJa: "歴史記録",
    era: "classical",
    cost: 175,
    prerequisites: ["civic-political-philosophy", "civic-drama-and-poetry"],
    boost: {
      conditionEn: "Build 2 districts",
      conditionJa: "区域を2つ建設する",
    },
    unlocks: [
      {
        type: "wonder",
        nameEn: "Great Library",
        nameJa: "アレクサンドリア図書館",
      },
      {
        type: "policy",
        nameEn: "Natural Philosophy",
        nameJa: "自然哲学(政策)",
      },
    ],
  },
  {
    id: "civic-theology",
    kind: "civic",
    nameEn: "Theology",
    nameJa: "神学",
    era: "classical",
    cost: 120,
    prerequisites: ["civic-mysticism", "civic-drama-and-poetry"],
    boost: {
      conditionEn: "Found a religion",
      conditionJa: "宗教を創始する",
    },
    unlocks: [
      { type: "building", nameEn: "Temple", nameJa: "神殿" },
      { type: "policy", nameEn: "Scripture", nameJa: "聖典(政策)" },
    ],
  },

  // --- 中世 ---
  {
    id: "civic-naval-tradition",
    kind: "civic",
    nameEn: "Naval Tradition",
    nameJa: "海軍の伝統",
    era: "medieval",
    cost: 200,
    prerequisites: ["civic-defensive-tactics"],
    boost: {
      conditionEn: "Kill a unit using a Quadrireme",
      conditionJa: "クアドリレームでユニットを倒す",
    },
    unlocks: [
      {
        type: "policy",
        nameEn: "Naval Infrastructure",
        nameJa: "海軍インフラ(政策)",
      },
      { type: "policy", nameEn: "Navigation", nameJa: "航海(政策)" },
    ],
  },
  {
    id: "civic-feudalism",
    kind: "civic",
    nameEn: "Feudalism",
    nameJa: "封建制",
    era: "medieval",
    cost: 275,
    prerequisites: ["civic-defensive-tactics"],
    boost: {
      conditionEn: "Build 6 Farms",
      conditionJa: "農場を6つ建設する",
    },
    unlocks: [
      { type: "policy", nameEn: "Serfdom", nameJa: "農奴制(政策)" },
      { type: "policy", nameEn: "Feudal Contract", nameJa: "封建契約(政策)" },
    ],
  },
  {
    id: "civic-civil-service",
    kind: "civic",
    nameEn: "Civil Service",
    nameJa: "官僚制",
    era: "medieval",
    cost: 275,
    prerequisites: ["civic-defensive-tactics", "civic-recorded-history"],
    boost: {
      conditionEn: "Have 10 population in a single city",
      conditionJa: "単一都市の人口を10にする",
    },
    unlocks: [
      { type: "policy", nameEn: "Retainers", nameJa: "従者(政策)" },
      { type: "policy", nameEn: "Meritocracy", nameJa: "実力主義(政策)" },
    ],
  },
  {
    id: "civic-mercenaries",
    kind: "civic",
    nameEn: "Mercenaries",
    nameJa: "傭兵",
    era: "medieval",
    cost: 290,
    prerequisites: ["civic-military-training", "civic-feudalism"],
    boost: {
      conditionEn: "Have 8 land military units",
      conditionJa: "陸上軍事ユニットを8体保有する",
    },
    unlocks: [
      { type: "policy", nameEn: "Professional Army", nameJa: "常備軍(政策)" },
      {
        type: "policy",
        nameEn: "Trade Confederation",
        nameJa: "交易連合(政策)",
      },
    ],
  },
  {
    id: "civic-medieval-faires",
    kind: "civic",
    nameEn: "Medieval Faires",
    nameJa: "中世の市",
    era: "medieval",
    cost: 385,
    prerequisites: ["civic-feudalism"],
    boost: {
      conditionEn: "Have 4 Trade Routes",
      conditionJa: "交易路を4つ持つ",
    },
    unlocks: [
      { type: "policy", nameEn: "Aesthetics", nameJa: "耽美主義(政策)" },
      {
        type: "policy",
        nameEn: "Merchant Confederation",
        nameJa: "商人連合(政策)",
      },
    ],
  },
  {
    id: "civic-guilds",
    kind: "civic",
    nameEn: "Guilds",
    nameJa: "ギルド",
    era: "medieval",
    cost: 385,
    prerequisites: ["civic-feudalism", "civic-civil-service"],
    boost: {
      conditionEn: "Own 2 Markets",
      conditionJa: "市場を2つ保有する",
    },
    unlocks: [
      { type: "wonder", nameEn: "Chichen Itza", nameJa: "チチェン・イッツァ" },
      { type: "policy", nameEn: "Town Charters", nameJa: "都市特許状(政策)" },
      { type: "policy", nameEn: "Craftsmen", nameJa: "職人(政策)" },
    ],
  },
  {
    id: "civic-divine-right",
    kind: "civic",
    nameEn: "Divine Right",
    nameJa: "王権神授説",
    era: "medieval",
    cost: 290,
    prerequisites: ["civic-theology", "civic-civil-service"],
    boost: {
      conditionEn: "Own 2 Temples",
      conditionJa: "神殿を2つ保有する",
    },
    unlocks: [
      { type: "government", nameEn: "Monarchy", nameJa: "君主制" },
      {
        type: "wonder",
        nameEn: "Mont St. Michel",
        nameJa: "モン・サン・ミシェル",
      },
      {
        type: "policy",
        nameEn: "Gothic Architecture",
        nameJa: "ゴシック建築(政策)",
      },
    ],
  },

  // --- ルネサンス ---
  {
    id: "civic-exploration",
    kind: "civic",
    nameEn: "Exploration",
    nameJa: "探検",
    era: "renaissance",
    cost: 400,
    prerequisites: ["civic-mercenaries", "civic-medieval-faires"],
    boost: {
      conditionEn: "Own 2 Caravels",
      conditionJa: "キャラベルを2隻保有する",
    },
    unlocks: [
      {
        type: "government",
        nameEn: "Merchant Republic",
        nameJa: "重商主義共和制",
      },
      { type: "improvement", nameEn: "Mission", nameJa: "伝道所" },
      { type: "policy", nameEn: "Colonial Offices", nameJa: "植民地局(政策)" },
    ],
  },
  {
    id: "civic-humanism",
    kind: "civic",
    nameEn: "Humanism",
    nameJa: "人文主義",
    era: "renaissance",
    cost: 540,
    prerequisites: ["civic-medieval-faires"],
    boost: {
      conditionEn: "Earn a Great Artist",
      conditionJa: "大芸術家を獲得する",
    },
    unlocks: [
      { type: "building", nameEn: "Art Museum", nameJa: "美術博物館" },
      {
        type: "building",
        nameEn: "Archaeological Museum",
        nameJa: "考古学博物館",
      },
      { type: "improvement", nameEn: "Château", nameJa: "シャトー" },
    ],
  },
  {
    id: "civic-diplomatic-service",
    kind: "civic",
    nameEn: "Diplomatic Service",
    nameJa: "外交",
    era: "renaissance",
    cost: 540,
    prerequisites: ["civic-guilds"],
    boost: {
      conditionEn: "Form an Alliance",
      conditionJa: "同盟を結ぶ",
    },
    unlocks: [
      {
        type: "policy",
        nameEn: "Machiavellianism",
        nameJa: "マキャヴェリズム(政策)",
      },
    ],
  },
  {
    id: "civic-reformed-church",
    kind: "civic",
    nameEn: "Reformed Church",
    nameJa: "改革派教会",
    era: "renaissance",
    cost: 400,
    prerequisites: ["civic-guilds", "civic-divine-right"],
    boost: {
      conditionEn: "Have 6 cities following your religion",
      conditionJa: "自国の宗教を信仰する都市が6つになる",
    },
    unlocks: [
      { type: "government", nameEn: "Theocracy", nameJa: "神権政治" },
      { type: "policy", nameEn: "Religious Orders", nameJa: "修道会(政策)" },
    ],
  },
  {
    id: "civic-mercantilism",
    kind: "civic",
    nameEn: "Mercantilism",
    nameJa: "重商主義",
    era: "renaissance",
    cost: 655,
    prerequisites: ["civic-humanism"],
    boost: {
      conditionEn: "Earn a Great Merchant",
      conditionJa: "大商人を獲得する",
    },
    unlocks: [
      { type: "unit", nameEn: "Privateer", nameJa: "私掠船" },
      { type: "policy", nameEn: "Triangular Trade", nameJa: "三角貿易(政策)" },
      { type: "policy", nameEn: "Logistics", nameJa: "兵站(政策)" },
    ],
  },
  {
    id: "civic-the-enlightenment",
    kind: "civic",
    nameEn: "The Enlightenment",
    nameJa: "啓蒙思想",
    era: "renaissance",
    cost: 655,
    prerequisites: ["civic-humanism", "civic-diplomatic-service"],
    boost: {
      conditionEn: "Earn 3 Great People",
      conditionJa: "偉人を3人獲得する",
    },
    unlocks: [
      { type: "policy", nameEn: "Rationalism", nameJa: "合理主義(政策)" },
      { type: "policy", nameEn: "Free Market", nameJa: "自由市場(政策)" },
      { type: "policy", nameEn: "Liberalism", nameJa: "自由主義(政策)" },
    ],
  },

  // --- 産業 ---
  {
    id: "civic-colonialism",
    kind: "civic",
    nameEn: "Colonialism",
    nameJa: "植民地主義",
    era: "industrial",
    cost: 690,
    prerequisites: ["civic-mercantilism"],
    boost: {
      conditionEn: "Research the Astronomy technology",
      conditionJa: "テクノロジー「天文学」を研究する",
    },
    unlocks: [
      { type: "policy", nameEn: "Colonial Taxes", nameJa: "植民地税(政策)" },
      { type: "policy", nameEn: "Press Gangs", nameJa: "強制徴募(政策)" },
    ],
  },
  {
    id: "civic-civil-engineering",
    kind: "civic",
    nameEn: "Civil Engineering",
    nameJa: "土木工学",
    era: "industrial",
    cost: 875,
    prerequisites: ["civic-mercantilism"],
    boost: {
      conditionEn: "Build 7 different specialty districts",
      conditionJa: "異なる専門区域を7種類建設する",
    },
    unlocks: [
      { type: "policy", nameEn: "Public Works", nameJa: "公共事業(政策)" },
      { type: "policy", nameEn: "Skyscrapers", nameJa: "摩天楼(政策)" },
    ],
  },
  {
    id: "civic-nationalism",
    kind: "civic",
    nameEn: "Nationalism",
    nameJa: "国家主義",
    era: "industrial",
    cost: 875,
    prerequisites: ["civic-the-enlightenment"],
    boost: {
      conditionEn: "Have another civilization declare war on you",
      conditionJa: "他文明から宣戦布告される",
    },
    unlocks: [
      { type: "policy", nameEn: "Grande Armée", nameJa: "大陸軍(政策)" },
      { type: "policy", nameEn: "National Identity", nameJa: "国家意識(政策)" },
    ],
  },
  {
    id: "civic-opera-and-ballet",
    kind: "civic",
    nameEn: "Opera and Ballet",
    nameJa: "オペラとバレエ",
    era: "industrial",
    cost: 690,
    prerequisites: ["civic-the-enlightenment"],
    boost: {
      conditionEn: "Own 1 Art Museum",
      conditionJa: "美術博物館を1つ保有する",
    },
    unlocks: [
      { type: "wonder", nameEn: "Bolshoi Theatre", nameJa: "ボリショイ劇場" },
      { type: "policy", nameEn: "Grand Opera", nameJa: "グランドオペラ(政策)" },
    ],
  },
  {
    id: "civic-natural-history",
    kind: "civic",
    nameEn: "Natural History",
    nameJa: "博物学",
    era: "industrial",
    cost: 830,
    prerequisites: ["civic-colonialism"],
    boost: {
      conditionEn: "Own 1 Archaeological Museum",
      conditionJa: "考古学博物館を1つ保有する",
    },
    unlocks: [
      { type: "unit", nameEn: "Archaeologist", nameJa: "考古学者" },
      { type: "building", nameEn: "Zoo", nameJa: "動物園" },
    ],
  },
  {
    id: "civic-scorched-earth",
    kind: "civic",
    nameEn: "Scorched Earth",
    nameJa: "焦土作戦",
    era: "industrial",
    cost: 1010,
    prerequisites: ["civic-nationalism"],
    boost: {
      conditionEn: "Own 2 Field Cannons",
      conditionJa: "野戦砲を2体保有する",
    },
    unlocks: [
      { type: "policy", nameEn: "Total War", nameJa: "総力戦(政策)" },
      { type: "policy", nameEn: "Expropriation", nameJa: "接収(政策)" },
    ],
  },
  {
    id: "civic-urbanization",
    kind: "civic",
    nameEn: "Urbanization",
    nameJa: "都市化",
    era: "industrial",
    cost: 1010,
    prerequisites: ["civic-civil-engineering", "civic-nationalism"],
    boost: {
      conditionEn: "Have 15 population in a single city",
      conditionJa: "単一都市の人口を15にする",
    },
    unlocks: [
      { type: "policy", nameEn: "Public Transport", nameJa: "公共交通(政策)" },
      { type: "policy", nameEn: "New Deal", nameJa: "ニューディール(政策)" },
    ],
  },

  // --- 現代 ---
  {
    id: "civic-conservation",
    kind: "civic",
    nameEn: "Conservation",
    nameJa: "環境保護",
    era: "modern",
    cost: 1140,
    prerequisites: ["civic-natural-history", "civic-urbanization"],
    boost: {
      conditionEn: "Own 4 Neighborhood districts",
      conditionJa: "近隣住区を4つ保有する",
    },
    unlocks: [
      { type: "unit", nameEn: "Naturalist", nameJa: "自然主義者" },
      {
        type: "policy",
        nameEn: "Resource Management",
        nameJa: "資源管理(政策)",
      },
    ],
  },
  {
    id: "civic-mass-media",
    kind: "civic",
    nameEn: "Mass Media",
    nameJa: "マスメディア",
    era: "modern",
    cost: 1280,
    prerequisites: ["civic-urbanization"],
    boost: {
      conditionEn: "Research the Radio technology",
      conditionJa: "テクノロジー「無線通信」を研究する",
    },
    unlocks: [
      {
        type: "wonder",
        nameEn: "Cristo Redentor",
        nameJa: "コルコバードのキリスト像",
      },
      { type: "policy", nameEn: "Propaganda", nameJa: "プロパガンダ(政策)" },
    ],
  },
  {
    id: "civic-mobilization",
    kind: "civic",
    nameEn: "Mobilization",
    nameJa: "動員",
    era: "modern",
    cost: 1280,
    prerequisites: ["civic-urbanization"],
    boost: {
      conditionEn: "Have 3 Corps in your army",
      conditionJa: "軍団(Corps)を3つ編成する",
    },
    unlocks: [
      { type: "policy", nameEn: "Levée en Masse", nameJa: "国民総動員(政策)" },
    ],
  },
  {
    id: "civic-capitalism",
    kind: "civic",
    nameEn: "Capitalism",
    nameJa: "資本主義",
    era: "modern",
    cost: 1420,
    prerequisites: ["civic-mass-media"],
    boost: {
      conditionEn: "Own 3 Stock Exchanges",
      conditionJa: "証券取引所を3つ保有する",
    },
    unlocks: [
      { type: "policy", nameEn: "Market Economy", nameJa: "市場経済(政策)" },
      { type: "policy", nameEn: "Laissez-Faire", nameJa: "自由放任(政策)" },
    ],
  },
  {
    id: "civic-ideology",
    kind: "civic",
    nameEn: "Ideology",
    nameJa: "イデオロギー",
    era: "modern",
    cost: 600,
    prerequisites: ["civic-mass-media", "civic-mobilization"],
    unlocks: [
      {
        type: "government",
        nameEn: "Tier 3 governments (via following civics)",
        nameJa: "上位政府(後続の社会制度で解禁)",
      },
      { type: "policy", nameEn: "Police State", nameJa: "警察国家(政策)" },
    ],
  },
  {
    id: "civic-nuclear-program",
    kind: "civic",
    nameEn: "Nuclear Program",
    nameJa: "核開発計画",
    era: "modern",
    cost: 1560,
    prerequisites: ["civic-ideology"],
    boost: {
      conditionEn: "Own 1 Research Lab",
      conditionJa: "研究所を1つ保有する",
    },
    unlocks: [
      { type: "policy", nameEn: "Nobel Prize", nameJa: "ノーベル賞(政策)" },
    ],
  },
  {
    id: "civic-suffrage",
    kind: "civic",
    nameEn: "Suffrage",
    nameJa: "参政権",
    era: "modern",
    cost: 1560,
    prerequisites: ["civic-ideology"],
    boost: {
      conditionEn: "Own 4 Sewers",
      conditionJa: "下水道を4つ保有する",
    },
    unlocks: [
      { type: "government", nameEn: "Democracy", nameJa: "民主主義" },
      { type: "policy", nameEn: "New Deal", nameJa: "ニューディール(政策)" },
    ],
  },
  {
    id: "civic-totalitarianism",
    kind: "civic",
    nameEn: "Totalitarianism",
    nameJa: "全体主義",
    era: "modern",
    cost: 1560,
    prerequisites: ["civic-ideology"],
    boost: {
      conditionEn: "Own 3 Military Academies",
      conditionJa: "士官学校を3つ保有する",
    },
    unlocks: [
      { type: "government", nameEn: "Fascism", nameJa: "ファシズム" },
      { type: "policy", nameEn: "Martial Law", nameJa: "戒厳令(政策)" },
    ],
  },
  {
    id: "civic-class-struggle",
    kind: "civic",
    nameEn: "Class Struggle",
    nameJa: "階級闘争",
    era: "modern",
    cost: 1560,
    prerequisites: ["civic-ideology"],
    boost: {
      conditionEn: "Own 3 Factories",
      conditionJa: "工場を3つ保有する",
    },
    unlocks: [
      { type: "government", nameEn: "Communism", nameJa: "共産主義" },
      { type: "policy", nameEn: "Five-Year Plan", nameJa: "五カ年計画(政策)" },
    ],
  },

  // --- 原子力 ---
  {
    id: "civic-cold-war",
    kind: "civic",
    nameEn: "Cold War",
    nameJa: "冷戦",
    era: "atomic",
    cost: 1900,
    prerequisites: ["civic-ideology"],
    boost: {
      conditionEn: "Research the Nuclear Fission technology",
      conditionJa: "テクノロジー「核分裂」を研究する",
    },
    unlocks: [
      { type: "policy", nameEn: "Containment", nameJa: "封じ込め(政策)" },
      { type: "policy", nameEn: "International Waters", nameJa: "公海(政策)" },
    ],
  },
  {
    id: "civic-professional-sports",
    kind: "civic",
    nameEn: "Professional Sports",
    nameJa: "プロスポーツ",
    era: "atomic",
    cost: 1900,
    prerequisites: ["civic-ideology"],
    boost: {
      conditionEn: "Build 4 districts",
      conditionJa: "区域を4つ建設する",
    },
    unlocks: [
      { type: "building", nameEn: "Stadium", nameJa: "スタジアム" },
      {
        type: "policy",
        nameEn: "Sports Media",
        nameJa: "スポーツメディア(政策)",
      },
    ],
  },
  {
    id: "civic-cultural-heritage",
    kind: "civic",
    nameEn: "Cultural Heritage",
    nameJa: "文化遺産",
    era: "atomic",
    cost: 1700,
    prerequisites: ["civic-conservation"],
    boost: {
      conditionEn: "Have 1 themed building",
      conditionJa: "テーマボーナスを1つ成立させる",
    },
    unlocks: [
      {
        type: "wonder",
        nameEn: "Sydney Opera House",
        nameJa: "シドニー・オペラハウス",
      },
      {
        type: "policy",
        nameEn: "Heritage Tourism",
        nameJa: "文化遺産観光(政策)",
      },
    ],
  },
  {
    id: "civic-rapid-deployment",
    kind: "civic",
    nameEn: "Rapid Deployment",
    nameJa: "緊急展開",
    era: "atomic",
    cost: 2100,
    prerequisites: ["civic-cold-war"],
    boost: {
      conditionEn: "Have an air unit based on a foreign continent",
      conditionJa: "他大陸を拠点とする航空ユニットを配備する",
    },
    unlocks: [
      { type: "policy", nameEn: "Military First", nameJa: "軍事優先(政策)" },
    ],
  },
  {
    id: "civic-space-race",
    kind: "civic",
    nameEn: "Space Race",
    nameJa: "宇宙開発競争",
    era: "atomic",
    cost: 2100,
    prerequisites: ["civic-cold-war"],
    boost: {
      conditionEn: "Build a district",
      conditionJa: "区域を1つ建設する",
    },
    unlocks: [
      {
        type: "policy",
        nameEn: "Integrated Space Cell",
        nameJa: "統合宇宙局(政策)",
      },
    ],
  },

  // --- 情報 ---
  {
    id: "civic-globalization",
    kind: "civic",
    nameEn: "Globalization",
    nameJa: "グローバリゼーション",
    era: "information",
    cost: 2400,
    prerequisites: ["civic-rapid-deployment", "civic-space-race"],
    boost: {
      conditionEn: "Own 3 Airports",
      conditionJa: "空港を3つ保有する",
    },
    unlocks: [
      {
        type: "policy",
        nameEn: "International Space Agency",
        nameJa: "国際宇宙機関(政策)",
      },
      { type: "policy", nameEn: "Ecommerce", nameJa: "電子商取引(政策)" },
    ],
  },
  {
    id: "civic-social-media",
    kind: "civic",
    nameEn: "Social Media",
    nameJa: "ソーシャルメディア",
    era: "information",
    cost: 2400,
    prerequisites: ["civic-professional-sports", "civic-space-race"],
    boost: {
      conditionEn: "Research the Telecommunications technology",
      conditionJa: "テクノロジー「電気通信」を研究する",
    },
    unlocks: [
      {
        type: "policy",
        nameEn: "Online Communities",
        nameJa: "オンラインコミュニティ(政策)",
      },
      {
        type: "policy",
        nameEn: "Collective Activism",
        nameJa: "集団行動主義(政策)",
      },
    ],
  },
] satisfies ResearchNode[];
