# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: integration.spec.ts >> 통합 E2E 시나리오 >> E2E-06: 결과 페이지 → 홈으로 이동 → 재접근 시 데이터 유지됨
- Location: tests/e2e/integration.spec.ts:248:3

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
  1   | import { test, expect, Page, devices } from "@playwright/test";
  2   | 
  3   | // ── 통합 테스트 타임아웃 (분석 흐름 포함 최대 60s) ───────────────────
  4   | test.setTimeout(60000);
  5   | 
  6   | // ── 상수 ─────────────────────────────────────────────────────────────
  7   | const CONTENT_ID = "love-1";
  8   | const SESSION_ID = "e2e-integ-001";
  9   | const PAID_SCENE_COUNT = 4;
  10  | const TOTAL_SCENE_COUNT = 6;
  11  | const FREE_SCENE_COUNT = 2;
  12  | 
  13  | // ── Helper: localStorage에 분석 데이터 설정 ──────────────────────────
  14  | const setupAnalysis = async (
  15  |   page: Page,
  16  |   sessionId: string = SESSION_ID,
  17  |   contentId: string = CONTENT_ID,
  18  | ) => {
> 19  |   await page.goto("/");
      |              ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  20  |   await page.evaluate(
  21  |     ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
  22  |     {
  23  |       key: `veil_analysis_${sessionId}`,
  24  |       value: {
  25  |         session_id: sessionId,
  26  |         content_id: contentId,
  27  |         free_input: "통합 테스트 입력",
  28  |         answers: [],
  29  |         created_at: new Date().toISOString(),
  30  |       },
  31  |     },
  32  |   );
  33  | };
  34  | 
  35  | // ── Helper: 결과 페이지 이동 (씬 렌더링 대기 포함) ─────────────────────
  36  | const gotoResult = async (
  37  |   page: Page,
  38  |   sessionId: string = SESSION_ID,
  39  |   queryString = "",
  40  | ) => {
  41  |   await setupAnalysis(page, sessionId);
  42  |   await page.goto(`/result/${sessionId}${queryString}`);
  43  |   await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
  44  | };
  45  | 
  46  | // ── Helper: 분석 흐름 완료 (textarea 입력 → 보정 질문 → 완료) ──────────
  47  | const completeAnalyzeFlow = async (page: Page) => {
  48  |   await page.locator("textarea").fill(
  49  |     "자꾸 상대가 의심되고, 확인하면 안 되는 걸 알면서도 휴대폰을 확인하게 돼",
  50  |   );
  51  |   await page.locator('button:has-text("이어서")').click();
  52  | 
  53  |   // 반응 버블(4000ms) → 보정 질문으로 전환 대기
  54  |   const optionBtns = page.locator("div.space-y-2 button");
  55  |   await expect(optionBtns.first()).toBeVisible({ timeout: 8000 });
  56  | 
  57  |   // 최대 8회 반복으로 모든 보정 질문 답변
  58  |   for (let i = 0; i < 8; i++) {
  59  |     const completing = page.locator('h1:has-text("모든 질문이 끝났어")');
  60  |     if (await completing.isVisible({ timeout: 300 })) break;
  61  | 
  62  |     const btn = optionBtns.first();
  63  |     if (!(await btn.isVisible({ timeout: 2000 }))) break;
  64  | 
  65  |     await btn.click();
  66  |     const next = page
  67  |       .locator('button:has-text("다음"), button:has-text("완료")')
  68  |       .last();
  69  |     await expect(next).not.toBeDisabled({ timeout: 1500 });
  70  |     await next.click();
  71  |     await page.waitForTimeout(350);
  72  |   }
  73  | 
  74  |   // 분석 완료 → /result/ 리다이렉트 대기
  75  |   await page.waitForURL(/\/result\//, { timeout: 15000 });
  76  |   await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
  77  | };
  78  | 
  79  | // ── Helper: Google 소셜 로그인 mock ─────────────────────────────────
  80  | const loginWithGoogle = async (page: Page) => {
  81  |   await page.goto("/");
  82  |   await page.evaluate(() => {
  83  |     localStorage.removeItem("veil_user_id");
  84  |     sessionStorage.removeItem("redirect_to");
  85  |   });
  86  |   await page.goto("/auth");
  87  |   await expect(
  88  |     page.getByRole("button", { name: /Google로 계속하기/ }),
  89  |   ).toBeVisible({ timeout: 5000 });
  90  |   await Promise.all([
  91  |     page.waitForURL(/\/$/, { timeout: 8000 }),
  92  |     page.getByRole("button", { name: /Google로 계속하기/ }).click(),
  93  |   ]);
  94  | };
  95  | 
  96  | // ── Helper: 비회원 인증 (phone/PIN) ──────────────────────────────────
  97  | const authenticateAsGuest = async (page: Page) => {
  98  |   await page.goto("/");
  99  |   await page.goto("/guest");
  100 |   const phoneInput = page.locator('input[type="tel"]');
  101 |   await expect(phoneInput).toBeVisible({ timeout: 5000 });
  102 |   await phoneInput.fill("010-1234-5678");
  103 | 
  104 |   const pinInput = page.locator('input[type="password"]');
  105 |   await pinInput.fill("1234");
  106 | 
  107 |   const confirmBtn = page.getByRole("button", { name: "확인" });
  108 |   await expect(confirmBtn).not.toBeDisabled({ timeout: 2000 });
  109 |   await confirmBtn.click();
  110 | 
  111 |   // Step 2: 세션 목록 표시 대기
  112 |   await expect(
  113 |     page.locator("[data-testid='guest-session-item']").first(),
  114 |   ).toBeVisible({ timeout: 5000 });
  115 | };
  116 | 
  117 | // ─────────────────────────────────────────────────────────────────────
  118 | test.describe("통합 E2E 시나리오", () => {
  119 |   // ── E2E-01: 신규 비회원 전체 플로우 ──────────────────────────────────
```