// ── Hidden State 타입 ────────────────────────────────────────────────
// 콘텐츠마다 다른 감정 차원을 갖는다. string으로 느슨하게 두되, 콘텐츠팩에서 as const로 좁힌다.
export type HiddenDimension = string;

// 선택지 하나가 각 차원에 주는 점수 증가량
export type ScoreDelta = Partial<Record<HiddenDimension, number>>;

// 누적된 hidden state 점수 맵
export type HiddenState = Record<HiddenDimension, number>;

// ── 점수 → 산문 변환 규칙 ─────────────────────────────────────────────
export interface StateTranslationRule {
  dimension: HiddenDimension;
  /** 이 점수 이상이면 statement 포함 */
  threshold: number;
  /** Claude에게 전달할 사용자 상태 문장 */
  statement: string;
  /** 낮을수록 먼저 포함 (최대 maxStatements개 선택) */
  priority: number;
}

// ── Additional Reading 타입 ───────────────────────────────────────────
// 결과를 모두 읽은 뒤 노출되는 추가 해석 콘텐츠.
// AI가 생성하지 않는다. 콘텐츠별로 미리 정의된 후보 목록.
// 각 항목은 개별 구매 가능한 추가 리딩이 된다.
// hidden state 점수 기반으로 노출 우선순위를 결정한다.
export interface AdditionalReading {
  id: string;
  /** 사용자에게 노출되는 질문 형태의 제목 */
  title: string;
  /** 한 줄 부제목 (선택적) */
  subtitle?: string;
  /** 우선 노출 기준: 이 dimension 점수가 높을수록 상위에 노출 */
  trigger_dimension?: HiddenDimension;
  /** trigger_dimension 점수가 이 값 이상이어야 '관련도 높음'으로 간주 */
  trigger_threshold?: number;
}

// ── 콘텐츠팩 인터페이스 ──────────────────────────────────────────────
// 콘텐츠별 1파일(love-1.ts 등)이 이 구조를 export 한다.
export interface ContentPack {
  contentId: string;
  dimensions: HiddenDimension[];
  /** option value → 각 차원 점수 증가량 */
  scoreMap: Record<string, ScoreDelta>;
  translationRules: StateTranslationRule[];
  /** 결과 이후 노출할 추가 리딩 후보 목록. hidden state로 우선순위 결정. */
  additionalReadings: AdditionalReading[];
}
