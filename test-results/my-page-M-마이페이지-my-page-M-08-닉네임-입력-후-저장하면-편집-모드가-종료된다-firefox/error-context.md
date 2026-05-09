# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: my-page.spec.ts >> M: 마이페이지 (/my-page) >> M-08: 닉네임 입력 후 저장하면 편집 모드가 종료된다
- Location: tests/e2e/my-page.spec.ts:109:3

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
  4   | const USER_ID = "user-1";
  5   | const USER_NICKNAME = "jane_lee";
  6   | const USER_EMAIL = "jane@example.com";
  7   | const USER_PROVIDER = "google";
  8   | 
  9   | const SESSION_1_ID = "session-1";
  10  | const SESSION_2_ID = "session-2";
  11  | 
  12  | // ── Helper: /my-page로 이동하고 로그인 상태 설정 ──────────────────────
  13  | const gotoMyPage = async (page: Page) => {
> 14  |   await page.goto("/");
      |              ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  15  |   // 로그인 상태 설정
  16  |   await page.evaluate((userId) => {
  17  |     localStorage.setItem("veil_user_id", userId);
  18  |   }, USER_ID);
  19  |   await page.goto("/my-page");
  20  |   // 프로필 섹션 렌더링 대기
  21  |   await expect(page.locator("h1")).toContainText("마이페이지");
  22  | };
  23  | 
  24  | // ─────────────────────────────────────────────────────────────────────────
  25  | test.describe("M: 마이페이지 (/my-page)", () => {
  26  |   // ── M-01: 로그인 상태 마이페이지 접근 ────────────────────────────────
  27  |   test("M-01: 로그인 상태에서 마이페이지가 로드되고 프로필이 렌더링된다", async ({
  28  |     page,
  29  |   }) => {
  30  |     await gotoMyPage(page);
  31  |     // 헤더, 프로필, 지난 기록 섹션이 모두 보임
  32  |     await expect(page.locator("h1")).toContainText("마이페이지");
  33  |     // 지난 기록 섹션 제목 (exact match)
  34  |     await expect(
  35  |       page.locator("p.text-base.font-semibold").filter({ hasText: "지난 기록" }),
  36  |     ).toBeVisible();
  37  |     await expect(page.getByRole("button", { name: "계정 관리" })).toBeVisible();
  38  |   });
  39  | 
  40  |   // ── M-02: 프로필 정보 표시 (닉네임) ────────────────────────────────
  41  |   test("M-02: 프로필 섹션에 닉네임이 표시된다", async ({ page }) => {
  42  |     await gotoMyPage(page);
  43  |     await expect(page.locator("text=jane_lee")).toBeVisible();
  44  |   });
  45  | 
  46  |   // ── M-03: 소셜 로그인 정보 표시 (provider icon) ───────────────────
  47  |   test("M-03: 소셜 로그인 아이콘이 표시된다 (Google = G)", async ({
  48  |     page,
  49  |   }) => {
  50  |     await gotoMyPage(page);
  51  |     // 프로필 섹션의 아이콘 확인 (rounded-full + text-base로 타게팅)
  52  |     const profileIcon = page.locator("div[class*='rounded-full'][class*='font-bold']");
  53  |     await expect(profileIcon.first()).toContainText("G");
  54  |   });
  55  | 
  56  |   // ── M-04: 이메일 표시 ─────────────────────────────────────────────
  57  |   test("M-04: 프로필 섹션에 이메일이 표시된다", async ({ page }) => {
  58  |     await gotoMyPage(page);
  59  |     await expect(page.locator("text=jane@example.com")).toBeVisible();
  60  |   });
  61  | 
  62  |   // ── M-05: "수정" 버튼 → 닉네임 편집 모드 ───────────────────────────
  63  |   test("M-05: '수정' 버튼 클릭 시 닉네임 편집 모드로 전환된다", async ({
  64  |     page,
  65  |   }) => {
  66  |     await gotoMyPage(page);
  67  |     await page.getByRole("button", { name: "수정" }).click();
  68  |     // 편집 모드: 입력 필드 + 저장/취소 버튼
  69  |     await expect(page.locator('input[type="text"]')).toBeVisible();
  70  |     await expect(page.getByRole("button", { name: "저장" })).toBeVisible();
  71  |     await expect(page.getByRole("button", { name: "취소" })).toBeVisible();
  72  |     // "수정" 버튼은 사라짐
  73  |     await expect(page.getByRole("button", { name: "수정" })).not.toBeVisible();
  74  |   });
  75  | 
  76  |   // ── M-06: 닉네임 입력 필드 포커스 + 값 변경 ─────────────────────────
  77  |   test("M-06: 닉네임 입력 필드에 포커스 + 값 변경", async ({ page }) => {
  78  |     await gotoMyPage(page);
  79  |     await page.getByRole("button", { name: "수정" }).click();
  80  |     const input = page.locator('input[type="text"]');
  81  |     // 입력 필드에 포커스 (autoFocus 속성)
  82  |     await expect(input).toBeFocused();
  83  |     // 현재 값 확인
  84  |     await expect(input).toHaveValue(USER_NICKNAME);
  85  |     // 값 변경
  86  |     const newNickname = "new_jane";
  87  |     await input.clear();
  88  |     await input.fill(newNickname);
  89  |     await expect(input).toHaveValue(newNickname);
  90  |   });
  91  | 
  92  |   // ── M-07: 닉네임 미입력 + 저장 → 에러 메시지 (유효성 검사) ──────────
  93  |   test("M-07: 닉네임 미입력 후 저장 시 에러 메시지가 표시된다", async ({
  94  |     page,
  95  |   }) => {
  96  |     await gotoMyPage(page);
  97  |     await page.getByRole("button", { name: "수정" }).click();
  98  |     const input = page.locator('input[type="text"]');
  99  |     // 입력 필드 비우기
  100 |     await input.clear();
  101 |     await page.getByRole("button", { name: "저장" }).click();
  102 |     // 에러 메시지 확인
  103 |     await expect(
  104 |       page.locator("text=닉네임을 입력해줘"),
  105 |     ).toBeVisible();
  106 |   });
  107 | 
  108 |   // ── M-08: 닉네임 입력 + 저장 → 저장 완료 ───────────────────────────
  109 |   test("M-08: 닉네임 입력 후 저장하면 편집 모드가 종료된다", async ({
  110 |     page,
  111 |   }) => {
  112 |     await gotoMyPage(page);
  113 |     await page.getByRole("button", { name: "수정" }).click();
  114 |     const input = page.locator('input[type="text"]');
```