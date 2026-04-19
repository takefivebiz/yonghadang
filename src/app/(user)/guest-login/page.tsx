import { type Metadata } from "next";
import { Suspense } from "react";
import { GuestLoginClient } from "../auth/_components/guest-login-client";

export const metadata: Metadata = {
  title: "비회원 주문 조회 — 용하당",
  description:
    "결제 시 등록한 휴대폰번호와 비밀번호로 주문 내역을 조회하세요.",
  openGraph: {
    title: "비회원 주문 조회 — 용하당",
    description:
      "결제 시 등록한 휴대폰번호와 비밀번호로 주문 내역을 조회하세요.",
  },
  // 비회원 주문 조회 페이지는 검색엔진 노출 불필요
  robots: { index: false, follow: false },
};

/**
 * PRD 6-9. 비회원 주문 조회 로그인 (/guest-login)
 * - 전화번호 + 비밀번호 입력 폼
 * - "주문 조회" 버튼
 * - 성공 시 /guest-check 로 이동
 */
const GuestLoginPage = () => {
  return (
    <Suspense fallback={null}>
      <GuestLoginClient />
    </Suspense>
  );
};

export default GuestLoginPage;
