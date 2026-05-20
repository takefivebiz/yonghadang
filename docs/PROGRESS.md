# VEIL — 개발 진행 상황 로그

> 마지막 업데이트: 2026-05-20  
> 현재 단계: **emotional report MVP hardening 전 단계 — persistence/auth/generation flow 부분 연결 완료**

---

## 지금 어디까지 왔는가

프론트엔드 UX는 대부분 완성됐다. 사용자가 콘텐츠를 선택하고, 자유입력을 쓰고, 보정 질문에 답하고, AI 결과를 읽고, 유료 씬을 구매하고, 결과를 공유하는 전체 흐름이 작동한다. 최근에는 일반 SaaS 톤을 줄이고, VEIL의 weird archive / 심리탐정 / 의뢰 파일 세계관을 프론트 UI 전반에 반영하는 리디자인을 진행 중이다.

백엔드도 단순 예정 단계는 아니다. `analysis_sessions`, `session_answers`, `result_scenes`, `orders`, `scene_unlocks`, `guest_credentials`, Supabase OAuth, auth callback/session cookie, middleware guard, my-page 세션 조회까지 실제 코드로 연결되어 있다. 다만 결제는 아직 mock confirm 기반이고, Toss server-side verification/webhook/order intent, DB 기반 unlock entitlement restore, purchase history API는 남아 있다.

최근 변화는 다섯 가지다. 첫째, analyze page가 real Claude API를 실제로 호출하고 `result_scenes`에 저장한다. 둘째, result page가 localStorage를 우선 사용하되 DB fallback/cache reuse를 시작했다. 셋째, OAuth 로그인과 마이페이지의 실제 `analysis_sessions` 조회가 연결됐다. 넷째, result page Scene 01~02를 공통 emotional report grammar로 정리했다. 다섯째, HiddenState 기반 signal generation을 연결해 Scene 01/02의 감정 신호가 사용자별로 달라질 수 있게 됐다.

---

## 현재 MVP 상태 요약

VEIL은 현재 단순 UI prototype 단계를 넘어, 실제 persistence와 generation flow가 연결된 emotional report MVP 상태에 가까워지고 있다. 완전한 production readiness는 아니지만, 주요 사용자 흐름은 DB와 부분적으로 연결되어 hardening 기준점을 잡을 수 있는 상태다.

연결된 축:

- DB persistence: `analysis_sessions`, `session_answers`, `result_scenes`, `orders`, `scene_unlocks`, `guest_credentials`
- OAuth auth: Supabase OAuth login, callback session exchange, cookie session, middleware guard
- guest recovery: 전화번호 hash + PIN 기반 `guest_credentials`, guest session/result 조회
- unlock persistence: confirm 성공 시 `orders`와 `scene_unlocks` 저장
- result caching: `result_scenes` DB 저장, completed row cache reuse, all-or-nothing cache 전략
- hybrid persistence: localStorage cache 우선, 없으면 DB fallback, 실패 시 mock fallback
- my-page: 로그인 사용자 기준 `analysis_sessions` 실제 조회
- share: `share_token` 기반 public share API와 share page 연결
- emotional signal visualization: Scene role → archetype → template → HiddenState 기반 signal data 구조 도입
- report grammar: punch = 핵심 징후, signal = 감정 압력/반복 행동 구조, logs = 현장 기록으로 역할 분리 시작

MVP 기준 남은 핵심 hardening:

- Toss 결제 실검증, order intent, webhook
- DB 기반 unlock entitlement restore 완성
- member purchase history API/UI
- `/api/my/orders`, `/api/my/sessions`
- Loop Reading canonical DB persistence
- production smoke/E2E와 운영 오류 처리

---

## 현재 시스템 상태

### 프론트엔드 완성된 것

- 홈 랜딩 — hero redesign, CTA restructuring, 카테고리 진입 UI 정리
- 콘텐츠 인트로 페이지 (`/content/[id]`) — 의뢰 파일/폴더 톤과 muted violet CTA 정리
- Analyze 플로우 (`/analyze/[session_id]`) — 자유입력 → 반응 버블 → 보정 질문 → 완료 로딩, 입력 UI color hierarchy 정리
- Result 페이지 (`/result/[session_id]`) — scene progression, free/paid 씬 분리, 잠금 CTA, 기록 목록 navigator, AdditionalReadings, 감정 신호 시각화
- 결제 모달 (`PaymentModal`) — 결제 redirect/confirm 흐름 연결, DB persistence는 mock confirm 기반
- Auth 페이지 (`/auth`) — 일반 로그인 화면보다 랜딩 흐름을 이어주는 gate 톤으로 리디자인
- 비회원 조회 페이지 (`/guest`) — guest lookup redesign, 입력/버튼/기록 리스트 색상 정리
- 마이페이지 — “내 의뢰 보관함” 방향으로 리디자인, 로그인 사용자의 `analysis_sessions` 실제 조회 연결
- 관리자 페이지 — UI 완성, 더미 데이터
- 공유 페이지 (`/share/[share_id]`) — `share_token` 기반 public share API 연결

### Frontend UI/UX 리디자인 진행 상황

- 완료: hero redesign — 메인 랜딩을 심리탐정 리포트 / 의뢰 CTA 톤으로 정리
- 완료: auth redesign — 로그인 페이지를 빠른 진입용 gate로 정리
- 완료: guest lookup redesign — 비회원 조회 화면의 pink accent를 soft violet 계열로 통일
- 완료: category system redesign — 카테고리 진입/선택 UI의 보조색 saturation과 opacity 낮춤
- 완료: color hierarchy cleanup — dark purple 80%, muted violet 15%, category hint colors 5% 방향으로 1차 정리
- 완료: CTA restructuring — 의뢰하기, 파일 열람, bottom floating CTA의 primary accent를 soft violet 계열로 통일
- 진행중: my-page redesign — “마이페이지”를 “내 의뢰 보관함” 톤으로 전환 중
- 진행중: result page redesign — Scene 01~02 공통 report grammar, psychological case file 톤, 감정 신호 시각화 시스템 기반 구축 완료

### 핵심 데이터 흐름 (hybrid persistence)

```
analyze page 완료
  ├─ veil_analysis_${session_id}       → AnalyzeAnswers (질문/답변 전체)
  ├─ veil_hidden_state_${session_id}   → HiddenState (ContentPack 점수)
  ├─ POST /api/analyze/[session_id]/answers
  │   └─ session_answers upsert + analysis_sessions.status="answered"
  └─ POST /api/analyze/[session_id]/generate
      ├─ result_scenes upsert
      ├─ analysis_sessions.status="completed"
      └─ veil_free_scenes_${session_id} cache

result page 로드 (읽기 순서)
  1. veil_all_scenes_${session_id}     → 결제 완료 후 merge된 전체 씬
  2. veil_free_scenes_${session_id}    → analyze 직후 상태
  3. 캐시 없음 → GET /api/analyze/[session_id]/result-scenes DB fallback
  4. DB fallback 실패/empty → generate API fallback → 실패 시 mock
  5. veil_unlocked_scenes_${session_id} → unlock된 scene_index 배열
  6. veil_hidden_state_${session_id}   → AdditionalReadings 우선순위 계산

결제 성공
  ├─ POST /api/payments/confirm
  │   ├─ Supabase cookie session 있으면 user path
  │   ├─ phone+pin 있으면 guest path
  │   ├─ orders upsert(status="paid")
  │   ├─ scene_unlocks upsert
  │   └─ analysis_sessions.user_id 또는 guest_id 연결
  ├─ paid scene generate
  │   └─ result_scenes upsert
  └─ veil_unlocked_scenes_${session_id} localStorage cache

my-page
  └─ Server Component에서 auth user 확인
      └─ analysis_sessions.user_id = auth.uid 기준 세션 조회
```

`result_scenes`는 canonical result source 역할을 시작했다. 무료/유료 scene generate 결과가 `result_scenes`에 저장되고, generate API는 요청한 scene index들이 모두 completed 상태로 존재하면 Claude를 다시 호출하지 않고 DB cache를 반환한다. 이 cache reuse는 일부만 있으면 재사용하지 않는 all-or-nothing 전략이다. narrative 흐름이 scene 단위로 잘리는 것을 피하기 위해서다.

localStorage는 아직 제거하지 않는다. 현재 구조는 localStorage cache를 우선 사용하고, 없을 때 DB fallback을 시도하며, 그래도 실패하면 mock fallback으로 UX를 살리는 hybrid persistence다. key 이름과 shape을 바꾸면 result page가 조용히 깨질 수 있으므로 **지금 단계에서 key 이름과 shape은 동결이다.**

현재 남은 간극:

- unlock UI restore는 아직 `veil_unlocked_scenes_${session_id}` localStorage 의존이 크다.
- DB에는 `scene_unlocks`가 저장되지만 result page가 세션 로드 시 이를 조회해 entitlement를 복원하는 API는 아직 없다.
- my-page는 `analysis_sessions` 목록은 실제 조회하지만, `orders`/`scene_unlocks` 기반 구매 여부와 구매 기록은 아직 표시하지 않는다.

---

## Content Pack vs Mock 데이터

두 가지는 역할이 다르다.

**Content Pack** (`src/lib/content-packs/love-1.ts` 등)  
실제 VEIL 콘텐츠다. scoreMap, translationRules, scene_config가 여기 있고, 지금 Claude가 실제 결과를 만들 때 이게 쓰인다. dummy가 아니다.

**Mock / Fallback 데이터** (`src/lib/data/dummy-*.ts`)  
API 실패 시 UX 보호용이거나, 홈/목록 페이지의 임시 placeholder다. 순차적으로 API 연동으로 교체되거나, 안전망으로 영구 유지된다.

> `scene-configs.ts`/content pack 쪽 scene_config는 여전히 generate와 UI에서 직접 사용된다. DB `contents.scene_config`와 코드 scene_config가 동시에 존재하므로, 어느 쪽을 canonical로 둘지 hardening 단계에서 정리해야 한다.

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
  → result_scenes upsert(status="completed")
  → analysis_sessions.status="completed"
  → veil_free_scenes_${session_id} 저장
  → /result/${session_id} 이동
```

### DB cache reuse

`/api/analyze/[session_id]/generate`는 QA mode가 아니면 먼저 `result_scenes`를 조회한다. 요청된 `scene_indexes`가 모두 `status="completed"`이고 `messages`가 존재하면 Claude를 호출하지 않고 DB row를 `ResultScene[]`로 매핑해서 반환한다.

전략은 all-or-nothing이다. 요청한 scene 중 일부만 캐시되어 있으면 전체를 다시 생성한다. 유료 scene은 무료 scene context와 narrative 흐름을 이어받기 때문에 partial reuse가 오히려 품질을 깨뜨릴 수 있다.

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

콘텐츠 품질을 검증하려면 유료 씬 전체를 보는 게 필수다. 결제 persistence는 mock confirm 기반으로 연결됐지만 Toss 실검증과 운영 결제는 아직 아니므로, QA mode가 있어야 "콘텐츠 수정 → 생성 확인 → 수정" 사이클이 빠르게 돌아간다.

### 주의

`NEXT_PUBLIC_QA_MODE=true`는 `.env.local`(gitignore)에만. `.env.production`에 절대 넣지 않는다. 운영에서 모든 유저가 유료 씬 무료 열람하게 된다.

---

## Fallback 정책

```
result page — 캐시 없을 때 분기:

1. localStorage cache 확인
  - veil_all_scenes_${session_id}
  - veil_free_scenes_${session_id}

2. cache 없음 + QA mode 아님
  → GET /api/analyze/[session_id]/result-scenes
  → result_scenes completed rows 복원

3. DB fallback 실패/empty

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

## Emotional Report Grammar / Signal Visualization (2026-05-20)

이번 작업은 단순 UI 수정이 아니라, VEIL 결과 리포트를 AI 채팅형 결과에서 emotional case file / weird emotional analytics 방향으로 옮기는 구조 작업이었다. 결과 리포트는 이제 “상담 답변 카드”가 아니라, 의뢰 파일 안에서 핵심 징후, 감정 신호, 현장 기록이 분리되어 읽히는 구조를 목표로 한다.

현재 역할 분리:

```txt
punch  → 핵심 징후
signal → 감정 압력 / 반복 행동 구조
logs   → 현장 기록
```

### Report Scene Grammar

Scene 01~02에서 공통으로 쓰는 report grammar를 정리했다.

구조:

```txt
Scene Header
  FILE XX · scene title
  subtitle

핵심 징후
  punch card
  signature / cat icon

감정 신호
  scene role에 맞는 visualization template

기록 로그
  bullet log
```

구현된 컴포넌트:

- `SceneReportLayout`
- `SceneHeader`
- `ScenePunchBlock`
- `SceneSignalSection`
- `SceneLogList`
- `SignalVisualization`
- `DonutSignalTemplate`
- `EditorialInfographicSignalTemplate`

Scene 01은 receipt 기반 folder/report layout을 유지하되, 내부를 report section으로 정리했다. `핵심 관찰`은 `핵심 징후`로 바꿨고, signal과 bullet log의 역할을 분리했다. Scene 01의 역할은 “현재 감정 압력”이다.

Scene 02는 별도 페이지처럼 보이지 않고 Scene 01과 같은 report grammar의 다음 기록처럼 보이도록 정리했다. receipt는 제거하고, 같은 folder shell 안에서 `FILE 02 · 현장 기록` → 핵심 징후 → signal → log 흐름으로 이어진다.

### Emotional Signal Visualization System

감정 신호 시각화는 일반 dashboard chart가 아니라, 의뢰자의 감정 사건 파일 안에서 관찰된 감정 압력과 반복 행동 구조를 “증거 조각”처럼 보여주는 시스템이다.

기본 구조:

```txt
Scene Role
→ Emotional Archetype
→ Visualization Template
→ Signal Data
```

현재 template:

- Scene 01: `donut` imbalance
  - 현재 감정 압력 / 감정 간 비대칭을 보여준다.
  - 예: 불안 반응 ↔ 안정감 기대, 질문 충동 ↔ 실제 표현, 감정 소모 ↔ 유지 의지
- Scene 02: `editorial_infographic`
  - 반복 행동 신호를 압축 카드로 보여준다.
  - 예: 말투·행동 의미 재해석, 작은 반응에 감정 흔들림, 생각 줄이기 시도, 묻고 싶은 말 보류

도입된 타입/구조:

- `SceneSignal`
- `SignalTemplateType`
- `EmotionalArchetype`
- `SceneVisualRole`
- `deriveSceneSignals()`

### HiddenState 기반 Dynamic Signal Generation

Scene 01/02 signal은 더 이상 하드코딩 문구 중심이 아니다. `veil_hidden_state_${session_id}`에 저장된 HiddenState를 읽고, `deriveSceneSignals()`가 love-1 전용 preset 중 상위 dimension을 선택한다.

love-1 dimensions:

- `shakeIntensity`
- `clarityHunger`
- `interpretiveLoop`
- `actionImminence`
- `expectationFold`
- `emotionalFatigue`

Scene 01:

- HiddenState 상위 dimension 기준으로 donut pair 2개 선택
- 현재 감정 압력 scene이므로 `shakeIntensity`, `clarityHunger`, `actionImminence`가 우선적으로 드러나기 쉽다.
- 같은 archetype 중복을 피한다.
- 도넛 비율은 score와 선택 순위를 함께 반영해, 두 도넛이 같은 비율로 보이지 않도록 보정했다.
- 수치/퍼센트는 화면에 노출하지 않는다.

Scene 02:

- HiddenState 상위 dimension 기준으로 editorial infographic tile 2개 선택
- 반복 반응 기록 scene이므로 `interpretiveLoop`, `clarityHunger`, `shakeIntensity`가 우선적으로 드러나기 쉽다.
- tile 문구와 icon은 signal id/preset에 따라 달라진다.
- 시간, 요일, 횟수 같은 fake data는 생성하지 않는다.

fallback:

- Scene 01 fallback: 불안 반응 ↔ 안정감 기대 / 질문 충동 ↔ 실제 표현
- Scene 02 fallback: 말투·행동 의미 재해석 / 묻고 싶은 말 보류

### Scene 02 Role 정리

Scene 02는 감정 상태 분석 scene이 아니다. 방향은 “반복 행동 기록 / 현장 기록”으로 정리했다.

Scene 02가 기록해야 하는 것:

- 의뢰자가 무엇을 반복해서 보고 있었는가
- 무엇을 계속 해석하고 있었는가
- 직접 묻지 않고 무엇을 남겨두고 있었는가
- 그 행동이 결국 무엇을 찾기 위해 반복되는가

즉, 행동 기록에서 끝나는 것이 아니라 행동의 의미까지 회수해야 한다.

기존에 실험한 pulse/timeline 방식은 보류했다. fake timestamp처럼 보일 위험이 있고, 의뢰자가 입력하지 않은 시간/요일/횟수 데이터를 추론하는 것처럼 보일 수 있기 때문이다. 현재는 editorial infographic tile 방식으로 바꿨다.

### Prompt / Prose 조정

무료 Scene 01~02 prompt도 report grammar에 맞춰 조정했다.

변경:

- “아직 기록되지 않았음” 계열 ending을 금지했다.
- 무료 scene ending이 미분석/미완성 보고서처럼 보이지 않고, 다음 기록으로 이어지는 archive flow처럼 읽히도록 했다.
- Scene 01~02 prose를 추상적인 구조 설명보다 실제 행동 기록 중심으로 조정했다.
- “구조/흐름/상태” 남용을 줄이고, 말투/답장/반응/거리감/다시 읽기 같은 행동 단서를 강화했다.
- Scene 02 punch는 행동 구조 설명이 아니라 “의뢰자가 여기서 찾고 있던 의미”를 먼저 찌르도록 조정했다.

Terminology:

- 결과 리포트 prompt와 love-1 scene config에서 `사용자` 표현을 `의뢰자`로 정리했다.
- 서비스/앱 용어보다 의뢰 파일 / 현장 기록 / 최종 보고 tone을 우선한다.

### 현재 결정 사항

- Scene 01은 “현재 감정 압력”을 donut imbalance로 보여준다.
- Scene 02는 “반복 행동 기록”을 editorial infographic tile로 보여준다.
- signal은 punch를 반복하지 않는다. punch를 만든 감정 압력 또는 반복 행동 구조를 별도 레이어로 보여준다.
- logs는 감정 설명 카드가 아니라 현장 기록 bullet 흐름으로 유지한다.
- 숫자, 퍼센트, 시간, 요일, 횟수는 현재 signal UI에 노출하지 않는다.

### 다음 예정 작업

- Scene 03~06 report grammar 확장
- Scene role별 visualization template 추가 검토
- DB에 signal을 저장할지, HiddenState 기반 deterministic derivation으로 유지할지 hardening 단계에서 결정
- Scene 02 tile preset 문구/아이콘 QA
- result page에서 unlock entitlement restore가 붙은 뒤 signal 재생성/복원 경로 점검

---

## Entitlement Layer 방향 (scene_unlocks)

`scene_unlocks` 테이블 저장은 이미 연결됐다. 결제 confirm 성공 시 `orders`가 `status="paid"`로 upsert되고, unlock 대상 scene들이 `scene_unlocks`에 `session_id + scene_index + order_id`로 저장된다.

현재 DB 구조:

```
scene_unlocks 테이블
  session_id  → analysis_sessions.id
  scene_index → 어떤 씬이 열렸는지
  unlocked_at → 결제 시각
  order_id    → orders.id (결제 근거)
```

이 테이블이 entitlement layer다. 다만 UI 복원은 아직 완성되지 않았다. result page는 결제 직후 `veil_unlocked_scenes_${session_id}` localStorage key에 `number[]`를 저장하고, 재방문 시 이 localStorage 값을 우선 사용한다. 다른 브라우저/기기 또는 localStorage 삭제 상황에서는 DB에 unlock 기록이 있어도 result page UI가 이를 자동 복원하지 못할 수 있다.

남은 작업:

- `GET /api/sessions/[id]/unlocks` 또는 동등한 entitlement API 추가
- result page load 시 `scene_unlocks`를 조회해 `unlockedScenes` 복원
- localStorage는 빠른 client cache로 유지하되 DB를 최종 권한 기준으로 사용
- my-page/session detail에서 구매 여부를 `orders` 또는 `scene_unlocks` 기준으로 계산

---

## Guest 구조 방향

### guest_users 테이블을 제거한 이유

`guest_users`처럼 전용 테이블을 만들면 회원/비회원 두 개의 identity 시스템을 병렬로 관리해야 한다. 조인이 늘고 RLS가 복잡해진다. 대신 `analysis_sessions`에 `guest_id uuid` 컬럼 하나로 충분하다.

### 현재 구현

- 결제 confirm에서 로그인 세션이 없고 `guest_phone + guest_pin`이 있으면 guest path로 처리한다.
- 전화번호는 SHA-256 hash로 저장하고, PIN은 bcrypt hash로 저장한다.
- 기존 `guest_credentials` row가 있으면 PIN을 검증한다.
- 새 guest면 `guest_credentials` row를 생성한다.
- `analysis_sessions.guest_id`가 비어 있으면 guest id를 연결한다.
- `orders.guest_id`에 결제 주체를 기록한다.
- `/api/guest/verify`는 phone+pin을 검증하고 guest의 sessions, answers, result_scenes, scene_unlocks를 묶어서 반환한다.

전화번호+비밀번호 기반 `guest_credentials` 테이블은 유료 결제한 비회원의 인증용으로만 남긴다. "나는 가입 안 하고 싶지만 내 결과는 다시 보고 싶다"는 케이스다.

### 아직 미구현/보류

- 비회원 첫 접속 시 httpOnly `veil_guest_id` 쿠키 자동 발급
- 모든 비회원 세션 생성 시 guest cookie 기반 `analysis_sessions.guest_id` 선연결
- 회원 가입/로그인 시 guest 세션을 `user_id`로 이관

---

## Supabase Auth / My Page 상태

### 구현 완료

- `/auth`에서 Supabase OAuth login 호출
- `/api/auth/callback`에서 code를 session cookie로 교환
- middleware에서 `/my-page` 접근 시 `auth.getUser()`로 로그인 여부 확인
- my-page server component에서 다시 `auth.getUser()`로 2차 확인
- `profiles` 조회 후 `analysis_sessions.user_id = user.id` 기준으로 세션 목록 조회
- `/api/auth/logout`에서 Supabase signOut 호출
- logout/settings/account management 경로에서 client localStorage cleanup 수행

### 부분 구현

- `analysis_sessions.user_id`는 세션 생성 시점이 아니라 결제 confirm에서 연결된다.
- 결제하지 않은 로그인 사용자의 세션은 현재 생성 시점에 `user_id`가 붙지 않을 수 있다.
- my-page는 실제 세션 목록을 보여주지만 `orders` 기반 구매 기록, `has_purchase`, 결제 영수증/상태 표시는 아직 없다.

### 미구현

- `/api/my/sessions`
- `/api/my/orders`
- member purchase restore API
- guest 세션을 로그인 계정으로 이관하는 merge flow

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

결과 페이지에서 유료 씬을 모두 읽은 뒤 구매할 수 있는 "루프 리딩" 기능을 구현했다. 3개 loopType(action / standard / evaluate)에 대해 AI 생성 → 결제 분기 → localStorage 캐시 → 재방문 복원까지 작동한다. 다만 canonical DB persistence는 아직 완성되지 않았다.

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

### 현재 한계

- `loop_answers` 테이블 migration은 존재하지만, result page의 loop reading은 아직 localStorage 캐시 중심이다.
- loop 결제는 UI/redirect 분기가 있으나 `orders`/`scene_unlocks`와 같은 canonical entitlement model로 완전히 정리되지 않았다.
- 운영 기준으로는 loop purchase/order persistence와 loop answer DB 저장 API가 추가로 필요하다.

### 브라우저 QA bypass URL

```
# 유료 씬 전체 unlock (sceneInsights 저장 목적)
/result/{session_id}?_payment_type=all&_scene_index=0&_unlock=true&paymentKey=fake&orderId=fake&amount=4900

# 루프 리딩 bypass (loopType별로 테스트)
/result/{session_id}?_payment_type=loop&_loop_type=action&_unlock=true&paymentKey=fake&orderId=fake&amount=900
```

---

## 커밋 3~5: DB Migration 복구 + Contents API + 홈/카테고리 실제 데이터 연동 (2026-05-17)

### 커밋 3 — 원격 Supabase DB migration 복구

migration history에 누락된 002~005가 apply된 적 없었음. 안전하게 복구:

- **002**: `contents` 테이블에 `slug`, `estimated_minutes` 컬럼 추가, UNIQUE 제약, INDEX, love-1 upsert seed (`ON CONFLICT DO UPDATE`)
- **003**: `loop_answers` 테이블 생성 (RLS, trigger, index 포함)
- **004**: `analysis_sessions`에 `share_token` 컬럼 추가 (UNIQUE, index, 기존 row backfill)
- **005**: `session_answers`에서 `question_index` 제거, `step_id NOT NULL` + UNIQUE 제약 추가 (적용 전 row 0개 확인)
- **006**: love-1 `thumbnail_url` 수정 (`null` → `/img/love-1.png`)
- **007**: love-1 `title`/`subtitle` DB 오입력 수정 (올바른 값으로 업데이트)

### 커밋 4 — GET /api/contents 공개 API 제한

`/api/contents`가 `input_config`, `scene_config` 등 내부 설계 데이터를 노출하던 문제 수정:

- `PublicContent` 타입 신규 추가 (`id`, `slug`, `title`, `subtitle`, `category`, `thumbnail_url`, `insights`만 포함)
- `GET /api/contents` → PublicContent[] 반환으로 제한, SELECT에서 내부 필드 제외
- `insights`는 `scene_config.scenes[].title` 배열에서 파생 후 scene_config 자체는 미반환
- `src/lib/types/content.ts`에 `Content`(내부 전용) / `PublicContent`(API 응답) 타입 분리 확정

### 커밋 5 — 홈/카테고리 페이지 실제 데이터 연동

`DUMMY_CONTENTS` → `/api/contents` fetch 기반으로 교체:

- `src/lib/data/fetch-contents.ts` 신규 생성 (server-only, ISR revalidate 60초, 실패 시 빈 배열 반환)
  - URL 우선순위: `VERCEL_URL` → `NEXT_PUBLIC_SITE_URL_DEVELOPMENT` → `localhost:3000`
- 홈(`page.tsx`), 카테고리(`/category/[category]/page.tsx`) → async Server Component + `fetchContents()` 사용
- `ContentCard`, `ContentSection`, `TrendingSection` → `Content` 타입에서 `PublicContent` 타입으로 전환
- slug 기반 라우팅: `content.slug ?? content.id` (href 생성)
- empty state 처리: 콘텐츠 없으면 "아직 준비된 콘텐츠가 없습니다." / TrendingSection은 null 반환 (섹션 숨김)

### SEO 메타데이터 정비

- `layout.tsx`: 글로벌 title template `"%s | VEIL"`, description, keywords, OG, twitter 전면 정비
- 홈(`page.tsx`): `title: { absolute: "VEIL | 지금 너에게 가장 필요한 말" }` — template 중복 방지
- 카테고리 페이지: `title: label`만 사용 (template이 "연애·결혼 | VEIL"로 자동 조합)
- 콘텐츠 인트로(`/content/[id]`): OG(article), twitter 메타데이터 추가

### Vercel 환경변수 수정

- `SUPABASE_URL` → `NEXT_PUBLIC_SUPABASE_URL`로 변경 (코드가 이 이름으로 읽으므로 통일)
- `src/lib/supabase/server.ts`: `NEXT_PUBLIC_SUPABASE_URL`만 읽도록 정리

---

## 진행 상황 체크리스트

### ✅ 완료

- [ x ] 프론트엔드 UX 전체 (홈/analyze/result/결제모달/마이페이지/관리자)
- [ x ] ContentPack 구조 (`love-1.ts` — dimensions, scoreMap, translationRules, additionalReadings)
- [ x ] Hidden State 계산 + State Summary 변환 (`accumulator.ts`, `translator.ts`)
- [ x ] ResultScene 타입 정의 및 shape 동결
- [ x ] generate API route (`/api/analyze/[session_id]/generate`) — 실제 Claude 호출
- [ x ] analyze page → generate API 연결 (useMock 게이트 제거)
- [ x ] `analysis_sessions` 생성 (`POST /api/analyze`)
- [ x ] `session_answers` 저장 (`POST /api/analyze/[session_id]/answers`)
- [ x ] `result_scenes` persistence (`POST /api/analyze/[session_id]/generate`)
- [ x ] `result_scenes` DB cache reuse
- [ x ] generate API all-or-nothing cache reuse 전략
- [ x ] result page hybrid cache 읽기 구조 (localStorage → DB fallback → generate/mock fallback)
- [ x ] mock fallback 안전망 유지 (API 실패 시 UX 보호)
- [ x ] QA mode (`?qa=1`) — 결제 없이 전체 씬 확인
- [ x ] Supabase 초기 스키마 migration (profiles, contents, analysis_sessions, scene_unlocks 등)
- [ x ] `orders` persistence (mock confirm 기반)
- [ x ] `scene_unlocks` 저장 (mock confirm 기반)
- [ x ] `guest_credentials` 기반 guest recovery
- [ x ] Supabase OAuth login
- [ x ] OAuth callback → session cookie exchange
- [ x ] middleware auth guard (`/my-page`)
- [ x ] logout/session cleanup
- [ x ] my-page 실제 `analysis_sessions` 조회
- [ x ] `share_token` 기반 public share API
- [ x ] Loop Reading generation/UI/localStorage cache (타입 / API / 프롬프트 / UI / QA 3/3 PASS)
- [ x ] 감정 신호 시각화 시스템 1차 기반 (`SceneSignal` 타입 / signal renderer / donut template / editorial infographic template / Scene 01~02 적용)
- [ x ] `deriveSceneSignals()` HiddenState 기반 dynamic signal generation
- [ x ] Scene 01~02 공통 report grammar (`SceneReportLayout`, `SceneHeader`, `ScenePunchBlock`, `SceneSignalSection`, `SceneLogList`)

### 🔄 부분 구현 / hardening 필요

- [ ~ ] 결제 persistence — `POST /api/payments/confirm`에서 `orders`/`scene_unlocks` 저장됨. Toss server-side verification은 미완료.
- [ ~ ] member purchase restore — DB에는 주문/unlock 저장됨. result page UI entitlement restore는 localStorage 의존이 큼.
- [ ~ ] my-page — 로그인 사용자 `analysis_sessions` 조회는 실제 연결. purchase history, `has_purchase`, order list는 미구현.
- [ ~ ] Loop Reading persistence — generation은 구현. canonical DB persistence는 불완전.
- [ ~ ] guest recovery — phone+pin 기반 유료 guest recovery는 구현. guest cookie/session 선연결과 member merge는 미구현.
- [ ~ ] share — `share_token` 기반 public share API는 연결. share 권한/노출 정책 hardening은 필요.

### 🔄 진행 중인 제품/콘텐츠 작업

- 콘텐츠 QA — `love-1` 실제 generate 품질 확인 및 scene_config 튜닝
- Result page redesign — Scene 01~02 grammar 완료, Scene 03~06 signal grammar 확장
- `love-2`, `love-3` 등 추가 ContentPack 제작

### ❌ 미완료 / 비어 있음

- [ ] `/api/payments/webhook`
- [ ] `/api/payments/intent`
- [ ] Toss server-side verification
- [ ] `/api/my/orders`
- [ ] `/api/my/sessions`
- [ ] DB 기반 unlock entitlement restore 완성
- [ ] member purchase history UI
- [ ] admin hardening/statistics
- [ ] production hardening
- [ ] full smoke/E2E

### 📋 다음 단계 (hardening 순서)

1. **Toss 실제 결제 검증** — confirm에서 Toss API 검증, amount/orderId 검증, 실패 상태 처리
2. **order intent/webhook** — `/api/payments/intent`, `/api/payments/webhook` 구현
3. **DB entitlement restore** — result page load 시 `scene_unlocks` 조회로 unlock 복원
4. **my-page purchase history** — `/api/my/orders`, `/api/my/sessions`, `has_purchase` 계산
5. **Loop Reading DB persistence** — `loop_answers` 저장/복원 API 연결
6. **guest/member merge** — 로그인 시 guest session을 user account로 이관할지 정책 결정 및 구현
7. **smoke/E2E** — auth → analyze → generate → pay confirm → my-page → result restore 전체 검증

### 🕐 나중으로 미룬 것

- 관리자 대시보드 실제 통계
- `love-2` 이후 콘텐츠 추가
- 모바일 앱 웹뷰 최적화
- SEO metadata 동적 생성

---

## 현재 환경변수 상태

```bash
# .env.local (gitignore — 절대 커밋하지 않음)
ANTHROPIC_API_KEY=...              # Claude API 호출용. 없으면 generate 503
NEXT_PUBLIC_SUPABASE_URL=...       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  # Supabase browser/server anon key
SUPABASE_SERVICE_ROLE_KEY=...      # server-only DB access
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

**결제 confirm은 아직 mock 검증**  
`/api/payments/confirm`은 `payment_key`, `order_id`, `amount`를 받아 DB에 저장하지만 Toss API에 서버 검증 요청을 보내지 않는다. 운영 전에는 Toss confirm API 검증, amount 검증, order intent 생성, webhook idempotency가 필요하다.

**DB unlock 기록과 UI entitlement 복원 간극**  
`orders`와 `scene_unlocks`는 저장되지만 result page의 unlock 복원은 아직 localStorage 의존이 크다. 다른 기기/브라우저, localStorage 삭제, 로그인 후 재방문 시 DB에 구매 기록이 있어도 UI가 자동으로 유료 씬을 열지 못할 수 있다.

**my-page 구매 기록 미표시**  
my-page는 `analysis_sessions.user_id` 기준 세션 목록은 조회한다. 그러나 `orders`/`scene_unlocks` 기반 `has_purchase`, 구매 내역, 영수증/결제 상태는 아직 표시하지 않는다.

**더미 데이터 파일 제거 타이밍**  
`src/lib/data/`의 placeholder 파일들은 아직 analyze/result page가 직접 import한다. API 연동 완료 전에 삭제하면 플로우가 깨진다. import 교체와 파일 제거는 같은 커밋에서 한다. scene_config는 코드와 DB 양쪽에 존재하므로 제거/이관 순서를 분리해서 처리해야 한다.

**ContentPack과 DB scene_config 이중 관리**  
현재 `love-1.ts`에 scoreMap/translationRules가 있고, scene_config는 코드와 DB 양쪽에서 다뤄진다. 두 소스가 분리돼 있으면 DB에서 scene_config를 수정해도 prompt/context 로직과 맞지 않을 수 있다. hardening 단계에서 `love-1.ts`를 canonical source로 유지할지, DB `contents.scene_config`를 canonical source로 전환할지 명확히 해야 한다.
