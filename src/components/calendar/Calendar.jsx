// クライアントサイドで動作することを宣言
"use client";
// useStateと、計算結果を記憶してパフォーマンスを向上させる`useMemo`をインポートする
import { useState, useMemo } from "react";
// 日付を便利に扱うためのライブラリdate-fnsから、関数をインポートする
import {
  format, // 日付を指定した文字列フォーマットに変換する (例: '2025-09-08')
  startOfMonth, // その月の最初の日を取得する
  endOfMonth, // その月の最後の日を取得する
  eachDayOfInterval, // 指定した期間のすべての日付を配列で取得する
  startOfWeek, // その週の最初の日（日曜日）を取得する
  endOfWeek, // その週の最後の日（土曜日）を取得する
  isSameMonth, // 2つの日付が同じ月にあるかどうかを判定する
  isSameDay, // 2つの日付が同じ日であるかどうかを判定する
  addMonths, // 指定した月数を足す
  subMonths, // 指定した月数を引く
  isToday, // その日が今日かどうかを判定する
} from "date-fns";
// date-fnsで日本語（例: '9月'）を使えるようにするための設定をインポートする
import { ja } from "date-fns/locale";
// Emotionライブラリからstyledをインポートする
import styled from "@emotion/styled";

// --- Emotionでスタイルを定義 ---
// カレンダー全体を包むスタイル
const CalendarContainer = styled.div`
  background-color: #fff;
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;
// 月の表示と「< >」ボタンが置かれるヘッダー部分のスタイル
const CalenderHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
`;
// 「2025年 9月」のように表示される月のタイトルのスタイル
const MonthTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;
// 月を移動するための「<」と「>」のボタンのスタイル
const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: #888;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  &:hover {
    color: #000;
  }
  &.prev {
    left: 10px;
  } // 'prev'クラスがついたボタンは左側に配置
  &.next {
    right: 10px;
  } // 'next'クラスがついたボタンは右側に配置
`;
// カレンダーの日付部分全体（7列のグリッド）のスタイル
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr); // 7つの列を均等に配置
  gap: 0;
`;
// 「日, 月, 火...」と表示される曜日のヘッダー部分のスタイル
const DayHeader = styled.div`
  text-align: center;
  font-weight: bold;
  color: #777;
  font-size: 12px;
  padding: 8px 0;
`;
// 日付一つ一つのマスのスタイル
const DayCell = styled.div`
  height: 48px;
  padding: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  // propsとして渡される情報に応じて、スタイルを動的に変更する
  color: ${props =>
    props.isNotInMonth ? "#ccc" : "#333"}; // 今月以外の日なら文字を薄く
  background-color: ${props =>
    props.isSelected
      ? "rgba(41, 128, 185, 0.1)"
      : "transparent"}; // 選択中の日なら背景色を付ける
  border-radius: 4px;
  transition: background-color 0.2s; // 背景色が変わる時のアニメーション
  &:hover {
    background-color: #f9f9f9;
  }
`;
// 日付の数字部分（例: '8'）のスタイル
const DateNumber = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%; // 円形にする
  // propsとして渡される情報に応じて、スタイルを動的に変更する
  background-color: ${props =>
    props.isToday ? "#2980b9" : "transparent"}; // 今日なら背景を青く
  color: ${props => (props.isToday ? "#fff" : "inherit")}; // 今日なら文字を白く
`;
// イベントドットを中央に配置するための小さなコンテナのスタイル
const EventDotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3px;
  height: 6px;
`;
// イベントの存在を示す、日付の下の小さな点のスタイル
const EventDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${props =>
    props.color || "#ccc"}; // propsで渡された色を背景色にする
`;

// イベントのカテゴリ名と、それに対応するドットの色を決めておくオブジェクト
const categoryColors = {
  お祭り: "#ffc107",
  スポーツ: "#28a745",
  教育: "#007bff",
  その他: "#6c757d",
};

/**
 * カレンダー本体を表示するコンポーネント
 * @param {object} props - コンポーネントが受け取るプロパティ
 * @param {Date} props.selectedDate - 現在選択されている日付
 * @param {(date: Date) => void} props.onDateChange - 日付がクリックされた時に呼び出されるコールバック関数
 * @param {Array<object>} props.events - 表示する全てのイベントデータ配列
 */
export default function Calendar({ selectedDate, onDateChange, events }) {
  // useStateを使って、このカレンダーが表示している「現在の月」を管理する
  // selectedDateを元に、初期表示する月を決める
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

  // useMemoを使って、イベントデータを日付ごとに整理する処理を行う
  // この処理は重たいので、events配列が変わった時だけ再計算するようにして、パフォーマンスを良くする
  const eventsByDate = useMemo(() => {
    // reduceは、配列を元に新しいオブジェクトや値を作り出すための機能
    return events.reduce((acc, event) => {
      const startDate = new Date(event.start_datetime);
      const endDate = new Date(event.end_datetime);

      // startとendが有効な日付かチェックする（安全対策）
      if (!isNaN(startDate) && !isNaN(endDate)) {
        // eachDayOfIntervalで、イベント期間中のすべての日付を取得！
        const datesInRange = eachDayOfInterval({
          start: startDate,
          end: endDate,
        });

        // 期間中の日付を一つずつループ処理
        datesInRange.forEach(day => {
          // 'yyyy-MM-dd'形式のキーを作成
          const dateKey = format(day, "yyyy-MM-dd");

          // その日付のキーがまだなければ、空の配列を作成
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          // カテゴリが重複しないように追加
          if (!acc[dateKey].includes(event.category || "その他")) {
            acc[dateKey].push(event.category || "その他");
          }
        });
      }
      return acc; // 最終的に { '2025-09-08': ['祭り'], '2025-09-15': ['スポーツ', '教育'] } のようなオブジェクトが出来上がる
    }, {});
  }, [events]); // []の中にあるeventsが変わった時だけ、この中の処理が実行される

  // --- カレンダーを描画するための日付計算 ---
  const monthStart = startOfMonth(currentMonth); // 表示している月の最初の日
  const monthEnd = endOfMonth(currentMonth); // 表示している月の最後の日
  const startDate = startOfWeek(monthStart); // カレンダーの左上（最初）の日付
  const endDate = endOfWeek(monthEnd); // カレンダーの右下（最後）の日付
  const days = eachDayOfInterval({ start: startDate, end: endDate }); // カレンダーに表示する全ての日付の配列
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"]; // 曜日のヘッダー用

  // --- ボタンがクリックされた時の処理 ---
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1)); // 「前の月へ」ボタン
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1)); // 「次の月へ」ボタン

  // --- 画面に表示される内容(JSX) ---
  return (
    <CalendarContainer>
      <CalenderHeader>
        <NavButton className="prev" onClick={prevMonth}>
          &lt;
        </NavButton>
        <MonthTitle>
          {format(currentMonth, "yyyy年 M月", { locale: ja })}
        </MonthTitle>
        <NavButton className="next" onClick={nextMonth}>
          &gt;
        </NavButton>
      </CalenderHeader>
      <Grid>
        {/* 曜日のヘッダーを表示 */}
        {weekdays.map(day => (
          <DayHeader key={day}>{day}</DayHeader>
        ))}
        {/* カレンダーに表示する全ての日付を一つずつ取り出して、日付セル(DayCell)を作成 */}
        {days.map(day => {
          const dayKey = format(day, "yyyy-MM-dd"); // イベントを探すためのキーとなる日付文字列
          const categoriesOnThisDay = eventsByDate[dayKey] || []; // その日のイベントカテゴリの配列を取得（なければ空）

          return (
            <DayCell
              key={day.toString()} // Reactが要素を区別するためのユニークなキー
              onClick={() => onDateChange(day)} // セルがクリックされたら、Homepageに報告する
              isNotInMonth={!isSameMonth(day, currentMonth)} // 今月以外の日かどうかを伝える
              isSelected={isSameDay(day, selectedDate)} // 親から受け取った「選択中の日」と同じ日かどうかを伝える
            >
              <DateNumber isToday={isToday(day)}>{format(day, "d")}</DateNumber>
              <EventDotsContainer>
                {/* その日のイベントカテゴリを元に、ドットを最大3つまで表示する */}
                {categoriesOnThisDay.slice(0, 3).map((category, index) => (
                  <EventDot
                    key={index}
                    color={categoryColors[category] || categoryColors["その他"]}
                  />
                ))}
              </EventDotsContainer>
            </DayCell>
          );
        })}
      </Grid>
    </CalendarContainer>
  );
}
