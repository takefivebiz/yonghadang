import { ResultScene } from "@/lib/types/result";

// TODO: [백엔드 연동] 더미데이터를 GET /api/sessions/[session_id]/scenes 실제 호출로 교체
// 각 콘텐츠별로 구체적인 씬 메시지를 정의함. 백엔드 연동 시 AI가 생성한 실제 메시지로 교체

export function generateMockResultScenes(contentId: string): ResultScene[] {
  const mockScenes: Record<string, ResultScene[]> = {
    "love-1": [
      {
        id: "mock-love1-scene-1",
        scene_index: 1,
        scene_title: "감정이 흔들리기 시작한 순간",
        is_free: true,
        is_unlocked: true,
        messages: [
          { type: "ai", text: "확인하고 나서도 안심은 오래 가지 않아." },
          {
            type: "ai",
            text: "다시 불안해지기까지 걸리는 시간이, 처음보다 짧아지고 있지 않아?",
          },
          {
            type: "punch",
            text: "불안을 잠재우려는 건데, 오히려 불안을 키우고 있어.",
          },
          {
            type: "ai",
            text: "연락이 문제가 아닌 것 같다는 걸, 이미 어딘가서 알고 있을 수 있어.",
          },
        ],
        preview_messages: null,
      },
      {
        id: "mock-love1-scene-2",
        scene_index: 2,
        scene_title: "확인이 안심이 되지 않는 이유",
        is_free: true,
        is_unlocked: true,
        messages: [
          { type: "ai", text: "상대가 늦게 답했어도, 항상 답은 왔어." },
          {
            type: "ai",
            text: "근데 그게 안심이 됐어? 아니면 다음 확인을 기다리게 됐어?",
          },
          {
            type: "ai",
            text: "불안이 멈추지 않는다면, 연락이 해결책은 아닌 거야.",
          },
          { type: "punch", text: "횟수의 문제가 아니야." },
        ],
        preview_messages: null,
      },
      {
        id: "mock-love1-scene-3",
        scene_index: 3,
        scene_title: "반복되는 불안의 패턴",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "이 반응이 지금 이 사람 때문에 생긴 건지," },
          { type: "ai", text: "아니면 훨씬 오래전부터 있던 건지," },
          { type: "ai", text: "한번쯤 생각해본 적 있어?" },
          {
            type: "memo",
            text: "뇌는 한 번 새긴 위협 패턴을\n쉽게 지우지 않아",
          },
          {
            type: "ai",
            text: "지금 느끼는 불안이, 그때 배운 반응일 수 있어.",
          },
        ],
        preview_messages: [
          { type: "ai", text: "이 반응이 지금 이 사람 때문에 생긴 건지," },
          { type: "ai", text: "아니면 훨씬 오래전부터 있던 건지," },
        ],
      },
      {
        id: "mock-love1-scene-4",
        scene_index: 4,
        scene_title: "관계의 온도 차이",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "네가 더 많이 신경 쓸수록," },
          { type: "ai", text: "상대는 점점 가볍게 느낄 수 있어." },
          {
            type: "ai",
            text: "온도 차이가 생기면, 뭔가 맞춰보려는 게 더 어색해져.",
          },
          { type: "punch", text: "관심이 압박이 되는 순간이 있어." },
          {
            type: "ai",
            text: "네 잘못은 아닌데, 그렇다고 아무것도 달라지지 않은 것도 아니야.",
          },
        ],
        preview_messages: [
          { type: "ai", text: "네가 더 많이 신경 쓸수록," },
          { type: "ai", text: "상대는 점점 가볍게 느낄 수 있어." },
        ],
      },
      {
        id: "mock-love1-scene-5",
        scene_index: 5,
        scene_title: "이후 흐름",
        is_free: false,
        is_unlocked: false,
        messages: [
          {
            type: "ai",
            text: "지금 이 패턴, 이 사람이 바뀌어도 사라지진 않을 거야.",
          },
          {
            type: "ai",
            text: "다음 사람을 만나도, 비슷한 지점에서 다시 이 감정이 올라올 거야.",
          },
          { type: "ai", text: "그게 무섭게 들릴 수 있는데," },
          {
            type: "ai",
            text: "지금 이걸 알고 있다는 게 오히려 드문 일이야.",
          },
        ],
        preview_messages: [
          {
            type: "ai",
            text: "지금 이 패턴, 이 사람이 바뀌어도 사라지진 않을 거야.",
          },
        ],
      },
      {
        id: "mock-love1-scene-6",
        scene_index: 6,
        scene_title: "선택 기준",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "크게 바꾸려 하면 오래 못 가." },
          {
            type: "ai",
            text: "다음번에 확인하고 싶어질 때, 딱 10분만 기다려봐.",
          },
          {
            type: "ai",
            text: "그 10분 동안 뭐가 두려운지 적어봐. 연락이 없는 게 두려운 건지, 아니면 그게 의미하는 무언가가 두려운 건지.",
          },
          {
            type: "memo",
            text: "작은 간격이 쌓이면\n반응하는 사람이 아니라\n선택하는 사람이 돼",
          },
          { type: "ai", text: "이게 시작이야." },
        ],
        preview_messages: [
          { type: "ai", text: "크게 바꾸려 하면 오래 못 가." },
        ],
      },
    ],
    "love-2": [
      {
        id: "mock-love2-scene-1",
        scene_index: 1,
        scene_title: "흔들리는 감정의 실체",
        is_free: true,
        is_unlocked: true,
        messages: [
          { type: "ai", text: "자기 전에만 생각난다는 건, 뭔가 의미가 있어." },
          { type: "ai", text: "그게 진심의 신호일 수도, 외로움의 신호일 수도 있어." },
          { type: "punch", text: "핵심은, 언제 그 감정이 오는지 보는 거야." },
        ],
        preview_messages: null,
      },
      {
        id: "mock-love2-scene-2",
        scene_index: 2,
        scene_title: "시간에 따른 감정 변화",
        is_free: true,
        is_unlocked: true,
        messages: [
          { type: "ai", text: "만날 땐 별로 특별하지 않은데 자기 전엔 자꾸 생각난다면," },
          { type: "ai", text: "그건 그 사람과의 감정이 아니라, 고독과의 관계일 수도 있어." },
          { type: "ai", text: "외로워서 그리워하는 건지, 정말 그 사람이 그리운 건지를 구분하기가 쉽지 않을 때가 있지." },
        ],
        preview_messages: null,
      },
      {
        id: "mock-love2-scene-3",
        scene_index: 3,
        scene_title: "진심을 찾는 방법",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "진심과 외로움을 가르는 가장 간단한 방법이 있어." },
          { type: "ai", text: "그 사람과 함께 있을 때 외로움이 채워지는가, 아니면 더 깊어지는가를 봐." },
          { type: "punch", text: "함께 있어도 외롭다면, 그건 다른 차원의 외로움이야." },
          {
            type: "memo",
            text: "진심은 함께할 때 따뜻해져.\n외로움은 함께 있어도 추워.",
          },
        ],
        preview_messages: [
          { type: "ai", text: "진심과 외로움을 가르는 가장 간단한 방법이 있어." },
        ],
      },
      {
        id: "mock-love2-scene-4",
        scene_index: 4,
        scene_title: "관계의 온도",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "일방적인 감정은 자기 전에 더 크게 느껴져." },
          { type: "ai", text: "상대가 너의 기대만큼 돌아주지 않으면, 밤은 그 간극을 더 크게 만들어." },
          { type: "ai", text: "낮에는 바빠서 인식을 못 했던 것들이, 밤엔 뚜렷해져." },
        ],
        preview_messages: [
          { type: "ai", text: "일방적인 감정은 자기 전에 더 크게 느껴져." },
        ],
      },
      {
        id: "mock-love2-scene-5",
        scene_index: 5,
        scene_title: "이후의 선택",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "만나는 시간이 더 중요해져야 한다면," },
          { type: "ai", text: "자기 전이 아닌 다른 시간에도 자연스럽게 생각나도록." },
          { type: "ai", text: "그렇지 않다면, 이건 외로움일 가능성이 높아." },
        ],
        preview_messages: [
          { type: "ai", text: "만나는 시간이 더 중요해져야 한다면," },
        ],
      },
      {
        id: "mock-love2-scene-6",
        scene_index: 6,
        scene_title: "마지막 질문",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "자기 전에 생각나는 그 사람이," },
          { type: "ai", text: "진짜로 그 자리를 채워주기를 원하는 사람인가?" },
          { type: "ai", text: "아니면 그냥 밤이 덜 외로우면 되는 건가?" },
          {
            type: "memo",
            text: "그 답이 당신의 다음 결정을\n결정해.",
          },
        ],
        preview_messages: [
          { type: "ai", text: "자기 전에 생각나는 그 사람이," },
        ],
      },
    ],
    "love-5": [
      {
        id: "mock-love5-scene-1",
        scene_index: 1,
        scene_title: "신호 읽기",
        is_free: true,
        is_unlocked: true,
        messages: [
          { type: "ai", text: "상대의 행동만 봐서는 알 수 없는 게 많아." },
          { type: "ai", text: "친절한지 관심인지, 호의인지 습관인지를 구분하기가 정말 어렵거든." },
          { type: "punch", text: "명확한 신호는 많지 않아." },
        ],
        preview_messages: null,
      },
      {
        id: "mock-love5-scene-2",
        scene_index: 2,
        scene_title: "관계의 방향성",
        is_free: true,
        is_unlocked: true,
        messages: [
          { type: "ai", text: "관계가 전진하고 있는가를 보려면," },
          { type: "ai", text: "행동보다는 시간이 어떻게 쓰이는가를 봐야 해." },
          { type: "ai", text: "선택이 자신을 향하는가, 다른 것을 향하는가." },
        ],
        preview_messages: null,
      },
      {
        id: "mock-love5-scene-3",
        scene_index: 3,
        scene_title: "해석의 함정",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "우리는 상대의 행동을 원하는 대로 해석해." },
          { type: "ai", text: "하나의 신호도 여러 의미로 읽힐 수 있거든." },
          { type: "punch", text: "불확실성을 원하는 대로 채워버려." },
          {
            type: "memo",
            text: "그게 가장 위험한 부분이야.\n확실함의 부재가,\n우리를 붙잡아.",
          },
        ],
        preview_messages: [
          { type: "ai", text: "우리는 상대의 행동을 원하는 대로 해석해." },
        ],
      },
      {
        id: "mock-love5-scene-4",
        scene_index: 4,
        scene_title: "명확함의 가치",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "관계에서 가장 필요한 건 명확함이야." },
          { type: "ai", text: "불명확한 신호 속에서 우리는 자꾸 기대하게 되고," },
          { type: "ai", text: "그 기대가 나를 더 묶어둬." },
        ],
        preview_messages: [
          { type: "ai", text: "관계에서 가장 필요한 건 명확함이야." },
        ],
      },
      {
        id: "mock-love5-scene-5",
        scene_index: 5,
        scene_title: "다음 단계",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "불확실성 속에서 얼마나 오래 기다릴 건가?" },
          { type: "ai", text: "그건 너의 내구력이 아니라, 너의 가치와 관련된 문제야." },
        ],
        preview_messages: [
          { type: "ai", text: "불확실성 속에서 얼마나 오래 기다릴 건가?" },
        ],
      },
      {
        id: "mock-love5-scene-6",
        scene_index: 6,
        scene_title: "선택의 순간",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "명확함을 요구하는 것도 사랑이야." },
          { type: "ai", text: "상대가 명확해지지 않을 때, 그걸 받아주는 것만이 사랑은 아니거든." },
          {
            type: "memo",
            text: "때론 경계를 긋는 것도\n자신을 소중히 여기는\n한 가지 방식이야.",
          },
        ],
        preview_messages: [
          { type: "ai", text: "명확함을 요구하는 것도 사랑이야." },
        ],
      },
    ],
    "career-1": [
      {
        id: "mock-career1-scene-1",
        scene_index: 1,
        scene_title: "현재 상태 인식",
        is_free: true,
        is_unlocked: true,
        messages: [
          { type: "ai", text: "직장에서 느끼는 불만족이 정확히 뭔지 보는 것부터 시작해야 해." },
          { type: "ai", text: "월급? 커리어 성장? 인간관계? 자아 실현?" },
          { type: "punch", text: "명확해야 다음이 보여." },
        ],
        preview_messages: null,
      },
      {
        id: "mock-career1-scene-2",
        scene_index: 2,
        scene_title: "불안의 근원",
        is_free: true,
        is_unlocked: true,
        messages: [
          { type: "ai", text: "지금 직장이 문제인가, 아니면 아무것도 아닌 것 같은 불안감이 문제인가?" },
          { type: "ai", text: "둘은 다른 문제야. 하나를 해결해도 다른 하나가 남을 수 있어." },
          { type: "ai", text: "둘 다 챙겨야 한다는 게 지금의 복잡함이야." },
        ],
        preview_messages: null,
      },
      {
        id: "mock-career1-scene-3",
        scene_index: 3,
        scene_title: "나이와 스펙의 함정",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "지금 나이가 늦다고 느끼는 건," },
          { type: "ai", text: "실제 나이보다는 마음의 다급함 때문일 거야." },
          { type: "punch", text: "다급함이 빨리 움직이게 만들고," },
          { type: "ai", text: "빨리 움직이면 실수가 커져." },
          {
            type: "memo",
            text: "충분한 시간은 없지만,\n서두르는 것도 최선은 아니야.",
          },
        ],
        preview_messages: [
          { type: "ai", text: "지금 나이가 늦다고 느끼는 건," },
        ],
      },
      {
        id: "mock-career1-scene-4",
        scene_index: 4,
        scene_title: "전환의 현실",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "스펙이 없으면 전환이 어렵다는 게 사실이야." },
          { type: "ai", text: "하지만 지금 이 불만족도 스펙이야." },
          { type: "ai", text: "뭔가 바꾸고 싶은 절박함은, 배운 것보다 강한 동기가 돼." },
        ],
        preview_messages: [
          { type: "ai", text: "스펙이 없으면 전환이 어렵다는 게 사실이야." },
        ],
      },
      {
        id: "mock-career1-scene-5",
        scene_index: 5,
        scene_title: "단계적 전환",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "전환은 한 번의 큰 점프가 아니라," },
          { type: "ai", text: "작은 움직임들의 연결이야." },
          { type: "ai", text: "지금 할 수 있는 게 뭔지를 먼저 보는 게 중요해." },
        ],
        preview_messages: [
          { type: "ai", text: "전환은 한 번의 큰 점프가 아니라," },
        ],
      },
      {
        id: "mock-career1-scene-6",
        scene_index: 6,
        scene_title: "선택의 기준",
        is_free: false,
        is_unlocked: false,
        messages: [
          { type: "ai", text: "지금 할 수 있는 첫 번째 움직임이 뭘까?" },
          { type: "ai", text: "공부? 사이드 프로젝트? 아니면 다른 팀으로의 이동?" },
          {
            type: "memo",
            text: "작은 경험이 모여서\n당신의 방향을 만들어.\n지금 정해지지 않아도 괜찮아.",
          },
        ],
        preview_messages: [
          { type: "ai", text: "지금 할 수 있는 첫 번째 움직임이 뭘까?" },
        ],
      },
    ],
  };

  if (mockScenes[contentId]) {
    return mockScenes[contentId];
  }

  // 기본 mock 씬 (콘텐츠 ID 매칭 없을 때)
  return [
    {
      id: `mock-${contentId}-scene-1`,
      scene_index: 1,
      scene_title: "현재 감정 인식",
      is_free: true,
      is_unlocked: true,
      messages: [
        {
          type: "ai",
          text: "막연하게 힘들다고 느끼던 게, 사실 꽤 구체적인 패턴을 갖고 있어.",
        },
        {
          type: "ai",
          text: "이름 없이 느껴지던 것들이, 하나씩 윤곽이 잡히기 시작할 거야.",
        },
        {
          type: "punch",
          text: "감정에 이름이 생기면, 그때부터 다르게 보여.",
        },
      ],
      preview_messages: null,
    },
    {
      id: `mock-${contentId}-scene-2`,
      scene_index: 2,
      scene_title: "감정 패턴 자각",
      is_free: true,
      is_unlocked: true,
      messages: [
        { type: "ai", text: "한 번으로 끝나지 않는 이유가 있어." },
        {
          type: "ai",
          text: "의지의 문제가 아니야. 구조가 바뀌지 않으면, 반응은 달라도 결과는 같아.",
        },
        { type: "ai", text: "표면이 아니라 그 아래를 봐야 해." },
      ],
      preview_messages: null,
    },
    {
      id: `mock-${contentId}-scene-3`,
      scene_index: 3,
      scene_title: "왜 반복되는지",
      is_free: false,
      is_unlocked: false,
      messages: [
        { type: "ai", text: "이 반응 방식이 처음 생긴 게," },
        { type: "ai", text: "이 관계에서가 아닐 수 있어." },
        {
          type: "ai",
          text: "훨씬 오래된 곳에서 배운 반응이 지금 여기서 반복되고 있는 거야.",
        },
        {
          type: "memo",
          text: "그 학습이 한때는 당신을 지켰어.\n하지만 지금은 가두고 있을 수 있어.",
        },
        { type: "ai", text: "이건 당신 잘못이 아니야." },
      ],
      preview_messages: [
        { type: "ai", text: "이 반응 방식이 처음 생긴 게," },
        { type: "ai", text: "이 관계에서가 아닐 수 있어." },
      ],
    },
    {
      id: `mock-${contentId}-scene-4`,
      scene_index: 4,
      scene_title: "관계 구조",
      is_free: false,
      is_unlocked: false,
      messages: [
        { type: "ai", text: "당신이 느끼는 것과," },
        { type: "ai", text: "주변이 경험하는 것 사이에," },
        { type: "ai", text: "생각보다 큰 간극이 있을 수 있어." },
        { type: "punch", text: "의도와 다르게 전달되고 있어." },
        {
          type: "ai",
          text: "이 간극을 인식하는 것만으로 관계는 조금 달라지기 시작해.",
        },
      ],
      preview_messages: [
        { type: "ai", text: "당신이 느끼는 것과," },
        { type: "ai", text: "주변이 경험하는 것 사이에," },
      ],
    },
    {
      id: `mock-${contentId}-scene-5`,
      scene_index: 5,
      scene_title: "이후 흐름",
      is_free: false,
      is_unlocked: false,
      messages: [
        { type: "ai", text: "이 패턴이 바뀌지 않으면," },
        {
          type: "ai",
          text: "사람이 달라지고, 장소가 바뀌어도 비슷한 어려움을 다시 만나게 돼.",
        },
        {
          type: "ai",
          text: "지금 이걸 알고 있다는 게, 오히려 달라질 수 있는 기회야.",
        },
      ],
      preview_messages: [
        { type: "ai", text: "이 패턴이 바뀌지 않으면," },
      ],
    },
    {
      id: `mock-${contentId}-scene-6`,
      scene_index: 6,
      scene_title: "선택 기준",
      is_free: false,
      is_unlocked: false,
      messages: [
        { type: "ai", text: "변화는 거창한 결심에서 오지 않아." },
        {
          type: "ai",
          text: "다음에 이 감정이 올라올 때, 평소와 다른 딱 한 가지만 해봐.",
        },
        {
          type: "memo",
          text: "그 작은 간격이 습관이 되면,\n반응하는 사람이 아니라\n선택하는 사람이 돼.",
        },
        { type: "ai", text: "이게 시작이야." },
      ],
      preview_messages: [
        { type: "ai", text: "변화는 거창한 결심에서 오지 않아." },
      ],
    },
  ];
}
