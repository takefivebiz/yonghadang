import { test, expect, Page } from "@playwright/test";

// ── 상수 ──────────────────────────────────────────────────────────────
const SHARE_ID = "test-share-page-sh01";
const CONTENT_ID = "love-1";

// love-1: 무료 2개, 유료 4개
const FREE_SCENE_COUNT = 2;
const PAID_TEASER_COUNT = 4;

// ── Helper: localStorage 세팅 후 공유 페이지 이동 (권한 없는 상태) ──────
const gotoShareWithData = async (
  page: Page,
  shareId = SHARE_ID,
  contentId = CONTENT_ID,
) => {
  await page.goto("/");
  // veil_user_id, guest_id 없는 순수 비권한 상태 보장
  await page.evaluate(() => {
    localStorage.removeItem("veil_user_id");
    sessionStorage.removeItem("guest_id");
  });
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    {
      key: `veil_analysis_${shareId}`,
      value: {
        session_id: shareId,
        content_id: contentId,
        free_input: "테스트 입력",
        answers: [],
        created_at: new Date().toISOString(),
      },
    },
  );
  await page.goto(`/share/${shareId}`);
  // 로딩 스피너가 사라질 때까지 대기 (loading=false 시점)
  await expect(page.locator(".animate-spin")).not.toBeVisible({ timeout: 8000 });
};

// ─────────────────────────────────────────────────────────────────────────
test.describe("SH: 공유 페이지 (/share/[share_id])", () => {
  // ── SH-01: 유효한 share_id → 씬 렌더링 ──────────────────────────────
  test("SH-01: 유효한 share_id 접근 시 콘텐츠가 렌더링된다", async ({
    page,
  }) => {
    await gotoShareWithData(page);
    // 무료 씬 제목(h2)이 최소 1개 이상 보임
    await expect(page.locator("h2").first()).toBeVisible();
  });

  // ── SH-02: localStorage 데이터 없음 → 에러 ──────────────────────────
  test("SH-02: localStorage 데이터 없으면 에러 메시지가 표시된다", async ({
    page,
  }) => {
    await page.goto("/share/nonexistent-share-id-9999");
    await expect(
      page.locator("text=공유된 결과를 찾을 수 없어"),
    ).toBeVisible({ timeout: 8000 });
    await expect(page.locator("text=처음으로 돌아가기")).toBeVisible();
  });

  // ── SH-03: 잘못된 share_id → 에러 ────────────────────────────────────
  test("SH-03: 잘못된 share_id 접근 시 에러 메시지가 표시된다", async ({
    page,
  }) => {
    // 다른 share_id 데이터는 있어도 요청한 share_id가 없으면 에러
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "veil_analysis_other-id",
        JSON.stringify({ session_id: "other-id", content_id: "love-1" }),
      );
    });
    await page.goto("/share/wrong-share-id-xyz");
    await expect(
      page.locator("text=공유된 결과를 찾을 수 없어"),
    ).toBeVisible({ timeout: 8000 });
  });

  // ── SH-04: 로딩 완료 후 스피너 사라짐 ────────────────────────────────
  test("SH-04: 로딩 완료 후 스피너가 사라지고 콘텐츠가 나타난다", async ({
    page,
  }) => {
    await gotoShareWithData(page);
    await expect(page.locator(".animate-spin")).not.toBeVisible({
      timeout: 8000,
    });
    await expect(page.locator("main").first()).toBeVisible();
  });

  // ── SH-05: 썸네일 / 제목 / 부제 렌더링 ────────────────────────────────
  test("SH-05: 콘텐츠 썸네일·제목(h1)·부제(subtitle)가 렌더링된다", async ({
    page,
  }) => {
    await gotoShareWithData(page);

    // h1 제목
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("사랑");

    // 부제 — subtitle 텍스트 확인
    await expect(page.locator("text=집착인지 아닌지 판단하는 기준")).toBeVisible();

    // 썸네일 img (Next.js Image)
    await expect(page.locator("img[alt]").first()).toBeVisible();
  });

  // ── SH-06: 무료 씬 전체 노출 ─────────────────────────────────────────
  test("SH-06: 무료 씬은 전체 내용(scene-messages)이 렌더링된다", async ({
    page,
  }) => {
    await gotoShareWithData(page);

    const freeMessages = page.locator("[data-testid='scene-messages']");
    await expect(freeMessages).toHaveCount(FREE_SCENE_COUNT);
    await expect(freeMessages.first()).toBeVisible();
  });

  // ── SH-07: 유료 씬 제목 teaser 표시 ──────────────────────────────────
  test("SH-07: 유료 씬 제목이 teaser로 표시된다", async ({ page }) => {
    await gotoShareWithData(page);

    const teaserItems = page.locator(
      "[data-testid='share-paid-teaser-item']",
    );
    await expect(teaserItems).toHaveCount(PAID_TEASER_COUNT);
    // 첫 번째 유료 씬 제목 확인 (love-1 씬 3)
    await expect(
      page.locator("text=반복되는 불안의 패턴"),
    ).toBeVisible();
  });

  // ── SH-08: 아래로 갈수록 opacity 감소 ────────────────────────────────
  test("SH-08: 유료 씬 teaser는 아래로 갈수록 opacity가 낮아진다", async ({
    page,
  }) => {
    await gotoShareWithData(page);

    const teaserItems = page.locator(
      "[data-testid='share-paid-teaser-item']",
    );
    const count = await teaserItems.count();
    expect(count).toBeGreaterThan(1);

    // 첫 번째 vs 마지막 opacity 비교
    const firstOpacity = await teaserItems.first().evaluate(
      (el) => parseFloat((el as HTMLElement).style.opacity),
    );
    const lastOpacity = await teaserItems.last().evaluate(
      (el) => parseFloat((el as HTMLElement).style.opacity),
    );

    expect(firstOpacity).toBeGreaterThan(lastOpacity);
  });

  // ── SH-09: 유료 핵심 내용 비노출 ─────────────────────────────────────
  test("SH-09: 공유 페이지에서 유료 씬의 핵심 내용이 노출되지 않는다", async ({
    page,
  }) => {
    await gotoShareWithData(page);

    // scene-messages는 무료 씬 수만큼만 존재
    const allMessages = page.locator("[data-testid='scene-messages']");
    await expect(allMessages).toHaveCount(FREE_SCENE_COUNT);

    // scene-preview-messages(blur 콘텐츠), scene-unlock-btn(개별 구매)은 없어야 함
    await expect(
      page.locator("[data-testid='scene-preview-messages']"),
    ).toHaveCount(0);
    await expect(
      page.locator("[data-testid='scene-unlock-btn']"),
    ).toHaveCount(0);
  });

  // ── SH-10: "로그인 하기" → /auth 이동 + redirect_to 저장 ─────────────
  test("SH-10: '로그인 하기' 클릭 시 /auth로 이동하고 redirect_to가 sessionStorage에 저장된다", async ({
    page,
  }) => {
    await gotoShareWithData(page);

    const loginBtn = page.locator("[data-testid='share-cta-login-btn']");
    await loginBtn.scrollIntoViewIfNeeded();

    // /auth로 이동 감지 (window.location.href 사용으로 full navigation)
    await Promise.all([
      page.waitForURL(/\/auth/, { timeout: 5000 }),
      loginBtn.click(),
    ]);

    // sessionStorage.redirect_to에 공유 페이지 URL이 저장되어 있는지 확인
    const redirectTo = await page.evaluate(() =>
      sessionStorage.getItem("redirect_to"),
    );
    expect(redirectTo).not.toBeNull();
    expect(redirectTo).toContain(`/share/${SHARE_ID}`);
  });

  // ── SH-11: "비회원 조회하기" → /guest 이동 + redirect_to 저장 ─────────
  test("SH-11: '비회원 조회하기' 클릭 시 /guest로 이동하고 redirect_to가 sessionStorage에 저장된다", async ({
    page,
  }) => {
    await gotoShareWithData(page);

    const guestBtn = page.locator("[data-testid='share-cta-guest-btn']");
    await guestBtn.scrollIntoViewIfNeeded();

    await Promise.all([
      page.waitForURL(/\/guest/, { timeout: 5000 }),
      guestBtn.click(),
    ]);

    const redirectTo = await page.evaluate(() =>
      sessionStorage.getItem("redirect_to"),
    );
    expect(redirectTo).not.toBeNull();
    expect(redirectTo).toContain(`/share/${SHARE_ID}`);
  });

  // ── SH-12: "이어서 보려면" CTA 문구 표시 ─────────────────────────────
  test("SH-12: CTA 섹션에 '이어서 보려면' 문구가 표시된다", async ({
    page,
  }) => {
    await gotoShareWithData(page);

    const ctaSection = page.locator("[data-testid='share-cta-section']");
    await expect(ctaSection).toBeVisible();
    await expect(page.locator("text=이어서 보려면")).toBeVisible();

    // 두 CTA 버튼 모두 보임
    await expect(
      page.locator("[data-testid='share-cta-login-btn']"),
    ).toBeVisible();
    await expect(
      page.locator("[data-testid='share-cta-guest-btn']"),
    ).toBeVisible();
  });

  // ── SH-13: 버튼 hover 스타일 변화 ────────────────────────────────────
  test("SH-13: '로그인 하기' 버튼 hover 시 배경 opacity가 증가한다", async ({
    page,
  }) => {
    await gotoShareWithData(page);

    const loginBtn = page.locator("[data-testid='share-cta-login-btn']");
    await loginBtn.scrollIntoViewIfNeeded();

    // hover 전 배경색
    const bgBefore = await loginBtn.evaluate(
      (el) => (el as HTMLElement).style.background,
    );

    // hover
    await loginBtn.hover();

    // hover 후 배경색
    const bgAfter = await loginBtn.evaluate(
      (el) => (el as HTMLElement).style.background,
    );

    // 배경색이 변경되었는지 확인
    expect(bgAfter).not.toBe(bgBefore);
    // hover 후 더 밝아져야 함 (0.25 > 0.15)
    expect(bgAfter).toContain("0.25");
  });

  // ── SH-14: 로그인 상태(veil_user_id 있음) → /result 자동 이동 ─────────
  test("SH-14: veil_user_id가 있으면 /result/[session_id]로 자동 이동한다", async ({
    page,
  }) => {
    // 분석 데이터 + 로그인 상태 함께 세팅
    await page.goto("/");
    await page.evaluate(
      ({ shareId, contentId }) => {
        const data = {
          session_id: shareId,
          content_id: contentId,
          free_input: "테스트",
          answers: [],
          created_at: new Date().toISOString(),
        };
        localStorage.setItem(
          `veil_analysis_${shareId}`,
          JSON.stringify(data),
        );
        // 로그인 상태 설정
        localStorage.setItem("veil_user_id", "test-user-sh14");
      },
      { shareId: SHARE_ID, contentId: CONTENT_ID },
    );

    // 공유 페이지 접근 → /result로 자동 redirect 기대
    await page.goto(`/share/${SHARE_ID}`);
    await page.waitForURL(/\/result\//, { timeout: 8000 });

    expect(page.url()).toContain(`/result/${SHARE_ID}`);

    // 정리: 이후 테스트에 영향 없도록 user_id 제거
    await page.evaluate(() => localStorage.removeItem("veil_user_id"));
  });

  // ── SH-15: 비회원 인증 상태(guest_id 있음) → /result 자동 이동 ─────────
  test("SH-15: sessionStorage에 guest_id가 있으면 /result/[session_id]로 자동 이동한다", async ({
    page,
  }) => {
    // 분석 데이터 + 비회원 인증 상태 함께 세팅
    await page.goto("/");
    await page.evaluate(
      ({ shareId, contentId }) => {
        const data = {
          session_id: shareId,
          content_id: contentId,
          free_input: "테스트",
          answers: [],
          created_at: new Date().toISOString(),
        };
        localStorage.setItem(
          `veil_analysis_${shareId}`,
          JSON.stringify(data),
        );
        // 비회원 인증 상태 설정 (sessionStorage)
        sessionStorage.setItem("guest_id", "test-guest-sh15");
      },
      { shareId: SHARE_ID, contentId: CONTENT_ID },
    );

    await page.goto(`/share/${SHARE_ID}`);
    await page.waitForURL(/\/result\//, { timeout: 8000 });

    expect(page.url()).toContain(`/result/${SHARE_ID}`);

    // 정리
    await page.evaluate(() => sessionStorage.removeItem("guest_id"));
  });
});
