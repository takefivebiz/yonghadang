# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: result-share.spec.ts >> R-30~34: 결과 페이지 공유 기능 (/result/[session_id]) >> R-30: 카카오 / X / 링크복사 공유 버튼이 렌더링된다
- Location: tests/e2e/result-share.spec.ts:95:3

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
  4   | const SESSION_ID = "test-share-session-r30";
  5   | const CONTENT_ID = "love-1";
  6   | 
  7   | // 실제 base URL은 env에 따라 다를 수 있으므로 패턴 기반으로 검증
  8   | // /share/${SESSION_ID} 포함 여부 + /result/ 미포함 여부로 판단
  9   | const SHARE_PATH = `/share/${SESSION_ID}`;
  10  | 
  11  | // ── Helper: localStorage 세팅 후 결과 페이지 이동 ──────────────────────
  12  | const gotoResultWithData = async (
  13  |   page: Page,
  14  |   sessionId = SESSION_ID,
  15  |   contentId = CONTENT_ID,
  16  | ) => {
> 17  |   await page.goto("/");
      |              ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  18  |   await page.evaluate(
  19  |     ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
  20  |     {
  21  |       key: `veil_analysis_${sessionId}`,
  22  |       value: {
  23  |         session_id: sessionId,
  24  |         content_id: contentId,
  25  |         free_input: "테스트 입력",
  26  |         answers: [],
  27  |         created_at: new Date().toISOString(),
  28  |       },
  29  |     },
  30  |   );
  31  |   await page.goto(`/result/${sessionId}`);
  32  |   // 씬 렌더링 완료 대기
  33  |   await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
  34  | };
  35  | 
  36  | /**
  37  |  * window.open을 가로채 호출된 URL을 기록하는 spy를 페이지에 주입.
  38  |  * 실제 창이 열리지 않으므로 외부 연결 없이 URL만 검증 가능.
  39  |  */
  40  | const injectWindowOpenSpy = async (page: Page) => {
  41  |   await page.evaluate(() => {
  42  |     (window as unknown as Record<string, unknown>)._openedUrls = [];
  43  |     window.open = (
  44  |       url?: string | URL,
  45  |       ...rest: Parameters<typeof window.open>
  46  |     ) => {
  47  |       (
  48  |         (window as unknown as Record<string, unknown>)
  49  |           ._openedUrls as string[]
  50  |       ).push((url ?? "").toString());
  51  |       void rest; // unused
  52  |       return null;
  53  |     };
  54  |   });
  55  | };
  56  | 
  57  | /** spy가 캡처한 URL 목록 반환 */
  58  | const getOpenedUrls = (page: Page): Promise<string[]> =>
  59  |   page.evaluate(
  60  |     () =>
  61  |       (window as unknown as Record<string, unknown>)._openedUrls as string[],
  62  |   );
  63  | 
  64  | /**
  65  |  * navigator.clipboard.writeText 를 mock 처리해 복사된 텍스트를 캡처.
  66  |  * 헤드리스 환경에서 clipboard API 권한 없이도 동작함.
  67  |  */
  68  | const injectClipboardMock = async (page: Page) => {
  69  |   await page.evaluate(() => {
  70  |     (window as unknown as Record<string, unknown>)._clipboardText = "";
  71  |     // clipboard는 getter이므로 defineProperty로 override
  72  |     Object.defineProperty(navigator, "clipboard", {
  73  |       value: {
  74  |         writeText: async (text: string) => {
  75  |           (
  76  |             window as unknown as Record<string, unknown>
  77  |           )._clipboardText = text;
  78  |         },
  79  |       },
  80  |       configurable: true,
  81  |       writable: true,
  82  |     });
  83  |   });
  84  | };
  85  | 
  86  | const getClipboardText = (page: Page): Promise<string> =>
  87  |   page.evaluate(
  88  |     () =>
  89  |       (window as unknown as Record<string, unknown>)._clipboardText as string,
  90  |   );
  91  | 
  92  | // ─────────────────────────────────────────────────────────────────────────
  93  | test.describe("R-30~34: 결과 페이지 공유 기능 (/result/[session_id])", () => {
  94  |   // ── R-30: 공유 버튼 3개 렌더링 확인 ─────────────────────────────────
  95  |   test("R-30: 카카오 / X / 링크복사 공유 버튼이 렌더링된다", async ({
  96  |     page,
  97  |   }) => {
  98  |     await gotoResultWithData(page);
  99  | 
  100 |     // 페이지 하단까지 스크롤해 공유 버튼 영역 노출
  101 |     await page.locator("[data-testid='share-btn-kakao']").scrollIntoViewIfNeeded();
  102 | 
  103 |     await expect(page.locator("[data-testid='share-btn-kakao']")).toBeVisible();
  104 |     await expect(page.locator("[data-testid='share-btn-x']")).toBeVisible();
  105 |     await expect(page.locator("[data-testid='share-btn-copy']")).toBeVisible();
  106 |     await expect(page.locator("[data-testid='other-contents-link']")).toBeVisible();
  107 |   });
  108 | 
  109 |   // ── R-31: 링크 복사 → 클립보드 URL 확인 + toast 표시 ────────────────
  110 |   test("R-31: 링크 복사 버튼 클릭 시 shareUrl이 클립보드에 복사되고 toast가 표시된다", async ({
  111 |     page,
  112 |   }) => {
  113 |     await gotoResultWithData(page);
  114 |     await injectClipboardMock(page);
  115 | 
  116 |     const copyBtn = page.locator("[data-testid='share-btn-copy']");
  117 |     await copyBtn.scrollIntoViewIfNeeded();
```