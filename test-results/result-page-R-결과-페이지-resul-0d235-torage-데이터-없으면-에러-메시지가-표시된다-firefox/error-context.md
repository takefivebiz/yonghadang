# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: result-page.spec.ts >> R: 결과 페이지 (/result/[session_id]) >> R-04: localStorage 데이터 없으면 에러 메시지가 표시된다
- Location: tests/e2e/result-page.spec.ts:80:3

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:3000/result/nonexistent-session-9999", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - heading "Unable to connect" [level=1] [ref=e5]
    - paragraph [ref=e6]: Firefox can’t establish a connection to the server at localhost:3000.
    - paragraph
    - list [ref=e8]:
      - listitem [ref=e9]: The site could be temporarily unavailable or too busy. Try again in a few moments.
      - listitem [ref=e10]: If you are unable to load any pages, check your computer’s network connection.
      - listitem [ref=e11]: If your computer or network is protected by a firewall or proxy, make sure that Nightly is permitted to access the web.
      - listitem [ref=e12]: If you are trying to load a local network page, please check that Nightly has been granted Local Network permissions in the macOS Privacy & Security settings.
  - button "Try Again" [active] [ref=e14]
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
  20  |   await page.goto("/");
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
> 84  |     await page.goto("/result/nonexistent-session-9999");
      |                ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
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
  121 |     await expect(freeMessages.first()).toBeVisible();
  122 |   });
  123 | 
  124 |   // ── R-07: 무료 씬 배지 표시 ─────────────────────────────────────────
  125 |   test("R-07: scene_index !== 2 인 무료 씬에 '무료' 배지가 표시된다", async ({
  126 |     page,
  127 |   }) => {
  128 |     await gotoResultWithData(page);
  129 |     await waitForScenes(page);
  130 | 
  131 |     // love-1: scene_index=1만 "무료" 배지 표시 (scene_index=2는 제외)
  132 |     const freeBadge = page.locator("text=무료");
  133 |     await expect(freeBadge).toBeVisible();
  134 |     // 배지 개수는 1개 (scene_index=2는 배지 없음)
  135 |     await expect(freeBadge).toHaveCount(1);
  136 |   });
  137 | 
  138 |   // ── R-08: 유료 씬 preview 메시지 노출 ───────────────────────────────
  139 |   test("R-08: 유료(잠긴) 씬은 preview 메시지가 렌더링된다", async ({
  140 |     page,
  141 |   }) => {
  142 |     await gotoResultWithData(page);
  143 |     await waitForScenes(page);
  144 | 
  145 |     // preview 컨테이너 개수 = 유료 씬 수
  146 |     const previewContainers = page.locator(
  147 |       "[data-testid='scene-preview-messages']",
  148 |     );
  149 |     await expect(previewContainers).toHaveCount(PAID_SCENE_COUNT);
  150 |     await expect(previewContainers.first()).toBeVisible();
  151 |   });
  152 | 
  153 |   // ── R-09: 유료 씬 blur/fade 효과 확인 ──────────────────────────────
  154 |   test("R-09: 유료 씬 preview 메시지는 blur 스타일이 적용된다", async ({
  155 |     page,
  156 |   }) => {
  157 |     await gotoResultWithData(page);
  158 |     await waitForScenes(page);
  159 | 
  160 |     // 첫 번째 preview 내부의 메시지 div에 blur 스타일 확인
  161 |     const previewContainer = page
  162 |       .locator("[data-testid='scene-preview-messages']")
  163 |       .first();
  164 |     // preview 내부의 자식 div (blur가 적용된 메시지 래퍼)
  165 |     const blurredMsg = previewContainer.locator("> div").first();
  166 |     const style = await blurredMsg.getAttribute("style");
  167 |     expect(style).toContain("blur");
  168 |   });
  169 | 
  170 |   // ── R-10: 유료 씬 lock CTA 버튼 존재 ────────────────────────────────
  171 |   test("R-10: 유료(잠긴) 씬에 '이 흐름만 열기' 버튼이 표시된다", async ({
  172 |     page,
  173 |   }) => {
  174 |     await gotoResultWithData(page);
  175 |     await waitForScenes(page);
  176 | 
  177 |     const unlockBtns = page.locator("[data-testid='scene-unlock-btn']");
  178 |     await expect(unlockBtns).toHaveCount(PAID_SCENE_COUNT);
  179 |     await expect(unlockBtns.first()).toBeVisible();
  180 |     // 버튼 내 텍스트 확인
  181 |     await expect(page.locator("text=이 흐름만 열기").first()).toBeVisible();
  182 |   });
  183 | 
  184 |   // ── R-11: ProgressIndicator dot 개수 ────────────────────────────────
```