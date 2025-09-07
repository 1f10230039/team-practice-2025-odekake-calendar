// クライアントサイドで動作することを示す
"use client";
// Emotionのstyledをインポート
import styled from "@emotion/styled";

// --- スタイル定義 ---
const FilterWrapper = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const Select = styled.select`
  width: 200px;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
`;

/**
 * カテゴリでイベントを絞り込むためのコンポーネント
 * @param {{ allEvents: Array, onFilterChange: Function }} props
 */
export default function Filter({ allEvents, onFilterChange }) {
  // 全てのスポットから、重複しないエリア名のリストを作成する
  const categories = [
    ...new Set(allEvents.map(event => event.category || "その他")),
  ];
  return (
    <FilterWrapper>
      <Select
        id="category-filter"
        onChange={e => onFilterChange(e.target.value)}
      >
        <option value="all">すべてのカテゴリー</option>
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>
    </FilterWrapper>
  );
}
