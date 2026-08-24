"use client";
// Clockと同じ理由で "use client" が必要。
// useStateを使う時点で「ブラウザ上で状態を持つ」コンポーネントになるため。

import { useState } from "react";
import type { Todo } from "../types/todo";
import { TodoForm } from "./TodoForm";

// 最初に表示するダミーデータ。
// 本来はサーバーやAPIから取得するものだが、まずは
// 「配列を表示する」という部分だけに集中するため、決め打ちの値から始める。
const initialTodos: Todo[] = [
  { id: 1, text: "Reactの基礎を復習する", done: false },
  { id: 2, text: "Next.jsのApp Routerを触ってみる", done: true },
];

export function TodoList() {
  // [配列のstateという考え方]
  // 「Todoが3件から4件に増える」というのは、見た目上は
  // 単なるリストの変化に見えるが、Reactの世界では
  // 「stateとして持っている配列そのものが、別の新しい配列に置き換わった」
  // という捉え方をする。中身がオブジェクトでも配列でも、
  // useStateの扱い方は数値や文字列のときと同じ。
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  // [なぜ todos.push(newTodo) と書いてはいけないのか]
  // push は元の配列そのものを書き換える（破壊的変更）。
  // 仮にpushした後にsetTodos(todos)を呼んでも、
  // Reactは「setTodosに渡された配列」と「今のstateの配列」が
  // 同じ参照（同じオブジェクト）かどうかで「変わったかどうか」を判定するため、
  // 中身を書き換えただけの同じ配列を渡しても「変化なし」とみなされ、
  // 再描画がスキップされてしまうことがある。
  // そのため、スプレッド構文 [...todos, newTodo] で
  // 「既存の要素はそのままに、末尾に1件加えた“別の新しい配列”」を作り、
  // それをsetTodosに渡している。これがReactでいう
  // 「stateはイミュータブル（不変）に扱う」という原則の具体例。
  function addTodo(text: string) {
    const newTodo: Todo = {
      // Date.now()は「今の時刻をミリ秒で返す」簡易的な一意ID生成。
      // 本来はサーバー/DBがIDを採番するのが望ましいが、
      // ここではAPIと繋ぐ前の学習用の割り切りとして採用している。
      id: Date.now(),
      text,
      done: false,
    };
    setTodos([...todos, newTodo]);
  }

  return (
    <>
      {/*
        [ここがpropsの実例]
        onAdd={addTodo} という形で、TodoList自身が持つ関数を
        子コンポーネントであるTodoFormにpropsとして渡している。
        TodoForm側は「渡された関数を呼ぶ」だけで、
        配列がどう更新されるかの詳細（スプレッド構文など）を一切知らない。
        こうして「入力欄の見た目・操作」と「データの持ち方・更新ロジック」の
        責務を分離できるのが、コンポーネントを分割する意義の一つ。
      */}
      <TodoForm onAdd={addTodo} />
      <ul>
      {/*
        [map: 配列データをJSX要素の配列に変換する]
        Reactは「JSX要素の配列」をそのまま描画できる。
        todos.map(...) は「Todoオブジェクト1個」を受け取って
        「<li>1個（JSX）」を返す変換を、配列の全要素に対して行っている。
        forループで1件ずつ<li>をpushしていくのと結果的には同じだが、
        「配列→配列への変換」という宣言的な書き方がReactでは好まれる。
      */}
      {todos.map((todo) => (
        // [keyがなぜ必要か]
        // Reactは再描画のたびに「前回のリスト」と「今回のリスト」を比較し、
        // 変化した部分だけを効率よく画面に反映する（差分更新）。
        // その比較のために、リストの各要素に「これは前回のどの要素と同じものか」
        // を教える目印がkeyで、兄弟要素の中で一意である必要がある。
        //
        // もしkeyを付けなかったり、配列のindex（0,1,2...）をkeyにすると、
        // 例えば先頭のTodoを削除したときに「本来2番目だった要素」が
        // 誤って「1番目の要素」として扱われてしまい、
        // 入力途中の値やアニメーション状態が違う項目に化けるなどの
        // バグが起きやすい。だからこそTodo型に安定した`id`を持たせている
        // （テキスト内容ではなく、絶対に変わらないidをkeyにするのが正しい）。
        <li
          key={todo.id}
          // [条件分岐: 完了済みなら見た目を変える]
          // JSXの中に直接if文は書けないため、三項演算子(条件 ? A : B)を使い、
          // 「doneがtrueなら打ち消し線、falseなら通常表示」を切り替えている。
          // これはstateの値（todo.done）によって見た目を変える、
          // Reactにおける最も基本的な条件分岐の書き方。
          style={{ textDecoration: todo.done ? "line-through" : "none" }}
        >
          {todo.text}
        </li>
      ))}
      </ul>
    </>
  );
}
