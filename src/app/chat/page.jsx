// クライアントサイドで動作する
"use client";
// Emotionのstyledをインポート
import styled from "@emotion/styled";

// --- Emotionでスタイルを定義 ---
const PageWrapper = styled.div`
  padding: 20px;
  text-align: center;
`;

/**
 * AIチャットページのコンポーネント
 * @returns {JSX.Element}
 */
export default function ChatPage() {
  return (
    <PageWrapper>
      <h1>AIチャット</h1>
      <p>ここでAIと会話して、おすすめのイベントを探せます。</p>
    </PageWrapper>
  );
}
