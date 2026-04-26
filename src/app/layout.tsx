import type { Metadata } from "next";
import { Noto_Serif_KR, Cinzel } from "next/font/google";
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
    "선택과 응답으로 현재 상태, 패턴, 관계 구조를 분석해줘. 나, 상대, 우리 사이의 이야기.",
  keywords: ["자기분석", "관계분석", "AI리포트", "심리분석", "패턴인식"],
  openGraph: {
    title: "코어로그 — 사람을 읽는 AI 리포트",
    description:
      "선택과 응답으로 현재 상태, 패턴, 관계 구조를 분석해줘. 나, 상대, 우리 사이의 이야기.",
    siteName: "코어로그",
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="ko">
      <body
        className={`${notoSerifKR.variable} ${cinzel.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
