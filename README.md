# Todo App

Next.js (App Router) + React + TypeScript で作った、現在時刻表示とTodoリスト機能を持つ小規模Webアプリです。

## 機能

- リアルタイムに更新される現在時刻表示
- Todoの追加・削除
- Route Handler(`/api/todos`)経由でのデータ取得

## 技術スタック

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- TypeScript
- ESLint

## セットアップ

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

## ディレクトリ構成

```
app/
  layout.tsx          # 全ページ共通のルートレイアウト (Server Component)
  page.tsx             # トップページ (Server Component)
  api/todos/route.ts   # Todo一覧を返すRoute Handler (GET /api/todos)
  components/
    Clock.tsx          # 現在時刻表示 (Client Component)
    TodoList.tsx        # Todo一覧の状態管理・API取得 (Client Component)
    TodoForm.tsx        # Todo追加フォーム (Client Component)
    TodoItem.tsx         # Todo1件の表示 (Server Component)
  types/todo.ts          # Todoの型定義
```
