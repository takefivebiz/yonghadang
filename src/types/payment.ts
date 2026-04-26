import { AnalysisCategory } from './analysis';

/**
 * /analyze 완료 후 /payments 로 넘어갈 때 sessionStorage 에 저장되는 데이터.
 * PRD 5.6: 최종 제출 시 한 번에 서버로 전송.
 */
export interface PendingOrderInput {
  sessionId: string;
  category: AnalysisCategory;
  /** 구매 대상 유료 질문 ID 목록 */
  paidQuestionIds: string[];
  /** 결제 전 결정된 orderId */
  orderId?: string;
  /** 비회원 체크아웃 식별 정보 */
  guestPhone?: string;
  /** 저장 시각 — 만료 체크용 (30분 만료) */
  savedAt: number;
}

/** 비회원 결제 시 입력되는 식별 정보 */
export interface GuestCheckoutInfo {
  phoneNumber: string;
  /** 4자리 숫자 비밀번호 — PRD 5.3: bcrypt 해시로 DB 저장 */
  password: string;
}

/** 토스 successUrl 쿼리 파라미터 */
export interface TossPaymentSuccessParams {
  paymentKey: string;
  orderId: string;
  amount: string;
}

/** 토스 failUrl 쿼리 파라미터 */
export interface TossPaymentFailParams {
  code: string;
  message: string;
  orderId: string;
}
