"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";

// --- Emotionでスタイルを定義 ---
const AuthWrapper = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px;
  border: none;
  border-radius: 4px;
  background-color: #0070f3;
  color: white;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #005bb5;
  }
`;

const ToggleButton = styled.button`
  margin-top: 20px;
  background: none;
  border: none;
  color: #0070f3;
  cursor: pointer;
  text-decoration: underline;
`;

/**
 * ログイン・サインアップページ
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // 新規登録モードか切り替える
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async e => {
    e.preventDefault();

    if (isSignUp) {
      // --- サインアップ処理 ---
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // 登録後、自動でログインしてマイページに遷移させる
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) {
        alert("エラーが発生しました: " + error.message);
      } else {
        alert("登録完了しました！マイページへ移動します。");
        router.push("/mypage");
      }
    } else {
      // --- ログイン処理 ---
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert("メールアドレスかパスワードが間違っています。");
      } else {
        router.push("/mypage");
      }
    }
  };

  return (
    <AuthWrapper>
      <h1>{isSignUp ? "新規登録" : "ログイン"}</h1>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="メールアドレス"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="パスワード"
          required
        />
        <Button type="submit">{isSignUp ? "登録する" : "ログイン"}</Button>
      </Form>
      <ToggleButton onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "ログイン画面へ" : "アカウントをお持ちでないですか？"}
      </ToggleButton>
    </AuthWrapper>
  );
}
