import { FullReport } from '@/types/report';
import { AnalysisSession } from '@/types/analysis';

/**
 * 프론트엔드 데모용 더미 분석 세션 데이터.
 * analysisSession을 더미 리포트에 함께 제공하기 위해 분리.
 */
export const DUMMY_ANALYSIS_SESSIONS: Record<string, AnalysisSession> = {
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
