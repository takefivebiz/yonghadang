-- ============================================================================
-- Corelog 데이터베이스 스키마 생성 (PRD 11.2 기준)
-- ============================================================================

-- 1. 확장 프로그램 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. profiles (회원 프로필) - auth.users와 1:1 연결
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text NOT NULL,
  email text NOT NULL,
  phone text,
  social_provider text NOT NULL CHECK (social_provider IN ('google', 'kakao', 'apple')),
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 프로필 인덱스
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- ============================================================================
-- 3. analysis_sessions (분석 세션) - 회원/비회원 통합
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.analysis_sessions (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  phone_encrypted text,
  password_hash text,
  category text NOT NULL CHECK (category IN ('love', 'relationship', 'career', 'emotion')),
  subcategory text,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  user_type_scores jsonb,
  report_pattern text CHECK (report_pattern IN ('default_detect', 'uncomfortable_truth', 'belief_break')),
  free_report text,
  free_report_status text NOT NULL DEFAULT 'pending' CHECK (free_report_status IN ('pending', 'generating', 'completed', 'failed')),
  free_report_error text,
  loop_depth int NOT NULL DEFAULT 0 CHECK (loop_depth >= 0 AND loop_depth <= 3),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- analysis_sessions 인덱스
CREATE INDEX IF NOT EXISTS analysis_sessions_user_id_idx ON public.analysis_sessions(user_id);
CREATE INDEX IF NOT EXISTS analysis_sessions_expires_at_idx ON public.analysis_sessions(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS analysis_sessions_free_report_status_idx ON public.analysis_sessions(free_report_status);
CREATE INDEX IF NOT EXISTS analysis_sessions_created_at_idx ON public.analysis_sessions(created_at DESC);

-- ============================================================================
-- 4. question_sets (유료 질문 세트)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.question_sets (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.analysis_sessions(id) ON DELETE CASCADE,
  loop_depth int NOT NULL CHECK (loop_depth >= 1 AND loop_depth <= 3),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, loop_depth)
);

CREATE INDEX IF NOT EXISTS question_sets_session_id_idx ON public.question_sets(session_id);

-- ============================================================================
-- 5. questions (유료 질문)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.questions (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  question_set_id uuid NOT NULL REFERENCES public.question_sets(id) ON DELETE CASCADE,
  session_id uuid NOT NULL REFERENCES public.analysis_sessions(id),
  loop_depth int NOT NULL CHECK (loop_depth >= 1 AND loop_depth <= 3),
  title text NOT NULL,
  description text NOT NULL,
  question_axis text NOT NULL CHECK (question_axis IN ('future', 'others', 'self')),
  hooking_type text NOT NULL CHECK (hooking_type IN ('regret', 'fomo', 'avoidance', 'core', 'external_lens', 'timing', 'origin', 'decision')),
  display_order int NOT NULL CHECK (display_order >= 1 AND display_order <= 8),
  is_recommended bool NOT NULL,
  is_blacklisted bool NOT NULL DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- questions 인덱스
CREATE INDEX IF NOT EXISTS questions_session_id_idx ON public.questions(session_id);
CREATE INDEX IF NOT EXISTS questions_question_set_id_idx ON public.questions(question_set_id);
CREATE INDEX IF NOT EXISTS questions_session_blacklisted_idx ON public.questions(session_id, is_blacklisted);
CREATE INDEX IF NOT EXISTS questions_display_order_idx ON public.questions(display_order);

-- ============================================================================
-- 6. orders (결제 주문)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id text NOT NULL PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES public.analysis_sessions(id) ON DELETE RESTRICT,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount int NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  toss_payment_key text,
  toss_receipt_url text,
  payment_method text,
  loop_depth int NOT NULL CHECK (loop_depth >= 1 AND loop_depth <= 3),
  is_bundle bool NOT NULL DEFAULT FALSE,
  failure_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- orders 인덱스
CREATE INDEX IF NOT EXISTS orders_session_id_idx ON public.orders(session_id);
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);

-- ============================================================================
-- 7. order_questions (주문-질문 연결)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.order_questions (
  order_id text NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE RESTRICT,
  PRIMARY KEY (order_id, question_id)
);

CREATE INDEX IF NOT EXISTS order_questions_question_id_idx ON public.order_questions(question_id);

-- ============================================================================
-- 8. paid_reports (유료 리포트)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.paid_reports (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.analysis_sessions(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE RESTRICT,
  order_id text NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  content text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (question_id)
);

-- paid_reports 인덱스
CREATE INDEX IF NOT EXISTS paid_reports_session_id_idx ON public.paid_reports(session_id);
CREATE INDEX IF NOT EXISTS paid_reports_order_id_idx ON public.paid_reports(order_id);
CREATE INDEX IF NOT EXISTS paid_reports_status_idx ON public.paid_reports(status) WHERE status != 'completed';

-- ============================================================================
-- 9. inquiries (문의)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  inquiry_type text NOT NULL CHECK (inquiry_type IN ('bug', 'feedback', 'feature', 'other')),
  title text NOT NULL,
  content text NOT NULL,
  phone text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'resolved')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inquiries_status_idx ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON public.inquiries(created_at DESC);

-- ============================================================================
-- 10. question_generation_logs (AI 질문 생성 로그)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.question_generation_logs (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.analysis_sessions(id) ON DELETE CASCADE,
  loop_depth int NOT NULL,
  generated_questions jsonb NOT NULL,
  is_flagged bool NOT NULL DEFAULT FALSE,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS question_generation_logs_session_id_idx ON public.question_generation_logs(session_id);
CREATE INDEX IF NOT EXISTS question_generation_logs_is_flagged_idx ON public.question_generation_logs(is_flagged) WHERE is_flagged = TRUE;

-- ============================================================================
-- 11. guest_lookup_attempts (비회원 조회 시도 - Rate Limit)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.guest_lookup_attempts (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_hash text NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS guest_lookup_attempts_phone_time_idx ON public.guest_lookup_attempts(phone_hash, attempted_at);

-- ============================================================================
-- 12. 트리거 함수 및 트리거 생성
-- ============================================================================

-- 신규 회원 프로필 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname, social_provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'provider', 'unknown')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- updated_at 트리거 - profiles
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- updated_at 트리거 - analysis_sessions
DROP TRIGGER IF EXISTS set_updated_at ON public.analysis_sessions;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.analysis_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- updated_at 트리거 - orders
DROP TRIGGER IF EXISTS set_updated_at ON public.orders;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- updated_at 트리거 - paid_reports
DROP TRIGGER IF EXISTS set_updated_at ON public.paid_reports;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.paid_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 비회원 세션 만료 시각 자동 설정
CREATE OR REPLACE FUNCTION public.set_guest_session_expiry()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.expires_at = now() + INTERVAL '180 days';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_analysis_session_created ON public.analysis_sessions;
CREATE TRIGGER on_analysis_session_created
  BEFORE INSERT ON public.analysis_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_guest_session_expiry();

-- ============================================================================
-- 13. Row Level Security (RLS) 활성화 및 정책
-- ============================================================================

-- profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Select own profile" ON public.profiles;
CREATE POLICY "Select own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Update own profile" ON public.profiles;
CREATE POLICY "Update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- analysis_sessions RLS
ALTER TABLE public.analysis_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Select own sessions" ON public.analysis_sessions;
CREATE POLICY "Select own sessions" ON public.analysis_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- question_sets RLS
ALTER TABLE public.question_sets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Select session owner's question sets" ON public.question_sets;
CREATE POLICY "Select session owner's question sets" ON public.question_sets
  FOR SELECT USING (session_id IN (SELECT id FROM public.analysis_sessions WHERE user_id = auth.uid()));

-- questions RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Select session owner's questions" ON public.questions;
CREATE POLICY "Select session owner's questions" ON public.questions
  FOR SELECT USING (session_id IN (SELECT id FROM public.analysis_sessions WHERE user_id = auth.uid()));

-- orders RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Select own orders" ON public.orders;
CREATE POLICY "Select own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- paid_reports RLS
ALTER TABLE public.paid_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Select session owner's reports" ON public.paid_reports;
CREATE POLICY "Select session owner's reports" ON public.paid_reports
  FOR SELECT USING (session_id IN (SELECT id FROM public.analysis_sessions WHERE user_id = auth.uid()));

-- inquiries, question_generation_logs, guest_lookup_attempts는 RLS 없음 (서버 전용)
ALTER TABLE public.inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_generation_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_lookup_attempts DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 14. Storage 버킷 설정
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;
