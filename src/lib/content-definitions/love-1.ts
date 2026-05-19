import type { ContentDefinition } from "@/lib/types/content-definition";
import type {
  AdditionalReading,
  ContentPack,
  StateTranslationRule,
} from "@/lib/types/quiz";

export const LOVE_1_DIMENSIONS = [
  "shakeIntensity",
  "clarityHunger",
  "interpretiveLoop",
  "actionImminence",
  "expectationFold",
  "emotionalFatigue",
] as const;

export type Love1Dimension = (typeof LOVE_1_DIMENSIONS)[number];

export const LOVE_1_SCORE_MAP: Record<
  string,
  Partial<Record<Love1Dimension, number>>
> = {
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

export const LOVE_1_TRANSLATION_RULES: StateTranslationRule[] = [
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

export const love1ContentPack: ContentPack = {
  contentId: "love-1",
  dimensions: [...LOVE_1_DIMENSIONS],
  scoreMap: LOVE_1_SCORE_MAP,
  translationRules: LOVE_1_TRANSLATION_RULES,
  additionalReadings: LOVE_1_ADDITIONAL_READINGS,
};

export const love1Definition: ContentDefinition = {
  id: "love-1",
  meta: {
    id: "love-1",
    title: "이 사람, \n 저를 좋아하는 걸까요?",
    subtitle: "사소한 반응에도 마음이 흔들려요",
    category: "love",
    thumbnail_url: "/img/love-1.png",
    estimated_minutes: 5,
    input_config: {
      version: 2,
      steps: [],
    },
    scene_config: {
      free_scene_count: 2,
      paid_scene_count: 4,
      scenes: [],
    },
    is_active: true,
    sort_order: 1,
    created_at: "2026-05-01T00:00:00Z",
    updated_at: "2026-05-01T00:00:00Z",
    insights: [
      "애매한 관계를 대하는 너의 방식",
      "상대의 태도에서 알 수 있는 것",
      "우리의 관계는 지금 어디쯤 있는지",
      "이 관계가 너에게 미치는 영향",
      "네가 진짜 확인하고 싶은 것",
      "이 관계, 어디까지 이어질 수 있을까?",
    ],
  },
  inputConfig: {
    version: 2,
    steps: [
      {
        id: "free_input",
        type: "freeText",
        question: "지금 네 상황을 편하게 말해줘",
        placeholder: "그 사람 이야기를 편하게 적어줘",
        example_inputs: [
          "연락은 계속 하는데 이 사람이 나를 좋아하는 건지 잘 모르겠어",
          "둘이 있으면 분위기는 좋은데, 관계를 확실히 하려는 말은 없어",
        ],
        required: true,
      },
      {
        id: "q1_situation",
        type: "singleChoice",
        question: "지금 네 상황은 어때?",
        options: [
          {
            label: "마음이 흔들리기 시작한 것 같아",
            value: "just_started_shaking",
          },
          {
            label: "좋아하는 마음보다 확인이 더 필요해졌어",
            value: "clarity_and_decide",
          },
          {
            label: "상대와 나눈 대화를 계속 다시 보고 있어",
            value: "replaying_conversations",
          },
          {
            label: "이제는 기대를 줄여야 할 것 같아",
            value: "fading_with_fatigue",
          },
          {
            label: "관계는 끝난 것 같은데 포기가 안돼",
            value: "cant_let_go_after_end",
          },
        ],
        required: true,
      },
      {
        id: "q2_partner_attitude",
        type: "singleChoice",
        question: "상대의 태도는 어때?",
        options: [
          {
            label: "마음은 있는 것 같은데 확실한 표현이 없어",
            value: "emotion_without_clarity",
          },
          {
            label: "다가왔다가 다시 거리를 둬",
            value: "inconsistent_interest",
          },
          {
            label: "편한 관계로 두려고 해",
            value: "comfortable_without_progress",
          },
          {
            label: "신호는 있는데 딱히 결정적이진 않아",
            value: "signal_without_commitment",
          },
          {
            label: "이제는 반응 자체가 줄어들고 있어",
            value: "fading_response",
          },
        ],
        required: true,
      },
      {
        id: "q3_reaction",
        type: "multiChoice",
        question: "흔들릴 때 너는 보통 어떻게 반응해?",
        options: [
          {
            label: "괜찮은 척하면서 혼자 계속 생각해",
            value: "looping_inside",
          },
          {
            label: "작은 반응에도 하루 기분이 달라져",
            value: "mood_swings_by_signal",
          },
          {
            label: "직접 묻고 싶지만 괜히 참아",
            value: "holding_back_question",
          },
          {
            label: "한 번만 더 확인하면 어느쪽이든 결론이 날 거 같아",
            value: "one_more_check_then_decide",
          },
          {
            label: "이제 의미 부여를 줄이려고 노력해",
            value: "trying_to_detach",
          },
        ],
        required: true,
      },
      {
        id: "q4_exhaustion",
        type: "singleChoice",
        question: "이 관계에서 너를 가장 지치게 만드는 건 뭐야?",
        options: [
          {
            label: "나만 더 깊게 마음 쓰고 있는 것",
            value: "confirmed_one_sided",
          },
          {
            label: "이 애매한 상태가 길어지는 것",
            value: "prolonged_ambiguity",
          },
          {
            label: "상대의 반응을 매번 해석하고 있는 나 자신",
            value: "exhausted_by_my_own_interpretation",
          },
          {
            label: "언젠가는 답을 내야 할 것 같은 분위기",
            value: "pressure_to_decide_soon",
          },
          {
            label: "정리하려 해도 다시 마음이 돌아가는 것",
            value: "cant_move_on",
          },
        ],
        required: true,
      },
      {
        id: "q5_desire",
        type: "singleChoice",
        question: "솔직히 지금\n가장 원하는 건 뭐야?",
        options: [
          {
            label: "상대가 이 관계를 확실히 해줬으면",
            value: "want_clarity_from_other",
          },
          {
            label: "상대 마음이 어떤지 정확히 알고 싶어",
            value: "want_to_know_their_heart",
          },
          {
            label: "더 미루지 않고 뭐든 결론내고 싶어",
            value: "want_to_act_and_decide",
          },
          {
            label: "당분간은 이 관계를 덜 생각하고 싶어",
            value: "want_time_to_fold",
          },
          {
            label: "솔직히 아직은 끝난 관계가 아니길",
            value: "want_possibility",
          },
        ],
        required: true,
      },
    ],
  },
  sceneConfig: {
    free_scene_count: 2,
    paid_scene_count: 4,
    scenes: [
      {
        index: 1,
        title: "애매한 관계를 대하는 너의 방식",
        role: "relationship_tendency",
        goal: "사용자가 현재 관계 안에서 어떤 방식으로 흔들리고 반응하는 사람인지 읽어준다. 읽자마자 자기 성향을 들킨 느낌이 들어야 한다.",
        focus: [
          "사용자가 관계에서 어떤 반응에 특히 예민하게 흔들리는 사람인지",
          "확신이 없는 상황에서 감정을 어떤 방식으로 처리하는지",
          "관계를 확인하려고 할 때 반복하게 되는 반응 방식",
          "애매하거나 불안한 상황에서 무엇을 더 붙잡으려 하는지",
        ],
        forbidden: [
          "사용자 입력을 다시 요약하지 않는다",
          "답장/말투 같은 표현을 그대로 반복하지 않는다",
          "상대 마음을 단정하지 않는다",
          "유료 hook을 만들지 않는다",
          "흐름/구조/패턴 같은 추상 단어를 사용하지 않는다",
          "불안형/회피형 같은 심리 라벨을 직접 사용하지 않는다",
        ],
        tone: "사용자의 기본 연애 성향과 감정 반응 방식을 직접 읽어주는 느낌",
        is_free: true,
      },
      {
        index: 2,
        title: "상대의 태도에서 알 수 있는 것",
        role: "partner_signal_reading",
        goal: "사용자의 자유입력과 선택지를 바탕으로, 상대가 이 관계를 어떤 태도로 대하고 있는지 해석한다. 단정적으로 좋아한다/아니다를 말하지는 않지만, 상대의 행동이 어떤 가능성과 한계를 동시에 보여주는지 짚는다.",
        focus: [
          "상대가 관계를 분명하게 만들고 있는지, 애매하게 유지하고 있는지",
          "상대의 말과 행동이 얼마나 일치하는지",
          "상대가 다가오는 방식과 물러나는 방식",
          "이 관계가 실제로 진전되고 있는지, 같은 자리에서 반복되고 있는지",
        ],
        forbidden: [
          "사용자가 고른 선택지를 그대로 반복하지 않는다",
          "상대를 나쁜 사람처럼 몰아가지 않는다",
          "유료 scene 핵심 결론을 미리 말하지 않는다",
          "흐름/구조/패턴 같은 추상 단어를 사용하지 않는다",
        ],
        tone: "상대 태도에서 보이는 가능성과 한계를 분명하게 읽어준다",
        is_free: true,
      },
      {
        index: 3,
        title: "우리의 관계는 지금 어디쯤 있는지",
        role: "relationship_possibility",
        goal: "이 관계가 좋아하는 감정 위에 있는지, 익숙함이나 애매함 위에 있는지 가능성을 해석한다. 사용자가 가장 궁금해하는 '그래서 이 사람 마음이 있는가'에 대해 조심스럽지만 분명한 방향성을 준다.",
        focus: [
          "상대에게 감정이 있어 보이는 지점",
          "하지만 관계를 분명히 하지 않는 지점",
          "호감과 책임감 사이의 차이",
          "이 관계가 앞으로 선명해질 가능성과 애매하게 남을 가능성",
        ],
        forbidden: [
          "상대 마음을 100% 단정하지 않는다",
          "좋아한다/안 좋아한다 하나로 단순화하지 않는다",
          "미래를 확정적으로 예언하지 않는다",
          "바로 행동 지시를 하지 않는다",
        ],
        tone: "상대 마음의 가능성과 한계를 반쯤 리딩하듯이 읽어준다",
        is_free: false,
      },
      {
        index: 4,
        title: "이 관계가 나에게 미치는 영향",
        role: "emotional_effect",
        goal: "현재 관계가 사용자 감정과 기준에 어떤 영향을 주고 있는지 보여준다.",
        focus: [
          "상대 반응이 사용자 감정에 어떤 영향을 주고 있는지",
          "관계를 유지하는 동안 사용자가 반복하게 되는 감정 변화",
          "사용자가 스스로를 어떤 방식으로 버티게 만들고 있는지",
          "이 관계 안에서 사용자의 기준이나 감정이 어떻게 달라지고 있는지",
        ],
        forbidden: [
          "상대를 악역처럼 만들지 않는다",
          "과거 원인 분석으로 되돌아가지 않는다",
          "최종 선택을 대신하지 않는다",
        ],
        tone: "애매한 관계가 사용자 감정에 남기는 영향을 현실적으로 보여준다",
        is_free: false,
      },
      {
        index: 5,
        title: "네가 진짜 확인하고 싶은 것",
        role: "hidden_expectation",
        goal: "사용자가 이 관계에서 진짜 확인하고 싶은 것이 무엇인지 보여준다. 그 대상은 상대의 마음, 관계의 의미, 자신의 해석이 틀리지 않았다는 감각, 아직 끝나지 않았다는 가능성, 혹은 이제 결정해도 된다는 근거일 수 있다. 모든 경우를 '선택받고 싶음'이나 '사랑받고 싶음'으로 환원하지 않는다.",
        focus: [
          "사용자가 진짜 확인받고 싶은 대상이 무엇인지",
          "상대의 표현보다 더 붙잡고 있는 감정이나 근거가 있는지",
          "이 관계를 통해 자신의 해석·기대·결정 중 무엇을 확인하려 하는지",
          "확인을 받은 뒤 사용자가 무엇을 할 수 있게 되는지",
        ],
        forbidden: [
          "모든 욕구를 선택받고 싶음으로 환원하지 않는다",
          "사랑받고 싶다/선택받고 싶다를 기본 결론으로 쓰지 않는다",
          "상대 반응 분석으로만 돌아가지 않는다",
          "희망고문처럼 쓰지 않는다",
          "정답처럼 결론내리지 않는다",
        ],
        tone: "사용자가 이 관계에서 무엇을 확인받아야 다음 감정으로 넘어갈 수 있는지 선명하게 짚는다",
        is_free: false,
      },
      {
        index: 6,
        title: "이 관계, 어디까지 이어질 수 있을까?",
        role: "relationship_direction",
        goal: "현재 관계가 어떤 방향으로 이어질 가능성이 큰지 보여준다. 상대 태도와 사용자 감정을 함께 읽어서, 이 관계가 어디에서 계속 흔들리고 있는지 해석한다.",
        focus: [
          "상대가 관계를 얼마나 분명하게 가져가고 있는지",
          "이 관계가 계속 애매함 위에서 유지될 가능성이 있는지",
          "사용자가 계속 감당하게 될 감정이 무엇인지",
          "지금 관계가 선명해질 가능성과 흐려질 가능성",
        ],
        forbidden: [
          "헤어져라/고백해라처럼 단정하지 않는다",
          "앞 내용 반복만 하지 않는다",
          "얕은 위로로 끝내지 않는다",
        ],
        tone: "미래를 단정하지는 않지만, 관계 방향성은 분명하게 읽어준다",
        is_free: false,
      },
    ],
  },
  contentPack: love1ContentPack,
};
