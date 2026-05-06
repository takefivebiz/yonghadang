# Product Requirements Document (PRD)

# VEIL — 콘텐츠 기반 자기 해석 서비스

---

## 1. 프로젝트 개요

- **프로젝트명:** VEIL
- **목표:** 콘텐츠와 간단한 입력을 통해 사용자의 현재 상황, 감정, 관계를 해석하고, 즉시 소비 가능한 형태로 제공하는 수익형 웹 서비스.
- **핵심 가치 1:** 사용자가 이미 가지고 있는 고민을 선명하게 드러내고, "이거 내 얘기다"라는 직관적인 자기 인식을 만든다.
- **핵심 가치 2:** 콘텐츠 기반 진입 구조와 카드형 결과를 통해 빠른 소비 → 몰입 → 결제로 이어지는 흐름을 만든다.

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

- **Theme:** Emotional, City Pop, Retro Pop
- **Interactions:** 카드 hover 색상 변화, 부드러운 전환, 최소 애니메이션

**컬러 팔레트:**

| 역할                       | 색상      |
| -------------------------- | --------- |
| Primary Background         | `#141021` |
| Secondary Background       | `#2F3159` |
| Primary Accent (Emotion)   | `#D16DAC` |
| Secondary Accent (Clarity) | `#5E99AB` |
| Highlight                  | `#F9F9E5` |

**규칙:**

- Primary Accent는 한 화면에서 1~2회만 사용
- Background는 반드시 어두운 계열 유지
- 밝은 색은 정보 강조에서만 사용

**절대 금지:**

- 그라데이션 남용
- 밝은 배경
- 과한 애니메이션

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

#### 5.2.1 메인 페이지 (`/`)

**구성 흐름**

MiniHero → TrendingSection → CategoryTabs → ContentSection

---

### MiniHero

- 작게: 사주 ∙ MBTI처럼 끼워넣은 나 말고,
- 크게: 베일에 가려진 진짜 나를 찾다

---

### TrendingSection

텍스트: 지금 많이 보는  
구조: 카드 카드 카드 카드 → 가로 스크롤

- 각 카드에 카테고리 뱃지

---

### CategoryTabs

**구조:**  
연애 / 인간관계 / 직업·진로 / 감정

**역할:**

- 카테고리 섹션으로 빠르게 이동
- 클릭 시 해당 ContentSection으로 스크롤 이동

---

### ContentSection

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
콘텐츠 카드 그리드

**동작 방식:**

- 선택한 카테고리에 해당하는 콘텐츠만 노출한다.
- 메인 페이지와 달리 가로 스크롤이 아니라 그리드 카드 형태로 보여준다.
- `GET /api/contents?category=love` 형태로 카테고리 필터를 적용한다.
- 콘텐츠 클릭 시 `/content/[id]`로 이동한다.
- 비활성 콘텐츠는 노출하지 않는다.

**그리드 규칙:**

- 모바일: 2열
- 태블릿: 3열
- 데스크톱: 4열
- 카드 구조는 메인 ContentCard와 동일하게 사용한다.

### ContentCard

**구조:**

이미지  
제목  
서브 텍스트  
카테고리 라벨

역할:

- 콘텐츠 썸네일
- 클릭 시 `/content/[id]`로 이동

---

**동작 방식**

- `contents` 더미 데이터를 사용한다.
- 카테고리별로 콘텐츠를 필터링한다.
- `content-grid` 구조는 사용하지 않는다.
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

- 메인 카드 클릭 시 해당 페이지로 이동.
- 이 페이지는 긴 상세 설명이 아니라, 입력 전 몰입을 만드는 역할.

**구성:**

- 콘텐츠 제목
- 서브 텍스트
- 이 콘텐츠가 보는 것 4개
- 예상 소요 시간
- CTA 버튼

**동작**:

- CTA 버튼 클릭 시 세션을 생성한다.
- 프론트 구현 단계에서는 mock session을 생성한다.
- 이후 백엔드 연동 시 `POST /api/analyze`로 실제 session을 생성한다.
- 세션 생성 후 `/analyze/[session_id]`로 이동한다.

#### 5.2.3 입력 단계 (`/analyze/[session_id]`)

입력 단계는 사용자의 현재 상황을 수집하고,
콘텐츠별 보정 질문을 통해
AI가 해석에 필요한 흐름과 맥락을 파악하는 단계다.

---

### 공통 목적

- 사용자의 현재 상황을 충분히 확보한다.
- 보정 질문을 통해 AI가 해석에 사용할 구조화 데이터를 만든다.
- 입력 단계에서는 결론을 제공하지 않는다.
- 최종 판단과 해석은 결과 페이지에서만 제공한다.

---

### 입력 방식

VEIL의 초기 버전(v1)은  
모든 콘텐츠를 **자유 입력 + 보정 질문** 기반으로 진행한다.  
사용자가 직접 자신의 상황을 설명해야만  
AI가 실제 상황에 가까운 해석을 생성할 수 있기 때문이다.

선택형 질문만으로 구성된 입력 방식(Type B)은  
향후 경량 콘텐츠 또는 특수 콘텐츠에서만
선택적으로 도입할 수 있다.

## 자유 입력 + 보정 질문

### 목적

사용자가 자신의 상황을 직접 설명하게 하고, 이후 보정 질문을 통해 해석 정확도를 높인다.  
단순 선택형 테스트가 아니라, 사용자의 실제 상황과 흐름을 기반으로  
개인화된 해석을 생성하는 것이 목적이다.

### 구성

1. 자유 입력 1회
2. 보정 질문 5~8개
3. 입력 완료 후 결과 생성

---

### 자유 입력

- 사용자는 현재 상황을 자유롭게 작성한다.
- 최대 500자까지 입력할 수 있다.
- 여러 줄 입력이 가능해야 한다.
- 짧게 입력해도 가능하지만, 길게 입력할수록 AI가 상황을 더 정확하게 판단할 수 있다.

**예시 문구**  
지금 상황을 편하게 적어줘

**placeholder 예시**  
예: 자꾸 상대가 의심되고, 확인하면 안 되는 걸 알면서도 휴대폰이나 SNS를 보게 돼.

## 자유 입력 보조 기능

사용자의 입력 부담을 줄이기 위해,
예시 문장을 선택할 수 있는 UI를 제공한다. (아코디언)

- 예시 문장은 선택이 아닌 “참고용”으로 제공한다
- 사용자가 클릭하면 입력창에 문장이 삽입된다
- 사용자는 해당 문장을 반드시 일부 수정하여 제출해야 한다
- 예시 문장과 완전히 동일한 경우 제출을 제한한다
- 유사도 검사는 초기 버전에서는 적용하지 않는다

예시 문장은 다음 기준을 따른다:

- 실제 상황처럼 느껴지는 문장
- 감정 + 행동이 포함된 문장
- 추상적인 표현이 아닌 구체적인 표현

---

### 보정 질문

자유 입력 후, 콘텐츠별로 미리 설계된 보정 질문을 보여준다.  
보정 질문의 목적은 **사용자의 타입, 감정 강도, 행동 패턴, 관계 기준, 과거 경험 등**을 추론하기 위한 것이다.

- 총 5~8개
- 단일 선택 또는 복수 선택 가능
- 질문별 조건 분기 가능
- 이전 답변에 따라 다음 질문이 달라질 수 있음
- 질문과 선택지는 콘텐츠마다 다르게 설계됨

## 입력 데이터 저장

입력 완료 시 다음 데이터를 저장한다.

- `session_id`
- `content_id`
- 자유 입력 내용
- 보정 질문 응답
- 질문 분기 이력
- inferred_user_type
- 생성 시점
- 결과 생성에 필요한 raw input data

## 입력 완료 상태

모든 질문이 완료되면,
사용자에게 입력이 정리되었음을 알린다.

**예시:**
답변을 바탕으로 결과를 준비하고 있어

[결과 보기]

## 사용자 타입 추론

입력 단계에서 수집된 데이터는 결과 생성 전,
사용자 타입을 추론하는 데 사용된다.

타입은 단일 값이 아닌 복합적으로 구성될 수 있다.
타입은 다음 요소의 조합으로 구성된다:

- 불안도 (낮음 / 중간 / 높음)
- 해석 방향 (자기 의심형 / 타인 의심형 / 혼합형)
- 행동 패턴 (억제형 / 확인형 / 회피형 / 직면형)
- 관계 기준 (타인 중심형 / 자기 중심형)

AI는 자유 입력 + 보정 질문 응답을 기반으로
사용자의 주요 행동 패턴과 감정 처리 방식을 추론한다.

- 결과카드에서 절대 언급해서는 안된다. (예: 너는 자기검열형이야. 너는 회피형에서 높은 점수가 나왔어 등)

## 결과 생성 연결

입력이 완료되면 사용자가 입력한 자유 입력/질문 응답을 기반으로 AI 결과를 생성한다.

AI는 다음 정보를 활용한다.

- 사용자가 선택한 콘텐츠 주제
- 사용자의 자유 입력
- 보정 질문 응답
- 콘텐츠별 결과 카드 구조
- 콘텐츠별 사용자 타입 추론 기준

결과 페이지에서는 콘텐츠별로 미리 설계된 결과 구조에 맞춰 AI가 개인화된 해석을 제공한다.

---

### 예시 결과 구조

1. 상태 정의 - 무료
2. 상황 설명 + 결핍 - 무료
3. 왜 이렇게 되는지 - 유료
4. 이게 실제로 어떤 상태인지 - 유료
5. 이대로 가면 어떻게 되는지 - 유료
6. 그래서 어떻게 해야 하는지 - 유료

## UX 규칙

- 입력 단계에서는 결과나 결론을 미리 보여주지 않는다.
- 사용자가 답변을 완료하기 전까지 해석 결과를 노출하지 않는다.
- 질문은 한 화면에 하나씩 보여주는 모달 카드형 UI를 기본으로 한다.
- 진행 상태를 표시한다. 예: `2 / 7`
- '다음'버튼을 눌러야 다음으로 넘어간다.
- 마지막 질문 완료 후 결과 생성 화면으로 이동한다.

---

#### 5.2.4 결과 페이지 (`/result/[session_id]`)

결과 페이지는 모달 카드형 UI를 기반으로 구성된다.

각 카드는 순차적으로 읽히는 흐름을 가지되,  
동시에 개별 카드 단위로도 완결성을 가져야 한다.

카드형 결과는 기본값 6장이며, 콘텐츠별 `card_config`로 동적 설정할 수 있다.

| 구분 | 카드 | 역할                      |
| ---- | ---- | ------------------------- |
| 무료 | 1    | 상태 정의                 |
| 무료 | 2    | 상황 설명 + 결핍          |
| 유료 | 3    | 왜 이렇게 되는지          |
| 유료 | 4    | 이게 실제로 어떤 상태인지 |
| 유료 | 5    | 이대로 가면 어떻게 되는지 |
| 유료 | 6    | 그래서 어떻게 해야 하는지 |

---

## 무료 결과 카드 구조

무료 카드는 사용자의 상태를 명확하게 인식시키되,  
핵심 해석을 의도적으로 완전히 풀지 않는다.

### 목적

- 사용자가 자신의 상태를 정확히 인지하도록 만든다.
- “맞는데, 왜 그런지 궁금한 상태”를 만든다.
- 유료 카드로 자연스럽게 이어지도록 한다.

### 카드 1 — 상태 정의

- 현재 감정 또는 상황을 한 문장으로 정의한다.
- 단순 요약이 아니라 재정의 형태여야 한다.
- 사용자가 직접 말하지 않은 핵심 상태를 포함해야 한다.

### 카드 2 — 상황 설명 + 결핍

- 관계 또는 상황이 어떻게 이어지고 있는지 보여준다.
- 원인과 해결은 완전히 설명하지 않는다.
- 마지막에 추가 해석 필요성을 반드시 남긴다.

## 무료 결과 카드 생성 규칙

- 입력 내용을 그대로 요약하지 않는다
- 사용자가 이미 알고 있는 감정을 반복하지 않는다
- 반드시 상태 정의 또는 상황 설명을 포함한다
- 사용자의 실제 행동 또는 생각이 포함되어야 한다
- “이거 내가 했던 건데?”라는 반응이 나와야 한다

- 카드 1: 상태를 명확하게 정의한다
- 카드 2: 상황이 어떻게 이어지고 있는지 보여준다

- 무료 카드에서는 원인, 해결, 판단 기준을 완전히 설명하지 않는다
- 무료 카드에서는 완전한 이해가 발생하면 안 된다
- 반드시 추가 해석이 필요하다는 흐름으로 끝나야 한다

---

## 유료 결과 카드 구조

유료 카드는 사용자의 고민을 해소하고  
실질적인 판단과 선택이 가능하도록 만드는 단계다.

모든 콘텐츠는 아래 4단 구조를 따른다.

### 카드 3 — 왜 이렇게 되는지

- 현재 상태가 만들어진 이유를 설명한다.
- 사용자의 행동, 생각, 선택 방식이 어떻게 이어지고 있는지 보여준다.
- 단순 원인 설명이 아니라 “아 그래서 이랬구나”라는 이해가 생겨야 한다.

### 카드 4 — 이게 실제로 어떤 상태인지

- 감정 또는 상황의 핵심을 다시 정의한다.
- 사용자가 놓치고 있던 본질을 드러낸다.
- 무료 카드보다 더 깊은 판단이 가능해야 한다.

### 카드 5 — 이대로 가면 어떻게 되는지

- 현재 상태가 유지될 경우의 흐름을 보여준다.
- 과도한 불안 유도는 피한다.
- 사용자가 행동을 고려하게 만드는 정도의 긴장감을 만든다.

### 카드 6 — 그래서 어떻게 해야 하는지

- 사용자가 취할 수 있는 선택 방향을 제시한다.
- 정답을 단정하지 않는다.
- 판단 가능한 기준과 첫 행동 방향을 제공한다.

### 유료 카드 생성 규칙

- 유료 카드는 총 4장으로 구성한다.
- 각 유료 카드는 3~5문장으로 구성한다.
- 각 유료 카드는 단독으로도 이해 가능한 완결성을 가져야 한다.
- 무료 카드에서 사용된 핵심 감정, 상태, 키워드를 반복하지 않는다.
- 동일한 내용을 다른 표현으로 반복하지 않는다.
- 각 유료 카드에는 반드시 새로운 관점 또는 추가 정보가 포함되어야 한다.
- 각 유료 카드는 읽은 후 사용자가 상황을 판단할 수 있어야 한다.
- 각 유료 카드는 다음 요소 중 최소 2개 이상을 포함한다.
  - 현재 상태 정의
  - 왜 그렇게 되는지에 대한 이유
  - 이 상태가 계속될 경우의 영향
  - 사용자가 취할 수 있는 방향 또는 기준

---

## 카드 완결성 원칙

각 카드는 단독으로도 다음이 가능해야 한다.

- 현재 상태를 이해할 수 있다.
- 왜 그런지 납득할 수 있다.
- 이 정보가 왜 중요한지 알 수 있다.

---

## 카드 간 연결 규칙

카드는 순차적으로 읽을 경우 더 깊은 이해가 가능하도록 설계한다.

- 각 카드의 마지막 문장은 반드시 다음 카드에서 다룰 주제를 암시해야 한다.
- 단, 다음 카드의 내용을 직접적으로 설명하지 않는다.
- 사용자가 “다음 카드가 궁금해지는 상태”가 되도록 작성한다.
- 단순 연결이 아니라, 미해결된 질문 형태로 끝나야 한다.

---

## 결제 및 노출 방식

- 무료 카드 2장 이후 유료 카드가 노출된다.
- 유료 카드는 일부 내용만 미리보기로 제공된다.
- 전체 내용은 결제 후 열람 가능하다.
- 잠금 카드 미리보기는 2~3줄 preview로 제공한다.
- 유료 카드는 결제 전 `preview_text`만 노출한다.
- 결제 후 `card_content` 전체를 노출한다.
- 개별 카드 열기: 900원
- 전체 열기: 2,900원

### 미리보기 규칙

- 카드의 일부 문장은 흐림 처리 또는 제한 노출한다.
- 핵심 해석은 반드시 숨긴다.
- 사용자가 “읽히는데 안 읽히는” 상태를 경험하게 한다.

---

## 핵심 설계 원칙

- 무료는 “문제를 인식시키는 단계”다.
- 유료는 “문제를 해소하는 단계”다.

### 최종 목표

- 무료 카드: “어… 맞는데 왜 이러지?”
- 유료 카드: “아 그래서 이거였네 + 그럼 이렇게 해야겠네”

#### 5.2.5 결제 모달

### 1. 회원 (로그인 상태)

- 별도 인증 없이 바로 결제 진행
- Toss Payments 위젯 바로 노출

### 2. 비회원

- 조회용 전화번호 + 비밀번호 입력 폼
- Toss Payments 위젯

---

**동작 흐름:**

1. 전화번호 + PIN 입력 → `POST /api/payments/intent` 호출
   - 신규 비회원: `guest_credentials` 생성
   - 기존 비회원: 기존 자격 정보 확인
   - `orders` 생성 또는 기존 `pending` order 재사용
   - `order_id`, `amount` 반환
2. Toss 위젯 초기화
3. 결제 완료 → `POST /api/payments/confirm` 호출
   - 금액 3단계 검증
   - `orders.status` = `paid`
   - `card_unlocks` 생성
   - `guest_access_tokens` 발급 (30분 유효)
4. 모달 닫힘 → 유료 카드 즉시 노출

**결제 실패 시:**

- 입력 정보 유지, 모달 그대로 유지
- [다시 결제] 클릭 → 기존 `pending` order 재사용하여 재시도

---

#### 결과 공유 (Sharing)

- 모든 공유 링크는 무료 카드(1~2번)만 노출된다.
- 유료 카드는 항상 잠금 상태로 표시된다.

유료 카드 접근 조건:

- 비회원:
  - 전화번호 + 4자리 비밀번호 인증 시 구매한 카드 공개

- 회원:
  - 로그인 후 본인 결과일 경우 구매한 카드 공개

설계 원칙:

- 공유는 유입을 위한 기능이며, 유료 콘텐츠는 본인만 접근 가능하다
- 공유 링크에서 유료 콘텐츠는 절대 자동으로 공개되지 않는다

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
- AI 생성 카드 전체

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
- 기존 카드 교체, `ai_regeneration_logs` 기록

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

**카드 설정:**

카드 1 (무료)
제목: [상태 정의]

카드 2 (무료)
제목: [상황 설명 + 결핍]

카드 3 (유료)
제목: [왜 이렇게 되는지]

카드 4 (유료)
제목: [이게 실제로 어떤 상태인지]

카드 5 (유료)
제목: [이대로 가면 어떻게 되는지]

카드 6 (유료)
제목: [그래서 어떻게 해야 하는지]

**프롬프트 설정:**

각 카드별 AI 생성 프롬프트를 설정한다. 프롬프트는 다음 데이터를 사용할 수 있다:

- `content_title`: 콘텐츠 제목
- `category`: 카테고리
- `user_input`: 사용자 자유 입력 (Type A)
- `answers`: 모든 질문 응답
- `inferred_user_type`: AI가 추론한 사용자 타입
- `card_index`: 현재 카드 인덱스
- `card_title`: 현재 카드 제목

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
6. [결과 카드](#결과-카드)
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

Supabase OAuth 콜백 수신 → 세션 쿠키 설정 → 메인(`/`)으로 리다이렉트

| 항목      | 내용                        |
| --------- | --------------------------- |
| 인증      | 불필요                      |
| Query     | `code` (Supabase 발급 코드) |
| 성공 응답 | `302 Redirect → /`          |

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

콘텐츠 카드 목록 조회 (메인 페이지 그리드)

| 항목      | 내용                                                                        |
| --------- | --------------------------------------------------------------------------- |
| 인증      | 불필요                                                                      |
| Query     | `category?: 'love'\|'relationship'\|'career'\|'emotion'`, `page?`, `limit?` |
| 성공 응답 | `200 { data: { items: Content[], pagination } }`                            |

```typescript
type Content = {
  id: string;
  title: string;
  category: "love" | "relationship" | "career" | "emotion";
  thumbnail_url: string | null;
  card_config: {
    free_card_count: number;
    paid_card_count: number;
    cards: {
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

**비회원 세션의 `guest_id` 처리:**

- 비회원은 콘텐츠 진입 및 입력 단계에서는 `guest_id` 없이 세션을 진행할 수 있다.
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

---

#### `POST /api/analyze/[session_id]/generate`

AI 결과 카드 생성

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
> 4. `contents.card_config` 기반 카드 개수 및 프롬프트 결정
> 5. Claude에 사용자 입력 + inferred_user_type + 카드별 프롬프트 전달
> 6. 생성 결과를 `result_cards`에 카드별 저장
> 7. `analysis_sessions.status` → `completed`

---

### 결과 카드

#### `GET /api/sessions/[session_id]/cards`

결과 카드 조회

| 항목      | 내용                                    |
| --------- | --------------------------------------- |
| 인증      | 불필요 (공개 URL)                       |
| Params    | `session_id`                            |
| 성공 응답 | `200 { data: { cards: ResultCard[] } }` |

```typescript
type ResultCard = {
  id: string;
  card_index: number;
  card_title: string;
  card_content: string | null; // 미구매 유료 카드는 null
  preview_text: string | null; // 잠금 카드 미리보기
  is_free: boolean;
  is_unlocked: boolean;
};
```

> 카드 노출 규칙:
>
> - 무료 카드: `card_content` 전체 노출
> - 유료 카드 (미구매): `card_content`는 null, `preview_text`만 노출
> - 유료 카드 (구매): `card_content` 전체 노출, `preview_text`는 사용하지 않음
>
> **`preview_text` 생성 규칙:**
>
> - 모든 유료 카드는 최소 2~3줄의 `preview_text`를 반드시 생성한다.
> - `preview_text`는 사용자가 "읽고 싶은 상태"를 만들기 위해 핵심 내용의 일부를 추출한다.

---

### 결제

#### `POST /api/payments/intent`

결제 주문 생성 (Toss 위젯 초기화용 `order_id` 발급)

| 항목      | 내용                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 인증      | 불필요 (회원/비회원 모두)                                                                                                      |
| Body      | `{ session_id: string, purchase_type: 'single'\|'all', target_card_index?: number, guest_phone?: string, guest_pin?: string }` |
| 성공 응답 | `201 { data: { order_id: string, amount: number } }`                                                                           |

**비회원 PIN 처리:**

- PIN은 HTTPS 요청을 통해 서버로 전달된다.
- 서버는 PIN을 평문으로 저장하지 않는다.
- 서버에서 안전한 해시 알고리즘으로 `pin_hash`를 생성하여 저장한다.
- 인증 시 입력된 PIN을 동일 방식으로 해시한 뒤 `pin_hash`와 비교한다.

**동작 흐름:**

> 1. 비회원: `guest_phone` + `guest_pin` 수신
>    - `guest_credentials` 에서 기존 비회원 확인 또는 신규 생성
> 2. 기존 `card_unlocks` 조회
>    - 이미 구매한 카드가 있을 경우 해당 금액을 제외한 차액 계산
>    - 예) 900원짜리 카드 1장 기구매 후 전체(2,900원) 선택 시 → `amount = 2,000원`
> 3. `orders` 에서 동일 세션의 `pending` 상태 주문 조회
>    - `session_id`, `purchase_type`, `target_card_index`, `amount`가 모두 일치하는 경우에만 재사용 (결제 재시도 대응)
>    - 조건이 하나라도 다르면 기존 `pending` 주문을 `failed` 처리하고 새 주문 생성
>    - 해당하는 `pending` 주문이 없으면 신규 생성
> 4. 해당 `guest_id`를 `analysis_sessions.guest_id`에 연결 (NULL → guest_id 업데이트)
> 5. `order_id`, `amount` 반환
>
> **purchase_type:**
>
> - `single`: 카드 1장 900원 (`target_card_index` 필수)
> - `all`: 전체 유료 카드 2,900원
> - 이미 일부 유료 카드를 구매한 사용자가 전체 열기를 선택할 경우, 이미 결제한 금액을 제외한 차액만 결제한다.

---

#### `POST /api/payments/confirm`

Toss 결제 승인 및 카드 잠금 해제

| 항목      | 내용                                                                                                       |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| 인증      | 불필요                                                                                                     |
| Body      | `{ payment_key: string, order_id: string, amount: number }`                                                |
| 성공 응답 | `200 { data: { unlocked_card_indexes: number[], guest_token?: string, guest_token_expires_at?: string } }` |
| 실패      | `400` (금액 불일치, Toss 승인 실패 등)                                                                     |

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
>    - `card_unlocks` 생성 (카드별 1행)
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

> - `guest_token`은 세션 단위로 발급되며, 이후 요청 시 `X-Guest-Token` 헤더로 사용한다.
> - 토큰 유효 시간: 30분. 만료 후에는 `guest/verify` 재호출로 재발급한다.
> - 토큰이 세션 단위이므로, 토큰 1개가 노출되어도 해당 세션에만 영향을 미친다.
> - 비회원이 보유한 모든 세션을 목록으로 반환
> - 결과 자체는 영구 보관 → 재인증하면 언제든 재열람 가능
> - `guest_lookup_attempts`에 시도 기록 (브루트포스 방지)

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

회원의 분석 결과 목록 조회

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
  unlocked_card_indexes: number[];
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
  cards: ResultCard[];
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

---

#### `POST /api/admin/contents`

콘텐츠 생성

| 항목      | 내용                            |
| --------- | ------------------------------- |
| 인증      | 관리자 필요                     |
| Body      | `Content` (id, created_at 제외) |
| 성공 응답 | `201 { data: Content }`         |

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

| 항목      | 내용                                                                                                                          |
| --------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 인증      | 관리자 필요                                                                                                                   |
| Params    | `session_id`                                                                                                                  |
| Body      | `{ reason: 'error'\|'irrelevant'\|'tone'\|'other', reason_detail?: string, extra_instruction?: string, card_index?: number }` |
| 성공 응답 | `200 { data: { session_id: string, cards: ResultCard[] } }`                                                                   |

> `card_index` 지정 시 해당 카드만 재생성, 생략 시 전체 재생성  
> 재생성 이력은 `ai_regeneration_logs`에 기록

---

## 7. DB 스키마

> Supabase (PostgreSQL 17) 기준  
> 모든 테이블은 Row Level Security(RLS) 활성화

### 테이블 목록

| #   | 테이블                  | 역할                        |
| --- | ----------------------- | --------------------------- |
| 1   | `profiles`              | 소셜 로그인 회원 정보       |
| 2   | `contents`              | 콘텐츠 카드 (메인 그리드)   |
| 3   | `analysis_sessions`     | 사용자 분석 세션            |
| 4   | `session_answers`       | 세션 내 질문 응답           |
| 5   | `result_cards`          | AI 생성 결과 카드           |
| 6   | `orders`                | 결제 주문                   |
| 7   | `card_unlocks`          | 카드별 잠금 해제 기록       |
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

> 관리자가 등록하는 콘텐츠 카드. 유저 진입의 시작점.

| 컬럼            | 타입          |   Null   | 기본값              | 제약                                                  |
| --------------- | ------------- | :------: | ------------------- | ----------------------------------------------------- |
| `id`            | `uuid`        | NOT NULL | `gen_random_uuid()` | PK                                                    |
| `title`         | `text`        | NOT NULL | —                   | —                                                     |
| `category`      | `text`        | NOT NULL | —                   | CHECK IN `('love','relationship','career','emotion')` |
| `thumbnail_url` | `text`        |   NULL   | —                   | —                                                     |
| `card_config`   | `jsonb`       | NOT NULL | `'{}'`              | —                                                     |
| `is_active`     | `boolean`     | NOT NULL | `true`              | —                                                     |
| `sort_order`    | `integer`     |   NULL   | —                   | —                                                     |
| `created_at`    | `timestamptz` | NOT NULL | `now()`             | —                                                     |
| `updated_at`    | `timestamptz` | NOT NULL | `now()`             | —                                                     |

```jsonc
// card_config 구조

{
  "free_card_count": 2,
  "paid_card_count": 4,
  "cards": [
    { "index": 1, "title": "상태 정의", "is_free": true, "prompt": "..." },
    {
      "index": 2,
      "title": "상황 설명 + 결핍",
      "is_free": true,
      "prompt": "...",
    },
    {
      "index": 3,
      "title": "왜 이렇게 되는지",
      "is_free": false,
      "prompt": "...",
    },
    {
      "index": 4,
      "title": "이게 실제로 어떤 상태인지",
      "is_free": false,
      "prompt": "...",
    },
    {
      "index": 5,
      "title": "이대로 가면 어떻게 되는지",
      "is_free": false,
      "prompt": "...",
    },
    {
      "index": 6,
      "title": "그래서 어떻게 해야 하는지",
      "is_free": false,
      "prompt": "...",
    },
  ],
}
```

---

### 3. `analysis_sessions`

> 사용자가 콘텐츠에 진입해 분석을 시작할 때 생성.  
> 결과 페이지 URL의 식별자로 사용 (`/result/[session_id]`).

| 컬럼                 | 타입          |   Null   | 기본값              | 제약                                                   |
| -------------------- | ------------- | :------: | ------------------- | ------------------------------------------------------ |
| `id`                 | `uuid`        | NOT NULL | `gen_random_uuid()` | PK                                                     |
| `content_id`         | `uuid`        | NOT NULL | —                   | FK → `contents(id)` ON DELETE RESTRICT                 |
| `user_id`            | `uuid`        |   NULL   | —                   | FK → `profiles(id)` ON DELETE SET NULL                 |
| `guest_id`           | `uuid`        |   NULL   | —                   | FK → `guest_credentials(id)` ON DELETE SET NULL        |
| `inferred_user_type` | `jsonb`       |   NULL   | —                   | AI가 추론한 사용자 타입                                |
| `status`             | `text`        | NOT NULL | `'pending'`         | CHECK IN `('pending','answered','completed','failed')` |
| `created_at`         | `timestamptz` | NOT NULL | `now()`             | —                                                      |
| `updated_at`         | `timestamptz` | NOT NULL | `now()`             | —                                                      |

> `status` 흐름: `pending` → `answered` → `completed` / `failed`

---

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
| `created_at`     | `timestamptz` | NOT NULL | `now()`             | —                                              |

> UNIQUE (`session_id`, `question_index`)  
> CHECK: `answer_text IS NOT NULL OR answer_options IS NOT NULL`

---

### 5. `result_cards`

> AI(Claude)가 생성한 분석 결과 카드. 세션당 N장.

| 컬럼            | 타입          |   Null   | 기본값              | 제약                                                     |
| --------------- | ------------- | :------: | ------------------- | -------------------------------------------------------- |
| `id`            | `uuid`        | NOT NULL | `gen_random_uuid()` | PK                                                       |
| `session_id`    | `uuid`        | NOT NULL | —                   | FK → `analysis_sessions(id)` ON DELETE CASCADE           |
| `card_index`    | `integer`     | NOT NULL | —                   | CHECK >= 1                                               |
| `card_title`    | `text`        | NOT NULL | —                   | —                                                        |
| `card_content`  | `text`        | NOT NULL | —                   | —                                                        |
| `preview_text`  | `text`        |   NULL   | —                   | —                                                        |
| `is_free`       | `boolean`     | NOT NULL | —                   | —                                                        |
| `status`        | `text`        | NOT NULL | `'pending'`         | CHECK IN `('pending','generating','completed','failed')` |
| `error_message` | `text`        |   NULL   | —                   | —                                                        |
| `created_at`    | `timestamptz` | NOT NULL | `now()`             | —                                                        |
| `updated_at`    | `timestamptz` | NOT NULL | `now()`             | —                                                        |

> UNIQUE (`session_id`, `card_index`)

---

### 6. `orders`

> 결제 주문. 회원/비회원 공용.

| 컬럼                | 타입          |   Null   | 기본값      | 제약                                              |
| ------------------- | ------------- | :------: | ----------- | ------------------------------------------------- |
| `id`                | `text`        | NOT NULL | —           | PK (Toss `orderId`)                               |
| `session_id`        | `uuid`        | NOT NULL | —           | FK → `analysis_sessions(id)` ON DELETE RESTRICT   |
| `user_id`           | `uuid`        |   NULL   | —           | FK → `profiles(id)` ON DELETE SET NULL            |
| `guest_id`          | `uuid`        |   NULL   | —           | FK → `guest_credentials(id)` ON DELETE SET NULL   |
| `purchase_type`     | `text`        | NOT NULL | —           | CHECK IN `('single','all')`                       |
| `target_card_index` | `integer`     |   NULL   | —           | CHECK >= 1                                        |
| `amount`            | `integer`     | NOT NULL | —           | CHECK > 0                                         |
| `status`            | `text`        | NOT NULL | `'pending'` | CHECK IN `('pending','paid','failed','refunded')` |
| `toss_payment_key`  | `text`        |   NULL   | —           | —                                                 |
| `toss_receipt_url`  | `text`        |   NULL   | —           | —                                                 |
| `payment_method`    | `text`        |   NULL   | —           | —                                                 |
| `failure_reason`    | `text`        |   NULL   | —           | —                                                 |
| `paid_at`           | `timestamptz` |   NULL   | —           | —                                                 |
| `created_at`        | `timestamptz` | NOT NULL | `now()`     | —                                                 |
| `updated_at`        | `timestamptz` | NOT NULL | `now()`     | —                                                 |

> CHECK: `(user_id IS NOT NULL AND guest_id IS NULL) OR (user_id IS NULL AND guest_id IS NOT NULL)`  
> CHECK: `purchase_type != 'single' OR target_card_index IS NOT NULL`

---

### 7. `card_unlocks`

> 결제 완료 후 카드별 잠금 해제 기록. 1카드 = 1행.

| 컬럼          | 타입          |   Null   | 기본값              | 제약                                           |
| ------------- | ------------- | :------: | ------------------- | ---------------------------------------------- |
| `id`          | `uuid`        | NOT NULL | `gen_random_uuid()` | PK                                             |
| `session_id`  | `uuid`        | NOT NULL | —                   | FK → `analysis_sessions(id)` ON DELETE CASCADE |
| `card_index`  | `integer`     | NOT NULL | —                   | CHECK >= 1                                     |
| `order_id`    | `text`        | NOT NULL | —                   | FK → `orders(id)` ON DELETE RESTRICT           |
| `unlocked_at` | `timestamptz` | NOT NULL | `now()`             | —                                              |

> UNIQUE (`session_id`, `card_index`)

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
| `card_index`        | `integer`     |   NULL   | —                   | CHECK >= 1                                       |
| `reason`            | `text`        | NOT NULL | —                   | CHECK IN `('error','irrelevant','tone','other')` |
| `reason_detail`     | `text`        |   NULL   | —                   | —                                                |
| `extra_instruction` | `text`        |   NULL   | —                   | —                                                |
| `regenerated_by`    | `uuid`        | NOT NULL | —                   | FK → `profiles(id)` ON DELETE RESTRICT           |
| `created_at`        | `timestamptz` | NOT NULL | `now()`             | —                                                |

> `card_index` NULL = 전체 재생성, 값 있음 = 특정 카드만 재생성

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

```
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
│       └── cards/route.ts                         GET (결과 카드 조회)
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

---

**문서 버전:** 3.5  
**작성일:** 2026년 5월
