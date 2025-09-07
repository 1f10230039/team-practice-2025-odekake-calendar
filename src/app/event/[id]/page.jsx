// Supabaseのクライアントインスタンスをインポート
import { supabase } from "../../../../utils/supabase";
// 404ページ表示用の関数をインポート
import { notFound } from "next/navigation";
// EventDetailコンポーネントをインポート
import EventDetail from "@/components/eventdetail/EventDetail";

/**
 * ページの内容に応じて、メタデータを動的に生成する関数
 * @param {object} props
 * @param {Promise<object>} props.params - URLの動的な部分を含むPromiseライクなオブジェクト
 * @returns {Promise<object>} Next.jsが使用するメタデータオブジェクト
 */
export async function generateMetadata({ params }) {
  const { id } = await params;

  // SEOに必要なデータ（名前と説明文）だけを先に取得します
  const { data: event } = await supabase
    .from("events")
    .select("name, short_description")
    .eq("id", id)
    .single();

  // もしスポットが見つからなかった場合のデフォルトタイトル
  if (!event) {
    return {
      title: "スポットが見つかりません | おでかけカレンダー",
    };
  }

  // 見つかったスポットの名前と説明をメタデータとして設定
  return {
    title: `${event.name} | おでかけカレンダー`,
    description: event.short_description || "詳細な情報はありません",
  };
}

/**
 * 観光地の詳細ページを生成するサーバーコンポーネント
 * @param {object} props - コンポーネントのプロパティ
 * @param {Promise<object>} props.params - URLから渡されるパラメータ ({ id: '...' })
 */
export default async function EventDetailPage({ params }) {
  const { id } = await params;

  // 'spots'テーブルから、指定されたIDのデータを取得
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  // データ取得中にエラーが発生した場合の処理
  if (error) {
    console.error("観光地データの取得に失敗しました:", error.message);
    notFound();
  }

  // 取得したデータを使ってページをレンダリング
  return <EventDetail event={event} />;
}
