import type {
  ContentPack,
  StateTranslationRule,
  AdditionalReading,
} from "@/lib/types/quiz";

export const LOVE_1_DIMENSIONS = [
  "anxiety",
  "overInterpretation",
  "confirmationNeed",
  "imbalanceSensitivity",
  "relationshipPotential",
  "ambiguityRisk",
] as const;

export type Love1Dimension = (typeof LOVE_1_DIMENSIONS)[number];

export const LOVE_1_SCORE_MAP: Record<
  string,
  Partial<Record<Love1Dimension, number>>
> = {
  undefined_but_close: {
    confirmationNeed: 2,
    relationshipPotential: 1,
    ambiguityRisk: 1,
  },
  push_pull: {
    anxiety: 2,
    ambiguityRisk: 2,
    relationshipPotential: 1,
  },
  stagnant_connection: {
    confirmationNeed: 1,
    ambiguityRisk: 2,
  },
  one_sided_energy: {
    imbalanceSensitivity: 2,
    anxiety: 1,
  },

  emotion_without_clarity: {
    relationshipPotential: 2,
    confirmationNeed: 2,
    ambiguityRisk: 1,
  },
  comfortable_without_progress: {
    ambiguityRisk: 2,
    imbalanceSensitivity: 1,
  },
  inconsistent_interest: {
    anxiety: 2,
    ambiguityRisk: 2,
    relationshipPotential: 1,
  },
  guarded_behavior: {
    overInterpretation: 2,
    confirmationNeed: 1,
    ambiguityRisk: 1,
  },

  rechecking_signals: {
    overInterpretation: 2,
    anxiety: 1,
  },
  silent_overthinking: {
    overInterpretation: 2,
    anxiety: 1,
  },
  emotionally_affected: {
    anxiety: 2,
    imbalanceSensitivity: 1,
  },
  holding_back: {
    confirmationNeed: 1,
    anxiety: 1,
  },
  difficulty_letting_go: {
    anxiety: 1,
    relationshipPotential: 1,
    imbalanceSensitivity: 1,
  },

  fear_one_sided: {
    imbalanceSensitivity: 2,
    anxiety: 1,
  },
  fear_stagnation: {
    ambiguityRisk: 2,
    confirmationNeed: 1,
  },
  fear_disappointment: {
    anxiety: 2,
    relationshipPotential: 1,
  },
  fear_exhaustion: {
    anxiety: 1,
    imbalanceSensitivity: 1,
    ambiguityRisk: 1,
  },

  want_expression: {
    confirmationNeed: 2,
    relationshipPotential: 1,
  },
  want_direction: {
    confirmationNeed: 1,
    ambiguityRisk: 2,
  },
  want_stability: {
    anxiety: 2,
  },
  want_possibility: {
    relationshipPotential: 2,
    anxiety: 1,
  },
};

export const LOVE_1_TRANSLATION_RULES: StateTranslationRule[] = [
  {
    dimension: "anxiety",
    threshold: 4,
    priority: 1,
    statement: "상대 반응 하나에도 마음이 크게 흔들리는 편이다.",
  },
  {
    dimension: "overInterpretation",
    threshold: 3,
    priority: 2,
    statement: "작은 말투나 태도에서도 관계의 의미를 찾으려는 경향이 있다.",
  },
  {
    dimension: "confirmationNeed",
    threshold: 3,
    priority: 3,
    statement: "상대의 마음보다 확실한 표현과 태도를 더 필요로 한다.",
  },
  {
    dimension: "imbalanceSensitivity",
    threshold: 3,
    priority: 4,
    statement: "나만 더 마음이 큰 건 아닌지 예민하게 느끼는 편이다.",
  },
  {
    dimension: "relationshipPotential",
    threshold: 3,
    priority: 5,
    statement: "이 관계에 아직 가능성이 남아 있기를 바라는 마음이 크다.",
  },
  {
    dimension: "ambiguityRisk",
    threshold: 3,
    priority: 6,
    statement: "상대가 관계를 분명히 하지 않는 지점에 마음이 걸려 있다.",
  },
];

export const LOVE_1_ADDITIONAL_READINGS: AdditionalReading[] = [
  {
    id: "why_keep_ambiguous",
    title: "이 사람 마음은 도대체 뭘까?",
    subtitle: "여지는 주는데 관계를 정리하지 않는 심리",
    trigger_dimension: "ambiguityRisk",
    trigger_threshold: 3,
  },
  {
    id: "what_if_i_make_a_move",
    title: "내가 먼저 결단하면 무슨 일이 생길까?",
    subtitle: "묻거나, 멈추거나, 거리를 둘 때 달라지는 것",
    trigger_dimension: "confirmationNeed",
    trigger_threshold: 3,
  },
  {
    id: "why_am_i_lower_position",
    title: "나는 언제부터 이렇게 을의 연애를 했지?",
    subtitle: "기다리고 맞추는 쪽이 되어버린 이유",
    trigger_dimension: "imbalanceSensitivity",
    trigger_threshold: 3,
  },
  {
    id: "how_can_i_change_now",
    title: "지금 당장 뭘 해야 내가 달라질까?",
    subtitle: "흔들리는 쪽에서 선택하는 쪽으로 가는 방법",
    trigger_dimension: "anxiety",
    trigger_threshold: 3,
  },
  {
    id: "how_to_set_my_standard",
    title: "기준을 어떻게 세워야 마음이 편해질까?",
    subtitle: "기다릴지, 확인할지, 멈출지 정하는 기준",
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
