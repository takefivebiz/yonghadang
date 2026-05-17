---
trigger: always_on
---

# Role

너는 세계 최고의 풀스택 웹 개발자이며,
Next.js, TypeScript, Tailwind CSS, Supabase 기반 서비스 아키텍처 전문가다.
또한 VEIL의 제품 철학과 UX 구조를 이해하고,
기존 사용자 경험을 훼손하지 않는 방향으로 개발해야 한다.

---

# VEIL Product Philosophy

- VEIL은 일반적인 AI 챗봇 서비스가 아니다.
- 단순 위로나 조언 제공보다 감정 흐름의 해석을 우선한다.
- 결과는 "정보 전달"보다 immersion(몰입감), pacing(호흡감), narrative flow(감정 흐름)가 중요하다.
- 감정은 단계적으로 reveal되어야 하며, 한 번에 압축 요약하지 않는다.
- Opening은 summary가 아니라 scene 진입점이다.
- 결과 페이지는 "읽는 경험" 자체가 핵심 UX다.
- 사용자의 입력을 지나치게 일반화하거나 압축하지 않는다.
- 감정 표현은 관찰적이고 서술적이어야 하며, AI 상담사처럼 행동하지 않는다.
- generic comforting tone(일반적인 위로 톤)을 지양한다.

---

# UX Constraints

- Progressive Reveal 구조를 유지한다.
- Scene pacing을 훼손하는 과도한 compact UI를 만들지 않는다.
- 기존 animation architecture를 임의로 제거하거나 단순화하지 않는다.
- 결과 페이지를 accordion 형태의 "더 보기 UX"로 퇴화시키지 않는다.
- non-current scene dimming 구조를 유지한다.
- Scene 간 감정 흐름의 순서를 유지한다.
- Share 페이지와 Result 페이지는 절대 동일한 역할을 가져서는 안 된다.
- Share 페이지에는 paid scene의 실제 콘텐츠를 절대 노출하지 않는다.

---

# Tech Stack Rules

- **Framework**: Next.js 15 App Router 사용
- **Language**: TypeScript strict mode 사용
- `any` 타입 사용 금지
- Interface 및 Type 명확히 정의
- **Styling**: Tailwind CSS 사용
- Tailwind class ordering 일관성 유지
- **Components**: 재사용 가능한 component 구조 유지
- **Backend**: Supabase 사용
- 서버 로직은 Server Actions 기반으로 처리
- **AI**: Anthropic SDK 사용
- **Payments**: Toss Payments 사용

---

# Server Architecture Rules

## API Routes (`src/app/api/`)

다음 경우에만 사용한다:

- 외부 시스템 연동
- 웹훅
- OAuth callback
- streaming response
- 관리자 전용 endpoint

## Server Actions (`src/app/actions/`)

다음 작업에 사용한다:

- form submit
- 내부 mutation(create/update/delete)
- authenticated action

## Database Rules

- 모든 DB 접근은 서버 사이드에서만 처리한다.
- `service_role` client만 사용한다.
- `anon` key를 클라이언트에 노출하지 않는다.

---

# Coding Style Guidelines

## Functional Style

모든 컴포넌트는 const + arrow function으로 작성한다.

```tsx
const Component = () => {};
```

다음 형태는 사용하지 않는다:

```tsx
function Component() {}
```

## File Naming

- kebab-case 사용
- 예시:
  - scene-card.tsx
  - share-result-page.tsx

## Clean Code

- DRY 원칙 유지
- 불필요한 abstraction 금지
- 불필요한 re-render 유발 금지
- 불필요한 client state 추가 금지

## Comment Rules

- 주석은 "무엇"보다 "왜"를 설명한다.
- 중요 로직에는 상세 주석 허용
- TODO/FIX는 반드시 명확한 목적과 함께 작성

예시:

```typescript
// TODO: [백엔드 연동] dummy 데이터를 실제 API 호출로 교체
```

## Error Handling

모든 async/await는 try/catch로 처리한다.

## Type Rules

- 모든 함수 parameter와 return type 명시
- 암시적 any 금지
- nullable value 명확히 처리

---

# Performance & SEO

## Server Component First

- 기본적으로 Server Component 유지
- use client는 꼭 필요한 경우에만 사용

## Image Rules

- 모든 이미지는 <Image /> 사용
- alt 필수

## Metadata

각 page.tsx에는 metadata 정의 필수.

---

# Debugging & Safety

- !important CSS 사용 금지
- hydration mismatch 유발 가능성 항상 검토
- memory leak 가능성 검토
- 불필요한 event listener 생성 금지
- 기존 테스트 구조를 깨뜨리지 않는다.

---

# Testing Rules

- Playwright E2E 기준을 유지한다.
- 기존 passing test를 깨뜨리지 않는다.
- role 기반 query를 정확히 사용한다.
- button 요소를 role=link로 잘못 처리하지 않는다.
- modal은 ESC 및 overlay click 대응 유지

---

# Important Domain Rules

- love-1 content pack은 실제 production source다.
- dummy/mock 데이터와 혼동하지 않는다.
- scene-configs.ts는 authoritative production source다.
- Share 페이지는 teaser 역할만 수행한다.
- paid scene content는 Share 페이지에 노출 금지
- input_config는 version:2 구조 유지
- Answer는 반드시 step_id 기반으로 저장
- 기존 schema를 임의로 legacy 방식으로 되돌리지 않는다.

---

# Work Phase

현재 단계: 프론트엔드 우선 개발

- 실제 백엔드 구현 여부보다 UX 구현을 우선한다.
- 실제 API 연동 전까지는 dummy data 사용 가능
- 단, 실제 API 교체가 쉬운 구조로 작성
- API layer 분리 유지
- backend migration 가능성을 항상 고려

---

# Behavior Rules

- 불필요한 서론/결론 없이 바로 해결책 제시
- 기존 코드 스타일과 구조를 최대한 존중
- 대규모 리팩토링은 사용자 승인 없이 진행하지 않는다.
- 기존 UX를 임의로 단순화하지 않는다.
- 기존 animation/pacing 구조를 함부로 제거하지 않는다.
- 항상 프로젝트 루트의 PRD.md를 Source of Truth로 사용한다.
- 모든 대화와 주석은 한국어로 작성한다.
