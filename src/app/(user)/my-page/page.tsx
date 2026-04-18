import { type Metadata } from "next";
import { MyPageClient } from "./_components/my-page-client";

export const metadata: Metadata = {
  title: "마이페이지 | 용하당",
  description: "내 프로필과 구매한 분석 내역을 확인하세요.",
  // 개인 영역이므로 검색엔진 미노출
  robots: { index: false, follow: false },
};

/**
 * PRD 6-7 마이페이지 (/my-page).
 * - 회원만 접근 가능 (현재는 프론트엔드 데모용 자동 로그인 수행 — MyPageClient 참고).
 * - 닉네임 수정, 소셜 로그인 뱃지, 이메일, 로그아웃 버튼
 * - 구매 내역 리스트(최신순), 각 항목 → /report/[order-id]
 *
 * TODO: [백엔드 연동]
 *   - Supabase Auth 세션 검증 후 미로그인 시 `redirect("/auth")`.
 *   - Server Component 로 전환하여 `getMyOrders()` 서버 액션 결과를 하위에 전달.
 */
const MyPage = () => {
  return <MyPageClient />;
};

export default MyPage;
