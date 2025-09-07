// Supabaseクライアントのインスタンスをインポート
import { supabase } from "../../utils/supabase";
// データを表示するためのクライアントコンポーネントをインポート
import Homepage from "@/components/calendar/Homepage";

/**
 * カレンダーコンポーネントとイベントカードコンポーネントを生成するサーバーコンポーネント
 */
export default async function Page() {
  // 'events'テーブルからデータをすべて選択
  const { data: events, error } = await supabase.from("events").select("*");

  // データ取得中にエラーが発生した場合の処理
  if (error) {
    console.error("観光地データの取得に失敗しました:", error.message);
    notFound();
  }

  // 取得したデータをクライアントコンポーネントのHomepageに渡して、ページをレンダリング
  return <Homepage events={events || []} />;
}
