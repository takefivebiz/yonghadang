import { Order, OrderStatus, PurchaseType, SceneUnlock } from "@/lib/types/payment";

// TODO: [백엔드 연동] 더미데이터를 실제 DB 쿼리로 교체
// POST /api/payments/intent - 결제 의향 생성
// POST /api/payments/confirm - 결제 확인
// GET /api/orders/[id] - 주문 조회
// GET /api/orders - 사용자 주문 목록

// ── 결제 주문 더미 데이터 ────────────────────────────────────────────
export const DUMMY_ORDERS: Record<string, Order> = {
  "order-1": {
    id: "order-1",
    session_id: "session-1",
    user_id: "user-1",
    guest_id: null,
    purchase_type: "single" as PurchaseType,
    target_scene_index: 3,
    amount: 900,
    status: "paid" as OrderStatus,
    toss_payment_key: "toss_key_1",
    toss_receipt_url: "https://toss.im/receipt/order-1",
    payment_method: "CARD",
    failure_reason: null,
    paid_at: "2026-05-01T10:30:00Z",
    created_at: "2026-05-01T10:15:00Z",
    updated_at: "2026-05-01T10:30:00Z",
  },
  "order-2": {
    id: "order-2",
    session_id: "session-1",
    user_id: "user-1",
    guest_id: null,
    purchase_type: "all" as PurchaseType,
    target_scene_index: null,
    amount: 2900,
    status: "paid" as OrderStatus,
    toss_payment_key: "toss_key_2",
    toss_receipt_url: "https://toss.im/receipt/order-2",
    payment_method: "CARD",
    failure_reason: null,
    paid_at: "2026-05-01T11:00:00Z",
    created_at: "2026-05-01T10:45:00Z",
    updated_at: "2026-05-01T11:00:00Z",
  },
  "order-3": {
    id: "order-3",
    session_id: "session-3",
    user_id: null,
    guest_id: "guest-1",
    purchase_type: "single" as PurchaseType,
    target_scene_index: 4,
    amount: 900,
    status: "paid" as OrderStatus,
    toss_payment_key: "toss_key_3",
    toss_receipt_url: "https://toss.im/receipt/order-3",
    payment_method: "CARD",
    failure_reason: null,
    paid_at: "2026-04-25T09:20:00Z",
    created_at: "2026-04-25T09:10:00Z",
    updated_at: "2026-04-25T09:20:00Z",
  },
  "order-4": {
    id: "order-4",
    session_id: "session-4",
    user_id: "user-3",
    guest_id: null,
    purchase_type: "all" as PurchaseType,
    target_scene_index: null,
    amount: 2900,
    status: "paid" as OrderStatus,
    toss_payment_key: "toss_key_4",
    toss_receipt_url: "https://toss.im/receipt/order-4",
    payment_method: "CARD",
    failure_reason: null,
    paid_at: "2026-05-02T12:00:00Z",
    created_at: "2026-05-02T11:50:00Z",
    updated_at: "2026-05-02T12:00:00Z",
  },
};

// ── 장면 잠금 해제 더미 데이터 ────────────────────────────────────────
export const DUMMY_SCENE_UNLOCKS: Record<string, SceneUnlock[]> = {
  "session-1": [
    {
      id: "unlock-1-3",
      session_id: "session-1",
      scene_index: 3,
      order_id: "order-1",
      unlocked_at: "2026-05-01T10:30:00Z",
    },
    {
      id: "unlock-1-4",
      session_id: "session-1",
      scene_index: 4,
      order_id: "order-2",
      unlocked_at: "2026-05-01T11:00:00Z",
    },
    {
      id: "unlock-1-5",
      session_id: "session-1",
      scene_index: 5,
      order_id: "order-2",
      unlocked_at: "2026-05-01T11:00:00Z",
    },
    {
      id: "unlock-1-6",
      session_id: "session-1",
      scene_index: 6,
      order_id: "order-2",
      unlocked_at: "2026-05-01T11:00:00Z",
    },
  ],
  "session-3": [
    {
      id: "unlock-3-4",
      session_id: "session-3",
      scene_index: 4,
      order_id: "order-3",
      unlocked_at: "2026-04-25T09:20:00Z",
    },
  ],
  "session-4": [
    {
      id: "unlock-4-3",
      session_id: "session-4",
      scene_index: 3,
      order_id: "order-4",
      unlocked_at: "2026-05-02T12:00:00Z",
    },
    {
      id: "unlock-4-4",
      session_id: "session-4",
      scene_index: 4,
      order_id: "order-4",
      unlocked_at: "2026-05-02T12:00:00Z",
    },
    {
      id: "unlock-4-5",
      session_id: "session-4",
      scene_index: 5,
      order_id: "order-4",
      unlocked_at: "2026-05-02T12:00:00Z",
    },
    {
      id: "unlock-4-6",
      session_id: "session-4",
      scene_index: 6,
      order_id: "order-4",
      unlocked_at: "2026-05-02T12:00:00Z",
    },
  ],
};

// 세션별 잠금 해제된 씬 목록 조회
export const getUnlockedScenes = (sessionId: string): number[] => {
  return (DUMMY_SCENE_UNLOCKS[sessionId] || []).map((u) => u.scene_index);
};

// 주문으로부터 잠금 해제된 씬 조회
export const getUnlockedScenesFromOrder = (orderId: string): number[] => {
  const scenes: number[] = [];
  Object.values(DUMMY_SCENE_UNLOCKS).forEach((unlocks) => {
    unlocks.forEach((unlock) => {
      if (unlock.order_id === orderId && !scenes.includes(unlock.scene_index)) {
        scenes.push(unlock.scene_index);
      }
    });
  });
  return scenes.sort((a, b) => a - b);
};

// 사용자별 주문 조회
export const getUserOrders = (userId: string | null, guestId: string | null): Order[] => {
  return Object.values(DUMMY_ORDERS).filter(
    (order) =>
      (userId && order.user_id === userId && order.status === "paid") ||
      (guestId && order.guest_id === guestId && order.status === "paid")
  );
};
