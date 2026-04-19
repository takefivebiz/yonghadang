import { type Metadata } from "next";
import { Suspense } from "react";
import { GuestCheckClient } from "./_components/guest-check-client";

export const metadata: Metadata = {
  title: "주문 내역 조회 — 용하당",
  description: "비회원 주문 내역을 확인하고 리포트를 열람하세요.",
  openGraph: {
    title: "주문 내역 조회 — 용하당",
    description: "비회원 주문 내역을 확인하고 리포트를 열람하세요.",
  },
  robots: { index: false, follow: false },
};

/**
 * PRD 6-10. 비회원 주문 조회 페이지 (/guest-check)
 * - 비회원이 자신의 구매 내역을 조회하는 페이지
 * - 구매 내역 리스트 배치
 * - 각 항목 클릭 시 보고서 확인 페이지로 이동
 */
const GuestCheckPage = () => {
  return (
    <Suspense fallback={null}>
      <GuestCheckClient />
    </Suspense>
  );
};

export default GuestCheckPage;
