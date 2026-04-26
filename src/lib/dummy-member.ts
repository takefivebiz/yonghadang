import { MemberProfile, SocialProvider } from "@/types/member";

/**
 * 프론트엔드 데모용 회원 프로필 고정값.
 * DUMMY_ORDERS 의 memberId: "user_demo" 와 매칭되어 마이페이지 구매 내역 노출.
 *
 * TODO: [백엔드 연동] GET /api/me 응답으로 교체
 */
export const DUMMY_MEMBER: MemberProfile = {
  memberId: "user_demo",
  nickname: "별빛도령",
  email: "demo@corelog.io",
  provider: "kakao",
  joinedAt: "2026-03-02T09:00:00.000Z",
};

/**
 * 프로바이더별 데모 회원 프로필.
 * /auth 페이지에서 Google/Kakao 버튼 클릭 시 해당 프로파일로 로그인 시뮬레이션.
 *
 * TODO: [백엔드 연동] Supabase OAuth 콜백 후 실제 세션/프로필로 대체
 */
export const DUMMY_MEMBERS_BY_PROVIDER: Record<SocialProvider, MemberProfile> =
  {
    kakao: DUMMY_MEMBER,
    google: {
      memberId: "user_demo",
      nickname: "별빛도령",
      email: "demo@corelog.io",
      provider: "google",
      joinedAt: "2026-03-02T09:00:00.000Z",
    },
  };
