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
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_love_02',
        question: '상대는 지금 나를 어떻게 보고 있을까?',
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_love_03',
        question: '나는 왜 항상 이런 선택을 반복할까?',
        price: 900,
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
        price: 900,
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
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_career_03',
        question: '나는 왜 항상 안정성에 끌릴까?',
        price: 900,
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
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_02',
        question: '주변 사람들도 내 감정 변화를 느낄까?',
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_emotion_03',
        question: '감정 변화의 패턴 속에서 내가 반복하는 행동은?',
        price: 900,
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
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_relation_02',
        question: '상대는 내 어색함을 알아챌까?',
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_relation_03',
        question: '나는 왜 항상 관계에서 거리감을 느낄까?',
        price: 900,
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
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_02',
        question: '상대와 관계 없이 나 혼자서 할 수 있는 게 뭘까?',
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_self_love_03',
        question: '지금 상태가 계속되면 관계는 어떻게 될까?',
        price: 900,
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
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_02',
        question: '최악의 시나리오를 현실적으로 보면?',
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_self_career_03',
        question: '10년 뒤, 지금 결정에 대해 후회할까?',
        price: 900,
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
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_02',
        question: '상대의 행동 패턴에서 읽을 수 있는 건?',
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_other_love_03',
        question: '상대가 바꾸기 어려워할 부분은?',
        price: 900,
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
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_02',
        question: '주도적으로 움직이지 않는 근본 이유는?',
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_other_career_03',
        question: '이 팀에서 저 사람에게 필요한 건?',
        price: 900,
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
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_02',
        question: '상대는 이 패턴을 바꾸고 싶을까?',
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_love_03',
        question: '패턴을 깨기 위해 내가 할 수 있는 건?',
        price: 900,
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
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_02',
        question: '누가 먼저 변해야 이 구조가 바뀔까?',
        price: 900,
        isPurchased: false,
      },
      {
        id: 'pq_relationship_career_03',
        question: '조직 관점에서 이 팀에게 필요한 건?',
        price: 900,
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
