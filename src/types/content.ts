export type ContentCategory = 'mbti' | 'saju' | 'tarot' | 'astrology';
export type CategoryFilter = 'all' | ContentCategory;
export type ContentBadge = 'popular' | 'new';

export interface Content {
  id: string;
  /** DB 콘텐츠 식별자 (예: 'mbti-basic', 'saju-deep') — /start?preselect= 쿼리로 사용 */
  slug: string;
  category: ContentCategory;
  title: string;
  description: string;
  price: number;
  badge?: ContentBadge;
  thumbnailEmoji: string;
  /** 썸네일 배경에 쓰이는 Tailwind 그라디언트 클래스 */
  gradientFrom: string;
  gradientTo: string;
}
