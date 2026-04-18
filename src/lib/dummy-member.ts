import { MemberProfile } from "@/types/member";

/**
 * 프론트엔드 데모용 회원 프로필 고정값.
 * DUMMY_ORDERS 의 memberId: "user_demo" 와 매칭되어 마이페이지 구매 내역 노출.
 *
 * TODO: [백엔드 연동] GET /api/me 응답으로 교체
 */
export const DUMMY_MEMBER: MemberProfile = {
  memberId: "user_demo",
  nickname: "별빛도령",
  email: "demo@yonghadang.com",
  provider: "kakao",
  joinedAt: "2026-03-02T09:00:00.000Z",
};
