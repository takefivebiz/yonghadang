import { FullReport } from '@/types/report';
import { AnalysisSession } from '@/types/analysis';

/**
 * 프론트엔드 데모용 더미 분석 세션 데이터.
 * analysisSession을 더미 리포트에 함께 제공하기 위해 분리.
 */
export const DUMMY_ANALYSIS_SESSIONS: Record<string, AnalysisSession> = {
  // 자기분석 - 연애 (self + love)
  'sess_demo_self_love': {
    sessionId: 'sess_demo_self_love',
    category: '연애',
    answers: [],
    createdAt: '2026-04-20T11:00:00.000Z',
    inferredUserType: {
      topTraits: [
        { trait: '불안형', score: 8.1 },
        { trait: '타인중심형', score: 7.9 },
        { trait: '회피형', score: 6.5 },
      ],
      reportTone: '감정형',
      questionStrategy: '감정중심',
    },
  },
  // 자기분석 - 직업/진로 (self + career)
  'sess_demo_self_career': {
    sessionId: 'sess_demo_self_career',
    category: '직업/진로',
    answers: [],
    createdAt: '2026-04-19T14:30:00.000Z',
    inferredUserType: {
      topTraits: [
        { trait: '자기이해형', score: 8.4 },
        { trait: '인지형', score: 7.8 },
        { trait: '해결형', score: 7.2 },
      ],
      reportTone: '인지형',
      questionStrategy: '구조중심',
    },
  },
  // 상대분석 - 연애 (other + love)
  'sess_demo_other_love': {
    sessionId: 'sess_demo_other_love',
    category: '연애',
    answers: [],
    createdAt: '2026-04-18T10:15:00.000Z',
    inferredUserType: {
      topTraits: [
        { trait: '타인중심형', score: 8.6 },
        { trait: '인지형', score: 7.3 },
        { trait: '감정형', score: 6.9 },
      ],
      reportTone: '균형형',
      questionStrategy: '구조중심',
    },
  },
  // 상대분석 - 직업/진로 (other + career)
  'sess_demo_other_career': {
    sessionId: 'sess_demo_other_career',
    category: '직업/진로',
    answers: [],
    createdAt: '2026-04-17T09:45:00.000Z',
    inferredUserType: {
      topTraits: [
        { trait: '인지형', score: 8.2 },
        { trait: '직면형', score: 7.6 },
        { trait: '타인중심형', score: 7.0 },
      ],
      reportTone: '인지형',
      questionStrategy: '미래흐름',
    },
  },
  // 관계분석 - 연애 (relationship + love)
  'sess_demo_relationship_love': {
    sessionId: 'sess_demo_relationship_love',
    category: '연애',
    answers: [],
    createdAt: '2026-04-16T16:20:00.000Z',
    inferredUserType: {
      topTraits: [
        { trait: '불안형', score: 7.9 },
        { trait: '감정형', score: 7.5 },
        { trait: '타인중심형', score: 8.1 },
      ],
      reportTone: '감정형',
      questionStrategy: '감정중심',
    },
  },
  // 관계분석 - 직업/진로 (relationship + career)
  'sess_demo_relationship_career': {
    sessionId: 'sess_demo_relationship_career',
    category: '직업/진로',
    answers: [],
    createdAt: '2026-04-15T13:50:00.000Z',
    inferredUserType: {
      topTraits: [
        { trait: '인지형', score: 7.7 },
        { trait: '타인중심형', score: 7.4 },
        { trait: '직면형', score: 7.8 },
      ],
      reportTone: '균형형',
      questionStrategy: '구조중심',
    },
  },
  // 기존 데모용 (호환성)
  'sess_demo_guest_love': {
    sessionId: 'sess_demo_guest_love',
    category: '연애',
    answers: [],
    createdAt: '2026-04-15T10:30:00.000Z',
    inferredUserType: {
      topTraits: [
        { trait: '불안형', score: 8.2 },
        { trait: '회피형', score: 7.5 },
        { trait: '타인중심형', score: 6.8 },
      ],
      reportTone: '감정형',
      questionStrategy: '감정중심',
    },
  },
  'sess_demo_member_career': {
    sessionId: 'sess_demo_member_career',
    category: '직업/진로',
    answers: [],
    createdAt: '2026-04-12T14:20:00.000Z',
    inferredUserType: {
      topTraits: [
        { trait: '인지형', score: 8.5 },
        { trait: '직면형', score: 7.2 },
        { trait: '해결형', score: 7.8 },
      ],
      reportTone: '인지형',
      questionStrategy: '구조중심',
    },
  },
  'sess_demo_guest_emotion': {
    sessionId: 'sess_demo_guest_emotion',
    category: '감정',
    answers: [],
    createdAt: '2026-04-19T09:15:00.000Z',
    inferredUserType: {
      topTraits: [
        { trait: '감정형', score: 8.7 },
        { trait: '안정형', score: 6.2 },
        { trait: '타인중심형', score: 7.1 },
      ],
      reportTone: '균형형',
      questionStrategy: '감정중심',
    },
  },
  'sess_demo_guest_relation': {
    sessionId: 'sess_demo_guest_relation',
    category: '인간관계',
    answers: [],
    createdAt: '2026-04-18T12:00:00.000Z',
    inferredUserType: {
      topTraits: [
        { trait: '인지형', score: 7.3 },
        { trait: '직면형', score: 7.9 },
        { trait: '자기이해형', score: 7.5 },
      ],
      reportTone: '균형형',
      questionStrategy: '구조중심',
    },
  },
};

/**
 * 프론트엔드 데모용 더미 리포트 데이터.
 * session-id → FullReport 매핑.
 * TODO: [백엔드 연동] /api/reports/[session-id] 실제 호출로 교체
 */
export const DUMMY_REPORTS: Record<string, FullReport> = {
  'sess_demo_guest_love': {
    sessionId: 'sess_demo_guest_love',
    category: '연애',
    status: 'done',
    ownerType: 'guest',
    phoneNumber: '01012345678',
    createdAt: '2026-04-15T10:30:00.000Z',
    freeReport: {
      headline: '확신은 없는데, 그렇다고 관계를 끊지도 못하고 계속 보고 있는 상태야.',
      sections: [
        {
          title: '지금 상태',
          paragraphs: [
            '결정을 해야 하는 순간을 계속 미루는 구조로 움직이고 있어.',
            '상대가 나를 어떻게 생각하는지 확인하고 싶은데, 동시에 그 답을 알게 될까 봐 두렵기도 한 이중 구조야.',
          ],
        },
        {
          title: '반복되는 패턴',
          paragraphs: [
            '불확실한 상황에서 "조금만 더 지켜보자"를 반복해온 흔적이 있어.',
            '이 패턴은 상대를 보호하려는 게 아니라, 관계가 끝났을 때의 상실감을 미리 피하려는 자기 방어야.',
          ],
        },
        {
          title: '선택 구조',
          paragraphs: [
            '지금 이 관계에서 네가 원하는 건 확신이야. 근데 확신을 얻으려면 직접적인 행동이 필요하고, 그 행동이 결과를 가져올까 봐 멈춰 있어.',
          ],
        },
      ],
      deficitSentence: '근데 여기서 하나 빠져 있어. 네가 이 관계를 계속 붙잡고 있는 진짜 이유가 아직 안 나왔어.',
    },
    paidQuestions: [
      {
        id: 'pq_love_01',
        question: '이 선택이 나중에 후회될 가능성은?',
        description: "지금 선택이 나중에 어떤 영향을 미칠지 현실적으로 봐.",
        price: 900,
        displayOrder: 1,
        axis: 1,
        isPurchased: false,
        report: [
          {
            title: '후회의 구조',
            paragraphs: [
              '후회는 "나쁜 선택"이 아니라 "결정하지 않음"에서 더 강하게 온다. 지금 이 상태를 계속 유지하는 것 자체가 선택이라는 걸 알고 있어야 해.',
              '불확실한 감정을 안고 판단을 유보하는 패턴이 이어질수록, 나중에 "그때 결정했어야 했는데"라는 감각이 더 뚜렷하게 남게 돼.',
            ],
          },
          {
            title: '지금 할 수 있는 것',
            paragraphs: [
              '후회를 줄이는 방법은 완벽한 선택이 아니야. 지금 내가 무엇을 원하는지 직면하고, 그걸 기준으로 움직이는 것뿐이야.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_02',
        question: '상대는 지금 나를 어떻게 보고 있을까?',
        description: "상대가 너를 진짜 어떻게 생각하고 있는지 읽어볼 거야.",
        price: 900,
        displayOrder: 2,
        axis: 1,
        isPurchased: false,
        report: [
          {
            title: '상대 시선 읽기',
            paragraphs: [
              '네가 감정을 드러내지 않고 결정을 미루는 동안, 상대는 "이 사람이 나를 어떻게 생각하는지 모르겠다"는 불명확함을 느끼고 있을 가능성이 높아.',
              '불안형 패턴을 가진 사람은 자신을 보호하기 위해 감정을 숨기는데, 상대 입장에서 그건 무관심이나 무감각으로 읽힐 수 있어.',
            ],
          },
          {
            title: '관계의 신호',
            paragraphs: [
              '상대가 아직 관계를 유지하고 있다면, 그건 완전히 포기하지 않았다는 신호야. 하지만 방치의 시간이 길어질수록 그 신호도 흐려져.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_03',
        question: '나는 왜 항상 이런 선택을 반복할까?',
        description: "반복되는 선택의 패턴 속 진짜 원인을 찾아볼 거야.",
        price: 900,
        displayOrder: 3,
        axis: 1,
        isPurchased: false,
        report: [
          {
            title: '반복의 뿌리',
            paragraphs: [
              '비슷한 상황이 반복된다는 건 환경의 문제가 아니야. 특정 감정 상태에서 작동하는 선택 회로가 있다는 뜻이야.',
              '불안형 + 회피형 조합에서 자주 나타나는 패턴은 이렇게 생겼어. 기회가 보이면 접근하고, 관계가 깊어질 것 같으면 거리를 두고, 상대가 멀어지면 다시 불안해지는 루프.',
            ],
          },
          {
            title: '패턴을 끊으려면',
            paragraphs: [
              '반복을 끊는 건 의지로 안 돼. 루프가 작동하는 순간을 알아채고, 그 순간에 "내가 지금 뭘 피하려는 거지?"를 물어보는 게 먼저야.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_04',
        question: '지금 내가 놓치고 있는 판단 기준은 뭐야?',
        description: "판단이 흐려지는 이유가 뭔지 명확히 해줄 거야.",
        price: 900,
        displayOrder: 4,
        axis: 1,
        isPurchased: false,
        report: [
          {
            title: '판단 흐림의 원인',
            paragraphs: [
              '지금 판단이 흐려지는 건 정보가 부족해서가 아니야. 판단 기준 자체가 상황에 따라 바뀌기 때문이야.',
              '한 순간엔 "감정이 중요하다"고 보다가, 다음 순간엔 "현실적으로 생각해야지"가 되는 식으로 기준이 흔들리면 아무리 생각해도 결론이 안 나.',
            ],
          },
          {
            title: '기준 세우기',
            paragraphs: [
              '판단 전에 먼저 물어야 해. "나한테 가장 중요한 한 가지가 뭔데?" 그 답이 나오면, 나머지 기준은 거기서 정렬돼.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_05',
        question: '이 관계를 계속 유지하려는 진짜 이유는?',
        description: "관계를 계속하고 싶은 진짜 이유가 뭔지 알아볼 거야.",
        price: 900,
        displayOrder: 5,
        axis: 1,
        isPurchased: false,
        report: [
          {
            title: '유지의 동기',
            paragraphs: [
              '관계를 유지하는 이유가 "이 사람이 좋아서"인지, "끝냈을 때의 공허함이 두려워서"인지가 핵심이야.',
              '두 번째 이유라면, 이 관계는 상대를 위한 게 아니라 나의 불안을 채우기 위한 구조가 돼 있을 가능성이 높아.',
            ],
          },
          {
            title: '솔직한 확인',
            paragraphs: [
              '"만약 이 관계가 끝난다면 내가 가장 먼저 느끼는 감각이 뭐지?" — 그 대답이 진짜 이유를 보여줘.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_06',
        question: '내가 무의식적으로 피하고 있는 것은?',
        description: "자신도 모르는 심리적 회피가 뭔지 보여줄 거야.",
        price: 900,
        displayOrder: 6,
        axis: 1,
        isPurchased: false,
        report: [
          {
            title: '회피의 대상',
            paragraphs: [
              '가장 많이 피하는 건 "결과를 확인하는 것"이야. 결정을 내리면 그 결과가 나오는데, 그 결과가 원하는 게 아닐 수 있다는 두려움.',
              '두 번째로 많이 피하는 건 "내가 틀렸을 수 있다는 사실"이야. 선택하지 않으면 틀릴 일도 없으니까.',
            ],
          },
          {
            title: '회피를 인정하면',
            paragraphs: [
              '"나 지금 결과가 두려워서 안 움직이는 거야"를 인식하는 것만으로도 절반은 풀려. 회피는 인식되는 순간 힘이 약해져.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_07',
        question: '이 상황의 진짜 문제점은 뭐야?',
        description: "겉의 갈등 뒤에 숨겨진 진짜 문제가 뭔지 알려줄 거야.",
        price: 900,
        displayOrder: 7,
        axis: 1,
        isPurchased: false,
        report: [
          {
            title: '겉 문제와 속 문제',
            paragraphs: [
              '겉으로 보이는 문제는 "어떻게 할지 모르겠다"인데, 속에 있는 진짜 문제는 "내가 뭘 원하는지 모르겠다"야.',
              '선택지 앞에서 막히는 게 아니라, 선택의 기준이 없어서 막히는 구조야. 그래서 정보를 더 모아도, 조언을 더 들어도 해결이 안 되는 거야.',
            ],
          },
          {
            title: '진짜 작업',
            paragraphs: [
              '진짜 작업은 이 상황을 "어떻게 해결하냐"가 아니야. "나는 어떤 사람이고 뭘 원하는 사람인가"를 먼저 정리하는 거야.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_08',
        question: '변화를 위해 내가 먼저 해야 할 것은?',
        description: "변화를 위해 내가 먼저 할 수 있는 게 뭔지 제시할 거야.",
        price: 900,
        displayOrder: 8,
        axis: 1,
        isPurchased: false,
        report: [
          {
            title: '첫 번째 행동',
            paragraphs: [
              '변화의 첫 번째는 거창한 결심이 아니야. "오늘 이 상황에 대해 아무 행동도 안 해도 된다"는 허락을 자신에게 주는 것부터야.',
              '긴장 속에서 결정을 강요받는 느낌이 들면, 판단력은 오히려 더 흐려져. 여유를 확보하는 게 먼저야.',
            ],
          },
          {
            title: '다음 단계',
            paragraphs: [
              '그 다음엔 딱 하나만 물어봐. "이 상황에서 내가 진짜 원하는 게 뭐야?" — 이 질문의 답을 찾는 게 변화의 시작이야.',
            ],
          },
        ],
      },
      // 축 2: 관계의 깊이와 신뢰 중심 질문
      {
        id: 'pq_love_09',
        question: '우리 관계의 신뢰도는 얼마나 될까?',
        description: "지금 관계에 있는 신뢰의 수준을 객관적으로 평가해볼 거야.",
        price: 900,
        displayOrder: 1,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '신뢰도 진단',
            paragraphs: [
              '신뢰는 한 번의 행동으로 쌓이지 않아. 일관성 있는 작은 행동들이 모여서 신뢰가 되는 거야.',
              '지금 너희 관계에서 그런 일관성이 있었는지, 언제부터 깨지기 시작했는지를 보면 신뢰도가 보여.',
            ],
          },
          {
            title: '신뢰 회복의 첫걸음',
            paragraphs: [
              '신뢰를 회복하려면 큰 행동이 필요한 게 아니야. 작은 약속을 지키는 것의 반복이 필요해.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_10',
        question: '상대와의 대화에서 내가 놓치고 있는 게 뭐야?',
        description: "소통의 차이가 어디에서 비롯되는지 구체적으로 봐.",
        price: 900,
        displayOrder: 2,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '대화의 틈',
            paragraphs: [
              '말은 하는데 전달이 안 되는 경험을 해본 적 있어? 그건 말 자체의 문제가 아니라 듣는 자세의 문제야.',
              '불안형 사람은 상대의 말을 다 들으려고 하기보다 내 불안감을 해소하는 답을 찾으려고 해.',
            ],
          },
          {
            title: '진정한 소통',
            paragraphs: [
              '상대 말을 이해하려고 들을 때, 상대도 너를 이해하려고 들기 시작해.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_11',
        question: '내가 이 관계에서 원하는 최소 조건은?',
        description: "타협 불가능한 최소 기준이 뭔지 명확히 해줄 거야.",
        price: 900,
        displayOrder: 3,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '최소 조건의 중요성',
            paragraphs: [
              '기준이 없으면 선택이 계속 흔들려. 최소 조건이라는 기준선이 있으면, 그 선 아래로는 절대 내려가지 않을 수 있어.',
              '지금 너는 그 최소 조건을 명확히 하지 못했을 가능성이 높아.',
            ],
          },
          {
            title: '기준선 그기',
            paragraphs: [
              '물어봐. "이건 절대 포기할 수 없는 게 뭐야?" — 그 대답이 너의 최소 조건이야.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_12',
        question: '상대가 지금 나에게 하는 말은 정말 진심일까?',
        description: "상대의 말이 행동으로 뒷받침되는지 검증해볼 거야.",
        price: 900,
        displayOrder: 4,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '말과 행동의 간격',
            paragraphs: [
              '사람은 말로는 뭐든 할 수 있어. 중요한 건 그 말이 행동으로 이어지는가야.',
              '상대가 하는 말들이 최근 몇 주간 일관되게 행동으로 나타났는지 봐.',
            ],
          },
          {
            title: '진심 읽기',
            paragraphs: [
              '진심은 반복되는 작은 행동에서 보여. 한 번의 큰 행동보다 자잘한 일관성이 중요해.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_13',
        question: '만약 지금 선택을 하지 않으면 어떤 일이 벌어질까?',
        description: "선택 연기의 대가가 실제로 얼마나 큰지 시뮬레이션해볼 거야.",
        price: 900,
        displayOrder: 5,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '연기의 비용',
            paragraphs: [
              '선택을 미루는 게 안전해 보이지만, 실제로는 상황을 더 악화시켜. 시간이 흐르면서 관계는 더 약해져.',
              '지금 결정할 때와 3개월 뒤에 결정할 때의 상황이 완전히 달라질 수 있어.',
            ],
          },
          {
            title: '시간의 대가',
            paragraphs: [
              '당신의 시간도 상대의 시간도 소중해. 불확실성을 안고 계속 기다리는 건 둘 다에게 손실이야.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_14',
        question: '내 불안감이 실제로 현실인지 착각인지 어떻게 구분할 수 있을까?',
        description: "불안감이 합리적 신호인지 심리적 패턴인지 판별해볼 거야.",
        price: 900,
        displayOrder: 6,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '불안의 이중성',
            paragraphs: [
              '불안감이 항상 신호는 아니야. 심리적 패턴이 만드는 환각일 수도 있어.',
              '현실적 근거가 있는 불안과 기분에서 비롯된 불안을 구분하는 게 중요해.',
            ],
          },
          {
            title: '신호와 소음 분별',
            paragraphs: [
              '불안을 느낄 때 물어봐. "이 불안의 근거가 지난주에도 있었나?" — 반복되면 신호, 그때그때 다르면 소음일 가능성이 높아.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_15',
        question: '이 관계를 계속할 때의 장점과 끝낼 때의 장점은 뭐야?',
        description: "둘 다의 측면을 공정하게 비교해볼 거야.",
        price: 900,
        displayOrder: 7,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '양쪽 선택의 가치',
            paragraphs: [
              '계속하는 것만 생각하고 끝내는 것의 장점은 안 본 시간이 길었어. 반대로 생각해봐.',
              '둘 다 어떤 이득이 있을지, 어떤 손실이 있을지를 균형 있게 봐야 해.',
            ],
          },
          {
            title: '공정한 비교',
            paragraphs: [
              '감정 없이, 마치 친구의 일을 조언한다고 생각하고 써봐.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_16',
        question: '지금 내가 상대를 위해 할 수 있는 최선은 뭐야?',
        description: "상대를 고려한 선택의 관점에서 생각해볼 거야.",
        price: 900,
        displayOrder: 8,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '상대 중심 선택',
            paragraphs: [
              '지금까지는 내 불안감을 해소하는 선택만 했어. 상대 입장에서 뭐가 가장 좋은 선택일지 생각해봐.',
              '때론 나를 위한 선택과 상대를 위한 선택이 같을 수도 있어.',
            ],
          },
          {
            title: '책임 있는 선택',
            paragraphs: [
              '상대도 너와 같은 인간이고, 너의 선택의 영향 아래 있어. 그걸 인식하는 순간 선택이 달라져.',
            ],
          },
        ],
      },
      // 축 3: 성장과 미래 중심 질문
      {
        id: 'pq_love_17',
        question: '이 관계가 나를 어떤 방향으로 변화시키고 있어?',
        description: "관계 속에서의 내 성장이나 퇴행을 객관적으로 봐.",
        price: 900,
        displayOrder: 1,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '관계 속의 변화',
            paragraphs: [
              '사람은 관계 속에서 변한다. 좋은 방향으로도, 나쁜 방향으로도.',
              '이 관계 때문에 더 불안해지고 약해졌다면, 그건 너를 성장시키는 관계가 아닐 수 있어.',
            ],
          },
          {
            title: '건강한 관계의 신호',
            paragraphs: [
              '건강한 관계는 넌 더 강해지고, 상대도 더 강해지도록 만들어.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_18',
        question: '5년 뒤에 이 결정을 어떻게 평가할 것 같아?',
        description: "장기적 관점에서 지금의 선택을 평가해봐.",
        price: 900,
        displayOrder: 2,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '시간의 관점',
            paragraphs: [
              '지금 보이는 게 5년 뒤에도 중요할까? 그때는 다른 관점에서 이 선택을 볼 거야.',
              '만약 5년 뒤의 너라면 지금 너에게 뭐라고 말해줄까?',
            ],
          },
          {
            title: '미래 자아와의 대화',
            paragraphs: [
              '그 대화 속에 답이 있어.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_19',
        question: '지금 이 관계에서 배우고 있는 게 뭐야?',
        description: "긍정적 학습 경험이 있는지 확인해봐.",
        price: 900,
        displayOrder: 3,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '관계 속의 배움',
            paragraphs: [
              '모든 관계는 뭔가를 가르쳐줘. 그건 긍정적일 수도 있고 부정적일 수도 있어.',
              '너는 이 관계에서 더 나은 방향으로 뭔가를 배우고 있는가? 아니면 원래 약점을 자꾸 더 자극받는 건가?',
            ],
          },
          {
            title: '성장의 기회',
            paragraphs: [
              '관계가 주는 불편함도 성장의 기회가 될 수 있어. 하지만 그래야만 그 관계가 존재해야 하는 건 아니야.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_20',
        question: '상대와의 함께한 시간이 나에게 어떤 의미가 되고 싶어?',
        description: "이 시간들이 장기적으로 나한테 어떤 가치가 되길 바라는지 생각해봐.",
        price: 900,
        displayOrder: 4,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '시간의 가치',
            paragraphs: [
              '시간은 되돌릴 수 없는 자산이야. 지금 이 시간이 나중에 어떤 의미가 될지 생각하는 건 중요해.',
              '행복했던 기억이 되기를 원해? 아니면 배움이 되기를 원해? 아니면 그냥 잊혀지기를 원해?',
            ],
          },
          {
            title: '의도적인 시간',
            paragraphs: [
              '의도 없이 흘러가는 시간과 의도를 가지고 채워나가는 시간은 달라.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_21',
        question: '내 꿈과 이 관계의 방향이 맞춰지고 있어?',
        description: "개인적 목표와 관계의 방향 사이에 충돌이 없는지 봐.",
        price: 900,
        displayOrder: 5,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '방향의 일치',
            paragraphs: [
              '관계가 나의 인생 방향과 충돌하면, 그건 아무리 좋은 관계도 지속하기 힘들어.',
              '지금 관계 때문에 내 꿈을 연기하고 있진 않아? 아니면 상대의 꿈을 무시하고 있진 않아?',
            ],
          },
          {
            title: '상호 성장',
            paragraphs: [
              '가장 좋은 관계는 서로의 꿈을 응원하는 관계야.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_22',
        question: '내가 이 관계를 끝낼 용기는 있을까?',
        description: "꼭 필요하다면 끝낼 수 있는 용기가 있는지 확인해봐.",
        price: 900,
        displayOrder: 6,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '용기의 근원',
            paragraphs: [
              '용기는 무모함이 아니야. 그건 충분한 생각 끝에 나오는 결단이야.',
              '만약 이 관계를 끝내야 한다면 너는 용감할 수 있을까? 그 대답이 너의 자존감 수준을 보여줘.',
            ],
          },
          {
            title: '자존감과 선택',
            paragraphs: [
              '자존감이 낮으면 나쁜 관계도 끝내기 어려워. 자존감이 높으면 필요한 선택을 할 수 있어.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_23',
        question: '지금의 선택이 다음 관계에 어떤 영향을 미칠까?',
        description: "현재의 결정이 미래의 관계 패턴을 어떻게 만들 것 같은지 봐.",
        price: 900,
        displayOrder: 7,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '패턴의 전승',
            paragraphs: [
              '지금 관계에서 배운 패턴은 다음 관계에도 나타나. 만약 지금 경계하지 않고 선택을 미루면, 다음 관계에서도 같은 패턴을 반복할 가능성이 높아.',
              '관계는 혼자가 아니야. 너의 선택이 만드는 패턴이 다른 사람들과의 관계까지 영향을 미쳐.',
            ],
          },
          {
            title: '건강한 패턴 만들기',
            paragraphs: [
              '지금 관계에서 건강한 결정을 하는 것이 다음 관계의 건강함을 보장해.',
            ],
          },
        ],
      },
      {
        id: 'pq_love_24',
        question: '결국 나는 어떤 사람이 되고 싶어?',
        description: "관계의 문제를 넘어 본질적인 자아 질문에 답해봐.",
        price: 900,
        displayOrder: 8,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '본질적 질문',
            paragraphs: [
              '이 관계를 계속할지 끝낼지는 사실 표면적인 질문이야. 더 근본적인 질문은 이거야. "나는 어떤 사람이 되고 싶은가?"',
              '그 질문에 대한 답이 명확하면, 이 관계를 계속할지 말지는 자동으로 결정돼.',
            ],
          },
          {
            title: '자아 정의',
            paragraphs: [
              '너는 약한 사람이 아니야. 단지 자신이 뭘 원하는지 아직 명확하지 않은 거야. 그걸 아는 순간 모든 선택이 명확해져.',
            ],
          },
        ],
      },
    ],
  },
  'sess_demo_member_career': {
    sessionId: 'sess_demo_member_career',
    category: '직업/진로',
    status: 'done',
    ownerType: 'member',
    memberId: 'user_demo',
    createdAt: '2026-04-12T14:20:00.000Z',
    freeReport: {
      headline: '방향은 알고 있는데, 그쪽으로 움직이지 못하는 상태야.',
      sections: [
        {
          title: '지금 상태',
          paragraphs: [
            '현실과 하고 싶은 것 사이에서 이미 판단이 끝났어. 근데 그 판단대로 움직이지 않고 있어.',
            '이건 결정을 못 하는 게 아니라, 결정한 걸 실행하지 못하게 막는 구조가 있다는 뜻이야.',
          ],
        },
        {
          title: '행동을 막는 구조',
          paragraphs: [
            '불확실성이 크면 클수록 더 많은 정보를 수집하려 해. 근데 지금 수집하는 건 정보가 아니라 안심이야.',
            '충분한 정보가 확신을 만들어준다고 믿고 있어. 근데 그 확신은 외부에서 오지 않아.',
          ],
        },
      ],
      deficitSentence: '이걸 안 보면 같은 선택이 반복될 가능성이 높아. 네가 움직이지 못하게 하는 진짜 기준이 뭔지 아직 안 나왔어.',
    },
    paidQuestions: [
      {
        id: 'pq_career_01',
        question: '지금 바꾸면 나중에 후회할 가능성은?',
        description: "최악의 상황이 정말 나쁜지 현실적으로 봐.",
        price: 900,
        displayOrder: 1,
        axis: 1,
        isPurchased: true,
        report: [
          {
            title: '후회 가능성 분석',
            paragraphs: [
              '현실 기준으로만 판단하면 후회할 가능성이 높아.',
              '하지만 지금 상태로 계속 가면 그것도 후회가 될 거야.',
              '중요한 건 어떤 선택이 진짜 네 기준인지를 알아야 한다는 것이야.',
            ],
          },
        ],
      },
      {
        id: 'pq_career_02',
        question: '주변 사람들은 이 선택을 어떻게 볼까?',
        description: "타인의 눈이 내 판단을 얼마나 좌지우지하는지 볼 거야.",
        price: 900,
        displayOrder: 2,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_career_03',
        question: '나는 왜 항상 안정성에 끌릴까?',
        description: "안정을 추구하는 이유의 근본을 이해할 수 있게 해줄 거야.",
        price: 900,
        displayOrder: 3,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_career_04',
        question: '실제로 바꿔본다면 어떤 어려움이 올까?',
        description: "변화할 때 실제로 마주할 어려움이 뭔지 구체화해줄 거야.",
        price: 900,
        displayOrder: 4,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_career_05',
        question: '지금 망설이는 진짜 이유는 뭐야?',
        description: "의심과 확신 사이의 거리가 정확히 얼마나 되는지 봐.",
        price: 900,
        displayOrder: 5,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_career_06',
        question: '나는 이 변화를 준비할 수 있을까?',
        description: "심리적으로 준비가 되어 있는지 점검해볼 거야.",
        price: 900,
        displayOrder: 6,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_career_07',
        question: '지금 행동하지 않을 때의 비용은?',
        description: "행동하지 않을 때의 비용이 얼마나 되는지 현실화해줄 거야.",
        price: 900,
        displayOrder: 7,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_career_08',
        question: '5년 뒤, 지금 선택을 어떻게 평가할까?',
        description: "5년, 10년 뒤에 지금 선택을 어떻게 평가할지 봐.",
        price: 900,
        displayOrder: 8,
        axis: 1,
        isPurchased: false,
      },
    ],
  },
  'sess_demo_guest_emotion': {
    sessionId: 'sess_demo_guest_emotion',
    category: '감정',
    status: 'done',
    ownerType: 'guest',
    phoneNumber: '01098765432',
    createdAt: '2026-04-19T09:15:00.000Z',
    freeReport: {
      headline: '감정이 계속 출렁거리는데, 다음 움직임을 모르겠어.',
      sections: [
        {
          title: '지금 감정 상태',
          paragraphs: [
            '어느 순간부터 기분이 한 방향으로 정해지지 않은 상태야.',
            '좋다가도 갑자기 불안해지고, 차분해졌다 싶으면 또 흔들린다는 느낌이야.',
          ],
        },
        {
          title: '감정 변화의 패턴',
          paragraphs: [
            '특정 상황에서 시작된 감정이 아니라, 내 내부에서 생겨나는 변화인 것 같아.',
            '이 감정이 언제까지 계속될지, 다음에는 어떤 감정이 올지 예측할 수 없다는 게 더 힘든 거야.',
          ],
        },
      ],
      deficitSentence: '이 감정의 근본 원인을 아직 찾지 못했어. 무엇이 너를 흔들고 있는지 알아야 움직일 수 있어.',
    },
    paidQuestions: [
      {
        id: 'pq_emotion_01',
        question: '이 감정이 계속되면 어떤 결과가 올까?',
        description: "지금 감정이 가져올 파급 효과를 예측해볼 거야.",
        price: 900,
        displayOrder: 1,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_02',
        question: '주변 사람들도 내 감정 변화를 느낄까?',
        description: "내 감정 변화가 주변에 어떻게 보이는지 알려줄 거야.",
        price: 900,
        displayOrder: 2,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_03',
        question: '감정 변화의 패턴 속에서 내가 반복하는 행동은?',
        description: "같은 감정 상태에서 반복되는 내 행동 패턴을 보여줄 거야.",
        price: 900,
        displayOrder: 3,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_04',
        question: '이 감정의 근본 원인은 무엇일까?',
        description: "감정의 근원이 되는 심리적 요인을 찾아줄 거야.",
        price: 900,
        displayOrder: 4,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_05',
        question: '감정이 흔들릴 때, 나는 어떻게 대처하고 있어?',
        description: "지금의 대처 방식이 도움이 되는지 점검해볼 거야.",
        price: 900,
        displayOrder: 5,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_06',
        question: '안정을 찾기 위해 할 수 있는 게 뭐야?',
        description: "안정을 위해 지금 바로 할 수 있는 구체적인 방법을 제시할 거야.",
        price: 900,
        displayOrder: 6,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_07',
        question: '이 감정이 줄어들 신호는 뭐야?',
        description: "감정이 실제로 변화하고 있다는 신호가 뭔지 알려줄 거야.",
        price: 900,
        displayOrder: 7,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_08',
        question: '지금 가장 필요한 건 뭐야?',
        description: "지금 가장 필요한 게 정확히 뭔지 명확히 할 거야.",
        price: 900,
        displayOrder: 8,
        axis: 1,
        isPurchased: false,
      },
    ],
  },
  'sess_demo_guest_relation': {
    sessionId: 'sess_demo_guest_relation',
    category: '인간관계',
    status: 'done',
    ownerType: 'guest',
    phoneNumber: '01011112222',
    createdAt: '2026-04-18T12:00:00.000Z',
    freeReport: {
      headline: '관계가 가까워질수록 어색해지는 패턴이 반복되네.',
      sections: [
        {
          title: '관계의 거리감',
          paragraphs: [
            '관계가 시작될 때는 편한데, 시간이 지나면서 점점 어색해진다고 느껴.',
            '상대방도 마찬가지인지, 아니면 내가 느끼는 거리감 때문인지 알 수 없어.',
          ],
        },
        {
          title: '반복되는 구조',
          paragraphs: [
            '이게 처음이 아니야. 지금까지의 관계들도 비슷한 패턴을 따랐어.',
            '처음에는 괜찮은데, 어느 순간부터 불편해지고, 그게 쌓이다 보니 관계가 멀어진다고 느껴.',
          ],
        },
      ],
      deficitSentence: '이건 상대의 문제가 아니라, 네가 관계를 만드는 방식의 문제야. 그 방식이 뭔지 알아야 해.',
    },
    paidQuestions: [
      {
        id: 'pq_relation_01',
        question: '이 거리감이 더 커질 가능성은?',
        description: "현재의 거리감이 더 커질 가능성이 있는지 판단해줄 거야.",
        price: 900,
        displayOrder: 1,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relation_02',
        question: '상대는 내 어색함을 알아챌까?',
        description: "상대가 느끼는 나의 어색함의 수준을 인식한다.",
        price: 900,
        displayOrder: 2,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relation_03',
        question: '나는 왜 항상 관계에서 거리감을 느낄까?',
        description: "관계 거리감의 패턴화된 원인을 파악한다.",
        price: 900,
        displayOrder: 3,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relation_04',
        question: '관계 초기의 편함과 지금의 어색함, 뭐가 진짜야?',
        description: "관계 초반의 편함이 진짜인지 현재의 어색함이 진짜인지 판단한다.",
        price: 900,
        displayOrder: 1,
        axis: 2,
        isPurchased: false,
      },
      {
        id: 'pq_relation_05',
        question: '이 패턴을 깨려면 뭘 해야 할까?',
        description: "이전과 다른 선택을 하기 위한 구체적 방법을 제시한다.",
        price: 900,
        displayOrder: 2,
        axis: 2,
        isPurchased: false,
      },
      {
        id: 'pq_relation_06',
        question: '상대가 나의 진심을 이해할 수 있을까?',
        description: "상대가 자신의 진심을 받아줄 준비가 되었는지 본다.",
        price: 900,
        displayOrder: 3,
        axis: 2,
        isPurchased: false,
      },
      {
        id: 'pq_relation_07',
        question: '나는 어떤 관계를 원하고 있어?',
        description: "자신이 진정 원하는 관계의 형태를 명확히 한다.",
        price: 900,
        displayOrder: 1,
        axis: 3,
        isPurchased: false,
      },
      {
        id: 'pq_relation_08',
        question: '지금부터라도 관계를 다시 만들 수 있을까?',
        description: "지금부터 변화를 시작할 가능성을 평가한다.",
        price: 900,
        displayOrder: 2,
        axis: 3,
        isPurchased: false,
      },
    ],
  },
  // 자기분석 - 연애
  'sess_demo_self_love': {
    sessionId: 'sess_demo_self_love',
    category: '연애',
    status: 'done',
    ownerType: 'guest',
    phoneNumber: '01055556666',
    createdAt: '2026-04-20T11:00:00.000Z',
    freeReport: {
      headline: '상대를 계속 확인하고 싶은데, 확인할수록 불안해지는 악순환이야.',
      sections: [
        {
          title: '불안의 악순환',
          paragraphs: [
            '상대의 작은 말투 변화에도 민감하게 반응하고, 계속 확인하려고 해.',
            '근데 확인할수록 더 의심이 생기고, 그게 또 다른 확인으로 이어져.',
          ],
        },
        {
          title: '내 패턴 인식',
          paragraphs: [
            '이건 상대 문제가 아니라 내가 만드는 패턴이라는 걸 알고 있어.',
            '알아도 멈추지 못하는 게, 더 깊은 무언가에서 비롯된 것 같아.',
          ],
        },
      ],
      deficitSentence: '불안감의 진짜 원인을 아직 못 찾고 있어. 그 뿌리가 뭔지 알아야 관계 방식도 바뀔 수 있어.',
    },
    paidQuestions: [
      {
        id: 'pq_self_love_01',
        question: '이 불안감은 어디서 비롯된 걸까?',
        description: "불안감의 근원이 되는 심리적 뿌리를 찾는다.",
        price: 900,
        displayOrder: 1,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_02',
        question: '상대와 관계 없이 나 혼자서 할 수 있는 게 뭘까?',
        description: "관계 외에서 자신을 안정시킬 수 있는 것을 안다.",
        price: 900,
        displayOrder: 2,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_03',
        question: '지금 상태가 계속되면 관계는 어떻게 될까?',
        description: "현재의 악순환이 가져올 미래를 현실화한다.",
        price: 900,
        displayOrder: 3,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_04',
        question: '확인욕구를 멈출 수 있을까?',
        description: "반복되는 확인욕구를 멈출 수 있는 가능성을 본다.",
        price: 900,
        displayOrder: 4,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_05',
        question: '나는 상대에게서 뭘 찾고 있어?',
        description: "상대에게서 찾는 것이 실제로 뭔지 깨닫는다.",
        price: 900,
        displayOrder: 5,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_06',
        question: '불안감이 생기지 않는 순간은 언제야?',
        description: "불안감 없이 편안함을 느끼는 순간의 조건을 파악한다.",
        price: 900,
        displayOrder: 6,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_07',
        question: '이 패턴에서 벗어나려면?',
        description: "패턴을 바꾸기 위한 첫 번째 선택을 제시한다.",
        price: 900,
        displayOrder: 7,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_08',
        question: '나는 상대를 신뢰할 수 있을까?',
        description: "상대를 신뢰할 수 있는 근거를 함께 만든다.",
        price: 900,
        displayOrder: 8,
        axis: 1,
        isPurchased: false,
      },
      // 축 2: 관계의 깊이와 신뢰 중심 질문
      {
        id: 'pq_self_love_09',
        question: '우리 관계의 신뢰도는 얼마나 될까?',
        description: "지금 관계에 있는 신뢰의 수준을 객관적으로 평가해볼 거야.",
        price: 900,
        displayOrder: 1,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '신뢰도 진단',
            paragraphs: [
              '신뢰는 한 번의 행동으로 쌓이지 않아. 일관성 있는 작은 행동들이 모여서 신뢰가 되는 거야.',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_10',
        question: '상대와의 대화에서 내가 놓치고 있는 게 뭐야?',
        description: "소통의 차이가 어디에서 비롯되는지 구체적으로 봐.",
        price: 900,
        displayOrder: 2,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '대화의 틈',
            paragraphs: [
              '말은 하는데 전달이 안 되는 경험을 해본 적 있어? 그건 말 자체의 문제가 아니라 듣는 자세의 문제야.',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_11',
        question: '내가 이 관계에서 원하는 최소 조건은?',
        description: "타협 불가능한 최소 기준이 뭔지 명확히 해줄 거야.",
        price: 900,
        displayOrder: 3,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '최소 조건의 중요성',
            paragraphs: [
              '기준이 없으면 선택이 계속 흔들려.',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_12',
        question: '상대가 지금 나에게 하는 말은 정말 진심일까?',
        description: "상대의 말이 행동으로 뒷받침되는지 검증해볼 거야.",
        price: 900,
        displayOrder: 4,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '말과 행동의 간격',
            paragraphs: [
              '사람은 말로는 뭐든 할 수 있어.',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_13',
        question: '만약 지금 선택을 하지 않으면 어떤 일이 벌어질까?',
        description: "선택 연기의 대가가 실제로 얼마나 큰지 시뮬레이션해볼 거야.",
        price: 900,
        displayOrder: 5,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '연기의 비용',
            paragraphs: [
              '선택을 미루는 게 안전해 보이지만, 실제로는 상황을 더 악화시켜.',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_14',
        question: '내 불안감이 실제로 현실인지 착각인지 어떻게 구분할 수 있을까?',
        description: "불안감이 합리적 신호인지 심리적 패턴인지 판별해볼 거야.",
        price: 900,
        displayOrder: 6,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '불안의 이중성',
            paragraphs: [
              '불안감이 항상 신호는 아니야.',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_15',
        question: '이 관계를 계속할 때의 장점과 끝낼 때의 장점은 뭐야?',
        description: "둘 다의 측면을 공정하게 비교해볼 거야.",
        price: 900,
        displayOrder: 7,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '양쪽 선택의 가치',
            paragraphs: [
              '둘 다 어떤 이득이 있을지 균형 있게 봐야 해.',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_16',
        question: '지금 내가 상대를 위해 할 수 있는 최선은 뭐야?',
        description: "상대를 고려한 선택의 관점에서 생각해볼 거야.",
        price: 900,
        displayOrder: 8,
        axis: 2,
        isPurchased: false,
        report: [
          {
            title: '상대 중심 선택',
            paragraphs: [
              '지금까지는 내 불안감을 해소하는 선택만 했어.',
            ],
          },
        ],
      },
      // 축 3: 성장과 미래 중심 질문
      {
        id: 'pq_self_love_17',
        question: '이 관계가 나를 어떤 방향으로 변화시키고 있어?',
        description: "관계 속에서의 내 성장이나 퇴행을 객관적으로 봐.",
        price: 900,
        displayOrder: 1,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '관계 속의 변화',
            paragraphs: [
              '사람은 관계 속에서 변한다.',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_18',
        question: '5년 뒤에 이 결정을 어떻게 평가할 것 같아?',
        description: "장기적 관점에서 지금의 선택을 평가해봐.",
        price: 900,
        displayOrder: 2,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '시간의 관점',
            paragraphs: [
              '지금 보이는 게 5년 뒤에도 중요할까?',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_19',
        question: '지금 이 관계에서 배우고 있는 게 뭐야?',
        description: "긍정적 학습 경험이 있는지 확인해봐.",
        price: 900,
        displayOrder: 3,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '관계 속의 배움',
            paragraphs: [
              '모든 관계는 뭔가를 가르쳐줘.',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_20',
        question: '상대와의 함께한 시간이 나에게 어떤 의미가 되고 싶어?',
        description: "이 시간들이 장기적으로 나한테 어떤 가치가 되길 바라는지 생각해봐.",
        price: 900,
        displayOrder: 4,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '시간의 가치',
            paragraphs: [
              '시간은 되돌릴 수 없는 자산이야.',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_21',
        question: '내 꿈과 이 관계의 방향이 맞춰지고 있어?',
        description: "개인적 목표와 관계의 방향 사이에 충돌이 없는지 봐.",
        price: 900,
        displayOrder: 5,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '방향의 일치',
            paragraphs: [
              '관계가 나의 인생 방향과 충돌하면.',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_22',
        question: '내가 이 관계를 끝낼 용기는 있을까?',
        description: "꼭 필요하다면 끝낼 수 있는 용기가 있는지 확인해봐.",
        price: 900,
        displayOrder: 6,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '용기의 근원',
            paragraphs: [
              '용기는 무모함이 아니야.',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_23',
        question: '지금의 선택이 다음 관계에 어떤 영향을 미칠까?',
        description: "현재의 결정이 미래의 관계 패턴을 어떻게 만들 것 같은지 봐.",
        price: 900,
        displayOrder: 7,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '패턴의 전승',
            paragraphs: [
              '지금 관계에서 배운 패턴은 다음 관계에도 나타나.',
            ],
          },
        ],
      },
      {
        id: 'pq_self_love_24',
        question: '결국 나는 어떤 사람이 되고 싶어?',
        description: "관계의 문제를 넘어 본질적인 자아 질문에 답해봐.",
        price: 900,
        displayOrder: 8,
        axis: 3,
        isPurchased: false,
        report: [
          {
            title: '본질적 질문',
            paragraphs: [
              '이 관계를 계속할지 끝낼지는 사실 표면적인 질문이야.',
            ],
          },
        ],
      },
    ],
  },
  // 자기분석 - 직업/진로
  'sess_demo_self_career': {
    sessionId: 'sess_demo_self_career',
    category: '직업/진로',
    status: 'done',
    ownerType: 'member',
    memberId: 'user_demo_career',
    createdAt: '2026-04-19T14:30:00.000Z',
    freeReport: {
      headline: '새로운 도전을 하고 싶은데, 막상 기회가 오면 주저하게 돼.',
      sections: [
        {
          title: '동기와 행동의 불일치',
          paragraphs: [
            '현재 상황을 벗어나고 싶다는 생각은 강한데, 움직일 용기는 없어.',
            '성공할 자신감이 없다기보다는, 실패했을 때의 결과가 두렵다는 게 더 정확해.',
          ],
        },
        {
          title: '준비의 무한 루프',
          paragraphs: [
            '"충분히 준비되면 하자"라고 생각했는데, 아무리 준비해도 충분한 느낌이 안 들어.',
            '실은 준비가 아니라 불안감을 없애려고 하는 것 같아.',
          ],
        },
      ],
      deficitSentence: '너는 뭘 진짜로 원하고 있는지, 그리고 그걸 못 하게 막는 건 뭔지를 아직 구분 못 하고 있어.',
    },
    paidQuestions: [
      {
        id: 'pq_self_career_01',
        question: '지금 도전하지 않는 진짜 이유는 뭘까?',
        description: "의식적 이유와 무의식적 이유를 구분한다.",
        price: 900,
        displayOrder: 1,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_02',
        question: '최악의 시나리오를 현실적으로 보면?',
        description: "최악의 경우를 현실적으로 평가하고 대비한다.",
        price: 900,
        displayOrder: 2,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_03',
        question: '10년 뒤, 지금 결정에 대해 후회할까?',
        description: "10년 뒤의 자신이 지금 선택을 어떻게 평가할지 본다.",
        price: 900,
        displayOrder: 3,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_04',
        question: '도전할 때 가장 필요한 건 뭐야?',
        description: "도전 시 실제로 필요한 것을 명확히 한다.",
        price: 900,
        displayOrder: 4,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_05',
        question: '나의 진짜 역량은 뭘까?',
        description: "자신의 숨겨진 역량을 인식한다.",
        price: 900,
        displayOrder: 5,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_06',
        question: '지금 머물러 있는 게 안전한 걸까?',
        description: "현 상태의 안전성이 진짜인지 착각인지 판단한다.",
        price: 900,
        displayOrder: 6,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_07',
        question: '시작하는 순간이 지금이어야 하는 이유는?',
        description: "지금이 유일한 기회인 이유를 이해한다.",
        price: 900,
        displayOrder: 7,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_08',
        question: '성공의 정의가 뭐야?',
        description: "개인적 성공의 정의를 명확히 한다.",
        price: 900,
        displayOrder: 8,
        axis: 1,
        isPurchased: false,
      },
    ],
  },
  // 상대분석 - 연애
  'sess_demo_other_love': {
    sessionId: 'sess_demo_other_love',
    category: '연애',
    status: 'done',
    ownerType: 'guest',
    phoneNumber: '01077778888',
    createdAt: '2026-04-18T10:15:00.000Z',
    freeReport: {
      headline: '상대의 행동이 계산적으로 느껴질 때가 있어. 그게 진짜 마음일까?',
      sections: [
        {
          title: '행동 해석의 어려움',
          paragraphs: [
            '상대의 작은 행동 하나하나를 분석하게 돼. 그 안에서 자신의 진심을 찾으려고 애써.',
            '근데 사람의 행동은 그렇게 단순하지 않아.',
          ],
        },
        {
          title: '상대의 패턴',
          paragraphs: [
            '상대는 일관된 패턴을 보여주고 있어.',
            '그 패턴이 진심인지, 아니면 습관인지를 구분하는 게 네가 해야 할 일이야.',
          ],
        },
      ],
      deficitSentence: '너는 상대를 분석하려고 하지만, 실제로는 상대의 태도 변화 자체가 뭔가를 말해주고 있어.',
    },
    paidQuestions: [
      {
        id: 'pq_other_love_01',
        question: '상대가 지금 나와의 관계를 어떻게 보고 있을까?',
        description: "상대가 관계를 어떻게 정의하고 있는지 안다.",
        price: 900,
        displayOrder: 1,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_02',
        question: '상대의 행동 패턴에서 읽을 수 있는 건?',
        description: "상대의 행동에서 진짜 의도를 읽는다.",
        price: 900,
        displayOrder: 2,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_03',
        question: '상대가 바꾸기 어려워할 부분은?',
        description: "상대가 변하기 어려운 근본적 특성을 파악한다.",
        price: 900,
        displayOrder: 3,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_04',
        question: '상대의 진짜 감정은 뭐야?',
        description: "상대의 겉과 속을 구분하고 진짜 감정을 본다.",
        price: 900,
        displayOrder: 4,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_05',
        question: '상대는 나와 미래를 보고 있을까?',
        description: "상대가 미래를 함께 그리는지 판단한다.",
        price: 900,
        displayOrder: 5,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_06',
        question: '상대가 가장 신경 쓰는 건 뭐야?',
        description: "상대가 실제로 소중하게 여기는 것을 안다.",
        price: 900,
        displayOrder: 6,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_07',
        question: '내가 상대에게 뭘 의미할까?',
        description: "자신이 상대에게 미치는 영향의 크기를 인식한다.",
        price: 900,
        displayOrder: 7,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_08',
        question: '이 관계의 미래는 뭐야?',
        description: "이 관계의 궁극적 방향성을 예측한다.",
        price: 900,
        displayOrder: 8,
        axis: 1,
        isPurchased: false,
      },
    ],
  },
  // 상대분석 - 직업/진로
  'sess_demo_other_career': {
    sessionId: 'sess_demo_other_career',
    category: '직업/진로',
    status: 'done',
    ownerType: 'member',
    memberId: 'user_demo_other_career',
    createdAt: '2026-04-17T09:45:00.000Z',
    freeReport: {
      headline: '팀 멤버의 가능성이 충분한데, 자신감이 없어 보여.',
      sections: [
        {
          title: '능력과 자신감의 괴리',
          paragraphs: [
            '기술적 역량은 충분하지만, 주도적으로 움직이지 않는 경향이 있어.',
            '이게 역량 부족인지, 심리적 요인인지를 구분해야 팀 전략이 나와.',
          ],
        },
        {
          title: '함께 성장하는 방식',
          paragraphs: [
            '혼자서는 자신감이 없지만, 함께할 때는 다른 모습을 보여줘.',
            '이걸 알면 팀 구성과 프로젝트 할당을 다르게 생각할 수 있어.',
          ],
        },
      ],
      deficitSentence: '저 사람을 어떻게 성장시킬지는, 먼저 그의 불안감이 구체적으로 뭔지를 알아야 가능해.',
    },
    paidQuestions: [
      {
        id: 'pq_other_career_01',
        question: '이 사람이 진짜 원하는 방향은?',
        description: "상대가 진정 추구하는 방향을 발견한다.",
        price: 900,
        displayOrder: 1,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_02',
        question: '주도적으로 움직이지 않는 근본 이유는?',
        description: "주도성 부족의 심리적 뿌리를 파악한다.",
        price: 900,
        displayOrder: 2,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_03',
        question: '이 팀에서 저 사람에게 필요한 건?',
        description: "팀 환경에서 상대가 필요로 하는 지원을 명확히 한다.",
        price: 900,
        displayOrder: 3,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_04',
        question: '저 사람의 숨겨진 역량은?',
        description: "겉으로 드러나지 않은 상대의 숨겨진 능력을 발견한다.",
        price: 900,
        displayOrder: 4,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_05',
        question: '성장을 막고 있는 심리적 요인은?',
        description: "성장을 막고 있는 심리적 장벽을 인식한다.",
        price: 900,
        displayOrder: 5,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_06',
        question: '어떤 환경에서 가장 잘할까?',
        description: "상대가 가장 잘 일할 수 있는 환경의 조건을 안다.",
        price: 900,
        displayOrder: 6,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_07',
        question: '리더십을 발휘할 가능성은?',
        description: "상대가 리더십을 발휘할 가능성을 평가한다.",
        price: 900,
        displayOrder: 7,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_08',
        question: '향후 경력 경로는 어떻게 설계할까?',
        description: "상대의 경력 경로를 함께 설계한다.",
        price: 900,
        displayOrder: 8,
        axis: 1,
        isPurchased: false,
      },
    ],
  },
  // 관계분석 - 연애
  'sess_demo_relationship_love': {
    sessionId: 'sess_demo_relationship_love',
    category: '연애',
    status: 'done',
    ownerType: 'guest',
    phoneNumber: '01099990000',
    createdAt: '2026-04-16T16:20:00.000Z',
    freeReport: {
      headline: '우리 관계 속에는 자꾸 돌아오는 패턴이 있어.',
      sections: [
        {
          title: '반복되는 갈등의 구조',
          paragraphs: [
            '같은 이유로 싸우고, 같은 방식으로 풀려고 하고, 다시 비슷한 상황이 반복돼.',
            '싸움 자체보다는 이 악순환을 벗어날 수 없다는 게 더 힘들어.',
          ],
        },
        {
          title: '두 사람의 역할',
          paragraphs: [
            '관계 속에서 한 명은 계속 같은 역할만 하고, 다른 한 명도 마찬가지야.',
            '이 역할 분담이 자연스러운 건지, 아니면 누군가 억지로 유지하는 건지는 애매해.',
          ],
        },
      ],
      deficitSentence: '이 패턴을 깨려면, 먼저 두 사람 중 누가 먼저 다른 선택을 할 수 있는지 알아야 해.',
    },
    paidQuestions: [
      {
        id: 'pq_relationship_love_01',
        question: '우리 관계의 진짜 문제점은?',
        description: "겉의 갈등과 진짜 문제를 구분한다.",
        price: 900,
        displayOrder: 1,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_02',
        question: '상대는 이 패턴을 바꾸고 싶을까?',
        description: "상대도 이 관계의 변화를 원하는지 알아본다.",
        price: 900,
        displayOrder: 2,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_03',
        question: '패턴을 깨기 위해 내가 할 수 있는 건?',
        description: "패턴을 깨기 위해 내가 먼저 할 수 있는 구체적 행동을 안다.",
        price: 900,
        displayOrder: 3,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_04',
        question: '우리는 정말 맞는 사람들일까?',
        description: "근본적 가치관의 맞음과 안 맞음을 판단한다.",
        price: 900,
        displayOrder: 4,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_05',
        question: '이 관계를 계속해야 할까?',
        description: "관계 지속의 장단점을 현실적으로 저울질한다.",
        price: 900,
        displayOrder: 5,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_06',
        question: '상대의 진짜 마음은?',
        description: "상대의 진정한 마음을 분명히 본다.",
        price: 900,
        displayOrder: 6,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_07',
        question: '우리 관계는 언제부터 이렇게 됐을까?',
        description: "문제가 어디서 시작되었는지 추적한다.",
        price: 900,
        displayOrder: 7,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_08',
        question: '앞으로의 미래는?',
        description: "앞으로의 관계가 어떻게 흘러갈지 예측한다.",
        price: 900,
        displayOrder: 8,
        axis: 1,
        isPurchased: false,
      },
    ],
  },
  // 관계분석 - 직업/진로
  'sess_demo_relationship_career': {
    sessionId: 'sess_demo_relationship_career',
    category: '직업/진로',
    status: 'done',
    ownerType: 'member',
    memberId: 'user_demo_relationship_career',
    createdAt: '2026-04-15T13:50:00.000Z',
    freeReport: {
      headline: '팀 내에 막혀있는 부분이 있고, 그게 누구 탓인지 애매해.',
      sections: [
        {
          title: '팀 역학의 복잡성',
          paragraphs: [
            '한 명이 자꾸 일을 미루고, 다른 한 명은 그걸 다 해결하려고 해.',
            '이게 개인의 성향인지, 팀 구조의 문제인지 구분이 안 돼.',
          ],
        },
        {
          title: '상호작용의 악순환',
          paragraphs: [
            '한 명이 미루면, 다른 한 명이 더 열심히 하게 되는 구조가 고착돼있어.',
            '이 구조가 계속되면 누군가는 번아웃되고, 누군가는 의존하게 돼.',
          ],
        },
      ],
      deficitSentence: '팀의 역할 구조를 다시 설계하려면, 먼저 각자가 왜 그런 역할을 하고 있는지를 봐야 해.',
    },
    paidQuestions: [
      {
        id: 'pq_relationship_career_01',
        question: '이 두 사람의 근본적 차이는?',
        description: "두 사람의 기질적, 심리적 근본 차이를 파악한다.",
        price: 900,
        displayOrder: 1,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_02',
        question: '누가 먼저 변해야 이 구조가 바뀔까?',
        description: "누가 먼저 변해야 전체 구조가 변할지 판단한다.",
        price: 900,
        displayOrder: 2,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_03',
        question: '조직 관점에서 이 팀에게 필요한 건?',
        description: "조직 차원에서 이 팀의 성공을 위해 필요한 개입을 제시한다.",
        price: 900,
        displayOrder: 3,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_04',
        question: '각자의 진짜 역할은 뭐야?',
        description: "각자가 실제로 담당해야 할 역할을 명확히 한다.",
        price: 900,
        displayOrder: 4,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_05',
        question: '신뢰 관계를 회복할 수 있을까?',
        description: "현재 손상된 신뢰를 회복할 가능성을 평가한다.",
        price: 900,
        displayOrder: 5,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_06',
        question: '팀 구조의 개선안은?',
        description: "팀 구조를 개선하기 위한 구체적 방안을 제시한다.",
        price: 900,
        displayOrder: 6,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_07',
        question: '앞으로의 협업 방식은?',
        description: "앞으로의 협업 방식을 재설계한다.",
        price: 900,
        displayOrder: 7,
        axis: 1,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_08',
        question: '이 팀의 미래는?',
        description: "이 팀의 미래 성장 가능성을 예측한다.",
        price: 900,
        displayOrder: 8,
        axis: 1,
        isPurchased: false,
      },
    ],
  },
};

/**
 * session-id 로 리포트 조회.
 * TODO: [백엔드 연동] /api/reports/[session-id] 실제 호출로 교체
 */
export const getDummyReport = (sessionId: string): FullReport | null =>
  DUMMY_REPORTS[sessionId] ?? null;

/**
 * session-id 로 분석 세션 조회.
 * TODO: [백엔드 연동] /api/analysis/[session-id] 실제 호출로 교체
 */
export const getDummyAnalysisSession = (sessionId: string): AnalysisSession | null =>
  DUMMY_ANALYSIS_SESSIONS[sessionId] ?? null;
