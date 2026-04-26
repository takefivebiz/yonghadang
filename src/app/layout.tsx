import type { Metadata } from "next";
import { Noto_Serif_KR, Cinzel } from "next/font/google";
import Script from "next/script";
import "./globals.css";

/**
 * 한국어 세리프 폰트 — 본문 기본 폰트
 */
const notoSerifKR = Noto_Serif_KR({
  variable: "--font-korean",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

/**
 * 영문 장식 폰트 — 로고 및 헤딩에 사용
 */
const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "코어로그 — 사람을 읽는 AI 리포트",
    template: "%s | 코어로그",
  },
  description:
    "선택과 응답으로 현재 상태, 패턴, 선택 구조를 분석합니다. 코어로그에서 분석 리포트를 확인하세요.",
  openGraph: {
    siteName: "코어로그",
    locale: "ko_KR",
    type: "website",
  },
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="ko">
      <head>
        {/* 토스페이먼츠 SDK v2 */}
        <Script
          src="https://js.tosspayments.com/v2/standard"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${notoSerifKR.variable} ${cinzel.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
