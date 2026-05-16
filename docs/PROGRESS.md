# VEIL — 개발 진행 상황 로그

> 마지막 업데이트: 2026-05-16  
> 현재 단계: **Loop Reading 기능 완성 — 루프 결제·생성·표시 전체 플로우 작동**

---

## 지금 어디까지 왔는가

프론트엔드 UX는 대부분 완성됐다. 사용자가 콘텐츠를 선택하고, 자유입력을 쓰고, 보정 질문에 답하고, AI 결과를 읽고, 유료 씬을 구매하고, 결과를 공유하는 전체 흐름이 작동한다. 단, 지금은 localStorage 기반이고 DB는 아직 없다.

최근 변화는 두 가지다. 첫째, analyze page가 real Claude API를 실제로 호출하도록 연결됐다. 둘째, QA mode를 추가해서 결제 없이 전체 씬을 볼 수 있게 됐다. 이 두 가지가 "콘텐츠 품질 QA 사이클"을 처음으로 열어준 변경이다.

---

## 현재 시스템 상태

### 프론트엔드 완성된 것

- 홈 랜딩 — 카테고리 탭, 콘텐츠 카드 (`DUMMY_CONTENTS`)
- 콘텐츠 인트로 페이지 (`/content/[id]`)
- Analyze 플로우 (`/analyze/[session_id]`) — 자유입력 → 반응 버블 → 보정 질문 → 완료 로딩
- Result 페이지 (`/result/[session_id]`) — free/paid 씬 분리, 잠금 CTA, FlowOverview, AdditionalReadings
- 결제 모달 (`PaymentModal`) — Toss Payments 연동 구조 (실제 결제 미완)
- 마이페이지, 관리자 페이지 — UI 완성, 더미 데이터
- 공유 페이지 (`/share/[share_id]`) — UI 완성

### 핵심 데이터 흐름 (localStorage 기반)

```
analyze page 완료
  ├─ veil_analysis_${session_id}       → AnalyzeAnswers (질문/답변 전체)
  ├─ veil_hidden_state_${session_id}   → HiddenState (ContentPack 점수)
  └─ veil_free_scenes_${session_id}    → ResultScene[] (Claude 생성, 무료 씬만)

result page 로드 (읽기 순서)
  1. veil_all_scenes_${session_id}     → 결제 완료 후 merge된 전체 씬
  2. veil_free_scenes_${session_id}    → analyze 직후 상태
  3. 캐시 없음 → API fallback → 실패 시 mock
  4. veil_unlocked_scenes_${session_id} → unlock된 scene_index 배열
  5. veil_hidden_state_${session_id}   → AdditionalReadings 우선순위 계산
```

localStorage를 아직 유지하는 이유: DB가 없는 지금, 페이지 이동 간 상태를 전달하는 가장 빠른 방법이다. 구조 자체는 백엔드 연동 후 API 응답으로 교체하기 쉽게 설계됐다. key 이름을 바꾸거나 shape을 변경하면 result page가 조용히 깨지므로 **지금 단계에서 key 이름과 shape은 동결이다.**

---

## Content Pack vs Mock 데이터

두 가지는 역할이 다르다.

**Content Pack** (`src/lib/content-packs/love-1.ts` 등)  
실제 VEIL 콘텐츠다. scoreMap, translationRules, scene_config가 여기 있고, 지금 Claude가 실제 결과를 만들 때 이게 쓰인다. dummy가 아니다.

**Mock / Fallback 데이터** (`src/lib/data/dummy-*.ts`)  
API 실패 시 UX 보호용이거나, 홈/목록 페이지의 임시 placeholder다. 순차적으로 API 연동으로 교체되거나, 안전망으로 영구 유지된다.

> `dummy-scene-configs.ts`는 이름이 오해를 부르지만, love-1의 scene_config가 실제로 여기 정의돼 있다. DB seed 전까지는 이게 실제로 쓰인다.

---

## Generate Pipeline 구조

### 현재 흐름

```
사용자 → analyze 완료
  → generateScenes() 호출
  → POST /api/analyze/[session_id]/generate
      body: {
        content_title, category,
        user_input: { text, answers[] },
        scene_config,         ← content pack에서 가져옴
        scene_indexes,        ← is_free인 것만
        state_summary[]       ← ContentPack hidden state → 산문 변환
      }
  → Claude claude-sonnet-4-6 호출
  → ResultScene[] 반환
  → veil_free_scenes_${session_id} 저장
  → /result/${session_id} 이동
```

### Hidden State → State Summary 변환

ContentPack(`love-1.ts`)은 각 선택지에 차원별 점수(`ScoreDelta`)를 정의한다. 사용자가 선택한 값들이 `accumulateHiddenState()`를 통해 `HiddenState`(점수 맵)가 되고, `translateStateToSummary()`가 threshold를 넘은 차원을 "사용자 내면 상태 문장"으로 변환해서 Claude 프롬프트에 주입된다.

예: `anxiety: 5` → "불안에 기반한 확인 행동을 반복하고 있어"

이게 Claude가 단순 답변 요약이 아닌 심리적 맥락 있는 결과를 만드는 핵심이다.

---

## QA Mode 구조

### 동작

- `?qa=1` URL 파라미터 또는 `NEXT_PUBLIC_QA_MODE=true` 환경변수
- result page에서 감지 → 모든 scene의 `scene_index`를 `unlockedScenes`에 포함
- 결제 없이 유료 씬 전체 노출
- `PaymentModal` 렌더 자체 제거
- localStorage에 unlock 상태를 기록하지 않음 (메모리에서만)

### QA를 payment보다 먼저 만든 이유

콘텐츠 품질을 검증하려면 유료 씬 전체를 보는 게 필수다. 결제 플로우가 완성되지 않은 지금 단계에서 QA가 없으면 Claude 생성 결과를 확인할 방법이 없다. 결제보다 QA가 먼저여야 "콘텐츠 수정 → 생성 확인 → 수정" 사이클이 빠르게 돌아간다.

### 주의

`NEXT_PUBLIC_QA_MODE=true`는 `.env.local`(gitignore)에만. `.env.production`에 절대 넣지 않는다. 운영에서 모든 유저가 유료 씬 무료 열람하게 된다.

---

## Fallback 정책

```
result page — 캐시 없을 때 분기:

NEXT_PUBLIC_USE_MOCK_RESULT=true (기본값)
  → generateMockResultScenes() 직접 사용
  → API 호출 없음. API key 없어도 됨.

NEXT_PUBLIC_USE_MOCK_RESULT=false (현재 .env.local 설정)
  → 실제 API 호출 시도
    → 성공: real data 사용, veil_free_scenes_ 캐시 저장
    → 실패: generateMockResultScenes() fallback (에러 화면 없음)
```

mock fallback을 유지하는 이유: API가 실패해도 result UX가 죽으면 안 된다. 사용자는 analyze까지 완료한 상태다. mock이라도 보여주는 게 에러 화면보다 낫다. 캐시가 있으면 이 분기에 아예 도달하지 않으므로 정상 경로에는 영향 없다.

---

## ResultScene JSON 구조 방향

### 현재 타입 (동결)

```typescript
interface ResultScene {
  id: string;               // "${session_id}-scene-${index}"
  scene_index: number;      // 1부터 시작
  scene_title: string;
  intro?: string;           // 씬 진입 전 감정 흐름 문장
  is_free: boolean;
  is_unlocked: boolean;
  messages: SceneMessage[] | null;         // null = 잠금 상태
  preview_messages: SceneMessage[] | null; // 잠금 씬 흐릿한 미리보기
}

type SceneMessage = { type: "ai" | "punch"; text: string }
```

### Shape 변경 금지 이유

`SceneContent`, `FlowOverview`, `mergeScenes`, `createPaidScenePlaceholders`, generate API 응답 매핑(`mapClaudeToResultScenes`)까지 이 shape을 참조한다. 변경하면 전부 같이 깨진다. 백엔드 연동 시에도 DB → API 응답 → 이 타입으로 매핑해서 내려줘야 한다.

---

## Entitlement Layer 방향 (scene_unlocks)

현재는 unlock 상태를 `veil_unlocked_scenes_${session_id}` localStorage key에 `number[]`로 저장한다. 이건 임시 구조다.

백엔드 연동 후 방향:

```
scene_unlocks 테이블
  session_id  → analysis_sessions.id
  scene_index → 어떤 씬이 열렸는지
  unlocked_at → 결제 시각
  order_id    → orders.id (결제 근거)
```

이 테이블이 "엔타이틀먼트 레이어"다. result page가 세션 로드 시 `GET /api/sessions/[id]/unlocks` 한 번만 호출해서 `number[]`를 받아오면, 나머지 UI 로직은 지금과 동일하게 작동한다. localStorage → API 교체 시 접점이 한 곳이다.

---

## Guest 구조 방향

### guest_users 테이블을 제거한 이유

`guest_users`처럼 전용 테이블을 만들면 회원/비회원 두 개의 identity 시스템을 병렬로 관리해야 한다. 조인이 늘고 RLS가 복잡해진다. 대신 `analysis_sessions`에 `guest_id uuid` 컬럼 하나로 충분하다.

### guest UUID 쿠키 방향

- 비회원 첫 접속 → 브라우저에 `veil_guest_id` UUID 쿠키 세팅 (서버 httpOnly)
- 모든 세션 생성 시 이 `guest_id`를 `analysis_sessions.guest_id`에 기록
- 비회원 "내 기록 조회" → `guest_id` 기반 세션 목록 조회
- 회원 가입/로그인 시 → `guest_id`에 묶인 세션들을 `user_id`로 이관 (선택적)

전화번호+비밀번호 기반 `guest_credentials` 테이블은 유료 결제한 비회원의 인증용으로만 남긴다. "나는 가입 안 하고 싶지만 내 결과는 다시 보고 싶다"는 케이스다.

---

## 왜 Service/Repository 패턴을 쓰지 않는가

Next.js App Router + Server Actions 구조에서 Service/Repository 레이어를 추가하면:
- `UserRepository.findById()` → `UserService.getProfile()` → Server Action 경로가 3단계
- 현재 규모에서 이 추상화는 코드량만 늘리고 실익이 없다

대신 이 규칙을 따른다:
- DB 접근 → Server Action 또는 API Route에서 직접 (`service_role` 클라이언트)
- 재사용이 필요한 DB 쿼리 → `src/lib/db/` 폴더에 함수 단위로 추출 (추후)
- 클라이언트에서 DB 직접 접근 금지 (`anon` key 사용 금지)

비즈니스 로직이 복잡해지는 시점에 레이어를 추가하면 된다. 지금은 아니다.

---

## Additive 방식으로 연결하는 이유

한 번에 크게 바꾸면:
- 어디서 깨졌는지 알기 어렵다
- localStorage 키가 하나라도 틀리면 result page 전체가 조용히 blank된다
- rollback 범위가 커진다

작은 단위로, 기존 경로를 최대한 건드리지 않으면서, 새 경로를 추가하는 방식으로 간다. "실패해도 예전 것으로 돌아가진다"는 확신이 있을 때만 기존 코드를 제거한다.

---

---

## Loop Reading 기능 구현 (2026-05-16)

결과 페이지에서 유료 씬을 모두 읽은 뒤 구매할 수 있는 "루프 리딩" 기능 전체를 구현했다. 3개 loopType(action / standard / evaluate)에 대해 AI 생성 → 결제 → localStorage 캐시 → 재방문 복원까지 작동한다.

### L1 — 타입 정의 + ContentPack 업데이트

- `src/lib/types/quiz.ts`
  - `LoopType = "action" | "standard" | "evaluate"` 추가
  - `LoopMessage`, `LoopAnswer` 인터페이스 추가
  - `AdditionalReading`에 `loopType: LoopType` 필드 추가 (필수)
- `src/lib/content-packs/love-1.ts`
  - `LOVE_1_ADDITIONAL_READINGS` 전면 교체 — 호기심 기반("이 사람 마음은 뭘까?") → 행동/기준/평가 기반 3개 항목

### L2 — Loop Reading API 생성

- `src/app/api/analyze/[session_id]/loop-reading/generate/route.ts` 신규 생성
  - `POST` — loopType, loopTitle, context(freeInput, stateSummary, sceneInsights) 받아서 Claude 호출
  - 응답: `LoopAnswer` (localStorage에 바로 저장 가능한 형태)
- `src/lib/prompts/generate-result.ts`에 루프 전용 프롬프트 빌더 추가
  - `buildLoopReadingSystemPrompt(loopType)` — 씬 프롬프트와 독립 (출력 스키마 충돌 방지)
  - `buildLoopReadingUserPrompt(params)` — freeInput + stateSummary + sceneInsights(carry_over) 주입
  - `parseLoopResult(raw)` — `{ loopType, messages[] }` JSON 파싱, punch 위치 보정 포함
  - loopType별 focus anchor, 반복 금지 규칙 시스템 구축

### L3 — Result Page 연결

- `src/components/modals/payment-modal.tsx`
  - `paymentType: "loop"` 추가, `loopType?: LoopType` prop 추가
  - 루프 가격 900원, successUrl에 `_loop_type` 파라미터 포함
- `src/components/result/additional-readings.tsx` 전면 재작성
  - 더미 콘텐츠 제거 → 실제 `LoopAnswer` 렌더링
  - punch: 씬 결과 `PunchBlock`과 동일 스타일 (핑크 이탤릭, 배경 없음)
  - ai 버블: 생성 중 로딩 상태, 에러 + 재시도 버튼, 아코디언 자동 펼침
- `src/app/(user)/result/[session_id]/page.tsx`
  - `loopAnswers`, `loopLoading`, `loopError`, `activeLoopType` 상태 추가
  - `handleLoopUnlock()` — localStorage 캐시 확인 → API 호출 → 저장 → 스크롤
  - `generatePaidScenes()`에서 carry_over(`key_insight` + `do_not_repeat`) 추출 → `veil_scene_insights_${session_id}` 저장
  - Phase 2 useEffect에 `_payment_type=loop` 분기 추가 (기존 scene unlock 로직 완전 유지)

### QA 스크립트 + 검증

- `scripts/qa-loop-readings.ts` 작성 및 실행
  - "확인욕구형" 시나리오 (clarityHunger 지배), mock sceneInsights 3개
  - 3개 loopType 각각 API 직접 호출
  - 검증: punch 첫번째, `\n` 규칙, do_not_repeat 준수, 메시지 수 ≥ 3
  - **결과: 3/3 PASS** (action, standard, evaluate 모두)

### localStorage 키 추가 (동결)

```
veil_scene_insights_${session_id}   → LoopReadingSceneInsight[] (carry_over)
veil_loop_${loopType}_${session_id} → LoopAnswer (루프 리딩 캐시)
veil_payment_pending_loop_${sessionId} → LoopType (결제 진행 중 마커)
```

### 브라우저 QA bypass URL

```
# 유료 씬 전체 unlock (sceneInsights 저장 목적)
/result/{session_id}?_payment_type=all&_scene_index=0&_unlock=true&paymentKey=fake&orderId=fake&amount=4900

# 루프 리딩 bypass (loopType별로 테스트)
/result/{session_id}?_payment_type=loop&_loop_type=action&_unlock=true&paymentKey=fake&orderId=fake&amount=900
```

---

## 진행 상황 체크리스트

### ✅ 완료

- [ x ] 프론트엔드 UX 전체 (홈/analyze/result/결제모달/마이페이지/관리자)
- [ x ] ContentPack 구조 (`love-1.ts` — dimensions, scoreMap, translationRules, additionalReadings)
- [ x ] Hidden State 계산 + State Summary 변환 (`accumulator.ts`, `translator.ts`)
- [ x ] ResultScene 타입 정의 및 shape 동결
- [ x ] generate API route (`/api/analyze/[session_id]/generate`) — 실제 Claude 호출
- [ x ] analyze page → generate API 연결 (useMock 게이트 제거)
- [ x ] result page localStorage cache 읽기 구조
- [ x ] mock fallback 안전망 유지 (API 실패 시 UX 보호)
- [ x ] QA mode (`?qa=1`) — 결제 없이 전체 씬 확인
- [ x ] Supabase 초기 스키마 migration (profiles, contents, analysis_sessions, scene_unlocks 등)
- [ x ] Loop Reading 기능 전체 (타입 / API / 프롬프트 / 결제 / UI / QA 3/3 PASS)

### 🔄 진행 중

- 콘텐츠 QA — `love-1` 실제 generate 품질 확인 및 scene_config 튜닝
- `love-2`, `love-3` 등 추가 ContentPack 제작

### 📋 다음 단계 (순서대로)

1. **`contents` 테이블 seed** — `love-1` content를 DB에 등록 (input_config + scene_config)
2. **`GET /api/contents` 구현** — contents 테이블 조회 (현재 `export {}`)
3. **홈/카테고리 페이지 → API 교체** — `DUMMY_CONTENTS` 대신 `/api/contents` fetch
4. **`analysis_sessions` 저장** — analyze 완료 시 세션 DB 기록 시작
5. **`scene_unlocks` 연동** — 결제 완료 시 unlock 기록 → result page API로 읽기
6. **소셜 로그인 실제 구현** — Kakao/Google OAuth callback
7. **Toss Payments 실제 연동** — 결제 webhook, 주문 생성

### 🕐 나중으로 미룬 것

- 마이페이지 실제 데이터 연동 (구매 내역, 세션 목록)
- 공유 페이지 DB 연동
- 관리자 대시보드 실제 통계
- `love-2` 이후 콘텐츠 추가
- 모바일 앱 웹뷰 최적화
- SEO metadata 동적 생성

---

## 현재 환경변수 상태

```bash
# .env.local (gitignore — 절대 커밋하지 않음)
ANTHROPIC_API_KEY=...              # Claude API 호출용. 없으면 generate 503
NEXT_PUBLIC_USE_MOCK_RESULT=false  # result fallback: false=API시도→mock, true=mock직접
# NEXT_PUBLIC_QA_MODE=true         # 주석 풀면 모든 씬 unlock. 로컬 테스트 전용
```

---

## 현재 리스크 / 주의 사항

**API key 만료**  
`ANTHROPIC_API_KEY`가 만료되거나 quota 초과 시 generate 503. analyze page는 catch에서 result로 이동하고, result page는 mock fallback 사용. 유저 입장에서 UX는 살아있지만 실제 생성 결과가 아닌 mock을 보게 된다. 이 상태를 사용자에게 알리는 인디케이터가 현재 없다.

**session_id 초기값 race condition**  
analyze page의 `session_id` state 초기값이 `"mock-session-001"`이다. params resolve useEffect가 완료되기 전에 submit하면 잘못된 key로 localStorage가 저장된다. 실제로는 ReactionBubble + CorrectionQuestions를 거치는 동안 resolve되므로 발생 확률 거의 0이지만, 개발 중 직접 submit을 빠르게 테스트할 때 주의.

**NEXT_PUBLIC_QA_MODE production 노출**  
`.env.local`에만 있어야 한다. CI/CD 파이프라인에서 `.env.production`이나 Vercel 환경변수에 추가되면 운영 유저가 전체 씬 무료 열람 가능.

**더미 데이터 파일 제거 타이밍**  
`src/lib/data/`의 placeholder 파일들은 아직 analyze/result page가 직접 import한다. API 연동 완료 전에 삭제하면 플로우가 깨진다. import 교체와 파일 제거는 같은 커밋에서 한다. `dummy-scene-configs.ts`는 love-1의 실제 scene_config가 있으므로 DB seed 전에는 건드리지 않는다.

**ContentPack과 DB scene_config 이중 관리**  
현재 `love-1.ts`에 scoreMap이 있고, DB에 scene_config가 들어갈 예정이다. 두 소스가 분리돼 있으면 scene_config를 DB에서 수정해도 scoreMap이 맞지 않을 수 있다. DB seed 시점에 `love-1.ts`를 canonical source로 사용하고, 이후 scene_config 수정은 DB에서만 하되 scoreMap은 코드에서 관리한다는 분리 원칙을 명확히 해야 한다.
