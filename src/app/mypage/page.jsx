"use client";
// Emotionのstyledをインポート
import styled from "@emotion/styled";

// --- Emotionでスタイルを定義 ---
const PageWrapper = styled.div`
  padding: 20px;
  text-align: center;
`;

/**
 * マイページのコンポーネント
 * @returns {JSX.Element}
 */
export default function MyPage() {
  return (
    <PageWrapper>
      <h1>マイページ</h1>
      <p>ここにお気に入りしたイベントなどが表示されます。</p>
    </PageWrapper>
  );
}
