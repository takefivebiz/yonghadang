# AI 프롬프트 템플릿

코어로그 리포트 생성을 위한 AI 프롬프트 템플릿 모음.

## 구조

```
/prompts
  ├── free-report-prompts.ts    # 무료 리포트 생성 프롬프트
  ├── paid-question-prompts.ts  # 유료 질문 생성 프롬프트
  └── README.md                 # 이 파일
```

## 무료 리포트 생성 프롬프트

**파일**: `free-report-prompts.ts`

### 목적
사용자의 분석 결과(성향, 답변)를 기반으로 3섹션 구조의 무료 리포트 생성.

### 구조
```
1. headline: 한 문장 핵심 요약
2. sections: 3개 섹션
   - 현재 상태/지금 상황
   - 반복되는 패턴
   - 선택 구조/심리적 기저
3. deficitSentence: 무료 리포트의 한계를 지적하며 유료 확장으로 유도
```

### 카테고리별 특징

#### 연애
- 불확실성과 회피 구조에 포커스
- "왜 같은 상황에서 같은 선택을 할까?"
- 관계 초기 기대와 현실의 불일치

#### 감정
- 감정 변화의 패턴과 근본 원인
- 감정의 주기성과 트리거
- "무엇이 나를 흔들고 있는가?"

#### 인간관계
- 반복되는 거리감과 어색함
- 관계를 만드는 자신의 방식
- "왜 가까워질수록 어색해질까?"

#### 직업/진로
- 선택의 회피와 불확실성
- 준비의 무한 루프
- "무엇이 나를 움직이지 못하게 하는가?"

### 사용 방법

```typescript
import { getFreeReportPrompt, PromptContext } from '@/prompts/free-report-prompts';

const context: PromptContext = {
  topTraits: [
    { trait: '불안형', score: 8.1 },
    { trait: '타인중심형', score: 7.9 },
    { trait: '회피형', score: 6.5 },
  ],
  reportTone: '감정형',
  questionStrategy: '감정중심',
  userAnswers: ['뭘 원하는지 모르겠어', '상대가 ...'],
  category: '연애',
};

const prompt = getFreeReportPrompt(context);
// Anthropic API에 prompt 전달
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1500,
  messages: [{ role: 'user', content: prompt }],
});
```

## 유료 질문 생성 프롬프트

**파일**: `paid-question-prompts.ts`

### 목적
무료 리포트의 deficitSentence에서 드러난 문제를 더 깊이 탐색하는 3가지 질문 생성.

### 질문의 3가지 각도

1. **원인/근원**: 문제의 근본 원인 파고들기
   - "이 불안감은 어디서 비롯됐을까?"
   - "진짜 두려움은 무엇인가?"

2. **결과/미래**: 현재 상태가 계속되면?
   - "이 상태가 계속되면 어떻게 될까?"
   - "후회할 가능성은?"

3. **해결책/구조**: 변화 가능성과 행동
   - "지금 내가 할 수 있는 선택은?"
   - "다음은 무엇을 해야 할까?"

### 사용 방법

```typescript
import { getPaidQuestionsPrompt, PaidQuestionContext } from '@/prompts/paid-question-prompts';

const context: PaidQuestionContext = {
  deficitSentence: '근데 여기서 하나 빠져 있어. 네가 이 관계를 계속 붙잡고 있는 진짜 이유가 아직 안 나왔어.',
  topTraits: [...],
  reportTone: '감정형',
  category: '연애',
  subcategory: '썸',
};

const prompt = getPaidQuestionsPrompt(context);
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 800,
  messages: [{ role: 'user', content: prompt }],
});
```

## AI 모델 선택

현재 권장: **claude-3-5-sonnet-20241022**

이유:
- 빠른 응답 (비용 최적)
- 일관된 JSON 형식 출력
- 한국어 이해도 우수
- 긴 컨텍스트 처리 가능

## 응답 형식

### 무료 리포트 응답
```json
{
  "headline": "확신은 없는데, 그렇다고 관계를 끊지도 못하고 계속 보고 있는 상태야.",
  "sections": [
    {
      "title": "지금 상태",
      "paragraphs": [
        "결정을 해야 하는 순간을 계속 미루는 구조로 움직이고 있어.",
        "상대가 나를 어떻게 생각하는지 확인하고 싶은데, 동시에 그 답을 알게 될까 봐 두렵기도 한 이중 구조야."
      ]
    },
    {
      "title": "반복되는 패턴",
      "paragraphs": [...]
    },
    {
      "title": "선택 구조",
      "paragraphs": [...]
    }
  ],
  "deficitSentence": "근데 여기서 하나 빠져 있어. 네가 이 관계를 계속 붙잡고 있는 진짜 이유가 아직 안 나왔어."
}
```

### 유료 질문 응답
```json
{
  "paidQuestions": [
    {
      "id": "pq_love_01",
      "question": "이 불안감은 어디서 비롯된 걸까?",
      "price": 900
    },
    {
      "id": "pq_love_02",
      "question": "상대와 관계 없이 나 혼자서 할 수 있는 게 뭘까?",
      "price": 900
    },
    {
      "id": "pq_love_03",
      "question": "지금 상태가 계속되면 관계는 어떻게 될까?",
      "price": 900
    }
  ]
}
```

## 오류 처리

### JSON 파싱 실패
- 응답이 JSON이 아닌 경우: 재시도
- 필수 필드 누락: 에러 로깅 후 기본값 제공

### 콘텐츠 필터
- 부적절한 내용 감지: 재생성 요청
- 타임아웃: 기본 템플릿 사용

## 버전 관리

프롬프트 템플릿 업데이트 시:
1. 버전 번호 증가 (v1.0 → v1.1)
2. CHANGELOG 기록
3. DB의 promptVersion 필드 업데이트
4. 이전 버전으로 생성된 리포트는 유지

## TODO

- [ ] 프롬프트 버전 관리 시스템
- [ ] A/B 테스트 인프라
- [ ] 사용자 피드백 기반 프롬프트 최적화
- [ ] 카테고리별 이상 감지 (예: 부정적 톤 과다)
- [ ] 다국어 지원 (영어, 일본어 등)
