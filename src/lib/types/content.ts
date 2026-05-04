export type Category = "love" | "relationship" | "career" | "emotion";
export type InputType = "free" | "choice";

export interface CardConfigItem {
  index: number;
  title: string;
  is_free: boolean;
  prompt: string;
}

export interface CardConfig {
  free_card_count: number;
  paid_card_count: number;
  cards: CardConfigItem[];
}

export interface Content {
  id: string;
  title: string;
  // TODO: [백엔드 연동] 백엔드 스키마에 subtitle 컬럼 추가 필요
  subtitle?: string;
  category: Category;
  thumbnail_url: string | null;
  input_type: InputType;
  card_config: CardConfig;
  created_at: string;
}

export const CATEGORY_LABELS: Record<Category, string> = {
  love: "연애",
  relationship: "인간관계",
  career: "직업·진로",
  emotion: "감정",
};
