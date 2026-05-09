# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: result-payment.spec.ts >> R: 결과 페이지 - 결제 모달 >> R-20: 개별 Scene 구매 모달에 '900원 결제하기' 버튼이 렌더링된다 (초기 활성 상태)
- Location: tests/e2e/result-payment.spec.ts:110:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect, Page } from "@playwright/test";
  2   | 
  3   | // ── 상수 ───────────────────────────────────────────────────────────────
  4   | const SESSION_ID = "test-payment-r18";
  5   | const CONTENT_ID = "love-1";
  6   | 
  7   | // love-1: scene 1,2 무료 / scene 3,4,5,6 유료 → 총 6개 씬
  8   | const FREE_SCENE_COUNT = 2;
  9   | const PAID_SCENE_COUNT = 4;
  10  | const TOTAL_SCENE_COUNT = FREE_SCENE_COUNT + PAID_SCENE_COUNT;
  11  | 
  12  | // ── Helper: localStorage에 분석 데이터 세팅 후 결과 페이지 이동 ──────────
  13  | const gotoResult = async (
  14  |   page: Page,
  15  |   sessionId = SESSION_ID,
  16  |   contentId = CONTENT_ID,
  17  |   queryString = "",
  18  | ) => {
> 19  |   await page.goto("/");
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  20  |   await page.evaluate(
  21  |     ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
  22  |     {
  23  |       key: `veil_analysis_${sessionId}`,
  24  |       value: {
  25  |         session_id: sessionId,
  26  |         content_id: contentId,
  27  |         free_input: "결제 테스트 입력",
  28  |         answers: [],
  29  |         created_at: new Date().toISOString(),
  30  |       },
  31  |     },
  32  |   );
  33  |   await page.goto(`/result/${sessionId}${queryString}`);
  34  | };
  35  | 
  36  | // ── Helper: 씬 렌더링 대기 ───────────────────────────────────────────────
  37  | const waitForScenes = async (page: Page) => {
  38  |   await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
  39  | };
  40  | 
  41  | // ── Helper: 개별 Scene 결제 모달 열기 ──────────────────────────────────
  42  | const openSingleModal = async (page: Page) => {
  43  |   await gotoResult(page);
  44  |   await waitForScenes(page);
  45  |   const unlockBtn = page.locator("[data-testid='scene-unlock-btn']").first();
  46  |   await unlockBtn.scrollIntoViewIfNeeded();
  47  |   await unlockBtn.click();
  48  |   await expect(page.locator("[data-testid='payment-modal']")).toBeVisible({
  49  |     timeout: 5000,
  50  |   });
  51  | };
  52  | 
  53  | // ── Helper: 전체 구매 결제 모달 열기 ───────────────────────────────────
  54  | const openAllModal = async (page: Page) => {
  55  |   await gotoResult(page);
  56  |   await waitForScenes(page);
  57  |   const unlockAllBtn = page.locator("[data-testid='flow-overview-unlock-all-btn']");
  58  |   await unlockAllBtn.click();
  59  |   await expect(page.locator("[data-testid='payment-modal']")).toBeVisible({
  60  |     timeout: 5000,
  61  |   });
  62  | };
  63  | 
  64  | // ─────────────────────────────────────────────────────────────────────────
  65  | test.describe("R: 결과 페이지 - 결제 모달", () => {
  66  |   // ── R-18: 개별 Scene 구매 모달 렌더링 + 제목 표시 ─────────────────────
  67  |   test("R-18: 개별 Scene 구매 모달이 열리고 Scene 제목('[title] 열기')이 표시된다", async ({
  68  |     page,
  69  |   }) => {
  70  |     await gotoResult(page);
  71  |     await waitForScenes(page);
  72  | 
  73  |     // 첫 번째 유료 scene의 제목을 확인하기 위해 h2 목록에서 세 번째(idx=2) 가져오기
  74  |     const firstPaidSceneTitle = await page
  75  |       .locator("[data-scene-idx='2'] h2")
  76  |       .textContent();
  77  | 
  78  |     const unlockBtn = page
  79  |       .locator("[data-testid='scene-unlock-btn']")
  80  |       .first();
  81  |     await unlockBtn.scrollIntoViewIfNeeded();
  82  |     await unlockBtn.click();
  83  | 
  84  |     await expect(page.locator("[data-testid='payment-modal']")).toBeVisible({
  85  |       timeout: 5000,
  86  |     });
  87  | 
  88  |     // 제목 확인: "[씬 제목] 열기" 형식
  89  |     const modalTitle = page.locator("[data-testid='payment-modal-title']");
  90  |     await expect(modalTitle).toBeVisible({ timeout: 5000 });
  91  |     await expect(modalTitle).toContainText("열기");
  92  |     // 씬 제목 포함 여부 확인 (첫 유료 씬 제목이 모달 타이틀에 포함됨)
  93  |     if (firstPaidSceneTitle) {
  94  |       await expect(modalTitle).toContainText(firstPaidSceneTitle.trim());
  95  |     }
  96  |   });
  97  | 
  98  |   // ── R-19: 개별 구매 모달 - 900원 가격 표시 ────────────────────────────
  99  |   test("R-19: 개별 Scene 구매 모달에 900원 가격이 표시된다", async ({
  100 |     page,
  101 |   }) => {
  102 |     await openSingleModal(page);
  103 | 
  104 |     const priceEl = page.locator("[data-testid='payment-modal-price']");
  105 |     await expect(priceEl).toBeVisible({ timeout: 5000 });
  106 |     await expect(priceEl).toContainText("900");
  107 |   });
  108 | 
  109 |   // ── R-20: 개별 구매 모달 - 결제 버튼 렌더링 ──────────────────────────
  110 |   test("R-20: 개별 Scene 구매 모달에 '900원 결제하기' 버튼이 렌더링된다 (초기 활성 상태)", async ({
  111 |     page,
  112 |   }) => {
  113 |     await openSingleModal(page);
  114 | 
  115 |     const payBtn = page.locator("[data-testid='payment-modal-pay-btn']");
  116 |     await expect(payBtn).toBeVisible({ timeout: 5000 });
  117 |     await expect(payBtn).toContainText("900");
  118 |     await expect(payBtn).toContainText("결제하기");
  119 |     // 초기에는 활성 상태 (isProcessing=false)
```