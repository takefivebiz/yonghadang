# corelog 프로젝트 진행상황

## 프로젝트 정보

- **프로젝트명:** corelog (코어로그)
- **위치:** `~/Desktop/corelog` (`/Users/suyeon/Desktop/corelog`)
- **생성일:** 2026-04-20

## 기술 스택

| 항목         | 버전/설정                      |
| ------------ | ------------------------------ |
| Next.js      | 15 (App Router, Turbopack)     |
| React        | 19                             |
| TypeScript   | 5.7+                           |
| Tailwind CSS | v4 (`@tailwindcss/postcss`)    |
| shadcn/ui    | new-york 스타일, lucide 아이콘 |
| 경로 alias   | `@/*` → `./src/*`              |
| 언어 설정    | `lang="ko"`                    |
| 폰트         | Geist Sans / Geist Mono        |

---

## 완료된 작업 (2026-04-25)

### 1단계: 프로젝트 클린업 & Corelog 전환

- 이전 프로젝트(yonghadang) 코드 제거 및 코어로그 전환
  - 삭제: `/astrology`, `/mbti`, `/saju`, `/tarot`, `/start`, `/guest-check`, `/guest-login` 라우트
  - 삭제: `content.ts`, `content-detail.ts`, `dummy-contents.ts`, `dummy-content-details.ts`, `dummy-reports.ts`(구)
  - 삭제: `yonghadang-PRD.md`, `category-page-layout.tsx`, `content-section.tsx`, `content-card.tsx`

- Corelog 브랜딩 & 타입 시스템 구축
  - 신규: `src/types/analysis.ts` — 분석 카테고리, 질문, 답변, 세션 타입
  - 신규: `src/types/report.ts` — 무료/유료 리포트, 확장 질문 타입
  - 업데이트: `order.ts`, `payment.ts`, `admin.ts` — Corelog 기반으로 재정의

- Storage key 전환: `yonghadang:*` → `corelog:*`

### 2단계: 라우트 구조 정비

| 라우트                           | 상태        | 설명                              |
| -------------------------------- | ----------- | --------------------------------- |
| `/`                              | ✅ 완료     | Corelog 메인 랜딩 (카테고리 선택) |
| `/analyze`                       | ✅ 완료     | 분석 플로우 (6단계 질문)          |
| `/report/[session-id]`           | ✅ 완료     | 무료+유료 리포트 통합 페이지      |
| `/guest/lookup`                  | ✅ 완료     | 비회원 기록 조회                  |
| `/auth`                          | ✅ 유지     | 소셜 로그인 (Google, Kakao)       |
| `/my-page`                       | ✅ 유지     | 마이페이지 + 구매 내역            |
| `/payments`                      | ✅ 업데이트 | Corelog 결제 플로우               |
| `/payments/success`              | ✅ 업데이트 | 결제 완료 콜백                    |
| `/terms`, `/privacy`, `/contact` | ✅ 유지     |                                   |
| `/admin/*`                       | ✅ 업데이트 | 관리자 (Corelog 데이터 기반)      |

---

## 완료된 작업 (2026-04-26)

### 3단계: Corelog 랜딩 리디자인 (방향성 전환)

- **핵심 컨셉 변경**: 자기해석 → 사람 해석 (나/상대/관계)
- **메인 카피 확정**: "사람은, 읽힌다. 나도, 저 사람도, 우리 사이도."
- **랜딩 페이지 구조 재정의**:
  1. 메인 카피 (임팩트)
  2. 선택 UX ([나] [상대]) — 핵심
  3. 공감 섹션
  4. 신뢰 섹션 (샘플)
  5. CTA (리포트 확인하기)

- **분석 플로우 업데이트**:
  - Step 0: 분석 타입 선택 (랜딩에서) → Step 1: 카테고리 선택 → Step 2: 하위 분기 → Step 3~4: 질문
  - type 파라미터: `self|other`
  - 분석 타입별 톤 변경 (호칭, 관점 다름)

- **PRD.md 반영**:
  - 1.1 브랜드 정의 변경
  - 1.2 제품 포지셔닝 변경 (자기해석 → 사람 해석)
  - 3.1 설계 원칙 업데이트
  - 3.2 카테고리 분리 원칙 재정의
  - 3.9.2.5 분석 타입별 톤 추가
  - 6-1 메인 랜딩 페이지 전체 재구성
  - 6-2 분석 플로우 Step 0~4 재정의

---

## 완료된 작업 (2026-04-26 계속)

### 4단계: 디자인 시스템 & 페이지 스타일 통일

- **색상 팔레트 확정** (신비로운 보라색-파란색 그라데이션)
  - Primary: Night Indigo (#1B003F) → Dusky Blue (#6495ED) → Mystical Purple (#A366FF)
  - Text: Lavender Haze (#F0E6FA), Mauve (#D4C5E2), Wisteria (#BEAEDB)
  - Gradient: `linear-gradient(to bottom, #1B003F 0%, #4B0082 25%, #191970 50%, #4B0082 75%, #6B2E8F 100%)`

- **레이아웃 전체 그라데이션 적용**
  - `src/app/(user)/layout.tsx`: 배경 그라데이션 추가 (전체 페이지 배경)
  - Header/Footer: Night Indigo → Dusky Blue 범위의 색상으로 통일

- **인증 페이지 디자인 업데이트**
  - `auth/_components/auth-client.tsx`: 헤더 제거, 투명 카드 배경, 그라데이션 텍스트 적용
  - 로딩 스피너, 에러 메시지, 약관 링크 색상 통일

- **마이페이지 디자인 업데이트**
  - `my-page/_components/my-page-client.tsx`: 요약 카드, 최근 리포트 카드 그라데이션 배경 적용
  - `profile-card.tsx`: 프로필 카드 배경, 아바타 그라데이션, 버튼 스타일 업데이트
  - `order-history-list.tsx`: 카드 배경, 상태 배지 색상 변경

- **결제 플로우 디자인 업데이트**
  - `payments/_components/payment-client.tsx`: 로딩 스피너, 결제 위젯 영역, 결제 버튼 그라데이션
  - `order-summary.tsx`: 주문 요약 카드 그라데이션 배경 적용
  - `guest-info-form.tsx`: 폼 입력 필드, 라벨, 에러 메시지 스타일 신비로운 색상으로 변경
  - `success/_components/payment-success-client.tsx`: 로딩, 제목, 버튼 그라데이션 업데이트
  - `fail/page.tsx`: 배경 장식, 아이콘, 모든 텍스트 및 버튼을 새로운 팔레트로 변경

- **리포트 페이지 디자인 업데이트**
  - `report/[order-id]/_components/report-view.tsx`: 카테고리 배지, 제목, 섹션, 버튼 색상 통일
  - 결핍 문장 카드, 유료 질문 선택, 구매 CTA 모두 그라데이션 테마 적용

---

## 완료된 작업 (2026-04-28)

### 5단계: E2E 테스트 시나리오 5 — 비회원 세션 관리 및 조회

**시나리오 개요**: 비회원이 무료 리포트 조회 → 유료 질문 구매 → 나중에 전화번호+비밀번호로 재접근하는 전체 플로우 구현

#### 데이터 모델 개선

- `src/types/order.ts`:
  - 추가: `paid?: boolean` (결제 상태)
  - 추가: `paidQuestionIds?: string[]` (구매 질문 목록)
  - 삭제: `expiresAt?: string` (유료 세션은 만료 없음)

#### 비회원 결제 플로우 (Anonymous → Guest)

- `payment-modal.tsx`:
  - 결제 전 `guestInfo` (phoneNumber, password) 수집
  - 결제 성공 시 `saveLocalOrder()`로 localStorage에 주문 저장
    ```typescript
    saveLocalOrder({
      ownerType: "guest",
      paid: true,
      paidQuestionIds: pendingOrder.paidQuestionIds,
      phoneNumber: guestInfo.phoneNumber(숫자만),
    });
    ```
  - 결제 완료 후 **바로 `/report/{sessionId}` 리다이렉트** (별도 페이지 거치지 않음)
  - `sessionStorage`에 `purchased_{sessionId}` 저장

#### 비회원 재접근 플로우

- **경로 A: 직접 URL 접근** (`/report/{sessionId}`)
  - `guest-auth-form.tsx`: 전화번호+비밀번호 검증
  - 검증 후 `grantGuestAccess()` 호출 (30분 유효한 sessionStorage 토큰)
  - localStorage의 `paidQuestionIds`를 sessionStorage로 동기화

- **경로 B: 비회원 조회 페이지** (`/guest/lookup`)
  - `guest-lookup-client.tsx`: 전화번호+비밀번호로 검색
  - **핵심 수정**: `grantGuestAccess()` 호출 (이것이 없으면 report 페이지에서 또 본인확인 폼이 나타남)
  - localStorage의 `paidQuestionIds`를 sessionStorage로 동기화
  - `/report/{sessionId}`로 자동 리다이렉트

#### 세션 만료 로직 완전 제거

- `report/[order-id]/page.tsx`: `ReportExpired` 컴포넌트 및 expiresAt 체크 삭제
- 유료 구매 세션은 시간 제한 없이 영구 접근 가능

#### 주요 버그 수정

| 버그                            | 해결책                                                                    |
| ------------------------------- | ------------------------------------------------------------------------- |
| 비회원 조회 후 본인확인 폼 중복 | `guest-lookup-client`에 `grantGuestAccess(matched.id)` 추가               |
| 구매 질문 미표시                | `guest-auth-form`과 `guest-lookup-client`에서 paidQuestionIds 동기화 추가 |
| 더미 데이터 검증 실패           | 모든 guest 타입 더미 주문에 `phoneNumber: '01012345678'` 추가             |
| 결제 후 비회원 정보 소실        | `saveLocalOrder()` 호출을 `requestPayment()` 전으로 변경                  |

#### 수정된 파일 목록

- `src/types/order.ts`: paid, paidQuestionIds 필드 추가
- `src/lib/dummy-orders.ts`: phoneNumber 추가, expiresAt 로직 제거
- `src/app/(user)/report/[order-id]/_components/payment-modal.tsx`: 비회원 정보 수집, 저장 순서 개선
- `src/app/(user)/report/[order-id]/_components/guest-auth-form.tsx`: paidQuestionIds 동기화 추가
- `src/app/(user)/guest/lookup/_components/guest-lookup-client.tsx`: grantGuestAccess 호출, paidQuestionIds 동기화 추가
- `src/app/(user)/report/[order-id]/page.tsx`: ReportExpired 제거, expiresAt 체크 제거
- `src/app/(user)/payments/success/_components/payment-success-client.tsx`: expiresAt 생성 로직 제거
- `docs/PRD.md`: 시나리오 5 구현 내용 업데이트

#### 테스트된 플로우

✓ 비회원 무료 리포트 조회  
✓ 유료 질문 결제 (전화번호+비밀번호)  
✓ 결제 완료 후 바로 리포트 접근  
✓ 비회원 조회 페이지에서 조회  
✓ 구매한 유료 질문 표시  
✓ 세션 만료 없이 영구 접근

#### 백엔드 필요사항

- [ ] `POST /api/guest/lookup`: 비회원 세션 검색 (phone + password 기반)
- [ ] `POST /api/guest/verify`: 전화번호+비밀번호 검증
- [ ] `POST /api/orders`: 주문 생성 시 paidQuestionIds 저장
- [ ] `GET /api/orders/{id}`: 주문 조회 시 paidQuestionIds 포함

---

## 다음 작업 예정

### 6단계: E2E 테스트 시나리오 6 — 관리자 플로우

- [ ] 관리자 대시보드 페이지 구현
- [ ] 대시보드 데이터 연동 (더미 → 실제 API)

### 7단계: 백엔드 연동

- Supabase 스키마 설계 (분석 타입, 세션 데이터 포함)
- 분석 세션 저장 로직
- 더미 리포트 데이터 → 실제 API 호출로 교체
- 소셜 로그인 실제 구현 (Kakao, Google OAuth)
