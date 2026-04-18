import { Order } from "@/types/order";

/**
 * 프론트엔드 데모용 더미 주문 레코드.
 * - my-page, guest-check 페이지에서 주문 내역 노출용으로 참조.
 * - /report/[order-id] 에서 서버 조회 대체재로 사용.
 *
 * TODO: [백엔드 연동] /api/orders/[id] 실제 호출로 교체
 */
const DUMMY_ORDERS: Order[] = [
  {
    id: "ord_demo_guest_mbti_basic",
    contentSlug: "mbti-basic",
    category: "mbti",
    amount: 9900,
    status: "done",
    ownerType: "guest",
    phoneNumber: "01012345678",
    password: "1234",
    createdAt: "2026-04-15T10:30:00.000Z",
  },
  {
    id: "ord_demo_member_saju_deep",
    contentSlug: "saju-deep",
    category: "saju",
    amount: 29900,
    status: "done",
    ownerType: "member",
    memberId: "user_demo",
    createdAt: "2026-04-12T14:20:00.000Z",
  },
  {
    id: "ord_demo_guest_tarot_today",
    contentSlug: "tarot-today",
    category: "tarot",
    amount: 4900,
    status: "generating",
    ownerType: "guest",
    phoneNumber: "01098765432",
    password: "0000",
    createdAt: "2026-04-19T09:15:00.000Z",
  },
  {
    id: "ord_demo_guest_astrology_natal",
    contentSlug: "astrology-natal",
    category: "astrology",
    amount: 19900,
    status: "error",
    ownerType: "guest",
    phoneNumber: "01011112222",
    password: "1111",
    errorMessage:
      "AI 분석 중 일시적인 오류가 발생했어요. 고객센터로 문의해주세요.",
    createdAt: "2026-04-18T12:00:00.000Z",
  },
  {
    id: "ord_demo_guest_tarot_love",
    contentSlug: "tarot-love",
    category: "tarot",
    amount: 9900,
    status: "done",
    ownerType: "guest",
    phoneNumber: "01033334444",
    password: "5678",
    createdAt: "2026-04-10T20:45:00.000Z",
  },
];

const LOCAL_STORAGE_KEY = "yonghadang:local_orders";

/** localStorage 에 저장된 신규 주문 목록 조회 (브라우저 전용) */
const readLocalOrders = (): Order[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
};

/**
 * 결제 성공 후 신규 주문을 localStorage 에 저장.
 * 실제 백엔드 연동 시 서버 DB 가 source of truth 가 되므로 이 함수는 제거.
 * TODO: [백엔드 연동] 제거
 */
export const saveLocalOrder = (order: Order): void => {
  if (typeof window === "undefined") return;
  const existing = readLocalOrders();
  const deduped = existing.filter((o) => o.id !== order.id);
  const next = [order, ...deduped].slice(0, 30); // 과거 30건만 유지
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 쿼터 초과 등 무시
  }
};

/**
 * 주문 ID 로 주문 조회.
 * 1) 더미 고정 주문에서 먼저 찾고, 2) localStorage 에 저장된 신규 주문을 확인.
 * TODO: [백엔드 연동] /api/orders/[id] 실제 호출로 교체
 */
export const getOrder = (orderId: string): Order | null => {
  const fromDummy = DUMMY_ORDERS.find((o) => o.id === orderId);
  if (fromDummy) return fromDummy;

  const fromLocal = readLocalOrders().find((o) => o.id === orderId);
  if (fromLocal) return fromLocal;

  return null;
};

/** 모든 주문 목록 (마이페이지/게스트 조회 용) */
export const listAllOrders = (): Order[] => [
  ...readLocalOrders(),
  ...DUMMY_ORDERS,
];

/**
 * 전화번호 + 비밀번호 로 비회원 주문 검증.
 * 전화번호는 숫자만 비교, 비밀번호는 정확 일치.
 * TODO: [백엔드 연동] POST /api/orders/[id]/verify 로 교체
 */
export const verifyGuestOrder = (
  orderId: string,
  phoneNumber: string,
  password: string,
): boolean => {
  const order = getOrder(orderId);
  if (!order || order.ownerType !== "guest") return false;

  const normalize = (v: string): string => v.replace(/\D/g, "");
  return (
    normalize(order.phoneNumber ?? "") === normalize(phoneNumber) &&
    order.password === password
  );
};
