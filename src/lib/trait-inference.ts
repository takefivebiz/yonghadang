import { AnalysisQuestion, QuestionAnswer, TraitScores } from '@/types/analysis';

/** PRD 3.7: 사용자 답변으로부터 성향 점수 계산 */
export const calculateTraits = (
  answers: QuestionAnswer[],
  questions: AnalysisQuestion[],
): TraitScores => {
  const scores: TraitScores = {
    인지형: 0,
    감정형: 0,
    불안형: 0,
    안정형: 0,
    회피형: 0,
    직면형: 0,
    자기이해형: 0,
    해결형: 0,
    타인중심형: 0,
    자기중심형: 0,
  };

  // 각 답변에 대해 점수 누적
  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) return;

    answer.selectedOptionIds.forEach((optionId) => {
      const option = question.options.find((o) => o.id === optionId);
      if (!option || !option.weights) return;

      // 선택지의 가중치를 각 성향에 누적
      Object.entries(option.weights).forEach(([trait, weight]) => {
        scores[trait as keyof TraitScores] += weight;
      });
    });
  });

  return scores;
};

/** 성향 축 타입 정의 */
export type TraitAxis =
  | '인지형/감정형'
  | '불안형/안정형'
  | '회피형/직면형'
  | '자기이해형/해결형'
  | '타인중심형/자기중심형';

/** 추론된 사용자 타입 */
export interface InferredUserType {
  /** 상위 성향들 (최대 3개) */
  topTraits: Array<{ trait: keyof TraitScores; score: number }>;
  /** 각 축별 강도 (null: 중립, 'left'/'right': 어느 쪽이 더 강함) */
  axisDirections: Record<TraitAxis, 'left' | 'neutral' | 'right'>;
  /** 리포트 톤 (인지형 중심 vs 감정형 중심) */
  reportTone: '인지형' | '감정형' | '균형형';
  /** 질문 추천 전략 */
  questionStrategy: '구조중심' | '감정중심' | '미래흐름' | '자기합리화깨기';
}

/** PRD 3.7: 점수로부터 사용자 타입 추론 */
export const inferUserType = (traits: TraitScores): InferredUserType => {
  // 상위 3개 성향 추출
  const sortedTraits = Object.entries(traits)
    .map(([trait, score]) => ({ trait: trait as keyof TraitScores, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // 각 축의 방향 결정 (어느 쪽이 더 강한지)
  const axisDirections: Record<TraitAxis, 'left' | 'neutral' | 'right'> = {
    '인지형/감정형': getAxisDirection(traits.인지형, traits.감정형),
    '불안형/안정형': getAxisDirection(traits.불안형, traits.안정형),
    '회피형/직면형': getAxisDirection(traits.회피형, traits.직면형),
    '자기이해형/해결형': getAxisDirection(traits.자기이해형, traits.해결형),
    '타인중심형/자기중심형': getAxisDirection(traits.타인중심형, traits.자기중심형),
  };

  // 리포트 톤 결정
  const reportTone = getReportTone(
    axisDirections['인지형/감정형'],
    sortedTraits,
  );

  // 질문 추천 전략 결정
  const questionStrategy = getQuestionStrategy(axisDirections);

  return {
    topTraits: sortedTraits,
    axisDirections,
    reportTone,
    questionStrategy,
  };
};

/** 축의 방향 판단: 차이가 3점 이상이면 한쪽으로 판정 */
const getAxisDirection = (
  left: number,
  right: number,
): 'left' | 'neutral' | 'right' => {
  const diff = left - right;
  if (diff >= 3) return 'left';
  if (diff <= -3) return 'right';
  return 'neutral';
};

/** 리포트 톤 결정 */
const getReportTone = (
  cognitionAxis: 'left' | 'neutral' | 'right',
  topTraits: Array<{ trait: keyof TraitScores; score: number }>,
): '인지형' | '감정형' | '균형형' => {
  if (cognitionAxis === 'left') return '인지형';
  if (cognitionAxis === 'right') return '감정형';

  // 중립일 경우 상위 특성 확인
  const hasCognitive = topTraits.some((t) => t.trait === '인지형');
  const hasEmotional = topTraits.some((t) => t.trait === '감정형');

  if (hasCognitive && !hasEmotional) return '인지형';
  if (hasEmotional && !hasCognitive) return '감정형';
  return '균형형';
};

/** 질문 추천 전략 결정 — PRD 3.7.4 */
const getQuestionStrategy = (
  axisDirections: Record<TraitAxis, 'left' | 'neutral' | 'right'>,
): '구조중심' | '감정중심' | '미래흐름' | '자기합리화깨기' => {
  const isAnxious = axisDirections['불안형/안정형'] === 'left';
  const isAvoidant = axisDirections['회피형/직면형'] === 'left';
  const isCognitive = axisDirections['인지형/감정형'] === 'left';

  if (isCognitive) {
    return '구조중심';
  }

  if (isAnxious) {
    return '미래흐름';
  }

  if (isAvoidant) {
    return '자기합리화깨기';
  }

  return '감정중심';
};
