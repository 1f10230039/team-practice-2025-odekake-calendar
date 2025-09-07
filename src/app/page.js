// クライアントサイドで動作する
"use client";
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
export default function Calender() {
  return (
    <PageWrapper>
      <h1>カレンダー</h1>
      <p>ここにカレンダー画面が表示されます。</p>
    </PageWrapper>
  );
}
