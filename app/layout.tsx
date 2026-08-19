import type { Metadata } from "next";
import "./globals.css";

// metadata はこのファイル固有の Next.js の仕組み。
// <head> に入れる <title> や <meta description> を、
// JSXを直接書かずにこのオブジェクトを export するだけで生成してくれる。
// これは「Reactの機能」ではなく「Next.jsが用意した規約」であり、
// React単体のプロジェクトにはこの仕組みは存在しない。
export const metadata: Metadata = {
  title: "Todo App",
  description: "Current time display and a simple todo list",
};

// [Server Component と layout.tsx の役割]
// このファイルには "use client" が付いていない → デフォルトで Server Component。
// Server Component はサーバー上でしか実行されず、ブラウザにJSは送られない
// (完成したHTMLだけが送られる)。ここには state も useEffect も書けない。
// なぜここがServer Componentのままで困らないかというと、
// 「html/bodyタグを書く」「metadataを設定する」だけの役割で、
// クリックやタイマーのような“動き”を一切持たないから。
//
// [App Routerにおけるlayout.tsxの役割]
// app/layout.tsx は「全ページ共通の外枠」。App Routerの規約で、
// app/直下に置いた layout.tsx は必ず存在しなければならない
// (html/bodyタグを書けるのはここだけ。page.tsx側には書かない)。
// 同じ階層やサブフォルダに page.tsx を追加すると、
// 自動的にこの layout の中に差し込まれて描画される。
//
// [propsの具体例: children]
// children はこのコンポーネントが受け取る props の一つ。
// 「今アクセスされているページの中身（page.tsxが返すJSX）」が
// Next.jsによって自動的にここへ渡されてくる。
// つまり RootLayout 自身は中身の詳細を知らなくてよく、
// 「外枠だけ用意して、中身は呼び出し側（Next.js）に任せる」という
// propsの典型的な使い方になっている。
//
// [初心者が間違えやすい点]
// ・page.tsx側にも <html> や <body> を書いてしまうミスが多いが、
//   それは layout.tsx の責務なので書いてはいけない。
// ・「layoutだからstateを持たせたい」と考えて "use client" を
//   安易に付けがちだが、動きが不要ならServer Componentのままにして、
//   JSの配信量を減らすのが本来のNext.jsの狙い。
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
