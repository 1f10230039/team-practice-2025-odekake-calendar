// クライアントサイドで動作することを宣言
"use client";
// Emotionのstyledをインポート
import styled from "@emotion/styled";
// Reactのフックインポート
import { useState, useMemo } from "react";
// 日付比較用のisSameDayをインポート
import { isSameDay, startOfDay, isToday, format } from "date-fns";
// 日本語表示のためjaをインポート！
import { ja } from "date-fns/locale";
// 必要なコンポーネントをインポート
import Calendar from "./Calendar";
import EventCard from "../ui/EventCard";
import Filter from "../ui/Filter";

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
// フィルターとイベント一覧をまとめるコンテナ
const ContentContainer = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 16px;
  border-radius: 12px;
  background-color: #f9f9f9;
`;
// イベント一覧のタイトルとフィルターを囲むスタイル
const TitleFilterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  margin-bottom: 12px;
`;
// イベント一覧のタイトルのスタイル
const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
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

  // フィルターされた後の観光地リストを管理するためのstate。初期値は全てのスポット
  const [selectedCategory, setSelectedCategory] = useState("all");

  // --- 👇 日付を変更するための関数 ---
  const handleDateChange = date => {
    setSelectedDate(date);
  };
  // --- 👇 カテゴリを変更するための関数 ---
  const handleFilterChange = category => {
    setSelectedCategory(category);
  };

  const filteredEvents = useMemo(() => {
    const eventsOnSelectedDate = events.filter(event => {
      const selectedDay = startOfDay(selectedDate);
      const eventStartDay = startOfDay(new Date(event.start_datetime));
      const eventEndDay = startOfDay(new Date(event.end_datetime));
      return selectedDay >= eventStartDay && selectedDay <= eventEndDay;
    });
    if (selectedCategory === "all") {
      return eventsOnSelectedDate;
    }
    return eventsOnSelectedDate.filter(
      event => event.category === selectedCategory
    );
  }, [events, selectedDate, selectedCategory]);

  const sectionTitle = isToday(selectedDate)
    ? "今日のイベント一覧"
    : `${format(selectedDate, "M月d日", { locale: ja })}のイベント一覧`;

  return (
    <HomepageWrapper>
      {/* Calendarコンポーネントに、Homepageが管理している情報を渡す */}
      <Calendar
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        events={events}
      />

      <ContentContainer>
        <TitleFilterContent>
          <SectionTitle>{sectionTitle}</SectionTitle>
          <Filter allEvents={events} onFilterChange={handleFilterChange} />
        </TitleFilterContent>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <p>この日のイベントはありません。</p>
        )}
      </ContentContainer>
    </HomepageWrapper>
  );
}
