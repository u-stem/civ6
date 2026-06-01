import { counter, flag, type Route } from "@/lib/route";

// バビロン文化ルート(伴走用の状態機械)。
// 土台は civ6-companion-prompt.md。社会制度本線・偉人・終盤観光・黄金時代などを補完。
// 前提: 嵐の訪れ / 対人オンライン速度 / 神 / 4文明戦 / 自分からは対人開戦しない。
// 固有名詞は日本語版の正式名称(サブン・キビタム、劇場広場、弩兵 など)。

export const babylonCulture: Route = {
  id: "babylon-culture",
  name: "バビロン 文化ルート",
  civId: "babylon",
  victory: "culture",
  premise:
    "バビロン(ハンムラビ)。科学産出 −50% で能力は技術ツリーにしか効かない。本線は社会制度ツリー(劇場広場中心)、技術はひらめき最短連鎖。嵐の訪れ / 対人オンライン速度 / 神 / 4文明戦。自分からは対人開戦せず、AI は資産ごと収奪して観光・時代スコアに変換する。文化勝利は相対判定(自分の観光客 > 各相手の国内観光客)なので、相手の作品強奪は二重に効く。",

  counters: [
    { key: "slinger", label: "投石兵" },
    { key: "archer", label: "弓兵" },
    { key: "crossbow", label: "弩兵" },
    { key: "mine", label: "鉱山" },
    { key: "workshop", label: "工房" },
    { key: "city", label: "都市" },
    { key: "theater", label: "劇場広場" },
    { key: "districtTypes", label: "解禁済みの専門区域タイプ数" },
    { key: "districtsBuilt", label: "建設済みの専門区域数" },
  ],
  flags: [
    { key: "tech.mining", label: "採掘(技術)" },
    { key: "tech.archery", label: "弓術(技術)" },
    { key: "tech.machinery", label: "機械(技術)" },
    { key: "civic.dramaPoetry", label: "演劇と詩(社会制度)" },
    { key: "hero.davinci", label: "大技術者ダ・ヴィンチ確保" },
    { key: "spy.counterTrained", label: "スパイ防諜育成済み" },
    { key: "ai.adjacent", label: "攻められる隣接AIがいる" },
    { key: "coastal.heavy", label: "海岸・高魅力タイルの都市が多い" },
  ],

  nodes: [
    // --- sequence(順序付きの手) ---
    {
      type: "sequence",
      id: "seq-mining",
      lane: "tech",
      label: "採掘を自力研究",
      detail: "ひらめき無し。エウレカ連鎖の起点なので最初に取る。",
      done: (s) => flag(s, "tech.mining"),
    },
    {
      type: "sequence",
      id: "seq-worker",
      lane: "production",
      label: "労働者1体(作業4チャージ)→鉱山3+資源農場1",
      detail:
        "チャージ4なら1体で徒弟制度ブースト(鉱山3)と灌漑ブースト(資源を耕作)を両立できる。",
      done: (s) => counter(s, "mine") >= 3,
    },
    {
      type: "sequence",
      id: "seq-irrigation",
      lane: "tech",
      label: "灌漑(資源を耕作でひらめき発火)",
      detail: "パルグムを解禁。パルグム自体は急がず随時設置でよい。",
      done: (s) => counter(s, "mine") >= 1,
    },
    {
      type: "sequence",
      id: "seq-slinger3",
      lane: "production",
      label: "投石兵を3体作りきる",
      detail:
        "★倒す前に必ず3体。先に倒すと弓術が早発してひらめき連鎖が崩れる。",
      done: (s) => counter(s, "slinger") >= 3,
    },
    {
      type: "sequence",
      id: "seq-archery",
      lane: "tech",
      label: "弓術(投石兵で敵を倒す)",
      detail:
        "3体揃えてから倒す。スパルタ教育で残り1ターン停止→作り溜め→一括アップグレードの小技がある。",
      done: (s) => flag(s, "tech.archery"),
    },
    {
      type: "sequence",
      id: "seq-archer3",
      lane: "production",
      label: "弓兵3体を揃える",
      detail: "機械のひらめき条件。",
      done: (s) => counter(s, "archer") >= 3,
    },
    {
      type: "sequence",
      id: "seq-machinery",
      lane: "tech",
      label: "機械(弓兵3体保有)",
      detail: "弩兵を解禁。AI 収奪と防衛の主力になる。",
      done: (s) => flag(s, "tech.machinery"),
    },
    {
      type: "sequence",
      id: "seq-apprentice",
      lane: "tech",
      label: "徒弟制度(鉱山3つ)",
      detail: "工業地帯を解禁。",
      done: (s) => counter(s, "mine") >= 3,
    },
    {
      type: "sequence",
      id: "seq-drama-poetry",
      lane: "civic",
      label: "演劇と詩(遺産1つでひらめき)",
      detail:
        "劇場広場を解禁する社会制度。バビロンは社会制度の進行が通常速度なので、ここが文化本線の入口。",
      done: (s) => flag(s, "civic.dramaPoetry"),
    },
    {
      type: "sequence",
      id: "seq-industry",
      lane: "production",
      label: "工房2つ→工業化",
      detail: "鉱山+2を上乗せ。序盤+3生産で劇場広場と遺産を高速展開できる。",
      done: (s) => counter(s, "workshop") >= 2,
    },
    {
      type: "sequence",
      id: "seq-davinci",
      lane: "military",
      label: "大技術者ダ・ヴィンチ確保",
      detail: "全工房+3文化、引退で近代のひらめき。文化ルート最優先級の偉人。",
      done: (s) => flag(s, "hero.davinci"),
    },
    {
      type: "sequence",
      id: "seq-spy",
      lane: "military",
      label: "スパイ防諜育成→諜報機関",
      detail:
        "商業ハブで防諜任務に就けてレベル上げ。暗号術+諜報機関で成功率84〜90%帯。",
      done: (s) => flag(s, "spy.counterTrained"),
    },

    // --- conditional(条件で随時発火) ---
    {
      type: "conditional",
      id: "cnd-expand",
      lane: "production",
      label: "都市を増やす",
      trigger:
        "「開拓者コストが生産を圧迫しすぎない」「忠誠心で剥がれない位置」「防衛できる位置」の3条件を満たす限り常時",
      detail:
        "都市数は多いほど強い。文化ルートでも劇場広場・遺産の土地が増えて観光が伸びる。",
    },
    {
      type: "conditional",
      id: "cnd-palgum",
      lane: "production",
      label: "パルグムを設置",
      trigger: "灌漑取得後、河川都市で手が空いたら順次",
      detail: "急がない。食料・生産のおまけ。",
    },
    {
      type: "conditional",
      id: "cnd-theater",
      lane: "civic",
      label: "劇場広場を展開",
      trigger: "区域枠が空いたら最優先",
      detail:
        "偉人ポイントで文化偉人を集めやすい。キャンパスは量産しない(科学は捨てる)。",
    },
    {
      type: "conditional",
      id: "cnd-great-people",
      lane: "civic",
      label: "文化偉人を確保(著述家・芸術家・音楽家)",
      trigger: "劇場広場の偉人ポイントが溜まり、枠が空いたとき",
      detail:
        "大著作物が観光力の主力。終盤は大音楽家の演奏で観光を一気に伸ばせる。",
    },
    {
      type: "conditional",
      id: "cnd-museums",
      lane: "civic",
      label: "美術館・考古博物館を埋めてテーマ成立",
      trigger: "劇場広場が育ち、作品・遺物が集まったとき",
      detail:
        "同種3作品などのテーマボーナスで観光力が倍化。考古学者で遺物を発掘して埋める。",
    },
    {
      type: "conditional",
      id: "cnd-wonder-snipe",
      lane: "civic",
      label: "観光遺産を先取り",
      trigger: "ひらめきで前提技術を先行解禁できたとき",
      detail: "取れば自分の観光増 + 相手が取れない。",
    },
    {
      type: "conditional",
      id: "cnd-rockband",
      lane: "civic",
      label: "ロックバンドで観光をスパイク",
      trigger: "終盤、信仰力や金で購入できるとき(嵐の訪れ)",
      detail: "遺産・区域で公演すると大量の観光力を一度に稼げる。",
    },
    {
      type: "conditional",
      id: "cnd-tourism-policy",
      lane: "civic",
      label: "開かれた国境・交易路で観光を加速",
      trigger: "終盤、相手との国境・交易路・宗教が絡むとき",
      detail: "開かれた国境・交易路・宗教一致で相手への観光を最大化する。",
    },
    {
      type: "conditional",
      id: "cnd-production-base",
      lane: "production",
      label: "遺産生産の基盤を作る(製鋼→発電所、総督マグヌス)",
      trigger: "工業化のあと、生産を伸ばしたいとき",
      detail:
        "製鋼で石炭火力発電所を建てて生産力を底上げ。総督マグヌスを生産の中心都市へ、遺産ルール地方も狙う。遺産を量産する土台。",
    },
    {
      type: "conditional",
      id: "cnd-wonder-spam",
      lane: "civic",
      label: "観光遺産を大量に建てる",
      trigger: "生産基盤が整ったら常時",
      detail:
        "政策「ゴシック建築」「摩天楼」で遺産生産を加速。バビロンは大著作物へのボーナスが無いため、観光の主力は自前の遺産になる。",
    },
    {
      type: "conditional",
      id: "cnd-era-skip",
      lane: "tech",
      label: "ひらめきで時代を飛ばし遺産観光を最大化",
      trigger: "プラスチック等を先行解禁できるとき",
      detail:
        "遺産の観光力は『登場時代と現在の研究時代の差』で伸びる。プラスチックで原子力へ飛ばすと古い遺産ほど観光が跳ね上がる。",
    },
    {
      type: "conditional",
      id: "cnd-golden-wonder",
      lane: "civic",
      label: "黄金時代「Wish You Were Here」",
      trigger: "原子力以降で黄金時代に入れるとき",
      detail:
        "総督のいる都市の遺産観光+50%。遺産を多く抱えた都市に総督を置いて発動させる。",
    },

    // --- principle(判断軸・役割) ---
    {
      type: "principle",
      id: "prn-3lanes",
      lane: "production",
      label: "3つの生産レーンを分けて考える",
      body: "都市生産キュー / 技術研究 / 社会制度研究は別レーンで並行。混ぜると順序が分からなくなる。",
    },
    {
      type: "principle",
      id: "prn-unit-role",
      lane: "military",
      label: "固有ユニットと収奪の役割分担",
      body: "サブン・キビタムは偵察で1〜2体のみ(ひらめき稼ぎ)。収奪・防衛の主力は弩兵。量産対象を間違えない。",
    },
    {
      type: "principle",
      id: "prn-no-pvp-war",
      lane: "military",
      label: "プレイヤーには自分から戦争しない",
      body: "和平拒否される=終われない泥沼で文化本線が枯れる。軍事は AI 限定 + プレイヤー侵攻の撃退のみ。",
    },
    {
      type: "principle",
      id: "prn-drop-science",
      lane: "tech",
      label: "科学速度で競わない",
      body: "バビロンは科学 −50%。研究競争の土俵から降り、社会制度速度に乗り換える。キャンパス量産・科学勝利専用技術は捨てる。",
    },
    {
      type: "principle",
      id: "prn-spy-truth",
      lane: "military",
      label: "スパイは防諜育成が先",
      body: "相手の防諜・対スパイ政策は成功率に表示されず激減させる。無強化スパイは博打。防諜でレベルを上げてから攻撃する。",
    },
    {
      type: "principle",
      id: "prn-relative-win",
      lane: "civic",
      label: "文化勝利は相対判定",
      body: "自分の観光客 > 各相手の国内観光客。相手を削ると閾値が下がる → 妨害が勝利促進を兼ねる。",
    },
    {
      type: "principle",
      id: "prn-golden-age",
      lane: "civic",
      label: "黄金時代の献身を文化・偉人へ寄せる",
      body: "時代スコアを稼いで黄金時代を維持し、献身は偉人獲得や区域・観光に効くものを選ぶ。AI 収奪は時代スコアにもなる。",
    },
    {
      type: "principle",
      id: "prn-wonder-tourism",
      lane: "civic",
      label: "観光の主力は自前の遺産(時代差で伸びる)",
      body: "バビロンは大著作物・文化へのパッシブが無い。ひらめきで時代を先へ進めるほど、自分で建てた遺産の観光力が時代差で大きくなる。劇場広場・偉人は土台、遺産が稼ぎ頭。",
    },
    {
      type: "principle",
      id: "prn-district-cost",
      lane: "production",
      label: "区域コストは進行で最大10倍に膨らむ",
      body: "区域コストは [1 + 9 × max(技術ツリー完了率, 社会制度完了率)] × 基本コスト。バビロンはひらめきで技術ツリーが一気に進むため技術側の完了率が跳ね上がり、区域が高騰しやすい。",
    },
    {
      type: "principle",
      id: "prn-district-reserve",
      lane: "production",
      label: "区域は置いた瞬間にコスト固定(安いうちに予約)",
      body: "区域は配置した時点で生産コストが確定し、以降の値上がりの影響を受けない。技術を飛ばす前・コストが上がる前に区域を置いておく(予約する)。バビロンでは最重要のコスト管理。",
    },
    {
      type: "principle",
      id: "prn-district-discount",
      lane: "production",
      label: "区域ディスカウントを維持する",
      body: "建設済みの専門区域数と、解禁済みの専門区域タイプ数が等しいと、各タイプの最初の1つが60%(政府複合施設は75%)に割引。種類を偏らせず建てて割引を効かせる。ハンムラビの無償建物とも噛み合う。",
    },
    {
      type: "principle",
      id: "prn-adjacency",
      lane: "civic",
      label: "隣接ボーナスを意識して区域を置く",
      body: "劇場広場は遺産・区域に隣接させると文化の隣接ボーナス。聖地は山岳・森、キャンパスは山岳・熱帯雨林。配置次第で文化・観光・偉人ポイントが変わる。",
    },
    {
      type: "principle",
      id: "prn-policy-swap",
      lane: "civic",
      label: "政策カードは局面で差し替える",
      body: "社会制度を取得した瞬間は政策の差し替えが無料(それ以外は金が要る)。遺産を建てる局面はゴシック建築・摩天楼、観光を通す局面は遺産観光・衛星放送・オンライン・コミュニティへ、社会制度の完了ごとに最適化する。",
    },
    {
      type: "principle",
      id: "prn-faith-use",
      lane: "civic",
      label: "信仰力は偉人・自然主義者・ロックバンドへ",
      body: "文化ルートの信仰力は、大音楽家など文化偉人の購入、国立公園のための自然主義者、終盤のロックバンドに使う。聖地はこの信仰力の供給源として最小限確保する。",
    },
    {
      type: "principle",
      id: "prn-trade-route",
      lane: "military",
      label: "交易路は相手と結んで観光を加速",
      body: "相手と交易路を結ぶと、その文明から外国人観光客を得る速度が上がる。終盤は内政向けより相手国への交易路を増やし、開かれた国境・宗教一致と合わせて観光を通す。",
    },
  ],

  warnings: [
    {
      id: "w-slinger",
      severity: "danger",
      when: (s) => counter(s, "slinger") < 3 && !flag(s, "tech.archery"),
      message:
        "投石兵が3体未満。今 投石兵で敵を倒すと弓術が早発して連鎖が壊れる。投石兵を3体揃えてから倒すこと。",
    },
    {
      id: "w-mining",
      severity: "warn",
      when: (s) => !flag(s, "tech.mining") && s.turn >= 5,
      message: "採掘が未取得。ひらめき無しの起点技術、最初に自力研究で取る。",
    },
    {
      id: "w-machinery-early",
      severity: "danger",
      when: (s) => flag(s, "tech.machinery") && counter(s, "slinger") > 0,
      message:
        "機械を取得済みで投石兵が残存。高コストの弩兵に化けて無駄。アップグレード前に投石兵を処理。",
    },
    {
      id: "w-theater-late",
      severity: "warn",
      when: (s) => s.turn >= 40 && counter(s, "theater") < 1,
      message:
        "劇場広場がまだ無い。文化本線の入口が遅れている。演劇と詩を取り劇場広場を最優先で建てる。",
    },
    {
      id: "w-spy-late",
      severity: "danger",
      when: (s) => s.turn >= 80 && !flag(s, "spy.counterTrained"),
      message:
        "妨害開始ラインを過ぎたのにスパイ未育成。終盤に遅れる負け筋。防諜育成を今すぐ。",
    },
    {
      id: "w-davinci-late",
      severity: "warn",
      when: (s) => s.turn >= 80 && !flag(s, "hero.davinci"),
      message:
        "妨害ライン到達。大技術者ダ・ヴィンチ未確保。偉人ポイント/資金の手当てを確認。",
    },
    {
      id: "w-district-discount",
      severity: "warn",
      when: (s) =>
        s.turn >= 10 &&
        counter(s, "districtTypes") > counter(s, "districtsBuilt"),
      message:
        "解禁済みなのに未建設の専門区域タイプがある。各タイプ最初の1つは割引、かつ区域は置いた時点でコストが固定される。技術を飛ばす前=安いうちに配置(予約)を。",
    },
  ],

  phases: [
    {
      id: "p1",
      fromTurn: 1,
      label: "序盤 立ち上げ",
      hint: "河川立地で展開。劇場広場を最優先区域に。時代スコアで黄金時代を狙う。",
    },
    {
      id: "p2",
      fromTurn: 30,
      label: "序〜中盤 収奪と社会制度",
      hint: "AI を資産ごと収奪して観光・時代スコア。社会制度ツリーを太く伸ばす。",
    },
    {
      id: "p3",
      fromTurn: 80,
      label: "中盤 妨害開始ライン",
      hint: "★負け筋の分岐。ダ・ヴィンチ確保・スパイ育成・トップ走者の妨害を開始。",
    },
    {
      id: "p4",
      fromTurn: 140,
      label: "終盤 ゲージ通し",
      hint: "遺産先取り・作品強奪・観光開放政策で相対ゲージを通しきる。",
    },
  ],

  branches: [
    {
      id: "branch-raid",
      label: "収奪ルート(攻められる隣接AIがいる)",
      detail:
        "弩兵で隣接 AI を資産ごと奪い、遺産・劇場広場・遺物をそのまま観光と時代スコアに変換する。文化勝利は相対判定なので、相手を削るほど閾値が下がる。",
      when: (s) => flag(s, "ai.adjacent"),
      nodes: [
        {
          type: "conditional",
          id: "cnd-raid-ai",
          lane: "military",
          label: "AI 都市を資産ごと収奪",
          trigger: "弩兵が揃い、隣接 AI がいるとき",
          detail:
            "遺産・劇場広場・遺物がそのまま観光に乗る。時間浪費でなく勝利への変換。",
        },
        {
          type: "conditional",
          id: "cnd-steal-work",
          lane: "military",
          label: "スパイで偉大な作品を強奪",
          trigger: "スパイ育成済み & 相手都市に作品があるとき",
          detail:
            "相手の文化を削り自分の劇場広場に作品が増える。相対判定で二重に効く。",
        },
        {
          type: "conditional",
          id: "cnd-raid-defend",
          lane: "military",
          label: "収奪戦力を維持し前線都市を防衛",
          trigger: "収奪を続ける限り常時",
          detail:
            "弩兵と防壁で奪った都市を守る。文化本線(劇場広場・偉人)が止まらない範囲で軍を運用する。",
        },
      ],
    },
    {
      id: "branch-tall",
      label: "内政集中ルート(隣接AIがいない)",
      detail:
        "収奪に頼れない分、自力の遺産・劇場広場・偉人で観光を伸ばす。軍は防衛最小限にとどめ、生産を文化資産に全振りする。",
      when: (s) => !flag(s, "ai.adjacent"),
      nodes: [
        {
          type: "conditional",
          id: "cnd-tall-wonders",
          lane: "civic",
          label: "観光遺産を自力で量産",
          trigger: "生産に余裕があるとき",
          detail:
            "収奪で得られない観光遺産を自前で建てる。ひらめきで前提技術を先取りし、相手より早く押さえる。",
        },
        {
          type: "conditional",
          id: "cnd-tall-theater",
          lane: "civic",
          label: "劇場広場を全都市に増設",
          trigger: "区域枠が空くたび",
          detail:
            "偉人ポイントと大著作スロットを最大化し、純粋な観光量で相対ゲージを通す。",
        },
      ],
    },
    {
      id: "branch-nature",
      label: "自然観光ルート(海岸・高魅力の都市が多い)",
      detail:
        "海岸や魅力の高いタイルが多いなら、リゾート・国立公園・バイオスフィアで観光を稼ぐ。魅力の底上げが前提になる。",
      when: (s) => flag(s, "coastal.heavy"),
      nodes: [
        {
          type: "conditional",
          id: "cnd-eiffel",
          lane: "production",
          label: "エッフェル塔で全タイルの魅力+2",
          trigger: "製鋼を取得し、自然観光を狙うとき",
          detail:
            "領土の全タイルが魅力+2。シーサイドリゾートと国立公園の観光がまとめて伸びる前提条件。",
        },
        {
          type: "conditional",
          id: "cnd-resort-park",
          lane: "production",
          label: "シーサイドリゾート・国立公園を造成",
          trigger: "魅力が「絶景」級のタイルが揃ったとき",
          detail:
            "シーサイドリゾートは海岸タイルの魅力×2の観光。国立公園は内部タイルの魅力合計。森を植える・不要な地形を除去して魅力を上げる。",
        },
        {
          type: "conditional",
          id: "cnd-cristo",
          lane: "civic",
          label: "コルコバードのキリスト像",
          trigger: "マスメディアに到達したとき",
          detail:
            "シーサイドリゾートの観光2倍 + 啓蒙思想の観光ペナルティを除去。自然観光ルートの要。",
        },
        {
          type: "conditional",
          id: "cnd-biosphere",
          lane: "production",
          label: "バイオスフィアで再生可能エネルギーを観光化",
          trigger: "化学合成物質を取得し、河川隣接の近隣住区があるとき",
          detail:
            "洋上風力・太陽光・風力・地熱・水力ダムの電力に等しい観光力を得る。終盤の観光を大きく押し上げる。",
        },
      ],
    },
  ],
};
