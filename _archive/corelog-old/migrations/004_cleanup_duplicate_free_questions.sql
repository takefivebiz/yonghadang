-- ============================================================================
-- 중복 free 질문 정리 및 데이터 무결성 복구
-- 문제: 002 마이그레이션 중복 실행으로 각 카테고리마다 질문이 2배 (12개 → 6개로 정리)
-- ============================================================================

-- ============================================================================
-- 1. 중복 question_sets 식별 및 정리
-- ============================================================================
-- purpose='free'인 question_sets에서 category별로 중복 확인
SELECT category, COUNT(*) as count
FROM public.question_sets
WHERE purpose = 'free'
GROUP BY category;
-- 결과: 각 category마다 2개 또는 1개 (중복 확인용)

-- ============================================================================
-- 2. 중복 questions 삭제 (각 step별로 최신 1개만 유지)
-- ============================================================================
-- 같은 question_set_id, category, step 조합에서 중복인 것들 찾기
WITH duplicate_questions AS (
  SELECT
    id,
    question_set_id,
    category,
    step,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY question_set_id, category, step
      ORDER BY created_at ASC
    ) as rn
  FROM public.questions
  WHERE purpose = 'free'
)
SELECT * FROM duplicate_questions WHERE rn > 1;

-- 중복 questions 삭제 (가장 오래된 것들 제거)
WITH duplicate_questions AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY question_set_id, category, step
      ORDER BY created_at ASC
    ) as rn
  FROM public.questions
  WHERE purpose = 'free'
)
DELETE FROM public.questions
WHERE id IN (
  SELECT id FROM duplicate_questions WHERE rn > 1
);

-- 검증: 카테고리별 step별 개수 확인 (각각 1개씩만 있어야 함)
SELECT category, step, COUNT(*) as count
FROM public.questions
WHERE purpose = 'free' AND is_active = TRUE
GROUP BY category, step
ORDER BY category, step;
-- 결과: 각 category × step 조합마다 1개씩 (총 24개: 4 categories × 6 steps)

-- ============================================================================
-- 3. 중복 question_sets 삭제 (각 카테고리마다 1개만 유지)
-- ============================================================================
-- 각 category별로 최신 question_set 1개 유지, 나머지는 on delete cascade로 함께 삭제됨
WITH duplicate_sets AS (
  SELECT
    id,
    category,
    ROW_NUMBER() OVER (
      PARTITION BY category
      ORDER BY created_at DESC
    ) as rn
  FROM public.question_sets
  WHERE purpose = 'free'
)
DELETE FROM public.question_sets
WHERE id IN (
  SELECT id FROM duplicate_sets WHERE rn > 1
);

-- 검증: 카테고리별 question_sets 개수 확인
SELECT category, COUNT(*) as count
FROM public.question_sets
WHERE purpose = 'free'
GROUP BY category;
-- 결과: 각 category마다 정확히 1개씩 (총 4개)

-- ============================================================================
-- 4. 재발 방지: Unique Constraint 추가
-- ============================================================================
-- purpose + category + step + version 조합은 unique해야 함
ALTER TABLE public.questions
ADD CONSTRAINT unique_free_questions_per_category_step_version UNIQUE (
  purpose, category, step, version
)
WHERE purpose = 'free';

-- 검증: 전체 free 질문 최종 개수 확인
SELECT COUNT(*) as total_free_questions
FROM public.questions
WHERE purpose = 'free' AND is_active = TRUE;
-- 결과: 24개 (4 categories × 6 steps)

-- ============================================================================
-- 5. 데이터 무결성 검증
-- ============================================================================
-- Free questions 최종 상태 확인
SELECT
  qs.id as question_set_id,
  qs.category,
  COUNT(q.id) as question_count,
  STRING_AGG(q.step, ', ' ORDER BY q.step) as steps
FROM public.question_sets qs
LEFT JOIN public.questions q ON qs.id = q.question_set_id AND q.purpose = 'free'
WHERE qs.purpose = 'free'
GROUP BY qs.category, qs.id
ORDER BY qs.category;
