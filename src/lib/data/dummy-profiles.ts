import { UserProfile } from "@/lib/types/user";

// TODO: [백엔드 연동] 더미데이터를 GET /api/profiles/me 실제 호출로 교체

export const DUMMY_PROFILES: Record<string, UserProfile> = {
  "user-1": {
    id: "user-1",
    email: "jane@example.com",
    nickname: "jane_lee",
    social_provider: "google",
    role: "user",
    created_at: "2026-04-01T10:00:00Z",
    updated_at: "2026-05-01T14:30:00Z",
  },
  "user-2": {
    id: "user-2",
    email: "mina@example.com",
    nickname: "mina_kim",
    social_provider: "kakao",
    role: "user",
    created_at: "2026-03-15T08:00:00Z",
    updated_at: "2026-04-28T12:00:00Z",
  },
  "user-3": {
    id: "user-3",
    email: "soo@example.com",
    nickname: "soo_park",
    social_provider: "google",
    role: "user",
    created_at: "2026-02-01T16:00:00Z",
    updated_at: "2026-05-02T09:15:00Z",
  },
};

// 현재 로그인한 사용자 시뮬레이션
export const getCurrentUserProfile = (userId: string | undefined): UserProfile | null => {
  if (!userId) return null;
  return DUMMY_PROFILES[userId] || null;
};
