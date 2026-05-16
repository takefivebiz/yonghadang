-- ============================================================
-- 005: session_answers.question_index → step_id 변경
-- ============================================================
-- 배경:
--   input_config V2에서 questions 배열(index 기반)이 steps 배열(id 기반)로
--   교체됨에 따라, session_answers의 식별자도 정수 index에서 문자열 step_id로
--   변경한다.
--
-- 안전성:
--   이 마이그레이션 실행 시점에 session_answers 테이블에 실제 데이터가 없다.
--   (백엔드 연동 전, 클라이언트는 localStorage에만 저장 중)
--   따라서 단순 DROP / ADD 방식으로 진행한다.
--   데이터가 있는 환경이라면 ADD → backfill → NOT NULL → DROP 순서로 처리해야 한다.
-- ============================================================


-- ── 1. 기존 unique constraint 제거 ─────────────────────────────────────
ALTER TABLE session_answers
  DROP CONSTRAINT IF EXISTS session_answers_session_id_question_index_key;


-- ── 2. question_index 컬럼 제거 ────────────────────────────────────────
ALTER TABLE session_answers
  DROP COLUMN IF EXISTS question_index;


-- ── 3. step_id 컬럼 추가 ───────────────────────────────────────────────
-- input_config.steps[*].id 값 (예: "free_input", "q1_situation", "q1" …)
ALTER TABLE session_answers
  ADD COLUMN IF NOT EXISTS step_id text NOT NULL DEFAULT '';

-- DEFAULT ''는 컬럼 추가를 위한 임시 값. 실제 삽입 시에는 NOT NULL이 강제된다.
ALTER TABLE session_answers
  ALTER COLUMN step_id DROP DEFAULT;


-- ── 4. check constraint 수정 ───────────────────────────────────────────
-- 기존 answer_not_empty check는 answer_text / answer_options 기준이므로 유지.
-- (question_index에 대한 check는 없었음)


-- ── 5. 새 unique constraint 추가 ──────────────────────────────────────
ALTER TABLE session_answers
  ADD CONSTRAINT session_answers_session_id_step_id_key
    UNIQUE (session_id, step_id);
