import { ContentCategory } from "./content";
import { OrderStatus, OrderOwnerType } from "./order";

/** 관리자용 주문 요약 (리스트 표시용) */
export interface AdminOrderSummary {
  id: string;
  createdAt: string;
  nickname: string;
  ownerType: OrderOwnerType;
  contentTitle: string;
  category: ContentCategory;
  amount: number;
  status: OrderStatus;
}

/** 관리자용 주문 상세 */
export interface AdminOrderDetail extends AdminOrderSummary {
  email?: string;
  phone?: string;
  /** 유저가 입력한 폼 데이터 */
  inputData: Record<string, string>;
  /** AI 생성 리포트 텍스트 */
  reportText?: string;
  /** 토스페이먼츠 결제 승인 일시 */
  approvedAt?: string;
}

/** 관리자용 유저 요약 (리스트 표시용) */
export interface AdminUser {
  id: string;
  nickname: string;
  email?: string;
  phone?: string;
  userType: OrderOwnerType;
  /** 소셜 가입 경로 (회원만) */
  provider?: "google" | "kakao" | "guest";
  hasPurchased: boolean;
  totalOrders: number;
  joinedAt: string;
}

/** 월별 매출 데이터 (대시보드 차트용) */
export interface MonthlySales {
  /** "YYYY-MM" 형식 */
  month: string;
  revenue: number;
}

/** 대시보드 핵심 지표 */
export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  newUsers: number;
  totalReports: number;
  /** 전월 대비 매출 증감률 (%) */
  revenueChangeRate: number;
  ordersChangeRate: number;
  usersChangeRate: number;
  reportsChangeRate: number;
  /** 최근 8개월 월별 매출 */
  monthlySales: MonthlySales[];
}
