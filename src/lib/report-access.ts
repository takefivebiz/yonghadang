/**
 * 리포트 접근 권한 관리 유틸 (클라이언트 전용).
 * PRD 6-6: 회원은 Supabase Auth, 비회원은 주문번호 + 휴대폰번호 + 비밀번호 검증.
 * 비회원 열람 토큰만 sessionStorage에서 임시 관리.
 */

const GUEST_ACCESS_PREFIX = "corelog:report_access:";
const GUEST_LOGIN_KEY = "corelog:guest_login";

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
