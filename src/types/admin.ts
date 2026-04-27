import { AnalysisCategory } from './analysis';
import { OrderStatus, OrderOwnerType } from './order';

/** 관리자용 주문 요약 (리스트 표시용) */
export interface AdminOrderSummary {
  id: string;
  createdAt: string;
  nickname: string;
  ownerType: OrderOwnerType;
  category: AnalysisCategory;
  amount: number;
  status: OrderStatus;
}

/** 관리자용 주문 상세 */
export interface AdminOrderDetail extends AdminOrderSummary {
  email?: string;
  phone?: string;
  /** 유저 응답 데이터 (질문 ID → 선택지 ID 배열) */
  answerData: Record<string, string[]>;
  /** AI 생성 무료 리포트 텍스트 */
  freeReportText?: string;
  /** 토스페이먼츠 결제 승인 일시 */
  approvedAt?: string;
}

/** 관리자용 유저 요약 */
export interface AdminUser {
  id: string;
  nickname: string;
  email?: string;
  phone?: string;
  userType: OrderOwnerType;
  provider?: 'google' | 'kakao' | 'apple' | 'guest';
  hasPurchased: boolean;
  totalOrders: number;
  joinedAt: string;
}

/** 월별 매출 데이터 */
export interface MonthlySales {
  month: string; // "YYYY-MM"
  revenue: number;
}

/** 대시보드 핵심 지표 */
export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  newUsers: number;
  totalReports: number;
  revenueChangeRate: number;
  ordersChangeRate: number;
  usersChangeRate: number;
  reportsChangeRate: number;
  monthlySales: MonthlySales[];
}

/** 질문 분석 데이터 (8-7) */
export interface QuestionAnalytic {
  questionId: string;
  title: string;
  clickCount: number;
  clickRate: number; // 백분율
  conversionRate: number; // 백분율
  avgPurchaseCount: number;
}

/** 리포트 분석 데이터 (8-8) */
export interface ReportAnalytic {
  freeReportCount: number;
  paidReportCount: number;
  freeTooltotal: string; // "65%"
  avgLength: number; // 평균 글자 수
  successRate: number; // 백분율
  failureRate: number; // 백분율
  avgRetentionTime: number; // 초 단위
}

/** 탐색 루프 분석 데이터 (8-9) */
export interface LoopAnalytic {
  avgLoopDepth: number;
  depth1Users: number;
  depth2Users: number;
  depth3Users: number;
  depth1To2ConversionRate: number; // 백분율
  depth2To3ConversionRate: number; // 백분율
  dropoffPoint: 'depth1' | 'depth2' | 'depth3';
  avgQuestionsPerUser: number;
}

/** 질문 생성 로그 (8-10) */
export interface QuestionLog {
  id: string;
  sessionId: string;
  questionText: string;
  status: 'active' | 'duplicate' | 'flagged' | 'blacklisted';
  flagReason?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}
