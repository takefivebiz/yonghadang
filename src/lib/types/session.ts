// ── 세션 상태 흐름: pending → answered → completed / failed ──────────
export type SessionStatus = "pending" | "answered" | "completed" | "failed";

// ── 분석 세션 (DB analysis_sessions 행과 일치) ───────────────────────
export interface AnalysisSession {
  id: string;
  content_id: string;
  user_id: string | null;
  guest_id: string | null;
  inferred_user_type: Record<string, string> | null;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
}

// ── 세션 요약 (마이페이지 / 비회원 목록 공통) ─────────────────────────
export interface SessionSummary {
  session_id: string;
  content_title: string;
  category: string;
  created_at: string;
  has_purchase: boolean;
}

// ── 비회원 세션 요약 (POST /api/guest/verify 응답 타입) ──────────────
export interface GuestSessionSummary extends SessionSummary {
  guest_token: string;
}
