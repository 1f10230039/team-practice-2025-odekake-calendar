// クライアントサイドで動作する
"use client";
// Emotionのstyledをインポート
import styled from "@emotion/styled";

// --- Emotionでスタイルを定義 ---
// ヘッダー全体を囲むコンテナースタイル
// ヘッダー全体を囲むコンテナースタイル
const HeaderWrapper = styled.header`
  background-color: #ffffff;
  height: 60px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

// サイトのメインタイトルのスタイル
const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
`;
// ユーザーアイコンのスタイル
const UserIcon = styled.img``;
/**
 * サイトのロゴやユーザーアイコンを表示させるヘッダーコンポーネント
 * @returns  {JSX.Element} ヘッダーコンポーネント
 */
export default function Header() {
  return (
    <HeaderWrapper>
      <Title>北区イベントカレンダー</Title>
      <UserIcon src="https://placehold.co/40x40/EFEFEF/3A3A3A?text=U" />
    </HeaderWrapper>
  );
}
