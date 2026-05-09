# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: result-page.spec.ts >> R: 결과 페이지 (/result/[session_id]) >> R-01: 로딩 완료 후 씬이 렌더링된다
- Location: tests/e2e/result-page.spec.ts:46:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - navigation [ref=e4]:
      - link "VEIL" [ref=e5] [cursor=pointer]:
        - /url: /
      - generic [ref=e6]:
        - link "비회원 조회" [ref=e7] [cursor=pointer]:
          - /url: /guest
        - link "로그인" [ref=e9] [cursor=pointer]:
          - /url: /auth
  - main [ref=e10]:
    - generic [ref=e11]:
      - heading "설명되지 않던 감정이 보이기 시작할 거야" [level=1] [ref=e13]:
        - text: 설명되지 않던 감정이
        - text: 보이기 시작할 거야
      - generic [ref=e18]:
        - heading "지금 많이 보는" [level=2] [ref=e21]
        - generic [ref=e22]:
          - link [ref=e23] [cursor=pointer]:
            - /url: /content/love-1
            - article [ref=e24]:
              - img "사랑일까, 집착일까?" [ref=e25]
              - generic [ref=e26]: 연애
              - img [ref=e29]
          - link [ref=e31] [cursor=pointer]:
            - /url: /content/rel-1
            - article [ref=e32]:
              - img "왜 나는 항상 관계에서 을이 되는 걸까?" [ref=e33]
              - generic [ref=e34]: 인간관계
              - img [ref=e37]
          - link [ref=e39] [cursor=pointer]:
            - /url: /content/career-2
            - article [ref=e40]:
              - img "퇴사 vs 버티기, 지금 내 상황은?" [ref=e41]
              - generic [ref=e42]: 직업·진로
              - img [ref=e45]
          - link [ref=e47] [cursor=pointer]:
            - /url: /content/emotion-3
            - article [ref=e48]:
              - generic [ref=e53]: 감정
              - img [ref=e56]
      - generic [ref=e62]:
        - link "연애" [ref=e63] [cursor=pointer]:
          - /url: "#love"
        - link "인간관계" [ref=e64] [cursor=pointer]:
          - /url: "#relationship"
        - link "직업·진로" [ref=e65] [cursor=pointer]:
          - /url: "#career"
        - link "감정" [ref=e66] [cursor=pointer]:
          - /url: "#emotion"
      - generic [ref=e67]:
        - generic [ref=e68]:
          - heading "연애" [level=2] [ref=e71]
          - link "전체보기 →" [ref=e72] [cursor=pointer]:
            - /url: /category/love
        - generic [ref=e73]:
          - link [ref=e74] [cursor=pointer]:
            - /url: /content/love-1
            - article [ref=e75]:
              - img "사랑일까, 집착일까?" [ref=e76]
              - img [ref=e79]
          - link [ref=e81] [cursor=pointer]:
            - /url: /content/love-2
            - article [ref=e82]:
              - img "나는 진심일까, 그냥 외로운 걸까?" [ref=e83]
              - img [ref=e86]
          - link [ref=e88] [cursor=pointer]:
            - /url: /content/love-3
            - article [ref=e89]:
              - img "왜 항상 나만 더 좋아하게 될까?" [ref=e90]
              - img [ref=e93]
          - link [ref=e95] [cursor=pointer]:
            - /url: /content/love-4
            - article [ref=e96]:
              - img "왜 항상 썸에서 끝날까?" [ref=e97]
              - img [ref=e100]
          - link [ref=e102] [cursor=pointer]:
            - /url: /content/love-5
            - article [ref=e103]:
              - img "이 사람, 나 좋아하는 거 맞아?" [ref=e104]
              - img [ref=e107]
          - link [ref=e109] [cursor=pointer]:
            - /url: /content/love-6
            - article [ref=e110]:
              - img "헤어지고 싶은 걸까, 그냥 지친걸까?" [ref=e111]
              - img [ref=e114]
      - generic [ref=e116]:
        - generic [ref=e117]:
          - heading "인간관계" [level=2] [ref=e120]
          - link "전체보기 →" [ref=e121] [cursor=pointer]:
            - /url: /category/relationship
        - generic [ref=e122]:
          - link [ref=e123] [cursor=pointer]:
            - /url: /content/rel-1
            - article [ref=e124]:
              - img "왜 나는 항상 관계에서 을이 되는 걸까?" [ref=e125]
              - img [ref=e128]
          - link [ref=e130] [cursor=pointer]:
            - /url: /content/rel-2
            - article [ref=e131]:
              - img "내가 예민한건가?" [ref=e132]
              - img [ref=e135]
          - link [ref=e137] [cursor=pointer]:
            - /url: /content/rel-3
            - article [ref=e138]:
              - img [ref=e145]
          - link [ref=e147] [cursor=pointer]:
            - /url: /content/rel-4
            - article [ref=e148]:
              - img [ref=e155]
          - link [ref=e157] [cursor=pointer]:
            - /url: /content/rel-5
            - article [ref=e158]:
              - img [ref=e165]
          - link [ref=e167] [cursor=pointer]:
            - /url: /content/rel-6
            - article [ref=e168]:
              - img [ref=e175]
      - generic [ref=e177]:
        - generic [ref=e178]:
          - heading "직업·진로" [level=2] [ref=e181]
          - link "전체보기 →" [ref=e182] [cursor=pointer]:
            - /url: /category/career
        - generic [ref=e183]:
          - link [ref=e184] [cursor=pointer]:
            - /url: /content/career-1
            - article [ref=e185]:
              - img "지금 이 일, 나한테 맞는 걸까?" [ref=e186]
              - img [ref=e189]
          - link [ref=e191] [cursor=pointer]:
            - /url: /content/career-2
            - article [ref=e192]:
              - img "퇴사 vs 버티기, 지금 내 상황은?" [ref=e193]
              - img [ref=e196]
          - link [ref=e198] [cursor=pointer]:
            - /url: /content/career-3
            - article [ref=e199]:
              - img [ref=e206]
          - link [ref=e208] [cursor=pointer]:
            - /url: /content/career-4
            - article [ref=e209]:
              - img [ref=e216]
          - link [ref=e218] [cursor=pointer]:
            - /url: /content/career-5
            - article [ref=e219]:
              - img [ref=e226]
      - generic [ref=e228]:
        - generic [ref=e229]:
          - heading "감정" [level=2] [ref=e232]
          - link "전체보기 →" [ref=e233] [cursor=pointer]:
            - /url: /category/emotion
        - generic [ref=e234]:
          - link [ref=e235] [cursor=pointer]:
            - /url: /content/emotion-1
            - article [ref=e236]:
              - img "이유 없이 공허한 이 감정의 정체" [ref=e237]
              - img [ref=e240]
          - link [ref=e242] [cursor=pointer]:
            - /url: /content/emotion-2
            - article [ref=e243]:
              - img "자꾸 남과 비교하는 내가 싫을 때" [ref=e244]
              - img [ref=e247]
          - link [ref=e249] [cursor=pointer]:
            - /url: /content/emotion-3
            - article [ref=e250]:
              - img [ref=e257]
          - link [ref=e259] [cursor=pointer]:
            - /url: /content/emotion-4
            - article [ref=e260]:
              - img [ref=e267]
          - link [ref=e269] [cursor=pointer]:
            - /url: /content/emotion-5
            - article [ref=e270]:
              - img [ref=e277]
  - contentinfo [ref=e279]:
    - generic [ref=e280]:
      - generic [ref=e281]:
        - paragraph [ref=e282]: "VEIL | 대표자: 홍길동"
        - paragraph [ref=e283]: "사업자등록번호 : 00-00-00000"
        - paragraph [ref=e284]: "통신판매업신고: 제2026-서울-0000호"
        - paragraph [ref=e285]: 서울특별시 땡땡구 땡땡동 땡떙로 77
      - generic [ref=e286]:
        - button "이용약관" [ref=e287]
        - button "개인정보처리방침" [ref=e288]
        - button "문의하기" [ref=e289]
      - paragraph [ref=e290]: © 2026 VEIL. All rights reserved.
```

# Test source

```ts
  1   | import { test, expect, Page } from "@playwright/test";
  2   | 
  3   | // ── 테스트 상수 ────────────────────────────────────────────────────────
  4   | const SESSION_ID = "test-result-r01";
  5   | const CONTENT_ID = "love-1";
  6   | 
  7   | // love-1: scene 1,2 무료 / scene 3,4,5,6 유료 → 총 6개 씬
  8   | const FREE_SCENE_COUNT = 2;
  9   | const PAID_SCENE_COUNT = 4;
  10  | const TOTAL_SCENE_COUNT = FREE_SCENE_COUNT + PAID_SCENE_COUNT;
  11  | 
  12  | // ── Helper: localStorage에 분석 데이터 세팅 후 결과 페이지 이동 ──────────
  13  | const gotoResultWithData = async (
  14  |   page: Page,
  15  |   sessionId = SESSION_ID,
  16  |   contentId = CONTENT_ID,
  17  |   queryString = "",
  18  | ) => {
  19  |   // localStorage는 origin 확립 후에만 쓸 수 있어서 먼저 홈으로 이동
> 20  |   await page.goto("/");
      |              ^ Error: page.goto: Test timeout of 30000ms exceeded.
  21  |   await page.evaluate(
  22  |     ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
  23  |     {
  24  |       key: `veil_analysis_${sessionId}`,
  25  |       value: {
  26  |         session_id: sessionId,
  27  |         content_id: contentId,
  28  |         free_input: "테스트 입력",
  29  |         answers: [],
  30  |         created_at: new Date().toISOString(),
  31  |       },
  32  |     },
  33  |   );
  34  |   await page.goto(`/result/${sessionId}${queryString}`);
  35  | };
  36  | 
  37  | // ── Helper: 씬 렌더링 대기 (로딩 완료 기준) ──────────────────────────────
  38  | const waitForScenes = async (page: Page) => {
  39  |   // 첫 번째 씬 제목이 나타날 때까지 대기
  40  |   await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
  41  | };
  42  | 
  43  | // ─────────────────────────────────────────────────────────────────────────
  44  | test.describe("R: 결과 페이지 (/result/[session_id])", () => {
  45  |   // ── R-01: 로딩 인디케이터 → 씬 렌더링 ───────────────────────────────
  46  |   test("R-01: 로딩 완료 후 씬이 렌더링된다", async ({ page }) => {
  47  |     await gotoResultWithData(page);
  48  |     // 로딩 스피너가 사라지고 콘텐츠가 렌더링되는지 확인
  49  |     await expect(page.locator(".animate-spin")).not.toBeVisible({
  50  |       timeout: 8000,
  51  |     });
  52  |     await expect(page.locator("h2").first()).toBeVisible();
  53  |   });
  54  | 
  55  |   // ── R-02: 유효한 데이터 → 씬 목록 렌더링 ────────────────────────────
  56  |   test("R-02: 유효한 localStorage 데이터로 씬이 정상 렌더링된다", async ({
  57  |     page,
  58  |   }) => {
  59  |     await gotoResultWithData(page);
  60  |     await waitForScenes(page);
  61  | 
  62  |     // 총 씬 wrapper 개수 확인 (data-scene-idx 속성)
  63  |     const sceneWrappers = page.locator("[data-scene-idx]");
  64  |     await expect(sceneWrappers).toHaveCount(TOTAL_SCENE_COUNT);
  65  |   });
  66  | 
  67  |   // ── R-03: 콘텐츠 제목 표시 ───────────────────────────────────────────
  68  |   test("R-03: 콘텐츠 제목(h1)이 표시된다", async ({ page }) => {
  69  |     await gotoResultWithData(page);
  70  |     await waitForScenes(page);
  71  | 
  72  |     // love-1 제목 확인
  73  |     const heading = page.locator("h1");
  74  |     await expect(heading).toBeVisible();
  75  |     const text = await heading.textContent();
  76  |     expect(text).toContain("사랑");
  77  |   });
  78  | 
  79  |   // ── R-04: localStorage 데이터 없음 → 에러 상태 ──────────────────────
  80  |   test("R-04: localStorage 데이터 없으면 에러 메시지가 표시된다", async ({
  81  |     page,
  82  |   }) => {
  83  |     // 데이터 없이 바로 결과 페이지 접근
  84  |     await page.goto("/result/nonexistent-session-9999");
  85  |     await expect(page.locator("text=결과를 찾을 수 없어")).toBeVisible({
  86  |       timeout: 8000,
  87  |     });
  88  |     // 홈으로 돌아가기 링크 확인
  89  |     await expect(page.locator("text=처음으로 돌아가기")).toBeVisible();
  90  |   });
  91  | 
  92  |   // ── R-05: 잘못된 session_id → 에러 상태 ─────────────────────────────
  93  |   test("R-05: 다른 session_id의 데이터가 있어도 올바른 키가 없으면 에러", async ({
  94  |     page,
  95  |   }) => {
  96  |     // 다른 session_id로 데이터 저장
  97  |     await page.goto("/");
  98  |     await page.evaluate(() => {
  99  |       localStorage.setItem(
  100 |         "veil_analysis_other-session",
  101 |         JSON.stringify({ session_id: "other-session", content_id: "love-1" }),
  102 |       );
  103 |     });
  104 |     // 다른 session_id로 접근
  105 |     await page.goto("/result/wrong-session-id-abc");
  106 |     await expect(page.locator("text=결과를 찾을 수 없어")).toBeVisible({
  107 |       timeout: 8000,
  108 |     });
  109 |   });
  110 | 
  111 |   // ── R-06: 무료 씬 전체 메시지 노출 ──────────────────────────────────
  112 |   test("R-06: 무료 씬은 scene-messages(전체 내용)가 렌더링된다", async ({
  113 |     page,
  114 |   }) => {
  115 |     await gotoResultWithData(page);
  116 |     await waitForScenes(page);
  117 | 
  118 |     // 무료 씬의 scene-messages 확인 (2개 무료 씬)
  119 |     const freeMessages = page.locator("[data-testid='scene-messages']");
  120 |     await expect(freeMessages).toHaveCount(FREE_SCENE_COUNT);
```