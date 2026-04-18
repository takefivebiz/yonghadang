import { ContentCategory } from "./content";

/** 주문 상태 — PRD 6-6: AI 생성 상태 처리 */
export type OrderStatus = "pending" | "generating" | "done" | "error";

/** 주문 소유자 유형 */
export type OrderOwnerType = "member" | "guest";

/**
 * 주문/리포트 레코드 (프론트엔드 더미 전용).
 * 실제 DB 스키마의 orders + reports 를 단순화한 평탄 구조.
 * TODO: [백엔드 연동] /api/orders/[id] 응답 구조에 맞춰 교체.
 */
export interface Order {
  id: string;
  contentSlug: string;
  category: ContentCategory;
  /** 결제 금액 (KRW) */
  amount: number;
  /** 리포트 생성 상태 */
  status: OrderStatus;
  ownerType: OrderOwnerType;
  /** 비회원 주문: 결제 시 입력한 휴대폰번호 (숫자만, 하이픈 없음) */
  phoneNumber?: string;
  /** 비회원 주문: 결제 시 입력한 비밀번호 (평문 저장은 프론트엔드 더미에서만 허용) */
  password?: string;
  /** 회원 주문: 소유자 식별자 */
  memberId?: string;
  /** 실패 시 사유 */
  errorMessage?: string;
  /** ISO 8601 생성 시각 */
  createdAt: string;
}
