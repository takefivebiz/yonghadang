# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: integration.spec.ts >> 통합 E2E 시나리오 >> E2E-03: /guest → phone/PIN 인증 → 세션 선택 → 결과/공유 페이지 이동
- Location: tests/e2e/integration.spec.ts:197:3

# Error details

```
Error: page.goto: Could not connect to the server.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

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
  19  |   await page.goto("/");
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
> 98  |   await page.goto("/");
      |              ^ Error: page.goto: Could not connect to the server.
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
  120 |   test("E2E-01: 홈 → 콘텐츠 → 분석 완료 → 결과 페이지 전체 플로우", async ({
  121 |     page,
  122 |   }) => {
  123 |     // 1. 홈 → 콘텐츠 카드 클릭
  124 |     await page.goto("/");
  125 |     await expect(page.locator("h1").first()).toBeVisible({ timeout: 5000 });
  126 | 
  127 |     const firstCard = page.locator("a[href*='/content/']").first();
  128 |     await expect(firstCard).toBeVisible({ timeout: 5000 });
  129 |     await firstCard.click();
  130 |     await expect(page).toHaveURL(/\/content\//, { timeout: 5000 });
  131 | 
  132 |     // 2. 콘텐츠 상세 페이지 → "시작하기" CTA 클릭
  133 |     const ctaBtn = page.getByRole("button", { name: /시작하기/ });
  134 |     await expect(ctaBtn).toBeVisible({ timeout: 5000 });
  135 |     await ctaBtn.click();
  136 |     await expect(page).toHaveURL(/\/analyze\//, { timeout: 5000 });
  137 | 
  138 |     // 3. 분석 흐름 완료 → /result/ 리다이렉트 확인
  139 |     await completeAnalyzeFlow(page);
  140 | 
  141 |     // 4. 결과 페이지 검증
  142 |     expect(page.url()).toMatch(/\/result\//);
  143 |     const sceneWrappers = page.locator("[data-scene-idx]");
  144 |     await expect(sceneWrappers).toHaveCount(TOTAL_SCENE_COUNT);
  145 | 
  146 |     // 무료 씬 콘텐츠 표시
  147 |     const sceneMessages = page.locator("[data-testid='scene-messages']");
  148 |     await expect(sceneMessages).toHaveCount(FREE_SCENE_COUNT);
  149 | 
  150 |     // 유료 씬 lock CTA 표시
  151 |     const lockBtns = page.locator("[data-testid='scene-unlock-btn']");
  152 |     await expect(lockBtns).toHaveCount(PAID_SCENE_COUNT);
  153 |   });
  154 | 
  155 |   // ── E2E-02: 신규 비회원 전체 구매 플로우 ─────────────────────────────
  156 |   test("E2E-02: 결과 페이지 → 전체 구매 모달 → 결제 성공 → 모든 Scene unlock", async ({
  157 |     page,
  158 |   }) => {
  159 |     // 1. 결과 페이지 진입 (localStorage 방식)
  160 |     await gotoResult(page);
  161 | 
  162 |     // 2. FlowOverview '전체 흐름 열기' 버튼 확인
  163 |     const unlockAllBtn = page.locator(
  164 |       "[data-testid='flow-overview-unlock-all-btn']",
  165 |     );
  166 |     await expect(unlockAllBtn).toBeVisible();
  167 | 
  168 |     // 3. 결제 모달 열기 → 2,900원 가격 확인
  169 |     await unlockAllBtn.click();
  170 |     const modal = page.locator("[data-testid='payment-modal']");
  171 |     await expect(modal).toBeVisible({ timeout: 5000 });
  172 |     const priceEl = page.locator("[data-testid='payment-modal-price']");
  173 |     await expect(priceEl).toContainText("2,900");
  174 | 
  175 |     // 4. 모달 닫기
  176 |     await page.locator("[data-testid='payment-modal-close-btn']").click();
  177 |     await expect(modal).not.toBeVisible({ timeout: 3000 });
  178 | 
  179 |     // 5. URL 파라미터 방식으로 전체 결제 성공 mock
  180 |     await page.goto(`/result/${SESSION_ID}?payment_success=true&paymentType=all&orderId=e2e-02-order`);
  181 |     await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
  182 | 
  183 |     // 6. 모든 유료 씬 unlock 확인
  184 |     const allSceneMessages = page.locator("[data-testid='scene-messages']");
  185 |     await expect(allSceneMessages).toHaveCount(TOTAL_SCENE_COUNT);
  186 | 
  187 |     // FlowOverview 완료 메시지
  188 |     await expect(
  189 |       page.locator("text=전체 흐름이 열렸어. 계속 읽어봐"),
  190 |     ).toBeVisible();
  191 | 
  192 |     // URL 파라미터 정리됨
  193 |     expect(page.url()).not.toContain("payment_success");
  194 |   });
  195 | 
  196 |   // ── E2E-03: 비회원 재조회 플로우 ─────────────────────────────────────
  197 |   test("E2E-03: /guest → phone/PIN 인증 → 세션 선택 → 결과/공유 페이지 이동", async ({
  198 |     page,
```