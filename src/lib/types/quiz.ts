// ── Hidden State 타입 ────────────────────────────────────────────────
// 콘텐츠마다 다른 감정 차원을 갖는다. string으로 느슨하게 두되, 콘텐츠팩에서 as const로 좁힌다.
export type HiddenDimension = string;

// 선택지 하나가 각 차원에 주는 점수 증가량
export type ScoreDelta = Partial<Record<HiddenDimension, number>>;

// 누적된 hidden state 점수 맵
export type HiddenState = Record<HiddenDimension, number>;

// ── 점수 → 산문 변환 규칙 ─────────────────────────────────────────────
// 두 가지 형식을 지원한다:
//   1) SingleDimensionRule: 단일 차원 + threshold (기존 방식, backward compatible)
//   2) CompoundRule: 여러 차원의 조건 조합으로 subtype을 식별 (love-1 흔들림 subtype 등)
//
// translator.ts는 'conditions' in rule 으로 분기 처리한다.

/** 단일 차원 + threshold 기반 규칙 (기존 형식) */
export interface SingleDimensionRule {
  dimension: HiddenDimension;
  /** 이 점수 이상이면 statement 포함 (음수면 score <= threshold 로 매칭) */
  threshold: number;
  /** Claude에게 전달할 사용자 상태 문장 */
  statement: string;
  /** 낮을수록 먼저 포함 (최대 maxStatements개 선택) */
  priority: number;
}

/** Compound rule이 사용하는 개별 조건 */
export interface CompoundCondition {
  dimension: HiddenDimension;
  /** 이 점수 이상이어야 통과 (음수면 score <= threshold 로 매칭) */
  threshold: number;
}

/** 여러 차원의 조건이 모두 충족되어야 발화하는 규칙 (subtype 식별용) */
export interface CompoundRule {
  /** subtype 식별자. dedup 키로 사용된다. 같은 groupKey는 가장 우선순위 높은 것만 살아남는다. */
  groupKey: string;
  /** 모든 조건이 충족되어야 statement 발화 */
  conditions: CompoundCondition[];
  /** Claude에게 전달할 사용자 상태 문장 */
  statement: string;
  /** 낮을수록 먼저 포함 (최대 maxStatements개 선택) */
  priority: number;
}

export type StateTranslationRule = SingleDimensionRule | CompoundRule;

// ── Loop Reading 타입 ────────────────────────────────────────────────
// 무료+유료 결과를 다 읽은 뒤 추가 구매하는 후속 리딩.
// 사용자가 더 알고 싶은 방향(loopType)만 다르고, subtype 차이는 기존 context에서 반영된다.

/** 후속 리딩 방향 키 */
export type LoopType = "action" | "standard" | "evaluate";

export interface LoopMessage {
  type: "punch" | "ai";
  text: string;
}

/** 생성 완료된 루프 답변. localStorage에 저장된다. */
export interface LoopAnswer {
  loopType: LoopType;
  title: string;
  generatedAt: string; // ISO 8601
  messages: LoopMessage[];
}

// ── Additional Reading 타입 ───────────────────────────────────────────
// 결과를 모두 읽은 뒤 노출되는 추가 해석 콘텐츠.
// 각 항목은 개별 구매 가능한 추가 리딩이 된다.
// loopType은 generate API 호출 시 사용된다.
export interface AdditionalReading {
  id: string;
  /** 루프 생성/결제 처리에 사용되는 방향 키 */
  loopType: LoopType;
  /** 사용자에게 노출되는 질문 형태의 제목 */
  title: string;
  /** 한 줄 부제목 (선택적) */
  subtitle?: string;
  /** 우선 노출 기준: 이 dimension 점수가 높을수록 상위에 노출 (love-1에서는 미사용) */
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
