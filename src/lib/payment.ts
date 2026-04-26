import { PendingOrderInput } from "@/types/payment";

/** sessionStorage 키 — /start → /payments 데이터 전달용 */
export const SESSION_PENDING_KEY = "corelog:pending_order";

/** pending 주문 만료 시간 — PRD 3.1 pending 30분 만료 정책과 동기화 */
const PENDING_EXPIRY_MS = 30 * 60 * 1000;

/**
 * 토스페이먼츠 위젯 클라이언트 키 (widget 전용 키, `test_gck_` 또는 `live_gck_` 접두사).
 * 프로덕션에서는 NEXT_PUBLIC_TOSS_CLIENT_KEY 환경 변수로 주입한다.
 * 폴백 값은 토스 공식 도큐먼트 테스트 키.
 * TODO: [백엔드 연동] .env.local 에 실제 widget 연동 키 설정
 */
export const TOSS_CLIENT_KEY =
  process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ??
  "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

/**
 * 토스페이먼츠 orderId 생성.
 * 규격: 영문 대소문자 / 숫자 / `-`, `_`, `=` 로 구성된 6~64자 문자열.
 * crypto.randomUUID() 는 36자 UUID (하이픈 포함) → 규격 적합.
 */
export const generateOrderId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `ord_${crypto.randomUUID()}`;
  }
  // SSR 등 crypto 미지원 환경 폴백
  return `ord_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

/**
 * 토스페이먼츠 customerKey 생성.
 * 규격: 영문 대소문자 / 숫자 / `-`, `_`, `=`, `.`, `@` 중 하나 이상 포함한 2~50자 문자열.
 * 비회원은 토스가 제공하는 ANONYMOUS 상수를 대신 사용한다.
 */
export const generateCustomerKey = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `cust_${crypto.randomUUID()}`;
  }
  return `cust_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

/** /analyze 완료 후 /payments 로 넘어갈 때 입력 정보 저장 (브라우저 전용) */
export const savePendingOrder = (
  input: Omit<PendingOrderInput, "savedAt">,
): void => {
  if (typeof window === "undefined") return;
  const payload: PendingOrderInput = { ...input, savedAt: Date.now() };
  try {
    sessionStorage.setItem(SESSION_PENDING_KEY, JSON.stringify(payload));
  } catch {
    // 스토리지 쿼터 초과 등 — 결제 플로우를 막지 않는다
  }
};

/** /payments 에서 입력 정보 복원 (만료 시 자동 제거) */
export const readPendingOrder = (): PendingOrderInput | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_PENDING_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PendingOrderInput;

    // 30분 초과 시 만료 처리
    if (Date.now() - parsed.savedAt > PENDING_EXPIRY_MS) {
      sessionStorage.removeItem(SESSION_PENDING_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

/** 결제 완료 또는 명시적 취소 시 호출 */
export const clearPendingOrder = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_PENDING_KEY);
};
