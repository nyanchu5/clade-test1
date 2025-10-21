# UGC Video Generator

広告代理店向けのUGC（User Generated Content）動画自動生成システム

Sora2 APIを使用して、テキストプロンプトから高品質なUGC風の動画を自動生成します。

## 機能

- テキストプロンプトからの動画生成
- 生成した動画の履歴管理
- 動画のプレビュー・ダウンロード
- 広告代理店向けの使いやすいUI

## 技術スタック

### バックエンド
- Node.js + Express
- TypeScript
- SQLite (データベース)
- Sora2 API

### フロントエンド
- React
- TypeScript
- Vite

## セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn
- Sora2 APIキー

### インストール

1. リポジトリのクローン

```bash
git clone <repository-url>
cd clade-test1
```

2. 環境変数の設定

```bash
cp .env.example .env
```

`.env`ファイルを編集して、Sora2 APIキーを設定してください。

3. バックエンドのセットアップ

```bash
cd backend
npm install
npm run dev
```

4. フロントエンドのセットアップ（別のターミナルで）

```bash
cd frontend
npm install
npm run dev
```

## 使い方

1. ブラウザで `http://localhost:5173` にアクセス
2. プロンプトを入力して「生成」ボタンをクリック
3. 動画の生成が完了するまで待機
4. 生成された動画をプレビュー・ダウンロード

## API エンドポイント

### 動画生成

```
POST /api/videos/generate
Content-Type: application/json

{
  "prompt": "動画生成プロンプト",
  "duration": 5,
  "aspectRatio": "16:9"
}
```

### 動画一覧取得

```
GET /api/videos
```

### 動画詳細取得

```
GET /api/videos/:id
```

## ライセンス

MIT
