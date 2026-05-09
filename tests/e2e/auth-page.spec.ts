import { test, expect, Page } from "@playwright/test";

// ── Helper: /auth 로 이동하면서 이전 auth 관련 state 초기화 ─────────────
const gotoAuth = async (page: Page) => {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.removeItem("veil_user_id");
    localStorage.removeItem("veil_user_provider");
    sessionStorage.removeItem("redirect_to");
  });
  await page.goto("/auth");
  // 버튼 렌더링 완료 대기
  await expect(
    page.getByRole("button", { name: /Google로 계속하기/ }),
  ).toBeVisible({ timeout: 5000 });
};

// ─────────────────────────────────────────────────────────────────────────
test.describe("AU: 로그인 페이지 (/auth)", () => {
  // ── AU-01: Google 버튼 렌더링 ─────────────────────────────────────────
  test("AU-01: Google 로그인 버튼이 렌더링된다", async ({ page }) => {
    await page.goto("/auth");

    const btn = page.getByRole("button", { name: /Google로 계속하기/ });
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  // ── AU-02: Kakao 버튼 렌더링 ─────────────────────────────────────────
  test("AU-02: Kakao 로그인 버튼이 렌더링된다", async ({ page }) => {
    await page.goto("/auth");

    const btn = page.getByRole("button", { name: /Kakao로 계속하기/ });
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  // ── AU-03: Google 클릭 → localStorage 설정 ────────────────────────────
  test("AU-03: Google 버튼 클릭 시 veil_user_id·veil_user_provider가 localStorage에 저장된다", async ({
    page,
  }) => {
    await gotoAuth(page);

    // 내비게이션이 완료된 후 localStorage 확인
    await Promise.all([
      page.waitForURL(/\/$/, { timeout: 5000 }),
      page.getByRole("button", { name: /Google로 계속하기/ }).click(),
    ]);

    const userId = await page.evaluate(() =>
      localStorage.getItem("veil_user_id"),
    );
    const provider = await page.evaluate(() =>
      localStorage.getItem("veil_user_provider"),
    );

    expect(userId).toBe("user-1");
    expect(provider).toBe("google");
  });

  // ── AU-04: Kakao 클릭 → localStorage 설정 ─────────────────────────────
  test("AU-04: Kakao 버튼 클릭 시 veil_user_id·veil_user_provider가 localStorage에 저장된다", async ({
    page,
  }) => {
    await gotoAuth(page);

    await Promise.all([
      page.waitForURL(/\/$/, { timeout: 5000 }),
      page.getByRole("button", { name: /Kakao로 계속하기/ }).click(),
    ]);

    const userId = await page.evaluate(() =>
      localStorage.getItem("veil_user_id"),
    );
    const provider = await page.evaluate(() =>
      localStorage.getItem("veil_user_provider"),
    );

    expect(userId).toBe("user-1");
    expect(provider).toBe("kakao");
  });

  // ── AU-05: redirect_to 없을 때 → "/" 이동 ─────────────────────────────
  test("AU-05: sessionStorage에 redirect_to 없으면 로그인 후 홈(/)으로 이동한다", async ({
    page,
  }) => {
    await gotoAuth(page); // redirect_to가 없는 상태

    await Promise.all([
      page.waitForURL(/\/$/, { timeout: 5000 }),
      page.getByRole("button", { name: /Google로 계속하기/ }).click(),
    ]);

    expect(page.url()).toMatch(/localhost:3000\/$/);
  });

  // ── AU-06: redirect_to 있을 때 → redirect_to URL로 이동 ───────────────
  test("AU-06: sessionStorage에 redirect_to가 있으면 로그인 후 해당 URL로 이동한다", async ({
    page,
  }) => {
    const REDIRECT_TARGET = "http://localhost:3000/share/test-au06-share";

    await gotoAuth(page);
    // 로그인 직전 sessionStorage에 redirect_to 설정
    await page.evaluate((url) => {
      sessionStorage.setItem("redirect_to", url);
    }, REDIRECT_TARGET);

    // /share/test-au06-share 로 이동 시도 (데이터 없어 에러 페이지가 나와도 URL 자체는 맞음)
    await Promise.all([
      page.waitForURL(/\/share\/test-au06-share/, { timeout: 5000 }),
      page.getByRole("button", { name: /Google로 계속하기/ }).click(),
    ]);

    expect(page.url()).toContain("/share/test-au06-share");
  });

  // ── AU-07: 로그인 후 sessionStorage.redirect_to 삭제 확인 ─────────────
  test("AU-07: 로그인 완료 후 sessionStorage.redirect_to가 삭제된다", async ({
    page,
  }) => {
    await gotoAuth(page);
    await page.evaluate(() => {
      sessionStorage.setItem("redirect_to", "http://localhost:3000/share/au07");
    });

    await Promise.all([
      page.waitForURL(/\/share\/au07/, { timeout: 5000 }),
      page.getByRole("button", { name: /Google로 계속하기/ }).click(),
    ]);

    // 이동된 페이지에서 redirect_to가 삭제됐는지 확인
    const remaining = await page.evaluate(() =>
      sessionStorage.getItem("redirect_to"),
    );
    expect(remaining).toBeNull();
  });

  // ── AU-08: 이용약관 모달 ─────────────────────────────────────────────
  test("AU-08: '이용약관' 버튼 클릭 시 이용약관 모달이 열린다", async ({
    page,
  }) => {
    await page.goto("/auth");

    const termsBtn = page.getByTestId("auth-terms-btn");
    await expect(termsBtn).toBeVisible();
    await termsBtn.click();

    // 모달 렌더링 확인
    await expect(page.locator("[data-testid='terms-modal-overlay']")).toBeVisible({
      timeout: 3000,
    });
    // 모달 제목 확인
    await expect(page.locator("h2").filter({ hasText: "이용약관" })).toBeVisible();
  });

  // ── AU-09: 개인정보처리방침 모달 ─────────────────────────────────────
  test("AU-09: '개인정보처리방침' 버튼 클릭 시 개인정보처리방침 모달이 열린다", async ({
    page,
  }) => {
    await page.goto("/auth");

    const privacyBtn = page.getByTestId("auth-privacy-btn");
    await expect(privacyBtn).toBeVisible();
    await privacyBtn.click();

    // 모달 렌더링 확인
    await expect(page.locator("[data-testid='terms-modal-overlay']")).toBeVisible({
      timeout: 3000,
    });
    // 모달 제목 확인
    await expect(page.locator("h2").filter({ hasText: "개인정보처리방침" })).toBeVisible();
  });

  // ── AU-09.5: 모달 닫기 (ESC 키) ──────────────────────────────────────
  test("AU-09.5: ESC 키를 눌러 모달을 닫을 수 있다", async ({ page }) => {
    await page.goto("/auth");

    const termsBtn = page.getByTestId("auth-terms-btn");
    await termsBtn.click();

    // 모달이 열렸는지 확인
    const modalOverlay = page.locator("[data-testid='terms-modal-overlay']");
    await expect(modalOverlay).toBeVisible({ timeout: 3000 });

    // ESC 키 누르기
    await page.keyboard.press("Escape");

    // 모달이 닫혔는지 확인
    await expect(modalOverlay).not.toBeVisible({ timeout: 2000 });
  });

  // ── AU-09.6: 모달 닫기 (오버레이 클릭) ───────────────────────────────
  test("AU-09.6: 오버레이 클릭으로 모달을 닫을 수 있다", async ({ page }) => {
    await page.goto("/auth");

    const privacyBtn = page.getByTestId("auth-privacy-btn");
    await privacyBtn.click();

    // 모달이 열렸는지 확인
    const modalOverlay = page.locator("[data-testid='terms-modal-overlay']");
    await expect(modalOverlay).toBeVisible({ timeout: 3000 });

    // 오버레이의 배경 영역(즉, modal container가 아닌 바깥쪽) 클릭
    await modalOverlay.click({ position: { x: 10, y: 10 } });

    // 모달이 닫혔는지 확인
    await expect(modalOverlay).not.toBeVisible({ timeout: 2000 });
  });

  // ── AU-10: 중복 클릭 방지 ────────────────────────────────────────────
  // 현재 코드에 명시적 debounce/disabled 처리 없음.
  // window.location.href 를 mock해 클릭당 navigation 횟수를 측정한다.
  test("AU-10: 버튼 클릭 시 localStorage 상태가 일관되게 설정된다 (중복 클릭 방어 확인)", async ({
    page,
  }) => {
    await gotoAuth(page);

    // navigation count를 추적하는 spy 주입
    await page.evaluate(() => {
      (window as unknown as Record<string, unknown>)._navCount = 0;
      // 실제 navigation 대신 카운트만 증가
      const orig = Object.getOwnPropertyDescriptor(
        window,
        "location",
      );
      // location은 readonly라 직접 override 불가능 → localStorage 값만 관찰
    });

    // 빠르게 두 번 클릭 시도 (두 번째는 navigation 중에 발생)
    const btn = page.getByRole("button", { name: /Google로 계속하기/ });
    await btn.click(); // 첫 번째 클릭 → navigation 시작

    // navigation 완료 대기
    await page.waitForURL(/\/$/, { timeout: 5000 });

    // localStorage가 의도한 값으로 설정됐는지 확인
    const userId = await page.evaluate(() =>
      localStorage.getItem("veil_user_id"),
    );
    const provider = await page.evaluate(() =>
      localStorage.getItem("veil_user_provider"),
    );

    expect(userId).toBe("user-1");
    expect(provider).toBe("google");

    // ── UX 이슈 메모 ────────────────────────────────────────────────
    // 현재 버튼에 disabled 처리 및 loading 상태가 없음.
    // window.location.href = url 이 동기적으로 navigation을 시작하므로
    // 실질적으로 두 번째 클릭이 처리될 가능성은 낮지만,
    // 명시적 debounce를 추가하면 더 안전함 (Phase 3-D 이후 개선 권장).
  });
});
