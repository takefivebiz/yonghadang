import type {
  ContentPack,
  StateTranslationRule,
  AdditionalReading,
} from "@/lib/types/quiz";

// ── Hidden State 차원 정의 ───────────────────────────────────────────
// love-1은 "상대의 불확실함 때문에 흔들리는 사람들" 전용 콘텐츠다.
// 모든 차원은 0~+5 단방향으로 운용한다 (음수 진입 없음).
// 흔들림 자체는 전제이고, 차원은 "흔들림의 방식"이 어떻게 다른지를 식별한다.
//
// shakeIntensity     흔들림 강도 (모든 subtype의 베이스)
// clarityHunger      확인/관계 정의 욕구
// interpretiveLoop   신호 반복 해석 (대화·장면을 거듭 되감기)
// actionImminence    행동 임박도 (곧 결정/표현해야 한다는 감각)
// expectationFold    기대 접기 진행도 (마음을 천천히 줄이는 정도)
// emotionalFatigue   감정 소진도 (흔들림에서 지쳐가는 정도)
export const LOVE_1_DIMENSIONS = [
  "shakeIntensity",
  "clarityHunger",
  "interpretiveLoop",
  "actionImminence",
  "expectationFold",
  "emotionalFatigue",
] as const;

export type Love1Dimension = (typeof LOVE_1_DIMENSIONS)[number];

// ── option value → 점수 변화량 ───────────────────────────────────────
// 각 value는 dummy-analyze-config.ts의 love-1 questions에서 정의된 것과 동일해야 한다.
// 모든 값은 양수만 사용한다 (음수 진입 봉쇄).
export const LOVE_1_SCORE_MAP: Record<
  string,
  Partial<Record<Love1Dimension, number>>
> = {
  // ── Q1: 흔들림의 현재 위상 ─────────────────────────────────────────
  // need_clear_answer+last_check_before_action → clarity_and_decide (clarityHunger:3, actionImminence:2)
  // slowly_lowering_expectation+worn_out_from_shaking → fading_with_fatigue (expectationFold:3, emotionalFatigue:2)
  just_started_shaking: {
    shakeIntensity: 3,
    clarityHunger: 1,
  },
  clarity_and_decide: {
    clarityHunger: 3,
    actionImminence: 2,
  },
  replaying_conversations: {
    interpretiveLoop: 3,
    shakeIntensity: 1,
  },
  fading_with_fatigue: {
    expectationFold: 3,
    emotionalFatigue: 2,
  },
  cant_let_go_after_end: {
    shakeIntensity: 2,
    expectationFold: 3,
  },

  // ── Q2: 상대 태도 (모두 "애매" 전제) ──────────────────────────────
  emotion_without_clarity: {
    clarityHunger: 2,
    interpretiveLoop: 1,
  },
  inconsistent_interest: {
    shakeIntensity: 2,
    interpretiveLoop: 1,
  },
  comfortable_without_progress: {
    clarityHunger: 1,
    expectationFold: 1,
  },
  signal_without_commitment: {
    interpretiveLoop: 2,
    clarityHunger: 1,
  },
  fading_response: {
    emotionalFatigue: 2,
    expectationFold: 2,
  },

  // ── Q3: 흔들릴 때 내 반응 (multiple) ──────────────────────────────
  // rechecking_signals+silent_overthinking → looping_inside (점수 동일)
  // unwanted_recurrence 제거 (Q1/Q4 중복 신호)
  looping_inside: {
    interpretiveLoop: 2,
    shakeIntensity: 1,
  },
  mood_swings_by_signal: {
    shakeIntensity: 3,
  },
  holding_back_question: {
    clarityHunger: 2,
    actionImminence: 1,
  },
  one_more_check_then_decide: {
    actionImminence: 3,
    clarityHunger: 2,
  },
  trying_to_detach: {
    expectationFold: 2,
    emotionalFatigue: 1,
  },

  // ── Q4: 가장 지치게 만드는 것 ─────────────────────────────────────
  // failing_to_let_go+mind_keeps_returning → cant_move_on (expectationFold:3, shakeIntensity:2)
  confirmed_one_sided: {
    shakeIntensity: 2,
    emotionalFatigue: 1,
  },
  prolonged_ambiguity: {
    clarityHunger: 2,
    emotionalFatigue: 1,
  },
  exhausted_by_my_own_interpretation: {
    interpretiveLoop: 2,
    emotionalFatigue: 3,
  },
  pressure_to_decide_soon: {
    actionImminence: 3,
    clarityHunger: 1,
  },
  cant_move_on: {
    expectationFold: 3,
    shakeIntensity: 2,
  },

  // ── Q5: 진짜 원하는 것 ────────────────────────────────────────────
  // want_expression+want_direction → want_clarity_from_other (clarityHunger:3, shakeIntensity:1)
  want_clarity_from_other: {
    clarityHunger: 3,
    shakeIntensity: 1,
  },
  want_to_know_their_heart: {
    interpretiveLoop: 2,
    clarityHunger: 2,
  },
  want_to_act_and_decide: {
    actionImminence: 3,
    clarityHunger: 2,
  },
  want_time_to_fold: {
    expectationFold: 3,
    emotionalFatigue: 2,
  },
  want_possibility: {
    shakeIntensity: 3,
    expectationFold: 1,
  },
};

// ── Translation Rules (Compound) ──────────────────────────────────
// 7개 subtype을 차원 조합으로 식별한다.
// priority 1 = 2차원 조합으로 정확하게 식별되는 subtype (우선 발화)
// priority 2 = 단일 차원의 강한 신호로 식별되는 subtype
// priority 3 = 점진적 상태
//
// translator.ts는 priority 오름차순으로 정렬 후 최대 4개 statement를 선택한다.
// 같은 groupKey는 dedup되어 1개만 살아남는다.
export const LOVE_1_TRANSLATION_RULES: StateTranslationRule[] = [
  // ── priority 1: 정밀 식별 subtype ────────────────────────────────
  {
    groupKey: "strong_shake",
    priority: 1,
    conditions: [{ dimension: "shakeIntensity", threshold: 5 }],
    statement: "상대의 사소한 반응 하나가 너의 하루 전체를 흔들고 있다.",
  },
  {
    groupKey: "confession_imminent",
    priority: 1,
    conditions: [
      { dimension: "actionImminence", threshold: 4 },
      { dimension: "clarityHunger", threshold: 3 },
    ],
    statement:
      "곧 무언가 결정해야 한다는 감각 위에서, 마지막으로 한 번만 더 확신을 받고 싶어진다.",
  },
  {
    groupKey: "lingering_after_end",
    priority: 1,
    conditions: [
      { dimension: "expectationFold", threshold: 4 },
      { dimension: "shakeIntensity", threshold: 3 },
    ],
    statement: "이미 끝났다고 정리했던 마음이, 자꾸 흔들림으로 돌아오고 있다.",
  },

  // ── priority 2: 단일 차원 핵심 subtype ───────────────────────────
  {
    groupKey: "clarity_hungry",
    priority: 2,
    conditions: [{ dimension: "clarityHunger", threshold: 4 }],
    statement:
      "지금 너에게 필요한 건 상대의 마음 자체보다, 이 관계가 무엇인지에 대한 분명한 답이다.",
  },
  {
    groupKey: "interpretive_loop",
    priority: 2,
    conditions: [{ dimension: "interpretiveLoop", threshold: 4 }],
    statement:
      "같은 대화와 같은 장면을 계속 다시 보면서, 의미를 끊임없이 다시 짜고 있다.",
  },
  {
    groupKey: "burnout",
    priority: 2,
    conditions: [{ dimension: "emotionalFatigue", threshold: 4 }],
    statement:
      "흔들림이 너무 오래 이어져서, 이제는 의미를 찾는 것조차 지쳐가고 있다.",
  },

  // ── priority 3: 점진적 상태 subtype ───────────────────────────────
  {
    groupKey: "folding_expectation",
    priority: 3,
    conditions: [
      { dimension: "expectationFold", threshold: 3 },
      { dimension: "emotionalFatigue", threshold: 2 },
    ],
    statement:
      "기대의 자리를 천천히 좁히고 있지만, 완전히 닫지는 못한 상태에 있다.",
  },
];

// ── Additional Readings (루프 리딩) ──────────────────────────────────
// 무료+유료 결과를 다 읽은 뒤 추가 구매하는 후속 리딩 3종.
// 순서는 고정. trigger_dimension/threshold는 love-1에서 미사용.
// subtype 차이는 기존 stateSummary + scene carry_over에서 자연스럽게 반영된다.
export const LOVE_1_ADDITIONAL_READINGS: AdditionalReading[] = [
  {
    id: "what_i_can_do",
    loopType: "action",
    title: "지금 내가 뭘 하면 될까?",
    subtitle: "기다리거나, 확인하거나, 멈추거나 — 지금 가능한 선택의 범위",
  },
  {
    id: "my_standard",
    loopType: "standard",
    title: "내 기준을 단단히 세우는 법",
    subtitle: "언제 기다리고, 언제 멈추는지를 내가 먼저 정해야 하는 이유",
  },
  {
    id: "keep_watching",
    loopType: "evaluate",
    title: "이 관계를 더 두고 봐도 될까?",
    subtitle: "에너지를 더 쓸 가치가 있는지 판단하는 기준",
  },
];

const love1Pack: ContentPack = {
  contentId: "love-1",
  dimensions: [...LOVE_1_DIMENSIONS],
  scoreMap: LOVE_1_SCORE_MAP,
  translationRules: LOVE_1_TRANSLATION_RULES,
  additionalReadings: LOVE_1_ADDITIONAL_READINGS,
};

export default love1Pack;
