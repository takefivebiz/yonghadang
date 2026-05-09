# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-page.spec.ts >> AU: 로그인 페이지 (/auth) >> AU-03: Google 버튼 클릭 시 veil_user_id·veil_user_provider가 localStorage에 저장된다
- Location: tests/e2e/auth-page.spec.ts:39:3

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
  3   | // ── Helper: /auth 로 이동하면서 이전 auth 관련 state 초기화 ─────────────
  4   | const gotoAuth = async (page: Page) => {
> 5   |   await page.goto("/");
      |              ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  6   |   await page.evaluate(() => {
  7   |     localStorage.removeItem("veil_user_id");
  8   |     localStorage.removeItem("veil_user_provider");
  9   |     sessionStorage.removeItem("redirect_to");
  10  |   });
  11  |   await page.goto("/auth");
  12  |   // 버튼 렌더링 완료 대기
  13  |   await expect(
  14  |     page.getByRole("button", { name: /Google로 계속하기/ }),
  15  |   ).toBeVisible({ timeout: 5000 });
  16  | };
  17  | 
  18  | // ─────────────────────────────────────────────────────────────────────────
  19  | test.describe("AU: 로그인 페이지 (/auth)", () => {
  20  |   // ── AU-01: Google 버튼 렌더링 ─────────────────────────────────────────
  21  |   test("AU-01: Google 로그인 버튼이 렌더링된다", async ({ page }) => {
  22  |     await page.goto("/auth");
  23  | 
  24  |     const btn = page.getByRole("button", { name: /Google로 계속하기/ });
  25  |     await expect(btn).toBeVisible();
  26  |     await expect(btn).toBeEnabled();
  27  |   });
  28  | 
  29  |   // ── AU-02: Kakao 버튼 렌더링 ─────────────────────────────────────────
  30  |   test("AU-02: Kakao 로그인 버튼이 렌더링된다", async ({ page }) => {
  31  |     await page.goto("/auth");
  32  | 
  33  |     const btn = page.getByRole("button", { name: /Kakao로 계속하기/ });
  34  |     await expect(btn).toBeVisible();
  35  |     await expect(btn).toBeEnabled();
  36  |   });
  37  | 
  38  |   // ── AU-03: Google 클릭 → localStorage 설정 ────────────────────────────
  39  |   test("AU-03: Google 버튼 클릭 시 veil_user_id·veil_user_provider가 localStorage에 저장된다", async ({
  40  |     page,
  41  |   }) => {
  42  |     await gotoAuth(page);
  43  | 
  44  |     // 내비게이션이 완료된 후 localStorage 확인
  45  |     await Promise.all([
  46  |       page.waitForURL(/\/$/, { timeout: 5000 }),
  47  |       page.getByRole("button", { name: /Google로 계속하기/ }).click(),
  48  |     ]);
  49  | 
  50  |     const userId = await page.evaluate(() =>
  51  |       localStorage.getItem("veil_user_id"),
  52  |     );
  53  |     const provider = await page.evaluate(() =>
  54  |       localStorage.getItem("veil_user_provider"),
  55  |     );
  56  | 
  57  |     expect(userId).toBe("user-1");
  58  |     expect(provider).toBe("google");
  59  |   });
  60  | 
  61  |   // ── AU-04: Kakao 클릭 → localStorage 설정 ─────────────────────────────
  62  |   test("AU-04: Kakao 버튼 클릭 시 veil_user_id·veil_user_provider가 localStorage에 저장된다", async ({
  63  |     page,
  64  |   }) => {
  65  |     await gotoAuth(page);
  66  | 
  67  |     await Promise.all([
  68  |       page.waitForURL(/\/$/, { timeout: 5000 }),
  69  |       page.getByRole("button", { name: /Kakao로 계속하기/ }).click(),
  70  |     ]);
  71  | 
  72  |     const userId = await page.evaluate(() =>
  73  |       localStorage.getItem("veil_user_id"),
  74  |     );
  75  |     const provider = await page.evaluate(() =>
  76  |       localStorage.getItem("veil_user_provider"),
  77  |     );
  78  | 
  79  |     expect(userId).toBe("user-1");
  80  |     expect(provider).toBe("kakao");
  81  |   });
  82  | 
  83  |   // ── AU-05: redirect_to 없을 때 → "/" 이동 ─────────────────────────────
  84  |   test("AU-05: sessionStorage에 redirect_to 없으면 로그인 후 홈(/)으로 이동한다", async ({
  85  |     page,
  86  |   }) => {
  87  |     await gotoAuth(page); // redirect_to가 없는 상태
  88  | 
  89  |     await Promise.all([
  90  |       page.waitForURL(/\/$/, { timeout: 5000 }),
  91  |       page.getByRole("button", { name: /Google로 계속하기/ }).click(),
  92  |     ]);
  93  | 
  94  |     expect(page.url()).toMatch(/localhost:3000\/$/);
  95  |   });
  96  | 
  97  |   // ── AU-06: redirect_to 있을 때 → redirect_to URL로 이동 ───────────────
  98  |   test("AU-06: sessionStorage에 redirect_to가 있으면 로그인 후 해당 URL로 이동한다", async ({
  99  |     page,
  100 |   }) => {
  101 |     const REDIRECT_TARGET = "http://localhost:3000/share/test-au06-share";
  102 | 
  103 |     await gotoAuth(page);
  104 |     // 로그인 직전 sessionStorage에 redirect_to 설정
  105 |     await page.evaluate((url) => {
```