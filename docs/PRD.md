# Product Requirements Document (PRD)

# VEIL — 콘텐츠 기반 자기 해석 서비스

---

## 1. 프로젝트 개요

- **프로젝트명:** VEIL
- **목표:** 콘텐츠와 간단한 입력을 통해 사용자의 현재 상황, 감정, 관계를 해석하고, 즉시 소비 가능한 형태로 제공하는 수익형 웹 서비스.
- **핵심 가치 1:** 사용자가 이미 가지고 있는 고민을 구조적으로 드러내고, "이거 내 얘기다"라는 직관적인 자기 인식을 만든다.
- **핵심 가치 2:** 콘텐츠 기반 진입 구조와 카드형 결과를 통해 빠른 소비 → 몰입 → 결제로 이어지는 흐름을 만든다.

---

## 2. 타겟 유저

- 지금 자신의 상황이나 감정이 헷갈리는 20~40대 여성
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

| 역할                         | 색상      |
| ---------------------------- | --------- |
| Primary Background           | `#141021` |
| Secondary Background         | `#2F3159` |
| Primary Accent (Emotion)     | `#D16DAC` |
| Secondary Accent (Structure) | `#5E99AB` |
| Highlight                    | `#F9F9E5` |

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

#### 메인 페이지 (`/`)

- Mini Hero: "베일에 가려진 진짜 나" / "사주∙MBTI처럼 '끼워넣은 나' 말고. '진짜 나'"
- Category Tabs: 연애 / 인간관계 / 직업·진로 / 감정
- Content Grid: 질문형 콘텐츠 카드 리스트 (이미지 + 질문 문장 + 카테고리)

---

#### 콘텐츠 진입 (`/content/[id]`)

- 선택한 콘텐츠 질문 노출
- "지금 상황을 적어줘" 또는 선택형 질문 시작
- 콘텐츠의 `input_type`에 따라 입력 방식 분기

---

#### 입력 단계 (`/analyze/[session_id]`)

**Type A — 자유 입력 + 보정 질문**

- 자유 입력 1회
- 보정 질문 3~5개 (상태, 감정, 반응 등)

**Type B — 선택형**

- 8~12개 선택형 질문
- 복수 선택 가능

---

#### 결과 페이지 (`/result/[session_id]`)

카드형 결과 (기본값 6장, 콘텐츠별 `card_config`로 동적 설정)

| 구분 | 카드 | 제목                    |
| ---- | ---- | ----------------------- |
| 무료 | 1    | 핵심 한 줄              |
| 무료 | 2    | 상황 재정의             |
| 유료 | 3    | 상황의 실제 구조        |
| 유료 | 4    | 나의 반복 패턴          |
| 유료 | 5    | 상황을 만드는 핵심 요소 |
| 유료 | 6    | 현재 흐름의 결과        |

- 잠금 카드 미리보기 (2~3줄 preview)
- 개별 카드 열기: 900원
- 전체 열기: 2,900원

---

#### 결제 모달

비회원이 "카드 열기" 클릭 시 2단계 결제 모달 표시

**Step 1 — 비회원 인증**

```
┌──────────────────────────┐
│ 이 결과를 보려면          │
│ 인증 후 결제가 필요합니다 │
├──────────────────────────┤
│ 전화번호                  │
│ [010-1234-5678]          │
│                          │
│ 비밀번호 (4자리)          │
│ [****]                   │
│                          │
│ ℹ 같은 번호+비밀번호로    │
│   언제든 다시 볼 수 있어요│
│                          │
│ [인증 후 결제하기]        │
└──────────────────────────┘
```

**Step 2 — Toss Payments 위젯**

```
┌──────────────────────────┐
│ Toss Payments            │
│                          │
│ 결제 수단 선택            │
│ ├─ 신용/체크카드          │
│ ├─ 계좌이체               │
│ └─ 간편결제               │
│                          │
│ [결제하기]               │
└──────────────────────────┘
```

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

#### 비회원 조회 모달

네비게이션 바 "조회" 버튼 클릭 시 표시

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
- 성공 시 → `/result/[session_id]` 로 이동
- 실패 시 → "일치하는 기록이 없습니다" 에러

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

**카드 설정:**

```
┌──────────────────────────────────┐
│ 카드 설정                        │
├──────────────────────────────────┤
│ 무료 카드 개수: [2] ▼            │
│ 유료 카드 개수: [4] ▼            │
│                                  │
│ 카드별 상세 설정:                │
│ ┌────────────────────────────┐  │
│ │ 카드 1 (무료)               │  │
│ │ 제목: [핵심 한 줄]          │  │
│ │ Prompt: [...]               │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ 카드 2 (무료)               │  │
│ │ 제목: [상황 재정의]         │  │
│ │ Prompt: [...]               │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ 카드 3 (유료)               │  │
│ │ 제목: [상황의 실제 구조]    │  │
│ │ Prompt: [...]               │  │
│ └────────────────────────────┘  │
│                                  │
│ [+ 카드 추가]           [저장]   │
└──────────────────────────────────┘
```

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

| 코드                          | HTTP | 설명                            |
| ----------------------------- | ---- | ------------------------------- |
| `PAYMENT_AMOUNT_MISMATCH`     | 400  | 결제 금액 불일치 (위변조 시도)  |
| `PAYMENT_CONFIRMATION_FAILED` | 400  | Toss 결제 승인 실패             |
| `INVALID_PIN_FORMAT`          | 400  | PIN 형식 오류 (4자리 숫자 아님) |
| `MISSING_GUEST_AUTH`          | 400  | 비회원 인증 정보 누락           |
| `UNAUTHORIZED`                | 401  | 인증 필요                       |
| `GUEST_AUTH_FAILED`           | 401  | 비회원 전화번호/PIN 불일치      |
| `TOKEN_EXPIRED`               | 401  | 비회원 토큰 만료                |
| `FORBIDDEN`                   | 403  | 권한 없음                       |
| `CONTENT_NOT_FOUND`           | 404  | 콘텐츠 없음                     |
| `SESSION_NOT_FOUND`           | 404  | 세션 없음                       |
| `ORDER_NOT_FOUND`             | 404  | 주문 없음                       |

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
  input_type: "free" | "choice";
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
  created_at: string;
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
  answer_text?: string; // Type A: 자유 입력
  answer_options?: string[]; // Type B: 선택형 응답
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

> **내부 처리:**
>
> 1. `session_answers` 조회
> 2. `contents.card_config` 기반 카드 개수 및 프롬프트 결정
> 3. Claude에 카드별 프롬프트 전달
> 4. 생성 결과를 `result_cards`에 카드별 저장
> 5. `analysis_sessions.status` → `completed`

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

---

### 결제

#### `POST /api/payments/intent`

결제 주문 생성 (Toss 위젯 초기화용 `order_id` 발급)

| 항목      | 내용                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 인증      | 불필요 (회원/비회원 모두)                                                                                                      |
| Body      | `{ session_id: string, purchase_type: 'single'\|'all', target_card_index?: number, guest_phone?: string, guest_pin?: string }` |
| 성공 응답 | `201 { data: { order_id: string, amount: number } }`                                                                           |

> **동작 흐름:**
>
> 1. 비회원: `guest_phone` + `guest_pin` 수신
>    - `guest_credentials` 에서 기존 비회원 확인 또는 신규 생성
> 2. `orders` 에서 동일 세션의 `pending` 상태 주문 조회
>    - 있으면 재사용 (결제 재시도 대응)
>    - 없으면 신규 생성
> 3. `order_id`, `amount` 반환
>
> **purchase_type:**
>
> - `single`: 카드 1장 900원 (`target_card_index` 필수)
> - `all`: 전체 유료 카드 2,900원

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

전화번호 + PIN 인증 → 비회원 열람 토큰 발급

| 항목      | 내용                                                        |
| --------- | ----------------------------------------------------------- |
| 인증      | 불필요                                                      |
| Body      | `{ phone: string, pin: string }`                            |
| 성공 응답 | `200 { data: { guest_token: string, session_id: string } }` |
| 실패      | `401` — 일치하는 비회원 없음                                |

> - `guest_token`은 이후 요청 시 `X-Guest-Token` 헤더로 사용
> - 토큰 유효 시간: 30분
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
| `input_type`    | `text`        | NOT NULL | —                   | CHECK IN `('free','choice')`                          |
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
    { "index": 1, "title": "핵심 한 줄", "is_free": true, "prompt": "..." },
    { "index": 2, "title": "상황 재정의", "is_free": true, "prompt": "..." },
    {
      "index": 3,
      "title": "상황의 실제 구조",
      "is_free": false,
      "prompt": "...",
    },
    {
      "index": 4,
      "title": "나의 반복 패턴",
      "is_free": false,
      "prompt": "...",
    },
    {
      "index": 5,
      "title": "상황을 만드는 핵심 요소",
      "is_free": false,
      "prompt": "...",
    },
    {
      "index": 6,
      "title": "현재 흐름의 결과",
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

| 컬럼         | 타입          |   Null   | 기본값              | 제약                                                   |
| ------------ | ------------- | :------: | ------------------- | ------------------------------------------------------ |
| `id`         | `uuid`        | NOT NULL | `gen_random_uuid()` | PK                                                     |
| `content_id` | `uuid`        | NOT NULL | —                   | FK → `contents(id)` ON DELETE RESTRICT                 |
| `user_id`    | `uuid`        |   NULL   | —                   | FK → `profiles(id)` ON DELETE SET NULL                 |
| `guest_id`   | `uuid`        |   NULL   | —                   | FK → `guest_credentials(id)` ON DELETE SET NULL        |
| `status`     | `text`        | NOT NULL | `'pending'`         | CHECK IN `('pending','answered','completed','failed')` |
| `created_at` | `timestamptz` | NOT NULL | `now()`             | —                                                      |
| `updated_at` | `timestamptz` | NOT NULL | `now()`             | —                                                      |

> `status` 흐름: `pending` → `answered` → `completed` / `failed`

---

### 4. `session_answers`

> 세션 내 질문별 응답. Type A(자유 입력)와 Type B(선택형) 통합.

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

> 비회원 결제 완료 후 발급되는 단기 열람 토큰.  
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

**문서 버전:** 3.0  
**작성일:** 2026년 5월
