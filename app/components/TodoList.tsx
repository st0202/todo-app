"use client";
// Clockと同じ理由で "use client" が必要。
// useStateを使う時点で「ブラウザ上で状態を持つ」コンポーネントになるため。

import { useEffect, useState } from "react";
import type { Todo } from "../types/todo";
import { TodoForm } from "./TodoForm";
import { TodoItem } from "./TodoItem";

export function TodoList() {
  // [配列のstateという考え方]
  // 「Todoが3件から4件に増える」というのは、見た目上は
  // 単なるリストの変化に見えるが、Reactの世界では
  // 「stateとして持っている配列そのものが、別の新しい配列に置き換わった」
  // という捉え方をする。中身がオブジェクトでも配列でも、
  // useStateの扱い方は数値や文字列のときと同じ。
  //
  // 最初は空配列で始め、下のuseEffectでAPIから取得したデータに置き換える。
  const [todos, setTodos] = useState<Todo[]>([]);

  // [なぜここでAPIから取得するのか / useEffectの役割の再確認]
  // 「画面が表示されたタイミングで、外部（ここでは自前のAPI）からデータを
  //  取ってくる」というのは、Reactのレンダリングそのもの（JSXの計算）ではなく
  // 副作用（side effect）にあたるため、Clockのタイマーと同じくuseEffectの中で行う。
  // 依存配列を[]にしているのもClockと同じ理由で、
  // 「このコンポーネントが最初に表示された時に1回だけ取得する」という意味になる。
  //
  // [なぜuseEffectの引数を直接asyncにできないのか]
  // useEffectの第1引数（副作用の関数）は「戻り値なし」または
  // 「クリーンアップ用の関数」を返すことが期待されている。
  // しかしasync関数は常にPromiseを返してしまうため、
  // useEffectの引数にそのままasync関数を渡すとReactの想定と食い違い、
  // 警告やクリーンアップの誤動作の原因になる。
  // そのため、useEffectの中で別途async関数を定義し、それを内側で呼び出す
  // （即座に実行する）という形をとる、これが定番のパターン。
  useEffect(() => {
    async function loadTodos() {
      // fetch: ブラウザ標準のAPIで、指定したURLにHTTPリクエストを送る。
      // ここでの "/api/todos" は、まさに今作ったRoute Handler
      // （app/api/todos/route.ts）に対応するURL。
      const res = await fetch("/api/todos");
      // レスポンスのボディをJSONとしてパースする処理も非同期なのでawaitが必要。
      const data: Todo[] = await res.json();
      setTodos(data);
    }

    loadTodos();
  }, []);

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

  // [削除もまた「新しい配列を作る」操作]
  // 追加のときはスプレッド構文で「増やした新しい配列」を作ったのと同様に、
  // 削除でも元の配列を直接いじる splice ではなく、
  // filter で「消したい1件“以外”を集めた新しい配列」を作って置き換える。
  // 「idがdeleteされる対象と一致しないものだけを残す」という発想で、
  // 結果的に該当の1件だけが除かれた配列がstateに設定される。
  function deleteTodo(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id));
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
          「<TodoItem>1個（JSX）」を返す変換を、配列の全要素に対して行っている。
          forループで1件ずつpushしていくのと結果的には同じだが、
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
          // 先頭のTodoを削除したときに「本来2番目だった要素」が
          // 誤って「1番目の要素」として扱われてしまい、
          // 入力途中の値やアニメーション状態が違う項目に化けるなどの
          // バグが起きやすい。だからこそTodo型に安定した`id`を持たせている
          // （テキスト内容ではなく、絶対に変わらないidをkeyにするのが正しい）。
          //
          // keyはこの<TodoItem>を呼び出す側（TodoList）でしか意味を持たない特殊な
          // propsで、TodoItem自身はkeyの値を受け取ることも参照することもできない。
          <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} />
        ))}
      </ul>
    </>
  );
}
