# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analyze-page.spec.ts >> A: 분석 입력 페이지 (/analyze/[session_id]) >> A-23: 완료 화면에 명확한 메시지 표시
- Location: tests/e2e/analyze-page.spec.ts:420:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1:has-text("모든 질문이 끝났어")')
Expected: visible
Timeout: 3000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 3000ms
  - waiting for locator('h1:has-text("모든 질문이 끝났어")')

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
  - alert [ref=e69]
```

# Test source

```ts
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
  372 |     await expect(completingText.first()).toBeVisible({ timeout: 3000 });
  373 |   });
  374 | 
  375 |   test("A-22: 완료 화면에 체크 아이콘 및 로딩 애니메이션 표시", async ({
  376 |     page,
  377 |   }) => {
  378 |     const textarea = page.locator('textarea');
  379 |     const submitButton = page.locator('button:has-text("이어서")');
  380 | 
  381 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  382 |     await submitButton.click();
  383 | 
  384 |     await page.waitForTimeout(1000);
  385 | 
  386 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  387 |     if (await continueButton.isVisible({ timeout: 500 })) {
  388 |       await continueButton.click();
  389 |     } else {
  390 |       await page.waitForTimeout(3000);
  391 |     }
  392 | 
  393 |     // 모든 질문 선택
  394 |     for (let i = 0; i < 8; i++) {
  395 |       const option = page.locator('button[role="radio"], button[role="checkbox"]');
  396 |       const optionCount = await option.count();
  397 | 
  398 |       if (optionCount === 0) break;
  399 | 
  400 |       await option.first().click();
  401 |       await page.waitForTimeout(300);
  402 | 
  403 |       const completingText = page.locator(
  404 |         'text=/모든 질문이 끝났어|흐름을 정리하고 있어/'
  405 |       );
  406 |       if (await completingText.isVisible({ timeout: 500 })) {
  407 |         break;
  408 |       }
  409 |     }
  410 | 
  411 |     // 완료 화면 확인
  412 |     const checkIcon = page.locator('svg path[d*="5 13"]');
  413 |     await expect(checkIcon.first()).toBeVisible({ timeout: 3000 });
  414 | 
  415 |     // 로딩 닷 확인
  416 |     const loadingDot = page.locator('[style*="dotBounce"]');
  417 |     await expect(loadingDot.first()).toBeVisible({ timeout: 1000 });
  418 |   });
  419 | 
  420 |   test("A-23: 완료 화면에 명확한 메시지 표시", async ({ page }) => {
  421 |     const textarea = page.locator('textarea');
  422 |     const submitButton = page.locator('button:has-text("이어서")');
  423 | 
  424 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  425 |     await submitButton.click();
  426 | 
  427 |     await page.waitForTimeout(1000);
  428 | 
  429 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  430 |     if (await continueButton.isVisible({ timeout: 500 })) {
  431 |       await continueButton.click();
  432 |     } else {
  433 |       await page.waitForTimeout(3000);
  434 |     }
  435 | 
  436 |     // 모든 질문 선택
  437 |     for (let i = 0; i < 8; i++) {
  438 |       const option = page.locator('button[role="radio"], button[role="checkbox"]');
  439 |       const optionCount = await option.count();
  440 | 
  441 |       if (optionCount === 0) break;
  442 | 
  443 |       await option.first().click();
  444 |       await page.waitForTimeout(300);
  445 | 
  446 |       const completingText = page.locator(
  447 |         'text=/모든 질문이 끝났어|흐름을 정리하고 있어/'
  448 |       );
  449 |       if (await completingText.isVisible({ timeout: 500 })) {
  450 |         break;
  451 |       }
  452 |     }
  453 | 
  454 |     // 완료 메시지 확인
  455 |     const messageText = page.locator('h1:has-text("모든 질문이 끝났어")');
> 456 |     await expect(messageText).toBeVisible({ timeout: 3000 });
      |                               ^ Error: expect(locator).toBeVisible() failed
  457 |   });
  458 | 
  459 |   // ── A-24 ~ A-26: 결과 페이지 이동 및 데이터 저장 ──────────────────────
  460 |   test("A-24: 완료 화면에서 결과 페이지로 자동 이동", async ({ page }) => {
  461 |     const textarea = page.locator('textarea');
  462 |     const submitButton = page.locator('button:has-text("이어서")');
  463 | 
  464 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  465 |     await submitButton.click();
  466 | 
  467 |     await page.waitForTimeout(1000);
  468 | 
  469 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  470 |     if (await continueButton.isVisible({ timeout: 500 })) {
  471 |       await continueButton.click();
  472 |     } else {
  473 |       await page.waitForTimeout(3000);
  474 |     }
  475 | 
  476 |     // 모든 질문 선택
  477 |     for (let i = 0; i < 8; i++) {
  478 |       const option = page.locator('button[role="radio"], button[role="checkbox"]');
  479 |       const optionCount = await option.count();
  480 | 
  481 |       if (optionCount === 0) break;
  482 | 
  483 |       await option.first().click();
  484 |       await page.waitForTimeout(300);
  485 | 
  486 |       const completingText = page.locator(
  487 |         'text=/모든 질문이 끝났어|흐름을 정리하고 있어/'
  488 |       );
  489 |       if (await completingText.isVisible({ timeout: 500 })) {
  490 |         break;
  491 |       }
  492 |     }
  493 | 
  494 |     // 결과 페이지로 이동할 때까지 대기 (최대 5초)
  495 |     await page.waitForURL(/\/result\//, { timeout: 5000 });
  496 |     expect(page.url()).toContain("/result/");
  497 |   });
  498 | 
  499 |   test("A-25: 분석 데이터가 localStorage에 저장됨", async ({ page }) => {
  500 |     const textarea = page.locator('textarea');
  501 |     const submitButton = page.locator('button:has-text("이어서")');
  502 |     const testInput = "자꾸 상대가 의심되고, 휴대폰을 확인하게 돼";
  503 | 
  504 |     await textarea.fill(testInput);
  505 |     await submitButton.click();
  506 | 
  507 |     await page.waitForTimeout(1000);
  508 | 
  509 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  510 |     if (await continueButton.isVisible({ timeout: 500 })) {
  511 |       await continueButton.click();
  512 |     } else {
  513 |       await page.waitForTimeout(3000);
  514 |     }
  515 | 
  516 |     // 모든 질문 선택
  517 |     for (let i = 0; i < 8; i++) {
  518 |       const option = page.locator('button[role="radio"], button[role="checkbox"]');
  519 |       const optionCount = await option.count();
  520 | 
  521 |       if (optionCount === 0) break;
  522 | 
  523 |       await option.first().click();
  524 |       await page.waitForTimeout(300);
  525 | 
  526 |       const completingText = page.locator(
  527 |         'text=/모든 질문이 끝났어|흐름을 정리하고 있어/'
  528 |       );
  529 |       if (await completingText.isVisible({ timeout: 500 })) {
  530 |         break;
  531 |       }
  532 |     }
  533 | 
  534 |     // 완료 후 결과 페이지로 이동 대기
  535 |     await page.waitForURL(/\/result\//, { timeout: 5000 });
  536 | 
  537 |     // localStorage에 분석 데이터가 저장되었는지 확인
  538 |     const analysisData = await page.evaluate(() => {
  539 |       const stored = localStorage.getItem("veil_analysis_test-session-001");
  540 |       return stored ? JSON.parse(stored) : null;
  541 |     });
  542 | 
  543 |     expect(analysisData).toBeTruthy();
  544 |     expect(analysisData.free_input).toBe(testInput);
  545 |     expect(analysisData.answers).toBeDefined();
  546 |     expect(Array.isArray(analysisData.answers)).toBe(true);
  547 |   });
  548 | 
  549 |   test("A-26: 세션 ID가 올바르게 유지됨", async ({ page }) => {
  550 |     const textarea = page.locator('textarea');
  551 |     const submitButton = page.locator('button:has-text("이어서")');
  552 | 
  553 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  554 |     await submitButton.click();
  555 | 
  556 |     await page.waitForTimeout(1000);
```