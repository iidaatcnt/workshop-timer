# 仕様書 (SPEC)

## 概要
Next.js (App Router) + Tailwind CSS + Lucide React で構築された、フロントエンド完結型のポモドーロタイマー・Webアプリケーション。

## 機能要件

### 1. タイマーモード
- **Pomodoro (Focus)**
  - デフォルト設定：25分
  - デザインテーマ：赤色ベース（Tomato）
- **Basil Break (Break)**
  - デフォルト設定：5分
  - デザインテーマ：緑色ベース（Basil）

### 2. 時間調整機能
- メイン画面の `+` `-` ボタンにより、現在アクティブなモードの時間を1分（60秒）単位で即座に増減可能。
- 変更結果はフッター部分のインジケーター（Pomodoro: xx m / Break: xx m）にもリアルタイムで連動して表示される。

### 3. 自動ループ機能 (Auto Loop)
- フッターに設置されたトグルスイッチにより、ループのON/OFFを管理。
- **ONの場合**: カウントが0になった際、アラームが鳴ると同時に自動で次のモードへ移行し、タイマーが再スタートする。
- **OFFの場合**: カウントが0になった際、アラームが鳴ってタイマーは一時停止する。次へ進むにはユーザーの手動操作が必要。

### 4. サウンド機能 (Web Audio API)
- 外部の音声ファイルに依存せず、ブラウザの `AudioContext` を用いて発音。
- **カウントダウン**: 残り3秒以下になった際、毎秒鳴る可愛らしいポップ音。
- **アラーム**: タイマー終了時に鳴る、2和音のベル音。

## 技術スタック・アーキテクチャ
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS (ユーティリティクラスによる条件分岐スタイリング `cn` 活用)
- **Icons**: Lucide React
- **State Management**: React Hooks (`useState`, `useCallback`, `useEffect`) によるローカルステート管理 (`src/hooks/usePomodoro.ts`)
