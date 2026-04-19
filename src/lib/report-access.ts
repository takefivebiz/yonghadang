/**
 * 리포트 접근 권한 관리 유틸 (클라이언트 전용).
 * PRD 6-6: 회원은 세션, 비회원은 주문번호 + 휴대폰번호 + 비밀번호 검증.
 * PRD 6-7: 회원 로그인 상태 및 프로필을 마이페이지에서 참조.
 *
 * TODO: [백엔드 연동] 서버 세션 기반 권한 확인으로 교체.
 *       현재 프론트엔드 데모는 sessionStorage 로 열람 토큰을 임시 관리.
 */

import { MemberProfile } from "@/types/member";

const GUEST_ACCESS_PREFIX = "yonghadang:report_access:";
const MEMBER_SESSION_KEY = "yonghadang:member_session";
const GUEST_LOGIN_KEY = "yonghadang:guest_login";

/** 주문별 비회원 열람 허용 토큰 저장 (30분 유효) */
const GUEST_ACCESS_TTL_MS = 30 * 60 * 1000;

interface GuestAccessRecord {
  orderId: string;
  grantedAt: number;
}

/** 비회원 열람 허용 기록 */
export const grantGuestAccess = (orderId: string): void => {
  if (typeof window === "undefined") return;
  const record: GuestAccessRecord = { orderId, grantedAt: Date.now() };
  try {
    window.sessionStorage.setItem(
      `${GUEST_ACCESS_PREFIX}${orderId}`,
      JSON.stringify(record),
    );
  } catch {
    // 무시
  }
};

/** 비회원 열람 허용 여부 확인 */
export const hasGuestAccess = (orderId: string): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.sessionStorage.getItem(
      `${GUEST_ACCESS_PREFIX}${orderId}`,
    );
    if (!raw) return false;

    const record = JSON.parse(raw) as GuestAccessRecord;
    if (Date.now() - record.grantedAt > GUEST_ACCESS_TTL_MS) {
      window.sessionStorage.removeItem(`${GUEST_ACCESS_PREFIX}${orderId}`);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

/** 비회원 열람 허용 해제 */
export const revokeGuestAccess = (orderId: string): void => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(`${GUEST_ACCESS_PREFIX}${orderId}`);
};

/**
 * 회원 로그인 여부 확인 (프론트엔드 데모).
 * TODO: [백엔드 연동] Supabase Auth 또는 쿠키 기반 세션으로 교체
 */
export const isMemberLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(MEMBER_SESSION_KEY);
};

/**
 * 회원 프로필 조회 (localStorage 기반 데모).
 * 세션이 없으면 null 을 돌려 호출측이 로그인 유도.
 *
 * TODO: [백엔드 연동] GET /api/me 로 교체
 */
export const getMemberProfile = (): MemberProfile | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(MEMBER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as MemberProfile;
  } catch {
    return null;
  }
};

/** 로그인/로그아웃 상태 변경을 헤더 등 구독자에게 알리는 커스텀 이벤트 */
export const AUTH_CHANGE_EVENT = "yonghadang:auth-changed";

/**
 * 회원 로그인 시뮬레이션 — 프로필을 localStorage 에 저장.
 * TODO: [백엔드 연동] OAuth 콜백 처리 후 서버 세션 쿠키 발급으로 교체
 */
export const loginAsMember = (profile: MemberProfile): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(MEMBER_SESSION_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  } catch {
    // 쿼터 초과 등 무시
  }
};

/**
 * 회원 프로필 부분 수정 (닉네임 등).
 * TODO: [백엔드 연동] PATCH /api/me 로 교체
 */
export const updateMemberProfile = (
  patch: Partial<MemberProfile>,
): MemberProfile | null => {
  const current = getMemberProfile();
  if (!current) return null;
  const next: MemberProfile = { ...current, ...patch };
  loginAsMember(next);
  return next;
};

/**
 * 회원 로그아웃 — 세션 삭제.
 * TODO: [백엔드 연동] POST /api/auth/logout 으로 교체
 */
export const logoutMember = (): void => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(MEMBER_SESSION_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

/** 비회원 로그인 세션 저장 (전화번호만 저장, 패스워드는 저장하지 않음) */
export const loginAsGuest = (phoneNumber: string): void => {
  if (typeof window === "undefined") return;
  try {
    const normalize = (v: string): string => v.replace(/\D/g, "");
    window.sessionStorage.setItem(
      GUEST_LOGIN_KEY,
      JSON.stringify({ phoneNumber: normalize(phoneNumber) }),
    );
  } catch {
    // 쿼터 초과 등 무시
  }
};

/** 비회원 로그인 여부 확인 */
export const isGuestLoggedIn = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!window.sessionStorage.getItem(GUEST_LOGIN_KEY);
};

/** 비회원 세션에서 전화번호 조회 */
export const getGuestPhoneNumber = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(GUEST_LOGIN_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { phoneNumber: string };
    return data.phoneNumber;
  } catch {
    return null;
  }
};

/** 비회원 로그아웃 */
export const logoutGuest = (): void => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(GUEST_LOGIN_KEY);
};
