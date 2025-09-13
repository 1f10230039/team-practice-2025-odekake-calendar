import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// 環境変数を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const openaiApiBase = process.env.NEXT_PUBLIC_OPENAI_API_BASE;

if (!supabaseUrl || !supabaseAnonKey || !openaiApiKey || !openaiApiBase) {
  throw new Error(
    "環境変数が設定されていません。`.env.local`ファイルを確認してください。"
  );
}

// クライアントを初期化
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const openai = new OpenAI({ apiKey: openaiApiKey, baseURL: openaiApiBase });

// OpenAIのEmbeddingモデルを使ってベクトル化する関数
async function getEmbedding(text) {
  const result = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return result.data[0].embedding;
}

// ベクトルを使って関連情報を検索する関数
async function getRelatedEvents(embedding) {
  const { data: relatedEvents, error } = await supabase.rpc("match_events", {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 5,
  });

  if (error) {
    console.error("ベクトルの検索に失敗しました:", error);
    return null;
  }

  return relatedEvents;
}

// OpenAIに渡すためのプロンプトを構築する関数
function buildPrompt(query, relatedEvents, history) {
  if (relatedEvents && relatedEvents.length > 0) {
    const context = relatedEvents
      .map(event => `イベント名: ${event.name}\n説明: ${event.content}`)
      .join("\n\n");

    return `
あなたは元気でフレンドリーな友達のようなAIイベントアシスタントです！✨
以下のイベントデータの中から、ユーザーの質問に関連する情報を、タメ口で、記号や絵文字をたくさん使って、楽しく回答してね！
回答は、簡潔かつ要点をまとめた文章量に抑え、句読点「。」の後に改行を入れて、箇条書きのように見やすくしてね！
質問がイベントデータと直接関係ない場合でも、親しみやすい口調で一般常識の範囲で回答を試みてね！

イベントデータ:
---
${context}
---

ユーザーの質問:
${query}

回答:
`;
  } else {
    return `
あなたは元気でフレンドリーな友達のようなAIイベントアシスタントです！✨
イベントデータベースで検索を試みたけど、ユーザーの質問に関連する情報を見つけられなかったみたい...😭
「ごめん、その情報は見つけられなかったよ」という旨をタメ口で伝え、他に手伝えることがないか聞いてみてね！
回答は、簡潔かつ要点をまとめた文章量に抑え、句読点「。」の後に改行を入れて、箇条書きのように見やすくしてね！

ユーザーの質問:
${query}

回答:
`;
  }
}

// APIルートのPOSTハンドラ
export async function POST(req) {
  try {
    const { query, history } = await req.json();

    const queryEmbedding = await getEmbedding(query);

    const relatedEvents = await getRelatedEvents(queryEmbedding);

    const prompt = buildPrompt(query, relatedEvents, history);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        ...history.map(msg => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.text,
        })),
        { role: "user", content: prompt },
      ],
    });

    const responseText = completion.choices[0].message.content;

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
