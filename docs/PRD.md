# Product Requirements Document (PRD)

## 1. 프로젝트 개요 (Project Overview)

- **프로젝트 명**: 용하당 (AI 사주, 심층MBTI, 타로, 점성술 서비스)
- **목표**: 사용자가 입력한 정보를 바탕으로 AI가 분석하여 심층적인 해석 및 리포트를 제공하는 수익형 웹 서비스.
- **핵심 가치 1**: 신비롭고 직관적인 UI 경험과 정확도 높은 AI 분석을 통해서 사용자에게 인사이트와 재미 제공.
- **핵심 가치 2**: 사주, MBTI, 타로점, 점성술 등 전문 분야를 선택해서 분석 가능.

---

## 2. 타겟 유저 (Target Audience)

- 연애, 금전, 자아, 선택 등 다양한 고민과 걱정을 가지고 있는 20-40대 남녀.
- 모바일 환경에서 간편하게 결과를 확인 및 공유하고 싶어하는 유저.

---

## 3. 기술 스택 (Tech Stack)

- **Web Framework**: Next.js 15.1.0 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend & DB**: Next.js API Routes, Supabase
- **Payments**: Toss Payments
- **AI**: Anthropic SDK

---

## 4. 디자인 가이드 (Design Guide)

- **Theme**: Mystical, Elegant, Accessible (신비로우면서도 접근가능한)
- **Colors**:
  - Primary: Deep Purple (#4A3B5C) + Pastel Pink (#F5D7E8) 그래디언트
  - Background: Cream/Off-white (#F5F0E8)
  - Accent: Light Lavender (#E8D4F0)
  - Accent Text: Dusty Rose (#D4A5A5)
  - Special: Mystical symbols (달, 별, 나선형) SVG 아이콘
- **Interactions**: 부드러운 스크롤, 호버 시 미묘한 그로우 효과, 로딩 시 부드러운 페이드-인 애니메이션
- **Overall Aesthetic**: 프리미엄하지만 친근하고, 신비로우면서도 따뜻한 느낌. 여성 타겟층의 직관과 감수성에 어필.

---

## 5. UX 플로우 (UX Flow)

### 5.1 전체 레이아웃 (Global Layout)

모든 페이지에 공통 적용되는 레이아웃 구조.

#### 5.1.1 상단 네비게이션 바 (Header)

| 구분   | 노출 요소                          |
| ------ | ---------------------------------- |
| 공통   | 홈 로고 (클릭 시 `/` 이동)         |
| 비회원 | 로그인 버튼, 비회원 주문 조회 버튼 |
| 회원   | 마이페이지 버튼                    |

- **반응형**: 모바일 환경(md 미만)에서는 우측 상단 햄버거 메뉴 아이콘 제공. 클릭 시 위에서 아래로 내려오는 풀 너비(Full-width) Drawer를 통해 메뉴 노출.

#### 5.1.2 Body

- 각 페이지별 주요 콘텐츠를 렌더링하는 영역.
- 페이지 라우팅에 따라 동적으로 교체됨.

#### 5.1.3 Footer

| 항목             | 설명                                    |
| ---------------- | --------------------------------------- |
| 사업자 정보      | 상호명, 대표자, 사업자등록번호, 주소 등 |
| 이용약관         | 별도 페이지(`/terms`) 링크              |
| 개인정보처리방침 | 별도 페이지(`/privacy`) 링크            |
| 문의하기         | 이메일 또는 채널 링크                   |

#### 5.1.4 Head & Meta

- **SEO**: 각 `page.tsx`에 `metadata` 객체 필수 작성 (title, description)
- **Open Graph**: og:title, og:description, og:image 설정 — SNS 공유 시 결과 카드 노출 최적화
- **Analytics**: GA4 연동 (`gtag.js`), 페이지뷰 및 주요 이벤트 추적

---

## 6. 유저 페이지 구성 (User Pages)

### 6-1. 메인 랜딩페이지 (/)

#### 6-1.1 페이지 구조

- **미니 히어로 섹션**
  - 서비스 한 줄 소개

- **콘텐츠 탐색 섹션** ("지금 바로 시작하세요")
  - 카테고리 탭 필터 (전체 / 사주 / MBTI / 타로 / 점성술)
  - 콘텐츠 카드 그리드
    - 카드 구성: 썸네일, 제목, 한 줄 설명, 카테고리 태그 표시
    - 인기/신규 배지 표시
    - 클릭 시: `/start` 이동 + 해당 콘텐츠 preselect

#### 6-1.2 카드 인터랙션

| 요소      | 동작                                  |
| --------- | ------------------------------------- |
| 카드 클릭 | `/start` 이동 + 해당 콘텐츠 preselect |

---

### 6-2. 빠른 시작 플로우 (/start)

콘텐츠 카드에서 클릭하여 진입하는 페이지.
`preselect` 파라미터로 콘텐츠가 미리 선택된 상태로 진입.

#### Step 1. 콘텐츠별 정보 입력

- 선택된 콘텐츠의 짧은 설명
- 카테고리별 필수 입력 정보를 수집.

**사주**

- 설명: 생년월일과 성별을 입력하면 AI가 당신의 사주를 풀이해드립니다.
- 필수: 생년월일, 성별
- 선택: 태어난 시간 (정확도 향상용)

**점성술**

- 설명: 당신의 별자리와 행성 위치를 분석해 운명을 읽습니다.
- 필수: 생년월일, 성별
- 선택: 태어난 시간 (정확도 향상용)

**MBTI**

- 설명: 심화된 MBTI 성격 유형으로 당신을 심층 분석합니다.
- 진행: MBTI 심층 검사 UI로 이동 (심화 질문)
- 검사 완료 후 다음 단계로

**타로**

- 설명: 타로 카드를 통해 당신의 상황과 미래를 점쳐봅니다.
- 필수: 질문 입력 (자유 텍스트)
- 선택: 카드 스프레드 선택

#### Step 2. 분기 처리

- 정보 수집 완료 → 기본 분석 리포트 생성 및 표시 → `/report/[order-id]` 이동
- 추가 분석 보기 원하면 → 결제 페이지(`/payments`) 이동

---

### 6-3. 카테고리 페이지 (/mbti, /saju, /tarot, /astrology)

**목적**: 빠른 탐색 및 콘텐츠 선택

- 카테고리 소개 텍스트 (한 두 문장)
- 해당 카테고리의 모든 콘텐츠 카드 목록
  - 인기/신규 배지 표시

#### 카드 구성

| 요소       | 설명               |
| ---------- | ------------------ |
| 썸네일     | 콘텐츠 대표 이미지 |
| 제목       | 콘텐츠 제목        |
| 한 줄 설명 | 간단한 설명        |
| 배지       | 인기/신규 표시     |

#### 카드 인터랙션

| 요소      | 동작                      |
| --------- | ------------------------- |
| 카드 클릭 | `/start` 이동 + preselect |

---

### 6-4. 개별 콘텐츠 상세 페이지 (/mbti/basic, /mbti/deep 등)

**목적**: 상세 정보 제공 및 마케팅 (검색 엔진, SNS 공유 최적화)

- **콘텐츠 헤더**
  - 대표 이미지 (큼)
  - 콘텐츠 제목
  - 카테고리 태그

- **콘텐츠 설명**
  - 이 리포트가 어떤 걸 알려주는지 상세 설명
  - 분석 항목 구조 설명

#### 콘텐츠 구조

**기본 분석 섹션 (완전 개방, 무료)**

- 실제 리포트의 기본 분석 내용을 완전히 보여줌
- 락 아이콘 없음
- 일반 텍스트로 명확하게 렌더링
- 결과 예시 (스크린샷 또는 미리보기) 포함
- 예: MBTI 기본 성격 분석, 사주 기본 풀이 등

**추가 분석 섹션 (블러 처리, 유료)**

- 🔒 **전체 분석** 제목 표시
- 실제 내용의 길이/양을 시각적으로 보여주되, **전체 텍스트에 blur CSS 처리**
- 제목과 섹션 구조는 보이지만 내용은 흐릿하게 표시
- 높이: 방대한 분량으로 "이 정도 내용이 있다"는 걸 보여줌
- "시작하기" 버튼이 섹션 위에 오버레이
- 포함 내용: 직업 궁합, 심층 분석, AI 맞춤 조언 등 모든 추가 섹션

- **안내 및 주의사항**
  - 보통 3분 이내에 생성이 완료됩니다.
  - 각 분야의 해석은 AI를 통해 데이터를 기반으로 생성됩니다.
  - 이 해석은 자기 이해를 돕기 위한 참고 자료이며, 의학적/심리학적 진단을 대체하지 않습니다.

#### CTA 버튼 구조

모든 콘텐츠는 기본 분석은 무료, 추가 분석은 유료 구조.

- **텍스트**: "시작하기"

- **동작**: `/start` 이동 + 콘텐츠 preselect

- **결과**:
  - 정보 입력 완료 → 기본 분석 리포트 생성 및 표시 (무료 부분)
  - 추가 분석(blur된 부분) 보기 원하면 → 결제 페이지로 진행
  - 결제 완료 → 추가 분석 섹션 blur 해제 및 전체 콘텐츠 표시

- **위치**: 하단 Sticky

- **모바일 최적화**: 버튼을 하단 Sticky로 배치하여 항상 접근 가능

---

### 6-5. 결제 페이지 (/payments)

- 선택한 리포트 요약 (제목, 가격)
- 입력 정보 요약
- 토스페이먼츠 위젯
- 회원/비회원 결제 모두 지원
- 비회원 결제 시 전화번호 + 비밀번호 입력 폼 표시
- 결제 성공 시: 회원 → 마이페이지, 비회원 → 비회원 주문 조회
- 결제 실패 시: 입력 정보 유지, 결제 페이지 머무름

---

### 6-6. 보고서 확인 페이지 (/report/[order-id])

- AI가 생성한 풀이 및 해석 보고서
- 회원/비회원 모두 접근 가능 (주문번호 기반)
- 보안: Server Component에서 세션과 데이터 소유자 수동 매칭
- **AI 생성 중 상태 처리**
  - `reports.status = 'pending'` 또는 `'generating'`: 프로그레스 바 UI
  - 3초 간격 폴링, 최대 10분 타임아웃
  - `status = 'done'`: 보고서 내용 표시
  - `status = 'error'`: 생성 실패 안내
- 결과 첫 문장 강조
- 섹션 분리 (카테고리별 해석 그룹핑)
- 하단: 링크 카피, 소셜 공유 버튼

---

### 6-7. 마이페이지 (/my-page)

- 회원가입된 유저만 접근 가능
- 닉네임 (수정 가능), 로그인 소셜 로고, 이메일, 로그아웃 버튼
- 구매 내역 리스트 (최신순)
- 각 항목 클릭 시 보고서 확인 페이지로 이동

---

### 6-8. 비회원 주문 조회 로그인 (/guest-login)

- 페이지 소개
- 전화번호 + 비밀번호 입력 폼
- "주문 조회" 버튼

---

### 6-9. 비회원 주문 조회 페이지 (/guest-check)

- 비회원이 자신의 구매 내역을 조회하는 페이지
- 구매 내역 리스트 배치
- 각 항목 클릭 시 보고서 확인 페이지로 이동

---

### 6-10. 회원 로그인/회원가입 (/auth)

- 구글 및 카카오 소셜 로그인만 지원
- 로그인 성공 후 메인 랜딩페이지(/) 또는 이전 페이지로 리다이렉트

---

### 6-11. 비회원 UX 및 로그인 정책

#### 비회원 유저 플로우

- 로그인 없이 `/start` → 입력 → 결제 진행 가능
- 무료 콘텐츠 이용 가능
- 결제 완료 시 전화번호 + 비밀번호로 비회원 계정 생성

#### 로그인 유도 시점

- 결과 확인 이후 (저장 시)
- 결제 완료 이후

#### 안내 메시지

- "나중에 로그인하면 구매 내역을 쉽게 관리할 수 있습니다"

---

## 7. 관리자 페이지 구성 (Admin Pages)

### 7-0. 공통 레이아웃

- 좌측 네비게이션 패널
  - 매출 조회
  - 주문 내역
  - 유저 관리
- 네비게이션 패널을 제외한 영역은 각 페이지별 body 콘텐츠로 구성
- 반응형: 모바일 환경에서 Drawer 메뉴로 전환

### 7-1. 관리자 로그인 (/admin/login)

- 관리자 전용 이메일/비밀번호 로그인 폼
- 인증 실패 시 에러 메시지 표시
- 로그인 성공 시 /admin으로 리다이렉트
- 비로그인 상태에서 /admin 접근 시 /admin/login으로 리다이렉트

### 7-2. 관리자 메인 / 매출 조회 (/admin)

- 기간별 매출 조회 대시보드 (기본 화면)
  - 일별 / 주별 / 월별 필터
- 핵심 지표 요약 카드
  - 총 매출액, 총 주문 수, 신규 유저 수, 누적 AI 해석 건수
  - 전월 대비 증감률 표시
- 매출 추이 차트: 최근 8개월간 월별 매출 합계 바 차트로 시각화

### 7-3. 주문 내역 리스트 (/admin/order-list)

- 결제 완료된 주문 건 확인을 위한 리스트 표
- 주요 항목: 주문 ID, 구매 일시, 닉네임, 회원/비회원 구분, 콘텐츠 종류, 결제 금액, 상태 배지
- 필터: 날짜, 콘텐츠 종류, 회원/비회원
- 검색: 주문번호 및 유저 닉네임 실시간 필터링
- 각 리스트 아이템 클릭 시 상세 주문 내역 페이지로 이동

### 7-4. 상세 주문 내역 (/admin/order-list/[order-id])

- 7-3에 종속된 페이지
- 표시 정보
  - 회원/비회원 여부 및 구매자 정보 (닉네임, 이메일, 연락처)
  - 결제 완료 여부, 결제 금액, 승인 일시
  - 유저가 입력한 정보 (input 데이터)
  - LLM이 생성한 해석 텍스트
- 액션
  - LLM 해석 재생성 요청 버튼
  - 환불 처리 버튼 (토스페이먼츠 결제 취소 연동)

### 7-5. 유저 리스트 (/admin/user-list)

- 회원 및 비회원 유저 리스트 표
- 필터: 회원/비회원 구분 (전체 / 회원 / 비회원)
- 주요 항목: 닉네임, 이메일/전화번호, 가입 경로 (Google/Kakao/Guest), 결제 여부, 누적 주문 건수, 가입 일시
- 검색: 닉네임, 이메일, 전화번호 실시간 필터링
- 각 유저 클릭 시 유저 상세 페이지로 이동

### 7-6. 유저 상세 (/admin/user-list/[user-id])

- 7-5에 종속된 페이지
- 유저 기본 정보 (회원/비회원, 이메일, 가입일 등)
- 해당 유저의 전체 주문 내역 리스트
- 각 주문 클릭 시 상세 주문 내역(7-4)으로 이동

---

## 8. 알림 (Notifications)

### 8-1. 관리자 텔레그램 알림

- **결제 완료 시**: 콘텐츠 종류, 유저 ID, 결제 금액, 입력 정보 앞부분 포함하여 즉시 발송
- **결제 실패 시**: 실패 사유(잔액 부족, 취소 등) 및 에러 메시지 발송
- **AI 해석 완료 시**: 백그라운드 생성 완료 또는 오류 발생 시 최종 결과 포함하여 발송

---

## 9. 서버 설계 (Server Architecture)

### 9-0. 설계 원칙

- **API Routes** (`src/app/api/`): 외부 시스템 연동(토스 웹훅, OAuth 콜백), 스트리밍 응답, 관리자 전용 엔드포인트
- **Server Actions** (`src/app/actions/`): 클라이언트 폼 제출, 내부 데이터 뮤테이션 (Next.js App Router 권장 패턴)
- **인증 미들웨어** (`src/middleware.ts`): `/admin/*` 라우트에 관리자 세션 검증, `/my-page` 에 회원 세션 검증, `/guest-check` 에 비회원 세션 쿠키 검증 적용 (미인증 시 `/guest-login`으로 리다이렉트)

---

### 9-1. DB 스키마 (Supabase)

> - Supabase PostgreSQL 17 (ap-northeast-1) 기반. `auth.users`는 Supabase 내장 인증 테이블.
> - 모든 테이블의 `id`는 `gen_random_uuid()` 기본값 적용.
> - `updated_at`은 각 테이블에 DB Trigger(`moddatetime`)로 자동 갱신.

---

#### ERD 관계 요약

```
auth.users (Supabase 내장)
    │ 1:1
    ▼
profiles ──────────────────────────────┐
                                       │
guests ────────────────────────────────┤  (둘 중 하나만 연결)
                                       │ N:1
                                  orders ──── N:1 ──── contents
                                       │ 1:1
                                    reports

admins (관리자 전용, auth.users와 무관)
```

---

#### 테이블 1 — `profiles` (소셜 로그인 회원 프로필)

> `auth.users` INSERT 시 DB Trigger로 자동 생성.

| 컬럼명       | 타입          | Null     | 기본값  | 설명                                      |
| ------------ | ------------- | -------- | ------- | ----------------------------------------- |
| `id`         | `UUID`        | NOT NULL | —       | PK, FK → `auth.users.id`                  |
| `nickname`   | `TEXT`        | NOT NULL | —       | 표시 닉네임 (수정 가능)                   |
| `email`      | `TEXT`        | NOT NULL | —       | 소셜 이메일 (auth.users에서 복사, 캐싱)   |
| `provider`   | `TEXT`        | NOT NULL | —       | 가입 경로. CHECK IN `('google', 'kakao')` |
| `avatar_url` | `TEXT`        | NULL     | `NULL`  | 소셜 프로필 이미지 URL                    |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | 가입 일시                                 |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | 수정 일시 (Trigger 자동 갱신)             |

**제약 조건**

- `PK`: `id`
- `FK`: `id` → `auth.users(id)` ON DELETE CASCADE

**RLS 정책**

- `SELECT`: `auth.uid() = id` (본인만 조회)
- `UPDATE`: `auth.uid() = id` (본인만 수정)
- `INSERT` / `DELETE`: 서버 `service_role`만 허용

---

#### 테이블 2 — `guests` (비회원)

> `createOrder` 실행 시점에 신규 비회원이면 전화번호+비밀번호로 `guests` 테이블에 비회원 계정 레코드 생성.
> 기존 비회원(전화번호 이미 존재)이면 해당 `guests` 레코드와 주문 연결.
> 이후 `/api/guest/login`으로 세션 발급.

| 컬럼명          | 타입          | Null     | 기본값              | 설명                          |
| --------------- | ------------- | -------- | ------------------- | ----------------------------- |
| `id`            | `UUID`        | NOT NULL | `gen_random_uuid()` | PK                            |
| `phone`         | `TEXT`        | NOT NULL | —                   | 전화번호. UNIQUE              |
| `password_hash` | `TEXT`        | NOT NULL | —                   | bcrypt 해시 비밀번호          |
| `created_at`    | `TIMESTAMPTZ` | NOT NULL | `now()`             | 생성 일시                     |
| `updated_at`    | `TIMESTAMPTZ` | NOT NULL | `now()`             | 수정 일시 (Trigger 자동 갱신) |

**제약 조건**

- `PK`: `id`
- `UNIQUE`: `phone`

**RLS 정책**: 비활성화 — 서버 `service_role`로만 접근. 비회원 세션 검증은 API Route에서 수동 처리.

---

#### 테이블 3 — `admins` (관리자)

> Supabase `auth.users`와 독립적인 관리자 전용 인증 테이블.

| 컬럼명          | 타입          | Null     | 기본값              | 설명                  |
| --------------- | ------------- | -------- | ------------------- | --------------------- |
| `id`            | `UUID`        | NOT NULL | `gen_random_uuid()` | PK                    |
| `email`         | `TEXT`        | NOT NULL | —                   | 관리자 이메일. UNIQUE |
| `password_hash` | `TEXT`        | NOT NULL | —                   | bcrypt 해시 비밀번호  |
| `last_login_at` | `TIMESTAMPTZ` | NULL     | `NULL`              | 마지막 로그인 일시    |
| `created_at`    | `TIMESTAMPTZ` | NOT NULL | `now()`             | 생성 일시             |

**제약 조건**

- `PK`: `id`
- `UNIQUE`: `email`

**RLS 정책**: 비활성화 — 서버 `service_role`로만 접근.

---

#### 테이블 4 — `contents` (서비스 콘텐츠)

> 관리자가 직접 관리하는 서비스 상품 목록 (MBTI, 사주, 타로, 점성술 등).

| 컬럼명            | 타입          | Null     | 기본값              | 설명                                                        |
| ----------------- | ------------- | -------- | ------------------- | ----------------------------------------------------------- |
| `id`              | `UUID`        | NOT NULL | `gen_random_uuid()` | PK                                                          |
| `slug`            | `TEXT`        | NOT NULL | —                   | URL 식별자. UNIQUE. 예: `mbti-basic`, `saju-deep`           |
| `category`        | `TEXT`        | NOT NULL | —                   | 카테고리. CHECK IN `('mbti', 'saju', 'tarot', 'astrology')` |
| `title`           | `TEXT`        | NOT NULL | —                   | 콘텐츠 제목                                                 |
| `description`     | `TEXT`        | NOT NULL | —                   | 한 줄 설명                                                  |
| `thumbnail_url`   | `TEXT`        | NULL     | `NULL`              | 카드 썸네일 이미지 URL                                      |
| `price`           | `INTEGER`     | NOT NULL | —                   | 판매 가격 (원화, 단위: 원). CHECK `>= 0` (0이면 완전 무료)  |
| `badge`           | `TEXT`        | NULL     | `NULL`              | 배지. CHECK IN `('popular', 'new')` or NULL                 |
| `input_schema`    | `JSONB`       | NOT NULL | —                   | 유저 입력 폼 필드 정의 스키마 (아래 예시 참조)              |
| `prompt_template` | `TEXT`        | NOT NULL | —                   | AI 프롬프트 템플릿 (`{{변수}}` 치환 방식)                   |
| `is_active`       | `BOOLEAN`     | NOT NULL | `true`              | 노출 여부                                                   |
| `sort_order`      | `INTEGER`     | NOT NULL | `0`                 | 카드 정렬 순서 (낮을수록 앞)                                |
| `created_at`      | `TIMESTAMPTZ` | NOT NULL | `now()`             | 생성 일시                                                   |
| `updated_at`      | `TIMESTAMPTZ` | NOT NULL | `now()`             | 수정 일시 (Trigger 자동 갱신)                               |

**제약 조건**

- `PK`: `id`
- `UNIQUE`: `slug`
- `CHECK`: `price >= 0`
- `CHECK`: `badge IN ('popular', 'new') OR badge IS NULL`
- `CHECK`: `category IN ('mbti', 'saju', 'tarot', 'astrology')`

**RLS 정책**

- `SELECT`: 전체 허용 (public)
- `INSERT` / `UPDATE` / `DELETE`: 서버 `service_role`만 허용

**인덱스**

- `idx_contents_category` — `(category)`: 카테고리 필터
- `idx_contents_active_sort` — `(is_active, sort_order)`: 활성 콘텐츠 정렬 조회

**input_schema 예시**

```json
// 사주 콘텐츠
{
  "fields": [
    {
      "name": "birthDate",
      "type": "date",
      "required": true,
      "label": "생년월일"
    },
    {
      "name": "gender",
      "type": "select",
      "required": true,
      "label": "성별",
      "options": ["남", "여"]
    },
    {
      "name": "birthTime",
      "type": "time",
      "required": false,
      "label": "태어난 시간"
    }
  ]
}

// MBTI 콘텐츠 (검사만 진행, 입력 필드 없음)
{
  "fields": []
}

// 타로 콘텐츠
{
  "fields": [
    {
      "name": "question",
      "type": "textarea",
      "required": true,
      "label": "질문"
    },
    {
      "name": "spread",
      "type": "select",
      "required": false,
      "label": "카드 스프레드",
      "options": ["3-card", "5-card", "celtic-cross"]
    }
  ]
}
```

---

#### 테이블 5 — `orders` (주문)

> 결제 전 `createOrder` 시점에 생성 (`status = 'pending'`), 이후 결제 결과에 따라 상태 업데이트.
> `user_id`와 `guest_id` 중 **정확히 하나만** 값을 가져야 함 (회원 또는 비회원, 둘 다 아님).

| 컬럼명             | 타입          | Null     | 기본값              | 설명                                                                           |
| ------------------ | ------------- | -------- | ------------------- | ------------------------------------------------------------------------------ |
| `id`               | `UUID`        | NOT NULL | `gen_random_uuid()` | PK                                                                             |
| `toss_order_id`    | `TEXT`        | NOT NULL | —                   | 토스에 전달하는 주문 ID (UUID 기반 생성). UNIQUE                               |
| `user_id`          | `UUID`        | NULL     | `NULL`              | FK → `profiles(id)`. 회원 주문 시 설정                                         |
| `guest_id`         | `UUID`        | NULL     | `NULL`              | FK → `guests(id)`. 비회원 주문 시 설정                                         |
| `content_id`       | `UUID`        | NOT NULL | —                   | FK → `contents(id)`                                                            |
| `amount`           | `INTEGER`     | NOT NULL | —                   | `contents.price`와 대조 검증 후 일치 시 저장하는 결제 금액 (원화). CHECK `> 0` |
| `status`           | `TEXT`        | NOT NULL | `'pending'`         | 주문 상태. CHECK IN `('pending', 'paid', 'failed', 'refunded', 'expired')`     |
| `toss_payment_key` | `TEXT`        | NULL     | `NULL`              | 토스 결제 승인 키 (paid 상태에서 채워짐, 환불 시 필수)                         |
| `fail_code`        | `TEXT`        | NULL     | `NULL`              | 결제 실패 코드 (failed 상태에서 채워짐)                                        |
| `fail_message`     | `TEXT`        | NULL     | `NULL`              | 결제 실패 메시지 (failed 상태에서 채워짐)                                      |
| `input_data`       | `JSONB`       | NOT NULL | —                   | 유저 입력 데이터 (`contents.input_schema` 기반)                                |
| `paid_at`          | `TIMESTAMPTZ` | NULL     | `NULL`              | 결제 완료 일시                                                                 |
| `refunded_at`      | `TIMESTAMPTZ` | NULL     | `NULL`              | 환불 완료 일시                                                                 |
| `created_at`       | `TIMESTAMPTZ` | NOT NULL | `now()`             | 주문 생성 일시                                                                 |
| `updated_at`       | `TIMESTAMPTZ` | NOT NULL | `now()`             | 수정 일시 (Trigger 자동 갱신)                                                  |

**제약 조건**

- `PK`: `id`
- `UNIQUE`: `toss_order_id`
- `FK`: `user_id` → `profiles(id)` ON DELETE SET NULL
- `FK`: `guest_id` → `guests(id)` ON DELETE SET NULL
- `FK`: `content_id` → `contents(id)` ON DELETE RESTRICT
- `CHECK`: `(user_id IS NOT NULL AND guest_id IS NULL) OR (user_id IS NULL AND guest_id IS NOT NULL)` (둘 중 정확히 하나만)
- `CHECK`: `amount > 0`
- `CHECK`: `status IN ('pending', 'paid', 'failed', 'refunded', 'expired')`

**RLS 정책**: 비활성화 — 서버 `service_role`로만 접근. 보고서 페이지 진입 시 `user_id` / `guest_id`와 세션을 API Route에서 수동 매칭.

**pending 만료 정책**: `status = 'pending'`인 주문은 생성 후 30분 경과 시 `status = 'expired'`로 업데이트. 만료 방식은 Supabase `pg_cron`으로 주기적 배치 처리 또는 결제 시도 시점에 서버에서 `created_at < now() - interval '30 minutes'` 조건으로 확인하는 방식 중 선택.

**인덱스**

- `idx_orders_user_id` — `(user_id)`: 마이페이지 주문 목록
- `idx_orders_guest_id` — `(guest_id)`: 비회원 주문 목록
- `idx_orders_status` — `(status)`: 관리자 상태 필터
- `idx_orders_created_at` — `(created_at DESC)`: 최신순 정렬
- `idx_orders_content_id` — `(content_id)`: 관리자 콘텐츠 종류 필터

---

#### 테이블 6 — `reports` (AI 생성 보고서)

> `orders.status = 'paid'` 직후 `status = 'pending'` 레코드 생성 후 비동기 AI 생성 진행.

| 컬럼명          | 타입          | Null     | 기본값              | 설명                                                             |
| --------------- | ------------- | -------- | ------------------- | ---------------------------------------------------------------- |
| `id`            | `UUID`        | NOT NULL | `gen_random_uuid()` | PK                                                               |
| `order_id`      | `UUID`        | NOT NULL | —                   | FK → `orders(id)`. UNIQUE (주문당 보고서 1개)                    |
| `status`        | `TEXT`        | NOT NULL | `'pending'`         | 생성 상태. CHECK IN `('pending', 'generating', 'done', 'error')` |
| `content`       | `TEXT`        | NULL     | `NULL`              | AI 생성 보고서 텍스트 (done 상태에서 채워짐)                     |
| `error_message` | `TEXT`        | NULL     | `NULL`              | 에러 메시지 (error 상태에서 채워짐)                              |
| `generated_at`  | `TIMESTAMPTZ` | NULL     | `NULL`              | 생성 완료 일시                                                   |
| `created_at`    | `TIMESTAMPTZ` | NOT NULL | `now()`             | 레코드 생성 일시                                                 |
| `updated_at`    | `TIMESTAMPTZ` | NOT NULL | `now()`             | 수정 일시 (Trigger 자동 갱신)                                    |

**제약 조건**

- `PK`: `id`
- `UNIQUE`: `order_id`
- `FK`: `order_id` → `orders(id)` ON DELETE CASCADE
- `CHECK`: `status IN ('pending', 'generating', 'done', 'error')`

**RLS 정책**: 비활성화 — `orders`와 동일하게 서버 `service_role`로만 접근.

---

#### DB Trigger 목록

| Trigger명              | 대상                      | 실행 시점      | 동작                                                                                     |
| ---------------------- | ------------------------- | -------------- | ---------------------------------------------------------------------------------------- |
| `on_auth_user_created` | `auth.users` AFTER INSERT | 신규 회원 가입 | `profiles` 레코드 자동 생성 (`nickname` = 이메일 앞부분, `provider` = identity provider) |
| `set_updated_at`       | 모든 테이블 BEFORE UPDATE | 모든 UPDATE    | `updated_at = now()` 자동 갱신 (`moddatetime` extension 사용)                            |

---

### 9-2. API Routes

> 파일 위치: `src/app/api/[domain]/route.ts`

#### 인증 도메인 `/api/auth`

| Method | Endpoint             | 설명                                                                                             | 인증 |
| ------ | -------------------- | ------------------------------------------------------------------------------------------------ | ---- |
| `GET`  | `/api/auth/callback` | Supabase OAuth 콜백 처리. 인증 코드 검증 후 세션 확정, 성공 시 `/` 또는 이전 페이지로 리다이렉트 | 없음 |

---

#### 콘텐츠 도메인 `/api/contents`

| Method | Endpoint               | 설명             | 인증 |
| ------ | ---------------------- | ---------------- | ---- |
| `GET`  | `/api/contents`        | 콘텐츠 목록 조회 | 없음 |
| `GET`  | `/api/contents/[slug]` | 콘텐츠 상세 조회 | 없음 |

**Query Params (`GET /api/contents`)**

```
?category=mbti|saju|tarot|astrology  // 카테고리 필터 (생략 시 전체)
?badge=popular|new                    // 배지 필터
```

---

#### 결제 도메인 `/api/payments`

| Method | Endpoint                | 설명                | 인증                 |
| ------ | ----------------------- | ------------------- | -------------------- |
| `POST` | `/api/payments/confirm` | 토스 결제 승인 요청 | 없음 (order_id 검증) |
| `POST` | `/api/payments/fail`    | 결제 실패 정보 기록 | 없음 (order_id 검증) |
| `POST` | `/api/payments/cancel`  | 결제 취소/환불      | 관리자 세션          |
| `POST` | `/api/payments/webhook` | 토스 웹훅 수신      | 웹훅 시크릿 검증     |

**`POST /api/payments/confirm` 요청 바디**

```json
{ "paymentKey": "string", "orderId": "string", "amount": 0 }
```

**처리 순서**

- **성공**: 토스 서버에 승인 요청 → `orders.status = paid` + `toss_payment_key` 저장 업데이트 → AI 해석 생성 비동기 호출 → 텔레그램 성공 알림 발송
- **실패**: `orders.status = failed` + `fail_code`, `fail_message` 저장 업데이트 → 텔레그램 실패 알림 발송

**`POST /api/payments/fail` 요청 바디**

```json
{ "orderId": "string", "code": "string", "message": "string" }
```

**처리 순서**: `orders.status = failed` + `fail_code`, `fail_message` 저장 업데이트 → 텔레그램 실패 알림 발송

**`POST /api/payments/cancel` 처리**

- 요청 바디: `{ "orderId": "string" }`
- 미들웨어에서 관리자 세션 검증 선행
- 토스 API 호출: `toss_order_id` + `toss_payment_key` 함께 사용하여 환불 요청
- 성공 시: `orders.status = refunded` + `refunded_at = now()` 업데이트
- 텔레그램 환불 알림 발송

**`POST /api/payments/webhook` 처리**

- `DONE` 이벤트: 결제 DB 상태 동기화 (중복 방지 idempotency key 체크)
- `CANCELED` 이벤트: `orders.status = refunded` + `refunded_at = now()` 업데이트

---

#### AI 해석 도메인 `/api/ai`

| Method | Endpoint             | 설명                    | 인증                      |
| ------ | -------------------- | ----------------------- | ------------------------- |
| `POST` | `/api/ai/generate`   | AI 해석 생성 (스트리밍) | order_id + 결제 완료 검증 |
| `POST` | `/api/ai/regenerate` | AI 해석 재생성          | 관리자 세션               |

**`POST /api/ai/generate` 처리 순서**

1. `order_id`로 결제 완료 여부 검증 (`orders.status = paid`)
2. `reports` 테이블에 `status = generating` 레코드 생성 (중복 실행 방지)
3. `contents.prompt_template`의 `{{변수}}`를 `orders.input_data`로 치환하여 프롬프트 조합
4. Anthropic SDK로 Claude 호출 (스트리밍 응답)
5. 완료 시 `reports.status = done` + `generated_at = now()`, 오류 시 `reports.status = error` + `error_message` 저장
6. 텔레그램 알림 발송

---

#### 비회원 도메인 `/api/guest`

| Method | Endpoint           | 설명                              | 인증 |
| ------ | ------------------ | --------------------------------- | ---- |
| `POST` | `/api/guest/login` | 비회원 인증 (전화번호 + 비밀번호) | 없음 |

**`POST /api/guest/login` 처리**

- 요청 바디: `{ "phone": "string", "password": "string" }`
- `guests` 테이블에서 phone 조회 → `bcrypt` 비밀번호 검증
- 성공: HttpOnly + Secure + SameSite=Strict 쿠키로 세션 발급 (만료: 24시간)
- 실패: 401 반환
- 비회원이 존재하지 않으면 404 반환 (guest 레코드는 `createOrder` 시점에만 생성됨)

**`/guest-check` 페이지 구현 방식**

- Server Component에서 쿠키 기반 `guest_id` 획득
- `getGuestOrders` Server Action으로 주문 목록 조회
- API Route 불필요 (Server Component + Server Action 패턴)

---

#### 알림 도메인 `/api/notifications`

| Method | Endpoint                      | 설명                 | 인증                  |
| ------ | ----------------------------- | -------------------- | --------------------- |
| `POST` | `/api/notifications/telegram` | 텔레그램 메시지 발송 | 내부 서버 시크릿 헤더 |

> 외부에서 직접 호출 불가. `X-Internal-Secret` 헤더로 내부 서버 간 호출만 허용.

---

#### 관리자 도메인 `/api/admin`

> 모든 엔드포인트: 미들웨어에서 관리자 세션 검증 선행 적용.

**인증**

| Method | Endpoint                 | 설명                                                    |
| ------ | ------------------------ | ------------------------------------------------------- |
| `POST` | `/api/admin/auth/login`  | 관리자 이메일/비밀번호 로그인 → HttpOnly 세션 쿠키 발급 |
| `POST` | `/api/admin/auth/logout` | 관리자 세션 쿠키 파기                                   |

**매출 통계**

| Method | Endpoint                 | 설명                                                                       |
| ------ | ------------------------ | -------------------------------------------------------------------------- |
| `GET`  | `/api/admin/stats`       | 핵심 지표 요약 (총 매출, 주문 수, 신규 유저, AI 해석 건수, 전월 대비 증감) |
| `GET`  | `/api/admin/stats/chart` | 월별 매출 추이 차트 데이터 (최근 8개월)                                    |

**Query Params (`GET /api/admin/stats`)**

```
?period=daily|weekly|monthly  // 조회 기간 단위 (기본값: monthly)
?from=YYYY-MM-DD&to=YYYY-MM-DD
```

**주문 관리**

| Method | Endpoint                                  | 설명                                              |
| ------ | ----------------------------------------- | ------------------------------------------------- |
| `GET`  | `/api/admin/orders`                       | 주문 목록 (필터/검색/페이지네이션)                |
| `GET`  | `/api/admin/orders/[order-id]`            | 주문 상세 (구매자 정보 + 입력 데이터 + AI 보고서) |
| `POST` | `/api/admin/orders/[order-id]/refund`     | 환불 처리 (토스 결제 취소 API 연동)               |
| `POST` | `/api/admin/orders/[order-id]/regenerate` | AI 해석 재생성 요청                               |

**Query Params (`GET /api/admin/orders`)**

```
?from=YYYY-MM-DD&to=YYYY-MM-DD  // 날짜 범위
?category=mbti|saju|tarot|astrology
?type=member|guest               // 회원/비회원
?q=검색어                        // 주문번호 또는 닉네임 검색
?page=1&limit=20
```

**유저 관리**

| Method | Endpoint                     | 설명                                   |
| ------ | ---------------------------- | -------------------------------------- |
| `GET`  | `/api/admin/users`           | 유저 목록 (필터/검색/페이지네이션)     |
| `GET`  | `/api/admin/users/[user-id]` | 유저 상세 + 해당 유저의 전체 주문 목록 |

**Query Params (`GET /api/admin/users`)**

```
?type=all|member|guest  // 회원/비회원 구분 (기본값: all)
?q=검색어               // 닉네임, 이메일, 전화번호 검색
?page=1&limit=20
```

---

### 9-3. Server Actions

> 파일 위치: `src/app/actions/[domain].ts`

| Action           | 설명                                                                                                                                                                                                                                                                                          | 호출 위치                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `createOrder`    | **신규 비회원**: phone_number + guest_password 받아 → `guests` 신규 레코드 생성 후 주문 생성. **기존 비회원**: phone_number만 받아 → 기존 `guests` 레코드 조회 후 주문 생성. 클라이언트 전달 `amount`와 DB의 `contents.price`를 서버에서 대조하여 금액 위변조 차단. 비밀번호는 bcrypt로 해싱. | 콘텐츠 상세 페이지 / 결제 페이지  |
| `getOrderReport` | 주문 + 보고서 조회 (소유권 검증 포함). 회원: `auth.getSession()` → `user_id`로 검증. 비회원: `cookies().get('guest_session')` → `guest_id`로 검증. 소유권 불일치 시 403 반환.                                                                                                                 | 보고서 페이지 (Server Component)  |
| `updateNickname` | 회원 닉네임 수정. 세션 검증 후 `auth.uid() = profiles.id` 확인.                                                                                                                                                                                                                               | 마이페이지                        |
| `getMyOrders`    | 회원 주문 목록 조회. 세션 검증 후 `user_id = auth.uid()` 조건으로 조회.                                                                                                                                                                                                                       | 마이페이지 (Server Component)     |
| `getGuestOrders` | 비회원 주문 목록 조회. 쿠키 기반 `guest_id` 획득 후 `guest_id = cookies().get('guest_session')` 조건으로 조회.                                                                                                                                                                                | `/guest-check` (Server Component) |

---

### 9-4. 파일 구조 (Server)

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── callback/route.ts            # GET /api/auth/callback
│   │   ├── contents/
│   │   │   ├── route.ts                     # GET /api/contents
│   │   │   └── [slug]/
│   │   │       └── route.ts                 # GET /api/contents/[slug]
│   │   ├── payments/
│   │   │   ├── confirm/route.ts             # POST /api/payments/confirm
│   │   │   ├── fail/route.ts                # POST /api/payments/fail
│   │   │   ├── cancel/route.ts              # POST /api/payments/cancel
│   │   │   └── webhook/route.ts             # POST /api/payments/webhook
│   │   ├── ai/
│   │   │   ├── generate/route.ts            # POST /api/ai/generate
│   │   │   └── regenerate/route.ts          # POST /api/ai/regenerate
│   │   ├── guest/
│   │   │   └── login/route.ts               # POST /api/guest/login
│   │   ├── notifications/
│   │   │   └── telegram/route.ts            # POST /api/notifications/telegram
│   │   └── admin/
│   │       ├── auth/
│   │       │   ├── login/route.ts           # POST /api/admin/auth/login
│   │       │   └── logout/route.ts          # POST /api/admin/auth/logout
│   │       ├── stats/
│   │       │   ├── route.ts                 # GET /api/admin/stats
│   │       │   └── chart/route.ts           # GET /api/admin/stats/chart
│   │       ├── orders/
│   │       │   ├── route.ts                 # GET /api/admin/orders
│   │       │   └── [order-id]/
│   │       │       ├── route.ts             # GET /api/admin/orders/[order-id]
│   │       │       ├── refund/route.ts      # POST .../refund
│   │       │       └── regenerate/route.ts  # POST .../regenerate
│   │       └── users/
│   │           ├── route.ts                 # GET /api/admin/users
│   │           └── [user-id]/
│   │               └── route.ts             # GET /api/admin/users/[user-id]
│   └── actions/
│       ├── order.ts      # createOrder, getMyOrders, getGuestOrders
│       ├── report.ts     # getOrderReport
│       └── user.ts       # updateNickname
├── lib/
│   ├── supabase/
│   │   ├── client.ts     # 브라우저용 클라이언트
│   │   └── server.ts     # 서버용 클라이언트 (쿠키 기반)
│   ├── toss.ts           # 토스페이먼츠 API 헬퍼
│   ├── anthropic.ts      # Anthropic SDK 초기화 및 프롬프트 빌더
│   └── telegram.ts       # 텔레그램 봇 메시지 헬퍼
└── middleware.ts          # /admin/* 관리자 인증, /my-page 회원 인증, /guest-check 비회원 세션 인증
```

---

### 9-5. 핵심 보안 정책

| 영역             | 정책                                                                                                                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 보고서 접근      | `orders.user_id` 또는 `orders.guest_id`와 현재 세션을 서버에서 수동 매칭 — URL 추측으로 타인 보고서 열람 불가                                                               |
| 관리자 API       | 미들웨어에서 HttpOnly 쿠키의 관리자 세션을 검증 — 일반 유저 세션과 완전 분리                                                                                                |
| 토스 웹훅        | `Authorization: Basic {Base64(secret:secret)}` 헤더 검증                                                                                                                    |
| 내부 알림 API    | `X-Internal-Secret` 헤더로 외부 직접 호출 차단                                                                                                                              |
| AI 생성          | `reports.status = generating` 중복 레코드 체크로 동일 주문에 대한 중복 AI 호출 방지                                                                                         |
| 비회원 세션      | `bcrypt` 비밀번호 해싱, HttpOnly + Secure + SameSite=Strict 쿠키, **24시간 만료 정책** 적용. 만료 후 재인증 필수.                                                           |
| 주문 금액 검증   | `createOrder` 실행 시 클라이언트 전달 금액과 DB의 `contents.price`를 서버에서 대조 — 금액 위변조 차단. `/api/payments/confirm`에서도 `orders.amount`와 요청 `amount` 재대조 |
| 회원/비회원 분리 | `orders` 제약으로 `user_id`와 `guest_id` 중 **정확히 하나만** 값을 가지도록 강제. 둘 다 값을 가지거나 둘 다 NULL인 레코드 미생성.                                           |
| 환불 처리        | `/api/payments/cancel`은 관리자 미들웨어 검증 필수. `toss_order_id` + `toss_payment_key` 둘 다 사용하여 환불 요청. 기존 `refunded` 상태 주문 재환불 차단 (409 또는 알림).   |

---

### 9-6. 비회원 플로우 명확화

#### 신규 비회원 결제 흐름

1. 콘텐츠 상세 → `/start` → 정보 입력 완료
2. **결제 페이지 진입 시**: 전화번호 + 비밀번호 폼 표시
3. `createOrder` 호출: `phone` + `guest_password` + `amount` 전달
4. **서버에서**:
   - `guests` 테이블에 phone 존재 여부 확인
   - 신규면 `guests` 레코드 생성 (password_hash = bcrypt)
   - `orders` 레코드 생성 (`guest_id` 설정)
5. 결제 위젯 → 토스 결제 승인
6. 결제 완료 → `/report/[order-id]` 이동

#### 기존 비회원 재결제 흐름

1. 콘텐츠 상세 → `/start` → 정보 입력 완료
2. **결제 페이지 진입 시**: 전화번호 + 비밀번호 폼 표시
3. `createOrder` 호출: `phone` + `guest_password` + `amount` 전달
4. **서버에서**:
   - `guests` 테이블에 phone 조회
   - 기존 레코드 발견 → **비밀번호 검증** (bcrypt compare)
   - 검증 성공 → `orders` 레코드 생성 (`guest_id` 설정)
   - 검증 실패 → 400 또는 401 반환, `orders` 미생성
5. 결제 위젯 → 토스 결제 승인
6. 결제 완료 → `/report/[order-id]` 이동

#### 비회원 보고서 조회 흐름

1. `/guest-login` → 전화번호 + 비밀번호 입력 → `/api/guest/login` 호출
2. **서버**: `guests` 레코드 조회 → bcrypt 검증 → HttpOnly 쿠키 발급 (24시간 만료)
3. `/guest-check` 진입 (Server Component)
4. `getGuestOrders` Server Action 호출 → 쿠키에서 `guest_id` 추출 → 주문 목록 조회
5. 주문 클릭 → `/report/[order-id]` 진입
6. `getOrderReport` Server Action 호출 → 쿠키에서 `guest_id` 추출 → `orders.guest_id` 매칭 → 보고서 표시

---

### 9-7. 환불 플로우 명확화

| 단계 | 액션                                  | 호출 경로                            | 처리 내용                                        |
| ---- | ------------------------------------- | ------------------------------------ | ------------------------------------------------ |
| 1    | 관리자 환불 버튼 클릭                 | `/admin/order-list/[order-id]`       | —                                                |
| 2    | `POST /api/admin/orders/[...]/refund` | API Route                            | 미들웨어: 관리자 세션 검증                       |
| 3    | orders 상태 확인                      | Server (refund route)                | `status = paid`인지 확인 (안 맞으면 409 반환)    |
| 4    | 토스 환불 API 호출                    | Server (refund route)                | `toss_order_id` + `toss_payment_key` 함께 전송   |
| 5    | orders 업데이트                       | Server (refund route)                | `status = refunded` + `refunded_at = now()` 저장 |
| 6    | 텔레그램 알림                         | `/api/notifications/telegram` (호출) | 관리자에게 환불 완료 알림                        |

---

### 9-8. 데이터 검증 체크리스트

| 검증 시점                        | 검증 항목                                  | 실패 처리                                    |
| -------------------------------- | ------------------------------------------ | -------------------------------------------- |
| `createOrder` 호출               | `amount = contents.price` 일치 확인        | 400 "금액 불일치" 반환, `orders` 미생성      |
|                                  | 신규 비회원 phone 중복 여부                | 409 "이미 가입된 번호" 반환 또는 기존 연동   |
|                                  | 기존 비회원 password 검증                  | 401 "비밀번호 불일치" 반환, `orders` 미생성  |
| `/api/payments/confirm`          | `orders.status = pending` 확인             | 400 "유효하지 않은 주문" 반환                |
|                                  | `orders.amount = request.amount` 재확인    | 400 "금액 불일치" 반환                       |
|                                  | 토스 승인 성공 여부                        | fail_code/fail_message 기록, status = failed |
| `/api/ai/generate`               | `orders.status = paid` 확인                | 400 "미지불 주문" 반환                       |
|                                  | `reports.status != generating` 확인 (선점) | 409 "이미 생성 중" 반환                      |
| `/api/admin/orders/[...]/refund` | `orders.status = paid` 확인                | 409 "이미 환불됨" 반환                       |

---

## 10. E2E 테스트 목록 (E2E Test Cases)

> - **완료 여부** 컬럼: `[ ]` 미완료 / `[x]` 완료
> - 각 섹션은 극단적·예외 케이스 중심으로 작성.

---

### 10.1 프론트엔드 E2E 테스트

| No  | 기능/페이지        | 대상                 | 테스트 케이스                                               | 예상 결과                                                                 | 완료 여부 | 특이사항                            |
| --- | ------------------ | -------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- | --------- | ----------------------------------- |
| 1   | 메인 랜딩페이지    | `/`                  | `is_active = false`인 콘텐츠가 전부일 때 카드 그리드 렌더링 | 카드 0개 + 빈 상태 UI 표시, 에러 없음                                     | [ ]       | contents 전체 비활성화 엣지케이스   |
| 2   | 메인 랜딩페이지    | `/`                  | 카테고리 탭 전환 시 URL 쿼리 파라미터와 카드 목록 동기화    | 탭 선택 시 해당 category 카드만 필터링, 브라우저 뒤로가기 시 이전 탭 복원 | [ ]       | 히스토리 상태 관리                  |
| 3   | 메인 랜딩페이지    | `/`                  | 네트워크 오류로 콘텐츠 목록 로드 실패                       | 에러 메시지 또는 재시도 UI 표시, 화면 크래시 없음                         | [ ]       | fetch 실패 시 fallback              |
| 4   | 콘텐츠 상세 페이지 | `/mbti/basic` 등     | 존재하지 않는 slug(`/mbti/ghost`)로 직접 접근               | Next.js 404 페이지 반환                                                   | [ ]       | Dynamic route notFound() 처리       |
| 5   | 콘텐츠 상세 페이지 | `/mbti/basic` 등     | 필수 입력 필드를 비운 채 결제하기 버튼 클릭                 | 유효성 검사 에러 메시지 표시, 결제 페이지 이동 불가                       | [ ]       | input_schema 기반 클라이언트 검증   |
| 6   | 콘텐츠 상세 페이지 | `/mbti/basic` 등     | `is_active = false` 콘텐츠 URL 직접 접근                    | 404 또는 서비스 종료 안내 페이지 반환                                     | [ ]       | 비공개 콘텐츠 보호                  |
| 7   | 결제 페이지        | `/payments`          | 비회원 전화번호 입력 없이 결제 위젯 진행 시도               | 전화번호 필수 입력 에러 표시, 위젯 진행 차단                              | [ ]       | createOrder 호출 전 클라이언트 검증 |
| 8   | 결제 페이지        | `/payments`          | 결제 진행 중 브라우저 새로고침 후 재접근                    | 입력 정보 유지 또는 초기화 안내, 중복 주문 미생성                         | [ ]       | pending 주문 중복 방지              |
| 9   | 보고서 확인 페이지 | `/report/[order-id]` | 타인의 order-id를 URL에 직접 입력하여 접근                  | 403 또는 접근 불가 안내 페이지 반환                                       | [ ]       | 서버 소유권 수동 매칭 검증          |
| 10  | 보고서 확인 페이지 | `/report/[order-id]` | `reports.status = 'error'` 상태에서 페이지 진입             | 생성 실패 안내 메시지 표시, 폴링 미실행                                   | [ ]       | 에러 상태 UI 분기                   |
| 11  | 보고서 확인 페이지 | `/report/[order-id]` | 폴링 시작 후 10분 경과해도 `status = 'done'` 미전환         | 타임아웃 안내 메시지 표시, 폴링 중단                                      | [ ]       | 3초 간격 × 200회 후 타임아웃        |
| 12  | 마이페이지         | `/my-page`           | 비로그인 상태에서 `/my-page` 직접 접근                      | `/auth`로 리다이렉트                                                      | [ ]       | 미들웨어 회원 세션 검증             |
| 13  | 마이페이지         | `/my-page`           | 닉네임 수정 폼에 빈 문자열 또는 공백만 입력 후 저장         | 유효성 검사 에러 표시, DB 업데이트 미실행                                 | [ ]       | 공백 trim 후 빈값 처리              |
| 14  | 마이페이지         | `/my-page`           | 구매 내역이 0건인 회원 접근                                 | 빈 주문 목록 + 안내 문구 표시, 에러 없음                                  | [ ]       | 빈 상태 UI                          |
| 15  | 비회원 로그인      | `/guest-login`       | 가입된 적 없는 전화번호로 로그인 시도                       | "존재하지 않는 계정" 에러 메시지 반환, guest 레코드 미생성                | [ ]       | createOrder 외 생성 경로 차단 검증  |
| 16  | 비회원 로그인      | `/guest-login`       | 올바른 전화번호 + 틀린 비밀번호 반복 입력                   | 인증 실패 에러 표시, 세션 미발급                                          | [ ]       | bcrypt 검증 실패 처리               |
| 17  | 비회원 주문 조회   | `/guest-check`       | 비회원 세션 쿠키 없이 `/guest-check` 직접 접근              | `/guest-login`으로 리다이렉트                                             | [ ]       | 미들웨어 비회원 세션 쿠키 검증      |
| 18  | 비회원 주문 조회   | `/guest-check`       | 주문 이력이 0건인 비회원 로그인 후 접근                     | 빈 주문 목록 + 안내 문구 표시, 에러 없음                                  | [ ]       | 빈 상태 UI                          |

---

### 10.2 백엔드 E2E 테스트

| No  | 기능/Endpoint    | 대상                         | 테스트 케이스                                          | 예상 결과                                                            | 완료 여부 | 특이사항                           |
| --- | ---------------- | ---------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- | --------- | ---------------------------------- |
| 20  | OAuth 콜백       | `GET /api/auth/callback`     | 유효하지 않은 OAuth `code` 파라미터로 콜백 요청        | Supabase 세션 교환 실패, 에러 페이지 또는 `/auth`로 리다이렉트       | [ ]       | PKCE 검증 실패 케이스              |
| 21  | OAuth 콜백       | `GET /api/auth/callback`     | `code` 파라미터 누락 상태로 콜백 URL 직접 접근         | 400 에러 또는 `/auth` 리다이렉트, 세션 미생성                        | [ ]       | 파라미터 누락 방어 처리            |
| 22  | 결제 승인        | `POST /api/payments/confirm` | 이미 `status = 'paid'`인 orderId로 confirm 재요청      | 중복 승인 차단, 멱등성 보장 응답 반환 (200 or 409)                   | [ ]       | idempotency key 처리               |
| 23  | 결제 승인        | `POST /api/payments/confirm` | 요청 `amount`가 DB `orders.amount`와 불일치            | 토스 승인 API 미호출, 400 에러 반환                                  | [ ]       | 금액 위변조 이중 검증              |
| 24  | 결제 실패 기록   | `POST /api/payments/fail`    | 존재하지 않는 `orderId`로 fail 요청                    | 404 에러 반환, DB 변경 없음                                          | [ ]       | orderId 유효성 검증                |
| 25  | 결제 실패 기록   | `POST /api/payments/fail`    | `status = 'paid'`인 주문에 fail 요청                   | 상태 변경 차단, 409 에러 반환                                        | [ ]       | 결제 완료 주문 상태 보호           |
| 26  | 토스 웹훅        | `POST /api/payments/webhook` | 잘못된 `Authorization` 헤더로 웹훅 요청                | 401 반환, DB 변경 없음                                               | [ ]       | Basic 인증 시크릿 검증             |
| 27  | 토스 웹훅        | `POST /api/payments/webhook` | 동일 `DONE` 이벤트 중복 전송                           | 최초 1회만 처리, 이후 요청은 멱등 응답 반환                          | [ ]       | idempotency key 중복 방지          |
| 28  | AI 해석 생성     | `POST /api/ai/generate`      | `reports.status = 'generating'`인 주문에 재요청        | 중복 실행 차단, 409 또는 200(현재 상태) 반환                         | [ ]       | generating 레코드 선점 로직        |
| 29  | AI 해석 생성     | `POST /api/ai/generate`      | Anthropic API 타임아웃 발생 시 처리                    | `reports.status = 'error'`, `error_message` 기록, 텔레그램 알림 발송 | [ ]       | try/catch 후 에러 상태 전환        |
| 30  | 비회원 로그인    | `POST /api/guest/login`      | DB에 없는 전화번호로 로그인 시도                       | 404 에러 반환, `guests` 레코드 미생성                                | [ ]       | createOrder 외 생성 경로 완전 차단 |
| 31  | 비회원 로그인    | `POST /api/guest/login`      | 올바른 전화번호 + 틀린 비밀번호                        | 401 반환, 세션 쿠키 미발급                                           | [ ]       | bcrypt compare 실패 처리           |
| 32  | 관리자 권한 우회 | `GET /api/admin/*`           | 관리자 세션 쿠키 없이 `/api/admin/orders` 요청         | 401 반환, 데이터 미노출                                              | [ ]       | 미들웨어 선행 검증                 |
| 33  | 관리자 권한 우회 | `GET /api/admin/*`           | 일반 회원 Supabase 세션 쿠키로 `/api/admin/stats` 요청 | 403 반환, 관리자 세션과 회원 세션 혼용 차단                          | [ ]       | 세션 타입 분리 검증                |
| 34  | createOrder      | Server Action                | `amount`를 `contents.price`보다 낮게 조작하여 전송     | 금액 불일치 에러 반환, `orders` 레코드 미생성                        | [ ]       | 서버 측 price 대조 검증            |
| 35  | createOrder      | Server Action                | 기존 비회원 전화번호로 재주문 시 틀린 비밀번호 전달    | 비밀번호 불일치 에러, `orders` 레코드 미생성                         | [ ]       | 기존 guest 연동 시 비밀번호 검증   |

---

### 10.3 관리자 프론트엔드 E2E 테스트

| No  | 기능/페이지      | 대상                           | 테스트 케이스                                            | 예상 결과                                            | 완료 여부 | 특이사항                       |
| --- | ---------------- | ------------------------------ | -------------------------------------------------------- | ---------------------------------------------------- | --------- | ------------------------------ |
| 36  | 관리자 로그인    | `/admin/login`                 | 비로그인 상태에서 `/admin` 직접 접근                     | `/admin/login`으로 리다이렉트                        | [ ]       | 미들웨어 관리자 세션 검증      |
| 37  | 관리자 로그인    | `/admin/login`                 | 잘못된 비밀번호 반복 입력                                | 인증 실패 에러 메시지 표시, 세션 미발급              | [ ]       | 브루트포스 제한 여부 추후 검토 |
| 38  | 매출 대시보드    | `/admin`                       | 주문 데이터가 전혀 없는 기간으로 조회                    | 지표 0값 + 빈 차트 표시, 에러 없음                   | [ ]       | 빈 집계 결과 UI 처리           |
| 39  | 매출 대시보드    | `/admin`                       | 기간 필터 `from > to` (역순) 입력 후 조회                | 에러 메시지 표시 또는 빈 결과 반환, 화면 크래시 없음 | [ ]       | 날짜 범위 유효성 검사          |
| 40  | 주문 내역 리스트 | `/admin/order-list`            | 검색어에 SQL Injection 패턴(`' OR 1=1 --`) 입력          | 파라미터화 쿼리로 안전 처리, 정상 빈 결과 반환       | [ ]       | Supabase 쿼리 빌더 이스케이프  |
| 41  | 주문 내역 리스트 | `/admin/order-list`            | 페이지네이션 마지막 페이지 이후 page 값 요청             | 빈 배열 + 200 반환, UI 에러 없음                     | [ ]       | 페이지 초과 엣지케이스         |
| 42  | 상세 주문 내역   | `/admin/order-list/[order-id]` | 존재하지 않는 `order-id`로 직접 접근                     | 404 페이지 반환                                      | [ ]       | notFound() 처리                |
| 43  | 상세 주문 내역   | `/admin/order-list/[order-id]` | `status = 'refunded'`인 주문 상세 진입 후 환불 버튼 클릭 | 환불 버튼 비활성화 또는 중복 환불 차단 에러 표시     | [ ]       | 이미 환불된 주문 보호          |
| 44  | 유저 리스트      | `/admin/user-list`             | 주문 이력이 없는 신규 회원/비회원 목록 조회              | 누적 주문 건수 0 표시, 에러 없음                     | [ ]       | LEFT JOIN 집계 0건 처리        |
| 45  | 유저 리스트      | `/admin/user-list`             | 검색 필터(닉네임)와 회원/비회원 타입 필터 동시 적용      | 두 조건 AND 필터링된 정확한 결과 반환                | [ ]       | 복합 필터 쿼리 검증            |

---

### 10.4 관리자 백엔드 E2E 테스트

| No  | 기능/Endpoint        | 대상                                           | 테스트 케이스                                     | 예상 결과                                                            | 완료 여부 | 특이사항                    |
| --- | -------------------- | ---------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------- | --------- | --------------------------- |
| 46  | 관리자 인증 미들웨어 | `src/middleware.ts`                            | 만료된 관리자 세션 쿠키로 `/api/admin/*` 요청     | 401 반환, 쿠키 파기 처리                                             | [ ]       | 세션 만료 시간 검증         |
| 47  | 관리자 인증 미들웨어 | `src/middleware.ts`                            | 관리자 세션 쿠키 서명 값 임의 변조 후 요청        | 위변조 감지, 401 반환                                                | [ ]       | HttpOnly 쿠키 서명 검증     |
| 48  | getAdminMetrics      | `GET /api/admin/stats`                         | `from > to` 역순 날짜 파라미터로 요청             | 400 에러 반환 또는 빈 결과 + 200 반환                                | [ ]       | 서버 측 날짜 유효성 검사    |
| 49  | getAdminMetrics      | `GET /api/admin/stats`                         | 데이터가 전혀 없는 신규 서비스 상태에서 지표 조회 | 모든 지표 0, 증감률 null 또는 0% 반환, 에러 없음                     | [ ]       | 집계 쿼리 NULL 처리         |
| 50  | getAdminOrders       | `GET /api/admin/orders`                        | 결과 없는 검색어로 조회                           | 빈 배열 + 200 반환                                                   | [ ]       | 빈 결과 정상 응답           |
| 51  | getAdminOrders       | `GET /api/admin/orders`                        | `page` 값이 총 페이지 수 초과 시 요청             | 빈 배열 + 200 반환, 400 에러 미발생                                  | [ ]       | offset 초과 방어 처리       |
| 52  | getAdminOrderDetail  | `GET /api/admin/orders/[order-id]`             | 존재하지 않는 `order-id`로 요청                   | 404 반환                                                             | [ ]       | notFound 처리               |
| 53  | getAdminOrderDetail  | `GET /api/admin/orders/[order-id]`             | `reports` 레코드가 아직 없는 주문 상세 조회       | `report: null` 포함하여 200 반환, 에러 없음                          | [ ]       | LEFT JOIN null 필드 처리    |
| 54  | regenerate API       | `POST /api/admin/orders/[order-id]/regenerate` | `reports.status = 'generating'` 중 재생성 요청    | 중복 실행 차단, 409 반환                                             | [ ]       | generating 선점 레코드 체크 |
| 55  | regenerate API       | `POST /api/admin/orders/[order-id]/regenerate` | Anthropic API 키 만료 상태에서 재생성 요청        | `reports.status = 'error'`, `error_message` 기록, 텔레그램 알림 발송 | [ ]       | API 키 인증 실패 핸들링     |
| 56  | getAdminUsers        | `GET /api/admin/users`                         | 주문 이력 없는 비회원 포함 전체 유저 조회         | 누적 주문 건수 0 포함 정상 반환                                      | [ ]       | LEFT JOIN 집계 0건          |
| 57  | getAdminUsers        | `GET /api/admin/users`                         | 동일 닉네임을 가진 복수 유저 닉네임 검색          | 동명이인 모두 반환, 단일 결과로 누락 없음                            | [ ]       | LIKE 검색 중복 처리         |

---

## 11. 보안 체크리스트 (Security Checklist)

> - **E2E 테스트 완료 여부**: `[ ]` 미완료 / `[x]` 완료
> - **E2E No.** 는 섹션 10의 테스트 케이스 번호를 참조.

| 분류                  | 점검 항목                    | 세부 검토 내용                                                                                                                                                                                | E2E 완료 여부 | 특이사항                                                                                                |
| --------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| **인증 및 인가**      | 관리자 권한 우회 방어        | `/api/admin/*` 전 엔드포인트에 미들웨어 관리자 세션 검증 적용 여부 확인. 관리자 세션 없는 요청 및 일반 회원 세션으로의 우회 시도 시 401/403 반환 확인                                         | [ ]           | E2E No.32–33, 36, 46–47                                                                                 |
| **인증 및 인가**      | IDOR 방어 (보고서 무단 열람) | `/report/[order-id]` 접근 시 서버에서 `orders.user_id` 또는 `orders.guest_id`와 현재 세션을 수동 매칭. URL에 타인의 order-id 입력 시 접근 차단 확인                                           | [ ]           | E2E No.9. RLS 비활성화 환경이므로 서버 코드 레벨 소유권 검증이 유일한 방어선                            |
| **인증 및 인가**      | 세션 탈취 및 위변조 방지     | 관리자·비회원 세션 쿠키 `HttpOnly + Secure + SameSite=Strict` 설정 확인. 쿠키 서명 값 임의 변조 요청 시 검증 실패 및 401 반환 확인                                                            | [ ]           | E2E No.47. 비회원 세션도 동일 쿠키 정책 적용                                                            |
| **입력값 검증**       | XSS 공격 방어                | AI 생성 보고서(`reports.content`) 렌더링 시 `dangerouslySetInnerHTML` 미사용 확인. 관리자 페이지 유저 입력 데이터 표시 시 React 자동 이스케이프 의존 여부 점검                                | [ ]           | 보고서 콘텐츠는 순수 텍스트로만 저장. Markdown 렌더링 도입 시 sanitize 라이브러리 추가 필요             |
| **입력값 검증**       | DoS 방어 (AI 중복 호출 차단) | `reports.status = 'generating'` 레코드 선점으로 동일 주문에 대한 중복 AI 호출 차단 확인. 결제 미완료 주문으로 `/api/ai/generate` 직접 호출 시 차단 확인                                       | [ ]           | E2E No.28. `paid` 상태 검증 + `generating` 선점이 DoS의 1차·2차 방어선                                  |
| **입력값 검증**       | SQL Injection 방어           | 관리자 검색 입력값(`?q=`), 필터 파라미터 전체를 Supabase 쿼리 빌더 파라미터화 쿼리로 처리하는지 확인. Raw SQL 직접 조합 코드 미존재 확인                                                      | [ ]           | E2E No.40. Supabase JS 클라이언트는 기본적으로 파라미터화 처리하나, `rpc()` 직접 호출 시 별도 점검 필요 |
| **결제 및 비즈니스**  | 결제 금액 위변조 방어        | `createOrder` 실행 시 클라이언트 전달 `amount`와 DB `contents.price` 서버 대조 후 일치 시에만 `orders` 레코드 생성. `/api/payments/confirm`에서도 `orders.amount`와 요청 `amount` 재대조 확인 | [ ]           | E2E No.23, 34. 클라이언트→createOrder→confirm 3단계 모두 금액 검증                                      |
| **결제 및 비즈니스**  | 중복 결제 방어               | `orders.toss_order_id` UNIQUE 제약으로 동일 주문 중복 생성 차단. `status = 'paid'` 주문에 대한 confirm 재요청 시 멱등 처리 확인                                                               | [ ]           | E2E No.22. DB 레벨 UNIQUE + 애플리케이션 레벨 상태 검증 이중 방어                                       |
| **결제 및 비즈니스**  | 웹훅 위조 방지               | `POST /api/payments/webhook` 수신 시 `Authorization: Basic {Base64(secret:secret)}` 헤더 검증. 시크릿 불일치 요청 즉시 401 반환 및 DB 변경 없음 확인                                          | [ ]           | E2E No.26–27. 웹훅 시크릿은 환경 변수로 관리, 소스코드 하드코딩 금지                                    |
| **인프라 및 통신**    | 외부 API 타임아웃 처리       | Anthropic SDK 호출 및 토스페이먼츠 API 호출에 명시적 타임아웃 설정 확인. 타임아웃 발생 시 `reports.status = 'error'` 전환 및 텔레그램 알림 발송 확인                                          | [ ]           | E2E No.29, 55. 타임아웃 미설정 시 Vercel Function 최대 실행 시간(300s) 소진 위험                        |
| **인프라 및 통신**    | Supabase RLS 정책 검증       | `guests`, `admins`, `orders`, `reports` 테이블 RLS 비활성화 후 `service_role` 키로만 접근하는지 확인. `anon` 키로의 직접 접근 차단 여부 점검                                                  | [ ]           | `profiles`, `contents`는 RLS 활성화. 환경 변수에서 `SUPABASE_SERVICE_ROLE_KEY` 외부 노출 여부 점검 필수 |
| **데이터 프라이버시** | 민감 정보 서버 로그 미출력   | `guests.password_hash`, `admins.password_hash`, 전화번호, 토스 `paymentKey` 등이 서버 로그(`console.log`)에 출력되지 않는지 확인. 에러 스택 트레이스에 민감 정보 포함 여부 점검               | [ ]           | 프로덕션 환경 로그 레벨 설정 및 Vercel 로그 보존 기간 확인 필요                                         |
| **데이터 프라이버시** | 비회원 데이터 보호           | `guests.phone`, `guests.password_hash`는 `service_role` 접근만 허용 확인. 비회원 주문 조회 API(`/api/guest/orders`)에서 세션 검증 없이 타인 주문 열람 불가 여부 확인                          | [ ]           | E2E No.17. 비회원 세션 쿠키 만료 후 재인증 없이 조회 불가 확인                                          |

---

## 12. 성능 및 시스템 최적화 체크리스트 (Performance Checklist)

> - **E2E 테스트 완료 여부**: `[ ]` 미완료 / `[x]` 완료
> - **E2E No.** 는 섹션 10의 테스트 케이스 번호를 참조. 성능 항목 특성상 E2E 외 Lighthouse·Bundle Analyzer 별도 측정 병행.

| 분류                   | 점검 항목                 | 세부 검증 내용                                                                                                                                                                                                                                                                               | E2E 완료 여부 | 특이사항                                                                                                    |
| ---------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------- |
| **렌더링 및 통신**     | 서버 컴포넌트 최적화      | 콘텐츠 목록, 보고서 초기 로드 등 데이터 패칭을 Server Component에서 처리하는지 확인. `"use client"` 선언은 폴링·이벤트 핸들러 등 클라이언트 상태가 필수인 컴포넌트 최상단에만 적용. 클라이언트 번들에 서버 전용 코드(`@anthropic-ai/sdk`, Supabase `service_role` 클라이언트) 포함 여부 점검 | [ ]           | CLAUDE.md 규칙 준수 항목. `next build` 후 `_buildManifest` 분석으로 클라이언트 번들 포함 여부 확인          |
| **렌더링 및 통신**     | 캐싱 전략                 | `contents` 목록은 변경 빈도가 낮으므로 `fetch` 캐싱(`revalidate`) 또는 Next.js Full Route Cache 적용 여부 확인. `orders`, `reports` 등 사용자별 동적 데이터는 캐싱 제외(`no-store`) 설정 확인                                                                                                | [ ]           | 콘텐츠 가격·배지 변경 시 캐시 무효화(`revalidatePath`) 처리 필요                                            |
| **렌더링 및 통신**     | DB 쿼리 최적화            | 관리자 매출 집계 쿼리에 `idx_orders_created_at`, `idx_orders_status` 인덱스 활용 여부 확인. 주문+보고서 조인 시 N+1 쿼리 미발생 확인. Supabase `explain analyze`로 슬로우 쿼리 점검                                                                                                          | [ ]           | `getAdminMetrics` 집계 쿼리는 기간 필터 시 인덱스 스캔 확인 필수                                            |
| **에셋 및 리소스**     | 이미지 최적화             | 모든 이미지를 Next.js `<Image />` 컴포넌트로 렌더링하고 `alt` 필수 작성 확인. 메인 랜딩 히어로 이미지·콘텐츠 카드 썸네일에 `priority` 속성 적용 여부 확인(LCP 개선). `sizes` 속성으로 반응형 이미지 최적화                                                                                   | [ ]           | CLAUDE.md SEO 규칙 준수 항목. Supabase Storage URL 사용 시 `next.config.ts`의 `images.domains` 등록 필요    |
| **에셋 및 리소스**     | 외부 스크립트 지연 로딩   | GA4 `gtag.js`는 Next.js `<Script strategy="afterInteractive" />` 로 로드하여 메인 스레드 차단 방지 확인. 토스페이먼츠 위젯 스크립트는 결제 페이지 진입 시점에만 로드(조건부 마운트)                                                                                                          | [ ]           | 토스 위젯 중복 마운트 방지 로직과 충돌하지 않도록 로드 순서 검증 필요                                       |
| **에셋 및 리소스**     | 폰트 최적화               | `Noto Serif KR`, `Cinzel`을 `next/font/google`으로 로드하여 자동 self-hosting 및 `font-display: swap` 적용 확인. 한국어 폰트는 필요한 Unicode Range만 subset 로드하여 초기 전송량 절감                                                                                                       | [ ]           | `next/font` 미사용 시 외부 Google Fonts CDN 의존으로 FOUT 발생 위험. 전체 CJK 범위 대신 KR subset 지정 권장 |
| **런타임 및 상태**     | 리렌더링 최소화           | 보고서 페이지 3초 폴링 로직에서 `status` 값 변경 시에만 상태 업데이트 실행 확인(동일 값 재설정 방지). 결제 페이지 토스 위젯 초기화 코드가 부모 컴포넌트 리렌더링에 영향받지 않도록 `useRef`·`useEffect` 의존성 배열 점검                                                                     | [ ]           | E2E No.11. 폴링 200회(10분) 동안 메모리 누수 발생 여부 DevTools Memory 탭으로 확인                          |
| **런타임 및 상태**     | 레이아웃 시프트(CLS) 방지 | 콘텐츠 카드 썸네일 이미지에 `width`·`height` 또는 `aspect-ratio` 명시 확인. 폰트 로드 전 fallback 폰트와 크기 일치(`size-adjust`) 확인. 토스 위젯 컨테이너에 최소 높이(`min-height`) 예약하여 위젯 로드 전후 레이아웃 이동 방지                                                              | [ ]           | Lighthouse CLS 점수 0.1 이하 목표. 모바일 하단 Sticky 결제 버튼도 CLS 유발 요소 점검                        |
| **번들 사이즈 및 SEO** | 불필요한 의존성 최소화    | `@anthropic-ai/sdk`, `bcrypt` 등 서버 전용 패키지가 클라이언트 번들에 포함되지 않는지 `@next/bundle-analyzer`로 확인. 관리자 차트 라이브러리는 `dynamic(() => import(...), { ssr: false })`로 지연 로드하여 초기 번들 크기 절감                                                              | [ ]           | `"server-only"` 패키지를 서버 전용 모듈 상단에 import하여 클라이언트 번들 혼입 빌드 타임 차단               |
| **번들 사이즈 및 SEO** | 동적 메타데이터 구성      | 각 `page.tsx`에 `metadata` 객체 또는 `generateMetadata` 함수로 title·description·OG 태그 동적 생성 확인. 보고서 페이지는 `noindex` 메타태그 설정하여 개인 보고서 검색 노출 차단. 콘텐츠 상세 페이지 OG 이미지에 썸네일 URL 반영                                                              | [ ]           | CLAUDE.md SEO 규칙 준수 항목. `generateMetadata`는 서버에서 실행되므로 DB 조회 가능                         |

---

## 13. 서비스 컴플라이언스 및 소비자 보호 (Compliance Checklist)

> 대한민국 **전자상거래 등에서의 소비자보호에 관한 법률(전자상거래법)**, **약관의 규제에 관한 법률(약관규제법)**, **개인정보 보호법** 기준.
>
> - **E2E 테스트 완료 여부**: `[ ]` 미완료 / `[x]` 완료 (UI 표기 노출 여부 시각 확인 포함)

| 분야                                | 점검 항목                            | 법적 근거 및 확인 목적                                                                                                                                                                                                                                         | E2E 완료 여부 | 특이사항                                                                                                                           |
| ----------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **결제 및 환불 체계**               | 디지털 콘텐츠 청약철회 제한 고지     | **전자상거래법 제17조 제2항 제5호**: AI 보고서 열람 개시 시 청약철회가 제한됨을 결제 전(콘텐츠 상세 페이지 및 결제 페이지)에 소비자가 인지할 수 있도록 명시적으로 고지. 동의 체크박스 또는 안내 문구 UI 적용 여부 확인                                         | [ ]           | "AI 해석 보고서는 열람 즉시 청약철회가 제한되는 디지털 콘텐츠입니다" 문구 표기 필수. 미고지 시 14일 이내 무조건 환불 의무 발생     |
| **결제 및 환불 체계**               | AI 생성 장애 시 환불 정책 명시       | **전자상거래법 제18조(청약철회 등의 효과)** 및 **약관규제법 제9조(손해배상액 예정)**: `reports.status = 'error'`로 최종 전환된 경우(AI 생성 실패)의 환불 처리 절차 및 기간을 이용약관(`/terms`)에 명시. 관리자 환불 처리 버튼과 자동 환불 여부도 정책으로 확정 | [ ]           | 현재 환불은 관리자 수동 처리(`/api/admin/orders/[order-id]/refund`). 자동 환불 여부는 추후 정책 결정 필요                          |
| **AI 정보 제공 및 책임 한계**       | 비의학적 목적 면책조항 명시          | **약관규제법 제7조(면책조항의 금지)** 예외 조항 활용: 사주·MBTI·타로·점성술 해석은 오락 및 자기 이해 보조 목적임을 콘텐츠 상세 페이지 하단 주의사항 섹션에 명시. "의학적·심리학적·법적 진단을 대체하지 않습니다" 문구 노출 여부 확인                           | [ ]           | PRD 6-3에 이미 명시된 주의사항 문구를 실제 UI에 반영하여 확인. 과도한 면책은 약관규제법상 무효 가능하므로 표현 수위 법무 검토 권장 |
| **AI 정보 제공 및 책임 한계**       | AI 생성 오류 및 한계 고지            | **전자상거래법 제13조 제2항(거래 정보 제공 의무)**: AI 해석 결과가 데이터 기반 확률적 생성물이며 사실적 정확성을 보장하지 않음을 서비스 소개 섹션 또는 보고서 상단에 고지. "AI가 생성한 참고 자료입니다" 문구 노출 여부 확인                                   | [ ]           | AI 환각(Hallucination) 오류로 인한 분쟁 발생 시 사전 고지 여부가 면책 핵심 근거가 됨                                               |
| **권리 관계 및 생성물 라이선스**    | AI 산출물 저작권 범위 안내           | **저작권법 제2조(창작물 요건)**: AI가 단독 생성한 결과물은 현행법상 저작권 보호 대상 외. 이용약관(`/terms`)에 AI 보고서의 이용 범위(개인 열람·공유 허용, 무단 재판매 금지)를 명시. 소셜 공유 기능 제공 시 공유 허용 범위도 함께 안내                           | [ ]           | 유저가 입력한 개인 정보(생년월일 등)와 결합된 산출물이므로 개인정보보호법상 처리 동의와 함께 검토 필요                             |
| **개인정보 처리 및 AI 학습**        | 입력 데이터의 AI 학습 활용 여부 고지 | **개인정보보호법 제15조 제1항(수집·이용 동의)**: 유저가 입력한 생년월일·이름·MBTI 등의 데이터가 Anthropic Claude API에 전송됨을 개인정보처리방침(`/privacy`)에 명시. 해당 데이터가 Anthropic 모델 학습에 활용되지 않음(API 이용 약관 근거)을 함께 고지         | [ ]           | Anthropic API 이용 약관 상 입력 데이터는 모델 학습에 미사용. 처리방침에 "제3자 제공(Anthropic, 미국 소재)" 항목으로 명시 필요      |
| **개인정보 처리 및 AI 학습**        | 비회원 수집 정보 보존 기간 명시      | **개인정보보호법 제21조(파기)** 및 **전자상거래법 제6조(거래기록 보존)**: `guests` 테이블의 전화번호·비밀번호 해시·주문 정보 보존 기간을 개인정보처리방침에 명시(예: 거래 완료 후 5년, 전자상거래법 기준). 보존 기간 초과 시 파기 절차 운영 방침 확인          | [ ]           | 전자상거래법상 거래기록은 5년 보존 의무. `orders` 테이블 소프트 삭제 또는 파기 배치 정책 수립 필요                                 |
| **전자상거래 통신판매업 표기 의무** | Footer 사업자 필수 정보 표기         | **전자상거래법 제10조(통신판매업자의 표시)**: 모든 페이지 Footer에 상호명, 대표자 성명, 사업자등록번호, 사업장 소재지, 통신판매업 신고번호, 고객센터 연락처(이메일 또는 전화)를 표기. 누락 항목 없이 노출되는지 UI 확인                                        | [ ]           | 통신판매업 미신고 또는 미표기 시 전자상거래법 제42조에 따라 과태료 부과 대상. 사업자 등록 및 통신판매업 신고 선행 필수             |
|                                     |
