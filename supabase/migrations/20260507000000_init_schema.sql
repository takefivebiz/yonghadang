-- ============================================================
-- VEIL v1 초기 스키마
-- ============================================================

-- ── 공통 트리거 함수: updated_at 자동 갱신 ─────────────────────
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- ╔══════════════════════════════════════════════════════════╗
-- ║  1. profiles                                            ║
-- ║  auth.users 확장. 소셜 로그인 완료 시 자동 생성.           ║
-- ╚══════════════════════════════════════════════════════════╝
create table profiles (
  id              uuid        not null primary key
                    references auth.users(id) on delete cascade,
  email           text        not null unique,
  nickname        text        not null,
  social_provider text        not null
                    check (social_provider in ('google', 'kakao')),
  role            text        not null default 'user'
                    check (role in ('user', 'admin')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at_column();

alter table profiles enable row level security;

create policy "profiles: 본인 조회"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: 본인 수정"
  on profiles for update
  using (auth.uid() = id);

-- auth.users 생성 시 profiles 자동 삽입
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into profiles (id, email, nickname, social_provider)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(new.raw_app_meta_data->>'provider', 'google')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();


-- ╔══════════════════════════════════════════════════════════╗
-- ║  2. contents                                            ║
-- ║  관리자가 등록하는 콘텐츠. 유저 진입의 시작점.              ║
-- ╚══════════════════════════════════════════════════════════╝
create table contents (
  id            uuid        not null primary key default gen_random_uuid(),
  title         text        not null,
  subtitle      text,
  category      text        not null
                  check (category in ('love', 'relationship', 'career', 'emotion')),
  thumbnail_url text,
  -- 자유 입력 placeholder, 예시 문장, 보정 질문, 선택지, reaction 설정
  input_config  jsonb       not null default '{}',
  -- scene 구조 및 프롬프트 설정
  scene_config  jsonb       not null default '{}',
  is_active     boolean     not null default true,
  sort_order    integer,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_contents_category    on contents(category);
create index idx_contents_is_active   on contents(is_active);
create index idx_contents_sort_order  on contents(sort_order nulls last);

create trigger trg_contents_updated_at
  before update on contents
  for each row execute function update_updated_at_column();

alter table contents enable row level security;

create policy "contents: 활성 콘텐츠 전체 조회"
  on contents for select
  using (is_active = true);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  8. guest_credentials  (analysis_sessions 의존 없음)    ║
-- ║  비회원 인증 정보. 영구 보관.                              ║
-- ╚══════════════════════════════════════════════════════════╝
create table guest_credentials (
  id         uuid        not null primary key default gen_random_uuid(),
  phone_hash text        not null unique,
  pin_hash   text        not null,
  created_at timestamptz not null default now()
);

-- 서버 전용 (service_role만 접근)
alter table guest_credentials enable row level security;


-- ╔══════════════════════════════════════════════════════════╗
-- ║  3. analysis_sessions                                   ║
-- ║  사용자가 콘텐츠 진입 시 생성. /result/[id] URL 식별자.   ║
-- ╚══════════════════════════════════════════════════════════╝
create table analysis_sessions (
  id                 uuid        not null primary key default gen_random_uuid(),
  content_id         uuid        not null
                       references contents(id) on delete restrict,
  user_id            uuid
                       references profiles(id) on delete set null,
  guest_id           uuid
                       references guest_credentials(id) on delete set null,
  -- AI가 추론한 감정 흐름 및 행동 패턴 데이터
  inferred_user_type jsonb,
  -- pending → answered → completed / failed
  status             text        not null default 'pending'
                       check (status in ('pending', 'answered', 'completed', 'failed')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index idx_analysis_sessions_user_id    on analysis_sessions(user_id);
create index idx_analysis_sessions_guest_id   on analysis_sessions(guest_id);
create index idx_analysis_sessions_content_id on analysis_sessions(content_id);
create index idx_analysis_sessions_status     on analysis_sessions(status);

create trigger trg_analysis_sessions_updated_at
  before update on analysis_sessions
  for each row execute function update_updated_at_column();

alter table analysis_sessions enable row level security;

create policy "analysis_sessions: 회원 본인 세션 조회"
  on analysis_sessions for select
  using (auth.uid() = user_id);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  4. session_answers                                     ║
-- ║  세션 내 질문별 응답. 자유 입력과 보정 질문 통합 저장.      ║
-- ╚══════════════════════════════════════════════════════════╝
create table session_answers (
  id             uuid        not null primary key default gen_random_uuid(),
  session_id     uuid        not null
                   references analysis_sessions(id) on delete cascade,
  question_index integer     not null check (question_index >= 1),
  -- 콘텐츠 수정 후에도 기존 응답 구조 유지를 위한 스냅샷
  question_text  text        not null,
  answer_text    text,                     -- 자유 입력
  answer_options jsonb,                    -- 선택형 응답 (value 배열)
  branch_key     text,                     -- 질문 분기 추적
  created_at     timestamptz not null default now(),
  unique (session_id, question_index),
  -- 자유 입력 또는 선택형 중 하나는 반드시 존재
  constraint answer_not_empty
    check (answer_text is not null or answer_options is not null)
);

create index idx_session_answers_session_id on session_answers(session_id);

alter table session_answers enable row level security;


-- ╔══════════════════════════════════════════════════════════╗
-- ║  5. result_scenes                                       ║
-- ║  AI(Claude)가 생성한 분석 결과 scene. 세션당 N개.          ║
-- ╚══════════════════════════════════════════════════════════╝
create table result_scenes (
  id               uuid        not null primary key default gen_random_uuid(),
  session_id       uuid        not null
                     references analysis_sessions(id) on delete cascade,
  scene_index      integer     not null check (scene_index >= 1),
  scene_title      text        not null,
  -- [{ type: 'ai'|'punch'|'memo', text: string }]
  messages         jsonb       not null default '[]',
  -- 잠금 scene 미리보기용 message 배열
  preview_messages jsonb,
  is_free          boolean     not null,
  -- pending → generating → completed / failed
  status           text        not null default 'pending'
                     check (status in ('pending', 'generating', 'completed', 'failed')),
  error_message    text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (session_id, scene_index)
);

create index idx_result_scenes_session_id on result_scenes(session_id);

create trigger trg_result_scenes_updated_at
  before update on result_scenes
  for each row execute function update_updated_at_column();

alter table result_scenes enable row level security;


-- ╔══════════════════════════════════════════════════════════╗
-- ║  6. orders                                              ║
-- ║  결제 주문. 회원/비회원 공용.                               ║
-- ╚══════════════════════════════════════════════════════════╝
create table orders (
  id                 text        not null primary key, -- Toss orderId
  session_id         uuid        not null
                       references analysis_sessions(id) on delete restrict,
  user_id            uuid
                       references profiles(id) on delete set null,
  guest_id           uuid
                       references guest_credentials(id) on delete set null,
  purchase_type      text        not null
                       check (purchase_type in ('single', 'all')),
  target_scene_index integer     check (target_scene_index >= 1),
  amount             integer     not null check (amount > 0),
  status             text        not null default 'pending'
                       check (status in ('pending', 'paid', 'failed', 'refunded')),
  toss_payment_key   text,
  toss_receipt_url   text,
  payment_method     text,
  failure_reason     text,
  paid_at            timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  -- 회원이거나 비회원이어야 함 (둘 다 null 불가)
  constraint orders_owner_not_null
    check (user_id is not null or guest_id is not null),
  -- single 구매 시 target_scene_index 필수
  constraint orders_single_requires_scene
    check (purchase_type != 'single' or target_scene_index is not null)
);

create index idx_orders_session_id on orders(session_id);
create index idx_orders_user_id    on orders(user_id);
create index idx_orders_guest_id   on orders(guest_id);
create index idx_orders_status     on orders(status);
create index idx_orders_paid_at    on orders(paid_at desc) where status = 'paid';

create trigger trg_orders_updated_at
  before update on orders
  for each row execute function update_updated_at_column();

alter table orders enable row level security;

create policy "orders: 회원 본인 주문 조회"
  on orders for select
  using (auth.uid() = user_id);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  7. scene_unlocks                                       ║
-- ║  결제 완료 후 scene별 잠금 해제 기록. 1 scene = 1행.      ║
-- ╚══════════════════════════════════════════════════════════╝
create table scene_unlocks (
  id          uuid        not null primary key default gen_random_uuid(),
  session_id  uuid        not null
                references analysis_sessions(id) on delete cascade,
  scene_index integer     not null check (scene_index >= 1),
  order_id    text        not null
                references orders(id) on delete restrict,
  unlocked_at timestamptz not null default now(),
  unique (session_id, scene_index)
);

create index idx_scene_unlocks_session_id on scene_unlocks(session_id);

alter table scene_unlocks enable row level security;


-- ╔══════════════════════════════════════════════════════════╗
-- ║  9. guest_access_tokens                                 ║
-- ║  비회원 결제/조회 인증 후 발급. 세션 단위. 30분 TTL.       ║
-- ╚══════════════════════════════════════════════════════════╝
create table guest_access_tokens (
  id         uuid        not null primary key default gen_random_uuid(),
  guest_id   uuid        not null
               references guest_credentials(id) on delete cascade,
  session_id uuid        not null
               references analysis_sessions(id) on delete cascade,
  token_hash text        not null unique,
  expires_at timestamptz not null,
  is_revoked boolean     not null default false,
  created_at timestamptz not null default now()
);

create index idx_guest_tokens_token_hash      on guest_access_tokens(token_hash);
create index idx_guest_tokens_guest_session   on guest_access_tokens(guest_id, session_id);
create index idx_guest_tokens_expires_at      on guest_access_tokens(expires_at)
  where is_revoked = false;

-- 서버 전용 (service_role만 접근)
alter table guest_access_tokens enable row level security;


-- ╔══════════════════════════════════════════════════════════╗
-- ║  10. ai_regeneration_logs                               ║
-- ║  관리자의 AI 재생성 요청 이력.                             ║
-- ╚══════════════════════════════════════════════════════════╝
create table ai_regeneration_logs (
  id                uuid        not null primary key default gen_random_uuid(),
  session_id        uuid        not null
                      references analysis_sessions(id) on delete cascade,
  -- null = 전체 재생성, 값 있음 = 특정 scene만
  scene_index       integer     check (scene_index >= 1),
  reason            text        not null
                      check (reason in ('error', 'irrelevant', 'tone', 'other')),
  reason_detail     text,
  extra_instruction text,
  regenerated_by    uuid        not null
                      references profiles(id) on delete restrict,
  created_at        timestamptz not null default now()
);

create index idx_regen_logs_session_id on ai_regeneration_logs(session_id);

alter table ai_regeneration_logs enable row level security;


-- ╔══════════════════════════════════════════════════════════╗
-- ║  11. payment_security_logs                              ║
-- ║  결제 위변조 의심 이벤트. RLS 없음 (서버 전용).             ║
-- ╚══════════════════════════════════════════════════════════╝
create table payment_security_logs (
  id               uuid        not null primary key default gen_random_uuid(),
  order_id         text
                     references orders(id) on delete set null,
  event_type       text        not null,
  expected_amount  integer,
  received_amount  integer,
  severity         text        not null
                     check (severity in ('low', 'medium', 'high', 'critical')),
  ip_address       text,
  user_agent       text,
  created_at       timestamptz not null default now()
);

create index idx_security_logs_order_id  on payment_security_logs(order_id);
create index idx_security_logs_severity  on payment_security_logs(severity);
create index idx_security_logs_created   on payment_security_logs(created_at desc);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  12. guest_lookup_attempts                              ║
-- ║  비회원 조회 시도 기록. 브루트포스 방지.                    ║
-- ╚══════════════════════════════════════════════════════════╝
create table guest_lookup_attempts (
  id           uuid        not null primary key default gen_random_uuid(),
  phone_hash   text        not null,
  ip_address   text,
  is_success   boolean     not null,
  attempted_at timestamptz not null default now()
);

create index idx_lookup_attempts_phone_hash   on guest_lookup_attempts(phone_hash);
create index idx_lookup_attempts_attempted_at on guest_lookup_attempts(attempted_at desc);

-- 서버 전용 (service_role만 접근)
alter table guest_lookup_attempts enable row level security;
