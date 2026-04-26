import { AdminOrderDetail, AdminOrderSummary, AdminUser, SalesSummary } from '@/types/admin';

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
