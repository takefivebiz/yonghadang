# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analyze-page.spec.ts >> A: 분석 입력 페이지 (/analyze/[session_id]) >> A-21: 모든 보정 질문 완료 후 completing 화면 표시
- Location: tests/e2e/analyze-page.spec.ts:236:3

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:3000/analyze/test-session-001", waiting until "load"

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
  3   | test.describe("A: 분석 입력 페이지 (/analyze/[session_id])", () => {
  4   |   const baseUrl = "http://localhost:3000";
  5   |   const TEST_SESSION = "test-session-001";
  6   |   const TEST_INPUT = "자꾸 상대가 의심되고, 휴대폰을 확인하게 돼";
  7   | 
  8   |   test.beforeEach(async ({ page }) => {
> 9   |     await page.goto(`${baseUrl}/analyze/${TEST_SESSION}`);
      |                ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  10  |   });
  11  | 
  12  |   /**
  13  |    * 자유입력 제출 후 반응 버블(reaction_after_free) 단계가 끝나고
  14  |    * 보정 질문(correction_questions) 단계의 첫 번째 옵션 버튼이 나타날 때까지 대기.
  15  |    * ReactionBubble은 4000ms 후 onComplete()를 호출하므로 timeout을 6000ms로 설정.
  16  |    */
  17  |   const submitFreeInputAndWaitForQuestions = async (page: Page) => {
  18  |     const textarea = page.locator("textarea");
  19  |     await textarea.fill(TEST_INPUT);
  20  |     await page.locator('button:has-text("이어서")').click();
  21  |     // 반응 버블에서 보정 질문으로 자동 전환(4000ms) 대기
  22  |     await expect(optionButtons(page).first()).toBeVisible({ timeout: 6000 });
  23  |   };
  24  | 
  25  |   /**
  26  |    * 보정 질문(correction_questions)의 옵션 버튼 로케이터.
  27  |    * 옵션은 <div class="space-y-2"><button>…</button></div> 구조로 렌더링됨.
  28  |    * header의 모바일 메뉴 버튼(hidden)과 충돌을 피하기 위해 .space-y-2 컨테이너로 스코프 한정.
  29  |    */
  30  |   const optionButtons = (page: Page) =>
  31  |     page.locator("div.space-y-2").locator("button");
  32  | 
  33  |   /**
  34  |    * 이동 버튼("다음 →" 또는 마지막 질문의 "완료") 로케이터.
  35  |    */
  36  |   const nextButton = (page: Page) =>
  37  |     page.locator('button:has-text("다음"), button:has-text("완료")').last();
  38  | 
  39  |   /**
  40  |    * 모든 보정 질문에 첫 번째 옵션을 선택 후 이동 버튼을 클릭하여
  41  |    * completing 단계 진입까지 순환 처리.
  42  |    * love-1 기준 6개 질문, 최대 8회 반복으로 방어.
  43  |    */
  44  |   const completeAllQuestions = async (page: Page) => {
  45  |     for (let i = 0; i < 8; i++) {
  46  |       const completing = page.locator('h1:has-text("모든 질문이 끝났어")');
  47  |       if (await completing.isVisible({ timeout: 300 })) break;
  48  | 
  49  |       const btn = optionButtons(page).first();
  50  |       if (!(await btn.isVisible({ timeout: 2000 }))) break;
  51  | 
  52  |       await btn.click();
  53  | 
  54  |       const next = nextButton(page);
  55  |       await expect(next).not.toBeDisabled({ timeout: 1000 });
  56  |       await next.click();
  57  | 
  58  |       // 질문 전환 애니메이션 대기
  59  |       await page.waitForTimeout(350);
  60  |     }
  61  |   };
  62  | 
  63  |   // ── A-01 ~ A-07: 페이지 로드 및 자유입력 유효성 검증 ──────────────────
  64  | 
  65  |   test("A-01: 분석 페이지 로드 시 자유입력 단계 렌더링", async ({ page }) => {
  66  |     await expect(page.locator("textarea")).toBeVisible();
  67  |     await expect(page.locator("h1").first()).toBeVisible();
  68  |   });
  69  | 
  70  |   test("A-02: 자유입력 textarea의 placeholder 텍스트 확인", async ({
  71  |     page,
  72  |   }) => {
  73  |     const placeholder = await page.locator("textarea").getAttribute("placeholder");
  74  |     expect(placeholder).toContain("상황을");
  75  |   });
  76  | 
  77  |   test("A-03: 초기 상태에서 textarea 값이 비어있음", async ({ page }) => {
  78  |     expect(await page.locator("textarea").inputValue()).toBe("");
  79  |   });
  80  | 
  81  |   test("A-04: textarea에 텍스트 입력 가능", async ({ page }) => {
  82  |     await page.locator("textarea").fill(TEST_INPUT);
  83  |     expect(await page.locator("textarea").inputValue()).toBe(TEST_INPUT);
  84  |   });
  85  | 
  86  |   test("A-05: textarea에 여러 줄 입력 가능", async ({ page }) => {
  87  |     const multi = "첫 번째 줄\n두 번째 줄\n세 번째 줄";
  88  |     await page.locator("textarea").fill(multi);
  89  |     expect(await page.locator("textarea").inputValue()).toBe(multi);
  90  |   });
  91  | 
  92  |   test("A-06: 최대 500자 제한 확인", async ({ page }) => {
  93  |     await page.locator("textarea").fill("a".repeat(600));
  94  |     expect((await page.locator("textarea").inputValue()).length).toBeLessThanOrEqual(500);
  95  |   });
  96  | 
  97  |   test("A-07: 빈 입력으로 제출 불가 (버튼 disabled)", async ({ page }) => {
  98  |     await expect(page.locator('button:has-text("이어서")')).toBeDisabled();
  99  |   });
  100 | 
  101 |   // ── A-08 ~ A-10: 자유입력 제출 및 단계 전환 ───────────────────────────
  102 | 
  103 |   test("A-08: 유효한 입력 시 제출 버튼 활성화", async ({ page }) => {
  104 |     await page.locator("textarea").fill(TEST_INPUT);
  105 |     await expect(page.locator('button:has-text("이어서")')).not.toBeDisabled();
  106 |   });
  107 | 
  108 |   test("A-09: 자유입력 제출 후 반응 버블로 전환", async ({ page }) => {
  109 |     await page.locator("textarea").fill(TEST_INPUT);
```