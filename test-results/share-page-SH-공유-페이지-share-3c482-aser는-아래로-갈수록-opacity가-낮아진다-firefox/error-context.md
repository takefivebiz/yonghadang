# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: share-page.spec.ts >> SH: 공유 페이지 (/share/[share_id]) >> SH-08: 유료 씬 teaser는 아래로 갈수록 opacity가 낮아진다
- Location: tests/e2e/share-page.spec.ts:136:3

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

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
  3   | // ── 상수 ──────────────────────────────────────────────────────────────
  4   | const SHARE_ID = "test-share-page-sh01";
  5   | const CONTENT_ID = "love-1";
  6   | 
  7   | // love-1: 무료 2개, 유료 4개
  8   | const FREE_SCENE_COUNT = 2;
  9   | const PAID_TEASER_COUNT = 4;
  10  | 
  11  | // ── Helper: localStorage 세팅 후 공유 페이지 이동 (권한 없는 상태) ──────
  12  | const gotoShareWithData = async (
  13  |   page: Page,
  14  |   shareId = SHARE_ID,
  15  |   contentId = CONTENT_ID,
  16  | ) => {
> 17  |   await page.goto("/");
      |              ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  18  |   // veil_user_id, guest_id 없는 순수 비권한 상태 보장
  19  |   await page.evaluate(() => {
  20  |     localStorage.removeItem("veil_user_id");
  21  |     sessionStorage.removeItem("guest_id");
  22  |   });
  23  |   await page.evaluate(
  24  |     ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
  25  |     {
  26  |       key: `veil_analysis_${shareId}`,
  27  |       value: {
  28  |         session_id: shareId,
  29  |         content_id: contentId,
  30  |         free_input: "테스트 입력",
  31  |         answers: [],
  32  |         created_at: new Date().toISOString(),
  33  |       },
  34  |     },
  35  |   );
  36  |   await page.goto(`/share/${shareId}`);
  37  |   // 로딩 스피너가 사라질 때까지 대기 (loading=false 시점)
  38  |   await expect(page.locator(".animate-spin")).not.toBeVisible({ timeout: 8000 });
  39  | };
  40  | 
  41  | // ─────────────────────────────────────────────────────────────────────────
  42  | test.describe("SH: 공유 페이지 (/share/[share_id])", () => {
  43  |   // ── SH-01: 유효한 share_id → 씬 렌더링 ──────────────────────────────
  44  |   test("SH-01: 유효한 share_id 접근 시 콘텐츠가 렌더링된다", async ({
  45  |     page,
  46  |   }) => {
  47  |     await gotoShareWithData(page);
  48  |     // 무료 씬 제목(h2)이 최소 1개 이상 보임
  49  |     await expect(page.locator("h2").first()).toBeVisible();
  50  |   });
  51  | 
  52  |   // ── SH-02: localStorage 데이터 없음 → 에러 ──────────────────────────
  53  |   test("SH-02: localStorage 데이터 없으면 에러 메시지가 표시된다", async ({
  54  |     page,
  55  |   }) => {
  56  |     await page.goto("/share/nonexistent-share-id-9999");
  57  |     await expect(
  58  |       page.locator("text=공유된 결과를 찾을 수 없어"),
  59  |     ).toBeVisible({ timeout: 8000 });
  60  |     await expect(page.locator("text=처음으로 돌아가기")).toBeVisible();
  61  |   });
  62  | 
  63  |   // ── SH-03: 잘못된 share_id → 에러 ────────────────────────────────────
  64  |   test("SH-03: 잘못된 share_id 접근 시 에러 메시지가 표시된다", async ({
  65  |     page,
  66  |   }) => {
  67  |     // 다른 share_id 데이터는 있어도 요청한 share_id가 없으면 에러
  68  |     await page.goto("/");
  69  |     await page.evaluate(() => {
  70  |       localStorage.setItem(
  71  |         "veil_analysis_other-id",
  72  |         JSON.stringify({ session_id: "other-id", content_id: "love-1" }),
  73  |       );
  74  |     });
  75  |     await page.goto("/share/wrong-share-id-xyz");
  76  |     await expect(
  77  |       page.locator("text=공유된 결과를 찾을 수 없어"),
  78  |     ).toBeVisible({ timeout: 8000 });
  79  |   });
  80  | 
  81  |   // ── SH-04: 로딩 완료 후 스피너 사라짐 ────────────────────────────────
  82  |   test("SH-04: 로딩 완료 후 스피너가 사라지고 콘텐츠가 나타난다", async ({
  83  |     page,
  84  |   }) => {
  85  |     await gotoShareWithData(page);
  86  |     await expect(page.locator(".animate-spin")).not.toBeVisible({
  87  |       timeout: 8000,
  88  |     });
  89  |     await expect(page.locator("main").first()).toBeVisible();
  90  |   });
  91  | 
  92  |   // ── SH-05: 썸네일 / 제목 / 부제 렌더링 ────────────────────────────────
  93  |   test("SH-05: 콘텐츠 썸네일·제목(h1)·부제(subtitle)가 렌더링된다", async ({
  94  |     page,
  95  |   }) => {
  96  |     await gotoShareWithData(page);
  97  | 
  98  |     // h1 제목
  99  |     const h1 = page.locator("h1");
  100 |     await expect(h1).toBeVisible();
  101 |     await expect(h1).toContainText("사랑");
  102 | 
  103 |     // 부제 — subtitle 텍스트 확인
  104 |     await expect(page.locator("text=집착인지 아닌지 판단하는 기준")).toBeVisible();
  105 | 
  106 |     // 썸네일 img (Next.js Image)
  107 |     await expect(page.locator("img[alt]").first()).toBeVisible();
  108 |   });
  109 | 
  110 |   // ── SH-06: 무료 씬 전체 노출 ─────────────────────────────────────────
  111 |   test("SH-06: 무료 씬은 전체 내용(scene-messages)이 렌더링된다", async ({
  112 |     page,
  113 |   }) => {
  114 |     await gotoShareWithData(page);
  115 | 
  116 |     const freeMessages = page.locator("[data-testid='scene-messages']");
  117 |     await expect(freeMessages).toHaveCount(FREE_SCENE_COUNT);
```