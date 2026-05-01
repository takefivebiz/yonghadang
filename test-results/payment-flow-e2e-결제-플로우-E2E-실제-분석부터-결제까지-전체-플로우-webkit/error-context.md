# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment-flow-e2e.spec.ts >> 결제 플로우 E2E >> 실제 분석부터 결제까지 전체 플로우
- Location: e2e/payment-flow-e2e.spec.ts:17:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:not(:has-text("다음")):not(:has-text("이전"))').first()
    - locator resolved to <button aria-label="메뉴 열기" class="p-2 transition-colors">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    50 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - link "Corelog" [ref=e5]:
          - /url: /
        - navigation [ref=e6]:
          - link "비회원 조회" [ref=e7]:
            - /url: /guest/lookup
          - link "로그인" [ref=e8]:
            - /url: /auth
    - main [ref=e9]:
      - generic [ref=e11]:
        - generic [ref=e13]:
          - generic [ref=e14]: 나를 읽는 중
          - generic [ref=e15]: 1/13
        - generic [ref=e18]:
          - heading "당신의 현재 연애 상황을 어떻게 설명하시겠어요?" [level=2] [ref=e20]
          - generic [ref=e21]:
            - button "현재 관계 중이에요" [ref=e22]
            - button "누군가를 좋아하는 중이에요" [ref=e23]
            - button "관계를 회피하는 중이에요" [ref=e24]
            - button "혼자 있는 게 편해요" [ref=e25]
          - generic [ref=e26]:
            - button "이전" [ref=e27]
            - button "다음" [disabled] [ref=e28]
    - contentinfo [ref=e29]:
      - generic [ref=e30]:
        - navigation [ref=e31]:
          - link "이용약관" [ref=e32]:
            - /url: /terms
          - link "개인정보처리방침" [ref=e33]:
            - /url: /privacy
          - link "문의하기" [ref=e34]:
            - /url: /contact
        - generic [ref=e35]:
          - paragraph [ref=e36]: "상호명: 코어로그 | 대표자: 홍길동 | 사업자등록번호: 000-00-00000"
          - paragraph [ref=e37]: "주소: 서울특별시 강남구 테헤란로 000"
          - paragraph [ref=e38]: © 2026 Corelog. All rights reserved.
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e44] [cursor=pointer]:
    - img [ref=e45]
  - alert [ref=e50]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * E2E: 실제 분석 → 무료 리포트 → 유료 질문 선택 → 결제 플로우
  5   |  *
  6   |  * 1. /analyze에서 실제 분석 완료
  7   |  * 2. 무료 리포트 생성 및 표시
  8   |  * 3. 유료 질문 CTA 확인
  9   |  * 4. 질문 선택 (3개)
  10  |  * 5. 결제 모달 오픈
  11  |  * 6. 토스 테스트 결제
  12  |  * 7. orders 생성 확인
  13  |  * 8. paid_reports 생성 확인
  14  |  */
  15  | 
  16  | test.describe('결제 플로우 E2E', () => {
  17  |   test('실제 분석부터 결제까지 전체 플로우', async ({ page }) => {
  18  |     // === Step 1: /analyze 접근 ===
  19  |     await page.goto('http://localhost:3000/analyze');
  20  |     await page.waitForLoadState('networkidle');
  21  | 
  22  |     console.log('✅ Step 1: /analyze 페이지 로드');
  23  | 
  24  |     // === Step 2: 카테고리 선택 (연애) ===
  25  |     const loveBtn = page.locator('button:has-text("💕")');
  26  |     await loveBtn.click();
  27  |     await page.waitForTimeout(500);
  28  |     console.log('✅ Step 2: 연애 카테고리 선택');
  29  | 
  30  |     // === Step 3: 세부 카테고리 선택 (썸) ===
  31  |     const sumBtn = page.locator('button:has-text("썸")').first();
  32  |     await sumBtn.click();
  33  |     await page.waitForTimeout(500);
  34  |     console.log('✅ Step 3: 썸 선택');
  35  | 
  36  |     // === Step 4: 9개 질문 모두 답변 ===
  37  |     for (let i = 0; i < 9; i++) {
  38  |       // 첫 번째 선택지 클릭
  39  |       const optionBtn = page.locator('button:not(:has-text("다음")):not(:has-text("이전"))').first();
> 40  |       await optionBtn.click();
      |                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  41  |       await page.waitForTimeout(200);
  42  | 
  43  |       // 마지막 질문이 아니면 다음 클릭
  44  |       if (i < 8) {
  45  |         const nextBtn = page.locator('button:has-text("다음")');
  46  |         await nextBtn.click();
  47  |         await page.waitForTimeout(300);
  48  |       }
  49  |     }
  50  |     console.log('✅ Step 4: 9개 질문 모두 답변 완료');
  51  | 
  52  |     // === Step 5: 리포트 페이지 로드 확인 ===
  53  |     await page.waitForURL(/\/report\//, { timeout: 10000 });
  54  |     const reportUrl = page.url();
  55  |     const sessionId = reportUrl.split('/report/')[1];
  56  |     console.log(`✅ Step 5: 리포트 페이지 로드 (sessionId: ${sessionId})`);
  57  | 
  58  |     // === Step 6: 무료 리포트 콘텐츠 표시 확인 ===
  59  |     await page.waitForTimeout(1000);
  60  |     const freeReportContent = page.locator('text=/분석|결과|관계/').first();
  61  |     await expect(freeReportContent).toBeVisible({ timeout: 5000 });
  62  |     console.log('✅ Step 6: 무료 리포트 콘텐츠 표시됨');
  63  | 
  64  |     // === Step 7: 유료 질문 CTA 확인 ===
  65  |     const paidCta = page.locator('text="더 깊이 알고 싶어?"');
  66  |     await expect(paidCta).toBeVisible({ timeout: 5000 });
  67  |     console.log('✅ Step 7: 유료 질문 CTA ("더 깊이 알고 싶어?") 확인');
  68  | 
  69  |     // === Step 8: 페이지 스크롤해서 유료 질문 섹션 표시 ===
  70  |     await page.locator('text="더 깊이 알고 싶어?"').scrollIntoViewIfNeeded();
  71  |     await page.waitForTimeout(500);
  72  | 
  73  |     // === Step 9: 기본 3개 질문 확인 ===
  74  |     const recommendedQuestions = page.locator('button:has-text("원")').filter({ hasText: /900원/ });
  75  |     const recommendedCount = await recommendedQuestions.count();
  76  |     console.log(`✅ Step 9: 기본 질문 개수 확인 (${recommendedCount}개)`);
  77  | 
  78  |     // === Step 10: 아코디언 펼치기 ===
  79  |     const accordionBtn = page.locator('button:has-text("더 많은 질문 보기")');
  80  |     if (await accordionBtn.isVisible()) {
  81  |       await accordionBtn.click();
  82  |       await page.waitForTimeout(300);
  83  |       console.log('✅ Step 10: 아코디언 펼침');
  84  |     }
  85  | 
  86  |     // === Step 11: 질문 3개 선택 ===
  87  |     const selectableQuestions = page.locator('button').filter({ hasText: /원/ });
  88  |     const questionsToSelect = 3;
  89  | 
  90  |     for (let i = 0; i < Math.min(questionsToSelect, await selectableQuestions.count()); i++) {
  91  |       await selectableQuestions.nth(i).click();
  92  |       await page.waitForTimeout(100);
  93  |     }
  94  |     console.log(`✅ Step 11: 질문 ${questionsToSelect}개 선택`);
  95  | 
  96  |     // === Step 12: 결제 버튼 확인 및 클릭 ===
  97  |     const paymentBtn = page.locator('button').filter({ hasText: /원.*결제/ }).or(page.locator('button:has-text("선택")')).first();
  98  |     await expect(paymentBtn).toBeVisible();
  99  |     await paymentBtn.scrollIntoViewIfNeeded();
  100 |     await paymentBtn.click();
  101 |     await page.waitForTimeout(500);
  102 |     console.log('✅ Step 12: 결제 버튼 클릭');
  103 | 
  104 |     // === Step 13: 결제 모달 확인 ===
  105 |     const paymentModal = page.locator('text="결제하기"').or(page.locator('text="토스페이먼츠"'));
  106 |     await expect(paymentModal).toBeVisible({ timeout: 5000 });
  107 |     console.log('✅ Step 13: 결제 모달 오픈');
  108 | 
  109 |     // === Step 14: 비회원 정보 입력 ===
  110 |     const phoneInput = page.locator('input[placeholder*="휴대폰"]').or(page.locator('input[type="tel"]'));
  111 |     if (await phoneInput.isVisible()) {
  112 |       await phoneInput.fill('01012345678');
  113 |       console.log('✅ Step 14a: 휴대폰 입력');
  114 |     }
  115 | 
  116 |     const passwordInput = page.locator('input[placeholder*="비밀번호"]').or(page.locator('input[type="password"]'));
  117 |     if (await passwordInput.isVisible()) {
  118 |       await passwordInput.fill('1234');
  119 |       console.log('✅ Step 14b: 비밀번호 입력');
  120 |     }
  121 | 
  122 |     // === Step 15: 콘솔 로그 및 네트워크 요청 확인 ===
  123 |     const consoleMessages: string[] = [];
  124 |     page.on('console', msg => {
  125 |       console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
  126 |       consoleMessages.push(msg.text());
  127 |     });
  128 | 
  129 |     // === Step 16: 최종 상태 저장 ===
  130 |     const localStorage = await page.evaluate(() => {
  131 |       const data: Record<string, string> = {};
  132 |       for (let i = 0; i < window.localStorage.length; i++) {
  133 |         const key = window.localStorage.key(i);
  134 |         if (key) {
  135 |           data[key] = window.localStorage.getItem(key) || '';
  136 |         }
  137 |       }
  138 |       return data;
  139 |     });
  140 | 
```