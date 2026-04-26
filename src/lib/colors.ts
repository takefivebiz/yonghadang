/**
 * 전역 색상 시스템
 * 분석 타입, 카테고리, UI 요소의 색상을 중앙에서 관리
 */

export const COLORS = {
  // 기본 색상
  text: {
    primary: '#2D3250',
    secondary: '#666666',
    muted: '#999999',
  },

  // 배경
  background: {
    page: '#FAF8F5',
    card: '#FFFFFF',
    hover: '#FAF8F5',
    selected: '#F5F0FA',
  },

  // 분석 타입별 색상
  analysisType: {
    self: '#7B6A9B',      // 보라색 - 나를 읽는 중
    other: '#F7A278',     // 주황색 - 상대를 읽는 중
    relationship: '#C4B5D4', // 라벤더 - 우리 관계를 읽는 중
  },

  // 카테고리 색상
  category: {
    연애: '#F7A278',
    감정: '#C97B84',
    인간관계: '#C4B5D4',
    '직업/진로': '#7B6A9B',
  },

  // UI 요소
  ui: {
    border: '#E5E5E5',
    borderLight: '#F0F0F0',
    focus: '#C4B5D4',
    disabled: 'rgba(0, 0, 0, 0.2)',
  },
} as const;

/**
 * 분석 타입에 따른 색상 선택
 */
export const getAnalysisTypeColor = (type: 'self' | 'other' | 'relationship'): string => {
  return COLORS.analysisType[type];
};

/**
 * 카테고리에 따른 색상 선택
 */
export const getCategoryColor = (
  category: '연애' | '감정' | '인간관계' | '직업/진로',
): string => {
  return COLORS.category[category];
};
