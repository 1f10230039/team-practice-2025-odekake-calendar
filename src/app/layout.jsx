// Google Fontsを最適化して使用するための機能をインポート
import { Inter } from "next/font/google";
// サイト全体のグローバルCSSをインポート
import "./globals.css";
// Emotionのスタイルを管理するためのコンポーネントをインポート
import EmotionRegistry from "@/components/EmotionRegistry";
// サイト共通のヘッダーコンポーネントをインポート
import Header from "@/components/layout/Header";

// styled-componentsを使用してスタイルを定義
// Interフォントを読み込み、サブセットとCSS変数を指定
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// サイトのメタデータを定義
export const metadata = {
  title: "おでかけカレンダー",
  description: "あなたにピッタリなイベントを提案します",
};

/**
 * 全てのページに適用されるルートレイアウトコンポーネント
 * @param {Object} props - コンポーネントが受け取るプロパティ
 * @param {React.ReactNode} props.children - レイアウト内に表示される子要素
 * @param {JSX.Element} - ルートレイアウトコンポーネント
 */
export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      {/* InterフォントのCSS変数をbodyタグに適用 */}
      <EmotionRegistry>
        <body className={`${inter.variable}`}>
          {/* 共通ヘッダーを全ページに表示 */}
          <Header />
          {/* 各ページの内容がここにレンダリングされる */}
          <main>{children}</main>
        </body>
      </EmotionRegistry>
    </html>
  );
}
