// [App RouterとFile-based Routingの仕組み]
// このファイルが app/page.tsx という「場所」にあること自体が意味を持つ。
// Next.js App Routerはファイル名とフォルダ構造で自動的にルーティングする規約なので、
// app/page.tsx は「 / (トップページ)」に対応する。
// pages.tsxではなく必ず page.tsx という名前でなければならない
// （page.tsx以外の名前のファイルはルートとして認識されない）。
//
// [これもServer Component]
// このファイルにも "use client" が無いので、デフォルトのServer Component。
// 現時点ではまだstateも onClick も使っていないので、これで問題ない。
// 後の手順でここに時計コンポーネントやTodoリストを「呼び出す」形で追加していくが、
// 呼び出される側（子コンポーネント）だけを "use client" にすれば十分で、
// このpage.tsx自体はServer Componentのままにできる
// （Server ComponentがClient Componentを子として持つのは正常なパターン）。
export default function Home() {
  return (
    <main>
      <h1>Todo App</h1>
    </main>
  );
}
