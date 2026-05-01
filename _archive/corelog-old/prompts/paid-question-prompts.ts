import { AnalysisCategory, TraitScores } from '@/types/analysis';

/**
 * 유료 확장 질문 생성 프롬프트 템플릿
 *
 * 무료 리포트에서 제시한 문제를 더 깊이 있게 탐색하기 위한 3가지 질문
 * 각 질문은 다른 각도에서 접근하여 사용자의 자기이해를 확장
 *
 * 출력 형식 (JSON):
 * {
 *   "paidQuestions": [
 *     {
 *       "id": "pq_[category]_01",
 *       "question": "질문 텍스트",
 *       "price": 900
 *     },
 *     ...
 *   ]
 * }
 */

export interface PaidQuestionContext {
  /** 무료 리포트에서 드러난 핵심 문제 */
  deficitSentence: string;
  /** 사용자 성향 (TOP 3) */
  topTraits: Array<{ trait: keyof TraitScores; score: number }>;
  /** 리포트 톤 */
  reportTone: '인지형' | '감정형' | '균형형';
  /** 카테고리 */
  category: AnalysisCategory;
  /** 하위 분기 */
  subcategory?: string;
}

/**
 * 연애 카테고리 - 유료 질문 생성 프롬프트
 */
export const lovePaidQuestionsPrompt = (context: PaidQuestionContext): string => `
당신은 심리 상담가입니다. 사용자의 연애 상황을 더 깊이 있게 탐색할 3가지 질문을 생성하세요.

# 맥락
- 무료 리포트의 결론: "${context.deficitSentence}"
- 사용자 성향: ${context.topTraits.map(t => t.trait).join(', ')}
- 분석 카테고리: 연애${context.subcategory ? ` > ${context.subcategory}` : ''}

# 작업
무료 리포트에서 제시한 문제를 더 깊이 탐색하는 3가지 질문을 생성하세요.
각 질문은:
1. 구체적이고 실행 가능한 인사이트를 제공할 수 있어야 함
2. 서로 다른 각도에서 접근 (원인 분석, 결과 예측, 해결책)
3. 사용자의 자기 이해를 확장
4. 반말, 친근한 톤

예시:
- 1번: 원인/근원 파고들기 (이 불안감은 어디서 비롯됐을까?)
- 2번: 결과/미래 예측 (이 상태가 계속되면 어떻게 될까?)
- 3번: 구조/패턴 깨기 (지금 너가 할 수 있는 선택은?)

응답 형식:
\`\`\`json
{
  "paidQuestions": [
    {
      "id": "pq_love_01",
      "question": "질문 1 (원인/근원 탐색)",
      "price": 900
    },
    {
      "id": "pq_love_02",
      "question": "질문 2 (결과/미래 예측)",
      "price": 900
    },
    {
      "id": "pq_love_03",
      "question": "질문 3 (해결책/구조 깨기)",
      "price": 900
    }
  ]
}
\`\`\`
`;

/**
 * 감정 카테고리 - 유료 질문 생성 프롬프트
 */
export const emotionPaidQuestionsPrompt = (context: PaidQuestionContext): string => `
당신은 심리 상담가입니다. 사용자의 감정 문제를 더 깊이 탐색할 3가지 질문을 생성하세요.

# 맥락
- 무료 리포트의 결론: "${context.deficitSentence}"
- 사용자 성향: ${context.topTraits.map(t => t.trait).join(', ')}
- 분석 카테고리: 감정

# 작업
감정의 근본 원인을 찾고, 그 감정과의 관계를 재설정하는 3가지 질문.

접근 방식:
- 1번: 감정 발생의 구체적 트리거 찾기
- 2번: 감정의 기능적 의미 이해하기 (이 감정이 나에게 말해주는 건?)
- 3번: 감정과의 관계 변화 (이 감정을 어떻게 다르게 봐야 할까?)

응답 형식: JSON (위 연애 예시 참조)
`;

/**
 * 인간관계 카테고리 - 유료 질문 생성 프롬프트
 */
export const relationshipPaidQuestionsPrompt = (context: PaidQuestionContext): string => `
당신은 심리 상담가입니다. 사용자의 관계 패턴을 더 깊이 탐색할 3가지 질문을 생성하세요.

# 맥락
- 무료 리포트의 결론: "${context.deficitSentence}"
- 사용자 성향: ${context.topTraits.map(t => t.trait).join(', ')}
- 분석 카테고리: 인간관계${context.subcategory ? ` > ${context.subcategory}` : ''}

# 작업
관계 패턴의 근본 원인과 변화 가능성을 탐색하는 3가지 질문.

접근 방식:
- 1번: 내가 관계에서 반복하는 역할은 무엇인가?
- 2번: 관계가 왜 이 패턴으로 진행되는가?
- 3번: 이 패턴을 바꾸기 위해 내가 먼저 해야 할 일은?

응답 형식: JSON (위 연애 예시 참조)
`;

/**
 * 직업/진로 카테고리 - 유료 질문 생성 프롬프트
 */
export const careerPaidQuestionsPrompt = (context: PaidQuestionContext): string => `
당신은 커리어 코치입니다. 사용자의 선택 회피 구조를 더 깊이 탐색할 3가지 질문을 생성하세요.

# 맥락
- 무료 리포트의 결론: "${context.deficitSentence}"
- 사용자 성향: ${context.topTraits.map(t => t.trait).join(', ')}
- 분석 카테고리: 직업/진로

# 작업
선택의 불확실성을 분석하고 진정한 기준을 찾는 3가지 질문.

접근 방식:
- 1번: 지금 결정을 막는 진짜 두려움은 무엇인가?
- 2번: 최악의 시나리오를 현실적으로 보면 어떻게 되는가?
- 3번: 10년 뒤 나는 지금의 결정을 후회할까?

응답 형식: JSON (위 연애 예시 참조)
`;

/**
 * 카테고리별 유료 질문 프롬프트 선택
 */
export const getPaidQuestionsPrompt = (context: PaidQuestionContext): string => {
  switch (context.category) {
    case '연애':
      return lovePaidQuestionsPrompt(context);
    case '감정':
      return emotionPaidQuestionsPrompt(context);
    case '인간관계':
      return relationshipPaidQuestionsPrompt(context);
    case '직업/진로':
      return careerPaidQuestionsPrompt(context);
    default:
      throw new Error(`Unknown category: ${context.category}`);
  }
};

/**
 * TODO: [백엔드 연동]
 * 1. 무료 리포트 생성 후 deficitSentence 추출
 * 2. 유료 질문 프롬프트 생성 및 API 호출
 * 3. 응답 JSON 파싱 및 PaidQuestion 배열로 변환
 * 4. ID 자동 생성 (pq_[category]_01, pq_[category]_02, pq_[category]_03)
 * 5. price는 모두 900 KRW로 통일
 */
