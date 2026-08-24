# React クイックスタート — このアプリを理解するための基礎知識

このアプリ (`app/components/*.tsx`) を読む前に知っておくと理解が早くなる、Reactの基本用語・考え方をまとめたもの。各ファイルの詳しいコメントを読む前の「地図」として使う。

## 1. コンポーネントとJSX

Reactアプリは「コンポーネント」という小さな部品を組み合わせて作る。1つのコンポーネント = 1つの関数で、HTMLに似た構文（JSX）を返す。

```tsx
function Hello() {
  return <p>こんにちは</p>;
}
```

このアプリでは `Clock`、`TodoForm`、`TodoList`、`TodoItem` がそれぞれ独立したコンポーネント。「見た目・操作のまとまりごとに分割する」のが基本方針(→ `app/components/TodoItem.tsx` 冒頭のコメント参照)。

## 2. props — 親から子への一方通行のデータの渡し方

コンポーネントは「props」という形で外から値を受け取れる。渡す側（親）は書き換えられるが、受け取る側（子）は読み取り専用として扱う。

```tsx
<TodoItem todo={todo} onDelete={deleteTodo} />
```

- `TodoList`(親) が `TodoItem`(子) に `todo` というデータと `onDelete` という関数をpropsとして渡している
- `TodoItem` 側は渡された `onDelete` を呼ぶだけで、削除の実装詳細は知らない

「子から親に何かを伝えたい」場合も、propsで受け取った関数を呼び出すことで実現する（→ `TodoForm` の `onAdd` がこの例）。

## 3. state — コンポーネント自身が持つ内部の記憶

`useState` は「このコンポーネント自身が管理し、自分の判断で更新していく値」を持つための仕組み。

```tsx
const [text, setText] = useState("");
```

- `text` が現在の値、`setText` がそれを更新する関数
- **値を直接書き換えてはいけない**（例: `text = "abc"` はNG）。必ず `setText("abc")` のように更新関数を呼ぶ。Reactは「更新関数が呼ばれたこと」をトリガーに再描画するため、直接の書き換えには気づけない

props(外から渡される)とstate(自分で持つ)の違いは `app/components/TodoForm.tsx` のコメントに具体例がある。

## 4. イベントハンドラ

ユーザーの操作（クリック、入力、送信など）に反応する関数。

```tsx
<button onClick={() => onDelete(todo.id)}>削除</button>
```

注意点: `onClick={onDelete(todo.id)}`(関数呼び出しの結果を渡す) と `onClick={() => onDelete(todo.id)}`(クリック時に実行される関数を渡す) は全く違う。前者は描画された瞬間に実行されてしまうバグになる。詳細は `app/components/TodoItem.tsx` のコメント参照。

## 5. 制御コンポーネント (controlled component)

`<input>` の値を、HTML標準の挙動に任せず、Reactのstateと常に一致させるパターン。

```tsx
<input value={text} onChange={(e) => setText(e.target.value)} />
```

これにより「今の入力内容」をJavaScript側からいつでも参照でき、バリデーションや送信後のクリアがしやすくなる（→ `app/components/TodoForm.tsx`）。

## 6. useEffect — 副作用（画面の外の世界に影響する処理）

コンポーネントの本来の仕事は「state/propsから見た目(JSX)を計算すること」。それ以外の処理（タイマー、API通信など）は `useEffect` に分離して書く。

```tsx
useEffect(() => {
  const timerId = setInterval(() => setNow(new Date()), 1000);
  return () => clearInterval(timerId); // クリーンアップ
}, []); // 依存配列が空 = 最初の表示時に1回だけ実行
```

- 第2引数（依存配列）が `[]` の場合「最初に表示された時だけ実行」
- returnした関数は「後片付け」として、コンポーネントが消える時に実行される（例: タイマー停止）

`Clock` (時計表示) と `TodoList` (API呼び出し) の両方でこのパターンを使っている。

## 7. 配列のstateとイミュータブル(不変)更新

Reactでは配列やオブジェクトのstateを直接書き換えず、常に「新しいものを作って置き換える」。

```tsx
// 追加: スプレッド構文で新しい配列を作る
setTodos([...todos, newTodo]);

// 削除: filterで対象以外を集めた新しい配列を作る
setTodos(todos.filter((todo) => todo.id !== id));
```

`push` や `splice` のように元の配列を直接いじる(破壊的変更)と、Reactが「変化した」と気づけず再描画されないことがある。理由の詳細は `app/components/TodoList.tsx` のコメント参照。

## 8. リストの描画と `key`

配列データをJSX要素の配列に変換するには `map` を使う。

```tsx
{todos.map((todo) => (
  <TodoItem key={todo.id} todo={todo} onDelete={deleteTodo} />
))}
```

`key` はReactが「前回のリストとの差分」を正しく検出するための目印。**配列のindexではなく、安定した一意なid** を使うのが正解（indexだと途中の要素を消した時に他の要素の状態がズレるバグの原因になる）。

## 9. TypeScriptの型

このアプリでは `.tsx`/`.ts` を使い、propsやデータの形に型を付けている。

```ts
export type Todo = {
  id: number;
  text: string;
  done: boolean;
};
```

型は開発時のチェック用で、ビルド後のJavaScriptには残らない。タイプミスやプロパティの入れ忘れをエディタ上・コンパイル時に検出できるのが利点（→ `app/types/todo.ts`）。

## 次に読むもの

- Next.js固有の概念（ルーティング、Server/Client Component等）は `STUDYING_NEXT.md` を参照
- 実際のコード＋詳しいコメントは `app/components/*.tsx` を読む
