import type { Metadata } from 'next';
import { Noto_Serif_KR, Cinzel } from 'next/font/google';
import './globals.css';

/**
 * 한국어 세리프 폰트 — 본문 기본 폰트
 */
const notoSerifKR = Noto_Serif_KR({
  variable: '--font-korean',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

/**
 * 영문 장식 폰트 — 로고 및 헤딩에 사용
 */
const cinzel = Cinzel({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: {
    default: '용하당 — AI 사주, MBTI, 타로, 점성술',
    template: '%s | 용하당',
  },
  description:
    'AI가 분석하는 심층 사주, MBTI, 타로, 점성술 서비스. 용하당에서 나만의 운명 보고서를 확인하세요.',
  openGraph: {
    siteName: '용하당',
    locale: 'ko_KR',
    type: 'website',
  },
};

const RootLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="ko">
      <body className={`${notoSerifKR.variable} ${cinzel.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
