# 居酒屋ファインダー 🍺

AIが値段・人数・気分から最適な居酒屋を提案し、ホットペッパーで空き確認・予約まで繋げるNext.jsアプリです。

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成:

```bash
cp .env.local.example .env.local
```

`.env.local` を編集してAPIキーを設定:

```
GOOGLE_GENAI_API_KEY=your_gemini_api_key
HOTPEPPER_API_KEY=your_hotpepper_api_key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

### 3. ローカル起動

```bash
npm run dev
```

→ http://localhost:3000 で確認

## Vercelデプロイ

1. GitHubにプッシュ
2. Vercelでプロジェクトをインポート
3. **Environment Variables** に以下を追加:
   - `GOOGLE_GENAI_API_KEY`
   - `HOTPEPPER_API_KEY`
   - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
4. デプロイ！

## 機能

- **ステップ形式入力**: 予算 → 人数 → 気分の3ステップで条件入力
- **ホットペッパー検索**: 現在地周辺の居酒屋・バーを検索（オンライン予約可の店を優先）
- **Gemini AI分析**: 条件に合う店をTOP3に絞り込み、理由付きで提案
- **Mapbox地図表示**: TOP3を金銀銅メダルでハイライト表示
- **予約リンク**: ホットペッパーの予約ページへ直接遷移

## API構成

| エンドポイント | 説明 |
|---|---|
| `GET /api/search` | ホットペッパーAPIプロキシ（予算・位置で絞り込み） |
| `POST /api/gemini-analyze` | GeminiによるTOP3選定・コメント生成 |
