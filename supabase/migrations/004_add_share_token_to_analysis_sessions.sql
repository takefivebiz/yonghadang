-- ============================================================
-- 004: analysis_sessions에 share_token 컬럼 추가
-- ============================================================
-- 배경:
--   현재 share.ts는 share_id = session_id로 임시 처리 중.
--   session uuid가 URL에 직접 노출되면 세션 접근 권한 없이
--   share 경로로 데이터를 추론할 수 있어 보안 위험.
--   별도 share_token을 발급해 /share/[share_token] 경로에 사용한다.
--
-- 토큰 생성 전략: DB DEFAULT (권장)
--   - 신규 row INSERT 시 DB가 자동으로 32자 hex 토큰을 생성한다.
--   - API 레이어에서 별도 처리 불필요, INSERT 직후 바로 조회 가능.
--   - 기존 row는 NULL로 남는다 (nullable 설계).
--     → 실제 share 요청이 오면 API에서 UPDATE로 backfill한다.
--
-- nullable 유지 이유:
--   - 기존 analysis_sessions row에 NOT NULL 강제 적용 불가.
--   - share 기능을 아직 사용하지 않은 세션은 NULL이 자연스럽다.
--   - token이 NULL인 세션에 share 요청 시 API에서 생성 후 저장.
-- ============================================================


-- ── 1. 컬럼 추가 ──────────────────────────────────────────────────────
-- DEFAULT: 신규 session INSERT 시 DB가 자동 생성.
-- 기존 row는 NULL 유지.
ALTER TABLE analysis_sessions
  ADD COLUMN IF NOT EXISTS share_token text
    DEFAULT replace(gen_random_uuid()::text, '-', '');


-- ── 2. UNIQUE 제약 (idempotent) ────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_constraint
    WHERE  conname  = 'analysis_sessions_share_token_key'
      AND  conrelid = 'analysis_sessions'::regclass
  ) THEN
    ALTER TABLE analysis_sessions
      ADD CONSTRAINT analysis_sessions_share_token_key UNIQUE (share_token);
  END IF;
END
$$;


-- ── 3. 조회 인덱스 ────────────────────────────────────────────────────
-- /share/[share_token] 경로 조회 성능을 위해 NULL 제외 partial index 사용.
CREATE INDEX IF NOT EXISTS idx_analysis_sessions_share_token
  ON analysis_sessions(share_token)
  WHERE share_token IS NOT NULL;


-- ── 4. 기존 NULL row backfill ─────────────────────────────────────────
-- 이미 존재하는 세션에도 token을 채운다.
-- share 기능이 실제 사용되기 전에 미리 채워두면 API backfill 로직이 불필요.
-- 단, ON CONFLICT 처리를 위해 uuid 중복 가능성을 피하고자 loop로 처리.
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT id FROM analysis_sessions WHERE share_token IS NULL LOOP
    BEGIN
      UPDATE analysis_sessions
         SET share_token = replace(gen_random_uuid()::text, '-', '')
       WHERE id = r.id;
    EXCEPTION WHEN unique_violation THEN
      -- 극히 드문 uuid 충돌 시 재시도 없이 건너뜀. 다음 실행에서 처리됨.
      NULL;
    END;
  END LOOP;
END
$$;
