import { InputConfig } from "@/lib/types/content";

// ── 콘텐츠별 입력 설정 더미 데이터 ──────────────────────────────────
// TODO: [백엔드 연동] 더미데이터를 GET /api/contents/[id] 응답의 input_config로 교체

export const DUMMY_INPUT_CONFIGS: Record<string, InputConfig> = {
  "love-1": {
    placeholder: "지금 상황을 편하게 적어줘",
    example_inputs: [
      "자꾸 상대가 의심되고, 확인하면 안 되는 걸 알면서도 휴대폰이나 SNS를 보게 돼.",
      "상대에게서 연락이 오지 않으면 불안해서 자꾸 먼저 찾아가거나 연락해.",
      "이 사람 없이는 불안하고, 그래서 매번 상대의 행동을 확인하고 싶은 마음이 커.",
    ],
    questions: [
      {
        index: 1,
        text: "이런 행동이 \n 얼마나 자주 일어나?",
        type: "single",
        options: [
          { label: "거의 매일", value: "daily" },
          { label: "주 3-4회 이상", value: "frequent" },
          { label: "주 1-2회 정도", value: "sometimes" },
          { label: "가끔씩", value: "rarely" },
        ],
      },
      {
        index: 2,
        text: "이 상황이 \n얼마나 오래됐어?",
        type: "single",
        options: [
          { label: "최근 몇 주", value: "recent" },
          { label: "수 개월", value: "months" },
          { label: "1년 이상", value: "year" },
          { label: "처음부터", value: "longterm" },
        ],
      },
      {
        index: 3,
        text: "상대의 반응은 \n어떤 편이야?",
        type: "single",
        options: [
          { label: "잘 대응해줌", value: "responsive" },
          { label: "가끔 대응해줌", value: "sometimes_responsive" },
          { label: "짜증내거나 피함", value: "frustrated" },
          { label: "잘 모르겠음", value: "unclear" },
        ],
      },
      {
        index: 4,
        text: "이런 마음이 들 때 \n 주로 어떻게 해?",
        type: "multiple",
        options: [
          { label: "상대 확인하기 (연락, 위치 등)", value: "check" },
          { label: "마음을 참으려고 함", value: "suppress" },
          { label: "상대에게 바로 말함", value: "confront" },
          { label: "다른 걸 하면서 참음", value: "distract" },
          { label: "혼자 있으려고 함", value: "withdraw" },
        ],
      },
      {
        index: 5,
        text: "이게 너한테 \n 미치는 영향은?",
        type: "multiple",
        options: [
          { label: "스트레스 많이 받음", value: "stress" },
          { label: "자신감 떨어짐", value: "doubt" },
          { label: "미안한 마음 생김", value: "guilt" },
          { label: "관계가 좋지 않음", value: "conflict" },
          { label: "잠을 못 자거나 불규칙함", value: "sleep" },
        ],
      },
      {
        index: 6,
        text: "과거에 비슷한 \n 경험이 있었어?",
        type: "single",
        options: [
          { label: "없음", value: "none" },
          { label: "한두 번 있었음", value: "once" },
          { label: "여러 번 반복됨", value: "frequent" },
          { label: "패턴으로 반복되는 것 같음", value: "pattern" },
        ],
      },
    ],
  },

  "love-2": {
    placeholder: "지금 상황을 편하게 적어줘",
    example_inputs: [
      "좋아하는지 외로워하는지 헷갈려. 이 사람과 함께하고 싶은 건지, 아니면 혼자가 싫어서인지 모르겠어.",
      "상대가 좋아서 시작했는데, 요즘은 관계 자체가 내 정서를 채워주기 위한 수단 같은 기분이 들어.",
    ],
    questions: [
      {
        index: 1,
        text: "지금 이 감정이 \n 언제부터 시작됐어?",
        type: "single",
        options: [
          { label: "처음부터 이런 마음이었어", value: "beginning" },
          { label: "점점 이렇게 변했어", value: "gradual" },
          { label: "최근에 갑자기 생겼어", value: "recent" },
          { label: "싸운 후부터 시작됐어", value: "conflict" },
        ],
      },
      {
        index: 2,
        text: "상대와 있을 때 \n 기분은 어때?",
        type: "multiple",
        options: [
          { label: "편하고 안정적임", value: "comfortable" },
          { label: "설렘", value: "excited" },
          { label: "긴장되거나 불안함", value: "tense" },
          { label: "공허함", value: "empty" },
          { label: "의무감을 느낌", value: "obligated" },
        ],
      },
      {
        index: 3,
        text: "상대와 헤어질 때는 \n 어떤 감정이 들어?",
        type: "single",
        options: [
          { label: "한숨이 쉬어짐", value: "relief" },
          { label: "슬픔", value: "sad" },
          { label: "공허함", value: "empty" },
          { label: "불안함", value: "anxious" },
        ],
      },
      {
        index: 4,
        text: "혼자 있는 시간은 어때?",
        type: "single",
        options: [
          { label: "평화로움", value: "peaceful" },
          { label: "따분함", value: "bored" },
          { label: "외로움", value: "lonely" },
          { label: "홀가분함", value: "relieved" },
        ],
      },
      {
        index: 5,
        text: "상대의 어떤 점이 좋아?",
        type: "multiple",
        options: [
          { label: "성격이나 가치관", value: "personality" },
          { label: "외모", value: "appearance" },
          { label: "함께하면 편함", value: "comfort" },
          { label: "나를 인정해줌", value: "validation" },
          { label: "항상 있어줌", value: "availability" },
        ],
      },
      {
        index: 6,
        text: "이 관계가 없어졌을 때를 \n 상상해보면?",
        type: "single",
        options: [
          { label: "정말 슬플 것 같음", value: "sad" },
          { label: "오히려 홀가분할 것 같음", value: "relieved" },
          { label: "큰 공허함을 느낄 것 같음", value: "empty" },
          { label: "크게 상관없을 것 같음", value: "neutral" },
        ],
      },
    ],
  },

  "rel-1": {
    placeholder: "관계에서 '을'이 되는 상황을 설명해줘",
    example_inputs: [
      "항상 상대의 의견에 맞춰주고, 내 생각을 잘 말하지 않아. 그래서 자꾸만 상대가 나를 무시하는 것 같은 기분이 들어.",
      "대화할 때 항상 내 말이 먼저 끝나고, 상대가 리드하는 형태가 돼. 결정도 상대가 주도적으로 해.",
    ],
    questions: [
      {
        index: 1,
        text: "이런 상황이 주로 \n 어떤 관계에서 일어나?",
        type: "multiple",
        options: [
          { label: "연애 관계", value: "romantic" },
          { label: "친구", value: "friend" },
          { label: "가족", value: "family" },
          { label: "직장", value: "work" },
          { label: "거의 모든 관계에서", value: "all" },
        ],
      },
      {
        index: 2,
        text: "상대가 너를 \n 무시한다고 느끼는 순간은?",
        type: "multiple",
        options: [
          { label: "내 의견을 무시할 때", value: "opinion" },
          { label: "내 시간을 함부로 할 때", value: "time" },
          { label: "내 요청을 거절할 때", value: "request" },
          { label: "말투가 무례할 때", value: "tone" },
          { label: "우선순위에서 나를 뒤로 할 때", value: "behavior" },
        ],
      },
      {
        index: 3,
        text: "이런 상황에서 \n 너는 보통 어떻게 반응해?",
        type: "single",
        options: [
          { label: "더 맞춰주려고 함", value: "comply" },
          { label: "기분 나쁘지만 참음", value: "suppress" },
          { label: "거리를 둠", value: "withdraw" },
          { label: "직접 얘기함", value: "confront" },
        ],
      },
      {
        index: 4,
        text: "이렇게 느낀지는 \n 얼마나 오래됐어?",
        type: "single",
        options: [
          { label: "최근에 시작됐어", value: "recent" },
          { label: "점점 이렇게 변했어", value: "gradual" },
          { label: "예전부터 계속 그랬어", value: "longterm" },
          { label: "어릴 때부터 이런 패턴이 있었어", value: "childhood" },
        ],
      },
      {
        index: 5,
        text: "이 상황을 바꾸려고 \n 노력한 적이 있어?",
        type: "single",
        options: [
          { label: "노력해본 적 없음", value: "never" },
          { label: "시도했지만 실패했음", value: "tried_failed" },
          { label: "계속 노력 중", value: "ongoing" },
          { label: "포기했음", value: "gave_up" },
        ],
      },
    ],
  },

  "career-1": {
    placeholder: "지금 일이 자신에게 맞는지 설명해줘",
    example_inputs: [
      "일 자체는 재미있는데, 회사 문화나 인간관계 때문에 힘들어. 이직할지 말지 고민이야.",
      "처음엔 좋아했는데, 요즘은 일하면서 의욕이 안 생겨. 이게 번아웃인지, 아니면 진짜 안 맞는 일인지 모르겠어.",
    ],
    questions: [
      {
        index: 1,
        text: "일 자체는 어떤 편이야?",
        type: "single",
        options: [
          { label: "너무 재미있고 의미 있음", value: "love" },
          { label: "그럭저럭 괜찮음", value: "okay" },
          { label: "따분하고 의미 없음", value: "boring" },
          { label: "너무 힘들고 싫음", value: "hate" },
        ],
      },
      {
        index: 2,
        text: "일이 힘들다면, \n 주된 이유는?",
        type: "multiple",
        options: [
          { label: "일의 난도나 양", value: "task" },
          { label: "직장 인간관계", value: "people" },
          { label: "회사 문화나 가치관", value: "culture" },
          { label: "업무량 대비 시간", value: "work_life" },
          { label: "성장 기회 부족", value: "growth" },
        ],
      },
      {
        index: 3,
        text: "이 회사에 들어오기 전에 \n 기대했던 것과 현실은?",
        type: "single",
        options: [
          { label: "기대와 비슷함", value: "match" },
          { label: "예상보다 좋음", value: "better" },
          { label: "예상보다 못함", value: "worse" },
          { label: "기대한 것과 완전히 다름", value: "different" },
        ],
      },
      {
        index: 4,
        text: "월요일 아침이나 \n 출근 생각이 들 때는?",
        type: "single",
        options: [
          { label: "설렘", value: "excited" },
          { label: "그냥 그럼", value: "neutral" },
          { label: "싫음", value: "dread" },
          { label: "불안하거나 우울함", value: "anxiety" },
        ],
      },
      {
        index: 5,
        text: "여기서 계속 일하고 싶어?",
        type: "single",
        options: [
          { label: "계속하고 싶음", value: "yes" },
          { label: "확실하지 않음", value: "uncertain" },
          { label: "그만두고 싶음", value: "no" },
          { label: "지금 당장이라도 나가고 싶음", value: "asap" },
        ],
      },
    ],
  },

  "emotion-1": {
    placeholder: "공허함을 느끼는 상황을 설명해줘",
    example_inputs: [
      "뭔가 부족한 기분이 항상 있어. 좋은 일이 있어도 그 기분이 오래가지 않아.",
      "할 일도 있고, 함께할 사람도 있는데 왜인지 공허해. 이 감정을 뭐라고 표현해야 할지 모르겠어.",
    ],
    questions: [
      {
        index: 1,
        text: "이 공허함이 언제부터 시작됐어?",
        type: "single",
        options: [
          { label: "최근 몇 주", value: "recent" },
          { label: "몇 개월", value: "months" },
          { label: "1년 정도", value: "year" },
          { label: "예전부터 계속", value: "always" },
        ],
      },
      {
        index: 2,
        text: "공허함을 느낄 때는 어떤 상황이야?",
        type: "multiple",
        options: [
          { label: "혼자 있을 때", value: "alone" },
          { label: "사람들 사이에 있을 때", value: "crowd" },
          { label: "일하고 있을 때", value: "work" },
          { label: "여유 시간이 있을 때", value: "free_time" },
          { label: "시간이나 상황 상관없이", value: "always" },
        ],
      },
      {
        index: 3,
        text: "그 공허함을 채우기 위해 주로 뭘 하는 편이야?",
        type: "multiple",
        options: [
          { label: "휴대폰, SNS", value: "phone" },
          { label: "취미 활동", value: "hobby" },
          { label: "음식이나 쇼핑", value: "food" },
          { label: "사람 만나기", value: "people" },
          { label: "잠을 자거나 누워있기", value: "sleep" },
        ],
      },
      {
        index: 4,
        text: "공허함 외에 다른 감정도 함께 있어?",
        type: "multiple",
        options: [
          { label: "슬픔", value: "sad" },
          { label: "불안감", value: "anxious" },
          { label: "피로감", value: "tired" },
          { label: "무기력함", value: "unmotivated" },
          { label: "짜증이나 화", value: "angry" },
        ],
      },
      {
        index: 5,
        text: "이 공허함이 너에게 미치는 영향은?",
        type: "multiple",
        options: [
          { label: "일상적인 의욕이 떨어짐", value: "daily" },
          { label: "수면에 영향을 미침", value: "sleep" },
          { label: "관계에 영향을 미침", value: "relationship" },
          { label: "신체 건강에 영향을 미침", value: "health" },
          { label: "부정적인 대처 행동이 증가", value: "coping" },
        ],
      },
    ],
  },
};

// ── 기본 템플릿 (설정되지 않은 콘텐츠용) ────────────────────────────
const DEFAULT_INPUT_CONFIG: InputConfig = {
  placeholder: "지금 상황을 편하게 적어줘",
  example_inputs: [
    "상황을 구체적으로 설명해줄수록, AI가 더 정확하게 이해할 수 있어.",
    "감정뿐만 아니라 행동, 시간, 배경 등도 함께 적으면 좋아.",
  ],
  questions: [
    {
      index: 1,
      text: "이 상황이 얼마나 자주 일어나?",
      type: "single",
      options: [
        { label: "거의 매일", value: "daily" },
        { label: "자주", value: "frequent" },
        { label: "가끔", value: "sometimes" },
        { label: "드물게", value: "rarely" },
      ],
    },
    {
      index: 2,
      text: "이 상황이 얼마나 오래됐어?",
      type: "single",
      options: [
        { label: "최근 몇 주", value: "recent" },
        { label: "몇 개월", value: "months" },
        { label: "1년 이상", value: "year" },
        { label: "예전부터", value: "longterm" },
      ],
    },
    {
      index: 3,
      text: "이것이 너에게 미치는 영향 정도는?",
      type: "single",
      options: [
        { label: "거의 영향 없음", value: "minimal" },
        { label: "어느 정도 영향", value: "some" },
        { label: "상당한 영향", value: "significant" },
        { label: "매우 큰 영향", value: "severe" },
      ],
    },
    {
      index: 4,
      text: "이 상황에 대해 누군가와 대화한 적이 있어?",
      type: "single",
      options: [
        { label: "없음", value: "no" },
        { label: "누군가와 얘기함", value: "someone" },
        { label: "전문가와 얘기함", value: "professional" },
        { label: "여러 명과 얘기함", value: "multiple" },
      ],
    },
    {
      index: 5,
      text: "이 상황을 해결하기 위해 뭔가 시도해본 적이 있어?",
      type: "single",
      options: [
        { label: "시도한 적 없음", value: "no" },
        { label: "시도해봤음", value: "tried" },
        { label: "계속 시도 중", value: "ongoing" },
        { label: "시도했지만 포기했음", value: "gave_up" },
      ],
    },
  ],
};

// TODO: [백엔드 연동] content_id로 GET /api/contents/[id]를 호출해 input_config 반환
export function getInputConfig(content_id: string): InputConfig {
  return DUMMY_INPUT_CONFIGS[content_id] ?? DEFAULT_INPUT_CONFIG;
}
