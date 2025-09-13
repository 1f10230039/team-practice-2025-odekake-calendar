// scripts/embed-events.js
import dotenv from "dotenv";
// ★`.env.local`ファイルを明示的に指定して読み込む
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// .env.localから環境変数を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openaiApiBase = process.env.NEXT_PUBLIC_OPENAI_API_BASE;

// 環境変数のチェック
if (!supabaseUrl || !supabaseAnonKey || !openaiApiKey || !openaiApiBase) {
  throw new Error(
    "環境変数が設定されていません。`.env.local`ファイルを確認してください。"
  );
}

// 各クライアントの初期化
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const openai = new OpenAI({
  apiKey: openaiApiKey,
  baseURL: openaiApiBase,
});

// OpenAIのEmbeddingモデルを使ってベクトル化する関数
async function getEmbedding(text) {
  const result = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return result.data[0].embedding;
}

async function embedEvents() {
  console.log("イベントデータのベクトル化を開始します...");

  const { data: events, error: fetchError } = await supabase
    .from("events")
    .select("*");

  if (fetchError) {
    console.error("イベントデータの取得に失敗しました:", fetchError);
    return;
  }

  await supabase.from("events_with_vectors").delete().neq("id", 0);

  const eventsToInsert = [];
  for (const event of events) {
    const content = `イベント名: ${event.name}\n開催場所: ${event.area}\nカテゴリー: ${event.category}\n説明: ${event.long_description}`;
    const embedding = await getEmbedding(content);

    eventsToInsert.push({
      event_id: event.id,
      content: content,
      embedding: embedding,
    });
  }

  const { error: insertError } = await supabase
    .from("events_with_vectors")
    .insert(eventsToInsert);

  if (insertError) {
    console.error("ベクトルの挿入に失敗しました:", insertError);
  } else {
    console.log(
      `✅ ${events.length}件のイベントを正常にベクトル化し、保存しました。`
    );
  }
}

embedEvents();
