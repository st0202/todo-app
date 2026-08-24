import { NextResponse } from "next/server";
import type { Todo } from "../../types/todo";

// [Route Handlerとは何か]
// app/api/todos/route.ts というファイルパス自体が、Next.js App Routerの規約で
// 「 /api/todos というURLに対するAPIエンドポイント」を意味する。
// page.tsxがHTMLページを作るためのファイルなのに対し、
// route.tsは「HTMLを返さない、JSONなどを返すエンドポイント」を作るためのファイル。
// この中で export した関数名（GET, POST, PUT, DELETEなど）が、
// そのままHTTPメソッドに対応する。
//
// [ReactとNext.jsの役割の違いがここで見える]
// React自体は「UIをどう組み立てて描画するか」だけを担当するライブラリで、
// サーバー側のAPIエンドポイントを作る機能は持っていない。
// このRoute Handlerのような「ルーティング規約」「サーバー機能」は、
// React本体ではなくNext.jsというフレームワークが追加している部分。
// つまり「ReactはUI部品、Next.jsはUIを含むアプリ全体の土台（ルーティング・
// サーバー機能・ビルドの仕組みなど）」という役割分担になっている。

// 本来はデータベースに保存すべきだが、学習用に「サーバーのメモリ上の配列」を
// 仮のデータストアとして使う。サーバープロセスを再起動すると内容は消える点に注意
// （これは今回の学習目的の簡略化であり、実運用ではDBを使うのが前提）。
const todos: Todo[] = [
  { id: 1, text: "Reactの基礎を復習する", done: false },
  { id: 2, text: "Next.jsのApp Routerを触ってみる", done: true },
];

// [async / await とは]
// 本来ここでのデータ取得先がデータベースやファイルであれば、
// 「結果が返ってくるまで時間がかかる処理」になる（＝非同期処理）。
// asyncを付けた関数は必ずPromise（将来値が返ってくる箱）を返すようになり、
// その中でawaitを使うと「Promiseの結果が返ってくるまで、この関数の続きを
// 一時停止して待つ」という書き方ができる。
// 今回はメモリ上の配列を返すだけなので実際には待つ処理は無いが、
// Route Handlerの関数は「非同期処理を書ける前提」で設計されているため、
// 実務コードとの一貫性のためasync関数として定義している。
export async function GET() {
  // NextResponse.json(...) は「JSON形式のレスポンスを組み立てるNext.jsのヘルパー」。
  // これによりブラウザ側のfetchで受け取った際に .json() でオブジェクトに変換できる。
  return NextResponse.json(todos);
}
