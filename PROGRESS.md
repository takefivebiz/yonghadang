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

| 라우트               | 상태  | 설명                              |
| -------------------- | ----- | --------------------------------- |
| `/`                  | ✅ 완료 | Corelog 메인 랜딩 (카테고리 선택) |
| `/analyze`           | ✅ 완료 | 분석 플로우 (6단계 질문)          |
| `/report/[session-id]` | ✅ 완료 | 무료+유료 리포트 통합 페이지    |
| `/guest/lookup`      | ✅ 완료 | 비회원 기록 조회                  |
| `/auth`              | ✅ 유지 | 소셜 로그인 (Google, Kakao)       |
| `/my-page`           | ✅ 유지 | 마이페이지 + 구매 내역            |
| `/payments`          | ✅ 업데이트 | Corelog 결제 플로우           |
| `/payments/success`  | ✅ 업데이트 | 결제 완료 콜백                |
| `/terms`, `/privacy`, `/contact` | ✅ 유지 |                      |
| `/admin/*`           | ✅ 업데이트 | 관리자 (Corelog 데이터 기반)  |

---

## 완료된 작업 (2026-04-26)

### 3단계: Corelog 랜딩 리디자인 (방향성 전환)

- **핵심 컨셉 변경**: 자기해석 → 사람 해석 (나/상대/관계)
- **메인 카피 확정**: "사람은, 읽힌다. 나도, 저 사람도, 우리 사이도."
- **랜딩 페이지 구조 재정의**:
  1. 메인 카피 (임팩트)
  2. 선택 UX ([나] [상대] [관계]) — 핵심
  3. 공감 섹션
  4. 신뢰 섹션 (샘플)
  5. CTA (리포트 확인하기)

- **분석 플로우 업데이트**:
  - Step 0: 분석 타입 선택 (랜딩에서) → Step 1: 카테고리 선택 → Step 2: 하위 분기 → Step 3~4: 질문
  - type 파라미터: `self|other|relationship`
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

## 다음 작업 예정

### 4단계: 프론트엔드 구현 (새로운 구조 기반)
- 메인 랜딩 페이지 UI 구현 ([나]/[상대]/[관계] 선택 UX)
- 분석 플로우 UI 업데이트 (분석 타입별 카테고리 질문)
- 리포트 UI 업데이트 (분석 타입별 톤 반영)

### 5단계: 백엔드 연동
- Supabase 스키마 설계 (분석 타입, 세션 데이터 포함)
- 분석 세션 저장 로직
- 더미 리포트 데이터 → 실제 API 호출로 교체
