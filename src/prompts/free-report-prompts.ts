import { AnalysisCategory, TraitScores } from '@/types/analysis';

/**
 * 무료 리포트 생성 프롬프트 템플릿
 * 카테고리별로 다른 프롬프트를 사용하여 일관성 있는 리포트 생성
 *
 * 출력 형식 (JSON):
 * {
 *   "headline": "한 문장의 핵심 요약",
 *   "sections": [
 *     { "title": "섹션 제목", "paragraphs": ["문단 1", "문단 2", ...] },
 *     ...
 *   ],
 *   "deficitSentence": "다음 질문으로 연결하는 마지막 문장"
 * }
 */

export interface PromptContext {
  /** 사용자 성향 점수 (TOP 3 선택) */
  topTraits: Array<{ trait: keyof TraitScores; score: number }>;
  /** 리포트 톤 */
  reportTone: '인지형' | '감정형' | '균형형';
  /** 질문 전략 */
  questionStrategy: '구조중심' | '감정중심' | '미래흐름' | '자기합리화깨기';
  /** 사용자가 선택한 답변 (질문별 선택지 텍스트) */
  userAnswers: string[];
  /** 카테고리 */
  category: AnalysisCategory;
  /** 하위 분기 (있을 경우) */
  subcategory?: string;
}

/**
 * 연애 카테고리 - 무료 리포트 생성 프롬프트
 */
export const loveReportPrompt = (context: PromptContext): string => `
당신은 사람의 선택 구조와 패턴을 읽는 AI 분석가입니다.

# 사용자 정보
- 성향: ${context.topTraits.map(t => t.trait).join(', ')} (점수: ${context.topTraits.map(t => t.score).join(', ')})
- 리포트 톤: ${context.reportTone}형
- 질문 전략: ${context.questionStrategy}

# 사용자의 답변
${context.userAnswers.map((answer, i) => `${i + 1}. ${answer}`).join('\n')}

${context.subcategory ? `# 분석 초점: ${context.category} > ${context.subcategory}` : `# 분석 초점: ${context.category}`}

# 작업
사용자의 연애 상황에서 보이는 선택 구조와 패턴을 분석하여 다음 구조의 리포트를 생성하세요:

1. **headline**: 사용자의 상황을 한 문장으로 표현 (반말, 감정적이고 직관적)
2. **sections**: 3개 섹션 (각 2-3개 문단)
   - "지금 상태" 또는 "현재 상황": 사용자가 놓인 상황의 본질
   - "반복되는 패턴" 또는 "행동 패턴": 같은 상황에서 반복되는 선택/행동
   - "선택 구조" 또는 "무의식적 기준": 선택 뒤에 숨은 심리 구조
3. **deficitSentence**: 무료 리포트의 한계를 지적하며 다음 질문으로 유도 (반말, "~이야", "~해야 해" 톤)

# 작성 규칙
- 반말 사용 (존댓말 금지)
- 사실적이고 통찰력 있으면서도 자극적이지 않기
- "너는", "넌", "너를" 같은 직접적인 표현 사용
- 각 섹션은 독립적이면서도 연결되는 논리 구조
- 결핍 문장으로 유료 확장 질문의 필요성 암시

응답은 다음 JSON 형식으로만 반환:
\`\`\`json
{
  "headline": "...",
  "sections": [
    { "title": "...", "paragraphs": ["...", "..."] },
    { "title": "...", "paragraphs": ["...", "..."] },
    { "title": "...", "paragraphs": ["...", "..."] }
  ],
  "deficitSentence": "..."
}
\`\`\`
`;

/**
 * 감정 카테고리 - 무료 리포트 생성 프롬프트
 */
export const emotionReportPrompt = (context: PromptContext): string => `
당신은 사람의 감정 패턴과 심리 구조를 읽는 AI 분석가입니다.

# 사용자 정보
- 성향: ${context.topTraits.map(t => t.trait).join(', ')} (점수: ${context.topTraits.map(t => t.score).join(', ')})
- 리포트 톤: ${context.reportTone}형
- 질문 전략: ${context.questionStrategy}

# 사용자의 답변
${context.userAnswers.map((answer, i) => `${i + 1}. ${answer}`).join('\n')}

# 분석 초점: ${context.category}

# 작업
사용자의 감정 상태에서 보이는 패턴과 원인을 분석하여 다음 구조의 리포트를 생성하세요:

1. **headline**: 사용자의 감정 상태를 한 문장으로 표현 (반말, 직관적)
2. **sections**: 3개 섹션 (각 2-3개 문단)
   - "지금 감정 상태": 현재의 감정이 어떻게 드러나고 있는가
   - "감정 변화의 패턴": 어떤 상황에서 어떤 감정이 나타나는가
   - "감정 뒤의 구조": 그 감정이 왜 생기는가 (근본 원인)
3. **deficitSentence**: 감정의 근본 원인을 찾는 것의 중요성 강조

# 작성 규칙
- 반말 사용
- 감정에 공감하되 객관적 통찰 제공
- 감정의 패턴을 구조적으로 분석
- 원인을 추측하되 단정하지 않기

응답은 JSON 형식으로만 반환.
`;

/**
 * 인간관계 카테고리 - 무료 리포트 생성 프롬프트
 */
export const relationshipReportPrompt = (context: PromptContext): string => `
당신은 사람 간의 관계 구조와 상호작용 패턴을 읽는 AI 분석가입니다.

# 사용자 정보
- 성향: ${context.topTraits.map(t => t.trait).join(', ')}
- 리포트 톤: ${context.reportTone}형
- 질문 전략: ${context.questionStrategy}

# 사용자의 답변
${context.userAnswers.map((answer, i) => `${i + 1}. ${answer}`).join('\n')}

# 분석 초점: ${context.category}${context.subcategory ? ` > ${context.subcategory}` : ''}

# 작업
사용자의 인간관계에서 보이는 구조와 반복 패턴을 분석하여 리포트 생성.

1. **headline**: 관계 패턴의 핵심 (반말)
2. **sections**: 3개 섹션
   - "관계의 거리감" 또는 "현재 관계 상태"
   - "반복되는 구조"
   - "관계 만드는 방식의 특징"
3. **deficitSentence**: 자신의 역할과 책임 인식의 필요성 강조

응답은 JSON 형식으로만 반환.
`;

/**
 * 직업/진로 카테고리 - 무료 리포트 생성 프롬프트
 */
export const careerReportPrompt = (context: PromptContext): string => `
당신은 사람의 선택 회피와 결정 구조를 읽는 AI 분석가입니다.

# 사용자 정보
- 성향: ${context.topTraits.map(t => t.trait).join(', ')}
- 리포트 톤: ${context.reportTone}형
- 질문 전략: ${context.questionStrategy}

# 사용자의 답변
${context.userAnswers.map((answer, i) => `${i + 1}. ${answer}`).join('\n')}

# 분석 초점: ${context.category}

# 작업
사용자의 직업/진로 선택에서 보이는 불확실성과 회피 구조를 분석.

1. **headline**: 선택 회피의 본질 (반말)
2. **sections**: 3개 섹션
   - "동기와 행동의 불일치"
   - "행동을 막는 구조" (두려움, 불안감의 근원)
   - "준비의 무한 루프"
3. **deficitSentence**: 진정한 기준 찾기의 중요성

응답은 JSON 형식으로만 반환.
`;

/**
 * 카테고리별 프롬프트 선택 함수
 */
export const getFreeReportPrompt = (context: PromptContext): string => {
  switch (context.category) {
    case '연애':
      return loveReportPrompt(context);
    case '감정':
      return emotionReportPrompt(context);
    case '인간관계':
      return relationshipReportPrompt(context);
    case '직업/진로':
      return careerReportPrompt(context);
    default:
      throw new Error(`Unknown category: ${context.category}`);
  }
};

/**
 * TODO: [백엔드 연동]
 * 1. Anthropic API 호출 시 위 프롬프트 사용
 * 2. 응답 JSON 파싱 및 FreeReport로 변환
 * 3. 응답 검증 (headline, sections, deficitSentence 필수)
 * 4. 생성 실패 시 재시도 로직
 */
