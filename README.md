# Civ6 勝利タスク

Civilization VI を遊ぶときの自分用ツール。文明・指導者・勝利条件・拡張・ゲームスピード・ゲームモードの組み合わせを選ぶと、**序盤・中盤・終盤** のタスクリストをルールベースで合成し、進捗をチェックしながら進められる。wiki として文明・勝利条件の攻略情報も参照できる。

完全クライアントサイドのローカル Web アプリ。進捗はブラウザの localStorage に保存され、サーバーや外部 DB は不要。

## 必要環境

- [bun](https://bun.sh)

## コマンド

```bash
bun install        # 初回のみ
bun run dev        # 開発サーバ (http://localhost:3000)
bun run build      # 本番ビルド
bun run start      # 本番サーバ
bun test           # ユニットテスト
bun run typecheck  # 型チェック (tsc --noEmit)
bun run lint       # biome による lint + format チェック
bun run lint:fix   # 自動修正
```

## 現在の収録状況

- 文明: **バビロン**(指導者 ハンムラビ)
- 勝利条件: **文化勝利**(他の勝利条件はセットアップ画面に「準備中」として表示)
- 前提環境: 拡張 **文明の興亡(Rise and Fall)** / スピード **オンライン** を既定とする
- 「嵐の訪れ(Gathering Storm)」専用要素(ピンガラのキュレーター昇進、ロックバンドなど)は
  `minRuleset: "gathering-storm"` で分離してあり、文明の興亡の設定では自動的に非表示になる

指導者・勝利条件・文明の追加は、必要になったときにデータファイルを足すだけで対応できる構造。

## ディレクトリ構成

```
src/
  app/            # Next.js App Router (トップ / games/[id] / wiki)
  components/     # SetupForm, GameCard, PhaseSection, TaskItem, ProgressBar
  lib/
    schema.ts     # Zod スキーマと型(データモデルの単一の真実)
    synthesize.ts # ルールベース合成エンジン(純粋関数)
    speed.ts      # ゲームスピード別の目安ターン換算
    storage.ts    # localStorage CRUD + Zod parse
  data/
    index.ts                  # 全データ集約(CIVILIZATIONS / ALL_FRAGMENTS など)
    labels.ts                 # enum の日本語ラベル
    civilizations/babylon.ts  # 文明・指導者データ(出典コメント付き)
    victories/culture.ts      # 文化勝利のタスク断片 + 攻略ガイド
    common/economy.ts         # 勝利条件非依存の内政基盤タスク
```

## データの追加方法

### タスクを追加・調整する

`src/data/victories/<勝利条件>.ts` や `src/data/common/*.ts` に `TaskFragment` を足す。
合成は `applies` 条件で行われる:

```ts
{
  id: "culture-mid-museums",     // 一意。重複は自動で排除される
  title: "美術博物館と考古学博物館を建てる",
  detail: "...",                 // クリックで開く解説(任意)
  phase: "mid",                  // early | mid | late
  applies: {
    victories: ["culture"],      // 対象勝利条件。"any" は勝利条件非依存
    civs: ["babylon"],           // 文明限定(省略すると全文明汎用)
    minRuleset: "rise-and-fall", // この拡張以上で出現(省略可)
    requiresModes: [...],        // 特定ゲームモード前提(省略可)
  },
  priority: 10,                  // フェーズ内の並び順(小さいほど先)
  targetEra: "medieval",         // 目安の時代(任意)
  targetTurnStandard: 90,        // 標準スピードでの目安ターン。speed.ts が各スピードへ換算
}
```

### 文明を追加する

`src/data/civilizations/<id>.ts` に `Civilization`(`satisfies Civilization`)を定義し、
`src/data/index.ts` の `CIVILIZATIONS` に追加する。

### 勝利条件を解禁する

データを投入したら `src/data/index.ts` の `IMPLEMENTED_VICTORIES` にその勝利条件を加えると、
セットアップ画面で選択可能になる。

## データの出典

ゲーム内の数値・能力は公式 wiki / Fandom などの一次情報で裏取りし、各データファイルの
冒頭に参照元をコメントで残している(確認時点: 2026-06)。
