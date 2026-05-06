# Product Requirements Document (PRD)

# VEIL — 콘텐츠 기반 자기 해석 서비스

---

## 1. 프로젝트 개요

- **프로젝트명:** VEIL
- **목표:** 간단한 입력을 통해 사용자의 현재 상황, 감정, 관계를 해석하고, 즉시 소비 가능한 형태로 제공하는 수익형 웹 서비스.
- **핵심 가치 1:** 사용자가 이미 가지고 있는 고민을 선명하게 드러내고, "이거 내 얘기다"라는 직관적인 자기 인식을 만든다.
- **핵심 가치 2:** 사용자가 감정 흐름을 따라가며 자연스럽게 몰입하고, 대화가 이어지듯 결과를 소비하도록 만든다.

---

## 2. 타겟 유저

- 지금 자신의 상황이나 감정이 헷갈리는 20~30대 여성
- 연애, 인간관계, 진로 등 "지금 상태"에 대한 해석을 원하는 유저
- MBTI/테스트처럼 정해진 결과보다 "이해되는 느낌"을 원하는 유저
- 짧은 콘텐츠를 빠르게 소비하면서도, 공감되면 더 깊이 보고 싶은 유저

---

## 3. 기술 스택

| 영역         | 기술                                         |
| ------------ | -------------------------------------------- |
| Framework    | Next.js 15 (App Router, Turbopack)           |
| Language     | TypeScript                                   |
| Styling      | Tailwind CSS v4, shadcn/ui                   |
| Backend & DB | Next.js API Routes, Supabase (PostgreSQL 17) |
| Payment      | Toss Payments                                |
| AI           | Anthropic SDK (Claude Sonnet 4)              |
| Analytics    | GA4                                          |
| Testing      | Playwright (E2E)                             |

---

## 4. 디자인 가이드

### Theme

**Emotional Narrative, Midnight Diary, Quiet Conversation**

**핵심 키워드:**

- midnight
- diary
- faded emotion
- emotional archive
- quiet conversation
- blurred memory
- secret message
- emotional depth

---

### Interaction Principles

- 감정 흐름 중심 UX
- 조용하고 부드러운 인터랙션
- 과한 motion보다 리듬 우선
- 화면 전환은 “장면 전환”처럼 느껴져야 함

---

### Motion

- 최소 애니메이션 원칙 유지
- fade / opacity / soft transition 중심
- spring animation 과다 사용 금지
- 과한 parallax, 3D motion 금지

### Color System

#### 방향성

- 감정의 온도 중심
- muted color 우선
- deep midnight tone 유지
- neon / cyberpunk 느낌 지양

---

#### Core Palette

| 역할              | 색상      |
| ----------------- | --------- |
| Background        | `#11111B` |
| Surface           | `#1C1B2D` |
| Surface Secondary | `#23213A` |
| Emotional Accent  | `#C98BB0` |
| Soft Lavender     | `#9E8AC9` |
| Dusty Blue        | `#7C95B8` |
| Primary Text      | `#F3EFE7` |
| Secondary Text    | `#A8A1B5` |
| Muted Text        | `#6E6880` |

---

#### Color Usage Rules

- 강조색 최소 사용
- CTA / 감정 포인트에만 accent 사용
- dark background 유지
- colorful UI 지양
- quiet mood 우선

---

#### Texture & Visual Elements

사용 가능:

- subtle gradient haze
- blurred light
- faded glow
- noise texture
- paper texture
- soft shadow
- emotional fade

규칙:

- 효과는 “느껴질 정도”만 사용
- 과한 장식 금지

---

### 절대 금지

- cyberpunk 스타일
- neon glow 남용
- RGB 계열 색상
- glassmorphism 과다 사용
- 과한 gradient
- 밝은 배경
- dashboard 스타일 UI
- AI SaaS 느낌
- 과한 floating animation
- 무거운 particle effect

---

## 5. 프론트엔드 요구사항

### 5.1 Global Layout

**상단 네비게이션 바**

- (공통) 홈 로고
- (비회원) 로그인 / 조회
- (회원) 마이페이지

> **조회 버튼 동작:**
>
> - 로그인 상태 → 마이페이지로 이동
> - 비회원 → 비회원 조회 모달 열기 (전화번호 + PIN 입력 후 `/api/guest/verify` 호출)

**Footer**

- 사업자 정보, 이용약관 링크, 개인정보처리방침 링크, 문의하기

**Head & Meta**

- SEO, Open Graph, GA4 Analytics 설정

---

### 5.2 유저 UX 페이지

### 5.2.1 메인 페이지 (`/`)

**구성 흐름**

MiniHero → TrendingSection → CategoryTabs → ContentSection

---

#### MiniHero

- 작게: 사주 ∙ MBTI처럼 끼워넣은 나 말고,
- 크게: 베일에 가려진 진짜 나를 찾다

---

#### TrendingSection

텍스트: 지금 많이 보는  
구조: 카드 카드 카드 카드 → 가로 스크롤

- 각 카드에 카테고리 뱃지

---

#### CategoryTabs

**구조:**  
연애 / 인간관계 / 직업·진로 / 감정

**역할:**

- 카테고리 섹션으로 빠르게 이동
- 클릭 시 해당 ContentSection으로 스크롤 이동

---

#### ContentSection

카테고리별로 4개 구성:

- 연애
- 인간관계
- 직업·진로
- 감정

**구조:**

카테고리 이름 - 전체보기  
카드 카드 카드 카드 카드 → 가로 스크롤

---

### 카테고리 전체보기 페이지

각 ContentSection의 `전체보기` 클릭 시 해당 카테고리 콘텐츠 목록 페이지로 이동한다.

**경로 예시:**

- `/category/love`
- `/category/relationship`
- `/category/career`
- `/category/emotion`

**구성:**

카테고리 제목  
카테고리 설명  
콘텐츠 피드 (세로 스택 카드)

**동작 방식:**

- 선택한 카테고리에 해당하는 콘텐츠만 노출한다.
- 메인 페이지의 가로 스크롤과 달리, "감정 해석 아카이브" 느낌의 콘텐츠 피드 형태로 보여준다.
- `GET /api/contents?category=love` 형태로 카테고리 필터를 적용한다.
- 콘텐츠 클릭 시 `/content/[id]`로 이동한다.
- 비활성 콘텐츠는 노출하지 않는다.

**카드 구조 (list variant):**

- 가로형 썸네일 (aspect 16:9)
- 제목 (텍스트 중심)
- 설명 (subtitle)
- 카테고리 라벨

**레이아웃 규칙:**

- 모바일: 1열 (풀 너비 스택)
- 데스크톱: 2열 (감정 해석 콘텐츠 피드처럼 자연스럽게 이어짐)

### ContentCard

**variant: "carousel"** (메인 페이지 가로 스크롤)

- 구조: 사각형 썸네일 (aspect 3:2)
- 카테고리 배지 우상단 표시
- 우하단 화살표 표시

**variant: "list"** (카테고리 전체보기 페이지)

- 구조: 세로 스택 (이미지 위, 텍스트 아래)
- 이미지: 가로형 (aspect 16:9)
- 제목, 설명, 카테고리 라벨을 텍스트 기반으로 표시
- 콘텐츠 피드 느낌의 카드 디자인

**공통:**

- 클릭 시 `/content/[id]`로 이동
- `contents` 더미 데이터를 사용한다.
- 카테고리별로 콘텐츠를 필터링한다.
- 각 카테고리는 `ContentSection`으로 구성한다.
- `CategoryTabs`는 해당 카테고리 섹션으로 이동하는 역할을 한다.

---

**구현 기준**

- 기존 디렉토리 구조를 유지한다.
- `components/home` 안의 파일만 사용한다.
- 컴포넌트는 `default export` 기준으로 import한다.
- `named export`를 사용하지 않는다.
- import 에러가 발생하지 않도록 파일명과 import 경로를 일치시킨다.

---

#### 5.2.2 콘텐츠 진입 (`/content/[id]`)

- 메인 카드 클릭 시 해당 페이지로 이동한다.
- 이 페이지는 긴 상세 설명 페이지가 아니라,
  사용자가 감정 흐름 안으로 자연스럽게 들어가도록 만드는 narrative intro 역할을 한다.
- 사용자는 “테스트를 시작한다”보다,
  “하나의 감정 흐름을 읽기 시작한다”는 느낌을 받아야 한다.

---

### 구성

- 콘텐츠 제목
- 짧은 intro text
- 인사이트 preview
- CTA 버튼

---

### intro text

콘텐츠의 분위기와 감정 흐름을 짧게 전달한다.

규칙:

- 길게 설명하지 않는다.
- 기능 설명보다 감정 연결을 우선한다.
- 1~3문장 이내로 구성한다.
- “분석”, “테스트”, “진단” 같은 표현을 사용하지 않는다.

예시:

```txt
좋아해서 확인하는 건지,
불안해서 확인하는 건지.
```

---

### 인사이트 preview

사용자가 이 흐름에서 보게 될 감정 포인트를 미리 보여준다.

목적:

- 결과 흐름에 대한 기대감 형성
- “내 이야기 같다”는 감각 유도
- 이후 유료 scene에 대한 curiosity 형성

규칙:

- 최대 3~4개
- 짧고 감정 중심 문장 사용
- 분석 항목처럼 보이면 안 된다.
- 긴 설명 금지
- scene 제목처럼 느껴져야 한다.

예시:

- 왜 자꾸 반응을 확인하게 되는지
- 관계보다 불안이 더 커진 순간
- 어디서부터 감정이 흔들리기 시작했는지

---

### CTA 버튼

CTA는 “결제”나 “테스트 시작” 느낌보다,
흐름 안으로 들어가는 느낌을 우선한다.

사용 가능 예시:

- 시작하기
- 이 흐름 시작하기

---

### UX 규칙

- 예상 소요 시간을 강조하지 않는다.
- “무료 scene 몇 개 제공” 같은 상품 구조 설명을 노출하지 않는다.
- 콘텐츠 설명보다 빠른 몰입과 진입 속도를 우선한다.
- 사용자는 “설명을 읽는다”보다,
  “이미 감정 흐름 안에 들어가고 있다”는 느낌을 받아야 한다.

---

### 동작

- CTA 버튼 클릭 시 세션을 생성한다.
- 프론트 구현 단계에서는 mock session을 생성한다.
- 이후 백엔드 연동 시 `POST /api/analyze`로 실제 session을 생성한다.
- 세션 생성 후 `/analyze/[session_id]`로 이동한다.

---

#### 5.2.3 입력 단계 (`/analyze/[session_id]`)

입력 단계는 사용자의 현재 상황을 수집하고,
보정 질문을 통해
AI가 감정 흐름과 관계 구조를 파악하는 단계다.

사용자는 “질문에 답한다”보다,
감정 흐름 안에서 자신의 상태를 하나씩 꺼내는 느낌을 받아야 한다.

입력 단계는 테스트/설문처럼 보이면 안 되며,
조용한 대화 흐름처럼 느껴져야 한다.

---

### 공통 목적

- 사용자의 현재 상황을 충분히 확보한다.
- 감정 흐름과 행동 패턴을 파악한다.
- 입력 단계에서는 결론이나 해석을 직접적으로 제공하지 않는다.
- 사용자가 자연스럽게 자신의 감정을 돌아보게 만든다.
- 최종 해석은 결과 페이지에서만 제공한다.

---

### 입력 방식

VEIL의 초기 버전(v1)은  
모든 콘텐츠를 `자유 입력 + 보정 질문` 기반으로 진행한다.

사용자가 자신의 상황을 직접 설명해야만,
AI가 실제 상황에 가까운 narrative 흐름을 생성할 수 있기 때문이다.

선택형 질문만으로 구성된 입력 방식(Type B)은
향후 경량 콘텐츠에서만 제한적으로 도입할 수 있다.

---

### 자유 입력 + 보정 질문

#### 구성

1. 자유 입력 1회
2. 보정 질문 5~8개
3. 입력 완료 후 결과 생성

---

### 자유 입력

- 현재 상황을 자유롭게 작성한다.
- 최대 500자 입력 가능
- 여러 줄 입력 가능
- 입력이 길수록 해석 정확도가 높아진다.

규칙:

- 테스트 입력창처럼 보이면 안 된다.
- “분석용 데이터 입력”보다,
  현재 감정을 조용히 꺼내는 느낌을 우선한다.

예시 문구:

```txt
지금 네 마음에 가장 오래 남아있는 상황부터 적어줘.
```

placeholder 예시:

```txt
예: 자꾸 상대가 의심되고,
확인하면 안 되는 걸 알면서도
휴대폰이나 SNS를 보게 돼.
```

---

### 자유 입력 보조 기능

입력 부담을 줄이기 위해,
예시 문장을 선택할 수 있는 UI를 제공한다.

- 예시 문장은 참고용으로만 제공한다.
- 클릭 시 입력창에 삽입된다.
- 사용자는 일부 수정 후 제출해야 한다.
- 예시 문장과 완전히 동일한 경우 제출을 제한한다.
- 초기 버전에서는 유사도 검사를 적용하지 않는다.

예시 문장 기준:

- 실제 상황처럼 느껴져야 한다.
- 감정 + 행동이 포함되어야 한다.
- 추상적인 표현보다 구체적인 표현을 우선한다.

---

### 보정 질문

자유 입력 후,
콘텐츠별 보정 질문을 순차적으로 보여준다.

보정 질문은 다음 요소를 파악하기 위해 사용한다:

- 감정 반응 강도
- 행동 패턴
- 관계 기준
- 감정 반복 구조
- 해석 방향

규칙:

- 총 5~8개
- 질문은 한 화면에 하나씩 보여준다.
- 단일 선택 / 복수 선택 지원
- 질문별 조건 분기 가능
- 이전 답변에 따라 다음 질문이 달라질 수 있음
- 콘텐츠마다 질문 구조가 다름
- 질문 번호를 강조하지 않는다.
- 테스트/설문처럼 보이면 안 된다.

---

### 입력 흐름 UX

입력 단계는 단순 설문 플로우가 아니라,
감정 흐름이 이어지는 구조처럼 느껴져야 한다.

규칙:

- 사용자가 선택하면 자연스럽게 다음 흐름으로 이어진다.
- “다음” 버튼 사용을 최소화한다.
- fade / opacity 기반의 부드러운 전환을 사용한다.
- 과한 animation은 사용하지 않는다.
- 진행 상태는 subtle하게 표시한다.
- 숫자 기반 진행률보다 line / dot 기반 표현을 우선한다.

---

### 선택 후 reaction

일부 질문에서는
사용자 선택 이후 짧은 reaction line을 보여줄 수 있다.

목적:

- 입력 흐름의 immersion 유지
- 설문 느낌 완화
- 감정 흐름 연결

규칙:

- 모든 질문에 reaction을 사용하지 않는다.
- 전체 입력 단계에서 2~3회 정도만 제한적으로 사용한다.
- reaction은 짧고 담백해야 한다.
- 분석 결과처럼 보이면 안 된다.
- “대화 흐름”처럼 느껴져야 한다.

예시:

```txt
생각보다 오래 신경 쓰고 있었네.
```

```txt
이미 마음은 꽤 흔들리고 있었어.
```

금지 예시:

```txt
너는 불안형 애착 성향이 강해.
```

```txt
감정 의존도가 높게 나타났어.
```

#### Reaction 관리 규칙

reaction은 선택지 또는 질문 단위로 관리할 수 있다.

목적:

- 콘텐츠별 톤 통제
- narrative 흐름 유지
- AI 생성 의존도 최소화
- 입력 단계 pacing 제어

규칙:

- reaction은 콘텐츠 관리에서 직접 설정 가능해야 한다.
- 선택지별 개별 reaction을 설정할 수 있다.
- reaction이 없는 선택지는 공통 fallback reaction을 사용할 수 있다.
- reaction은 생성형 AI가 아니라 사전 정의 데이터 기반으로 우선 관리한다.

예시 구조:

```ts
type QuestionOption = {
  id: string;
  label: string;
  value: string;
  reaction?: string;
};
```

예시:

```ts
{
  id: "q1_a",
  label: "괜찮은 척했지만 계속 신경이 쓰였어",
  value: "masked_anxiety",
  reaction: "겉으론 넘긴 척했지만, 마음은 계속 반응하고 있었네."
}
```

fallback reaction 예시:

```txt
좋아. 이 흐름도 같이 볼게.
```

---

### 입력 데이터 저장

입력 완료 시 다음 데이터를 저장한다:

- `session_id`
- `content_id`
- 자유 입력 내용
- 보정 질문 응답
- 질문 분기 이력
- inferred_user_type
- 생성 시점
- 결과 생성용 raw input data

---

### 사용자 타입 추론

입력 단계 데이터는 결과 생성 전,
사용자의 감정 흐름과 행동 패턴을 추론하는 데 사용된다.

추론 요소:

- 불안도
- 감정 반응 강도
- 행동 패턴
- 관계 기준
- 감정 반복 구조
- 해석 방향

주의:

- 타입명을 직접적으로 노출하지 않는다.
- 테스트 결과처럼 보이면 안 된다.
- “분석”보다 “들킨 느낌”에 가까워야 한다.

금지 예시:

```txt
너는 회피형이야
```

```txt
너는 자기검열형이야
```

```txt
불안도가 높게 나왔어
```

---

### 결과 생성 연결

입력이 완료되면,
사용자의 자유 입력과 보정 질문 응답을 기반으로
AI 결과를 생성한다.

AI는 다음 정보를 활용한다:

- 콘텐츠 주제
- 자유 입력
- 보정 질문 응답
- 감정 흐름
- 행동 패턴
- 관계 구조
- 콘텐츠별 narrative 흐름 구조

결과는 감정 흐름을 따라가는
narrative experience 형태로 제공한다.

---

### UX 규칙

- 입력 단계에서는 결과를 직접적으로 미리 노출하지 않는다.
- 사용자는 “분석받고 있다”보다,
  “감정 흐름 안으로 들어가고 있다”는 느낌을 받아야 한다.
- 질문 자체가 narrative 흐름 일부처럼 느껴져야 한다.
- 입력 단계는 결과 페이지보다 감정 밀도를 낮게 유지한다.
- 과한 감성 표현이나 과도한 공감 표현을 사용하지 않는다.

---

#### 5.2.4 결과 페이지 (`/result/[session_id]`)

결과 페이지는 “AI 리포트”가 아니라,
사용자의 감정과 관계 흐름을 따라가는
narrative experience 형태로 구성된다.

사용자는 위에서 아래로 스크롤하며
하나의 감정 흐름을 따라가게 된다.

사용자는 결과를 “읽는다”보다,
누군가가 조용히 정리해준 감정 흐름을 따라가는 느낌을 받아야 한다.

---

### 결과 구조

프론트 UX에서는 `scene` 단위로 결과를 제공한다.

각 scene은:

- 감정 흐름의 한 구간
- 관계 구조의 일부
- 핵심 감정 인식
- 다음 흐름으로 이어지는 감정 포인트

를 담당한다.

scene은 독립적이면서도,
전체적으로 하나의 대화처럼 이어져야 한다.

---

### 결과 흐름 구조

결과는 다음 흐름으로 진행된다:

```txt
무료 Scene 1
↓
무료 Scene 2
↓
전체 흐름 보기
(bottom sheet)
↓
유료 Scene 선택
↓
잠금 preview
↓
개별 구매 / 전체 구매
↓
이어서 읽기
```

---

### Scene Message Types

각 scene은 여러 개의 message로 구성된다.

---

#### ai

- 기본 메시지
- 감정을 조용히 해석하는 흐름
- 메신저/대화 느낌 기반

---

#### memo

- 감정 메모
- 핵심 패턴 요약
- 제한적으로만 사용
- scene 흐름을 끊지 않아야 한다

---

#### punch

- 짧고 강한 핵심 문장
- scene당 최대 1개 사용
- 과도한 명언 느낌 금지

---

### Scene UX 규칙

- scene은 하나의 감정 흐름처럼 이어져야 한다.
- 긴 문단보다 짧은 message 흐름을 우선한다.
- 여백과 spacing을 충분히 사용한다.
- 사용자는 자연스럽게 아래로 스크롤하게 되어야 한다.
- 결과는 “설명”보다 “흐름”처럼 느껴져야 한다.
- scene title은 narrative chapter처럼 느껴져야 한다.
- 분석 리포트/심리 테스트 느낌을 주면 안 된다.

---

### 무료 / 유료 구조

무료와 유료는 정보량이 아니라,
감정 흐름 기준으로 구분한다.

---

### 무료 영역

무료 scene은:

- 현재 상태 인식
- 감정 패턴 자각
- 핵심 문제 암시

를 중심으로 구성한다.

사용자가:

- “이거 내 얘기 같은데?”
- “왜 이 감정이 반복되지?”
- “다음 이야기가 궁금한데?”

상태가 되도록 설계한다.

---

### 유료 영역

유료 scene은:

- 근본 원인
- 반복 구조
- 관계 메커니즘
- 이후 흐름
- 선택 기준

을 더 깊게 다룬다.

사용자가 자신의 감정 흐름과 관계 구조를
더 깊게 이해할 수 있어야 한다.

---

### 무료 Scene 생성 규칙

- 입력 내용을 그대로 요약하지 않는다.
- 이미 알고 있는 감정을 반복하지 않는다.
- 실제 행동 / 감정 흐름 / 반복 패턴을 포함해야 한다.
- “들킨 느낌”이 발생해야 한다.
- 원인과 해결을 완전히 설명하지 않는다.
- 반드시 다음 흐름이 궁금해지는 상태로 끝나야 한다.

---

### 유료 Scene 생성 규칙

- 새로운 관점 또는 추가 정보가 반드시 포함되어야 한다.
- 같은 내용을 다른 표현으로 반복하지 않는다.
- 감정 원인 / 반복 구조 / 관계 메커니즘 / 이후 흐름 중 최소 2개 이상 포함한다.
- “설명”보다 “스스로 깨닫게 만드는 흐름”을 우선한다.

---

### Scene 연결 규칙

- scene은 감정 흐름이 점점 깊어지도록 설계한다.
- 마지막 message는 다음 흐름을 암시해야 한다.
- 다음 내용을 직접 설명하지 않는다.
- 사용자가 자연스럽게 다음 scene으로 스크롤하게 만들어야 한다.
- 감정 흐름이 끊기지 않아야 한다.

---

### 전체 흐름 보기 (Bottom Sheet)

무료 scene 이후,
사용자는 결과 흐름을 계속 스크롤할 수 있다.

무료 구간이 끝나면,
“전체 흐름 보기” UI를 통해
bottom sheet를 열 수 있다.

bottom sheet는:

- 결과 전체 목차
- 읽은 scene
- 잠긴 scene
- 앞으로 이어질 흐름

을 보여주는 역할을 한다.

목적:

- 결과 구조 preview 제공
- 이후 감정 흐름에 대한 curiosity 형성
- 사용자가 원하는 흐름 선택 가능
- 전체 구매 유도

규칙:

- 항상 노출되는 navigation처럼 보이면 안 된다.
- “메뉴”보다 “감정 흐름 preview”처럼 느껴져야 한다.
- 읽은 scene과 잠긴 scene을 구분한다.
- 잠긴 scene title 자체가 curiosity를 유도해야 한다.

예시:

```txt
✓ 감정이 흔들리기 시작한 순간
✓ 관계의 균열이 시작된 순간
🔒 반복되는 불안의 패턴
🔒 네 마음이 더 지쳐버린 이유
🔒 아직 끝나지 않은 감정
```

---

### 잠금 UX

유료 scene은 갑작스럽게 차단하지 않는다.

대화 흐름이 이어지다가
점진적으로 fade-out 되며,
사용자는 “대화가 끊긴 느낌”을 경험해야 한다.

잠금 상태는 placeholder처럼 보이면 안 된다.

사용자는:

- “이 다음 이야기가 궁금하다”
- “조금만 더 읽고 싶다”

는 감정을 느껴야 한다.

CTA는 “결제 버튼”보다
“이어서 읽기”에 가까운 흐름이어야 한다.

---

### 유료 Scene 진입

사용자가 bottom sheet에서
잠긴 scene을 선택하면,
해당 scene의 preview 화면으로 진입한다.

preview에서는:

- scene title
- 일부 preview message
- fade-out 흐름

을 보여준다.

핵심 해석은 반드시 숨긴다.

사용자는:

- “뒤 내용이 궁금하다”
- “계속 읽고 싶다”

는 감정을 느껴야 한다.

---

### 결제 및 노출 방식

- 무료 scene은 전체 노출된다.
- 유료 scene은 preview 형태로 일부만 노출된다.
- 전체 내용은 결제 후 열람 가능하다.
- 잠금 영역은 fade-out 기반으로 노출한다.
- 핵심 해석은 반드시 숨긴다.

---

### 결제 구조

가격:

- 개별 scene 열기: 900원
- 전체 열기: 2,900원

규칙:

- 개별 구매와 전체 구매를 모두 지원한다.
- 전체 구매를 메인 CTA로 우선 노출한다.
- 사용자는 “결제”보다 “이어서 읽기”에 가까운 흐름을 느껴야 한다.
- “상품 구매”보다 “감정 흐름 continuation” 느낌을 우선한다.

CTA 예시:

- 이 흐름 이어보기
- 전체 흐름 이어읽기
- 계속 읽기

---

#### 비회원 조회 모달

네비게이션 바 "조회" 버튼 클릭 시 표시

**Step 1 — 인증**

```
┌──────────────────────────┐
│ 비회원 조회               │
├──────────────────────────┤
│ 전화번호                  │
│ [010-1234-5678]          │
│                          │
│ 비밀번호 (4자리)          │
│ [****]                   │
│                          │
│ [확인]                   │
└──────────────────────────┘
```

- [확인] → `POST /api/guest/verify` 호출
- 실패 시 → "일치하는 기록이 없습니다" 에러 표시 (모달 유지)

**Step 2 — 세션 목록 선택**

인증 성공 시, 동일 모달 내에서 보유한 결과 목록을 표시한다.

- 목록에는 `content_title`, `category`, `created_at`, `has_purchase` 표시
- 항목 클릭 시 → 해당 세션의 `guest_token`을 저장 후 `/result/[session_id]`로 이동
- 세션이 1개뿐인 경우 목록 화면 없이 바로 해당 `/result/[session_id]`로 이동

---

#### 마이페이지 (`/my-page`)

- 회원만 접근 가능
- 닉네임 (수정 가능), 소셜 서비스 로고 (구글/카카오), 이메일, 로그아웃
- 나의 결과 목록
- 구매 내역

---

#### 로그인 페이지 (`/auth`)

- 구글, 카카오 소셜 로그인만 지원
- 로그인 완료 후 `/` 으로 리다이렉트

---

### 5.3 관리자 UX 페이지

#### 공통 레이아웃

- 좌측 네비게이션 패널: 매출 조회 / 주문 내역 / 유저 리스트 / 콘텐츠 관리
- 우측: 각 메뉴별 콘텐츠

---

#### 관리자 메인 (`/admin`)

기간별 매출 조회 대시보드 (기본 화면)

---

#### 주문 내역 리스트 (`/admin/order-list`)

- 결제 완료 주문 리스트 표
- 클릭 시 상세 주문 페이지로 이동

---

#### 상세 주문 내역 (`/admin/order-list/[order_id]`)

노출 정보:

- 회원 / 비회원 여부
- 구매자 정보
- 결제 상태 및 금액
- 유저 입력 내용
- AI 생성 scene 전체

**AI 재생성:**

[재생성 요청] 버튼 클릭 시:

```
┌──────────────────────────────┐
│ AI 해석 재생성                │
├──────────────────────────────┤
│ 재생성 사유 (필수)            │
│ ○ AI 응답 오류               │
│   (로직 에러, 중복 문장 등)   │
│ ○ 관련성 낮음                 │
│   (사용자 입력과 무관)        │
│ ○ 부정적 톤                   │
│   (너무 부정적이거나 상처 유발)│
│ ○ 기타                       │
│                              │
│ 추가 지시사항 (선택)          │
│ [더 긍정적으로 해줘...]       │
│                              │
│ [재생성]                     │
└──────────────────────────────┘
```

- `POST /api/admin/sessions/[session_id]/regenerate` 호출
- 기존 scene 교체, `ai_regeneration_logs` 기록

---

#### 콘텐츠 관리 (`/admin/contents`)

콘텐츠 생성/수정 페이지

**기본 정보 설정:**

- 제목
- 카테고리 (연애 / 인간관계 / 직업·진로 / 감정)
- 썸네일 이미지
- 활성화 여부

**입력 타입 선택 및 질문 설정:**

- 입력 타입은 v1에서 자유 입력 + 보정 질문만 지원한다.
- Type B 선택형 질문 전용 입력은 향후 확장 항목으로 보류한다.

콘텐츠 관리에서는 다음 항목을 설정할 수 있다:

- **자유 입력 placeholder:** 사용자가 입력할 때 보이는 예시 텍스트
- **자유 입력 보조 예시 문장:** 사용자가 참고할 수 있는 예시 문장 목록 (아코디언)
- **보정 질문 목록:** 5~8개 질문
  - 각 질문별 텍스트
  - 각 질문별 선택지
  - 단일 선택 vs 복수 선택 여부
  - 질문별 조건 분기 설정 (이전 답변에 따라 다음 질문 변경)
  - 각 선택지별 reaction line

**Scene 설정:**

Scene 1 (무료)
제목: [현재 감정 인식]

Scene 2 (무료)
제목: [감정 패턴 자각]

Scene 3 (유료)
제목: [왜 반복되는지]

Scene 4 (유료)
제목: [관계 구조]

Scene 5 (유료)
제목: [이후 흐름]

Scene 6 (유료)
제목: [선택 기준]

**프롬프트 설정:**

각 scene별 AI 생성 프롬프트를 설정한다. 프롬프트는 다음 데이터를 사용할 수 있다:

- `content_title`: 콘텐츠 제목
- `category`: 카테고리
- `user_input`: 사용자 자유 입력 (Type A)
- `answers`: 모든 질문 응답
- `inferred_user_type`: AI가 추론한 사용자 타입
- `scene_index`: 현재 scene 인덱스
- `scene_title`: 현재 scene 제목

---

#### 유저 리스트 (`/admin/user-list`)

- 회원 + 비회원 유저 리스트
- 회원 / 비회원 필터
- 유저별 결제 여부 확인

---

## 6. 백엔드 요구사항

> Next.js 15 App Router (Route Handlers) + Supabase 기반  
> 모든 API는 `app/api/` 하위에 위치하며 `route.ts` 파일로 정의됨

---

### 목차

1. [설계 원칙](#설계-원칙)
2. [공통 규약](#공통-규약)
3. [인증](#인증)
4. [콘텐츠](#콘텐츠)
5. [분석 세션](#분석-세션)
6. [결과 Scene](#결과-scene)
7. [결제](#결제)
8. [비회원](#비회원)
9. [마이페이지](#마이페이지)
10. [관리자](#관리자)
11. [DB 스키마](#db-스키마)
12. [API 라우트 구조](#api-라우트-구조)

---

### 설계 원칙

- **MECE**: 각 엔드포인트는 단일 책임, 중복 없음
- **RESTful**: 리소스 중심 URL, HTTP 메서드로 행위 표현
- **인증 레이어 분리**: 회원 / 비회원 / 관리자를 미들웨어에서 명확히 구분
- **일관된 응답 포맷**: 모든 응답은 `{ data, error }` 구조 사용
- **페이지네이션 통일**: 모든 리스트 엔드포인트는 동일한 `pagination` 객체 반환
- **AI 호출 격리**: Claude 호출은 `/api/analyze/[session_id]/generate` 단일 경로에서만 수행

---

### 공통 규약

#### 응답 포맷

```json
// 성공 (단일 리소스)
{ "data": { ... } }

// 성공 (리스트)
{
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "total_pages": 8
    }
  }
}

// 실패
{
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "설명"
  }
}
```

#### HTTP 상태 코드

| 코드 | 의미             |
| ---- | ---------------- |
| 200  | 성공             |
| 201  | 리소스 생성 성공 |
| 400  | 잘못된 요청      |
| 401  | 미인증           |
| 403  | 권한 없음        |
| 404  | 리소스 없음      |
| 409  | 중복 충돌        |
| 500  | 서버 오류        |

#### 인증 방식

| 유형   | 방식                                                     |
| ------ | -------------------------------------------------------- |
| 회원   | Supabase Auth JWT → `Authorization: Bearer <token>` 헤더 |
| 비회원 | `X-Guest-Token` 헤더 (결제 후 발급, 30분 유효)           |
| 관리자 | Supabase Auth JWT + `profiles.role = 'admin'` 검증       |

#### 에러 코드 정의

| 코드                          | HTTP | 설명                                               |
| ----------------------------- | ---- | -------------------------------------------------- |
| `PAYMENT_AMOUNT_MISMATCH`     | 400  | 결제 금액 불일치 (위변조 시도)                     |
| `PAYMENT_CONFIRMATION_FAILED` | 400  | Toss 결제 승인 실패                                |
| `INVALID_PIN_FORMAT`          | 400  | PIN 형식 오류 (4자리 숫자 아님)                    |
| `MISSING_GUEST_AUTH`          | 400  | 비회원 인증 정보 누락                              |
| `UNAUTHORIZED`                | 401  | 인증 필요                                          |
| `GUEST_AUTH_FAILED`           | 401  | 비회원 전화번호/PIN 불일치                         |
| `TOKEN_EXPIRED`               | 401  | 비회원 토큰 만료                                   |
| `FORBIDDEN`                   | 403  | 권한 없음                                          |
| `CONTENT_NOT_FOUND`           | 404  | 콘텐츠 없음                                        |
| `SESSION_NOT_FOUND`           | 404  | 세션 없음                                          |
| `ORDER_NOT_FOUND`             | 404  | 주문 없음                                          |
| `SESSION_ALREADY_COMPLETED`   | 409  | 이미 완료된 세션에 결과 생성(generate) 재호출 시도 |

---

### 인증

> 소셜 로그인(Google / Kakao)은 Supabase Auth가 처리.  
> Next.js 서버는 콜백 수신 및 세션 설정만 담당.

#### `GET /api/auth/callback`

Supabase OAuth 콜백 수신 → 세션 쿠키 설정 → 리다이렉트 처리

| 항목      | 내용                        |
| --------- | --------------------------- |
| 인증      | 불필요                      |
| Query     | `code` (Supabase 발급 코드) |
| 성공 응답 | `302 Redirect`              |

리다이렉트 규칙:

- `redirect_to` 값이 존재할 경우 해당 경로로 이동
- 값이 없을 경우 `/`로 이동

예시:

- `/result/[session_id]`
- `/my-page`
- `/`

---

#### `POST /api/auth/logout`

세션 쿠키 삭제

| 항목      | 내용                              |
| --------- | --------------------------------- |
| 인증      | 회원 필요                         |
| 성공 응답 | `200 { data: { success: true } }` |

---

### 콘텐츠

#### `GET /api/contents`

콘텐츠 목록 조회 (메인 페이지 그리드)

| 항목      | 내용                                                                        |
| --------- | --------------------------------------------------------------------------- |
| 인증      | 불필요                                                                      |
| Query     | `category?: 'love'\|'relationship'\|'career'\|'emotion'`, `page?`, `limit?` |
| 성공 응답 | `200 { data: { items: Content[], pagination } }`                            |

```typescript
type Content = {
  id: string;
  title: string;
  subtitle: string | null;
  category: "love" | "relationship" | "career" | "emotion";
  thumbnail_url: string | null;
  estimated_minutes: number | null;
  input_config: {
    placeholder: string;
    example_inputs: string[];
    questions: {
      index: number;
      text: string;
      type: "single" | "multiple";
      options: {
        label: string;
        value: string;
        reaction?: string;
      }[];
    }[];
  };
  scene_config: {
    free_scene_count: number;
    paid_scene_count: number;
    scenes: {
      index: number;
      title: string;
      is_free: boolean;
      prompt: string;
    }[];
  };
  is_active: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
};
```

> 카테고리 UI 표시명: `love` → 연애, `relationship` → 인간관계, `career` → 직업·진로, `emotion` → 감정

---

#### `GET /api/contents/[id]`

콘텐츠 상세 조회

| 항목      | 내용                    |
| --------- | ----------------------- |
| 인증      | 불필요                  |
| Params    | `id`                    |
| 성공 응답 | `200 { data: Content }` |

---

### 분석 세션

#### `POST /api/analyze`

새로운 분석 세션 생성

| 항목      | 내용                                   |
| --------- | -------------------------------------- |
| 인증      | 불필요 (회원/비회원 모두)              |
| Body      | `{ content_id: string }`               |
| 성공 응답 | `201 { data: { session_id: string } }` |

**세션 소유자 처리:**

- 로그인 상태인 경우 `analysis_sessions.user_id`에 회원 ID를 연결한다.
- 비회원은 콘텐츠 진입 및 입력 단계에서 `guest_id` 없이 세션을 진행할 수 있다.
- `analysis_sessions.guest_id`는 최초 세션 생성 시 NULL일 수 있다.
- 비회원이 결제 단계에서 전화번호 + PIN을 입력하면 `guest_credentials`를 생성하거나 기존 값을 조회한다.
- 결제 intent 생성 시 해당 `guest_id`를 `analysis_sessions.guest_id`에 연결한다.

**세션 생성 제한:**

- 동일 IP 기준 짧은 시간 내 과도한 세션 생성을 제한한다.
- 동일 브라우저/디바이스에서 미완료 세션이 있는 경우 기존 세션을 재사용할 수 있다.
- 비정상적으로 반복 생성되는 요청은 rate limit 처리한다.

---

#### `POST /api/analyze/[session_id]/answers`

세션에 응답 저장

| 항목      | 내용                                                       |
| --------- | ---------------------------------------------------------- |
| 인증      | 불필요                                                     |
| Params    | `session_id`                                               |
| Body      | `{ answers: Answer[] }`                                    |
| 성공 응답 | `200 { data: { session_id: string, status: 'answered' } }` |

```typescript
type Answer = {
  question_index: number; // 질문 순서
  question_text: string; // 질문 텍스트 스냅샷
  answer_text?: string; // 자유 입력 또는 기타 텍스트 응답
  answer_options?: string[]; // 보정 질문 선택형 응답
};
```

응답 저장 규칙:

- 자유 입력과 보정 질문 응답을 함께 저장한다.
- 질문 분기 이력을 유지해야 한다.
- 질문 텍스트는 snapshot 형태로 저장한다.
- 콘텐츠 수정 이후에도 기존 응답 구조가 유지되어야 한다.
- 복수 선택 질문은 `answer_options` 배열로 저장한다.

---

#### `POST /api/analyze/[session_id]/generate`

AI 결과 scene 생성

| 항목      | 내용                                   |
| --------- | -------------------------------------- |
| 인증      | 불필요                                 |
| Params    | `session_id`                           |
| 성공 응답 | `201 { data: { session_id: string } }` |
| 실패      | `409` — 이미 completed 상태인 세션     |

> **호출 조건:**
>
> - `analysis_sessions.status = 'answered'` 상태에서만 생성 가능하다.
> - 이미 `completed`인 세션은 재생성을 차단한다.
>
> **내부 처리:**
>
> 1. `session_answers` 조회
> 2. 자유 입력과 보정 질문 응답을 기반으로 `inferred_user_type` 추론
> 3. `analysis_sessions.inferred_user_type` 저장
> 4. `contents.scene_config` 기반 scene 개수 및 프롬프트 결정
> 5. Claude에 사용자 입력 + inferred_user_type + scene별 프롬프트 전달
> 6. 생성 결과를 `result_scenes`에 scene별 저장
> 7. `analysis_sessions.status` → `completed`

---

### 결과 Scene

#### `GET /api/sessions/[session_id]/scenes`

결과 scene 조회

| 항목      | 내용                                      |
| --------- | ----------------------------------------- |
| 인증      | 불필요 (공개 URL)                         |
| Params    | `session_id`                              |
| 성공 응답 | `200 { data: { scenes: ResultScene[] } }` |

```typescript
type ResultScene = {
  id: string;
  scene_index: number;
  scene_title: string;
  is_free: boolean;
  is_unlocked: boolean;
  messages: SceneMessage[] | null; // 미구매 유료 scene은 null
  preview_messages: SceneMessage[] | null; // 잠금 scene 미리보기
};

type SceneMessage = {
  type: "ai" | "memo" | "punch";
  text: string;
};
```

> scene 노출 규칙:
>
> - 무료 scene: `messages` 전체 노출
> - 유료 scene (미구매): `messages`는 null, `preview_messages`만 노출
> - 유료 scene (구매): `messages` 전체 노출, `preview_messages`는 사용하지 않음
>
> `preview_messages` 생성 규칙:
>
> - 모든 유료 scene은 최소 일부 message를 preview 형태로 제공한다.
> - preview는 “대화가 이어지다가 끊긴 느낌”이어야 한다.
> - 핵심 해석은 반드시 숨긴다.
> - placeholder처럼 보이면 안 된다.
> - fade-out 기반 UX를 전제로 한다.

---

### 결제

#### `POST /api/payments/intent`

결제 주문 생성 (Toss 위젯 초기화용 `order_id` 발급)

| 항목      | 내용                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 인증      | 불필요 (회원/비회원 모두)                                                                                                       |
| Body      | `{ session_id: string, purchase_type: 'single'\|'all', target_scene_index?: number, guest_phone?: string, guest_pin?: string }` |
| 성공 응답 | `201 { data: { order_id: string, amount: number } }`                                                                            |

**비회원 PIN 처리:**

- PIN은 HTTPS 요청을 통해 서버로 전달된다.
- 서버는 PIN을 평문으로 저장하지 않는다.
- 서버에서 안전한 해시 알고리즘으로 `pin_hash`를 생성하여 저장한다.
- 인증 시 입력된 PIN을 동일 방식으로 해시한 뒤 `pin_hash`와 비교한다.

**동작 흐름:**

> 1. 비회원: `guest_phone` + `guest_pin` 수신
>    - `guest_credentials`에서 기존 비회원 확인 또는 신규 생성
> 2. 기존 `scene_unlocks` 조회
>    - 이미 구매한 scene이 있을 경우 해당 금액을 제외한 차액 계산
>    - 예) 900원짜리 scene 1개 기구매 후 전체(2,900원) 선택 시 → `amount = 2,000원`
> 3. `orders`에서 동일 세션의 `pending` 상태 주문 조회
>    - `session_id`, `purchase_type`, `target_scene_index`, `amount`가 모두 일치하는 경우에만 재사용
>    - 조건이 하나라도 다르면 기존 `pending` 주문을 `failed` 처리하고 새 주문 생성
>    - 해당하는 `pending` 주문이 없으면 신규 생성
> 4. 해당 `guest_id`를 `analysis_sessions.guest_id`에 연결 (NULL → guest_id 업데이트)
> 5. `order_id`, `amount` 반환
>
> **purchase_type:**
>
> - `single`: scene 1개 900원 (`target_scene_index` 필수)
> - `all`: 전체 유료 scene 2,900원
> - 이미 일부 유료 scene을 구매한 사용자가 전체 열기를 선택할 경우, 이미 결제한 금액을 제외한 차액만 결제한다.

---

#### `POST /api/payments/confirm`

Toss 결제 승인 및 scene 잠금 해제

| 항목      | 내용                                                                                                        |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| 인증      | 불필요                                                                                                      |
| Body      | `{ payment_key: string, order_id: string, amount: number }`                                                 |
| 성공 응답 | `200 { data: { unlocked_scene_indexes: number[], guest_token?: string, guest_token_expires_at?: string } }` |
| 실패      | `400` (금액 불일치, Toss 승인 실패 등)                                                                      |

> **내부 처리:**
>
> 1. `order_id`로 `orders` 조회
> 2. **금액 검증 (3단계)**
>    - DB `orders.amount` vs 클라이언트 `amount` 비교
>    - 불일치 시 `payment_security_logs` 기록 후 `400` 반환
>    - Toss 서버에서 금액 재확인
> 3. Toss Payments 서버 승인 API 호출
> 4. 승인 실패 시 `400` 반환 (`orders.status`는 `pending` 유지 → 재시도 가능)
> 5. 승인 성공 시:
>    - `orders.status` = `paid`
>    - `scene_unlocks` 생성 (scene별 1행)
>    - 비회원인 경우 `guest_access_tokens` 발급 (30분 TTL)

---

#### `POST /api/payments/webhook`

Toss Payments 웹훅 수신 (결제 상태 동기화)

| 항목      | 내용                               |
| --------- | ---------------------------------- |
| 인증      | Toss 웹훅 시크릿 검증              |
| Body      | Toss 웹훅 페이로드                 |
| 성공 응답 | `200 { data: { received: true } }` |

---

### 비회원

#### `POST /api/guest/verify`

전화번호 + PIN 인증 → 세션별 비회원 열람 토큰 발급 및 세션 목록 조회

| 항목      | 내용                                                |
| --------- | --------------------------------------------------- |
| 인증      | 불필요                                              |
| Body      | `{ phone: string, pin: string }`                    |
| 성공 응답 | `200 { data: { sessions: GuestSessionSummary[] } }` |
| 실패      | `401` — 일치하는 비회원 없음                        |

```typescript
type GuestSessionSummary = {
  session_id: string;
  guest_token: string; // 세션별 발급, 이후 X-Guest-Token 헤더로 사용
  content_title: string;
  category: string;
  created_at: string;
  has_purchase: boolean;
};
```

> - `guest_token`은 session 단위로 발급되며, 이후 요청 시 `X-Guest-Token` 헤더로 사용한다.
> - 토큰 유효 시간: 30분. 만료 후에는 `guest/verify` 재호출로 재발급한다.
> - 토큰이 session 단위이므로, 토큰 1개가 노출되어도 해당 session에만 영향을 미친다.
> - 비회원이 보유한 모든 결과 session을 목록으로 반환한다.
> - 결과는 영구 보관되며, 재인증 시 언제든 다시 열람할 수 있다.
> - `guest_lookup_attempts`에 시도 기록을 남긴다. (브루트포스 방지)

---

### 마이페이지

#### `GET /api/my/profile`

회원 프로필 조회

| 항목      | 내용                                                 |
| --------- | ---------------------------------------------------- |
| 인증      | 회원 필요                                            |
| 성공 응답 | `200 { data: { nickname, email, social_provider } }` |

---

#### `PATCH /api/my/profile`

닉네임 수정

| 항목      | 내용                                 |
| --------- | ------------------------------------ |
| 인증      | 회원 필요                            |
| Body      | `{ nickname: string }`               |
| 성공 응답 | `200 { data: { nickname: string } }` |

---

#### `GET /api/my/sessions`

회원의 결과 session 목록 조회

| 항목      | 내용                                                    |
| --------- | ------------------------------------------------------- |
| 인증      | 회원 필요                                               |
| Query     | `page?`, `limit?`                                       |
| 성공 응답 | `200 { data: { items: SessionSummary[], pagination } }` |

```typescript
type SessionSummary = {
  session_id: string;
  content_title: string;
  category: string;
  created_at: string;
  has_purchase: boolean;
};
```

---

#### `GET /api/my/orders`

회원의 구매 내역 조회

| 항목      | 내용                                                  |
| --------- | ----------------------------------------------------- |
| 인증      | 회원 필요                                             |
| Query     | `page?`, `limit?`                                     |
| 성공 응답 | `200 { data: { items: OrderSummary[], pagination } }` |

```typescript
type OrderSummary = {
  order_id: string;
  session_id: string;
  purchase_type: "single" | "all";
  amount: number;
  paid_at: string;
  unlocked_scene_indexes: number[];
};
```

---

### 관리자

> 모든 `/api/admin/*` 엔드포인트는 `profiles.role = 'admin'` 미들웨어로 보호

#### `GET /api/admin/dashboard`

기간별 매출 집계

| 항목      | 내용                                                   |
| --------- | ------------------------------------------------------ |
| 인증      | 관리자 필요                                            |
| Query     | `from: string (YYYY-MM-DD)`, `to: string (YYYY-MM-DD)` |
| 성공 응답 | `200 { data: DashboardStats }`                         |

```typescript
type DashboardStats = {
  total_revenue: number;
  order_count: number;
  unique_users: number;
  daily_stats: { date: string; revenue: number; orders: number }[];
  category_stats: { category: string; count: number }[];
};
```

---

#### `GET /api/admin/orders`

전체 주문 내역 리스트

| 항목      | 내용                                                                      |
| --------- | ------------------------------------------------------------------------- |
| 인증      | 관리자 필요                                                               |
| Query     | `page?`, `limit?`, `from?`, `to?`, `status?: 'paid'\|'failed'\|'pending'` |
| 성공 응답 | `200 { data: { items: AdminOrder[], pagination } }`                       |

```typescript
type AdminOrder = {
  order_id: string;
  user_type: "member" | "guest";
  buyer_identifier: string;
  status: "pending" | "paid" | "failed" | "refunded";
  amount: number;
  purchase_type: "single" | "all";
  session_id: string;
  content_title: string;
  paid_at: string | null;
  created_at: string;
};
```

---

#### `GET /api/admin/orders/[order_id]`

주문 상세 조회

| 항목      | 내용                             |
| --------- | -------------------------------- |
| 인증      | 관리자 필요                      |
| Params    | `order_id`                       |
| 성공 응답 | `200 { data: AdminOrderDetail }` |

```typescript
type AdminOrderDetail = {
  order_id: string;
  user_type: "member" | "guest";
  buyer_info: { email?: string; phone?: string };
  status: "pending" | "paid" | "failed" | "refunded";
  amount: number;
  paid_at: string | null;
  session_id: string;
  inferred_user_type: Record<string, string> | null;
  answers: Answer[];
  scenes: ResultScene[];
};
```

---

#### `GET /api/admin/users`

유저 리스트 (회원 + 비회원)

| 항목      | 내용                                               |
| --------- | -------------------------------------------------- |
| 인증      | 관리자 필요                                        |
| Query     | `type?: 'member'\|'guest'`, `page?`, `limit?`      |
| 성공 응답 | `200 { data: { items: AdminUser[], pagination } }` |

```typescript
type AdminUser = {
  user_id: string;
  user_type: "member" | "guest";
  identifier: string; // 이메일 (회원) 또는 전화번호 마스킹 (비회원)
  social_provider?: string; // 회원만
  order_count: number;
  total_spent: number;
  created_at: string;
};
```

---

#### `GET /api/admin/contents`

콘텐츠 목록 조회

| 항목      | 내용                                             |
| --------- | ------------------------------------------------ |
| 인증      | 관리자 필요                                      |
| Query     | `page?`, `limit?`                                |
| 성공 응답 | `200 { data: { items: Content[], pagination } }` |

> `Content.input_config`, `Content.scene_config`를 포함한 전체 콘텐츠 설정 반환

---

#### `POST /api/admin/contents`

콘텐츠 생성

| 항목      | 내용                            |
| --------- | ------------------------------- |
| 인증      | 관리자 필요                     |
| Body      | `Content` (id, created_at 제외) |
| 성공 응답 | `201 { data: Content }`         |

> 콘텐츠 생성 시:
>
> - 자유 입력 placeholder
> - 자유 입력 예시 문장
> - 보정 질문 및 선택지
> - 선택지별 reaction
> - scene 흐름 구조
> - scene별 prompt
>   를 함께 설정할 수 있다.

---

#### `PATCH /api/admin/contents/[id]`

콘텐츠 수정

| 항목      | 내용                    |
| --------- | ----------------------- |
| 인증      | 관리자 필요             |
| Params    | `id`                    |
| Body      | `Partial<Content>`      |
| 성공 응답 | `200 { data: Content }` |

---

#### `POST /api/admin/sessions/[session_id]/regenerate`

AI 해석 재생성

| 항목      | 내용                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 인증      | 관리자 필요                                                                                                                    |
| Params    | `session_id`                                                                                                                   |
| Body      | `{ reason: 'error'\|'irrelevant'\|'tone'\|'other', reason_detail?: string, extra_instruction?: string, scene_index?: number }` |
| 성공 응답 | `200 { data: { session_id: string, scenes: ResultScene[] } }`                                                                  |

> `scene_index` 지정 시 해당 scene만 재생성, 생략 시 전체 재생성  
> 재생성 이력은 `ai_regeneration_logs`에 기록

---

## 7. DB 스키마

> Supabase (PostgreSQL 17) 기준  
> 모든 테이블은 Row Level Security(RLS) 활성화

### 테이블 목록

| #   | 테이블                  | 역할                        |
| --- | ----------------------- | --------------------------- |
| 1   | `profiles`              | 소셜 로그인 회원 정보       |
| 2   | `contents`              | 콘텐츠 정보 및 scene 설정   |
| 3   | `analysis_sessions`     | 사용자 분석 세션            |
| 4   | `session_answers`       | 세션 내 질문 응답           |
| 5   | `result_scenes`         | AI 생성 결과 scene          |
| 6   | `orders`                | 결제 주문                   |
| 7   | `scene_unlocks`         | scene별 잠금 해제 기록      |
| 8   | `guest_credentials`     | 비회원 인증 정보 (영구)     |
| 9   | `guest_access_tokens`   | 비회원 열람 토큰 (30분 TTL) |
| 10  | `ai_regeneration_logs`  | AI 재생성 이력              |
| 11  | `payment_security_logs` | 결제 위변조 감지 로그       |
| 12  | `guest_lookup_attempts` | 비회원 조회 시도 로그       |

---

### 1. `profiles`

> `auth.users` 확장. 소셜 로그인 완료 시 자동 생성.

| 컬럼              | 타입          |   Null   | 기본값   | 제약                                        |
| ----------------- | ------------- | :------: | -------- | ------------------------------------------- |
| `id`              | `uuid`        | NOT NULL | —        | PK, FK → `auth.users(id)` ON DELETE CASCADE |
| `email`           | `text`        | NOT NULL | —        | UNIQUE                                      |
| `nickname`        | `text`        | NOT NULL | —        | —                                           |
| `social_provider` | `text`        | NOT NULL | —        | CHECK IN `('google','kakao')`               |
| `role`            | `text`        | NOT NULL | `'user'` | CHECK IN `('user','admin')`                 |
| `created_at`      | `timestamptz` | NOT NULL | `now()`  | —                                           |
| `updated_at`      | `timestamptz` | NOT NULL | `now()`  | —                                           |

---

### 2. `contents`

> 관리자가 등록하는 콘텐츠 정보. 유저 진입의 시작점.

| 컬럼            | 타입          | Null     | 기본값              | 제약                                                               |
| --------------- | ------------- | -------- | ------------------- | ------------------------------------------------------------------ |
| `id`            | `uuid`        | NOT NULL | `gen_random_uuid()` | PK                                                                 |
| `title`         | `text`        | NOT NULL | —                   | —                                                                  |
| `subtitle`      | `text`        | NULL     | —                   | —                                                                  |
| `category`      | `text`        | NOT NULL | —                   | CHECK IN `('love','relationship','career','emotion')`              |
| `thumbnail_url` | `text`        | NULL     | —                   | —                                                                  |
| `input_config`  | `jsonb`       | NOT NULL | `'{}'`              | 자유 입력 placeholder, 예시 문장, 보정 질문, 선택지, reaction 설정 |
| `scene_config`  | `jsonb`       | NOT NULL | `'{}'`              | —                                                                  |
| `is_active`     | `boolean`     | NOT NULL | `true`              | —                                                                  |
| `sort_order`    | `integer`     | NULL     | —                   | —                                                                  |
| `created_at`    | `timestamptz` | NOT NULL | `now()`             | —                                                                  |
| `updated_at`    | `timestamptz` | NOT NULL | `now()`             | —                                                                  |

```jsonc
// input_config 구조

{
  "placeholder": "지금 네 마음에 가장 오래 남아있는 상황부터 적어줘.",
  "example_inputs": [
    "자꾸 상대 반응을 확인하게 돼.",
    "괜찮은 척했는데 계속 신경 쓰여.",
  ],
  "questions": [
    {
      "index": 1,
      "text": "답장이 늦어질수록 네 감정은 어느 쪽에 가까워졌어?",
      "type": "single",
      "options": [
        {
          "label": "괜찮은 척했지만 계속 신경 쓰였어",
          "value": "masked_anxiety",
          "reaction": "겉으론 넘긴 척했지만, 마음은 계속 반응하고 있었네.",
        },
        {
          "label": "먼저 포기하려고 했어",
          "value": "avoidance",
        },
      ],
    },
  ],
}
```

```jsonc
// scene_config 구조

{
  "free_scene_count": 2,
  "paid_scene_count": 4,
  "scenes": [
    {
      "index": 1,
      "title": "현재 감정 인식",
      "is_free": true,
      "prompt": "...",
    },
    {
      "index": 2,
      "title": "감정 패턴 자각",
      "is_free": true,
      "prompt": "...",
    },
    {
      "index": 3,
      "title": "왜 반복되는지",
      "is_free": false,
      "prompt": "...",
    },
    {
      "index": 4,
      "title": "관계 구조",
      "is_free": false,
      "prompt": "...",
    },
    {
      "index": 5,
      "title": "이후 흐름",
      "is_free": false,
      "prompt": "...",
    },
    {
      "index": 6,
      "title": "선택 기준",
      "is_free": false,
      "prompt": "...",
    },
  ],
}
```

### 3. `analysis_sessions`

> 사용자가 콘텐츠에 진입해 분석을 시작할 때 생성.  
> 결과 페이지 URL의 식별자로 사용 (`/result/[session_id]`).

| 컬럼                 | 타입          |   Null   | 기본값              | 제약                                                   |
| -------------------- | ------------- | :------: | ------------------- | ------------------------------------------------------ |
| `id`                 | `uuid`        | NOT NULL | `gen_random_uuid()` | PK                                                     |
| `content_id`         | `uuid`        | NOT NULL | —                   | FK → `contents(id)` ON DELETE RESTRICT                 |
| `user_id`            | `uuid`        |   NULL   | —                   | FK → `profiles(id)` ON DELETE SET NULL                 |
| `guest_id`           | `uuid`        |   NULL   | —                   | FK → `guest_credentials(id)` ON DELETE SET NULL        |
| `inferred_user_type` | `jsonb`       |   NULL   | —                   | AI가 추론한 감정 흐름 및 행동 패턴 데이터              |
| `status`             | `text`        | NOT NULL | `'pending'`         | CHECK IN `('pending','answered','completed','failed')` |
| `created_at`         | `timestamptz` | NOT NULL | `now()`             | —                                                      |
| `updated_at`         | `timestamptz` | NOT NULL | `now()`             | —                                                      |

> `status` 흐름: `pending` → `answered` → `completed` / `failed`

### 4. `session_answers`

> 세션 내 질문별 응답. 자유 입력과 보정 질문 선택형 응답 통합.

| 컬럼             | 타입          |   Null   | 기본값              | 제약                                           |
| ---------------- | ------------- | :------: | ------------------- | ---------------------------------------------- |
| `id`             | `uuid`        | NOT NULL | `gen_random_uuid()` | PK                                             |
| `session_id`     | `uuid`        | NOT NULL | —                   | FK → `analysis_sessions(id)` ON DELETE CASCADE |
| `question_index` | `integer`     | NOT NULL | —                   | CHECK >= 1                                     |
| `question_text`  | `text`        | NOT NULL | —                   | —                                              |
| `answer_text`    | `text`        |   NULL   | —                   | —                                              |
| `answer_options` | `jsonb`       |   NULL   | —                   | —                                              |
| `branch_key`     | `text`        |   NULL   | —                   | 질문 분기 추적용                               |
| `created_at`     | `timestamptz` | NOT NULL | `now()`             | —                                              |

> UNIQUE (`session_id`, `question_index`)  
> CHECK: `answer_text IS NOT NULL OR answer_options IS NOT NULL`

---

### 5. `result_scenes`

> AI(Claude)가 생성한 분석 결과 scene. 세션당 N개.

| 컬럼               | 타입          |   Null   | 기본값              | 제약                                                     |
| ------------------ | ------------- | :------: | ------------------- | -------------------------------------------------------- |
| `id`               | `uuid`        | NOT NULL | `gen_random_uuid()` | PK                                                       |
| `session_id`       | `uuid`        | NOT NULL | —                   | FK → `analysis_sessions(id)` ON DELETE CASCADE           |
| `scene_index`      | `integer`     | NOT NULL | —                   | CHECK >= 1                                               |
| `scene_title`      | `text`        | NOT NULL | —                   | —                                                        |
| `messages`         | `jsonb`       | NOT NULL | `'[]'`              | scene message 배열 저장                                  |
| `preview_messages` | `jsonb`       |   NULL   | —                   | 잠금 scene preview용 message 배열                        |
| `is_free`          | `boolean`     | NOT NULL | —                   | —                                                        |
| `status`           | `text`        | NOT NULL | `'pending'`         | CHECK IN `('pending','generating','completed','failed')` |
| `error_message`    | `text`        |   NULL   | —                   | —                                                        |
| `created_at`       | `timestamptz` | NOT NULL | `now()`             | —                                                        |
| `updated_at`       | `timestamptz` | NOT NULL | `now()`             | —                                                        |

```jsonc
// messages 구조

[
  {
    "type": "ai",
    "text": "확인하고 나면 잠깐은 괜찮아져.",
  },
  {
    "type": "memo",
    "text": "안심보다 불안 반복에 가까워.",
  },
  {
    "type": "punch",
    "text": "문제는 연락이 아니야.",
  },
]
```

> UNIQUE (`session_id`, `scene_index`)

---

### 6. `orders`

> 결제 주문. 회원/비회원 공용.

| 컬럼                 | 타입          |   Null   | 기본값      | 제약                                              |
| -------------------- | ------------- | :------: | ----------- | ------------------------------------------------- |
| `id`                 | `text`        | NOT NULL | —           | PK (Toss `orderId`)                               |
| `session_id`         | `uuid`        | NOT NULL | —           | FK → `analysis_sessions(id)` ON DELETE RESTRICT   |
| `user_id`            | `uuid`        |   NULL   | —           | FK → `profiles(id)` ON DELETE SET NULL            |
| `guest_id`           | `uuid`        |   NULL   | —           | FK → `guest_credentials(id)` ON DELETE SET NULL   |
| `purchase_type`      | `text`        | NOT NULL | —           | CHECK IN `('single','all')`                       |
| `target_scene_index` | `integer`     |   NULL   | —           | CHECK >= 1                                        |
| `amount`             | `integer`     | NOT NULL | —           | CHECK > 0                                         |
| `status`             | `text`        | NOT NULL | `'pending'` | CHECK IN `('pending','paid','failed','refunded')` |
| `toss_payment_key`   | `text`        |   NULL   | —           | —                                                 |
| `toss_receipt_url`   | `text`        |   NULL   | —           | —                                                 |
| `payment_method`     | `text`        |   NULL   | —           | —                                                 |
| `failure_reason`     | `text`        |   NULL   | —           | —                                                 |
| `paid_at`            | `timestamptz` |   NULL   | —           | —                                                 |
| `created_at`         | `timestamptz` | NOT NULL | `now()`     | —                                                 |
| `updated_at`         | `timestamptz` | NOT NULL | `now()`     | —                                                 |

> CHECK: `(user_id IS NOT NULL AND guest_id IS NULL) OR (user_id IS NULL AND guest_id IS NOT NULL)`  
> CHECK: `purchase_type != 'single' OR target_scene_index IS NOT NULL`

---

### 7. `scene_unlocks`

> 결제 완료 후 scene별 잠금 해제 기록. 1 scene = 1행.

| 컬럼          | 타입          |   Null   | 기본값              | 제약                                           |
| ------------- | ------------- | :------: | ------------------- | ---------------------------------------------- |
| `id`          | `uuid`        | NOT NULL | `gen_random_uuid()` | PK                                             |
| `session_id`  | `uuid`        | NOT NULL | —                   | FK → `analysis_sessions(id)` ON DELETE CASCADE |
| `scene_index` | `integer`     | NOT NULL | —                   | CHECK >= 1                                     |
| `order_id`    | `text`        | NOT NULL | —                   | FK → `orders(id)` ON DELETE RESTRICT           |
| `unlocked_at` | `timestamptz` | NOT NULL | `now()`             | —                                              |

> UNIQUE (`session_id`, `scene_index`)

---

### 8. `guest_credentials`

> 비회원 인증 정보. 영구 보관.  
> 전화번호 + PIN으로 언제든 결과 재열람 가능.

| 컬럼         | 타입          |   Null   | 기본값              | 제약   |
| ------------ | ------------- | :------: | ------------------- | ------ |
| `id`         | `uuid`        | NOT NULL | `gen_random_uuid()` | PK     |
| `phone_hash` | `text`        | NOT NULL | —                   | UNIQUE |
| `pin_hash`   | `text`        | NOT NULL | —                   | —      |
| `created_at` | `timestamptz` | NOT NULL | `now()`             | —      |

---

### 9. `guest_access_tokens`

> 비회원 결제 완료 또는 비회원 조회 인증 후 발급되는 세션 단위 단기 열람 토큰.
> 만료(30분) 후에는 `guest_credentials`로 재인증 필요.

| 컬럼         | 타입          |   Null   | 기본값              | 제약                                           |
| ------------ | ------------- | :------: | ------------------- | ---------------------------------------------- |
| `id`         | `uuid`        | NOT NULL | `gen_random_uuid()` | PK                                             |
| `guest_id`   | `uuid`        | NOT NULL | —                   | FK → `guest_credentials(id)` ON DELETE CASCADE |
| `session_id` | `uuid`        | NOT NULL | —                   | FK → `analysis_sessions(id)` ON DELETE CASCADE |
| `token_hash` | `text`        | NOT NULL | —                   | UNIQUE                                         |
| `expires_at` | `timestamptz` | NOT NULL | —                   | —                                              |
| `is_revoked` | `boolean`     | NOT NULL | `false`             | —                                              |
| `created_at` | `timestamptz` | NOT NULL | `now()`             | —                                              |

---

### 10. `ai_regeneration_logs`

> 관리자의 AI 재생성 요청 이력. 감사 및 품질 관리.

| 컬럼                | 타입          |   Null   | 기본값              | 제약                                             |
| ------------------- | ------------- | :------: | ------------------- | ------------------------------------------------ |
| `id`                | `uuid`        | NOT NULL | `gen_random_uuid()` | PK                                               |
| `session_id`        | `uuid`        | NOT NULL | —                   | FK → `analysis_sessions(id)` ON DELETE CASCADE   |
| `scene_index`       | `integer`     |   NULL   | —                   | CHECK >= 1                                       |
| `reason`            | `text`        | NOT NULL | —                   | CHECK IN `('error','irrelevant','tone','other')` |
| `reason_detail`     | `text`        |   NULL   | —                   | —                                                |
| `extra_instruction` | `text`        |   NULL   | —                   | —                                                |
| `regenerated_by`    | `uuid`        | NOT NULL | —                   | FK → `profiles(id)` ON DELETE RESTRICT           |
| `created_at`        | `timestamptz` | NOT NULL | `now()`             | —                                                |

> `scene_index` NULL = 전체 재생성, 값 있음 = 특정 scene만 재생성

---

### 11. `payment_security_logs`

> 결제 위변조 의심 이벤트 기록. RLS 없이 서버 전용.

| 컬럼              | 타입          |   Null   | 기본값              | 제약                                          |
| ----------------- | ------------- | :------: | ------------------- | --------------------------------------------- |
| `id`              | `uuid`        | NOT NULL | `gen_random_uuid()` | PK                                            |
| `order_id`        | `text`        |   NULL   | —                   | FK → `orders(id)` ON DELETE SET NULL          |
| `event_type`      | `text`        | NOT NULL | —                   | —                                             |
| `expected_amount` | `integer`     |   NULL   | —                   | —                                             |
| `received_amount` | `integer`     |   NULL   | —                   | —                                             |
| `severity`        | `text`        | NOT NULL | —                   | CHECK IN `('low','medium','high','critical')` |
| `ip_address`      | `text`        |   NULL   | —                   | —                                             |
| `user_agent`      | `text`        |   NULL   | —                   | —                                             |
| `created_at`      | `timestamptz` | NOT NULL | `now()`             | —                                             |

---

### 12. `guest_lookup_attempts`

> 비회원 조회 시도 기록. 브루트포스 공격 방지.

| 컬럼           | 타입          |   Null   | 기본값              | 제약 |
| -------------- | ------------- | :------: | ------------------- | ---- |
| `id`           | `uuid`        | NOT NULL | `gen_random_uuid()` | PK   |
| `phone_hash`   | `text`        | NOT NULL | —                   | —    |
| `ip_address`   | `text`        |   NULL   | —                   | —    |
| `is_success`   | `boolean`     | NOT NULL | —                   | —    |
| `attempted_at` | `timestamptz` | NOT NULL | `now()`             | —    |

---

## 8. API 라우트 구조

```txt
app/api/
├── auth/
│   ├── callback/route.ts                          GET
│   └── logout/route.ts                            POST
├── contents/
│   ├── route.ts                                   GET (목록)
│   └── [id]/route.ts                              GET (상세)
├── analyze/
│   ├── route.ts                                   POST (세션 생성)
│   └── [session_id]/
│       ├── answers/route.ts                       POST (응답 저장)
│       └── generate/route.ts                      POST (AI 생성)
├── sessions/
│   └── [session_id]/
│       └── scenes/route.ts                        GET (결과 scene 조회)
├── payments/
│   ├── intent/route.ts                            POST (주문 생성)
│   ├── confirm/route.ts                           POST (결제 승인)
│   └── webhook/route.ts                           POST (웹훅)
├── guest/
│   └── verify/route.ts                            POST (비회원 인증)
├── my/
│   ├── profile/route.ts                           GET, PATCH
│   ├── sessions/route.ts                          GET (결과 목록)
│   └── orders/route.ts                            GET (구매 내역)
└── admin/
    ├── dashboard/route.ts                         GET
    ├── orders/
    │   ├── route.ts                               GET (리스트)
    │   └── [order_id]/route.ts                    GET (상세)
    ├── users/route.ts                             GET
    ├── contents/
    │   ├── route.ts                               GET, POST
    │   └── [id]/route.ts                          PATCH
    └── sessions/
        └── [session_id]/
            └── regenerate/route.ts                POST (AI 재생성)
```
