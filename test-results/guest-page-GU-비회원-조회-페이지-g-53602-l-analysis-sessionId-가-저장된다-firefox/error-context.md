# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: guest-page.spec.ts >> GU: 비회원 조회 페이지 (/guest) >> GU-15: 세션 클릭 시 localStorage에 veil_analysis_{sessionId}가 저장된다
- Location: tests/e2e/guest-page.spec.ts:201:3

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
  4   | const VALID_PHONE = "010-1234-5678";
  5   | const VALID_PIN = "1234";
  6   | const VALID_PHONE_DIGITS = "01012345678"; // 포맷팅 전 raw 숫자
  7   | const INVALID_PHONE = "010-9999-9999";
  8   | const INVALID_PIN = "0000";
  9   | 
  10  | const GUEST_ID = "guest-1";
  11  | const SESSION_1_ID = "session-guest-1";
  12  | 
  13  | // ── Helper: /guest 이동 + Step 1 렌더링 대기 + sessionStorage 초기화 ──
  14  | const gotoGuest = async (page: Page) => {
> 15  |   await page.goto("/");
      |              ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  16  |   await page.evaluate(() => {
  17  |     sessionStorage.removeItem("guest_id");
  18  |     sessionStorage.removeItem("guest_sessions");
  19  |     sessionStorage.removeItem("guest_token");
  20  |     sessionStorage.removeItem("redirect_to");
  21  |     localStorage.removeItem("veil_user_id");
  22  |   });
  23  |   await page.goto("/guest");
  24  |   await expect(page.locator('input[type="tel"]')).toBeVisible({ timeout: 5000 });
  25  | };
  26  | 
  27  | // ── Helper: Step 1 인증 완료 후 Step 2 도달 ──────────────────────────
  28  | const verifyAndReachStep2 = async (page: Page) => {
  29  |   await gotoGuest(page);
  30  |   await page.locator('input[type="tel"]').fill(VALID_PHONE);
  31  |   await page.locator('input[type="password"]').fill(VALID_PIN);
  32  |   await page.getByRole("button", { name: "확인" }).click();
  33  |   // 300ms fade 전환 후 Step 2 렌더링 대기
  34  |   await expect(page.locator("h2")).toContainText("지난 기록", { timeout: 3000 });
  35  | };
  36  | 
  37  | // ─────────────────────────────────────────────────────────────────────────
  38  | test.describe("GU: 비회원 조회 페이지 (/guest)", () => {
  39  |   // ── GU-01: 전화번호 입력 필드 렌더링 ────────────────────────────────
  40  |   test("GU-01: 전화번호 입력 필드가 렌더링된다", async ({ page }) => {
  41  |     await gotoGuest(page);
  42  |     const phoneInput = page.locator('input[type="tel"]');
  43  |     await expect(phoneInput).toBeVisible();
  44  |     await expect(phoneInput).toBeEnabled();
  45  |     await expect(phoneInput).toHaveAttribute("placeholder", "010-0000-0000");
  46  |   });
  47  | 
  48  |   // ── GU-02: PIN 입력 필드 렌더링 ─────────────────────────────────────
  49  |   test("GU-02: PIN(비밀번호) 입력 필드가 렌더링된다", async ({ page }) => {
  50  |     await gotoGuest(page);
  51  |     const pinInput = page.locator('input[type="password"]');
  52  |     await expect(pinInput).toBeVisible();
  53  |     await expect(pinInput).toBeEnabled();
  54  |     await expect(pinInput).toHaveAttribute("maxlength", "4");
  55  |   });
  56  | 
  57  |   // ── GU-03: 전화번호 자동 포맷팅 ─────────────────────────────────────
  58  |   test("GU-03: 전화번호 입력 시 010-XXXX-XXXX 형식으로 자동 포맷팅된다", async ({
  59  |     page,
  60  |   }) => {
  61  |     await gotoGuest(page);
  62  |     const phoneInput = page.locator('input[type="tel"]');
  63  |     await phoneInput.fill(VALID_PHONE_DIGITS);
  64  |     await expect(phoneInput).toHaveValue(VALID_PHONE);
  65  |   });
  66  | 
  67  |   // ── GU-04: PIN 숫자 전용·4자리 제한 ─────────────────────────────────
  68  |   test("GU-04: PIN 입력은 숫자만 허용되고 최대 4자리까지만 입력된다", async ({
  69  |     page,
  70  |   }) => {
  71  |     await gotoGuest(page);
  72  |     const pinInput = page.locator('input[type="password"]');
  73  |     // 5자리 숫자 입력 → 최대 4자리만 남아야 함
  74  |     await pinInput.fill("99999");
  75  |     const value = await pinInput.inputValue();
  76  |     expect(value).toMatch(/^\d{1,4}$/);
  77  |     expect(value.length).toBeLessThanOrEqual(4);
  78  |   });
  79  | 
  80  |   // ── GU-05: 전화번호·PIN 모두 미입력 → 확인 버튼 비활성 ─────────────
  81  |   test("GU-05: 전화번호와 PIN 모두 미입력 시 확인 버튼이 비활성이다", async ({
  82  |     page,
  83  |   }) => {
  84  |     await gotoGuest(page);
  85  |     await expect(page.getByRole("button", { name: "확인" })).toBeDisabled();
  86  |   });
  87  | 
  88  |   // ── GU-06: 전화번호만 입력, PIN 없음 → 확인 버튼 비활성 ────────────
  89  |   test("GU-06: 전화번호만 입력하고 PIN 없을 시 확인 버튼이 비활성이다", async ({
  90  |     page,
  91  |   }) => {
  92  |     await gotoGuest(page);
  93  |     await page.locator('input[type="tel"]').fill(VALID_PHONE);
  94  |     await expect(page.getByRole("button", { name: "확인" })).toBeDisabled();
  95  |   });
  96  | 
  97  |   // ── GU-07: PIN만 입력, 전화번호 없음 → 확인 버튼 비활성 ────────────
  98  |   test("GU-07: PIN만 입력하고 전화번호 없을 시 확인 버튼이 비활성이다", async ({
  99  |     page,
  100 |   }) => {
  101 |     await gotoGuest(page);
  102 |     await page.locator('input[type="password"]').fill(VALID_PIN);
  103 |     await expect(page.getByRole("button", { name: "확인" })).toBeDisabled();
  104 |   });
  105 | 
  106 |   // ── GU-08: 전화번호 형식 불완전 + PIN → 확인 버튼 비활성 ────────────
  107 |   test("GU-08: 전화번호 형식이 불완전할 때 확인 버튼이 비활성이다", async ({
  108 |     page,
  109 |   }) => {
  110 |     await gotoGuest(page);
  111 |     // 7자리만 입력 → 010-1234 형식 (010-\d{4}-\d{4} 불만족)
  112 |     await page.locator('input[type="tel"]').fill("010-1234");
  113 |     await page.locator('input[type="password"]').fill(VALID_PIN);
  114 |     await expect(page.getByRole("button", { name: "확인" })).toBeDisabled();
  115 |   });
```