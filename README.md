これは [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) で作成した [Next.js](https://nextjs.org) プロジェクトです。

## はじめに

まずローカルのSupabaseスタックを起動します（初回は `npx supabase start` の実行に少し時間がかかります）。

```bash
npx supabase start
```

続いて開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと結果が確認できます。

`src/app/page.tsx` を編集するとページが自動的に更新されます。

このプロジェクトは [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) を使い、Vercelのフォントである [Geist](https://vercel.com/font) を自動的に最適化・読み込みしています。

## デバッグ・動作確認

開発中によく使うコマンドや確認先をまとめておく。

### ローカルSupabaseの状態を見る

```bash
npx supabase status
```

起動中のコンテナ一覧やURL・キーの一覧が表示される。`docker ps` でも起動中のコンテナ（`supabase_xxx_Techlog`）を確認できる。

### DBの中身を見る（Supabase Studio）

http://127.0.0.1:54323 をブラウザで開くと、テーブルの中身やSQLエディタをGUIで操作できる。

### 送信されたメールを見る（Mailpit）

ローカル環境ではメールは実際には届かず、Mailpitというテスト用の受信箱に溜まる（詳細は
[学習メモ](docs/技術スタック整理アプリ_学習メモ.md) を参照）。

http://127.0.0.1:54324 をブラウザで開くと、マジックリンクなどの送信済みメールを確認できる。

### DBを最初の状態に戻す

マイグレーション（`supabase/migrations/`）とシードデータ（`supabase/seed.sql`）を最初から流し直す。

```bash
npx supabase db reset
```

### `config.toml` を変更したとき

`supabase/config.toml`（メールテンプレートの設定など）を変更しても、起動中のSupabaseには反映されない。
一度止めてから起動し直す必要がある。

```bash
npx supabase stop
npx supabase start
```

### 型定義を再生成する

テーブルのスキーマを変更したら、TypeScriptの型定義を作り直す。

```bash
npx supabase gen types typescript --local | grep -v "^Connecting to db" > src/types/database.types.ts
```

`grep -v` を挟んでいるのは、コマンドの接続ログが標準出力に混ざり込んでファイルの1行目に紛れ込むのを防ぐため。

### 本番（Vercel）のデプロイ結果を確認する

pushした後、GitHub CLIでビルド・デプロイの成否を確認できる。

```bash
gh api repos/yotti773/tech-stack-log/commits/<コミットSHA>/status
```

`"state"` が `"success"` になれば反映完了。`"failure"` の場合はVercelのダッシュボードでビルドログを確認する。

## もっと詳しく

Next.jsについてもっと知りたい場合は、以下のリソースを参照してください。

- [Next.js Documentation](https://nextjs.org/docs) - Next.jsの機能やAPIについて学べます。
- [Learn Next.js](https://nextjs.org/learn) - 対話形式のNext.jsチュートリアルです。

[Next.jsのGitHubリポジトリ](https://github.com/vercel/next.js) もぜひ見てみてください。フィードバックや貢献も歓迎されています。

## Vercelへのデプロイ

Next.jsアプリを最も簡単にデプロイする方法は、Next.jsの開発元が提供する [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) を使うことです。

詳しくは [Next.jsのデプロイに関するドキュメント](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。
