// SupabaseのJavaScriptクライアントライブラリから、クライアント作成用の関数をインポート
import { createClient } from "@supabase/supabase-js";

// .env.localファイルからSupabaseの接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
 * アプリケーション全体で共有して使用するSupabaseクライアントのインスタンス
 * このクライアントを通じて、データベースの読み書きや認証などを行う
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
