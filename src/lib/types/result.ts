// ── Scene 메시지 타입 비율 가이드:
//   ai    ~70% — 감정 기록 느낌의 주 메시지 (컨테이너 없는 순수 텍스트)
//   punch ~20% — 핵심 문장 강조, 씬당 최대 1개
//   memo  ~10% — 감정 메모 쪽지, 씬당 최대 1개

export type SceneMessageType = "ai" | "punch" | "memo";

export interface SceneMessage {
  type: SceneMessageType;
  text: string;
}

// ── 결과 Scene (API GET /api/sessions/[session_id]/scenes 응답 타입과 일치) ──
export interface ResultScene {
  id: string;
  scene_index: number;
  scene_title: string;
  is_free: boolean;
  is_unlocked: boolean;
  // 무료·잠금해제 씬: 전체 메시지, 미구매 유료 씬: null
  messages: SceneMessage[] | null;
  // 잠금 씬 미리보기 (fade-out 직전까지 공개)
  preview_messages: SceneMessage[] | null;
}

// ── 결과 페이지 프론트엔드 상태 ──────────────────────────────────────
export interface ResultPageState {
  scenes: ResultScene[];
  is_bottom_sheet_open: boolean;
}
