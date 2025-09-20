"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";

// --- Emotionでスタイルを定義 ---
const PageWrapper = styled.div`
  padding: 20px;
  text-align: center;
`;

const UserInfo = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f0f8ff;
  border-radius: 8px;
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #dc3545;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #c82333;
  }
`;

/**
 * マイページのコンポーネント
 */
export default function MyPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        // 現在のログインセッションを取得
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        // この時点でエラーがあれば、それはトークンが無いということ
        if (error) throw error;

        if (session) {
          setUser(session.user);
        } else {
          // セッションがなければログインページへリダイレクト
          router.push("/login");
        }
      } catch (error) {
        // ここでエラーをキャッチ！
        console.error("セッション取得エラー:", error.message);
        // エラーが起きた場合もログインページへ飛ばす
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [supabase, router]);

  // --- ログアウト処理 ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    // ログアウト後にログインページへリダイレクト
    router.push("/login");
  };

  // ユーザー情報の読み込み中はローディング表示
  if (loading) {
    return <PageWrapper>読み込み中...</PageWrapper>;
  }

  // ユーザー情報がある場合のみページ内容を表示
  return (
    user && (
      <PageWrapper>
        <h1>マイページ</h1>
        <UserInfo>
          <p>ようこそ！</p>
          <p>
            <strong>{user.email}</strong>さん
          </p>
        </UserInfo>
        <p>ここにお気に入りしたイベントなどが表示されます。</p>
        <LogoutButton onClick={handleLogout}>ログアウト</LogoutButton>
      </PageWrapper>
    )
  );
}
