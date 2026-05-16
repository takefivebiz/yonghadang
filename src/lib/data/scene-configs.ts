import { SceneConfig } from "@/lib/types/content";

// TODO: [백엔드 연동] 더미데이터를 GET /api/contents/[id] 응답의 scene_config로 교체
// 각 콘텐츠는 고유한 narrative progression을 가진다.
// Claude는 scene별 role/goal/focus/tone을 참고해 결과를 생성한다.

export const DUMMY_SCENE_CONFIGS: Record<string, SceneConfig> = {
  "love-1": {
    free_scene_count: 2,
    paid_scene_count: 4,

    scenes: [
      {
        index: 1,
        title: "너는 애매할수록\n더 작은 신호에 흔들려",
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
        title: "그 사람은 마음보다\n확신을 아끼고 있어",
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
        title: "좋아하는 마음과\n책임지는 마음은 달라",
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
        title: "애매함은 결국\n네 감정을 쓰게 만들어",
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
        title: "네가 바란 건\n사랑보다 확실한 태도야",
        role: "hidden_expectation",
        goal: "사용자가 이 관계에서 진짜 기대하고 있는 것이 무엇인지 보여준다. 단순히 사랑받고 싶은 건지, 선택받고 싶은 건지, 관계를 확신받고 싶은 건지 드러낸다.",
        focus: [
          "사용자가 상대에게 진짜 바라고 있는 반응이나 태도",
          "왜 상대의 확실한 표현이나 행동이 중요하게 느껴지는지",
          "사랑 자체보다 더 붙잡고 있는 감정이 있는지",
          "사용자가 이 관계를 통해 얻고 싶어하는 감정",
        ],
        forbidden: [
          "상대 반응 분석으로만 돌아가지 않는다",
          "희망고문처럼 쓰지 않는다",
          "정답처럼 결론내리지 않는다",
        ],
        tone: "사용자가 상대에게 진짜 바라고 있던 것을 스스로 부정하기 어렵게 만든다",
        is_free: false,
      },

      {
        index: 6,
        title: "이 관계는 선명해지거나\n계속 너를 흔들 거야",
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
};

// ── 기본 템플릿 (설정되지 않은 콘텐츠용) ────────────────────────────
const DEFAULT_SCENE_CONFIG: SceneConfig = {
  free_scene_count: 2,
  paid_scene_count: 4,
  scenes: [
    {
      index: 1,
      title: "현재 감정 인식",
      role: "state_definition",
      goal: "사용자가 현재 경험하는 감정과 상황을 명확히 인식하게 한다",
      focus: ["현재 상태", "발생 맥락", "감정의 강도"],
      tone: "판단 없이, 현재 상태를 있는 그대로 인정한다",
      is_free: true,
    },
    {
      index: 2,
      title: "감정 패턴 자각",
      role: "pattern_recognition",
      goal: "반복되는 감정 또는 행동 패턴을 인식시킨다",
      focus: ["반복 패턴", "공통 자극", "패턴의 지속 기간"],
      tone: "패턴을 인식시키되, 의지 문제가 아님을 암시한다",
      is_free: true,
    },
    {
      index: 3,
      title: "왜 반복되는지",
      role: "mechanism_reveal",
      goal: "패턴이 반복되는 구조적 이유를 드러낸다",
      focus: ["반복 구조", "과거 학습", "패턴의 기원"],
      tone: "과거를 탓하지 않고, 구조로 설명한다",
      is_free: false,
    },
    {
      index: 4,
      title: "관계 구조",
      role: "relationship_dynamic",
      goal: "사용자의 감정이 타인 또는 상황과 어떻게 상호작용하는지를 보여준다",
      focus: ["상호작용 패턴", "의도와 결과의 간극", "관계 내 위치"],
      tone: "비판 없이, 구조를 보여주는 방식으로",
      is_free: false,
    },
    {
      index: 5,
      title: "이후 흐름",
      role: "future_projection",
      goal: "현재 패턴이 바뀌지 않으면 어떤 결과가 올지를 명확히 한다",
      focus: ["패턴의 이식성", "변화 없을 때의 결과", "자각의 의미"],
      tone: "예측은 하되, 변화 가능성으로 마무리한다",
      is_free: false,
    },
    {
      index: 6,
      title: "선택 기준",
      role: "action_direction",
      goal: "다음에 같은 상황이 올 때 할 수 있는 최소 행동 하나를 제시한다",
      focus: ["즉각 실행 가능한 행동", "작은 시작", "선택의 의미"],
      tone: "크게 바꾸려 하지 말고, 작은 것부터. 가볍고 실천 가능하게",
      is_free: false,
    },
  ],
};

// TODO: [백엔드 연동] content_id로 GET /api/contents/[id]를 호출해 scene_config 반환
export const getSceneConfig = (contentId: string): SceneConfig => {
  return DUMMY_SCENE_CONFIGS[contentId] ?? DEFAULT_SCENE_CONFIG;
};
