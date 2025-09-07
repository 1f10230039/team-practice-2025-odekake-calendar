// クライアントサイドで動作することを宣言
"use client";

import styled from "@emotion/styled";
// 日付のフォーマットを整えるためにdate-fnsからformatをインポート
import { format } from "date-fns";
// 日本語表示のためのロケールをインポート
import { ja } from "date-fns/locale";
// アイコン表示用のライブラリから、使いたいアイコンをインポート
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaYenSign,
  FaUsers,
  FaLink,
  FaUser,
} from "react-icons/fa";

// --- Emotionでスタイル定義 ---
const DetailWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  /* HeaderやTabBarに隠れないように上下のpaddingを多めにとる */
  padding: 80px 16px 90px;
  background-color: #fff;
`;
// 画像のスタイル
const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;
// イベント名のスタイル
const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 2px;
  line-height: 1.4;
`;
// サブの情報を囲むdiv
const SubInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 24px;

  /* アイコンとテキストを縦中央揃えにする */
  svg {
    margin-right: 4px;
    margin-bottom: 4px;
    vertical-align: middle;
  }
`;
// 「基本情報」や「アクセス」などのセクションタイトル
const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #555;
  margin: 48px 0 6px;
  padding-bottom: 8px;
`;
// イベントの説明文のスタイル
const Description = styled.p`
  font-size: 1rem;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap; /* 改行をそのまま表示するための設定 */
  margin-bottom: 32px;
`;
// イベントの基本情報のテーブル
const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 42px;
  font-size: 0.9rem;
`;
// イベントの基本情報のテーブルの行
const TableRow = styled.tr`
  border-bottom: 1px solid #eee;
`;
// イベントの基本情報のテーブルの名前
const TableHeader = styled.th`
  text-align: left;
  padding: 18px 8px;
  width: 110px;
  color: #777;
  vertical-align: top;

  svg {
    margin-right: 6px;
    vertical-align: middle;
  }
`;
// イベントの基本情報のテーブルデータ
const TableCell = styled.td`
  padding: 12px 8px;
  color: #333;

  /* aタグのスタイル */
  a {
    color: #007bff;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;
// マップを囲むスタイル
const MapWrapper = styled.div`
  h2 {
    font-size: 1.2rem;
    margin-bottom: 16px;
  }
`;
// マップのスタイル
const MapIframe = styled.iframe`
  width: 100%;
  height: 600px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

/**
 * イベントの詳細情報を表示するクライアントコンポーネント
 * @param {{ event: object }} props - 表示するイベントのデータ
 */
export default function EventDetail({ event }) {
  // eventオブジェクトから必要な情報を取り出す
  const {
    name,
    image_url,
    start_datetime,
    end_datetime,
    organizer,
    long_description,
    area,
    fee,
    capacity,
    website_url,
    latitude,
    longitude,
  } = event;

  // Google Mapの埋め込み用URLを生成
  const googleMapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=ja&z=15&output=embed`;

  // 日付のフォーマットを整える関数
  const formatDateTime = datetime => {
    if (!datetime) return "未定";
    return format(new Date(datetime), "M月d日(E) HH:mm", { locale: ja });
  };

  return (
    <DetailWrapper>
      <MainImage src={image_url} alt={name} />
      <Title>{name}</Title>

      <SubInfo>
        <span>
          <FaCalendarAlt />
          {formatDateTime(start_datetime)}
        </span>
        <span>
          <FaUser />
          主催: {organizer || "不明"}
        </span>
      </SubInfo>
      <SectionTitle>イベント詳細</SectionTitle>
      <Description>{long_description}</Description>

      <SectionTitle>基本情報</SectionTitle>
      <InfoTable>
        <tbody>
          <TableRow>
            <TableHeader>
              <FaCalendarAlt />
              開催日時
            </TableHeader>
            <TableCell>
              {formatDateTime(start_datetime)} から
              <br />
              {formatDateTime(end_datetime)} まで
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHeader>
              <FaMapMarkerAlt />
              開催場所
            </TableHeader>
            <TableCell>{area}</TableCell>
          </TableRow>
          <TableRow>
            <TableHeader>
              <FaYenSign />
              参加費
            </TableHeader>
            <TableCell>{fee ? `${fee.toLocaleString()}円` : "無料"}</TableCell>
          </TableRow>
          <TableRow>
            <TableHeader>
              <FaUsers />
              定員
            </TableHeader>
            <TableCell>{capacity ? `${capacity}名` : "制限なし"}</TableCell>
          </TableRow>
          <TableRow>
            <TableHeader>
              <FaLink />
              公式サイト
            </TableHeader>
            <TableCell>
              {website_url ? (
                <a href={website_url} target="_blank" rel="noopener noreferrer">
                  サイトを見る
                </a>
              ) : (
                "なし"
              )}
            </TableCell>
          </TableRow>
        </tbody>
      </InfoTable>

      <SectionTitle>開催場所の地図</SectionTitle>
      <MapWrapper>
        <MapIframe src={googleMapUrl} allowFullScreen="" loading="lazy" />
      </MapWrapper>
    </DetailWrapper>
  );
}
