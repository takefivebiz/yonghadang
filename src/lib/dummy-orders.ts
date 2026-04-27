import { Order } from '@/types/order';

/**
 * 프론트엔드 데모용 더미 주문 레코드.
 * TODO: [백엔드 연동] /api/orders/[id] 실제 호출로 교체
 */
const DUMMY_ORDERS: Order[] = [
  {
    id: 'sess_demo_self_love',
    category: '연애',
    amount: 0,
    status: 'done',
    ownerType: 'member',
    memberId: 'user_demo',
    createdAt: '2026-04-20T11:00:00.000Z',
  },
  {
    id: 'sess_demo_guest_love',
    category: '연애',
    amount: 900,
    status: 'done',
    ownerType: 'guest',
    paid: true,
    phoneNumber: '01012345678',
    createdAt: '2026-04-15T10:30:00.000Z',
  },
  {
    id: 'sess_demo_member_career',
    category: '직업/진로',
    amount: 4900,
    status: 'done',
    ownerType: 'member',
    memberId: 'user_demo',
    createdAt: '2026-04-12T14:20:00.000Z',
  },
  {
    id: 'sess_demo_guest_emotion',
    category: '감정',
    amount: 0,
    status: 'done',
    ownerType: 'anonymous',
    paid: false,
    phoneNumber: '01012345678',
    createdAt: '2026-04-19T09:15:00.000Z',
  },
  {
    id: 'sess_demo_guest_relation',
    category: '인간관계',
    amount: 0,
    status: 'done',
    ownerType: 'anonymous',
    paid: false,
    phoneNumber: '01012345678',
    createdAt: '2026-04-18T12:00:00.000Z',
  },
];

const LOCAL_STORAGE_KEY = 'corelog:local_orders';

/** localStorage 에 저장된 신규 주문 목록 조회 (브라우저 전용) */
const readLocalOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
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
 * TODO: [백엔드 연동] 제거
 */
export const saveLocalOrder = (order: Order): void => {
  if (typeof window === 'undefined') return;
  const existing = readLocalOrders();
  const deduped = existing.filter((o) => o.id !== order.id);
  const next = [order, ...deduped].slice(0, 30);
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 쿼터 초과 등 무시
  }
};

/**
 * session-id 로 주문 조회.
 * TODO: [백엔드 연동] /api/orders/[id] 실제 호출로 교체
 */
export const getOrder = (sessionId: string): Order | null => {
  const fromDummy = DUMMY_ORDERS.find((o) => o.id === sessionId);
  if (fromDummy) return fromDummy;
  return readLocalOrders().find((o) => o.id === sessionId) ?? null;
};

/** 모든 주문 목록 */
export const listAllOrders = (): Order[] => [
  ...readLocalOrders(),
  ...DUMMY_ORDERS,
];

/**
 * 전화번호 + 비밀번호 + session-id 로 비회원 주문 검증.
 * TODO: [백엔드 연동] POST /api/orders/verify 로 교체 (비밀번호 bcrypt 비교는 서버에서)
 */
export const verifyGuestOrder = (
  sessionId: string,
  phoneNumber: string,
  password: string,
): boolean => {
  const order = getOrder(sessionId);
  if (!order || order.ownerType !== 'guest') return false;

  // 유료 구매 여부 확인 — paid가 true여야만 guest 세션으로 인정
  // TODO: [백엔드 연동] 서버에서 order.paid 필드 검증
  if (!order.paid) {
    return false;
  }

  // 데모용 비밀번호 매핑 (실제로는 DB에서 해시된 비밀번호를 비교해야 함)
  const demoPasswords: Record<string, string> = {
    'sess_demo_guest_love': '1234',
    'sess_demo_guest_emotion': '1234',
    'sess_demo_guest_relation': '1234',
  };

  const normalize = (v: string): string => v.replace(/\D/g, '');

  return (
    normalize(order.phoneNumber ?? '') === normalize(phoneNumber) &&
    demoPasswords[sessionId] === password
  );
};
