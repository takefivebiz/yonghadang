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
        title: "의뢰 접수",
        subtitle: "지금 이 관계 안에서 \n너의 감정 상태",
        role: "case_intake",
        goal: "의뢰자가 남긴 기록의 감정적 전제를 접수한다. 이 사람이 나를 좋아하는지에 대한 표면 질문보다, 의뢰자가 왜 확인을 필요로 하는 상태인지 조용히 잡는다.",
        focus: [
          "의뢰자가 지금 확인하려는 대상이 무엇인지",
          "애매한 관계 앞에서 생긴 감정적 긴장",
          "기록 초반부터 드러나는 모순, 불확실성, 흔들림",
          "의뢰자가 이 관계를 의뢰로 남기게 된 감정 상태",
        ],
        forbidden: [
          "의뢰자 입력을 다시 요약하지 않는다",
          "의뢰자의 성향을 단정하지 않는다",
          "바로 조언하지 않는다",
          "상대 마음을 단정하지 않는다",
          "따뜻한 상담 도입처럼 쓰지 않는다",
          "불안형/회피형 같은 심리 라벨을 직접 사용하지 않는다",
        ],
        tone: "가장 가까운 거리감의 조용한 의뢰 접수 기록",
        is_free: true,
      },
      {
        index: 2,
        title: "현장 기록",
        subtitle: "너는 여기서 \n 어떤 의미를 찾고 있을까?",
        role: "field_record",
        goal: "의뢰자의 기록에서 반복되는 감정 행동을 현장 기록처럼 정리하되, 그 행동이 결국 어떤 의미를 찾기 위해 반복되는지 드러낸다. 상대의 마음을 판정하기보다, 의뢰자가 애매한 반응 안에서 관계의 위치, 남아 있는 가능성, 상대의 반응이 가진 의미를 어떻게 찾고 있는지 기록한다.",
        focus: [
          "의뢰자가 계속 다시 확인하는 말투, 답장, 행동 같은 신호",
          "상대 반응을 다시 읽고 의미를 붙이는 방식",
          "의뢰자가 그 반응 안에서 찾으려는 관계의 위치나 가능성",
          "직접 묻지 않고 반응을 살피거나 참는 행동",
          "사소한 반응이 단서처럼 오래 남는 지점",
          "확답 대신 상대의 작은 반응으로 관계의 위치를 가늠하는 장면",
        ],
        forbidden: [
          "의뢰자가 고른 선택지를 그대로 반복하지 않는다",
          "상대를 좋다/나쁘다로 판정하지 않는다",
          "유료 scene 핵심 결론을 미리 말하지 않는다",
          "입력을 요약문처럼 다시 말하지 않는다",
          "채팅 답변처럼 쓰지 않는다",
          "시간, 요일, 횟수처럼 의뢰자가 입력하지 않은 구체 데이터를 만들지 않는다",
          "구조/흐름/상태 같은 추상어만으로 설명하지 않는다",
          "반복 행동만 나열하고 의뢰자가 찾고 있는 의미를 빠뜨리지 않는다",
        ],
        tone: "행동 단서에서 시작해 그 행동이 찾는 의미까지 조용히 회수하는 현장 기록",
        is_free: true,
      },
      {
        index: 3,
        title: "단서 분석",
        subtitle: "상대는 왜 관계를\n 분명히 하지 않을까?",
        role: "clue_analysis",
        goal: "표면 기록 뒤에서 반복되는 감정 단서를 관찰자 시점으로 분석한다. 상대가 관계를 분명히 하지 않는 지점을 증명하려 하기보다, 그 애매함이 의뢰자에게 어떤 단서로 작동하는지 살핀다.",
        focus: [
          "반복되는 해석과 확인 욕구",
          "상대의 모호한 반응이 단서처럼 남는 방식",
          "사소한 반응에 오래 머무는 이유",
          "의뢰자의 주의가 계속 돌아가는 지점",
        ],
        forbidden: [
          "상대 마음을 증명하려 하지 않는다",
          "단서를 증거처럼 단정하지 않는다",
          "좋아한다/안 좋아한다로 단순화하지 않는다",
          "추리소설식 표현을 쓰지 않는다",
          "행동 지시를 하지 않는다",
        ],
        tone: "가장 관찰자적이고 거리감 있는 분석 기록",
        is_free: false,
      },
      {
        index: 4,
        title: "상황 추리",
        subtitle: "우리는 왜 계속 이런 흐름에 \n 머물게 되는 걸까?",
        role: "situation_inference",
        goal: "이 관계가 왜 쉽게 정리되지 않는지, 감정 루프가 어떻게 작동하는지 추론한다. 의뢰자와 상대의 행동을 판정하지 않고, 현재 상황이 유지되는 구조를 보여준다.",
        focus: [
          "관계가 애매하게 유지되는 구조",
          "의뢰자가 붙잡고 있는 감정적 근거",
          "결정하거나 단순화하지 못하게 만드는 조건",
          "이 관계 안에서 반복되는 감정 루프",
        ],
        forbidden: [
          "상대를 악역처럼 만들지 않는다",
          "행동을 지시하지 않는다",
          "궁합이나 미래 예측처럼 쓰지 않는다",
          "최종 선택을 대신하지 않는다",
          "과거 원인 분석으로 되돌아가지 않는다",
        ],
        tone: "연결과 추리 중심의 보고서 톤",
        is_free: false,
      },
      {
        index: 5,
        title: "핵심 추리",
        subtitle: "네가 끝까지 확인하고 싶었던 \n진짜 질문",
        role: "core_inference",
        goal: "리포트의 가장 밀도 높은 핵심 해석을 제시한다. 의뢰자가 표면적으로 묻는 질문 아래에 있는 진짜 확인 대상을 좁혀 잡는다.",
        focus: [
          "표면 질문 아래에 있는 숨은 질문",
          "의뢰자의 행동과 두려움이 만나는 지점",
          "끝까지 확인하고 싶어 하는 감정의 핵심",
          "관계보다 의뢰자의 기준이 흔들리는 지점",
        ],
        forbidden: [
          "앞선 관찰을 반복하지 않는다",
          "새로운 갈래를 과도하게 추가하지 않는다",
          "모든 욕구를 선택받고 싶음으로 환원하지 않는다",
          "사랑받고 싶다/선택받고 싶다를 기본 결론으로 쓰지 않는다",
          "위로로 핵심 판단을 흐리지 않는다",
          "정답처럼 결론내리지 않는다",
        ],
        tone: "짧고 밀도 높은 핵심 보고",
        is_free: false,
      },
      {
        index: 6,
        title: "최종 보고",
        subtitle: "이 관계는 결국 \n어디까지 이어질 수 있을까?",
        role: "final_report",
        goal: "정답을 내리지 않고, 이 기록에서 확인된 감정 흐름과 이후 관찰 지점을 정리한다. 관계가 어디까지 이어질지 예측하기보다, 이 관계가 의뢰자에게 남기는 방향성을 보고서처럼 닫는다.",
        focus: [
          "지금까지 드러난 감정 움직임",
          "이후에도 관찰해야 할 기준",
          "아직 해결되지는 않았지만 형태가 생긴 문제",
          "의뢰자가 다음에 확인해야 할 감정의 방향",
        ],
        forbidden: [
          "미래를 확정하지 않는다",
          "헤어져라/고백해라처럼 단정하지 않는다",
          "동기부여 문장으로 끝내지 않는다",
          "일반 요약으로 마무리하지 않는다",
          "감정적 해결을 과하게 약속하지 않는다",
        ],
        tone: "조용한 최종 보고, 정답보다 이후 관찰 포인트를 남기는 톤",
        is_free: false,
      },
    ],
  },
  contentPack: love1ContentPack,
};
