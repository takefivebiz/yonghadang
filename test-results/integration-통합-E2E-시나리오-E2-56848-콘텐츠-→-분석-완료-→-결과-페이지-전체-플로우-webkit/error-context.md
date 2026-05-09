# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: integration.spec.ts >> 통합 E2E 시나리오 >> E2E-12: 모바일 환경 >> E2E-12: 모바일에서 홈 → 콘텐츠 → 분석 완료 → 결과 페이지 전체 플로우
- Location: tests/e2e/integration.spec.ts:457:5

# Error details

```
Error: page.goto: Could not connect to the server.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  361 |     await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
  362 | 
  363 |     const scenesInTab1 = await page.locator("[data-scene-idx]").count();
  364 |     const titleInTab1 = await page.locator("h1").first().textContent();
  365 | 
  366 |     // 2. 두 번째 탭 (같은 context → localStorage 공유)
  367 |     const page2 = await context.newPage();
  368 |     await page2.goto(`/result/${SESSION_ID}`);
  369 |     await expect(page2.locator("h2").first()).toBeVisible({ timeout: 8000 });
  370 | 
  371 |     const scenesInTab2 = await page2.locator("[data-scene-idx]").count();
  372 |     const titleInTab2 = await page2.locator("h1").first().textContent();
  373 | 
  374 |     // 3. 두 탭 데이터 일치 확인
  375 |     expect(scenesInTab1).toBe(TOTAL_SCENE_COUNT);
  376 |     expect(scenesInTab2).toBe(TOTAL_SCENE_COUNT);
  377 |     expect(titleInTab1).toBe(titleInTab2);
  378 | 
  379 |     // 두 탭 모두 같은 수의 lock CTA 표시
  380 |     const lockTab1 = await page.locator("[data-testid='scene-unlock-btn']").count();
  381 |     const lockTab2 = await page2.locator("[data-testid='scene-unlock-btn']").count();
  382 |     expect(lockTab1).toBe(lockTab2);
  383 |     expect(lockTab1).toBe(PAID_SCENE_COUNT);
  384 | 
  385 |     await page2.close();
  386 |   });
  387 | 
  388 |   // ── E2E-10: 공유 페이지 접근 (비인증 상태) ───────────────────────────
  389 |   test("E2E-10: /share/[id] 비인증 접근 → 공유 페이지 렌더링 + CTA 버튼 표시", async ({
  390 |     page,
  391 |   }) => {
  392 |     // 1. 분석 데이터 설정 + 로그아웃 상태 확보
  393 |     await setupAnalysis(page);
  394 |     await page.evaluate(() => {
  395 |       localStorage.removeItem("veil_user_id");
  396 |       sessionStorage.removeItem("guest_id");
  397 |     });
  398 | 
  399 |     // 2. /share/[session_id] 접근
  400 |     await page.goto(`/share/${SESSION_ID}`);
  401 | 
  402 |     // 로딩 스피너 사라질 때까지 대기
  403 |     await expect(page.locator(".animate-spin")).not.toBeVisible({
  404 |       timeout: 8000,
  405 |     });
  406 | 
  407 |     // 3. 공유 페이지 렌더링 확인 (무료 씬 내용 표시)
  408 |     await expect(page.locator("h2").first()).toBeVisible({ timeout: 5000 });
  409 | 
  410 |     // 4. 유료 씬 teaser 목록 확인
  411 |     const teaserItems = page.locator(
  412 |       "[data-testid='share-paid-teaser-item']",
  413 |     );
  414 |     await expect(teaserItems).toHaveCount(PAID_SCENE_COUNT);
  415 | 
  416 |     // 5. CTA 버튼 확인 (로그인/비회원 조회)
  417 |     const ctaSection = page.locator("[data-testid='share-cta-section']");
  418 |     await expect(ctaSection).toBeVisible();
  419 |     await expect(
  420 |       page.locator("[data-testid='share-cta-login-btn']"),
  421 |     ).toBeVisible();
  422 |     await expect(
  423 |       page.locator("[data-testid='share-cta-guest-btn']"),
  424 |     ).toBeVisible();
  425 | 
  426 |     // 6. /result/로 자동 리다이렉트 없음 (비인증 상태)
  427 |     expect(page.url()).toContain(`/share/${SESSION_ID}`);
  428 |   });
  429 | 
  430 |   // ── E2E-11: 공유 페이지 권한 있는 경우 → /result/ 자동 이동 ──────────
  431 |   test("E2E-11: /share/[id] 로그인 상태 접근 → /result/[id]로 자동 리다이렉트", async ({
  432 |     page,
  433 |   }) => {
  434 |     // 1. 분석 데이터 + 로그인 상태 설정
  435 |     await setupAnalysis(page);
  436 |     await page.evaluate(() => {
  437 |       localStorage.setItem("veil_user_id", "user-1");
  438 |     });
  439 | 
  440 |     // 2. /share/[session_id] 접근 → /result/[session_id]로 자동 이동
  441 |     await Promise.all([
  442 |       page.waitForURL(/\/result\//, { timeout: 10000 }),
  443 |       page.goto(`/share/${SESSION_ID}`),
  444 |     ]);
  445 | 
  446 |     // 3. /result/ URL 확인 및 씬 렌더링 확인
  447 |     expect(page.url()).toContain(`/result/${SESSION_ID}`);
  448 |     await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
  449 |     await expect(page.locator("[data-scene-idx]")).toHaveCount(TOTAL_SCENE_COUNT);
  450 |   });
  451 | 
  452 |   // ── E2E-12: 모바일 전체 플로우 ───────────────────────────────────────
  453 |   // 모바일(375px) 뷰포트 기준 전체 사용자 흐름 검증
  454 |   test.describe("E2E-12: 모바일 환경", () => {
  455 |     test.use({ viewport: { width: 375, height: 812 } });
  456 | 
  457 |     test("E2E-12: 모바일에서 홈 → 콘텐츠 → 분석 완료 → 결과 페이지 전체 플로우", async ({
  458 |       page,
  459 |     }) => {
  460 |       // 1. 홈: 콘텐츠 카드 표시 확인
> 461 |       await page.goto("/");
      |                  ^ Error: page.goto: Could not connect to the server.
  462 |       await expect(page.locator("h1").first()).toBeVisible({ timeout: 5000 });
  463 | 
  464 |       const firstCard = page.locator("a[href*='/content/']").first();
  465 |       await expect(firstCard).toBeVisible({ timeout: 5000 });
  466 |       await firstCard.click();
  467 |       await expect(page).toHaveURL(/\/content\//, { timeout: 5000 });
  468 | 
  469 |       // 2. 콘텐츠 상세 → 시작하기
  470 |       const ctaBtn = page.getByRole("button", { name: /시작하기/ });
  471 |       await expect(ctaBtn).toBeVisible({ timeout: 5000 });
  472 |       await ctaBtn.click();
  473 |       await expect(page).toHaveURL(/\/analyze\//, { timeout: 5000 });
  474 | 
  475 |       // 3. 분석 완료
  476 |       await completeAnalyzeFlow(page);
  477 | 
  478 |       // 4. 결과 페이지 확인
  479 |       expect(page.url()).toMatch(/\/result\//);
  480 |       await expect(
  481 |         page.locator("[data-scene-idx]"),
  482 |       ).toHaveCount(TOTAL_SCENE_COUNT);
  483 | 
  484 |       // 5. 모바일에서 결제 모달 열기 (전체 구매)
  485 |       const unlockAllBtn = page.locator(
  486 |         "[data-testid='flow-overview-unlock-all-btn']",
  487 |       );
  488 |       await unlockAllBtn.scrollIntoViewIfNeeded();
  489 |       await unlockAllBtn.click();
  490 | 
  491 |       const modal = page.locator("[data-testid='payment-modal']");
  492 |       await expect(modal).toBeVisible({ timeout: 5000 });
  493 | 
  494 |       // 모달이 뷰포트 내에 완전히 표시됨 (모바일 레이아웃 확인)
  495 |       const modalBox = await modal.boundingBox();
  496 |       expect(modalBox).not.toBeNull();
  497 |       expect(modalBox!.width).toBeLessThanOrEqual(375);
  498 | 
  499 |       // 6. 취소 버튼으로 닫기
  500 |       const cancelBtn = page.locator("[data-testid='payment-modal-cancel-btn']");
  501 |       await expect(cancelBtn).toBeVisible({ timeout: 5000 });
  502 |       await cancelBtn.click();
  503 |       await expect(modal).not.toBeVisible({ timeout: 3000 });
  504 |     });
  505 |   });
  506 | });
  507 | 
```