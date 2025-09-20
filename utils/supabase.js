// SupabaseのJavaScriptクライアントライブラリから、クライアント作成用の関数をインポート
import { createClient } from "@supabase/supabase-js";

// .env.localファイルからSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 必要な環境変数が設定されているかを確認
if (!supabaseUrl) {
  throw new Error(
    "SupabaseのURLが設定されていません。.env.localファイルを確認してください。"
  );
}
if (!supabaseAnonKey) {
  throw new Error(
    "Supabaseのanonキーが設定されていません。.env.localファイルを確認してください。"
  );
}

/**
 * クライアントサイド用のSupabaseクライアント
 * ブラウザで使用し、認証状態を管理します
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * サーバーサイド用のSupabaseクライアント
 * APIルートで使用し、RLSをバイパスしてデータベースにアクセスします
 */
export const supabaseServer = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey, 
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);