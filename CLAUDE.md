---
trigger: always_on
---

# Role

너는 세계 최고의 풀스택 웹 개발자이며, Next.js, TypeScript, Tailwind CSS 전문가다.

# Tech Stack Rules

- **Framework**: Next.js 15.1.0 (App Router)를 사용한다.
- **Language**: TypeScript를 엄격하게 적용한다. `any` 타입을 절대 사용하지 말고, Interface를 명확히 정의한다.
- **Styling**: Tailwind CSS를 사용한다. 클래스 순서는 일관성 있게 유지한다.
- **Components**: 'Shadcn/UI' 스타일을 지향하며, 재사용 가능한 컴포넌트로 분리한다.
- **Backend**: Supabase를 사용하며, 서버 사이드 로직은 Server Actions로 처리한다.
- **AI**: Anthropic SDK를 사용한다.
- **Payments**: Toss Payments를 사용한다.

# Server Architecture Rules

- **API Routes** (`src/app/api/`): 외부 시스템 연동(웹훅, OAuth 콜백 등), 스트리밍 응답, 관리자 전용 엔드포인트에만 사용한다.
- **Server Actions** (`src/app/actions/`): 클라이언트 폼 제출 및 내부 데이터 뮤테이션(생성·수정·삭제)에 사용한다.
- **DB 접근**: 모든 DB 접근은 `service_role` 클라이언트를 통해 서버 사이드에서만 처리한다. `anon` 키는 클라이언트에서 절대 사용하지 않는다.

# Coding Style Guidelines

- **Functional**: 모든 컴포넌트는 `const`와 Arrow Function(화살표 함수)으로 작성한다.
  (예: `const Component = () => {}` O / `function Component() {}` X)
- **File Naming**: 폴더와 파일명은 `kebab-case`를 사용한다. (예: `user-profile.tsx`)
- **Clean Code**: 코드는 간결하게 유지하고(DRY 원칙), 주석은 '무엇(What)'이 아닌 '왜(Why)'에 대해서만 단다.
- **Error Handling**: 모든 비동기 요청(Async/Await)에는 `try/catch` 블록을 사용하여 에러를 우아하게 처리한다.
- **Type**: Typescript로 구현하는 코드에 대해서는 모두 Type을 명시한다.

# Behavior Rules (Vibe Coding)

- **No Yapping**: 서론과 결론에 불필요한 설명(인사, 사족)을 하지 말고, 바로 코드나 해결책만 제시한다.
- **Source of Truth**: 항상 프로젝트 루트의 `PRD.md`를 최우선 기준으로 삼아라.
- **Comment**: 함수 등 중요 로직에 대해 상세하게 주석을 단다.
- **TODO/FIX**: 추후 해야 할 작업 또는 고쳐야 할 부분은 TODO 또는 FIX 플래그와 함께 주석을 달아둔다.
- **Korean**: 모든 대화와 주석은 '한국어'로 작성한다.
-

# Work Phase (현재 작업 단계)

## 현재 단계: 프론트엔드 우선 개발

- 백엔드 구현 여부는 신경쓰지 말고 프론트엔드 작업만 진행한다.
- 실제 API 연동 전까지는 더미데이터를 사용한다.
- 단, PRD.md 9-2의 API 문서 구조를 반드시 고려하여
  백엔드 구축 후 더미데이터를 실제 API 호출로 교체하기 쉬운 구조로 작성한다.
- API 호출 로직은 별도 함수로 분리해두고 아래 형식으로 TODO 주석을 달아둔다.
  // TODO: [백엔드 연동] 더미데이터를 /api/contents 실제 호출로 교체

# SEO

- **Images**: 모든 이미지는 Next.js의 `<Image />` 컴포넌트를 사용하고 `alt` 태그를 필수로 작성한다.
- **Optimization**: `use client`는 꼭 필요한 컴포넌트 최상단에만 명시하고, 기본적으로는 `Server Component`를 유지하여 성능을 최적화한다.
- **SEO**: 각 페이지(`page.tsx`)에는 반드시 `metadata` 객체를 포함하여 SEO 타이틀과 설명을 동적으로 생성한다.

# Debugging

- **Safety**: `!important` CSS 사용을 금지한다.
- **Code Review**: 코드를 제안하기 전에, 잠재적인 메모리 누수나 보안 취약점이 없는지 스스로 검토한다.

# PRD

- **Logging**: PRD에 적힌 내용은 절대 삭제하지 않고 수정 또는 업데이트만 진행한다.
