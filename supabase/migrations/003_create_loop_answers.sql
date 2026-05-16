-- ============================================================
-- 003: loop_answers 테이블 생성
-- ============================================================
-- loop reading 결과를 DB에 저장한다.
-- 현재 클라이언트는 localStorage에만 저장하지만,
-- 백엔드 연동 시 이 테이블에 upsert한다.
--
-- unique(session_id, loop_type) 설계 근거:
--   - 사용자가 동일 session + loop_type을 재생성하면 덮어쓴다.
--   - localStorage 동작(최신 1건 유지)과 동일한 의미론.
--   - ON CONFLICT (session_id, loop_type) DO UPDATE로 upsert.
-- ============================================================


CREATE TABLE IF NOT EXISTS loop_answers (
  id           uuid        not null primary key default gen_random_uuid(),
  session_id   uuid        not null
                 references analysis_sessions(id) on delete cascade,

  -- "action" | "standard" | "evaluate"
  loop_type    text        not null
                 check (loop_type in ('action', 'standard', 'evaluate')),

  -- 사용자에게 노출하는 리딩 제목
  title        text        not null,

  -- Claude가 생성한 메시지 배열: [{ type: "punch" | "ai", text: string }]
  messages     jsonb       not null default '[]',

  -- API 응답의 generatedAt (클라이언트에서 받은 ISO 8601 값)
  generated_at timestamptz not null,

  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  -- 세션당 loop_type 1건만 유지 (재생성 시 upsert)
  unique (session_id, loop_type)
);

create index if not exists idx_loop_answers_session_id
  on loop_answers(session_id);

create trigger trg_loop_answers_updated_at
  before update on loop_answers
  for each row execute function update_updated_at_column();

alter table loop_answers enable row level security;

-- 회원 본인 세션에 연결된 loop answer만 조회 허용
create policy "loop_answers: 회원 본인 조회"
  on loop_answers for select
  using (
    exists (
      select 1 from analysis_sessions s
      where s.id = loop_answers.session_id
        and s.user_id = auth.uid()
    )
  );
