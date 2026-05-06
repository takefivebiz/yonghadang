// ── 답변 단위 (API POST /api/analyze/[session_id]/answers body와 일치) ──
export interface Answer {
  question_index: number;
  question_text: string;
  answer_text?: string;      // 자유 입력 또는 기타 텍스트 응답
  answer_options?: string[]; // 보정 질문 선택형 응답 (value 배열)
}

// ── 입력 단계 stage ──────────────────────────────────────────────────
export type AnalyzeStage = "free_input" | "correction_questions" | "completed";

// ── 입력 단계 프론트엔드 상태 ─────────────────────────────────────────
export interface AnalyzeState {
  session_id: string;
  content_id: string;
  stage: AnalyzeStage;
  free_input: string;
  answers: Answer[];
}

// ── localStorage 저장 포맷 (결과 페이지에서 읽기용) ────────────────────
export interface AnalyzeAnswers {
  session_id: string;
  content_id: string;
  free_input: string;
  answers: Answer[];
  created_at: string;
}
