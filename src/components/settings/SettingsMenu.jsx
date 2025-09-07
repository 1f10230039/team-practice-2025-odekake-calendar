// クライアントサイドで動作することを宣言
"use client";

import styled from "@emotion/styled";
// アイコン表示用のライブラリから、使いたいアイコンをインポート
import {
  FaBell,
  FaMoon,
  FaEnvelope,
  FaBuilding,
  FaChevronRight,
} from "react-icons/fa";

// --- Emotionでスタイル定義 ---
const MenuContainer = styled.div`
  margin-top: 60px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 16px;
  background: none;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f9f9f9;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 16px;
  background-color: #f0f2f5;
  border-radius: 50%;
  color: #555;
`;

const MenuLabel = styled.span`
  flex-grow: 1; /* ラベルが残りのスペースを全部使うようにする */
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;

const ChevronIcon = styled(FaChevronRight)`
  color: #ccc;
`;

/**
 * 設定画面のメニュー項目を表示するコンポーネント
 */
export default function SettingsMenu() {
  // メニューの情報を配列で管理すると、コードがスッキリするよ！
  const menuItems = [
    { icon: <FaBell />, label: "通知設定" },
    { icon: <FaMoon />, label: "ライト/ダークモード" },
    { icon: <FaEnvelope />, label: "お問い合わせ" },
    { icon: <FaBuilding />, label: "行政の方はこちら" },
  ];

  return (
    <MenuContainer>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          onClick={() => alert(`${item.label}がクリックされました！`)}
        >
          <IconWrapper>{item.icon}</IconWrapper>
          <MenuLabel>{item.label}</MenuLabel>
          <ChevronIcon />
        </MenuItem>
      ))}
    </MenuContainer>
  );
}
