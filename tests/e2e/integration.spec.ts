import { test, expect, Page, devices } from "@playwright/test";

// ── 통합 테스트 타임아웃 (분석 흐름 포함 최대 60s) ───────────────────
test.setTimeout(60000);

// ── 상수 ─────────────────────────────────────────────────────────────
const CONTENT_ID = "love-1";
const SESSION_ID = "e2e-integ-001";
const PAID_SCENE_COUNT = 4;
const TOTAL_SCENE_COUNT = 6;
const FREE_SCENE_COUNT = 2;

// ── Helper: localStorage에 분석 데이터 설정 ──────────────────────────
const setupAnalysis = async (
  page: Page,
  sessionId: string = SESSION_ID,
  contentId: string = CONTENT_ID,
) => {
  await page.goto("/");
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    {
      key: `veil_analysis_${sessionId}`,
      value: {
        session_id: sessionId,
        content_id: contentId,
        free_input: "통합 테스트 입력",
        answers: [],
        created_at: new Date().toISOString(),
      },
    },
  );
};

// ── Helper: 결과 페이지 이동 (씬 렌더링 대기 포함) ─────────────────────
const gotoResult = async (
  page: Page,
  sessionId: string = SESSION_ID,
  queryString = "",
) => {
  await setupAnalysis(page, sessionId);
  await page.goto(`/result/${sessionId}${queryString}`);
  await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
};

// ── Helper: 분석 흐름 완료 (textarea 입력 → 보정 질문 → 완료) ──────────
const completeAnalyzeFlow = async (page: Page) => {
  await page.locator("textarea").fill(
    "자꾸 상대가 의심되고, 확인하면 안 되는 걸 알면서도 휴대폰을 확인하게 돼",
  );
  await page.locator('button:has-text("이어서")').click();

  // 반응 버블(4000ms) → 보정 질문으로 전환 대기
  const optionBtns = page.locator("div.space-y-2 button");
  await expect(optionBtns.first()).toBeVisible({ timeout: 8000 });

  // 최대 8회 반복으로 모든 보정 질문 답변
  for (let i = 0; i < 8; i++) {
    const completing = page.locator('h1:has-text("모든 질문이 끝났어")');
    if (await completing.isVisible({ timeout: 300 })) break;

    const btn = optionBtns.first();
    if (!(await btn.isVisible({ timeout: 2000 }))) break;

    await btn.click();
    const next = page
      .locator('button:has-text("다음"), button:has-text("완료")')
      .last();
    await expect(next).not.toBeDisabled({ timeout: 1500 });
    await next.click();
    await page.waitForTimeout(350);
  }

  // 분석 완료 → /result/ 리다이렉트 대기
  await page.waitForURL(/\/result\//, { timeout: 15000 });
  await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
};

// ── Helper: Google 소셜 로그인 mock ─────────────────────────────────
const loginWithGoogle = async (page: Page) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.removeItem("veil_user_id");
    sessionStorage.removeItem("redirect_to");
  });
  await page.goto("/auth");
  await expect(
    page.getByRole("button", { name: /Google로 계속하기/ }),
  ).toBeVisible({ timeout: 5000 });
  await Promise.all([
    page.waitForURL(/\/$/, { timeout: 8000 }),
    page.getByRole("button", { name: /Google로 계속하기/ }).click(),
  ]);
};

// ── Helper: 비회원 인증 (phone/PIN) ──────────────────────────────────
const authenticateAsGuest = async (page: Page) => {
  await page.goto("/");
  await page.goto("/guest");
  const phoneInput = page.locator('input[type="tel"]');
  await expect(phoneInput).toBeVisible({ timeout: 5000 });
  await phoneInput.fill("010-1234-5678");

  const pinInput = page.locator('input[type="password"]');
  await pinInput.fill("1234");

  const confirmBtn = page.getByRole("button", { name: "확인" });
  await expect(confirmBtn).not.toBeDisabled({ timeout: 2000 });
  await confirmBtn.click();

  // Step 2: 세션 목록 표시 대기
  await expect(
    page.locator("[data-testid='guest-session-item']").first(),
  ).toBeVisible({ timeout: 5000 });
};

// ─────────────────────────────────────────────────────────────────────
test.describe("통합 E2E 시나리오", () => {
  // ── E2E-01: 신규 비회원 전체 플로우 ──────────────────────────────────
  test("E2E-01: 홈 → 콘텐츠 → 분석 완료 → 결과 페이지 전체 플로우", async ({
    page,
  }) => {
    // 1. 홈 → 콘텐츠 카드 클릭
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 5000 });

    const firstCard = page.locator("a[href*='/content/']").first();
    await expect(firstCard).toBeVisible({ timeout: 5000 });
    await firstCard.click();
    await expect(page).toHaveURL(/\/content\//, { timeout: 5000 });

    // 2. 콘텐츠 상세 페이지 → "시작하기" CTA 클릭
    const ctaBtn = page.getByRole("button", { name: /시작하기/ });
    await expect(ctaBtn).toBeVisible({ timeout: 5000 });
    await ctaBtn.click();
    await expect(page).toHaveURL(/\/analyze\//, { timeout: 5000 });

    // 3. 분석 흐름 완료 → /result/ 리다이렉트 확인
    await completeAnalyzeFlow(page);

    // 4. 결과 페이지 검증
    expect(page.url()).toMatch(/\/result\//);
    const sceneWrappers = page.locator("[data-scene-idx]");
    await expect(sceneWrappers).toHaveCount(TOTAL_SCENE_COUNT);

    // 무료 씬 콘텐츠 표시
    const sceneMessages = page.locator("[data-testid='scene-messages']");
    await expect(sceneMessages).toHaveCount(FREE_SCENE_COUNT);

    // 유료 씬 lock CTA 표시
    const lockBtns = page.locator("[data-testid='scene-unlock-btn']");
    await expect(lockBtns).toHaveCount(PAID_SCENE_COUNT);
  });

  // ── E2E-02: 신규 비회원 전체 구매 플로우 ─────────────────────────────
  test("E2E-02: 결과 페이지 → 전체 구매 모달 → 결제 성공 → 모든 Scene unlock", async ({
    page,
  }) => {
    // 1. 결과 페이지 진입 (localStorage 방식)
    await gotoResult(page);

    // 2. FlowOverview '전체 흐름 열기' 버튼 확인
    const unlockAllBtn = page.locator(
      "[data-testid='flow-overview-unlock-all-btn']",
    );
    await expect(unlockAllBtn).toBeVisible();

    // 3. 결제 모달 열기 → 2,900원 가격 확인
    await unlockAllBtn.click();
    const modal = page.locator("[data-testid='payment-modal']");
    await expect(modal).toBeVisible({ timeout: 5000 });
    const priceEl = page.locator("[data-testid='payment-modal-price']");
    await expect(priceEl).toContainText("2,900");

    // 4. 모달 닫기
    await page.locator("[data-testid='payment-modal-close-btn']").click();
    await expect(modal).not.toBeVisible({ timeout: 3000 });

    // 5. URL 파라미터 방식으로 전체 결제 성공 mock
    await page.goto(`/result/${SESSION_ID}?payment_success=true&paymentType=all&orderId=e2e-02-order`);
    await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });

    // 6. 모든 유료 씬 unlock 확인
    const allSceneMessages = page.locator("[data-testid='scene-messages']");
    await expect(allSceneMessages).toHaveCount(TOTAL_SCENE_COUNT);

    // FlowOverview 완료 메시지
    await expect(
      page.locator("text=전체 흐름이 열렸어. 계속 읽어봐"),
    ).toBeVisible();

    // URL 파라미터 정리됨
    expect(page.url()).not.toContain("payment_success");
  });

  // ── E2E-03: 비회원 재조회 플로우 ─────────────────────────────────────
  test("E2E-03: /guest → phone/PIN 인증 → 세션 선택 → 결과/공유 페이지 이동", async ({
    page,
  }) => {
    // 1. 비회원 인증
    await authenticateAsGuest(page);

    // Step 2: 세션 목록 2개 확인 (guest-1 기준)
    const sessionItems = page.locator("[data-testid='guest-session-item']");
    const count = await sessionItems.count();
    expect(count).toBeGreaterThan(0);

    // 2. 첫 번째 세션 클릭 → /share 또는 /result 이동
    await sessionItems.first().click();

    // 결과 또는 공유 페이지로 이동 (share → result 자동 리다이렉트 포함)
    await page.waitForURL(/\/(share|result)\//, { timeout: 8000 });
    expect(page.url()).toMatch(/\/(share|result)\//);
  });

  // ── E2E-04: 소셜 로그인 회원 플로우 ──────────────────────────────────
  test("E2E-04: /auth → Google 로그인 → 홈 이동 → 마이페이지 프로필 확인", async ({
    page,
  }) => {
    // 1. Google 로그인
    await loginWithGoogle(page);

    // 홈으로 이동 확인
    expect(page.url()).toMatch(/localhost:3000\/$/);

    // localStorage veil_user_id 설정 확인
    const userId = await page.evaluate(() =>
      localStorage.getItem("veil_user_id"),
    );
    expect(userId).toBe("user-1");

    // 2. /my-page 이동
    await page.goto("/my-page");
    await expect(page.locator("h1")).toContainText("마이페이지", {
      timeout: 5000,
    });

    // 3. 프로필 정보 확인
    await expect(page.locator("text=jane_lee")).toBeVisible();
    await expect(page.locator("text=jane@example.com")).toBeVisible();

    // 4. 지난 기록 섹션 확인
    const sessionLinks = page.locator("a[href*='/result/']");
    await expect(sessionLinks.first()).toBeVisible();
  });

  // ── E2E-06: 동일 세션 재접근 (localStorage 유지 확인) ─────────────────
  test("E2E-06: 결과 페이지 → 홈으로 이동 → 재접근 시 데이터 유지됨", async ({
    page,
  }) => {
    // 1. 결과 페이지 접근
    await gotoResult(page);
    const sceneCount = await page.locator("[data-scene-idx]").count();
    expect(sceneCount).toBe(TOTAL_SCENE_COUNT);

    // 2. 홈으로 이동
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 5000 });

    // 3. 재접근: localStorage 데이터 유지 확인
    await page.goto(`/result/${SESSION_ID}`);
    await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });

    // 씬 데이터가 그대로 유지됨
    await expect(page.locator("[data-scene-idx]")).toHaveCount(TOTAL_SCENE_COUNT);
    await expect(page.locator("[data-testid='scene-messages']")).toHaveCount(FREE_SCENE_COUNT);

    // URL 정상 유지
    expect(page.url()).toContain(`/result/${SESSION_ID}`);
  });

  // ── E2E-07: 개별 구매 후 전체 구매 차액 플로우 ───────────────────────
  test("E2E-07: 개별 Scene 구매 → 전체 구매 모달(차액 없이 2,900원) → 전체 unlock", async ({
    page,
  }) => {
    // 1. sceneIndex=3 개별 구매 완료 상태로 진입
    await gotoResult(
      page,
      SESSION_ID,
      "?payment_success=true&paymentType=single&sceneIndex=3&orderId=e2e-07-single",
    );

    // 개별 unlock 확인 (3개 messages: 무료 2 + 유료 1)
    await expect(
      page.locator("[data-testid='scene-messages']"),
    ).toHaveCount(FREE_SCENE_COUNT + 1);
    // 남은 lock CTA = 3개
    await expect(
      page.locator("[data-testid='scene-unlock-btn']"),
    ).toHaveCount(PAID_SCENE_COUNT - 1);

    // 2. 전체 구매 모달 → 차액 없이 2,900원 확인 (현재 구현 한계)
    const unlockAllBtn = page.locator(
      "[data-testid='flow-overview-unlock-all-btn']",
    );
    await expect(unlockAllBtn).toBeVisible();
    await unlockAllBtn.click();

    const modal = page.locator("[data-testid='payment-modal']");
    await expect(modal).toBeVisible({ timeout: 5000 });
    const priceEl = page.locator("[data-testid='payment-modal-price']");
    await expect(priceEl).toContainText("2,900"); // 차액 아닌 전액 표시
    await page.locator("[data-testid='payment-modal-close-btn']").click();

    // 3. 전체 구매 성공 mock → 모든 Scene unlock
    await page.goto(
      `/result/${SESSION_ID}?payment_success=true&paymentType=all&orderId=e2e-07-all`,
    );
    await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });

    await expect(
      page.locator("[data-testid='scene-messages']"),
    ).toHaveCount(TOTAL_SCENE_COUNT);
    await expect(
      page.locator("text=전체 흐름이 열렸어. 계속 읽어봐"),
    ).toBeVisible();
  });

  // ── E2E-08: 비회원 → 로그인 전환 후 마이페이지 접근 ─────────────────
  test("E2E-08: 분석 세션 생성 → 로그인 → 마이페이지(기존 더미 세션 표시, 연결 미지원)", async ({
    page,
  }) => {
    // 1. 분석 데이터를 localStorage에 설정 (guest 분석 시뮬레이션)
    await setupAnalysis(page, "e2e-08-guest-session");

    // 분석 데이터 존재 확인
    const analysisStored = await page.evaluate(() =>
      localStorage.getItem("veil_analysis_e2e-08-guest-session"),
    );
    expect(analysisStored).not.toBeNull();

    // 2. 로그인 (social mock)
    await loginWithGoogle(page);
    const userId = await page.evaluate(() =>
      localStorage.getItem("veil_user_id"),
    );
    expect(userId).toBe("user-1");

    // 3. 마이페이지 → 프로필 및 더미 세션 표시 확인
    await page.goto("/my-page");
    await expect(page.locator("h1")).toContainText("마이페이지", {
      timeout: 5000,
    });

    // user-1의 더미 세션 표시 (guest 세션이 아닌 user-1 기준 더미 데이터)
    const sessionLinks = page.locator("a[href*='/result/']");
    await expect(sessionLinks.first()).toBeVisible();

    // NOTE: 로그인 전 guest 분석 세션(e2e-08-guest-session)은
    // 마이페이지 지난 기록에 연결되지 않음 → 백엔드 연동 후 세션 병합 구현 필요
  });

  // ── E2E-09: 여러 탭에서 동일 세션 접근 ──────────────────────────────
  test("E2E-09: 동일 분석 세션을 여러 탭에서 열면 동일한 데이터가 표시된다", async ({
    page,
    context,
  }) => {
    // 1. 첫 번째 탭: 세션 설정 + 결과 페이지
    await setupAnalysis(page, SESSION_ID);
    await page.goto(`/result/${SESSION_ID}`);
    await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });

    const scenesInTab1 = await page.locator("[data-scene-idx]").count();
    const titleInTab1 = await page.locator("h1").first().textContent();

    // 2. 두 번째 탭 (같은 context → localStorage 공유)
    const page2 = await context.newPage();
    await page2.goto(`/result/${SESSION_ID}`);
    await expect(page2.locator("h2").first()).toBeVisible({ timeout: 8000 });

    const scenesInTab2 = await page2.locator("[data-scene-idx]").count();
    const titleInTab2 = await page2.locator("h1").first().textContent();

    // 3. 두 탭 데이터 일치 확인
    expect(scenesInTab1).toBe(TOTAL_SCENE_COUNT);
    expect(scenesInTab2).toBe(TOTAL_SCENE_COUNT);
    expect(titleInTab1).toBe(titleInTab2);

    // 두 탭 모두 같은 수의 lock CTA 표시
    const lockTab1 = await page.locator("[data-testid='scene-unlock-btn']").count();
    const lockTab2 = await page2.locator("[data-testid='scene-unlock-btn']").count();
    expect(lockTab1).toBe(lockTab2);
    expect(lockTab1).toBe(PAID_SCENE_COUNT);

    await page2.close();
  });

  // ── E2E-10: 공유 페이지 접근 (비인증 상태) ───────────────────────────
  test("E2E-10: /share/[id] 비인증 접근 → 공유 페이지 렌더링 + CTA 버튼 표시", async ({
    page,
  }) => {
    // 1. 분석 데이터 설정 + 로그아웃 상태 확보
    await setupAnalysis(page);
    await page.evaluate(() => {
      localStorage.removeItem("veil_user_id");
      sessionStorage.removeItem("guest_id");
    });

    // 2. /share/[session_id] 접근
    await page.goto(`/share/${SESSION_ID}`);

    // 로딩 스피너 사라질 때까지 대기
    await expect(page.locator(".animate-spin")).not.toBeVisible({
      timeout: 8000,
    });

    // 3. 공유 페이지 렌더링 확인 (무료 씬 내용 표시)
    await expect(page.locator("h2").first()).toBeVisible({ timeout: 5000 });

    // 4. 유료 씬 teaser 목록 확인
    const teaserItems = page.locator(
      "[data-testid='share-paid-teaser-item']",
    );
    await expect(teaserItems).toHaveCount(PAID_SCENE_COUNT);

    // 5. CTA 버튼 확인 (로그인/비회원 조회)
    const ctaSection = page.locator("[data-testid='share-cta-section']");
    await expect(ctaSection).toBeVisible();
    await expect(
      page.locator("[data-testid='share-cta-login-btn']"),
    ).toBeVisible();
    await expect(
      page.locator("[data-testid='share-cta-guest-btn']"),
    ).toBeVisible();

    // 6. /result/로 자동 리다이렉트 없음 (비인증 상태)
    expect(page.url()).toContain(`/share/${SESSION_ID}`);
  });

  // ── E2E-11: 공유 페이지 권한 있는 경우 → /result/ 자동 이동 ──────────
  test("E2E-11: /share/[id] 로그인 상태 접근 → /result/[id]로 자동 리다이렉트", async ({
    page,
  }) => {
    // 1. 분석 데이터 + 로그인 상태 설정
    await setupAnalysis(page);
    await page.evaluate(() => {
      localStorage.setItem("veil_user_id", "user-1");
    });

    // 2. /share/[session_id] 접근 → /result/[session_id]로 자동 이동
    await Promise.all([
      page.waitForURL(/\/result\//, { timeout: 10000 }),
      page.goto(`/share/${SESSION_ID}`),
    ]);

    // 3. /result/ URL 확인 및 씬 렌더링 확인
    expect(page.url()).toContain(`/result/${SESSION_ID}`);
    await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator("[data-scene-idx]")).toHaveCount(TOTAL_SCENE_COUNT);
  });

  // ── E2E-12: 모바일 전체 플로우 ───────────────────────────────────────
  // 모바일(375px) 뷰포트 기준 전체 사용자 흐름 검증
  test.describe("E2E-12: 모바일 환경", () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test("E2E-12: 모바일에서 홈 → 콘텐츠 → 분석 완료 → 결과 페이지 전체 플로우", async ({
      page,
    }) => {
      // 1. 홈: 콘텐츠 카드 표시 확인
      await page.goto("/");
      await expect(page.locator("h1").first()).toBeVisible({ timeout: 5000 });

      const firstCard = page.locator("a[href*='/content/']").first();
      await expect(firstCard).toBeVisible({ timeout: 5000 });
      await firstCard.click();
      await expect(page).toHaveURL(/\/content\//, { timeout: 5000 });

      // 2. 콘텐츠 상세 → 시작하기
      const ctaBtn = page.getByRole("button", { name: /시작하기/ });
      await expect(ctaBtn).toBeVisible({ timeout: 5000 });
      await ctaBtn.click();
      await expect(page).toHaveURL(/\/analyze\//, { timeout: 5000 });

      // 3. 분석 완료
      await completeAnalyzeFlow(page);

      // 4. 결과 페이지 확인
      expect(page.url()).toMatch(/\/result\//);
      await expect(
        page.locator("[data-scene-idx]"),
      ).toHaveCount(TOTAL_SCENE_COUNT);

      // 5. 모바일에서 결제 모달 열기 (전체 구매)
      const unlockAllBtn = page.locator(
        "[data-testid='flow-overview-unlock-all-btn']",
      );
      await unlockAllBtn.scrollIntoViewIfNeeded();
      await unlockAllBtn.click();

      const modal = page.locator("[data-testid='payment-modal']");
      await expect(modal).toBeVisible({ timeout: 5000 });

      // 모달이 뷰포트 내에 완전히 표시됨 (모바일 레이아웃 확인)
      const modalBox = await modal.boundingBox();
      expect(modalBox).not.toBeNull();
      expect(modalBox!.width).toBeLessThanOrEqual(375);

      // 6. 취소 버튼으로 닫기
      const cancelBtn = page.locator("[data-testid='payment-modal-cancel-btn']");
      await expect(cancelBtn).toBeVisible({ timeout: 5000 });
      await cancelBtn.click();
      await expect(modal).not.toBeVisible({ timeout: 3000 });
    });
  });
});
