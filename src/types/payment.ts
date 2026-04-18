import { ContentCategory } from "./content";

/**
 * /start 에서 /payments 로 넘어갈 때 sessionStorage 에 저장되는 입력 정보.
 * PRD 6-5: "입력 정보 요약" 섹션을 위한 데이터 구조.
 */
export interface PendingOrderInput {
  contentSlug: string;
  category: ContentCategory;
  /** 입력 정보 요약 표시용 (라벨 + 값 페어) */
  summary: Array<{ label: string; value: string }>;
  /** 저장 시각 — 만료 체크용 (PRD 3.1 pending 30분 만료 정책) */
  savedAt: number;
}

/** 비회원 결제 시 입력되는 식별 정보 (PRD 6-5) */
export interface GuestCheckoutInfo {
  phoneNumber: string;
  password: string;
}

/** 토스 successUrl 로 리다이렉트될 때 쿼리 파라미터로 전달되는 결제 승인 정보 */
export interface TossPaymentSuccessParams {
  paymentKey: string;
  orderId: string;
  amount: string;
}

/** 토스 failUrl 로 리다이렉트될 때 쿼리 파라미터로 전달되는 결제 실패 정보 */
export interface TossPaymentFailParams {
  code: string;
  message: string;
  orderId: string;
}
