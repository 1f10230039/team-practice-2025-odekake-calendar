// クライアントサイドで動作する
"use client";
// Emotionのstyledをインポート
import styled from "@emotion/styled";
// Next.jsのLinkをインポート
import Link from "next/link";
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

  /* isActiveプロパティを受け取って、色を動的に変更する */
  color: ${({ isActive }) => (isActive ? "#1877f2" : "#65676b")};
  font-weight: ${({ isActive }) => (isActive ? "600" : "normal")};

  /* 色が変わる時のアニメーション */
  transition: color 0.2s ease-in-out;

  /* ホバーした時の変化 */
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
  // 例: カレンダー画面なら "/"、チャット画面なら "/chat"
  const pathname = usePathname();

  // タブの情報を配列で管理すると、コードがスッキリするよ！
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
          // 現在のURL(pathname)とタブのリンク先(href)が一致したら、isActiveをtrueにする
          isActive={pathname === tab.href}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </TabItem>
      ))}
    </TabBarContainer>
  );
}
