// クライアントサイドで動作する
"use client";
// Emotionのstyledをインポート
import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Emotionでスタイルを定義 ---
const PageWrapper = styled.div`
  padding: 20px;
  text-align: center;
`;
const ChatContainer = styled.div`
  max-width: 720px;
  margin: 0 auto;
  text-align: left;
`;
const Messages = styled.div`
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px;
  height: 60vh;
  overflow-y: auto;
  background: #fff;
`;
const Bubble = styled.div`
  max-width: 80%;
  margin: 8px 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${props => (props.role === "user" ? "#e8f0fe" : "#f5f5f5")};
  align-self: ${props => (props.role === "user" ? "flex-end" : "flex-start")};
`;
const Row = styled.div`
  display: flex;
  flex-direction: column;
`;
const InputRow = styled.form`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;
const TextInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;
const SendButton = styled.button`
  padding: 10px 16px;
  background: #2067f5;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 8px;
`;
const Card = styled.div`
  display: block;
  border: 1px solid #eee;
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  cursor: pointer;
`;
const CardImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;
const CardBody = styled.div`
  padding: 8px 10px 12px;
`;
const CardTitle = styled.div`
  font-weight: 700;
  margin-bottom: 4px;
`;
const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid #ddd;
  border-top-color: #2067f5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

/**
 * AIチャットページのコンポーネント
 * @returns {JSX.Element}
 */
export default function ChatPage() {
  const React = require("react");
  const router = useRouter();
  const [messages, setMessages] = React.useState([
    { role: "assistant", content: "こんにちは！条件を教えてください。（例：来週末、都内、屋内、無料など）" },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [turnEvents, setTurnEvents] = React.useState([]); // 直近応答に紐づく候補

  const onSubmit = async e => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // ユーザーメッセージを履歴へ
    const next = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }), // 多段会話: 履歴ごと送信
      });
      const data = await res.json();

      if (data?.answer) {
        // アシスタントの返答を履歴へ
        setMessages(m => [...m, { role: "assistant", content: data.answer }]);
        // 今回応答に紐づくイベント候補を保存
        setTurnEvents(Array.isArray(data.events) ? data.events : []);
      } else {
        setMessages(m => [...m, { role: "assistant", content: "エラーが発生しました" }]);
        setTurnEvents([]);
      }
    } catch (err) {
      setMessages(m => [...m, { role: "assistant", content: "通信に失敗しました" }]);
      setTurnEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <h1>AIチャット</h1>
      <p>ここでAIと会話して、おすすめのイベントを探せます。</p>
      <ChatContainer>
        <Row as={Messages}>
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role}>
              <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
            </Bubble>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
              <Spinner />
              <span>考えています…</span>
            </div>
          )}
        </Row>
        {turnEvents.length > 0 && (
          <Cards>
            {turnEvents.map(ev => (
              <Card key={ev.id} onClick={() => router.push(`/event/${ev.id}`)} role="button" tabIndex={0}>
                <CardImage
                  src={ev.image_url || "/window.svg"}
                  alt={ev.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={e => { e.currentTarget.src = "/window.svg"; }}
                />
                <CardBody>
                  <CardTitle>{ev.name}</CardTitle>
                  <div style={{ fontSize: 12, color: "#666" }}>{ev.area || "場所未設定"}</div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8, fontSize: 13 }}>
                    <Link href={`/event/${ev.id}`} onClick={e => e.stopPropagation()}>詳細を見る</Link>
                    {ev.website_url ? (
                      <a href={ev.website_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>公式サイト</a>
                    ) : (
                      <span style={{ color: "#999" }}>公式サイトなし</span>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </Cards>
        )}
        <InputRow onSubmit={onSubmit}>
          <TextInput
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="条件を入力（例：今週末の無料イベント）"
          />
          <SendButton type="submit" disabled={loading}>送信</SendButton>
        </InputRow>
      </ChatContainer>
    </PageWrapper>
  );
}
