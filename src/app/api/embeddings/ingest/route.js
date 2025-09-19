import OpenAI from "openai";
import { supabaseServer } from "../../../../../utils/supabase-server";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.iniad.org/api/v1",
});

// 期待ボディ: { events: [{ id, name, long_description, area, start_datetime, end_datetime, website_url }] }
export async function POST(request) {
  try {
    const body = await request.json();
    const events = Array.isArray(body?.events) ? body.events : [];
    if (events.length === 0) {
      return new Response(JSON.stringify({ error: "eventsが空です" }), { status: 400 });
    }

    // 1. ドキュメントをチャンク化（シンプル: 説明文を固定長で分割）
    const chunks = [];
    const chunkSize = 500;
    for (const ev of events) {
      const base = `${ev.name}\n${ev.long_description ?? ""}`.trim();
      for (let i = 0; i < base.length; i += chunkSize) {
        const text = base.slice(i, i + chunkSize);
        if (text.trim().length === 0) continue;
        chunks.push({
          event_id: ev.id,
          event_name: ev.name,
          start_datetime: ev.start_datetime,
          end_datetime: ev.end_datetime,
          area: ev.area,
          website_url: ev.website_url,
          chunk_text: text,
        });
      }
    }

    // 2. 埋め込み生成（バッチ）
    // INIAD制約: input は string のみ → 逐次で生成
    for (let i = 0; i < chunks.length; i++) {
      const emb = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunks[i].chunk_text,
      });
      chunks[i].embedding = emb.data[0].embedding;
    }

    // 3. SupabaseへINSERT（events_with_vectorsテーブルに対応）
    //    テーブル構成: id(bigserial), event_id(bigint), content(text), embedding(vector)
    const payload = chunks.map(c => ({
      event_id: typeof c.event_id === "string" ? Number(c.event_id) : c.event_id,
      content: c.chunk_text,
      embedding: c.embedding,
    }));

    const { error } = await supabaseServer.from("events_with_vectors").insert(payload);

    if (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "保存に失敗しました" }), { status: 500 });
    }

    return new Response(JSON.stringify({ inserted: chunks.length }), {
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "サーバーエラー" }), { status: 500 });
  }
}


