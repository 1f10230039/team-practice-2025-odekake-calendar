import OpenAI from "openai";
import { supabaseServer } from "../../../../utils/supabase-server";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.iniad.org/api/v1",
});

// 期待するボディ: { messages: [{role, content}], topK?: number }
export async function POST(request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const topK = Number(body?.topK ?? 5);

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "messagesが空です" }), { status: 400 });
    }

    // 最新ユーザーメッセージ
    const userMessage = messages.filter(m => m.role === "user").at(-1)?.content ?? "";
    if (!userMessage) {
      return new Response(JSON.stringify({ error: "ユーザーメッセージがありません" }), { status: 400 });
    }

    // クエリエンベディング生成
    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: userMessage,
    });
    const queryEmbedding = embeddingRes.data[0].embedding;

    // Supabase(pgvector)で類似検索: events_with_vectorsを直接検索するSQLに変更
    const { data: chunks, error } = await supabaseServer
      .rpc("search_events_with_vectors", { query_embedding: queryEmbedding, match_count: topK });

    if (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "検索に失敗しました" }), { status: 500 });
    }

    const contextText = (chunks ?? [])
      .map(c => `【タイトル】${c.name ?? "(タイトル不明)"}\n【日付】${c.start_datetime ?? "未定"}〜${c.end_datetime ?? "未定"}\n【場所】${c.area ?? "不明"}\n【説明】${c.content}`)
      .join("\n\n---\n\n");

    const systemPrompt = `あなたはイベント提案アシスタントです。ユーザーの条件に合うイベントを3件まで、簡潔に日本語で提案してください。存在しない情報は作らず、以下のコンテキストのみを根拠に回答してください。必要に応じて日付や場所、費用を箇条書きで示し、最後に関連するリンクがあれば記載してください。\n\n[コンテキスト]\n${contextText}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.3,
    });

    const answer = completion.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ answer, sources: chunks ?? [] }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "サーバーエラー" }), { status: 500 });
  }
}


