// サーバー側で使用するSupabaseクライアント
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("SupabaseのURLが未設定です。環境変数 NEXT_PUBLIC_SUPABASE_URL を設定してください。");
}
if (!supabaseServiceKey) {
  throw new Error("Supabaseのキーが未設定です。SUPABASE_SERVICE_ROLE_KEY もしくは NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください。");
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});


