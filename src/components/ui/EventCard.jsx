// クライアントサイドで動作することを宣言
"use client";
// ページ遷移用Linkコンポーネントをインポート
import Link from "next/link";
// Emotionのstyledをインポート
import styled from "@emotion/styled";
// 日付のフォーマットを整えるためにdate-fnsからformatをインポート
import { format } from "date-fns";
// 日本語表示のためのロケールをインポート
import { ja } from "date-fns/locale";

// --- カテゴリごとの色の設定 ---
const categoryColors = {
  お祭り: "rgba(255, 193, 7, 0.1)", // 黄色っぽい背景
  スポーツ: "rgba(40, 167, 69, 0.1)", // 緑っぽい背景
  教育: "rgba(0, 123, 255, 0.1)", // 青っぽい背景
  その他: "rgba(108, 117, 125, 0.1)", // グレーっぽい背景
};
const categoryBorderColors = {
  お祭り: "#ffc107",
  スポーツ: "#28a745",
  教育: "#007bff",
  その他: "#6c757d",
};

// --- Emotionでスタイル定義 ---
// カード全体を囲むコンテナ。propsで色を受け取って背景色と左のボーダー色を変える
const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 175px;
  border: 1px solid #e0e0e0;
  border-left: 5px solid ${props => props.borderColor || "#e0e0e0"};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  background-color: ${props => props.bgColor || "white"};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-align: left;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-3px);
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

// 左側に表示するイベント画像のスタイル
const EventImage = styled.img`
  width: 130px;
  height: 150px;
  border-radius: 6px;
  object-fit: cover;
  margin-right: 16px;
`;

// 右側のテキスト情報をまとめるコンテナ
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

// イベントタイトルのスタイル
const EventTitle = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

// カテゴリ名を表示するタグのスタイル
const CategoryTag = styled.p`
  margin: 0 0 8px 0;
  font-size: 0.75rem;
  color: #555;
`;

// 開催日時を表示する部分のスタイル
const DateTime = styled.p`
  margin: 0 0 8px 0;
  font-size: 0.6rem;
  color: #777;
`;

// 開催場所を表示する部分のスタイル
const EventArea = styled.p`
  margin: 0 0 8px 0;
  font-size: 0.6rem;
  color: #777;
`;

// 短い説明文のスタイル
const Description = styled.p`
  margin: 0;
  font-size: 0.6rem;
  color: #555;
  line-height: 1.5;
`;

/**
 * イベント情報を表示するカードコンポーネント
 * @param {{ event: object }} props - 表示するイベントのデータ
 * @param {string} props.eventId - イベントの一意なID(詳細ページへのリンクに使用)
 * @param {string} props.eventName - イベントの名前
 * @param {string} props.eventArea - イベントのエリア(例：市役所前)
 * @param {string} props.eventCategory - イベントのカテゴリー
 * @param {string} props.eventShortDescription - 観光地の短い説明文
 * @param {int8} props.eventStartDatetime - イベントの開始日時
 * @param {int8} props.eventEndDatetime - イベントの終了日時
 * @param {string} props.eventImageUrl - 観光地の画像URL
 * @returns {JSX.Element} レンダリングされる観光地カードコンポーネント
 */
export default function EventCard({ event }) {
  // eventオブジェクトから、必要な情報を取り出す
  const {
    id,
    name,
    area,
    category,
    short_description,
    start_datetime,
    end_datetime,
    image_url,
  } = event;
  // カテゴリ名に対応する背景色とボーダー色を取得する。なければ「その他」の色を使う
  const categoryName = category || "その他";
  const bgColor = categoryColors[categoryName];
  const borderColor = categoryBorderColors[categoryName];

  // 日付のフォーマットを整える関数
  const formatDateTime = datetime => {
    if (!datetime) return ""; // 日付がなければ空文字を返す
    // 例: "9月8日(月) 10:00" のような形式に変換
    return format(new Date(datetime), "M月d日(E) HH:mm", { locale: ja });
  };

  return (
    <Link href={`/event/${id}`}>
      {/* CardWrapperに、計算した色をpropsとして渡す */}
      <CardWrapper bgColor={bgColor} borderColor={borderColor}>
        {/* イベント画像を表示。altは画像が表示されない時のための説明文 */}
        <EventImage src={image_url} alt={name} />

        <ContentWrapper>
          <EventTitle>{name}</EventTitle>
          <CategoryTag>{categoryName || "その他"}</CategoryTag>
          {/* 開始日時と終了日時をきれいにフォーマットして表示 */}
          <DateTime>
            {formatDateTime(start_datetime)} ~ {formatDateTime(end_datetime)}
          </DateTime>
          <EventArea>{area}</EventArea>
          <Description>{short_description}</Description>
        </ContentWrapper>
      </CardWrapper>
    </Link>
  );
}
