-- ============================================================================
-- 사용자 입력 상황 설명(user_context) 추가
-- ============================================================================

-- analysis_sessions 테이블에 user_context 컬럼 추가
ALTER TABLE public.analysis_sessions
ADD COLUMN IF NOT EXISTS user_context text;
