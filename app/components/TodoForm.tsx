"use client";

import { useState, type FormEvent } from "react";

// [propsの型定義]
// このコンポーネントが「外から受け取る値」の形を定義している。
// onAdd は「文字列を1つ受け取り、何も返さない関数」という型。
// 関数そのものをpropsとして渡せるのがReactの重要な特徴で、
// 「子コンポーネントが親に何かを伝えたい時は、
//  親から渡された関数を呼び出す」という一方向の約束事になっている。
type TodoFormProps = {
  onAdd: (text: string) => void;
};

// [props vs state の違い（ここが一番わかりやすい例）]
// ・onAdd は「props」＝ 親コンポーネント（呼び出し側）から渡されてくる値。
//   このコンポーネント自身はonAdd自体を書き換えることはできないし、
//   書き換える必要もない。「外から渡された道具を使うだけ」という関係。
// ・下のtextは「state」＝ このコンポーネント自身が持ち、
//   自分の判断で更新していく値。他のコンポーネントはtextの存在を知らないし、
//   直接読み書きすることもできない。
// まとめると、propsは「親→子への一方通行の受け渡し」、
// stateは「自分自身が管理する内部の記憶」という、役割も所有者も別物。
export function TodoForm({ onAdd }: TodoFormProps) {
  // [制御コンポーネント(controlled component)という考え方]
  // input要素は本来、ブラウザが入力値を自分で保持できる（HTML標準の挙動）。
  // しかしReactでは value={text} と onChange をセットで使うことで、
  // 「入力欄の値は常にReactのstate(text)と一致させる」という状態にする。
  // これにより「今の入力内容」をReact側のJavaScriptからいつでも参照でき、
  // バリデーションや、送信後に入力欄を空にする、といった制御がしやすくなる。
  const [text, setText] = useState("");

  // [onChange: 入力のたびに呼ばれるイベントハンドラ]
  // ユーザーが1文字打つたびにこの関数が呼ばれ、e.target.value（今の入力値）で
  // stateを更新する。setTextが呼ばれる→再描画される→
  // value={text}に新しい値が反映される、というサイクルで
  // 「入力した文字がそのまま画面に表示される」動きが実現されている。
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setText(event.target.value);
  }

  // [form / onSubmit / preventDefault]
  // <form>は本来、送信ボタンが押されるとブラウザがページ全体を
  // 再読み込みしてサーバーにデータを送ろうとする（HTML標準の挙動）。
  // これはReactのSPA的な動き方とは相性が悪い（画面が全部リロードされてしまう）ため、
  // event.preventDefault() でその標準動作を止め、
  // 代わりにJavaScript側（onAdd呼び出し）だけで処理を完結させている。
  //
  // [なぜbuttonのonClickではなくformのonSubmitで処理するのか]
  // onSubmitにしておくと、送信ボタンのクリックだけでなく
  // 「input内でEnterキーを押す」操作でも同じように送信されるため、
  // ユーザー体験として自然になる（ボタンだけを見るとその違いに気づきにくい）。
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = text.trim();
    if (trimmed === "") return; // 空文字だけのTodoを追加させない簡易バリデーション

    // [子から親への「伝達」]
    // TodoForm自身はTodo一覧を持っていない（持っているのは呼び出し元）。
    // だから「追加して」と自分で処理するのではなく、
    // propsで受け取ったonAdd関数を呼び出すことで、
    // 「実際に配列へ追加する処理」は親コンポーネントに委ねている。
    onAdd(trimmed);

    setText(""); // 送信後、自分のstateだけを空文字に戻して入力欄をクリア
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="新しいTodoを入力"
      />
      <button type="submit">追加</button>
    </form>
  );
}
