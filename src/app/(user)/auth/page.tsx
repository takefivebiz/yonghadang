import { type Metadata } from "next";
import { Suspense } from "react";
import { AuthClient } from "./_components/auth-client";

export const metadata: Metadata = {
  title: "로그인 / 회원가입 — 코어로그",
  description:
    "카카오 · 구글 계정으로 1초 만에 로그인하고 당신만의 분석 리포트를 이어가세요.",
  openGraph: {
    title: "로그인 / 회원가입 — 코어로그",
    description:
      "카카오 · 구글 계정으로 1초 만에 로그인하고 당신만의 분석 리포트를 이어가세요.",
  },
  // 로그인 페이지는 검색엔진 노출 불필요
  robots: { index: false, follow: false },
};

/**
 * PRD 6-8. 회원 로그인/회원가입 (/auth)
 * - Kakao / Google 소셜 로그인만 지원
 * - 성공 시 `?next=` 경로 또는 `/` 로 이동하며,
 *   개발/프로덕션 환경 각각의 도메인으로 라우팅된다.
 */
const AuthPage = () => {
  return (
    <Suspense fallback={null}>
      <AuthClient />
    </Suspense>
  );
};

export default AuthPage;
