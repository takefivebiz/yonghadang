-- ============================================================================
-- 무료 분석 질문 통합 마이그레이션
-- question_sets / questions 테이블 확장 (free + paid 통합)
-- 카테고리당 6개 질문 × 4개 선택지 seed 데이터 포함
-- ============================================================================

-- ============================================================================
-- 0. 기존 NOT NULL 제약 해제 (free question_sets/questions 추가를 위해)
-- ============================================================================
-- question_sets: session_id, loop_depth nullable로 변경
ALTER TABLE public.question_sets ALTER COLUMN session_id DROP NOT NULL;
ALTER TABLE public.question_sets ALTER COLUMN loop_depth DROP NOT NULL;

-- questions: free 질문용 컬럼들 nullable로 변경
ALTER TABLE public.questions ALTER COLUMN session_id DROP NOT NULL;
ALTER TABLE public.questions ALTER COLUMN loop_depth DROP NOT NULL;
ALTER TABLE public.questions ALTER COLUMN title DROP NOT NULL;
ALTER TABLE public.questions ALTER COLUMN description DROP NOT NULL;
ALTER TABLE public.questions ALTER COLUMN question_axis DROP NOT NULL;
ALTER TABLE public.questions ALTER COLUMN hooking_type DROP NOT NULL;
ALTER TABLE public.questions ALTER COLUMN display_order DROP NOT NULL;
ALTER TABLE public.questions ALTER COLUMN is_recommended DROP NOT NULL;

-- ============================================================================
-- 1. question_sets 테이블 확장
-- ============================================================================
ALTER TABLE public.question_sets
ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT 'paid' CHECK (purpose IN ('free', 'paid')),
ADD COLUMN IF NOT EXISTS category text CHECK (category IN ('love', 'relationship', 'career', 'emotion')),
ADD COLUMN IF NOT EXISTS relationship_group text CHECK (relationship_group IN ('연인', '배우자', '친구', '가족', '동료', '경쟁자', '기타')),
ADD COLUMN IF NOT EXISTS relationship_type text,
ADD COLUMN IF NOT EXISTS version text NOT NULL DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS is_active bool NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sort_order int,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE public.question_sets
DROP CONSTRAINT IF EXISTS check_purpose_constraints;

ALTER TABLE public.question_sets
ADD CONSTRAINT check_purpose_constraints CHECK (
  (purpose = 'paid' AND session_id IS NOT NULL AND category IS NULL) OR
  (purpose = 'free' AND session_id IS NULL AND loop_depth IS NULL AND category IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS question_sets_purpose_idx ON public.question_sets(purpose);
CREATE INDEX IF NOT EXISTS question_sets_category_idx ON public.question_sets(category) WHERE purpose = 'free';
CREATE INDEX IF NOT EXISTS question_sets_is_active_idx ON public.question_sets(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS question_sets_relationship_group_idx ON public.question_sets(relationship_group) WHERE purpose = 'free' AND relationship_group IS NOT NULL;

-- ============================================================================
-- 2. questions 테이블 확장
-- ============================================================================
ALTER TABLE public.questions
ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT 'paid' CHECK (purpose IN ('free', 'paid')),
ADD COLUMN IF NOT EXISTS category text CHECK (category IN ('love', 'relationship', 'career', 'emotion')),
ADD COLUMN IF NOT EXISTS step text CHECK (step IN ('context', 'emotion', 'value', 'behavior', 'pattern', 'perception')),
ADD COLUMN IF NOT EXISTS text text,
ADD COLUMN IF NOT EXISTS question_type text NOT NULL DEFAULT 'single',
ADD COLUMN IF NOT EXISTS relationship_group text CHECK (relationship_group IN ('연인', '배우자', '친구', '가족', '동료', '경쟁자', '기타')),
ADD COLUMN IF NOT EXISTS relationship_type text,
ADD COLUMN IF NOT EXISTS version text NOT NULL DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS is_active bool NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sort_order int;

ALTER TABLE public.questions
DROP CONSTRAINT IF EXISTS check_purpose_questions;

ALTER TABLE public.questions
ADD CONSTRAINT check_purpose_questions CHECK (
  (purpose = 'paid' AND title IS NOT NULL AND description IS NOT NULL AND step IS NULL AND text IS NULL) OR
  (purpose = 'free' AND step IS NOT NULL AND text IS NOT NULL AND title IS NULL AND description IS NULL)
);

CREATE INDEX IF NOT EXISTS questions_purpose_idx ON public.questions(purpose);
CREATE INDEX IF NOT EXISTS questions_step_set_idx ON public.questions(question_set_id, step) WHERE purpose = 'free';
CREATE INDEX IF NOT EXISTS questions_is_active_idx ON public.questions(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS questions_relationship_group_idx ON public.questions(relationship_group) WHERE purpose = 'free' AND relationship_group IS NOT NULL;

-- ============================================================================
-- 3. question_options 테이블 신규 생성
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.question_options (
  id uuid NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  text text NOT NULL,
  display_order int NOT NULL CHECK (display_order >= 1 AND display_order <= 4),
  weights jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active bool NOT NULL DEFAULT TRUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS question_options_question_id_idx ON public.question_options(question_id);
CREATE INDEX IF NOT EXISTS question_options_is_active_idx ON public.question_options(is_active);

-- ============================================================================
-- 4. 기존 데이터 마이그레이션
-- ============================================================================
UPDATE public.question_sets SET purpose = 'paid' WHERE purpose IS NULL;
UPDATE public.questions SET purpose = 'paid' WHERE purpose IS NULL;

-- ============================================================================
-- 5. 초기 free 질문 세트 생성 (4개 카테고리)
-- ============================================================================
INSERT INTO public.question_sets (purpose, category, version, is_active, sort_order, created_at, updated_at)
VALUES
  ('free', 'love', '1.0', TRUE, 1, now(), now()),
  ('free', 'emotion', '1.0', TRUE, 2, now(), now()),
  ('free', 'relationship', '1.0', TRUE, 3, now(), now()),
  ('free', 'career', '1.0', TRUE, 4, now(), now())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. Love 카테고리 질문 및 선택지
-- ============================================================================
WITH love_set AS (
  SELECT id FROM public.question_sets WHERE purpose = 'free' AND category = 'love' LIMIT 1
),
questions_to_insert AS (
  INSERT INTO public.questions (
    question_set_id, purpose, category, step, text, question_type, is_active, sort_order, created_at
  )
  SELECT
    love_set.id, 'free', 'love',
    step, text, 'single', TRUE, sort_order, now()
  FROM love_set, (VALUES
    ('context', '지금 너의 연애 상황은 어떻게 돼 있어?', 1),
    ('emotion', '연애할 때 너는 감정적으로 어떤 패턴이야?', 2),
    ('value', '연애에서 너한테 가장 중요한 게 뭐야?', 3),
    ('behavior', '관계에서 확신이 안 설 때 너는 보통 뭐 해?', 4),
    ('pattern', '너의 연애에서 자꾸 반복되는 게 있어?', 5),
    ('perception', '연애가 뭐라고 생각해?', 6)
  ) AS q(step, text, sort_order)
  RETURNING id, step
)
INSERT INTO public.question_options (question_id, text, display_order, weights, is_active, created_at, updated_at)
SELECT q.id, opt.text, opt.display_order, opt.weights, TRUE, now(), now()
FROM questions_to_insert q
JOIN (VALUES
  ('context', '지금 누군가랑 만나고 있어', 1, '{"인지형": 5, "감정형": 5}'::jsonb),
  ('context', '요즘 자꾸 생각나는 사람이 있어', 2, '{"인지형": 3, "감정형": 8}'::jsonb),
  ('context', '연애는 피하고 싶어', 3, '{"회피형": 8, "불안형": 5}'::jsonb),
  ('context', '혼자가 제일 편해', 4, '{"안정형": 7, "자기중심형": 6}'::jsonb),
  ('emotion', '떨리고 설레는데 불안해', 1, '{"감정형": 9, "불안형": 6}'::jsonb),
  ('emotion', '마음이 차분하고 편해', 2, '{"안정형": 8, "감정형": 2}'::jsonb),
  ('emotion', '자꾸 연락하고 싶고 불안해', 3, '{"불안형": 9, "감정형": 7}'::jsonb),
  ('emotion', '감정을 숨기고 관찰해', 4, '{"인지형": 8, "감정형": 2}'::jsonb),
  ('value', '상대를 얼마나 좋아하는지가 다야', 1, '{"감정형": 8, "감정형": 7}'::jsonb),
  ('value', '서로 독립적으로 살면서 만나고 싶어', 2, '{"인지형": 7, "안정형": 6}'::jsonb),
  ('value', '안정감과 신뢰가 있는지가 중요해', 3, '{"안정형": 8, "감정형": 6}'::jsonb),
  ('value', '미래 계획과 현실적 조건을 먼저 봐', 4, '{"인지형": 9, "감정형": 2}'::jsonb),
  ('behavior', '먼저 마음을 드러낸다', 1, '{"감정형": 7, "직면형": 7}'::jsonb),
  ('behavior', '상대 반응을 먼저 본다', 2, '{"인지형": 7, "회피형": 4}'::jsonb),
  ('behavior', '불안해서 더 집착하고 애써', 3, '{"불안형": 8, "감정형": 6}'::jsonb),
  ('behavior', '거리 두고 냉정해진다', 4, '{"회피형": 8, "자기중심형": 5}'::jsonb),
  ('pattern', '나는 항상 먼저 좋아하는 쪽이야', 1, '{"감정형": 7, "불안형": 6}'::jsonb),
  ('pattern', '가까워질수록 불안해져', 2, '{"불안형": 8, "감정형": 5}'::jsonb),
  ('pattern', '같은 유형의 사람을 자꾸만 만나', 3, '{"인지형": 3, "감정형": 8}'::jsonb),
  ('pattern', '항상 같은 이유로 헤어진다', 4, '{"회피형": 6, "자기중심형": 5}'::jsonb),
  ('perception', '연애는 그냥 감정이 가는 대로', 1, '{"감정형": 8, "불안형": 6}'::jsonb),
  ('perception', '연애도 현실적으로 봐야 한다', 2, '{"인지형": 8, "감정형": 2}'::jsonb),
  ('perception', '상대를 완전히 이해할 때까지 조심해', 3, '{"불안형": 7, "인지형": 6}'::jsonb),
  ('perception', '연애는 나를 성장시켜야 한다', 4, '{"직면형": 7, "해결형": 7}'::jsonb)
) AS opt(step, text, display_order, weights) ON opt.step = q.step
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. Emotion 카테고리 질문 및 선택지
-- ============================================================================
WITH emotion_set AS (
  SELECT id FROM public.question_sets WHERE purpose = 'free' AND category = 'emotion' LIMIT 1
),
questions_to_insert AS (
  INSERT INTO public.questions (
    question_set_id, purpose, category, step, text, question_type, is_active, sort_order, created_at
  )
  SELECT
    emotion_set.id, 'free', 'emotion',
    step, text, 'single', TRUE, sort_order, now()
  FROM emotion_set, (VALUES
    ('context', '최근 너의 기분 상태는 어떤 편이야?', 1),
    ('emotion', '감정이 생길 때 너의 몸이나 마음은 어떻게 반응해?', 2),
    ('value', '감정 문제에서 너한테 가장 중요한 게 뭐야?', 3),
    ('behavior', '감정이 요동칠 때 너는 보통 뭐 하니?', 4),
    ('pattern', '같은 감정이 자꾸 반복돼?', 5),
    ('perception', '감정을 어떻게 이해하고 받아들여?', 6)
  ) AS q(step, text, sort_order)
  RETURNING id, step
)
INSERT INTO public.question_options (question_id, text, display_order, weights, is_active, created_at, updated_at)
SELECT q.id, opt.text, opt.display_order, opt.weights, TRUE, now(), now()
FROM questions_to_insert q
JOIN (VALUES
  ('context', '마음이 차분하고 편해', 1, '{"안정형": 8, "감정형": 3}'::jsonb),
  ('context', '답답하고 불안해서 계속 그래', 2, '{"불안형": 8, "감정형": 7}'::jsonb),
  ('context', '답답한데 말을 못 해', 3, '{"회피형": 7, "감정형": 4}'::jsonb),
  ('context', '감정이 막 자주 요동쳐', 4, '{"감정형": 9, "불안형": 6}'::jsonb),
  ('emotion', '감정을 관찰하면서 분석해', 1, '{"인지형": 8, "감정형": 2}'::jsonb),
  ('emotion', '감정이 오면 그냥 휩쓸려', 2, '{"감정형": 9, "불안형": 6}'::jsonb),
  ('emotion', '감정이 없거나 무뎌져 있어', 3, '{"회피형": 7, "감정형": 2}'::jsonb),
  ('emotion', '감정을 억누르고 못 표현해', 4, '{"회피형": 6, "불안형": 5}'::jsonb),
  ('value', '감정을 솔직하게 내놓는 게 중요해', 1, '{"감정형": 8, "직면형": 7}'::jsonb),
  ('value', '감정을 논리적으로 이해하는 게 중요해', 2, '{"인지형": 8, "감정형": 2}'::jsonb),
  ('value', '감정을 잘 처리하고 회복하는 게 중요해', 3, '{"해결형": 8, "감정형": 5}'::jsonb),
  ('value', '감정보다는 상황을 객관적으로 봐야 해', 4, '{"인지형": 8, "감정형": 1}'::jsonb),
  ('behavior', '주변 사람들에게 얘기한다', 1, '{"감정형": 7, "타인중심형": 7}'::jsonb),
  ('behavior', '혼자 정리하고 처리한다', 2, '{"인지형": 7, "자기중심형": 6}'::jsonb),
  ('behavior', '운동이나 활동으로 기분 전환한다', 3, '{"직면형": 6, "해결형": 7}'::jsonb),
  ('behavior', '혼자 있으면서 시간을 갖고 싶어', 4, '{"회피형": 6, "자기중심형": 7}'::jsonb),
  ('pattern', '특정 상황에서 같은 감정이 자꾸 반복돼', 1, '{"감정형": 7, "불안형": 6}'::jsonb),
  ('pattern', '감정이 오면 같은 방식으로만 대처해', 2, '{"인지형": 4, "회피형": 6}'::jsonb),
  ('pattern', '자책하고 후회하는 게 반복되', 3, '{"불안형": 8, "감정형": 7}'::jsonb),
  ('pattern', '자꾸 무감각해지는 패턴이 있어', 4, '{"회피형": 8, "감정형": 2}'::jsonb),
  ('perception', '감정은 약함이라고 생각해', 1, '{"불안형": 7, "감정형": 4}'::jsonb),
  ('perception', '감정은 내가 살아가는 신호라고 봐', 2, '{"감정형": 8, "해결형": 6}'::jsonb),
  ('perception', '감정 통제가 성숙함이라고 생각해', 3, '{"인지형": 8, "감정형": 2}'::jsonb),
  ('perception', '감정은 복잡하지만 내 일부라고 봐', 4, '{"감정형": 6, "안정형": 7}'::jsonb)
) AS opt(step, text, display_order, weights) ON opt.step = q.step
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. Relationship 카테고리 질문 및 선택지
-- ============================================================================
WITH relationship_set AS (
  SELECT id FROM public.question_sets WHERE purpose = 'free' AND category = 'relationship' LIMIT 1
),
questions_to_insert AS (
  INSERT INTO public.questions (
    question_set_id, purpose, category, step, text, question_type, is_active, sort_order, created_at
  )
  SELECT
    relationship_set.id, 'free', 'relationship',
    step, text, 'single', TRUE, sort_order, now()
  FROM relationship_set, (VALUES
    ('context', '너의 인간관계에서 제일 큰 고민이 뭐야?', 1),
    ('emotion', '관계를 맺을 때 너는 주로 어떤 감정을 느껴?', 2),
    ('value', '관계에서 너한테 가장 중요한 게 뭐야?', 3),
    ('behavior', '관계에서 갈등이 생기면 너는 어떻게 해?', 4),
    ('pattern', '너의 관계에서 자꾸 반복되는 패턴이 있어?', 5),
    ('perception', '관계가 뭐라고 생각해?', 6)
  ) AS q(step, text, sort_order)
  RETURNING id, step
)
INSERT INTO public.question_options (question_id, text, display_order, weights, is_active, created_at, updated_at)
SELECT q.id, opt.text, opt.display_order, opt.weights, TRUE, now(), now()
FROM questions_to_insert q
JOIN (VALUES
  ('context', '누군가와의 관계가 어색해', 1, '{"불안형": 6, "감정형": 5}'::jsonb),
  ('context', '혼자라는 생각이 자꾸 들어', 2, '{"불안형": 7, "회피형": 4}'::jsonb),
  ('context', '상대 행동이 이해 안 돼', 3, '{"인지형": 4, "직면형": 6}'::jsonb),
  ('context', '관계가 부담스럽고 힘들어', 4, '{"회피형": 8, "자기중심형": 5}'::jsonb),
  ('emotion', '편하고 안정감을 느껴', 1, '{"안정형": 8, "감정형": 4}'::jsonb),
  ('emotion', '불안해하고 상대를 의식해', 2, '{"불안형": 8, "감정형": 6}'::jsonb),
  ('emotion', '상대를 판단하고 이해하려고 애써', 3, '{"인지형": 7, "감정형": 3}'::jsonb),
  ('emotion', '감정적으로 거리를 두고 있어', 4, '{"회피형": 7, "감정형": 2}'::jsonb),
  ('value', '신뢰와 공감이 제일 중요해', 1, '{"감정형": 8, "타인중심형": 7}'::jsonb),
  ('value', '서로 존중하고 독립적인 게 중요해', 2, '{"인지형": 7, "자기중심형": 6}'::jsonb),
  ('value', '편하고 자연스러운 관계가 최고야', 3, '{"안정형": 8, "감정형": 5}'::jsonb),
  ('value', '서로 성장할 수 있는 관계가 좋아', 4, '{"직면형": 7, "해결형": 7}'::jsonb),
  ('behavior', '솔직하게 얘기하고 풀어낸다', 1, '{"감정형": 7, "직면형": 8}'::jsonb),
  ('behavior', '상대를 이해하려고 애써', 2, '{"인지형": 7, "타인중심형": 7}'::jsonb),
  ('behavior', '갈등을 피하고 시간을 기다려', 3, '{"회피형": 8, "불안형": 5}'::jsonb),
  ('behavior', '거리를 두고 관계를 정리한다', 4, '{"회피형": 7, "자기중심형": 7}'::jsonb),
  ('pattern', '같은 유형의 사람과 같은 갈등을 반복해', 1, '{"감정형": 6, "불안형": 6}'::jsonb),
  ('pattern', '항상 내가 맞춰주는 입장이 돼', 2, '{"타인중심형": 8, "불안형": 6}'::jsonb),
  ('pattern', '시간이 지나면 자꾸 거리감이 생겨', 3, '{"불안형": 7, "회피형": 6}'::jsonb),
  ('pattern', '깊게 연결되지 못하고 표면적으로만 만나', 4, '{"회피형": 8, "자기중심형": 5}'::jsonb),
  ('perception', '관계는 서로 영향을 주고받는 거야', 1, '{"감정형": 7, "타인중심형": 8}'::jsonb),
  ('perception', '관계 유지엔 끊임없는 노력이 필요해', 2, '{"인지형": 7, "불안형": 5}'::jsonb),
  ('perception', '개인의 경계를 지키는 게 제일 중요해', 3, '{"자기중심형": 8, "인지형": 6}'::jsonb),
  ('perception', '관계는 자연스럽게 흘러가야 한다', 4, '{"안정형": 7, "감정형": 5}'::jsonb)
) AS opt(step, text, display_order, weights) ON opt.step = q.step
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 9. Career 카테고리 질문 및 선택지
-- ============================================================================
WITH career_set AS (
  SELECT id FROM public.question_sets WHERE purpose = 'free' AND category = 'career' LIMIT 1
),
questions_to_insert AS (
  INSERT INTO public.questions (
    question_set_id, purpose, category, step, text, question_type, is_active, sort_order, created_at
  )
  SELECT
    career_set.id, 'free', 'career',
    step, text, 'single', TRUE, sort_order, now()
  FROM career_set, (VALUES
    ('context', '지금 너의 일이나 진로 상황이 어떻게 돼?', 1),
    ('emotion', '일할 때 너는 어떤 기분이 들어?', 2),
    ('value', '일을 선택할 때 너한테 가장 중요한 게 뭐야?', 3),
    ('behavior', '일에서 어려움이 생기면 너는 어떻게 해?', 4),
    ('pattern', '너의 일이나 커리어에서 자꾸 반복되는 게 있어?', 5),
    ('perception', '일이 뭐라고 생각해?', 6)
  ) AS q(step, text, sort_order)
  RETURNING id, step
)
INSERT INTO public.question_options (question_id, text, display_order, weights, is_active, created_at, updated_at)
SELECT q.id, opt.text, opt.display_order, opt.weights, TRUE, now(), now()
FROM questions_to_insert q
JOIN (VALUES
  ('context', '지금 일에 만족해', 1, '{"안정형": 7, "감정형": 4}'::jsonb),
  ('context', '다른 일을 해보고 싶어', 2, '{"감정형": 6, "직면형": 5}'::jsonb),
  ('context', '커리어를 바꿀까 고민 중이야', 3, '{"불안형": 7, "감정형": 6}'::jsonb),
  ('context', '지금 일이 나한테 맞나 모르겠어', 4, '{"불안형": 6, "회피형": 5}'::jsonb),
  ('emotion', '일에 몰입하고 즐겨', 1, '{"감정형": 8, "해결형": 7}'::jsonb),
  ('emotion', '편하고 꾸준하게 한다', 2, '{"안정형": 8, "감정형": 2}'::jsonb),
  ('emotion', '스트레스 많고 피곤해', 3, '{"불안형": 7, "감정형": 6}'::jsonb),
  ('emotion', '의무감으로 하는 일 같아', 4, '{"회피형": 6, "불안형": 5}'::jsonb),
  ('value', '내가 좋아하는 일을 하고 싶어', 1, '{"감정형": 8, "직면형": 7}'::jsonb),
  ('value', '안정적인 수입과 환경이 제일 중요해', 2, '{"안정형": 8, "인지형": 6}'::jsonb),
  ('value', '의미 있는 일을 하고 싶어', 3, '{"타인중심형": 8, "직면형": 6}'::jsonb),
  ('value', '성장과 성공이 제일 중요해', 4, '{"인지형": 7, "직면형": 8}'::jsonb),
  ('behavior', '문제를 맞닥뜨리고 해결한다', 1, '{"직면형": 8, "인지형": 7}'::jsonb),
  ('behavior', '상황을 분석하고 신중하게 접근해', 2, '{"인지형": 8, "안정형": 6}'::jsonb),
  ('behavior', '힘들면 피하고 싶어', 3, '{"회피형": 7, "불안형": 6}'::jsonb),
  ('behavior', '주변 조언을 듣고 따라간다', 4, '{"타인중심형": 7, "불안형": 6}'::jsonb),
  ('pattern', '같은 이유로 자꾸 일을 바꿔', 1, '{"감정형": 6, "회피형": 6}'::jsonb),
  ('pattern', '성장하지만 만족감은 없어', 2, '{"인지형": 7, "감정형": 2}'::jsonb),
  ('pattern', '시간이 지나면 열정이 식어', 3, '{"불안형": 6, "회피형": 5}'::jsonb),
  ('pattern', '항상 더 나은 기회를 찾고 있어', 4, '{"불안형": 7, "감정형": 5}'::jsonb),
  ('perception', '일은 내 정체성이라고 생각해', 1, '{"감정형": 7, "직면형": 8}'::jsonb),
  ('perception', '일은 생계 수단이라고 봐', 2, '{"인지형": 8, "감정형": 2}'::jsonb),
  ('perception', '일은 관계와 영향력을 만드는 거야', 3, '{"타인중심형": 8, "감정형": 5}'::jsonb),
  ('perception', '일은 배우고 성장하는 과정이라고 봐', 4, '{"직면형": 8, "해결형": 7}'::jsonb)
) AS opt(step, text, display_order, weights) ON opt.step = q.step
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 10. RLS 정책 업데이트
-- ============================================================================
DROP POLICY IF EXISTS "Free questions accessible to all" ON public.question_sets;
CREATE POLICY "Free questions accessible to all" ON public.question_sets
  FOR SELECT USING (purpose = 'free' OR session_id IN (SELECT id FROM public.analysis_sessions WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Free questions accessible to all" ON public.questions;
CREATE POLICY "Free questions accessible to all" ON public.questions
  FOR SELECT USING (
    purpose = 'free' OR
    session_id IN (SELECT id FROM public.analysis_sessions WHERE user_id = auth.uid())
  );

ALTER TABLE public.question_options DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 11. 마이그레이션 검증
-- ============================================================================
-- 실행 후 확인:
-- SELECT COUNT(*) FROM question_sets WHERE purpose = 'free'; -- 4개
-- SELECT COUNT(*) FROM questions WHERE purpose = 'free'; -- 24개
-- SELECT COUNT(*) FROM question_options; -- 96개
-- SELECT category, COUNT(*) FROM questions WHERE purpose = 'free' GROUP BY category;
