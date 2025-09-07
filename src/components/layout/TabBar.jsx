// クライアントサイドで動作することを示す
"use client";
// Emotionのstyledをインポート
import styled from "@emotion/styled";

// --- スタイルを定義 ---
const Footer = styled.footer`
  background: #fff;
  border-top: 1px solid #eee;
  padding: 16px;
  text-align: center;
  font-size: 0.9rem;
  color: #555;
`;

/**
 * サイトのフッターコンポーネント
 * @returns {JSX.Element} レンダリングされるフッターコンポーネント
 */
export default function FooterComponent() {
  return (
    <Footer>
      <p>© 2023 Trip Mood. All rights reserved.</p>
    </Footer>
  );
}
