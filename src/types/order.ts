import { AnalysisCategory } from './analysis';

/** 주문/세션 상태 — PRD 5.8 AI 생성 상태 처리 */
export type OrderStatus = 'pending' | 'generating' | 'done' | 'error';

/** 주문 소유자 유형 — 'anonymous': 비회원 무료리포트 (인증 불필요), 'guest': 비회원 결제 완료 (인증 필요) */
export type OrderOwnerType = 'member' | 'guest' | 'anonymous';

/**
 * 주문 레코드 (프론트엔드 더미 전용).
 * TODO: [백엔드 연동] /api/orders/[id] 응답 구조에 맞춰 교체.
 */
export interface Order {
  /** session-id — /report/[session-id] 라우트의 식별자 */
  id: string;
  category: AnalysisCategory;
  /** 결제 금액 (KRW) */
  amount: number;
  status: OrderStatus;
  ownerType: OrderOwnerType;
  /** 비회원: 결제 시 입력한 휴대폰번호 (숫자만, 하이픈 없음) */
  phoneNumber?: string;
  /** 회원: Supabase user id */
  memberId?: string;
  errorMessage?: string;
  createdAt: string;
}
