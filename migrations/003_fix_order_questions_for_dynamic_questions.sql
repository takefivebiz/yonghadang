-- ============================================================================
-- Create order_dynamic_questions table for dynamically generated questions
-- Problem: paidQuestions are generated in report_data JSON, not pre-stored in questions table
-- Solution: Keep order_questions (for static DB questions) separate from order_dynamic_questions
-- ============================================================================

-- 1. 새 테이블: order_dynamic_questions (동적 생성 유료 질문 저장)
CREATE TABLE IF NOT EXISTS public.order_dynamic_questions (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  question_payload jsonb NOT NULL,
  display_order int NOT NULL CHECK (display_order >= 1),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS order_dynamic_questions_order_id_idx ON public.order_dynamic_questions(order_id);

-- 2. paid_reports.question_id를 nullable로 변경 (동적 질문 지원)
ALTER TABLE public.paid_reports
ALTER COLUMN question_id DROP NOT NULL;

-- 사용 예시:
-- question_payload:
-- {
--   "id": "paid_q_1_0",
--   "question": "감정의 진짜 원인은 뭘까?",
--   "description": "축 1 깊이 질문 1",
--   "price": 900,
--   "displayOrder": 1,
--   "axis": 1
-- }
