// ── 구매 타입 ─────────────────────────────────────────────────────────
export type PurchaseType = "single" | "all";

// ── 주문 상태 ─────────────────────────────────────────────────────────
export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

// ── 주문 (DB orders 행과 일치) ───────────────────────────────────────
export interface Order {
  id: string; // Toss orderId (PK)
  session_id: string;
  user_id: string | null;
  guest_id: string | null;
  purchase_type: PurchaseType;
  target_scene_index: number | null; // single 구매 시 대상 scene
  amount: number;
  status: OrderStatus;
  toss_payment_key: string | null;
  toss_receipt_url: string | null;
  payment_method: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── Scene 잠금 해제 (DB scene_unlocks 행과 일치) ─────────────────────
export interface SceneUnlock {
  id: string;
  order_id: string;
  session_id: string;
  scene_index: number;
  created_at: string;
}

// ── 마이페이지 구매 내역 요약 (GET /api/my/orders 응답 타입) ─────────
export interface OrderSummary {
  order_id: string;
  session_id: string;
  purchase_type: PurchaseType;
  amount: number;
  paid_at: string;
  unlocked_scene_indexes: number[];
}

// ── 결제 요청 타입 (POST /api/payments/intent body) ──────────────────
export interface PaymentIntentRequest {
  session_id: string;
  purchase_type: PurchaseType;
  target_scene_index?: number;
  guest_phone?: string;
  guest_pin?: string;
}

// ── 결제 승인 요청 타입 (POST /api/payments/confirm body) ────────────
export interface PaymentConfirmRequest {
  payment_key: string;
  order_id: string;
  amount: number;
}

// ── 결제 승인 응답 타입 ────────────────────────────────────────────────
export interface PaymentConfirmResponse {
  unlocked_scene_indexes: number[];
  guest_token?: string;
  guest_token_expires_at?: string;
}
