import type { Todo } from "../types/todo";

// [なぜコンポーネントを分割するのか]
// TodoListの中に<li>...</li>をそのまま書き続けることもできるが、
// 「1件のTodoの見た目と操作」という単位で切り出しておくと、
// ・TodoList側は「一覧をどう並べるか」だけに集中できる
// ・TodoItem側は「1件をどう表示・操作するか」だけに集中できる
// というように責務が分かれ、それぞれが読みやすく、テストや変更もしやすくなる。
// 「機能・見た目のまとまりごとに小さい部品に分ける」のがReactの基本設計思想。
type TodoItemProps = {
  todo: Todo;
  onDelete: (id: number) => void;
};

// [propsの受け取り方]
// 呼び出し側（TodoList）から <TodoItem todo={...} onDelete={...} /> の形で
// 渡された値を、関数の引数として分割代入で受け取っている。
// todoは「表示すべきデータ」、onDeleteは「削除したい時に呼ぶ関数」で、
// どちらもこのコンポーネント自身が作り出したものではなく、外から与えられたもの
// ＝ propsであり、このファイルの中で書き換えることはない（読み取り専用として扱う）。
export function TodoItem({ todo, onDelete }: TodoItemProps) {
  return (
    <li style={{ textDecoration: todo.done ? "line-through" : "none" }}>
      {todo.text}
      {/*
        [イベントハンドラとpropsの組み合わせ]
        onClickで直接onDelete(todo.id)を呼ぶのではなく、
        アロー関数 () => onDelete(todo.id) で包んでいる点に注意。
        もし onClick={onDelete(todo.id)} と書いてしまうと、
        「クリックされた時に実行する関数」を渡すのではなく、
        「描画されたその瞬間にonDeleteを呼び出した“結果”」を渡すことになり、
        ボタンを描画した瞬間に削除が実行されてしまうバグになる
        （初心者が非常につまずきやすいポイント）。
        () => onDelete(todo.id) と書くことで、
        「クリックされたら実行される関数」を正しく渡せる。
      */}
      <button onClick={() => onDelete(todo.id)}>削除</button>
    </li>
  );
}
