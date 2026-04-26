/** 분석 카테고리 — PRD 3.2 */
export type AnalysisCategory = '연애' | '감정' | '인간관계' | '직업/진로';

/** 분석 하위 분기 — PRD 3.2 카테고리별 분기 구조 */
export type AnalysisSubcategory =
  | '썸' | '연애 중' | '이별' | '재회'          // 연애
  | '친구' | '가족' | '직장' | '사람 전반'       // 인간관계
  | '이직' | '방향성' | '확신 부족' | '현실 vs 적성'; // 직업/진로

/** 성향 축 점수 — PRD 3.7.2 */
export interface TraitScores {
  인지형: number;
  감정형: number;
  불안형: number;
  안정형: number;
  회피형: number;
  직면형: number;
  자기이해형: number;
  해결형: number;
  타인중심형: number;
  자기중심형: number;
}

/** 질문 선택지 */
export interface QuestionOption {
  id: string;
  text: string;
  /** 성향 축 가중치 — PRD 3.7.3 */
  weights?: Partial<TraitScores>;
}

/** 분석 플로우 질문 단계 — PRD 5.5 */
export type QuestionStep =
  | 'context'    // 1. 현재 상황 정의
  | 'emotion'    // 2. 현재 감정 확인
  | 'value'      // 3. 선택 시 중요 기준
  | 'behavior'   // 4. 불확실할 때 반응 패턴
  | 'pattern'    // 5. 반복 구조 확인
  | 'perception'; // 6. 자기 인식 보정

/** 분석 질문 */
export interface AnalysisQuestion {
  id: string;
  step: QuestionStep;
  text: string;
  type: 'single' | 'multiple';
  options: QuestionOption[];
}

/** 질문 답변 */
export interface QuestionAnswer {
  questionId: string;
  selectedOptionIds: string[];
}

/** 분석 세션 (제출 단위) */
export interface AnalysisSession {
  sessionId: string;
  category: AnalysisCategory;
  subcategory?: AnalysisSubcategory;
  answers: QuestionAnswer[];
  /** PRD 3.7: 사용자 성향 점수 */
  traitScores?: TraitScores;
  /** PRD 3.7: 추론된 사용자 타입 */
  inferredUserType?: {
    topTraits: Array<{ trait: keyof TraitScores; score: number }>;
    reportTone: '인지형' | '감정형' | '균형형';
    questionStrategy: '구조중심' | '감정중심' | '미래흐름' | '자기합리화깨기';
  };
  createdAt: string;
}

/** 분석 플로우 클라이언트 상태 — PRD 5.6 */
export interface AnalysisFlowState {
  category: AnalysisCategory | null;
  subcategory: AnalysisSubcategory | null;
  currentStep: number;
  questions: AnalysisQuestion[];
  answers: QuestionAnswer[];
}
