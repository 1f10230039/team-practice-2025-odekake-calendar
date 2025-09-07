// クライアントサイドで動作する
"use client";
// Emotionのstyledをインポート
import styled from "@emotion/styled";
// Next.jsのLinkをインポート
import Link from "next/link";
// usePathnameをインポート
import { usePathname } from "next/navigation";
// react-icons/fa から使いたいアイコンをインポート
import { FaCalendarAlt, FaComments, FaUser } from "react-icons/fa";

// --- Emotionでスタイルを定義 ---
// タブバー全体を囲むコンテナースタイル
const TabBarContainer = styled.nav`
  background-color: #ffffff;
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.08);
  padding-bottom: env(safe-area-inset-bottom);
`;

// Linkコンポーネントにスタイルを当てる
const TabItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 12px;
  gap: 5px;
  flex-grow: 1;
  height: 100%;

  /* 通常時のスタイル */
  color: #65676b;
  font-weight: normal;
  transition: color 0.2s ease-in-out;

  /* data-active属性がtrueの要素にだけ、このスタイルを適用する */
  &[data-active="true"] {
    color: #1877f2;
    font-weight: 600;
  }

  &:hover {
    color: #1877f2;
  }
`;

/**
 * 画面下部に表示するタブバーコンポーネント
 * @returns {JSX.Element} タブバーコンポーネント
 */
export default function TabBar() {
  // usePathnameフックで、現在のページのURLを取得する
  const pathname = usePathname();

  // タブの情報を管理する配列
  const tabs = [
    { href: "/", icon: <FaCalendarAlt size={22} />, label: "カレンダー" },
    { href: "/chat", icon: <FaComments size={22} />, label: "AIチャット" },
    { href: "/mypage", icon: <FaUser size={22} />, label: "マイページ" },
  ];

  return (
    <TabBarContainer>
      {tabs.map(tab => (
        <TabItem
          key={tab.href}
          href={tab.href}
          // 現在のURL(pathname)とタブのリンク先(tab.href)が同じかどうかを判断して、結果を data-active に渡す
          data-active={pathname === tab.href}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </TabItem>
      ))}
    </TabBarContainer>
  );
}
