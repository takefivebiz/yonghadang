import type { Config } from 'tailwindcss';

/**
 * 용하당 디자인 팔레트
 * globals.css의 @config로 로드됨 (Tailwind v4 방식)
 *
 * 사용 예시:
 *   bg-cream, text-deep-purple, bg-pastel-pink
 *   bg-lavender, text-dusty-rose, bg-peach
 */
const config: Config = {
  theme: {
    extend: {
      colors: {
        /** 크림 배경 */
        cream: '#F5F0E8',
        /** Deep Purple — 주 텍스트·버튼 */
        'deep-purple': '#4A3B5C',
        /** Pastel Pink — 버튼 배경·강조 */
        'pastel-pink': '#F5D7E8',
        /** Light Lavender — 액센트 */
        lavender: '#E8D4F0',
        /** Dusty Rose — 서브 텍스트·태그 */
        'dusty-rose': '#D4A5A5',
        /** Soft Peach — 카드 배경 변형 */
        peach: '#F5E8D7',
      },
    },
  },
};

export default config;
