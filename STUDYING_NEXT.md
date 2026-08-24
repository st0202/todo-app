# Next.js クイックスタート — このアプリを理解するための基礎知識

React自体は「UIをどう組み立てるか」だけを担当するライブラリ。Next.jsはその上に、ルーティングやサーバー機能、ビルドの仕組みなど「アプリ全体の土台」を追加するフレームワーク。このアプリ (`app/`) で使われている規約を、実例つきでまとめる。

## 1. App Router — ファイルパスがそのままURLになる

Next.jsの App Router は「ファイル名・フォルダ構造」で自動的にルーティングする規約。

| ファイルパス | 意味 |
|---|---|
| `app/page.tsx` | `/`（トップページ） |
| `app/layout.tsx` | 全ページ共通の外枠 |
| `app/api/todos/route.ts` | `/api/todos` というAPIエンドポイント |

- ページを作るファイルは必ず `page.tsx` という名前でなければならない
- APIを作るファイルは必ず `route.ts` という名前でなければならない

## 2. layout.tsx — 全ページ共通の外枠

`app/` 直下の `layout.tsx` は必ず存在しなければならない規約ファイル。`<html>`/`<body>` タグを書けるのはここだけ（`page.tsx` 側には書かない）。

```tsx
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
```

`children` は「今アクセスされているページの中身（`page.tsx` が返すJSX）」がNext.jsによって自動的に渡されてくるprops。`metadata` というオブジェクトをexportするだけで `<title>` や `<meta description>` を生成できるのもNext.js固有の仕組み（Reactそのものの機能ではない）。

## 3. Server Component と Client Component

App Routerでは、コンポーネントは**デフォルトでServer Component**。

|  | Server Component | Client Component |
|---|---|---|
| 実行場所 | サーバー上で1回だけ | サーバー(初回)→ブラウザ上で動き続ける |
| ブラウザに送られるもの | 完成したHTMLのみ | HTML + JS |
| `useState`/`useEffect` | 使えない | 使える |
| 宣言方法 | 何もしない（デフォルト） | ファイル先頭に `"use client"` |

```tsx
"use client"; // このファイルをClient Componentに切り替える宣言
```

- `"use client"` は**ファイル単位**の宣言。使う側まで自動的にClient Componentになるわけではない
- 「動きが必要な部分（state/イベント/タイマー）だけ」をClient Componentにし、それ以外はServer Componentのままにするのが基本方針（＝ブラウザに送るJSを減らせる）

このアプリでは:
- `app/page.tsx`、`app/layout.tsx` → Server Component（"use client" なし）
- `Clock`、`TodoForm`、`TodoList` → Client Component（stateやイベントを使うため "use client" あり）
- `TodoItem` → propsを受け取って表示するだけで、実は"use client"なしでも動く構成になっている点に注目

**Server ComponentがClient Componentを子として呼び出す**のが推奨パターン（`page.tsx` が `<Clock />` や `<TodoList />` を呼んでいるのがその実例）。

## 4. Route Handler — APIエンドポイントの作り方

`app/api/todos/route.ts` のように `route.ts` という名前のファイルを置くと、そのフォルダパスがAPIのURLになる。

```ts
export async function GET() {
  return NextResponse.json(todos);
}
```

- exportした関数名（`GET`, `POST`, `PUT`, `DELETE` など）がそのままHTTPメソッドに対応する
- `NextResponse.json(...)` はJSON形式のレスポンスを組み立てるNext.jsのヘルパー
- ブラウザ側からは通常の `fetch("/api/todos")` で呼び出せる（→ `app/components/TodoList.tsx` の `useEffect` 内）

## 5. async/await（Route Handlerでよく使う）

データ取得など「結果が返ってくるまで時間がかかる処理」を扱うための書き方。

```ts
export async function GET() {
  const data = await someSlowOperation();
  return NextResponse.json(data);
}
```

`async` を付けた関数は必ず Promise（将来値が返ってくる箱）を返す。`await` はその中で「結果が返るまで待つ」という意味。

## 6. 用語まとめ

| 用語 | 一言でいうと |
|---|---|
| App Router | ファイル構造でルーティングを決める仕組み |
| `page.tsx` | 1つのURLに対応するページの中身 |
| `layout.tsx` | 複数ページで共有される外枠 |
| Route Handler (`route.ts`) | HTMLではなくJSON等を返すAPIエンドポイント |
| Server Component | サーバーでのみ実行され、HTMLだけをブラウザに送る（デフォルト） |
| Client Component | ブラウザ上でも実行され、state/イベントが使える（`"use client"` が必要） |
| metadata | `<title>` 等をJSXを書かずに設定するNext.js独自の仕組み |

## 次に読むもの

- React自体の基礎（props/state/useEffectなど）は `STUDYING_REACT.md` を参照
- 実際のコード＋詳しいコメントは `app/page.tsx`、`app/layout.tsx`、`app/api/todos/route.ts` を読む
