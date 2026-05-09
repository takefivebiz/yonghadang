# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analyze-page.spec.ts >> A: 분석 입력 페이지 (/analyze/[session_id]) >> A-13: 반응 버블 메시지가 명확하고 감정적이지 않음
- Location: tests/e2e/analyze-page.spec.ts:142:3

# Error details

```
Error: locator.textContent: Error: strict mode violation: locator('div').filter({ hasText: /고마워/ }) resolved to 6 elements:
    1) <div class="flex min-h-screen flex-col">…</div> aka getByText('VEIL비회원 조회로그인고마워상황을 자세히 이해하기 위해몇 가지만 더 볼게.VEIL | 대표자: 홍길동사업자등록번호 : 00-00-00000')
    2) <div class="min-h-screen bg-background">…</div> aka locator('div').nth(5)
    3) <div class="flex min-h-screen flex-col bg-background px-4 py-6 sm:px-6 relative">…</div> aka locator('div').filter({ hasText: '고마워상황을 자세히 이해하기 위해몇 가지만 더 볼게' }).nth(2)
    4) <div class="mx-auto w-full max-w-2xl flex-1 flex flex-col items-start gap-2">…</div> aka getByText('고마워상황을 자세히 이해하기 위해몇 가지만 더 볼게')
    5) <div>…</div> aka locator('div').filter({ hasText: '고마워' }).nth(4)
    6) <div class="rounded-2xl px-5 py-4 sm:px-6 sm:py-5">…</div> aka locator('div').filter({ hasText: '고마워' }).nth(5)

Call log:
  - waiting for locator('div').filter({ hasText: /고마워/ })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - navigation [ref=e4]:
        - link "VEIL" [ref=e5] [cursor=pointer]:
          - /url: /
        - button "메뉴 열기" [ref=e6]
    - main [ref=e10]:
      - generic [ref=e35]:
        - paragraph [ref=e38]: 고마워
        - paragraph [ref=e41]: 상황을 자세히 이해하기 위해
        - paragraph [ref=e44]: 몇 가지만 더 볼게.
    - contentinfo [ref=e45]:
      - generic [ref=e46]:
        - generic [ref=e47]:
          - paragraph [ref=e48]: "VEIL | 대표자: 홍길동"
          - paragraph [ref=e49]: "사업자등록번호 : 00-00-00000"
          - paragraph [ref=e50]: "통신판매업신고: 제2026-서울-0000호"
          - paragraph [ref=e51]: 서울특별시 땡땡구 땡땡동 땡떙로 77
        - generic [ref=e52]:
          - button "이용약관" [ref=e53]
          - button "개인정보처리방침" [ref=e54]
          - button "문의하기" [ref=e55]
        - paragraph [ref=e56]: © 2026 VEIL. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e62] [cursor=pointer]:
    - img [ref=e63]
  - alert [ref=e66]
```

# Test source

```ts
  54  |     const value = await textarea.inputValue();
  55  |     expect(value.length).toBeLessThanOrEqual(500);
  56  |   });
  57  | 
  58  |   test("A-07: 빈 입력으로 제출 시도 시 제출 불가", async ({ page }) => {
  59  |     const submitButton = page.locator('button:has-text("이어서")');
  60  | 
  61  |     // 빈 상태에서는 제출 버튼이 disabled
  62  |     const isDisabled = await submitButton.isDisabled();
  63  |     expect(isDisabled).toBe(true);
  64  |   });
  65  | 
  66  |   // ── A-08 ~ A-10: 자유입력 제출 및 단계 전환 ───────────────────────────
  67  |   test("A-08: 유효한 입력으로 제출 가능", async ({ page }) => {
  68  |     const textarea = page.locator('textarea');
  69  |     const submitButton = page.locator('button:has-text("이어서")');
  70  | 
  71  |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  72  | 
  73  |     // 제출 버튼이 활성화되어야 함
  74  |     const isDisabled = await submitButton.isDisabled();
  75  |     expect(isDisabled).toBe(false);
  76  |   });
  77  | 
  78  |   test("A-09: 자유입력 제출 후 반응 버블 화면으로 전환", async ({ page }) => {
  79  |     const textarea = page.locator('textarea');
  80  |     const submitButton = page.locator('button:has-text("이어서")');
  81  | 
  82  |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  83  |     await submitButton.click();
  84  | 
  85  |     // 반응 버블 메시지가 보이는지 확인
  86  |     const reactionText = page.locator('text=/고마워|상황을|몇 가지/');
  87  |     await expect(reactionText.first()).toBeVisible({ timeout: 1000 });
  88  |   });
  89  | 
  90  |   test("A-10: 자유입력 데이터가 상태에 저장됨", async ({ page }) => {
  91  |     const textarea = page.locator('textarea');
  92  |     const submitButton = page.locator('button:has-text("이어서")');
  93  |     const testInput = "자꾸 상대가 의심되고, 휴대폰을 확인하게 돼";
  94  | 
  95  |     await textarea.fill(testInput);
  96  |     await submitButton.click();
  97  | 
  98  |     await page.waitForTimeout(500);
  99  | 
  100 |     // 반응 버블이 보일 때까지 대기
  101 |     const reactionText = page.locator('text=/고마워|상황을|몇 가지/');
  102 |     await expect(reactionText.first()).toBeVisible({ timeout: 1000 });
  103 |   });
  104 | 
  105 |   // ── A-11 ~ A-13: 반응 버블 상호작용 ──────────────────────────────────
  106 |   test("A-11: 반응 버블에 여러 메시지가 표시", async ({ page }) => {
  107 |     const textarea = page.locator('textarea');
  108 |     const submitButton = page.locator('button:has-text("이어서")');
  109 | 
  110 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  111 |     await submitButton.click();
  112 | 
  113 |     // 첫 번째 메시지 확인
  114 |     const firstMessage = page.locator('text="고마워"');
  115 |     await expect(firstMessage).toBeVisible({ timeout: 1000 });
  116 |   });
  117 | 
  118 |   test("A-12: 반응 버블 자동 진행으로 다음 단계 진입", async ({ page }) => {
  119 |     const textarea = page.locator('textarea');
  120 |     const submitButton = page.locator('button:has-text("이어서")');
  121 | 
  122 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  123 |     await submitButton.click();
  124 | 
  125 |     // 반응 버블이 보이는지 확인
  126 |     await expect(page.locator('text="고마워"')).toBeVisible({ timeout: 1000 });
  127 | 
  128 |     // 자동 진행되거나 클릭 가능한 버튼이 있으면 클릭
  129 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  130 |     if (await continueButton.isVisible({ timeout: 500 })) {
  131 |       await continueButton.click();
  132 |     } else {
  133 |       // 자동 진행인 경우 대기
  134 |       await page.waitForTimeout(3000);
  135 |     }
  136 | 
  137 |     // 보정 질문 화면이 보이는지 확인
  138 |     const correctionQuestion = page.locator('[role="radio"], [role="checkbox"]');
  139 |     await expect(correctionQuestion.first()).toBeVisible({ timeout: 2000 });
  140 |   });
  141 | 
  142 |   test("A-13: 반응 버블 메시지가 명확하고 감정적이지 않음", async ({
  143 |     page,
  144 |   }) => {
  145 |     const textarea = page.locator('textarea');
  146 |     const submitButton = page.locator('button:has-text("이어서")');
  147 | 
  148 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  149 |     await submitButton.click();
  150 | 
  151 |     await expect(page.locator('text="고마워"')).toBeVisible({ timeout: 1000 });
  152 | 
  153 |     // 메시지 내용이 "분석", "진단" 같은 단어를 포함하지 않아야 함
> 154 |     const messageText = await page.locator('div').filter({ hasText: /고마워/ }).textContent();
      |                                                                              ^ Error: locator.textContent: Error: strict mode violation: locator('div').filter({ hasText: /고마워/ }) resolved to 6 elements:
  155 |     expect(messageText).not.toMatch(/분석|진단|테스트|검사/);
  156 |   });
  157 | 
  158 |   // ── A-14 ~ A-17: 보정 질문 렌더링 ────────────────────────────────────
  159 |   test("A-14: 보정 질문이 한 화면에 하나씩 표시", async ({ page }) => {
  160 |     const textarea = page.locator('textarea');
  161 |     const submitButton = page.locator('button:has-text("이어서")');
  162 | 
  163 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  164 |     await submitButton.click();
  165 | 
  166 |     // 반응 버블이 보이는지 확인
  167 |     await expect(page.locator('text="고마워"')).toBeVisible({ timeout: 1000 });
  168 | 
  169 |     // 다음 단계로 진행
  170 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  171 |     if (await continueButton.isVisible({ timeout: 500 })) {
  172 |       await continueButton.click();
  173 |     } else {
  174 |       await page.waitForTimeout(3000);
  175 |     }
  176 | 
  177 |     // 보정 질문 요소가 보이는지 확인
  178 |     const questionText = page.locator('text=/행동|빈도|기간|반응|영향|경험/i').first();
  179 |     await expect(questionText).toBeVisible({ timeout: 2000 });
  180 | 
  181 |     // 선택 옵션이 있는지 확인
  182 |     const option = page.locator('button[role="radio"], button[role="checkbox"]');
  183 |     await expect(option.first()).toBeVisible({ timeout: 2000 });
  184 |   });
  185 | 
  186 |   test("A-15: 보정 질문의 선택 옵션이 렌더링", async ({ page }) => {
  187 |     const textarea = page.locator('textarea');
  188 |     const submitButton = page.locator('button:has-text("이어서")');
  189 | 
  190 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  191 |     await submitButton.click();
  192 | 
  193 |     await page.waitForTimeout(1000);
  194 | 
  195 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  196 |     if (await continueButton.isVisible({ timeout: 500 })) {
  197 |       await continueButton.click();
  198 |     } else {
  199 |       await page.waitForTimeout(3000);
  200 |     }
  201 | 
  202 |     // 선택 옵션 확인
  203 |     const options = page.locator('button[role="radio"], button[role="checkbox"]');
  204 |     expect(await options.count()).toBeGreaterThan(0);
  205 |   });
  206 | 
  207 |   test("A-16: 질문 텍스트가 명확하게 표시", async ({ page }) => {
  208 |     const textarea = page.locator('textarea');
  209 |     const submitButton = page.locator('button:has-text("이어서")');
  210 | 
  211 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  212 |     await submitButton.click();
  213 | 
  214 |     await page.waitForTimeout(1000);
  215 | 
  216 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  217 |     if (await continueButton.isVisible({ timeout: 500 })) {
  218 |       await continueButton.click();
  219 |     } else {
  220 |       await page.waitForTimeout(3000);
  221 |     }
  222 | 
  223 |     // 질문 텍스트 확인
  224 |     const questionText = page.locator('text=/행동|빈도|기간|반응|영향|경험/i');
  225 |     await expect(questionText.first()).toBeVisible({ timeout: 2000 });
  226 |   });
  227 | 
  228 |   test("A-17: 다음 버튼이 선택 후에 활성화됨", async ({ page }) => {
  229 |     const textarea = page.locator('textarea');
  230 |     const submitButton = page.locator('button:has-text("이어서")');
  231 | 
  232 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  233 |     await submitButton.click();
  234 | 
  235 |     await page.waitForTimeout(1000);
  236 | 
  237 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  238 |     if (await continueButton.isVisible({ timeout: 500 })) {
  239 |       await continueButton.click();
  240 |     } else {
  241 |       await page.waitForTimeout(3000);
  242 |     }
  243 | 
  244 |     // 첫 번째 선택지 클릭
  245 |     const option = page.locator('button[role="radio"], button[role="checkbox"]');
  246 |     if (await option.first().isVisible({ timeout: 2000 })) {
  247 |       await option.first().click();
  248 |       await page.waitForTimeout(300);
  249 |     }
  250 |   });
  251 | 
  252 |   // ── A-18 ~ A-20: 선택지 상호작용 ────────────────────────────────────
  253 |   test("A-18: 보정 질문 선택지를 클릭하여 선택 가능", async ({ page }) => {
  254 |     const textarea = page.locator('textarea');
```