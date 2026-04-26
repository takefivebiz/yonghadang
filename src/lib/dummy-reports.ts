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
        isPurchased: false,
      },
      {
        id: 'pq_love_02',
        question: '상대는 지금 나를 어떻게 보고 있을까?',
        description: "상대가 너를 진짜 어떻게 생각하고 있는지 읽어볼 거야.",
        price: 900,
        displayOrder: 2,
        isPurchased: false,
      },
      {
        id: 'pq_love_03',
        question: '나는 왜 항상 이런 선택을 반복할까?',
        description: "반복되는 선택의 패턴 속 진짜 원인을 찾아볼 거야.",
        price: 900,
        displayOrder: 3,
        isPurchased: false,
      },
      {
        id: 'pq_love_04',
        question: '지금 내가 놓치고 있는 판단 기준은 뭐야?',
        description: "판단이 흐려지는 이유가 뭔지 명확히 해줄 거야.",
        price: 900,
        displayOrder: 4,
        isPurchased: false,
      },
      {
        id: 'pq_love_05',
        question: '이 관계를 계속 유지하려는 진짜 이유는?',
        description: "관계를 계속하고 싶은 진짜 이유가 뭔지 알아볼 거야.",
        price: 900,
        displayOrder: 5,
        isPurchased: false,
      },
      {
        id: 'pq_love_06',
        question: '내가 무의식적으로 피하고 있는 것은?',
        description: "자신도 모르는 심리적 회피가 뭔지 보여줄 거야.",
        price: 900,
        displayOrder: 6,
        isPurchased: false,
      },
      {
        id: 'pq_love_07',
        question: '이 상황의 진짜 문제점은 뭐야?',
        description: "겉의 갈등 뒤에 숨겨진 진짜 문제가 뭔지 알려줄 거야.",
        price: 900,
        displayOrder: 7,
        isPurchased: false,
      },
      {
        id: 'pq_love_08',
        question: '변화를 위해 내가 먼저 해야 할 것은?',
        description: "변화를 위해 내가 먼저 할 수 있는 게 뭔지 제시할 거야.",
        price: 900,
        displayOrder: 8,
        isPurchased: false,
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
        isPurchased: false,
      },
      {
        id: 'pq_career_03',
        question: '나는 왜 항상 안정성에 끌릴까?',
        description: "안정을 추구하는 이유의 근본을 이해할 수 있게 해줄 거야.",
        price: 900,
        displayOrder: 3,
        isPurchased: false,
      },
      {
        id: 'pq_career_04',
        question: '실제로 바꿔본다면 어떤 어려움이 올까?',
        description: "변화할 때 실제로 마주할 어려움이 뭔지 구체화해줄 거야.",
        price: 900,
        displayOrder: 4,
        isPurchased: false,
      },
      {
        id: 'pq_career_05',
        question: '지금 망설이는 진짜 이유는 뭐야?',
        description: "의심과 확신 사이의 거리가 정확히 얼마나 되는지 봐.",
        price: 900,
        displayOrder: 5,
        isPurchased: false,
      },
      {
        id: 'pq_career_06',
        question: '나는 이 변화를 준비할 수 있을까?',
        description: "심리적으로 준비가 되어 있는지 점검해볼 거야.",
        price: 900,
        displayOrder: 6,
        isPurchased: false,
      },
      {
        id: 'pq_career_07',
        question: '지금 행동하지 않을 때의 비용은?',
        description: "행동하지 않을 때의 비용이 얼마나 되는지 현실화해줄 거야.",
        price: 900,
        displayOrder: 7,
        isPurchased: false,
      },
      {
        id: 'pq_career_08',
        question: '5년 뒤, 지금 선택을 어떻게 평가할까?',
        description: "5년, 10년 뒤에 지금 선택을 어떻게 평가할지 봐.",
        price: 900,
        displayOrder: 8,
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
        isPurchased: false,
      },
      {
        id: 'pq_emotion_02',
        question: '주변 사람들도 내 감정 변화를 느낄까?',
        description: "내 감정 변화가 주변에 어떻게 보이는지 알려줄 거야.",
        price: 900,
        displayOrder: 2,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_03',
        question: '감정 변화의 패턴 속에서 내가 반복하는 행동은?',
        description: "같은 감정 상태에서 반복되는 내 행동 패턴을 보여줄 거야.",
        price: 900,
        displayOrder: 3,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_04',
        question: '이 감정의 근본 원인은 무엇일까?',
        description: "감정의 근원이 되는 심리적 요인을 찾아줄 거야.",
        price: 900,
        displayOrder: 4,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_05',
        question: '감정이 흔들릴 때, 나는 어떻게 대처하고 있어?',
        description: "지금의 대처 방식이 도움이 되는지 점검해볼 거야.",
        price: 900,
        displayOrder: 5,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_06',
        question: '안정을 찾기 위해 할 수 있는 게 뭐야?',
        description: "안정을 위해 지금 바로 할 수 있는 구체적인 방법을 제시할 거야.",
        price: 900,
        displayOrder: 6,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_07',
        question: '이 감정이 줄어들 신호는 뭐야?',
        description: "감정이 실제로 변화하고 있다는 신호가 뭔지 알려줄 거야.",
        price: 900,
        displayOrder: 7,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_08',
        question: '지금 가장 필요한 건 뭐야?',
        description: "지금 가장 필요한 게 정확히 뭔지 명확히 할 거야.",
        price: 900,
        displayOrder: 8,
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
        isPurchased: false,
      },
      {
        id: 'pq_relation_02',
        question: '상대는 내 어색함을 알아챌까?',
        description: "상대가 느끼는 나의 어색함의 수준을 인식한다.",
        price: 900,
        displayOrder: 2,
        isPurchased: false,
      },
      {
        id: 'pq_relation_03',
        question: '나는 왜 항상 관계에서 거리감을 느낄까?',
        description: "관계 거리감의 패턴화된 원인을 파악한다.",
        price: 900,
        displayOrder: 3,
        isPurchased: false,
      },
      {
        id: 'pq_relation_04',
        question: '관계 초기의 편함과 지금의 어색함, 뭐가 진짜야?',
        description: "관계 초반의 편함이 진짜인지 현재의 어색함이 진짜인지 판단한다.",
        price: 900,
        displayOrder: 4,
        isPurchased: false,
      },
      {
        id: 'pq_relation_05',
        question: '이 패턴을 깨려면 뭘 해야 할까?',
        description: "이전과 다른 선택을 하기 위한 구체적 방법을 제시한다.",
        price: 900,
        displayOrder: 5,
        isPurchased: false,
      },
      {
        id: 'pq_relation_06',
        question: '상대가 나의 진심을 이해할 수 있을까?',
        description: "상대가 자신의 진심을 받아줄 준비가 되었는지 본다.",
        price: 900,
        displayOrder: 6,
        isPurchased: false,
      },
      {
        id: 'pq_relation_07',
        question: '나는 어떤 관계를 원하고 있어?',
        description: "자신이 진정 원하는 관계의 형태를 명확히 한다.",
        price: 900,
        displayOrder: 7,
        isPurchased: false,
      },
      {
        id: 'pq_relation_08',
        question: '지금부터라도 관계를 다시 만들 수 있을까?',
        description: "지금부터 변화를 시작할 가능성을 평가한다.",
        price: 900,
        displayOrder: 8,
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
        isPurchased: false,
      },
      {
        id: 'pq_self_love_02',
        question: '상대와 관계 없이 나 혼자서 할 수 있는 게 뭘까?',
        description: "관계 외에서 자신을 안정시킬 수 있는 것을 안다.",
        price: 900,
        displayOrder: 2,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_03',
        question: '지금 상태가 계속되면 관계는 어떻게 될까?',
        description: "현재의 악순환이 가져올 미래를 현실화한다.",
        price: 900,
        displayOrder: 3,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_04',
        question: '확인욕구를 멈출 수 있을까?',
        description: "반복되는 확인욕구를 멈출 수 있는 가능성을 본다.",
        price: 900,
        displayOrder: 4,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_05',
        question: '나는 상대에게서 뭘 찾고 있어?',
        description: "상대에게서 찾는 것이 실제로 뭔지 깨닫는다.",
        price: 900,
        displayOrder: 5,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_06',
        question: '불안감이 생기지 않는 순간은 언제야?',
        description: "불안감 없이 편안함을 느끼는 순간의 조건을 파악한다.",
        price: 900,
        displayOrder: 6,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_07',
        question: '이 패턴에서 벗어나려면?',
        description: "패턴을 바꾸기 위한 첫 번째 선택을 제시한다.",
        price: 900,
        displayOrder: 7,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_08',
        question: '나는 상대를 신뢰할 수 있을까?',
        description: "상대를 신뢰할 수 있는 근거를 함께 만든다.",
        price: 900,
        displayOrder: 8,
        isPurchased: false,
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
        isPurchased: false,
      },
      {
        id: 'pq_self_career_02',
        question: '최악의 시나리오를 현실적으로 보면?',
        description: "최악의 경우를 현실적으로 평가하고 대비한다.",
        price: 900,
        displayOrder: 2,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_03',
        question: '10년 뒤, 지금 결정에 대해 후회할까?',
        description: "10년 뒤의 자신이 지금 선택을 어떻게 평가할지 본다.",
        price: 900,
        displayOrder: 3,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_04',
        question: '도전할 때 가장 필요한 건 뭐야?',
        description: "도전 시 실제로 필요한 것을 명확히 한다.",
        price: 900,
        displayOrder: 4,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_05',
        question: '나의 진짜 역량은 뭘까?',
        description: "자신의 숨겨진 역량을 인식한다.",
        price: 900,
        displayOrder: 5,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_06',
        question: '지금 머물러 있는 게 안전한 걸까?',
        description: "현 상태의 안전성이 진짜인지 착각인지 판단한다.",
        price: 900,
        displayOrder: 6,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_07',
        question: '시작하는 순간이 지금이어야 하는 이유는?',
        description: "지금이 유일한 기회인 이유를 이해한다.",
        price: 900,
        displayOrder: 7,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_08',
        question: '성공의 정의가 뭐야?',
        description: "개인적 성공의 정의를 명확히 한다.",
        price: 900,
        displayOrder: 8,
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
        isPurchased: false,
      },
      {
        id: 'pq_other_love_02',
        question: '상대의 행동 패턴에서 읽을 수 있는 건?',
        description: "상대의 행동에서 진짜 의도를 읽는다.",
        price: 900,
        displayOrder: 2,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_03',
        question: '상대가 바꾸기 어려워할 부분은?',
        description: "상대가 변하기 어려운 근본적 특성을 파악한다.",
        price: 900,
        displayOrder: 3,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_04',
        question: '상대의 진짜 감정은 뭐야?',
        description: "상대의 겉과 속을 구분하고 진짜 감정을 본다.",
        price: 900,
        displayOrder: 4,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_05',
        question: '상대는 나와 미래를 보고 있을까?',
        description: "상대가 미래를 함께 그리는지 판단한다.",
        price: 900,
        displayOrder: 5,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_06',
        question: '상대가 가장 신경 쓰는 건 뭐야?',
        description: "상대가 실제로 소중하게 여기는 것을 안다.",
        price: 900,
        displayOrder: 6,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_07',
        question: '내가 상대에게 뭘 의미할까?',
        description: "자신이 상대에게 미치는 영향의 크기를 인식한다.",
        price: 900,
        displayOrder: 7,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_08',
        question: '이 관계의 미래는 뭐야?',
        description: "이 관계의 궁극적 방향성을 예측한다.",
        price: 900,
        displayOrder: 8,
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
        isPurchased: false,
      },
      {
        id: 'pq_other_career_02',
        question: '주도적으로 움직이지 않는 근본 이유는?',
        description: "주도성 부족의 심리적 뿌리를 파악한다.",
        price: 900,
        displayOrder: 2,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_03',
        question: '이 팀에서 저 사람에게 필요한 건?',
        description: "팀 환경에서 상대가 필요로 하는 지원을 명확히 한다.",
        price: 900,
        displayOrder: 3,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_04',
        question: '저 사람의 숨겨진 역량은?',
        description: "겉으로 드러나지 않은 상대의 숨겨진 능력을 발견한다.",
        price: 900,
        displayOrder: 4,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_05',
        question: '성장을 막고 있는 심리적 요인은?',
        description: "성장을 막고 있는 심리적 장벽을 인식한다.",
        price: 900,
        displayOrder: 5,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_06',
        question: '어떤 환경에서 가장 잘할까?',
        description: "상대가 가장 잘 일할 수 있는 환경의 조건을 안다.",
        price: 900,
        displayOrder: 6,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_07',
        question: '리더십을 발휘할 가능성은?',
        description: "상대가 리더십을 발휘할 가능성을 평가한다.",
        price: 900,
        displayOrder: 7,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_08',
        question: '향후 경력 경로는 어떻게 설계할까?',
        description: "상대의 경력 경로를 함께 설계한다.",
        price: 900,
        displayOrder: 8,
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
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_02',
        question: '상대는 이 패턴을 바꾸고 싶을까?',
        description: "상대도 이 관계의 변화를 원하는지 알아본다.",
        price: 900,
        displayOrder: 2,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_03',
        question: '패턴을 깨기 위해 내가 할 수 있는 건?',
        description: "패턴을 깨기 위해 내가 먼저 할 수 있는 구체적 행동을 안다.",
        price: 900,
        displayOrder: 3,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_04',
        question: '우리는 정말 맞는 사람들일까?',
        description: "근본적 가치관의 맞음과 안 맞음을 판단한다.",
        price: 900,
        displayOrder: 4,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_05',
        question: '이 관계를 계속해야 할까?',
        description: "관계 지속의 장단점을 현실적으로 저울질한다.",
        price: 900,
        displayOrder: 5,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_06',
        question: '상대의 진짜 마음은?',
        description: "상대의 진정한 마음을 분명히 본다.",
        price: 900,
        displayOrder: 6,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_07',
        question: '우리 관계는 언제부터 이렇게 됐을까?',
        description: "문제가 어디서 시작되었는지 추적한다.",
        price: 900,
        displayOrder: 7,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_08',
        question: '앞으로의 미래는?',
        description: "앞으로의 관계가 어떻게 흘러갈지 예측한다.",
        price: 900,
        displayOrder: 8,
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
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_02',
        question: '누가 먼저 변해야 이 구조가 바뀔까?',
        description: "누가 먼저 변해야 전체 구조가 변할지 판단한다.",
        price: 900,
        displayOrder: 2,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_03',
        question: '조직 관점에서 이 팀에게 필요한 건?',
        description: "조직 차원에서 이 팀의 성공을 위해 필요한 개입을 제시한다.",
        price: 900,
        displayOrder: 3,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_04',
        question: '각자의 진짜 역할은 뭐야?',
        description: "각자가 실제로 담당해야 할 역할을 명확히 한다.",
        price: 900,
        displayOrder: 4,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_05',
        question: '신뢰 관계를 회복할 수 있을까?',
        description: "현재 손상된 신뢰를 회복할 가능성을 평가한다.",
        price: 900,
        displayOrder: 5,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_06',
        question: '팀 구조의 개선안은?',
        description: "팀 구조를 개선하기 위한 구체적 방안을 제시한다.",
        price: 900,
        displayOrder: 6,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_07',
        question: '앞으로의 협업 방식은?',
        description: "앞으로의 협업 방식을 재설계한다.",
        price: 900,
        displayOrder: 7,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_08',
        question: '이 팀의 미래는?',
        description: "이 팀의 미래 성장 가능성을 예측한다.",
        price: 900,
        displayOrder: 8,
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
