# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analyze-page.spec.ts >> A: 분석 입력 페이지 (/analyze/[session_id]) >> A-18: 보정 질문 선택지를 클릭하여 선택 가능
- Location: tests/e2e/analyze-page.spec.ts:253:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button[role="radio"], button[role="checkbox"]').first()
Expected: visible
Timeout: 2000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 2000ms
  - waiting for locator('button[role="radio"], button[role="checkbox"]').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - navigation [ref=e4]:
        - link "VEIL" [ref=e5] [cursor=pointer]:
          - /url: /
        - generic [ref=e6]:
          - link "비회원 조회" [ref=e7] [cursor=pointer]:
            - /url: /guest
          - link "로그인" [ref=e9] [cursor=pointer]:
            - /url: /auth
    - main [ref=e10]:
      - generic [ref=e36]:
        - generic [ref=e37]:
          - paragraph [ref=e38]: 질문 1
          - heading "이런 행동이 얼마나 자주 일어나?" [level=1] [ref=e39]
          - paragraph [ref=e40]: 하나를 선택해줘
        - generic [ref=e41]:
          - button "거의 매일" [ref=e42]
          - button "주 3-4회 이상" [ref=e43]
          - button "주 1-2회 정도" [ref=e44]
          - button "가끔씩" [ref=e45]
        - button "다음 →" [disabled] [ref=e47]
    - contentinfo [ref=e48]:
      - generic [ref=e49]:
        - generic [ref=e50]:
          - paragraph [ref=e51]: "VEIL | 대표자: 홍길동"
          - paragraph [ref=e52]: "사업자등록번호 : 00-00-00000"
          - paragraph [ref=e53]: "통신판매업신고: 제2026-서울-0000호"
          - paragraph [ref=e54]: 서울특별시 땡땡구 땡땡동 땡떙로 77
        - generic [ref=e55]:
          - button "이용약관" [ref=e56]
          - button "개인정보처리방침" [ref=e57]
          - button "문의하기" [ref=e58]
        - paragraph [ref=e59]: © 2026 VEIL. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e65] [cursor=pointer]:
    - img [ref=e66]
  - alert [ref=e70]
```

# Test source

```ts
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
  255 |     const submitButton = page.locator('button:has-text("이어서")');
  256 | 
  257 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  258 |     await submitButton.click();
  259 | 
  260 |     await page.waitForTimeout(1000);
  261 | 
  262 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  263 |     if (await continueButton.isVisible({ timeout: 500 })) {
  264 |       await continueButton.click();
  265 |     } else {
  266 |       await page.waitForTimeout(3000);
  267 |     }
  268 | 
  269 |     // 첫 번째 선택지 클릭
  270 |     const option = page.locator('button[role="radio"], button[role="checkbox"]');
> 271 |     await expect(option.first()).toBeVisible({ timeout: 2000 });
      |                                  ^ Error: expect(locator).toBeVisible() failed
  272 |     await option.first().click();
  273 |   });
  274 | 
  275 |   test("A-19: 선택 후 다음 질문으로 자연스럽게 전환", async ({ page }) => {
  276 |     const textarea = page.locator('textarea');
  277 |     const submitButton = page.locator('button:has-text("이어서")');
  278 | 
  279 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  280 |     await submitButton.click();
  281 | 
  282 |     await page.waitForTimeout(1000);
  283 | 
  284 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  285 |     if (await continueButton.isVisible({ timeout: 500 })) {
  286 |       await continueButton.click();
  287 |     } else {
  288 |       await page.waitForTimeout(3000);
  289 |     }
  290 | 
  291 |     // 첫 번째 선택지 클릭
  292 |     const option = page.locator('button[role="radio"], button[role="checkbox"]');
  293 |     if (await option.first().isVisible({ timeout: 2000 })) {
  294 |       await option.first().click();
  295 |       await page.waitForTimeout(500);
  296 |     }
  297 |   });
  298 | 
  299 |   test("A-20: 복수 선택이 가능한 질문에서 여러 옵션 선택 가능", async ({
  300 |     page,
  301 |   }) => {
  302 |     const textarea = page.locator('textarea');
  303 |     const submitButton = page.locator('button:has-text("이어서")');
  304 | 
  305 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  306 |     await submitButton.click();
  307 | 
  308 |     await page.waitForTimeout(1000);
  309 | 
  310 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  311 |     if (await continueButton.isVisible({ timeout: 500 })) {
  312 |       await continueButton.click();
  313 |     } else {
  314 |       await page.waitForTimeout(3000);
  315 |     }
  316 | 
  317 |     // checkbox 요소가 있으면 복수 선택 가능
  318 |     const checkboxes = page.locator('button[role="checkbox"]');
  319 |     const checkboxCount = await checkboxes.count();
  320 | 
  321 |     if (checkboxCount > 1) {
  322 |       // 첫 번째와 두 번째 체크박스 선택
  323 |       await checkboxes.nth(0).click();
  324 |       await page.waitForTimeout(200);
  325 |       await checkboxes.nth(1).click();
  326 |     }
  327 |   });
  328 | 
  329 |   // ── A-21 ~ A-23: 모든 질문 완료 및 결과 생성 ──────────────────────────
  330 |   test("A-21: 모든 보정 질문 답변 완료 후 완료 화면 표시", async ({ page }) => {
  331 |     const textarea = page.locator('textarea');
  332 |     const submitButton = page.locator('button:has-text("이어서")');
  333 | 
  334 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  335 |     await submitButton.click();
  336 | 
  337 |     await page.waitForTimeout(1000);
  338 | 
  339 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  340 |     if (await continueButton.isVisible({ timeout: 500 })) {
  341 |       await continueButton.click();
  342 |     } else {
  343 |       await page.waitForTimeout(3000);
  344 |     }
  345 | 
  346 |     // 모든 질문을 자동으로 선택하고 완료될 때까지 진행
  347 |     for (let i = 0; i < 8; i++) {
  348 |       const option = page.locator('button[role="radio"], button[role="checkbox"]');
  349 |       const optionCount = await option.count();
  350 | 
  351 |       if (optionCount === 0) {
  352 |         break;
  353 |       }
  354 | 
  355 |       // 첫 번째 옵션 선택
  356 |       await option.first().click();
  357 |       await page.waitForTimeout(300);
  358 | 
  359 |       // 완료 화면인지 확인
  360 |       const completingText = page.locator(
  361 |         'text=/모든 질문이 끝났어|흐름을 정리하고 있어/'
  362 |       );
  363 |       if (await completingText.isVisible({ timeout: 500 })) {
  364 |         break;
  365 |       }
  366 |     }
  367 | 
  368 |     // 완료 화면이 보이는지 확인
  369 |     const completingText = page.locator(
  370 |       'text=/모든 질문이 끝났어|흐름을 정리하고 있어/'
  371 |     );
```