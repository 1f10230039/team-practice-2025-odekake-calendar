// クライアントサイドで動作する
"use client";
// Emotionのstyledをインポート
import styled from "@emotion/styled";

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

/**
 * AIチャットページのコンポーネント
 * @returns {JSX.Element}
 */
export default function ChatPage() {
  const [messages, setMessages] = require("react").useState([
    { role: "assistant", content: "こんにちは！条件を教えてください。（例：来週末、都内、屋内、無料など）" },
  ]);
  const [input, setInput] = require("react").useState("");
  const [loading, setLoading] = require("react").useState(false);

  const onSubmit = async e => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const next = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (data?.answer) {
        setMessages(m => [...m, { role: "assistant", content: data.answer }]);
      } else {
        setMessages(m => [...m, { role: "assistant", content: "エラーが発生しました" }]);
      }
    } catch (err) {
      setMessages(m => [...m, { role: "assistant", content: "通信に失敗しました" }]);
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
            <Bubble key={i} role={m.role}>{m.content}</Bubble>
          ))}
        </Row>
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
