// クライアントサイドで動作することを宣言
"use client";
import styled from "@emotion/styled";

const CardWrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: left;
`;

const EventTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.2rem;
`;

/**
 * イベント情報を表示するカードコンポーネント
 * @param {{ event: Object }} props - 表示するイベントのデータ
 * @returns {JSX.Element}
 */
export default function EventCard({ event }) {
  return (
    <CardWrapper>
      <EventTitle>{event.name}</EventTitle>
      <p>{event.short_description}</p>
    </CardWrapper>
  );
}
