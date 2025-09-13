"use client";

import styled from "@emotion/styled";
import { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  padding-top: 80px;
  padding-bottom: 90px;
  background-color: #f9f9f9;
`;

const ChatContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  scroll-behavior: smooth;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
  align-self: ${({ isUser }) => (isUser ? "flex-end" : "flex-start")};
  background-color: ${({ isUser }) => (isUser ? "#1877f2" : "#e4e6eb")};
  color: ${({ isUser }) => (isUser ? "#fff" : "#000")};
  white-space: pre-wrap;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const Input = styled.textarea`
  flex-grow: 1;
  border: none;
  padding: 12px;
  font-size: 1rem;
  background-color: transparent;
  resize: none;
  max-height: 150px;
  overflow-y: auto;
  color: #333;
  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "#1877f2")};
  color: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s;
  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#ccc" : "#166fe5")};
  }
`;

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      text: "どんなイベントを探しですか？お気軽にご質問ください！",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async e => {
    e.preventDefault();
    const messageToSend = input.trim();
    if (messageToSend === "" || isLoading) return;

    const userMessage = { text: messageToSend, isUser: true };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: messageToSend, history: messages }),
      });

      const data = await response.json();
      const aiMessage = { text: data.text, isUser: false };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
      const errorMessage = {
        text: "エラーが発生しました。もう一度お試しください。",
        isUser: false,
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <ChatContainer ref={chatContainerRef}>
        {messages.map((message, index) => (
          <Message key={index} isUser={message.isUser}>
            {message.text}
          </Message>
        ))}
        {isLoading && (
          <Message isUser={false}>
            <FaSpinner className="animate-spin" />
          </Message>
        )}
      </ChatContainer>
      <InputContainer onSubmit={handleSend}>
        <Input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          placeholder={
            isLoading ? "AIが応答を生成中..." : "質問を入力してください..."
          }
          disabled={isLoading}
        />
        <SendButton type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaPaperPlane />
          )}
        </SendButton>
      </InputContainer>
    </PageWrapper>
  );
}
