import { AdminOrderDetail, AdminOrderSummary, AdminUser, SalesSummary, QuestionAnalytic, ReportAnalytic, LoopAnalytic, QuestionLog } from '@/types/admin';

/**
 * 관리자 대시보드 더미 매출 데이터.
 * TODO: [백엔드 연동] /api/admin/sales 실제 호출로 교체
 */
export const DUMMY_SALES_SUMMARY: SalesSummary = {
  totalRevenue: 3_280_000,
  totalOrders: 218,
  newUsers: 47,
  totalReports: 214,
  revenueChangeRate: 12.4,
  ordersChangeRate: 8.1,
  usersChangeRate: -3.2,
  reportsChangeRate: 9.7,
  monthlySales: [
    { month: '2025-09', revenue: 280_000 },
    { month: '2025-10', revenue: 420_000 },
    { month: '2025-11', revenue: 310_000 },
    { month: '2025-12', revenue: 510_000 },
    { month: '2026-01', revenue: 390_000 },
    { month: '2026-02', revenue: 460_000 },
    { month: '2026-03', revenue: 530_000 },
    { month: '2026-04', revenue: 380_000 },
  ],
};

/**
 * 관리자 주문 내역 더미 데이터.
 * TODO: [백엔드 연동] /api/admin/orders 실제 호출로 교체
 */
export const DUMMY_ADMIN_ORDERS: AdminOrderSummary[] = [
  {
    id: 'sess_demo_guest_love',
    createdAt: '2026-04-15T10:30:00.000Z',
    nickname: '별빛손님',
    ownerType: 'guest',
    category: '연애',
    amount: 4900,
    status: 'done',
  },
  {
    id: 'sess_demo_member_career',
    createdAt: '2026-04-12T14:20:00.000Z',
    nickname: '달빛회원',
    ownerType: 'member',
    category: '직업/진로',
    amount: 9800,
    status: 'done',
  },
  {
    id: 'sess_demo_guest_emotion',
    createdAt: '2026-04-19T09:15:00.000Z',
    nickname: '구름손님',
    ownerType: 'guest',
    category: '감정',
    amount: 4900,
    status: 'generating',
  },
  {
    id: 'sess_demo_guest_relation',
    createdAt: '2026-04-18T12:00:00.000Z',
    nickname: '은하손님',
    ownerType: 'guest',
    category: '인간관계',
    amount: 4900,
    status: 'error',
  },
];

/**
 * 관리자 주문 상세 더미 데이터.
 * TODO: [백엔드 연동] /api/admin/orders/[id] 실제 호출로 교체
 */
const DUMMY_ADMIN_ORDER_DETAILS: AdminOrderDetail[] = [
  {
    id: 'sess_demo_guest_love',
    createdAt: '2026-04-15T10:30:00.000Z',
    approvedAt: '2026-04-15T10:30:45.000Z',
    nickname: '별빛손님',
    ownerType: 'guest',
    category: '연애',
    amount: 4900,
    status: 'done',
    phone: '010-1234-5678',
    answerData: {
      q_context: ['opt_썸'],
      q_emotion: ['opt_불안', 'opt_기대'],
      q_value: ['opt_신뢰'],
      q_behavior: ['opt_미룸'],
    },
    freeReportText: '확신은 없는데, 그렇다고 관계를 끊지도 못하고 계속 보고 있는 상태야...',
  },
  {
    id: 'sess_demo_member_career',
    createdAt: '2026-04-12T14:20:00.000Z',
    approvedAt: '2026-04-12T14:20:33.000Z',
    nickname: '달빛회원',
    ownerType: 'member',
    category: '직업/진로',
    amount: 9800,
    status: 'done',
    email: 'dalbit@example.com',
    answerData: {
      q_context: ['opt_방향성'],
      q_emotion: ['opt_답답함'],
      q_value: ['opt_성장', 'opt_안정'],
      q_behavior: ['opt_정보수집'],
    },
    freeReportText: '방향은 알고 있는데, 그쪽으로 움직이지 못하는 상태야...',
  },
];

/**
 * 관리자 유저 목록 더미 데이터.
 * TODO: [백엔드 연동] /api/admin/users 실제 호출로 교체
 */
export const DUMMY_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user_demo_dalbit',
    nickname: '달빛회원',
    email: 'dalbit@example.com',
    userType: 'member',
    provider: 'google',
    hasPurchased: true,
    totalOrders: 2,
    joinedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'user_demo_star',
    nickname: '별빛손님',
    phone: '010-1234-5678',
    userType: 'guest',
    provider: 'guest',
    hasPurchased: true,
    totalOrders: 1,
    joinedAt: '2026-04-15T10:30:00.000Z',
  },
  {
    id: 'user_demo_cloud',
    nickname: '구름손님',
    phone: '010-9876-5432',
    userType: 'guest',
    provider: 'guest',
    hasPurchased: true,
    totalOrders: 1,
    joinedAt: '2026-04-19T09:15:00.000Z',
  },
];

/** 주문 ID로 관리자 주문 상세 조회. */
export const getAdminOrderDetail = (orderId: string): AdminOrderDetail | null =>
  DUMMY_ADMIN_ORDER_DETAILS.find((o) => o.id === orderId) ?? null;

/** 유저 ID로 관리자 유저 상세 및 해당 유저의 주문 목록 조회. */
export const getAdminUserDetail = (
  userId: string,
): { user: AdminUser; orders: AdminOrderSummary[] } | null => {
  const user = DUMMY_ADMIN_USERS.find((u) => u.id === userId);
  if (!user) return null;
  const orders = DUMMY_ADMIN_ORDERS.filter((o) => o.nickname === user.nickname);
  return { user, orders };
};

/**
 * 관리자 질문 분석 더미 데이터 (TOP 20).
 * TODO: [백엔드 연동] /api/admin/analytics/questions 실제 호출로 교체
 */
export const DUMMY_QUESTION_ANALYTICS: QuestionAnalytic[] = [
  { questionId: 'q1', title: '왜 이런 상태가 반복되는 거야?', clickCount: 342, clickRate: 28.5, conversionRate: 42.1, avgPurchaseCount: 1.8 },
  { questionId: 'q2', title: '내가 놓치고 있는 게 뭐야?', clickCount: 298, clickRate: 24.8, conversionRate: 38.9, avgPurchaseCount: 1.6 },
  { questionId: 'q3', title: '이걸 바꾸려면 어디서 시작해야 해?', clickCount: 276, clickRate: 22.9, conversionRate: 35.2, avgPurchaseCount: 1.5 },
  { questionId: 'q4', title: '상대방 입장에서는 이걸 어떻게 봤을까?', clickCount: 245, clickRate: 20.4, conversionRate: 31.8, avgPurchaseCount: 1.4 },
  { questionId: 'q5', title: '내 선택 기준이 문제일 수도 있겠네', clickCount: 198, clickRate: 16.5, conversionRate: 28.6, avgPurchaseCount: 1.3 },
  { questionId: 'q6', title: '지금 이 선택을 하는 이유가 정말 맞아?', clickCount: 187, clickRate: 15.6, conversionRate: 26.4, avgPurchaseCount: 1.2 },
  { questionId: 'q7', title: '내 패턴이 다른 관계에서도 반복되나?', clickCount: 164, clickRate: 13.7, conversionRate: 24.1, avgPurchaseCount: 1.1 },
  { questionId: 'q8', title: '지금 상태를 유지하면 어떻게 될까?', clickCount: 152, clickRate: 12.7, conversionRate: 22.3, avgPurchaseCount: 1.0 },
  { questionId: 'q9', title: '내가 원하는 게 정말 이건가?', clickCount: 141, clickRate: 11.8, conversionRate: 20.5, avgPurchaseCount: 0.9 },
  { questionId: 'q10', title: '지금 행동하지 않는 이유가 뭐야?', clickCount: 128, clickRate: 10.7, conversionRate: 18.9, avgPurchaseCount: 0.8 },
  { questionId: 'q11', title: '내가 두려워하는 게 뭔지 알고 싶어', clickCount: 115, clickRate: 9.6, conversionRate: 17.2, avgPurchaseCount: 0.8 },
  { questionId: 'q12', title: '상대방과의 관계에서 내 역할은?', clickCount: 103, clickRate: 8.6, conversionRate: 15.4, avgPurchaseCount: 0.7 },
  { questionId: 'q13', title: '이 상황에서 내가 할 수 있는 게 뭐야?', clickCount: 92, clickRate: 7.7, conversionRate: 13.8, avgPurchaseCount: 0.7 },
  { questionId: 'q14', title: '내 선택이 맞다는 신호는 뭐야?', clickCount: 81, clickRate: 6.8, conversionRate: 12.1, avgPurchaseCount: 0.6 },
  { questionId: 'q15', title: '다음 단계로 나아가기 위해 필요한 게 뭐야?', clickCount: 74, clickRate: 6.2, conversionRate: 10.9, avgPurchaseCount: 0.6 },
  { questionId: 'q16', title: '내가 이 결정을 뒤로 미루는 이유', clickCount: 63, clickRate: 5.3, conversionRate: 9.5, avgPurchaseCount: 0.5 },
  { questionId: 'q17', title: '상황 자체가 문제인가, 내 해석이 문제인가?', clickCount: 58, clickRate: 4.8, conversionRate: 8.7, avgPurchaseCount: 0.5 },
  { questionId: 'q18', title: '지금 필요한 게 조언인가, 공감인가?', clickCount: 52, clickRate: 4.3, conversionRate: 7.9, avgPurchaseCount: 0.5 },
  { questionId: 'q19', title: '내 감정을 움직이는 핵심 트리거가 뭐야?', clickCount: 47, clickRate: 3.9, conversionRate: 7.2, avgPurchaseCount: 0.4 },
  { questionId: 'q20', title: '나는 이 상황에서 어떤 사람이 되고 싶어?', clickCount: 41, clickRate: 3.4, conversionRate: 6.4, avgPurchaseCount: 0.4 },
];

/**
 * 관리자 리포트 분석 더미 데이터.
 * TODO: [백엔드 연동] /api/admin/analytics/reports 실제 호출로 교체
 */
export const DUMMY_REPORT_ANALYTICS: ReportAnalytic = {
  freeReportCount: 1247,
  paidReportCount: 456,
  freeTooltotal: '73.2%',
  avgLength: 850,
  successRate: 94.2,
  failureRate: 5.8,
  avgRetentionTime: 2145,
};

/**
 * 관리자 탐색 루프 분석 더미 데이터.
 * TODO: [백엔드 연동] /api/admin/analytics/loops 실제 호출로 교체
 */
export const DUMMY_LOOP_ANALYTICS: LoopAnalytic = {
  avgLoopDepth: 1.82,
  depth1Users: 847,
  depth2Users: 456,
  depth3Users: 198,
  depth1To2ConversionRate: 53.8,
  depth2To3ConversionRate: 43.4,
  dropoffPoint: 'depth2',
  avgQuestionsPerUser: 3.2,
};

/**
 * 관리자 질문 생성 로그 더미 데이터.
 * TODO: [백엔드 연동] /api/admin/question-logs 실제 호출로 교체
 */
export const DUMMY_QUESTION_LOGS: QuestionLog[] = [
  {
    id: 'log_001',
    sessionId: 'sess_demo_guest_love',
    questionText: '왜 자꾸만 같은 패턴이 반복돼?',
    status: 'active',
    createdAt: '2026-04-19T15:32:00.000Z',
    updatedAt: '2026-04-19T15:32:00.000Z',
  },
  {
    id: 'log_002',
    sessionId: 'sess_demo_member_career',
    questionText: '이 선택이 정말 나를 위한 걸까?',
    status: 'active',
    createdAt: '2026-04-19T14:12:00.000Z',
    updatedAt: '2026-04-19T14:12:00.000Z',
  },
  {
    id: 'log_003',
    sessionId: 'sess_demo_guest_emotion',
    questionText: '내가 놓치고 있는 게 뭐야? 내가 놓치고 있는 게 뭐야?',
    status: 'duplicate',
    flagReason: '중복된 질문',
    createdAt: '2026-04-18T09:45:00.000Z',
    updatedAt: '2026-04-19T10:20:00.000Z',
  },
  {
    id: 'log_004',
    sessionId: 'sess_demo_guest_relation',
    questionText: '이거... 너무 부정적이지 않나?',
    status: 'flagged',
    flagReason: '톤 검토 필요',
    adminNote: '표현이 너무 강함. 리포트 재생성 권장',
    createdAt: '2026-04-17T11:22:00.000Z',
    updatedAt: '2026-04-19T08:15:00.000Z',
  },
  {
    id: 'log_005',
    sessionId: 'sess_demo_test_001',
    questionText: '이 상황에서 할 수 있는 게 뭐가 있을까?',
    status: 'blacklisted',
    adminNote: '부적절한 질문 유형 - 영구 차단',
    createdAt: '2026-04-16T13:00:00.000Z',
    updatedAt: '2026-04-19T09:30:00.000Z',
  },
  {
    id: 'log_006',
    sessionId: 'sess_demo_guest_love',
    questionText: '상대방 입장에서 나는 어떻게 보일까?',
    status: 'active',
    createdAt: '2026-04-15T16:45:00.000Z',
    updatedAt: '2026-04-15T16:45:00.000Z',
  },
];
