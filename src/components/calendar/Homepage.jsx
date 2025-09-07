// クライアントサイドで動作することを宣言
"use client";
// Emotionのstyledをインポート
import styled from "@emotion/styled";
// useStateフックインポート
import { useState } from "react";
// 日付比較用のisSameDayをインポート
import { isSameDay } from "date-fns";
// Calendarコンポーネントをインポート
import Calendar from "./Calendar";
// EventCardコンポーネントをインポート
import EventCard from "../ui/EventCard";

// --- Emotionでスタイルを定義 ---
// ホームページ全体を囲むコンテナースタイル
const HomepageWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  margin-top: 60px;
  gap: 2rem;
`;
// イベントカードを囲むスタイル
const EventListContainer = styled.div`
  width: 100%;
  max-width: 500px;
`;
// イベント一覧の部分のスタイル
const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: left;
`;
/**
 * カレンダー画面のメインとなるクライアントコンポーネント
 * @param {{ events: Array }} props - サーバーから渡されるイベントデータの配列
 */
export default function Homepage({ events }) {
  // サーバーから渡ってきたイベントデータがコンソールに表示されるか確認
  console.log("Received events on client:", events);

  // 選択されている日付を管理する。初期値は今日の日付
  const [selectedDate, setSelectedDate] = useState(new Date());

  // カレンダーから日付がクリックされたことを受け取る関数
  const handleDateChange = date => {
    setSelectedDate(date);
  };

  // 選択された日に開催されるイベントだけを絞り込む
  const filteredEvents = events.filter(event =>
    isSameDay(new Date(event.start_datetime), selectedDate)
  );

  return (
    <HomepageWrapper>
      {/* Calendarコンポーネントに、Homepageが管理している情報を渡す */}
      <Calendar
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        events={events}
      />

      <EventListContainer>
        <SectionTitle>イベント一覧</SectionTitle>
        {/* 絞り込んだイベントだけをEventCardで表示する */}
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <p>この日のイベントはありません。</p>
        )}
      </EventListContainer>
    </HomepageWrapper>
  );
}
