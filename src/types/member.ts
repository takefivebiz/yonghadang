/** 소셜 로그인 제공자 — PRD 6-7 마이페이지에서 로고로 노출 */
export type SocialProvider = "google" | "kakao";

/**
 * 회원 프로필 (프론트엔드 더미 전용).
 * TODO: [백엔드 연동] Supabase Auth + profiles 테이블 응답 구조에 맞춰 교체.
 */
export interface MemberProfile {
  /** DUMMY_ORDERS.memberId 와 매칭되는 식별자 */
  memberId: string;
  nickname: string;
  email: string;
  provider: SocialProvider;
  /** ISO 8601 — 가입 시각 */
  joinedAt: string;
}
