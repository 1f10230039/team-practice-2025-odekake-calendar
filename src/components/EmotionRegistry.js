// クライアントサイドで動作することを示す
"use client";

// 必要なReactフックとEmotionのライブラリをインポート
import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

/**
 * Next.jsのApp Router環境でEmotionのSSR（サーバーサイドレンダリング）を正しく機能させるための設定コンポーネント
 * サーバーで生成されたスタイルを抽出し、クライアントでのハイドレーションエラーを防ぐ
 * @param {object} props
 * @param {React.ReactNode} props.children - このコンポーネントでラップする子要素
 * @returns {JSX.Element}
 */
export default function EmotionRegistry({ children }) {
  const [{ cache, flush }] = useState(() => {
    // スタイルをキャッシュ（一時保存）するための場所を作成
    const cache = createCache({ key: "my-emotion-styles" });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  // サーバーサイドで挿入されたHTMLを扱うためのNext.jsのフック
  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }
    // サーバーで生成されたスタイルを<style>タグとしてHTMLに挿入
    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  // CacheProviderで子要素をラップし、Emotionがスタイルを正しく扱えるようにする
  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
