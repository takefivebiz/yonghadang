// ── 소셜 로그인 제공자 ────────────────────────────────────────────────
export type SocialProvider = "google" | "kakao";

// ── 유저 권한 ─────────────────────────────────────────────────────────
export type UserRole = "user" | "admin";

// ── 회원 프로필 (DB profiles 행 / GET /api/my/profile 응답 타입과 일치) ──
export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  social_provider: SocialProvider;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
