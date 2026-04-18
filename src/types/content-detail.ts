import { Content } from './content';

export interface FreeSection {
  title: string;
  paragraphs: string[];
}

export interface PremiumSection {
  title: string;
  /** 블러 처리될 내용 — 분량감을 시각적으로 전달하기 위한 텍스트 */
  blurredContent: string;
}

export interface ContentDetailExtras {
  /** 리포트가 제공하는 내용의 상세 설명 */
  longDescription: string;
  /** 분석 항목 목록 (bullet) */
  analysisItems: string[];
  /** 기본 분석 섹션 (무료 공개) */
  freeSection: FreeSection;
  /** 추가 분석 섹션 (블러 처리, 유료) */
  premiumSections: PremiumSection[];
}

/** Content + 상세 페이지 데이터 */
export type ContentDetail = Content & ContentDetailExtras;
