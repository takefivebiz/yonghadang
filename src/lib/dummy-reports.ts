import { FullReport } from '@/types/report';

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
        question: '상대가 나를 어떻게 보고 있을까? — 시선 구조 분석',
        price: 4900,
        isPurchased: false,
      },
      {
        id: 'pq_love_02',
        question: '내가 이 관계에서 반복하는 선택 구조는 뭘까?',
        price: 4900,
        isPurchased: false,
      },
      {
        id: 'pq_love_03',
        question: '지금 이 감정이 진짜 연애 감정인지, 다른 무언가인지 구분하기',
        price: 4900,
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
        question: '내가 진짜 원하는 방향과 현실 기준 사이의 충돌 구조',
        price: 4900,
        isPurchased: true,
        report: [
          {
            title: '충돌의 원인',
            paragraphs: [
              '네가 현실 기준이라고 부르는 것들 — 안정성, 수입, 리스크 — 이건 진짜 네 기준이 아니야.',
              '주변에서 반복적으로 들어온 기준을 내면화한 거야. 내면화가 너무 깊어서 네 것처럼 느껴지는 것뿐이야.',
              '진짜 충돌은 "하고 싶은 것 vs 해야 하는 것"이 아니라, "내 기준 vs 내면화된 타인의 기준"이야.',
            ],
          },
        ],
      },
      {
        id: 'pq_career_02',
        question: '이 선택 앞에서 내가 회피해온 것들',
        price: 4900,
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
