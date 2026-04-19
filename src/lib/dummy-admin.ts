import { AdminOrderDetail, AdminOrderSummary, AdminUser, SalesSummary } from "@/types/admin";

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
    { month: "2025-09", revenue: 280_000 },
    { month: "2025-10", revenue: 420_000 },
    { month: "2025-11", revenue: 310_000 },
    { month: "2025-12", revenue: 510_000 },
    { month: "2026-01", revenue: 390_000 },
    { month: "2026-02", revenue: 460_000 },
    { month: "2026-03", revenue: 530_000 },
    { month: "2026-04", revenue: 380_000 },
  ],
};

/**
 * 관리자 주문 내역 더미 데이터.
 * TODO: [백엔드 연동] /api/admin/orders 실제 호출로 교체
 */
export const DUMMY_ADMIN_ORDERS: AdminOrderSummary[] = [
  {
    id: "ord_demo_guest_mbti_basic",
    createdAt: "2026-04-15T10:30:00.000Z",
    nickname: "별빛손님",
    ownerType: "guest",
    contentTitle: "MBTI 기본 분석",
    category: "mbti",
    amount: 9900,
    status: "done",
  },
  {
    id: "ord_demo_member_saju_deep",
    createdAt: "2026-04-12T14:20:00.000Z",
    nickname: "달빛회원",
    ownerType: "member",
    contentTitle: "사주 심층 분석",
    category: "saju",
    amount: 29900,
    status: "done",
  },
  {
    id: "ord_demo_guest_tarot_today",
    createdAt: "2026-04-19T09:15:00.000Z",
    nickname: "구름손님",
    ownerType: "guest",
    contentTitle: "오늘의 타로",
    category: "tarot",
    amount: 4900,
    status: "generating",
  },
  {
    id: "ord_demo_guest_astrology_natal",
    createdAt: "2026-04-18T12:00:00.000Z",
    nickname: "은하손님",
    ownerType: "guest",
    contentTitle: "별자리 출생 차트",
    category: "astrology",
    amount: 19900,
    status: "error",
  },
  {
    id: "ord_demo_guest_tarot_love",
    createdAt: "2026-04-10T20:45:00.000Z",
    nickname: "장미손님",
    ownerType: "guest",
    contentTitle: "연애 타로",
    category: "tarot",
    amount: 9900,
    status: "done",
  },
  {
    id: "ord_demo_member_mbti_couple",
    createdAt: "2026-04-08T16:00:00.000Z",
    nickname: "달빛회원",
    ownerType: "member",
    contentTitle: "커플 MBTI 궁합",
    category: "mbti",
    amount: 14900,
    status: "done",
  },
  {
    id: "ord_demo_member_saju_year",
    createdAt: "2026-04-05T11:30:00.000Z",
    nickname: "하늘회원",
    ownerType: "member",
    contentTitle: "올해 사주 운세",
    category: "saju",
    amount: 19900,
    status: "done",
  },
  {
    id: "ord_demo_guest_astrology_compat",
    createdAt: "2026-04-02T09:00:00.000Z",
    nickname: "바람손님",
    ownerType: "guest",
    contentTitle: "별자리 궁합",
    category: "astrology",
    amount: 14900,
    status: "done",
  },
];

/**
 * 관리자 주문 상세 더미 데이터.
 * TODO: [백엔드 연동] /api/admin/orders/[id] 실제 호출로 교체
 */
const DUMMY_ADMIN_ORDER_DETAILS: AdminOrderDetail[] = [
  {
    id: "ord_demo_guest_mbti_basic",
    createdAt: "2026-04-15T10:30:00.000Z",
    approvedAt: "2026-04-15T10:30:45.000Z",
    nickname: "별빛손님",
    ownerType: "guest",
    contentTitle: "MBTI 기본 분석",
    category: "mbti",
    amount: 9900,
    status: "done",
    phone: "010-1234-5678",
    inputData: {
      mbti: "INFP",
      concern: "직업과 진로에 대한 고민이 많아요.",
    },
    reportText:
      "INFP 유형은 깊은 감수성과 창의성을 지닌 이상주의자입니다. 진로 선택에 있어서 자신의 가치관과 일치하는 일을 찾는 것이 중요합니다. 예술, 상담, 글쓰기 등 사람의 내면을 다루는 분야에서 크게 빛을 발할 수 있습니다...",
  },
  {
    id: "ord_demo_member_saju_deep",
    createdAt: "2026-04-12T14:20:00.000Z",
    approvedAt: "2026-04-12T14:20:33.000Z",
    nickname: "달빛회원",
    ownerType: "member",
    contentTitle: "사주 심층 분석",
    category: "saju",
    amount: 29900,
    status: "done",
    email: "dalbit@example.com",
    inputData: {
      birthDate: "1995-03-15",
      birthTime: "오전 7시",
      gender: "여성",
    },
    reportText:
      "목(木) 기운이 강한 사주로, 봄의 새싹처럼 성장 에너지가 넘칩니다. 2026년은 금(金) 운이 들어오는 해로 재물과 인연의 변화가 예상됩니다...",
  },
  {
    id: "ord_demo_guest_tarot_today",
    createdAt: "2026-04-19T09:15:00.000Z",
    nickname: "구름손님",
    ownerType: "guest",
    contentTitle: "오늘의 타로",
    category: "tarot",
    amount: 4900,
    status: "generating",
    phone: "010-9876-5432",
    inputData: {
      question: "오늘 중요한 면접이 있는데 잘 될까요?",
    },
  },
  {
    id: "ord_demo_guest_astrology_natal",
    createdAt: "2026-04-18T12:00:00.000Z",
    nickname: "은하손님",
    ownerType: "guest",
    contentTitle: "별자리 출생 차트",
    category: "astrology",
    amount: 19900,
    status: "error",
    phone: "010-1111-2222",
    inputData: {
      birthDate: "1998-11-22",
      birthTime: "오후 3시 30분",
      birthPlace: "서울",
    },
  },
  {
    id: "ord_demo_guest_tarot_love",
    createdAt: "2026-04-10T20:45:00.000Z",
    approvedAt: "2026-04-10T20:45:22.000Z",
    nickname: "장미손님",
    ownerType: "guest",
    contentTitle: "연애 타로",
    category: "tarot",
    amount: 9900,
    status: "done",
    phone: "010-3333-4444",
    inputData: {
      question: "좋아하는 사람이 나를 어떻게 생각할까요?",
    },
    reportText:
      "세 장의 카드가 펼쳐졌습니다. 과거 — 컵의 에이스: 새로운 감정의 시작. 현재 — 연인: 선택의 기로. 미래 — 별: 희망과 치유의 에너지...",
  },
  {
    id: "ord_demo_member_mbti_couple",
    createdAt: "2026-04-08T16:00:00.000Z",
    approvedAt: "2026-04-08T16:00:18.000Z",
    nickname: "달빛회원",
    ownerType: "member",
    contentTitle: "커플 MBTI 궁합",
    category: "mbti",
    amount: 14900,
    status: "done",
    email: "dalbit@example.com",
    inputData: {
      myMbti: "INFP",
      partnerMbti: "ENTJ",
    },
    reportText:
      "INFP와 ENTJ의 조합은 대조적인 성향으로 인해 처음에는 마찰이 생길 수 있지만, 서로의 부족한 점을 보완하는 강력한 파트너십을 형성할 수 있습니다...",
  },
  {
    id: "ord_demo_member_saju_year",
    createdAt: "2026-04-05T11:30:00.000Z",
    approvedAt: "2026-04-05T11:30:55.000Z",
    nickname: "하늘회원",
    ownerType: "member",
    contentTitle: "올해 사주 운세",
    category: "saju",
    amount: 19900,
    status: "done",
    email: "haneul@example.com",
    inputData: {
      birthDate: "1990-07-04",
      birthTime: "모름",
      gender: "남성",
    },
    reportText:
      "병오(丙午)년 생으로 화(火) 기운이 왕성합니다. 2026년 병오년에 같은 기운이 겹치며 열정과 도전의 해가 예상됩니다...",
  },
  {
    id: "ord_demo_guest_astrology_compat",
    createdAt: "2026-04-02T09:00:00.000Z",
    approvedAt: "2026-04-02T09:00:38.000Z",
    nickname: "바람손님",
    ownerType: "guest",
    contentTitle: "별자리 궁합",
    category: "astrology",
    amount: 14900,
    status: "done",
    phone: "010-5555-6666",
    inputData: {
      myStar: "처녀자리",
      partnerStar: "물병자리",
    },
    reportText:
      "처녀자리와 물병자리의 만남은 지성과 분석력이 만나는 조합입니다. 두 별자리 모두 깊은 사고를 즐기며 세상을 개선하고자 하는 열망이 있습니다...",
  },
];

/**
 * 관리자 유저 목록 더미 데이터.
 * TODO: [백엔드 연동] /api/admin/users 실제 호출로 교체
 */
export const DUMMY_ADMIN_USERS: AdminUser[] = [
  {
    id: "user_demo_dalbit",
    nickname: "달빛회원",
    email: "dalbit@example.com",
    userType: "member",
    provider: "google",
    hasPurchased: true,
    totalOrders: 3,
    joinedAt: "2026-03-01T10:00:00.000Z",
  },
  {
    id: "user_demo_haneul",
    nickname: "하늘회원",
    email: "haneul@example.com",
    userType: "member",
    provider: "kakao",
    hasPurchased: true,
    totalOrders: 1,
    joinedAt: "2026-03-15T14:30:00.000Z",
  },
  {
    id: "user_demo_star",
    nickname: "별빛손님",
    phone: "010-1234-5678",
    userType: "guest",
    provider: "guest",
    hasPurchased: true,
    totalOrders: 1,
    joinedAt: "2026-04-15T10:30:00.000Z",
  },
  {
    id: "user_demo_cloud",
    nickname: "구름손님",
    phone: "010-9876-5432",
    userType: "guest",
    provider: "guest",
    hasPurchased: true,
    totalOrders: 1,
    joinedAt: "2026-04-19T09:15:00.000Z",
  },
  {
    id: "user_demo_galaxy",
    nickname: "은하손님",
    phone: "010-1111-2222",
    userType: "guest",
    provider: "guest",
    hasPurchased: true,
    totalOrders: 1,
    joinedAt: "2026-04-18T12:00:00.000Z",
  },
  {
    id: "user_demo_rose",
    nickname: "장미손님",
    phone: "010-3333-4444",
    userType: "guest",
    provider: "guest",
    hasPurchased: true,
    totalOrders: 1,
    joinedAt: "2026-04-10T20:45:00.000Z",
  },
  {
    id: "user_demo_wind",
    nickname: "바람손님",
    phone: "010-5555-6666",
    userType: "guest",
    provider: "guest",
    hasPurchased: true,
    totalOrders: 1,
    joinedAt: "2026-04-02T09:00:00.000Z",
  },
];

/**
 * 주문 ID로 관리자 주문 상세 조회.
 * TODO: [백엔드 연동] /api/admin/orders/[id] 실제 호출로 교체
 */
export const getAdminOrderDetail = (orderId: string): AdminOrderDetail | null =>
  DUMMY_ADMIN_ORDER_DETAILS.find((o) => o.id === orderId) ?? null;

/**
 * 유저 ID로 관리자 유저 상세 및 해당 유저의 주문 목록 조회.
 * TODO: [백엔드 연동] /api/admin/users/[id] 실제 호출로 교체
 */
export const getAdminUserDetail = (
  userId: string,
): { user: AdminUser; orders: AdminOrderSummary[] } | null => {
  const user = DUMMY_ADMIN_USERS.find((u) => u.id === userId);
  if (!user) return null;

  // 닉네임 기준으로 해당 유저의 주문 필터링
  const orders = DUMMY_ADMIN_ORDERS.filter((o) => o.nickname === user.nickname);
  return { user, orders };
};
