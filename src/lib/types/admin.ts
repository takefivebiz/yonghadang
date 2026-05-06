import type { Answer } from "./analyze";
import type { ResultScene } from "./result";
import type { OrderStatus, PurchaseType } from "./payment";

// ── 유저 타입 (회원 / 비회원) ─────────────────────────────────────────
export type UserType = "member" | "guest";

// ── AI 재생성 사유 ────────────────────────────────────────────────────
export type RegenerateReason = "error" | "irrelevant" | "tone" | "other";

// ── 대시보드 통계 (GET /api/admin/dashboard 응답 타입) ────────────────
export interface DashboardStats {
  total_revenue: number;
  order_count: number;
  unique_users: number;
  daily_stats: { date: string; revenue: number; orders: number }[];
  category_stats: { category: string; count: number }[];
}

// ── 관리자 주문 목록 (GET /api/admin/orders 응답 타입) ────────────────
export interface AdminOrder {
  order_id: string;
  user_type: UserType;
  buyer_identifier: string;
  status: OrderStatus;
  amount: number;
  purchase_type: PurchaseType;
  session_id: string;
  content_title: string;
  paid_at: string | null;
  created_at: string;
}

// ── 관리자 주문 상세 (GET /api/admin/orders/[order_id] 응답 타입) ─────
export interface AdminOrderDetail {
  order_id: string;
  user_type: UserType;
  buyer_info: { email?: string; phone?: string };
  status: OrderStatus;
  amount: number;
  paid_at: string | null;
  session_id: string;
  inferred_user_type: Record<string, string> | null;
  answers: Answer[];
  scenes: ResultScene[];
}

// ── 관리자 유저 목록 (GET /api/admin/users 응답 타입) ─────────────────
export interface AdminUser {
  user_id: string;
  user_type: UserType;
  identifier: string; // 이메일 (회원) 또는 전화번호 마스킹 (비회원)
  social_provider?: string;
  order_count: number;
  total_spent: number;
  created_at: string;
}

// ── AI 재생성 요청 (POST /api/admin/sessions/[session_id]/regenerate body) ──
export interface RegenerateRequest {
  reason: RegenerateReason;
  reason_detail?: string;
  extra_instruction?: string;
  scene_index?: number; // 생략 시 전체 재생성
}
