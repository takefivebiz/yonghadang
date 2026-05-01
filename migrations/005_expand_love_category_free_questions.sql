-- ============================================================================
-- Love 카테고리 무료 질문 확장 (최종본)
-- 구조: 4 situations × 6 stages × 2 variants = 48 questions
-- 각 질문마다 4개 선택지 + trait weights
-- ============================================================================

BEGIN;

-- ============================================
-- Pre-Step: 기존 unique constraint 제거 및 새 인덱스 생성
-- ============================================
-- 기존 unique constraint 제거 (unique_free_questions_per_category_step_version)
ALTER TABLE public.questions
DROP CONSTRAINT IF EXISTS unique_free_questions_per_category_step_version;

-- 새로운 unique index 생성 (Love 카테고리용)
-- 기준: purpose, category, relationship_type, step, sort_order, version
CREATE UNIQUE INDEX IF NOT EXISTS unique_free_questions_per_love_type_step_sort
ON public.questions (purpose, category, relationship_type, step, sort_order, version)
WHERE purpose = 'free' AND category = 'love';

-- ============================================
-- Step 0: 기존 love/free 데이터 정리
-- ============================================
DELETE FROM public.question_options
WHERE question_id IN (
  SELECT q.id FROM public.questions q
  INNER JOIN public.question_sets qs ON q.question_set_id = qs.id
  WHERE qs.category = 'love' AND qs.purpose = 'free'
);

DELETE FROM public.questions
WHERE question_set_id IN (
  SELECT id FROM public.question_sets
  WHERE category = 'love' AND purpose = 'free'
);

DELETE FROM public.question_sets
WHERE category = 'love' AND purpose = 'free';

-- ============================================
-- Step 1-3: Question Sets, Questions, Options
-- ============================================
WITH new_sets AS (
  -- Question Sets: 썸, 연애 중, 이별, 재회
  INSERT INTO public.question_sets (purpose, category, relationship_type)
  VALUES
    ('free', 'love', '썸'),
    ('free', 'love', '연애 중'),
    ('free', 'love', '이별'),
    ('free', 'love', '재회')
  RETURNING id, relationship_type
),

questions_to_insert AS (
  -- Questions 데이터: relationship_type 정보 보존
  SELECT ns.id as set_id, qd.* FROM (
    VALUES
      -- 썸
      ('썸', 'context', 1, '이 사람을 어떻게 만났어?'),
      ('썸', 'context', 2, '지금까지 둘이 가장 오래 함께 있었던 건 언제였어?'),
      ('썸', 'emotion', 1, '이 사람이 연락할 때 넌 어떤 기분이야?'),
      ('썸', 'emotion', 2, '이 사람과의 대화 중에 문득 "아, 나 지금 설레는구나"라고 느낀 적이 있어?'),
      ('썸', 'value', 1, '넌 이 사람에게 뭘 기대하고 있어?'),
      ('썸', 'value', 2, '이 사람이 너한테 특별해 보이는 이유가 뭐야?'),
      ('썸', 'behavior', 1, '넌 이 사람에게 먼저 연락하는 편이야?'),
      ('썸', 'behavior', 2, '이 사람과 있을 때 넌 뭘 주로 해?'),
      ('썸', 'pattern', 1, '지난 일주일동안 이 사람 생각을 얼마나 자주 했어?'),
      ('썸', 'pattern', 2, '이 사람이 다른 누군가와 친한 걸 알면?'),
      ('썸', 'perception', 1, '이 사람과의 관계가 앞으로 어떻게 될 것 같아?'),
      ('썸', 'perception', 2, '만약 이 사람이 너한테 명확하게 마음을 드러낸다면 넌?'),
      -- 연애 중
      ('연애 중', 'context', 1, '너희 사귀기 시작한 지 얼마나 됐어?'),
      ('연애 중', 'context', 2, '요즘 상대를 만나는 주된 이유가 뭐야?'),
      ('연애 중', 'emotion', 1, '요즘 상대와 함께 있을 때 주로 느끼는 감정이 뭐야?'),
      ('연애 중', 'emotion', 2, '상대를 향한 감정에 변화가 생겼어?'),
      ('연애 중', 'value', 1, '이 사람과의 미래를 생각해본 적 있어?'),
      ('연애 중', 'value', 2, '이 사람과의 관계에서 가장 놓치고 싶지 않은 게 뭐야?'),
      ('연애 중', 'behavior', 1, '싸우거나 의견이 맞지 않을 때 주로 뭘 해?'),
      ('연애 중', 'behavior', 2, '상대한테 솔직한 감정을 자주 드러내?'),
      ('연애 중', 'pattern', 1, '최근 싸우는 패턴을 보면?'),
      ('연애 중', 'pattern', 2, '관계에서 반복되는 패턴이 있다면?'),
      ('연애 중', 'perception', 1, '지금 이 관계를 계속하고 싶어?'),
      ('연애 중', 'perception', 2, '이 사람과의 관계가 너를 어떻게 변화시켰어?'),
      -- 이별
      ('이별', 'context', 1, '헤어진 지 얼마나 됐어?'),
      ('이별', 'context', 2, '헤어짐을 주도한 쪽이 누구야?'),
      ('이별', 'emotion', 1, '요즘 그 사람 생각이 날 때 주로 드는 감정은?'),
      ('이별', 'emotion', 2, '일상 속에서 갑자기 그 사람이 생각날 때가 있어?'),
      ('이별', 'value', 1, '과거의 헤어짐이 정말 필요했다고 생각해?'),
      ('이별', 'value', 2, '이 이별이 너한테 뭘 깨달아줬어?'),
      ('이별', 'behavior', 1, '혼자만의 시간을 어떻게 보내고 있어?'),
      ('이별', 'behavior', 2, '상대와 관련된 것들(사진, 선물, 연락처 등)을 어떻게 했어?'),
      ('이별', 'pattern', 1, '이별 후 반복되는 패턴이 있다면?'),
      ('이별', 'pattern', 2, '주변의 행복해 보이는 커플을 보면?'),
      ('이별', 'perception', 1, '이번 이별이 너에게 남긴 게 뭐라고 생각해?'),
      ('이별', 'perception', 2, '지금 상태를 한 마디로 표현한다면?'),
      -- 재회
      ('재회', 'context', 1, '헤어진 후 다시 연락이 온 계기가 뭐였어?'),
      ('재회', 'context', 2, '상대가 다시 연락해왔을 때 넌?'),
      ('재회', 'emotion', 1, '상대를 다시 만났을 때 드는 첫 감정은?'),
      ('재회', 'emotion', 2, '상대와의 대화 속에서 지금 주로 느끼는 건?'),
      ('재회', 'value', 1, '과거의 헤어짐이 정말 필요했다고 생각해?'),
      ('재회', 'value', 2, '재회한다면 뭐가 진짜 달라질 것 같아?'),
      ('재회', 'behavior', 1, '상대에게 넌 어떤 신호를 보내고 있어?'),
      ('재회', 'behavior', 2, '재회를 위해 넌 뭔가 변화를 시도했어?'),
      ('재회', 'pattern', 1, '이 사람과 다시 만나면서 이런 생각 들어본 적 있어?'),
      ('재회', 'pattern', 2, '지금 이 사람이랑 다시 지내보니까 어때?'),
      ('재회', 'perception', 1, '재회가 맞는 선택이라고 생각해?'),
      ('재회', 'perception', 2, '지금 이 상황을 한마디로 말하면 어떤 느낌이야?')
  ) AS qd(rel_type, step, sort_order, text)
  INNER JOIN new_sets ns ON ns.relationship_type = qd.rel_type
),

new_questions AS (
  -- Questions INSERT: 각 질문 저장
  INSERT INTO public.questions (question_set_id, purpose, category, step, text, question_type, sort_order)
  SELECT set_id, 'free', 'love', step, text, 'single', sort_order FROM questions_to_insert
  RETURNING id, question_set_id, step, sort_order
),

new_questions_with_rel_type AS (
  -- relationship_type 추가 (new_sets과 JOIN으로 매핑)
  SELECT
    nq.id,
    ns.relationship_type,
    nq.step,
    nq.sort_order
  FROM new_questions nq
  INNER JOIN new_sets ns ON ns.id = nq.question_set_id
),

options_to_insert AS (
  -- Question Options 데이터
  SELECT nqr.id as q_id, od.display_order, od.text, od.weights
  FROM (
    VALUES
      -- 썸 - Context Variant 1
      ('썸', 'context', 1, 1, '학교/직장', '{"안정형": 10, "인지형": 10}'),
      ('썸', 'context', 1, 2, '친구 소개', '{"타인중심형": 10, "안정형": 10}'),
      ('썸', 'context', 1, 3, '앱 or SNS', '{"자기중심형": 10, "인지형": 10}'),
      ('썸', 'context', 1, 4, '우연히', '{"감정형": 10, "불안형": 10}'),

      -- 썸 - Context Variant 2
      ('썸', 'context', 2, 1, '하루 종일 함께 있었어', '{"직면형": 10, "감정형": 10}'),
      ('썸', 'context', 2, 2, '몇 시간 정도 있었어', '{"안정형": 10, "인지형": 10}'),
      ('썸', 'context', 2, 3, '한 시간 정도였어', '{"회피형": 10, "불안형": 10}'),
      ('썸', 'context', 2, 4, '거의 못 봤어', '{"회피형": 10, "자기중심형": 10}'),

      -- 썸 - Emotion Variant 1
      ('썸', 'emotion', 1, 1, '설레고 좋아', '{"감정형": 10, "불안형": 10}'),
      ('썸', 'emotion', 1, 2, '반갑긴 한데 부담스럽기도 해', '{"회피형": 10, "불안형": 10}'),
      ('썸', 'emotion', 1, 3, '그냥 편해', '{"안정형": 10, "인지형": 10}'),
      ('썸', 'emotion', 1, 4, '뭔가 어색하거나 불편해', '{"회피형": 10, "불안형": 10}'),

      -- 썸 - Emotion Variant 2
      ('썸', 'emotion', 2, 1, '자주 느껴', '{"감정형": 10, "불안형": 10}'),
      ('썸', 'emotion', 2, 2, '가끔은 그래', '{"감정형": 10, "안정형": 10}'),
      ('썸', 'emotion', 2, 3, '거의 없어', '{"인지형": 10, "안정형": 10}'),
      ('썸', 'emotion', 2, 4, '그런 느낌을 잘 몰라', '{"인지형": 10, "회피형": 10}'),

      -- 썸 - Value Variant 1
      ('썸', 'value', 1, 1, '사귀는 것까지 생각해', '{"직면형": 10, "자기중심형": 10}'),
      ('썸', 'value', 1, 2, '일단 친해지고 싶고 자연스럽게 흘러가길 바라', '{"안정형": 10, "타인중심형": 10}'),
      ('썸', 'value', 1, 3, '좋은 친구 정도가 되길 원해', '{"안정형": 10, "인지형": 10}'),
      ('썸', 'value', 1, 4, '사실 뭘 원하는지 아직 모르겠어', '{"회피형": 10, "불안형": 10}'),

      -- 썸 - Value Variant 2
      ('썸', 'value', 2, 1, '외모나 분위기가 끌려', '{"감정형": 10, "자기중심형": 10}'),
      ('썸', 'value', 2, 2, '말하는 방식이나 생각이 끌려', '{"인지형": 10, "감정형": 10}'),
      ('썸', 'value', 2, 3, '아직 잘 모르는데 이유 없이 끌려', '{"감정형": 10, "불안형": 10}'),
      ('썸', 'value', 2, 4, '누군가랑 가까워지고 싶은 마음이 커서일 수도 있어', '{"타인중심형": 10, "회피형": 10}'),

      -- 썸 - Behavior Variant 1
      ('썸', 'behavior', 1, 1, '자주 먼저 연락해', '{"직면형": 10, "자기중심형": 10}'),
      ('썸', 'behavior', 1, 2, '가끔 먼저 연락해', '{"안정형": 10, "감정형": 10}'),
      ('썸', 'behavior', 1, 3, '거의 상대가 먼저 연락해', '{"회피형": 10, "타인중심형": 10}'),
      ('썸', 'behavior', 1, 4, '먼저 연락하는 편은 아닌 것 같아', '{"회피형": 10, "불안형": 10}'),

      -- 썸 - Behavior Variant 2
      ('썸', 'behavior', 2, 1, '계획적으로 뭔가를 함께 하려고 해', '{"인지형": 10, "직면형": 10}'),
      ('썸', 'behavior', 2, 2, '그냥 옆에 있고 싶어서 함께 있어', '{"감정형": 10, "타인중심형": 10}'),
      ('썸', 'behavior', 2, 3, '상대가 뭔가 하자고 해서 따라가', '{"회피형": 10, "타인중심형": 10}'),
      ('썸', 'behavior', 2, 4, '거의 메시지나 전화로만 연락해', '{"회피형": 10, "인지형": 10}'),

      -- 썸 - Pattern Variant 1
      ('썸', 'pattern', 1, 1, '거의 계속 생각나', '{"감정형": 10, "불안형": 10}'),
      ('썸', 'pattern', 1, 2, '하루에도 여러 번 생각나', '{"감정형": 10, "불안형": 10}'),
      ('썸', 'pattern', 1, 3, '가끔 생각나', '{"안정형": 10, "인지형": 10}'),
      ('썸', 'pattern', 1, 4, '거의 생각 안 나', '{"안정형": 10, "자기중심형": 10}'),

      -- 썸 - Pattern Variant 2
      ('썸', 'pattern', 2, 1, '질투나고 신경 쓰여', '{"불안형": 10, "자기중심형": 10}'),
      ('썸', 'pattern', 2, 2, '좀 아쉽긴 한데 당연하다고 생각해', '{"안정형": 10, "인지형": 10}'),
      ('썸', 'pattern', 2, 3, '그냥 별생각 없어', '{"안정형": 10, "자기중심형": 10}'),
      ('썸', 'pattern', 2, 4, '그 사람의 인간관계까지 궁금해져', '{"감정형": 10, "타인중심형": 10}'),

      -- 썸 - Perception Variant 1
      ('썸', 'perception', 1, 1, '자연스럽게 사귀게 될 것 같아', '{"직면형": 10, "감정형": 10}'),
      ('썸', 'perception', 1, 2, '뭐가 될지 모르겠지만 좋은 쪽으로 풀리면 좋겠어', '{"안정형": 10, "감정형": 10}'),
      ('썸', 'perception', 1, 3, '사실 친구로 끝날 가능성이 높을 것 같아', '{"인지형": 10, "회피형": 10}'),
      ('썸', 'perception', 1, 4, '잘 모르겠어', '{"불안형": 10, "회피형": 10}'),

      -- 썸 - Perception Variant 2
      ('썸', 'perception', 2, 1, '당연히 받아줄 생각이야', '{"직면형": 10, "감정형": 10}'),
      ('썸', 'perception', 2, 2, '한번 시작해보고 싶어', '{"직면형": 10, "자기중심형": 10}'),
      ('썸', 'perception', 2, 3, '아직 더 알아야 할 것 같아', '{"인지형": 10, "불안형": 10}'),
      ('썸', 'perception', 2, 4, '거절할 가능성이 커', '{"회피형": 10, "불안형": 10}'),

      -- 연애 중 - Context Variant 1
      ('연애 중', 'context', 1, 1, '3개월 미만', '{"감정형": 10, "불안형": 10}'),
      ('연애 중', 'context', 1, 2, '3개월 ~ 1년 정도', '{"안정형": 10, "감정형": 10}'),
      ('연애 중', 'context', 1, 3, '1년 ~ 2년 정도', '{"안정형": 10, "인지형": 10}'),
      ('연애 중', 'context', 1, 4, '2년 이상', '{"안정형": 10, "타인중심형": 10}'),

      -- 연애 중 - Context Variant 2
      ('연애 중', 'context', 2, 1, '이 사람과 있고 싶어서', '{"직면형": 10, "감정형": 10}'),
      ('연애 중', 'context', 2, 2, '편하고 좋으니까', '{"안정형": 10, "감정형": 10}'),
      ('연애 중', 'context', 2, 3, '관계를 유지해야 하니까', '{"인지형": 10, "타인중심형": 10}'),
      ('연애 중', 'context', 2, 4, '습관처럼 자동으로 만나', '{"회피형": 10, "자기중심형": 10}'),

      -- 연애 중 - Emotion Variant 1
      ('연애 중', 'emotion', 1, 1, '편하고 행복해', '{"안정형": 10, "감정형": 10}'),
      ('연애 중', 'emotion', 1, 2, '설레고 좋지만 불안하기도 해', '{"감정형": 10, "불안형": 10}'),
      ('연애 중', 'emotion', 1, 3, '의무감이 좀 있어', '{"인지형": 10, "타인중심형": 10}'),
      ('연애 중', 'emotion', 1, 4, '뭔가 답답하거나 지쳐', '{"회피형": 10, "불안형": 10}'),

      -- 연애 중 - Emotion Variant 2
      ('연애 중', 'emotion', 2, 1, '처음처럼 설렘은 줄었지만 더 깊어진 것 같아', '{"안정형": 10, "감정형": 10}'),
      ('연애 중', 'emotion', 2, 2, '아직도 처음처럼 설레', '{"감정형": 10, "불안형": 10}'),
      ('연애 중', 'emotion', 2, 3, '좋은 마음도 있지만 가끔 싫어질 때도 있어', '{"불안형": 10, "인지형": 10}'),
      ('연애 중', 'emotion', 2, 4, '솔직히 감정이 식은 것 같은데 그걸 인정하고 싶지 않아', '{"회피형": 10, "불안형": 10}'),

      -- 연애 중 - Value Variant 1
      ('연애 중', 'value', 1, 1, '결혼까지 생각해', '{"직면형": 10, "감정형": 10}'),
      ('연애 중', 'value', 1, 2, '언젠가는 하고 싶지만 아직 멀게 느껴져', '{"안정형": 10, "불안형": 10}'),
      ('연애 중', 'value', 1, 3, '일단 지금만 잘 지나가면 된다고 생각해', '{"인지형": 10, "회피형": 10}'),
      ('연애 중', 'value', 1, 4, '사실 이 관계가 계속될지 확신이 없어', '{"불안형": 10, "회피형": 10}'),

      -- 연애 중 - Value Variant 2
      ('연애 중', 'value', 2, 1, '신뢰와 안정감', '{"안정형": 10, "타인중심형": 10}'),
      ('연애 중', 'value', 2, 2, '설렘과 새로움', '{"감정형": 10, "자기중심형": 10}'),
      ('연애 중', 'value', 2, 3, '있으면 편하고 없으면 외로운 느낌', '{"불안형": 10, "타인중심형": 10}'),
      ('연애 중', 'value', 2, 4, '사실 뭘 지키려는지도 모를 때가 있어', '{"회피형": 10, "불안형": 10}'),

      -- 연애 중 - Behavior Variant 1
      ('연애 중', 'behavior', 1, 1, '바로 얘기해서 풀려고 해', '{"직면형": 10, "감정형": 10}'),
      ('연애 중', 'behavior', 1, 2, '시간을 가진 후에 차분하게 얘기해', '{"인지형": 10, "안정형": 10}'),
      ('연애 중', 'behavior', 1, 3, '피하거나 미루는 편이야', '{"회피형": 10, "불안형": 10}'),
      ('연애 중', 'behavior', 1, 4, '크게 싸우는 경향이 있어', '{"직면형": 10, "불안형": 10}'),

      -- 연애 중 - Behavior Variant 2
      ('연애 중', 'behavior', 2, 1, '좋은 것도 힘든 것도 다 말해', '{"직면형": 10, "감정형": 10}'),
      ('연애 중', 'behavior', 2, 2, '대체로는 말하지만 감춰두는 게 있어', '{"인지형": 10, "타인중심형": 10}'),
      ('연애 중', 'behavior', 2, 3, '불편할 것 같아서 웬만해선 안 말해', '{"회피형": 10, "타인중심형": 10}'),
      ('연애 중', 'behavior', 2, 4, '뭘 감추고 뭘 말할지 헷갈려', '{"불안형": 10, "회피형": 10}'),

      -- 연애 중 - Pattern Variant 1
      ('연애 중', 'pattern', 1, 1, '거의 싸우지 않아', '{"안정형": 10, "감정형": 10}'),
      ('연애 중', 'pattern', 1, 2, '가끔 싸우지만 금방 풀려', '{"안정형": 10, "인지형": 10}'),
      ('연애 중', 'pattern', 1, 3, '같은 것을 반복해서 싸워', '{"불안형": 10, "회피형": 10}'),
      ('연애 중', 'pattern', 1, 4, '싸울 때마다 헤어짐까지 얘기해', '{"직면형": 10, "불안형": 10}'),

      -- 연애 중 - Pattern Variant 2
      ('연애 중', 'pattern', 2, 1, '내가 양보하고 상대는 당연하게 받아', '{"타인중심형": 10, "회피형": 10}'),
      ('연애 중', 'pattern', 2, 2, '상대가 챙기고 나는 받아주는 쪽이야', '{"타인중심형": 10, "안정형": 10}'),
      ('연애 중', 'pattern', 2, 3, '어느 쪽도 아니고 주고받으려고 해', '{"안정형": 10, "인지형": 10}'),
      ('연애 중', 'pattern', 2, 4, '매번 다르고 일정한 패턴이 없는 것 같아', '{"불안형": 10, "인지형": 10}'),

      -- 연애 중 - Perception Variant 1
      ('연애 중', 'perception', 1, 1, '당연히 계속하고 싶어', '{"직면형": 10, "감정형": 10}'),
      ('연애 중', 'perception', 1, 2, '지금은 그렇지만 앞이 불안해', '{"안정형": 10, "불안형": 10}'),
      ('연애 중', 'perception', 1, 3, '고민이 많아', '{"인지형": 10, "불안형": 10}'),
      ('연애 중', 'perception', 1, 4, '솔직히 끝내고 싶은 마음도 있어', '{"회피형": 10, "자기중심형": 10}'),

      -- 연애 중 - Perception Variant 2
      ('연애 중', 'perception', 2, 1, '더 나은 사람이 되려고 노력해', '{"인지형": 10, "타인중심형": 10}'),
      ('연애 중', 'perception', 2, 2, '덜 외로워지고 누군가에 의지하게 됐어', '{"안정형": 10, "타인중심형": 10}'),
      ('연애 중', 'perception', 2, 3, '내 자유가 줄어들었고 답답할 때가 많아', '{"회피형": 10, "불안형": 10}'),
      ('연애 중', 'perception', 2, 4, '변화는 딱히 없는데, 이게 맞는 건가 싶어', '{"인지형": 10, "불안형": 10}'),

      -- 이별 - Context Variant 1
      ('이별', 'context', 1, 1, '얼마 안 됐어 (1개월 미만)', '{"불안형": 10, "감정형": 10}'),
      ('이별', 'context', 1, 2, '2-3개월 정도 됐어', '{"불안형": 10, "인지형": 10}'),
      ('이별', 'context', 1, 3, '반년 정도 됐어', '{"안정형": 10, "감정형": 10}'),
      ('이별', 'context', 1, 4, '이미 꽤 시간이 흘렀어 (1년 이상)', '{"안정형": 10, "인지형": 10}'),

      -- 이별 - Context Variant 2
      ('이별', 'context', 2, 1, '상대가 헤어지자고 했어', '{"불안형": 10, "타인중심형": 10}'),
      ('이별', 'context', 2, 2, '내가 헤어지자고 했어', '{"직면형": 10, "자기중심형": 10}'),
      ('이별', 'context', 2, 3, '둘 다 합의해서 헤어졌어', '{"인지형": 10, "안정형": 10}'),
      ('이별', 'context', 2, 4, '상황이 애매하게 흘러서 헤어졌어', '{"회피형": 10, "불안형": 10}'),

      -- 이별 - Emotion Variant 1
      ('이별', 'emotion', 1, 1, '그리움과 후회', '{"감정형": 10, "불안형": 10}'),
      ('이별', 'emotion', 1, 2, '화와 배신감', '{"직면형": 10, "불안형": 10}'),
      ('이별', 'emotion', 1, 3, '냉정하게 객관적으로 봐', '{"인지형": 10, "안정형": 10}'),
      ('이별', 'emotion', 1, 4, '복잡하고 섞여 있어', '{"불안형": 10, "감정형": 10}'),

      -- 이별 - Emotion Variant 2
      ('이별', 'emotion', 2, 1, '자주 있어, 특히 밤에', '{"감정형": 10, "불안형": 10}'),
      ('이별', 'emotion', 2, 2, '가끔은 있지만 자주는 아니야', '{"안정형": 10, "감정형": 10}'),
      ('이별', 'emotion', 2, 3, '거의 안 나', '{"안정형": 10, "인지형": 10}'),
      ('이별', 'emotion', 2, 4, '자꾸만 떠오르는데, 떨쳐내려고 해', '{"회피형": 10, "불안형": 10}'),

      -- 이별 - Value Variant 1
      ('이별', 'value', 1, 1, '그 과정이 없었다면 지금이 없을 것 같아', '{"인지형": 10, "안정형": 10}'),
      ('이별', 'value', 1, 2, '아직도 왜 헤어져야 했는지 모르겠어', '{"불안형": 10, "회피형": 10}'),
      ('이별', 'value', 1, 3, '그건 필요했는데, 완전히 끝날 필요는 없었을 것 같아', '{"감정형": 10, "불안형": 10}'),
      ('이별', 'value', 1, 4, '헤어짐 없이 계속 함께였으면 좋았을 것 같아', '{"감정형": 10, "타인중심형": 10}'),

      -- 이별 - Value Variant 2
      ('이별', 'value', 2, 1, '어떤 관계든 당연한 건 없다는 것', '{"인지형": 10, "안정형": 10}'),
      ('이별', 'value', 2, 2, '내가 원하는 게 뭔지 더 잘 알게 됐어', '{"인지형": 10, "자기중심형": 10}'),
      ('이별', 'value', 2, 3, '아직 뭘 깨달았는지 모르겠어', '{"불안형": 10, "회피형": 10}'),
      ('이별', 'value', 2, 4, '관계에서 항상 누가 더 상처받는지만 생각하게 돼', '{"불안형": 10, "타인중심형": 10}'),

      -- 이별 - Behavior Variant 1
      ('이별', 'behavior', 1, 1, '열심히 일이나 공부에 집중해', '{"인지형": 10, "직면형": 10}'),
      ('이별', 'behavior', 1, 2, '친구들을 자주 만나', '{"타인중심형": 10, "감정형": 10}'),
      ('이별', 'behavior', 1, 3, '집에만 있으면서 혼자 생각해', '{"회피형": 10, "감정형": 10}'),
      ('이별', 'behavior', 1, 4, '새로운 취미를 찾으려고 해', '{"인지형": 10, "자기중심형": 10}'),

      -- 이별 - Behavior Variant 2
      ('이별', 'behavior', 2, 1, '다 지워버렸거나 정리했어', '{"직면형": 10, "인지형": 10}'),
      ('이별', 'behavior', 2, 2, '아직 남겨두고 있어', '{"회피형": 10, "감정형": 10}'),
      ('이별', 'behavior', 2, 3, '일부만 정리했어', '{"안정형": 10, "불안형": 10}'),
      ('이별', 'behavior', 2, 4, '아직 못 건드리고 있어', '{"회피형": 10, "불안형": 10}'),

      -- 이별 - Pattern Variant 1
      ('이별', 'pattern', 1, 1, '자꾸 상대를 찾아보거나 연락하려고 해', '{"회피형": 10, "감정형": 10}'),
      ('이별', 'pattern', 1, 2, '밤이 되면 과거 생각이 나', '{"감정형": 10, "불안형": 10}'),
      ('이별', 'pattern', 1, 3, '무언가를 하다가 갑자기 기억나', '{"감정형": 10, "불안형": 10}'),
      ('이별', 'pattern', 1, 4, '특별한 패턴은 없는 것 같아', '{"안정형": 10, "인지형": 10}'),

      -- 이별 - Pattern Variant 2
      ('이별', 'pattern', 2, 1, '그들이 부러워', '{"불안형": 10, "타인중심형": 10}'),
      ('이별', 'pattern', 2, 2, '나도 저렇게 행복했었는데…', '{"감정형": 10, "불안형": 10}'),
      ('이별', 'pattern', 2, 3, '그냥 별생각 없어', '{"안정형": 10, "자기중심형": 10}'),
      ('이별', 'pattern', 2, 4, '나랑은 다른 세상 얘기 같아', '{"회피형": 10, "불안형": 10}'),

      -- 이별 - Perception Variant 1
      ('이별', 'perception', 1, 1, '상처와 트라우마', '{"불안형": 10, "감정형": 10}'),
      ('이별', 'perception', 1, 2, '배움과 성장의 경험', '{"인지형": 10, "안정형": 10}'),
      ('이별', 'perception', 1, 3, '아직 평가하기 어려워', '{"불안형": 10, "인지형": 10}'),
      ('이별', 'perception', 1, 4, '좋은 추억과 그리움', '{"감정형": 10, "타인중심형": 10}'),

      -- 이별 - Perception Variant 2
      ('이별', 'perception', 2, 1, '여전히 회복 중이야', '{"불안형": 10, "감정형": 10}'),
      ('이별', 'perception', 2, 2, '거의 다 극복했어', '{"안정형": 10, "인지형": 10}'),
      ('이별', 'perception', 2, 3, '아무것도 아니야 vs 모든 것이야 사이를 오가', '{"불안형": 10, "회피형": 10}'),
      ('이별', 'perception', 2, 4, '일상으로 돌아가는 중이야', '{"안정형": 10, "감정형": 10}'),

      -- 재회 - Context Variant 1
      ('재회', 'context', 1, 1, '상대가 먼저 연락했어', '{"타인중심형": 10, "감정형": 10}'),
      ('재회', 'context', 1, 2, '내가 먼저 연락했어', '{"직면형": 10, "감정형": 10}'),
      ('재회', 'context', 1, 3, '우연히 만났어', '{"불안형": 10, "감정형": 10}'),
      ('재회', 'context', 1, 4, '친구를 통해 소식을 들었어', '{"타인중심형": 10, "안정형": 10}'),

      -- 재회 - Context Variant 2
      ('재회', 'context', 2, 1, '바로 답했어', '{"직면형": 10, "감정형": 10}'),
      ('재회', 'context', 2, 2, '한참 고민 후에 답했어', '{"인지형": 10, "불안형": 10}'),
      ('재회', 'context', 2, 3, '처음엔 무시하려다가 답했어', '{"회피형": 10, "불안형": 10}'),
      ('재회', 'context', 2, 4, '아직 답 안 했어', '{"회피형": 10, "자기중심형": 10}'),

      -- 재회 - Emotion Variant 1
      ('재회', 'emotion', 1, 1, '반갑고 설레', '{"직면형": 10, "감정형": 10}'),
      ('재회', 'emotion', 1, 2, '복잡하고 헷갈려', '{"불안형": 10, "인지형": 10}'),
      ('재회', 'emotion', 1, 3, '불편하고 어색해', '{"회피형": 10, "불안형": 10}'),
      ('재회', 'emotion', 1, 4, '과거가 다시 올라와', '{"감정형": 10, "불안형": 10}'),

      -- 재회 - Emotion Variant 2
      ('재회', 'emotion', 2, 1, '"아, 이 사람이 진짜 내가 좋아하던 사람이구나"', '{"감정형": 10, "직면형": 10}'),
      ('재회', 'emotion', 2, 2, '"많이 변했네" 또는 "역시 여전하네"', '{"인지형": 10, "타인중심형": 10}'),
      ('재회', 'emotion', 2, 3, '"과거로 돌아가고 싶은데 그럴 수 없어"', '{"불안형": 10, "회피형": 10}'),
      ('재회', 'emotion', 2, 4, '"뭘 해야 할지 모르겠어"', '{"불안형": 10, "회피형": 10}'),

      -- 재회 - Value Variant 1
      ('재회', 'value', 1, 1, '그 과정이 없었다면 지금 만남이 없을 것 같아', '{"인지형": 10, "감정형": 10}'),
      ('재회', 'value', 1, 2, '아직도 왜 헤어져야 했는지 모르겠어', '{"불안형": 10, "회피형": 10}'),
      ('재회', 'value', 1, 3, '그건 필요했는데, 재회가 필요한지는 모르겠어', '{"인지형": 10, "불안형": 10}'),
      ('재회', 'value', 1, 4, '헤어짐 없이 계속 함께였으면 좋았을 것 같아', '{"감정형": 10, "타인중심형": 10}'),

      -- 재회 - Value Variant 2
      ('재회', 'value', 2, 1, '과거의 실수를 반복하지 않을 자신이 있어', '{"인지형": 10, "직면형": 10}'),
      ('재회', 'value', 2, 2, '둘 다 성장했으니 다를 거라고 기대해', '{"감정형": 10, "안정형": 10}'),
      ('재회', 'value', 2, 3, '뭔가 다를 것 같지만 확실하지 않아', '{"인지형": 10, "불안형": 10}'),
      ('재회', 'value', 2, 4, '결국 또 같은 일이 반복될 것 같아서 불안해', '{"불안형": 10, "회피형": 10}'),

      -- 재회 - Behavior Variant 1
      ('재회', 'behavior', 1, 1, '명확하게 관심을 드러내', '{"직면형": 10, "감정형": 10}'),
      ('재회', 'behavior', 1, 2, '조심스럽게 마음을 열고 있어', '{"안정형": 10, "불안형": 10}'),
      ('재회', 'behavior', 1, 3, '조심하면서 거리를 둬', '{"회피형": 10, "불안형": 10}'),
      ('재회', 'behavior', 1, 4, '아직 마음을 정하지 못하고 있어', '{"불안형": 10, "회피형": 10}'),

      -- 재회 - Behavior Variant 2
      ('재회', 'behavior', 2, 1, '과거의 단점들을 개선했다고 생각해', '{"인지형": 10, "직면형": 10}'),
      ('재회', 'behavior', 2, 2, '변하려고 노력 중이야', '{"인지형": 10, "감정형": 10}'),
      ('재회', 'behavior', 2, 3, '아직 특별히 뭘 한 건 없어', '{"회피형": 10, "자기중심형": 10}'),
      ('재회', 'behavior', 2, 4, '바뀐 건 없지만 더 이해하려고 해', '{"타인중심형": 10, "안정형": 10}'),

      -- 재회 - Pattern Variant 1
      ('재회', 'pattern', 1, 1, '"아, 또 같은 상황이 반복되겠다"', '{"불안형": 10, "회피형": 10}'),
      ('재회', 'pattern', 1, 2, '"비슷하긴 한데 뭔가 달라진 것 같아"', '{"인지형": 10, "감정형": 10}'),
      ('재회', 'pattern', 1, 3, '"아직 판단이 잘 안 서"', '{"불안형": 10, "인지형": 10}'),
      ('재회', 'pattern', 1, 4, '"완전히 새로운 관계처럼 느껴져"', '{"직면형": 10, "감정형": 10}'),

      -- 재회 - Pattern Variant 2
      ('재회', 'pattern', 2, 1, '예전보다 더 잘 맞는 느낌이야', '{"안정형": 10, "감정형": 10}'),
      ('재회', 'pattern', 2, 2, '결국 예전이랑 비슷한 흐름이야', '{"인지형": 10, "불안형": 10}'),
      ('재회', 'pattern', 2, 3, '아직은 좀 어색해', '{"불안형": 10, "회피형": 10}'),
      ('재회', 'pattern', 2, 4, '그냥 다시 편해진 느낌이야', '{"안정형": 10, "감정형": 10}'),

      -- 재회 - Perception Variant 1
      ('재회', 'perception', 1, 1, '당연히 맞다고 생각해', '{"직면형": 10, "감정형": 10}'),
      ('재회', 'perception', 1, 2, '좀 더 지켜봐야 할 것 같아', '{"안정형": 10, "인지형": 10}'),
      ('재회', 'perception', 1, 3, '다시 실수할까봐 두려워', '{"불안형": 10, "회피형": 10}'),
      ('재회', 'perception', 1, 4, '아직 판단이 서지 않아', '{"불안형": 10, "인지형": 10}'),

      -- 재회 - Perception Variant 2
      ('재회', 'perception', 2, 1, '다시 잘 될 수도 있을 것 같아서 기대돼', '{"감정형": 10, "직면형": 10}'),
      ('재회', 'perception', 2, 2, '좋기도 한데 다시 상처받을까 봐 걱정돼', '{"불안형": 10, "감정형": 10}'),
      ('재회', 'perception', 2, 3, '어떻게 해야 할지 아직 잘 모르겠어', '{"불안형": 10, "회피형": 10}'),
      ('재회', 'perception', 2, 4, '그냥 다시 시작해도 괜찮을지 계속 고민돼', '{"불안형": 10, "인지형": 10}')
  ) AS od(rel_type, step, sort_order, display_order, text, weights)
  INNER JOIN new_questions_with_rel_type nqr ON
    nqr.relationship_type = od.rel_type
    AND nqr.step = od.step
    AND nqr.sort_order = od.sort_order
)

INSERT INTO public.question_options (question_id, text, display_order, weights)
SELECT q_id, text, display_order, weights::jsonb FROM options_to_insert;

COMMIT;

-- ============================================================================
-- 실행 후 검증 쿼리들
-- ============================================================================

-- 1. Question Sets 개수 확인 (예상: 4)
SELECT COUNT(*) AS question_sets_count
FROM public.question_sets
WHERE category = 'love' AND purpose = 'free';

-- 2. Questions 개수 확인 (예상: 48)
SELECT COUNT(*) AS questions_count
FROM public.questions q
INNER JOIN public.question_sets qs ON qs.id = q.question_set_id
WHERE qs.category = 'love' AND qs.purpose = 'free';

-- 3. Question Options 개수 확인 (예상: 192)
SELECT COUNT(*) AS question_options_count
FROM public.question_options qo
WHERE qo.question_id IN (
  SELECT q.id FROM public.questions q
  INNER JOIN public.question_sets qs ON qs.id = q.question_set_id
  WHERE qs.category = 'love' AND qs.purpose = 'free'
);

-- 4. Relationship Type + Step별 Question Count 확인 (모두 2개여야 함)
SELECT qs.relationship_type, q.step, COUNT(*) AS question_count
FROM public.questions q
INNER JOIN public.question_sets qs ON qs.id = q.question_set_id
WHERE qs.category = 'love' AND qs.purpose = 'free'
GROUP BY qs.relationship_type, q.step
ORDER BY qs.relationship_type, q.step;

-- 5. 각 Question마다 Option 개수 확인 (모두 4개여야 함)
SELECT q.id, q.text, q.step, q.sort_order, COUNT(qo.id) AS option_count
FROM public.questions q
LEFT JOIN public.question_options qo ON qo.question_id = q.id
WHERE q.id IN (
  SELECT q.id FROM public.questions q
  INNER JOIN public.question_sets qs ON qs.id = q.question_set_id
  WHERE qs.category = 'love' AND qs.purpose = 'free'
)
GROUP BY q.id, q.text, q.step, q.sort_order
HAVING COUNT(qo.id) != 4
ORDER BY q.id;

-- 6. Relationship Type + Step별로 문제 있는 경우만 표시 (결과가 없어야 정상)
SELECT qs.relationship_type, q.step, COUNT(*) AS count
FROM public.questions q
INNER JOIN public.question_sets qs ON qs.id = q.question_set_id
WHERE qs.category = 'love' AND qs.purpose = 'free'
GROUP BY qs.relationship_type, q.step
HAVING COUNT(*) != 2
ORDER BY qs.relationship_type, q.step;
