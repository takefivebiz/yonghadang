import { test, expect, Page } from "@playwright/test";

// ── 상수 ──────────────────────────────────────────────────────────────
const VALID_PHONE = "010-1234-5678";
const VALID_PIN = "1234";
const VALID_PHONE_DIGITS = "01012345678"; // 포맷팅 전 raw 숫자
const INVALID_PHONE = "010-9999-9999";
const INVALID_PIN = "0000";

const GUEST_ID = "guest-1";
const SESSION_1_ID = "session-guest-1";

// ── Helper: /guest 이동 + Step 1 렌더링 대기 + sessionStorage 초기화 ──
const gotoGuest = async (page: Page) => {
  await page.goto("/");
  await page.evaluate(() => {
    sessionStorage.removeItem("guest_id");
    sessionStorage.removeItem("guest_sessions");
    sessionStorage.removeItem("guest_token");
    sessionStorage.removeItem("redirect_to");
    localStorage.removeItem("veil_user_id");
  });
  await page.goto("/guest");
  await expect(page.locator('input[type="tel"]')).toBeVisible({ timeout: 5000 });
};

// ── Helper: Step 1 인증 완료 후 Step 2 도달 ──────────────────────────
const verifyAndReachStep2 = async (page: Page) => {
  await gotoGuest(page);
  await page.locator('input[type="tel"]').fill(VALID_PHONE);
  await page.locator('input[type="password"]').fill(VALID_PIN);
  await page.getByRole("button", { name: "확인" }).click();
  // 300ms fade 전환 후 Step 2 렌더링 대기
  await expect(page.locator("h2")).toContainText("지난 기록", { timeout: 3000 });
};

// ─────────────────────────────────────────────────────────────────────────
test.describe("GU: 비회원 조회 페이지 (/guest)", () => {
  // ── GU-01: 전화번호 입력 필드 렌더링 ────────────────────────────────
  test("GU-01: 전화번호 입력 필드가 렌더링된다", async ({ page }) => {
    await gotoGuest(page);
    const phoneInput = page.locator('input[type="tel"]');
    await expect(phoneInput).toBeVisible();
    await expect(phoneInput).toBeEnabled();
    await expect(phoneInput).toHaveAttribute("placeholder", "010-0000-0000");
  });

  // ── GU-02: PIN 입력 필드 렌더링 ─────────────────────────────────────
  test("GU-02: PIN(비밀번호) 입력 필드가 렌더링된다", async ({ page }) => {
    await gotoGuest(page);
    const pinInput = page.locator('input[type="password"]');
    await expect(pinInput).toBeVisible();
    await expect(pinInput).toBeEnabled();
    await expect(pinInput).toHaveAttribute("maxlength", "4");
  });

  // ── GU-03: 전화번호 자동 포맷팅 ─────────────────────────────────────
  test("GU-03: 전화번호 입력 시 010-XXXX-XXXX 형식으로 자동 포맷팅된다", async ({
    page,
  }) => {
    await gotoGuest(page);
    const phoneInput = page.locator('input[type="tel"]');
    await phoneInput.fill(VALID_PHONE_DIGITS);
    await expect(phoneInput).toHaveValue(VALID_PHONE);
  });

  // ── GU-04: PIN 숫자 전용·4자리 제한 ─────────────────────────────────
  test("GU-04: PIN 입력은 숫자만 허용되고 최대 4자리까지만 입력된다", async ({
    page,
  }) => {
    await gotoGuest(page);
    const pinInput = page.locator('input[type="password"]');
    // 5자리 숫자 입력 → 최대 4자리만 남아야 함
    await pinInput.fill("99999");
    const value = await pinInput.inputValue();
    expect(value).toMatch(/^\d{1,4}$/);
    expect(value.length).toBeLessThanOrEqual(4);
  });

  // ── GU-05: 전화번호·PIN 모두 미입력 → 확인 버튼 비활성 ─────────────
  test("GU-05: 전화번호와 PIN 모두 미입력 시 확인 버튼이 비활성이다", async ({
    page,
  }) => {
    await gotoGuest(page);
    await expect(page.getByRole("button", { name: "확인" })).toBeDisabled();
  });

  // ── GU-06: 전화번호만 입력, PIN 없음 → 확인 버튼 비활성 ────────────
  test("GU-06: 전화번호만 입력하고 PIN 없을 시 확인 버튼이 비활성이다", async ({
    page,
  }) => {
    await gotoGuest(page);
    await page.locator('input[type="tel"]').fill(VALID_PHONE);
    await expect(page.getByRole("button", { name: "확인" })).toBeDisabled();
  });

  // ── GU-07: PIN만 입력, 전화번호 없음 → 확인 버튼 비활성 ────────────
  test("GU-07: PIN만 입력하고 전화번호 없을 시 확인 버튼이 비활성이다", async ({
    page,
  }) => {
    await gotoGuest(page);
    await page.locator('input[type="password"]').fill(VALID_PIN);
    await expect(page.getByRole("button", { name: "확인" })).toBeDisabled();
  });

  // ── GU-08: 전화번호 형식 불완전 + PIN → 확인 버튼 비활성 ────────────
  test("GU-08: 전화번호 형식이 불완전할 때 확인 버튼이 비활성이다", async ({
    page,
  }) => {
    await gotoGuest(page);
    // 7자리만 입력 → 010-1234 형식 (010-\d{4}-\d{4} 불만족)
    await page.locator('input[type="tel"]').fill("010-1234");
    await page.locator('input[type="password"]').fill(VALID_PIN);
    await expect(page.getByRole("button", { name: "확인" })).toBeDisabled();
  });

  // ── GU-09: 유효한 전화번호 + 4자리 PIN → 확인 버튼 활성 ────────────
  test("GU-09: 유효한 전화번호와 4자리 PIN 입력 시 확인 버튼이 활성화된다", async ({
    page,
  }) => {
    await gotoGuest(page);
    await page.locator('input[type="tel"]').fill(VALID_PHONE);
    await page.locator('input[type="password"]').fill(VALID_PIN);
    await expect(page.getByRole("button", { name: "확인" })).toBeEnabled();
  });

  // ── GU-10: 잘못된 자격증명 → 에러 메시지 표시 ───────────────────────
  test("GU-10: 잘못된 전화번호/PIN 입력 시 에러 메시지가 표시된다", async ({
    page,
  }) => {
    await gotoGuest(page);
    await page.locator('input[type="tel"]').fill(INVALID_PHONE);
    await page.locator('input[type="password"]').fill(INVALID_PIN);
    await page.getByRole("button", { name: "확인" }).click();
    await expect(
      page.locator("text=전화번호 또는 비밀번호가 일치하지 않아."),
    ).toBeVisible({ timeout: 3000 });
  });

  // ── GU-11: 올바른 자격증명 → Step 2 전환 ────────────────────────────
  test("GU-11: 올바른 전화번호와 PIN 입력 시 Step 2(지난 기록)로 전환된다", async ({
    page,
  }) => {
    await gotoGuest(page);
    await page.locator('input[type="tel"]').fill(VALID_PHONE);
    await page.locator('input[type="password"]').fill(VALID_PIN);
    await page.getByRole("button", { name: "확인" }).click();
    // 300ms fade + 렌더링 대기
    await expect(page.locator("h2")).toContainText("지난 기록", { timeout: 3000 });
  });

  // ── GU-12: 인증 성공 → sessionStorage.guest_id 저장 ─────────────────
  test("GU-12: 인증 성공 시 sessionStorage.guest_id가 저장된다", async ({
    page,
  }) => {
    await gotoGuest(page);
    await page.locator('input[type="tel"]').fill(VALID_PHONE);
    await page.locator('input[type="password"]').fill(VALID_PIN);
    await page.getByRole("button", { name: "확인" }).click();
    await expect(page.locator("h2")).toContainText("지난 기록", { timeout: 3000 });

    const guestId = await page.evaluate(() =>
      sessionStorage.getItem("guest_id"),
    );
    expect(guestId).toBe(GUEST_ID);
  });

  // ── GU-13: 인증 성공 → sessionStorage.guest_sessions 저장 ──────────
  test("GU-13: 인증 성공 시 sessionStorage.guest_sessions가 저장된다", async ({
    page,
  }) => {
    await gotoGuest(page);
    await page.locator('input[type="tel"]').fill(VALID_PHONE);
    await page.locator('input[type="password"]').fill(VALID_PIN);
    await page.getByRole("button", { name: "확인" }).click();
    await expect(page.locator("h2")).toContainText("지난 기록", { timeout: 3000 });

    const sessions = await page.evaluate(() =>
      sessionStorage.getItem("guest_sessions"),
    );
    expect(sessions).not.toBeNull();
    const parsed = JSON.parse(sessions!);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThan(0);
  });

  // ── GU-14: Step 2 세션 목록 2개 표시 ────────────────────────────────
  test("GU-14: Step 2에서 guest-1의 세션 목록 2개가 표시된다", async ({
    page,
  }) => {
    await verifyAndReachStep2(page);
    await expect(
      page.locator("[data-testid='guest-session-item']"),
    ).toHaveCount(2);
    // 콘텐츠 제목 확인
    await expect(page.locator("text=사랑일까")).toBeVisible();
    await expect(page.locator("text=나한테 맞는 걸까")).toBeVisible();
  });

  // ── GU-15: 세션 클릭 → localStorage.veil_analysis_{sessionId} 저장 ──
  test("GU-15: 세션 클릭 시 localStorage에 veil_analysis_{sessionId}가 저장된다", async ({
    page,
  }) => {
    await verifyAndReachStep2(page);

    // /share/ → /result/ 체인 리다이렉트가 발생하므로 최종 안정 URL까지 대기
    // localStorage는 same-origin 이동 시 유지됨
    await Promise.all([
      page.waitForURL(/\/result\//, { timeout: 10000 }),
      page.locator("text=사랑일까").click(),
    ]);

    const stored = await page.evaluate(
      (sessionId) => localStorage.getItem(`veil_analysis_${sessionId}`),
      SESSION_1_ID,
    );
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.session_id).toBe(SESSION_1_ID);
  });

  // ── GU-16: 세션 클릭 → sessionStorage.guest_token 저장 ─────────────
  test("GU-16: 세션 클릭 시 sessionStorage.guest_token이 저장된다", async ({
    page,
  }) => {
    await verifyAndReachStep2(page);

    // /share/ → /result/ 체인 리다이렉트가 발생하므로 최종 안정 URL까지 대기
    // sessionStorage는 same-origin 이동 시 유지됨
    await Promise.all([
      page.waitForURL(/\/result\//, { timeout: 10000 }),
      page.locator("text=사랑일까").click(),
    ]);

    const guestToken = await page.evaluate(() =>
      sessionStorage.getItem("guest_token"),
    );
    expect(guestToken).toBe(GUEST_ID);
  });

  // ── GU-17: redirect_to 없음 → /share/{sessionId}로 이동 ─────────────
  test("GU-17: redirect_to 없을 때 세션 클릭 시 /share/{sessionId}로 이동한다", async ({
    page,
  }) => {
    await verifyAndReachStep2(page);

    await Promise.all([
      page.waitForURL(/\/share\//, { timeout: 8000 }),
      page.locator("text=사랑일까").click(),
    ]);

    expect(page.url()).toContain(`/share/${SESSION_1_ID}`);
  });

  // ── GU-18: redirect_to 있음 → redirect_to URL로 이동 ────────────────
  test("GU-18: sessionStorage에 redirect_to가 있을 때 세션 클릭 시 해당 URL로 이동하고 redirect_to가 삭제된다", async ({
    page,
  }) => {
    await verifyAndReachStep2(page);

    const REDIRECT_TARGET = `http://localhost:3000/share/${SESSION_1_ID}`;
    await page.evaluate((url) => {
      sessionStorage.setItem("redirect_to", url);
    }, REDIRECT_TARGET);

    // /share/ 이동 후 guest_id 감지로 /result/까지 체인 리다이렉트 발생
    // 최종 안정 URL 대기 후 sessionStorage 확인
    await Promise.all([
      page.waitForURL(/\/result\//, { timeout: 10000 }),
      page.locator("text=사랑일까").click(),
    ]);

    // redirect_to 삭제 확인 (handleSelectSession에서 removeItem 호출)
    const remaining = await page.evaluate(() =>
      sessionStorage.getItem("redirect_to"),
    );
    expect(remaining).toBeNull();
  });

  // ── GU-19: "다른 콘텐츠 보기" → 홈(/)으로 이동 ─────────────────────
  test("GU-19: '다른 콘텐츠 보기' 클릭 시 홈(/)으로 이동한다", async ({
    page,
  }) => {
    await verifyAndReachStep2(page);

    await Promise.all([
      page.waitForURL(/\/$/, { timeout: 5000 }),
      page.getByRole("button", { name: "다른 콘텐츠 보기" }).click(),
    ]);

    expect(page.url()).toMatch(/localhost:3000\/$/);
  });

  // ── GU-20: "로그아웃" → Step 1 복귀 + sessionStorage 삭제 ───────────
  test("GU-20: '로그아웃' 클릭 시 Step 1로 복귀하고 sessionStorage가 정리된다", async ({
    page,
  }) => {
    await verifyAndReachStep2(page);

    await page.getByRole("button", { name: "로그아웃" }).click();

    // 300ms fade 후 Step 1 렌더링 대기
    await expect(page.locator('input[type="tel"]')).toBeVisible({
      timeout: 3000,
    });

    // sessionStorage 정리 확인
    const guestId = await page.evaluate(() =>
      sessionStorage.getItem("guest_id"),
    );
    const guestSessions = await page.evaluate(() =>
      sessionStorage.getItem("guest_sessions"),
    );
    const guestToken = await page.evaluate(() =>
      sessionStorage.getItem("guest_token"),
    );

    expect(guestId).toBeNull();
    expect(guestSessions).toBeNull();
    expect(guestToken).toBeNull();
  });

  // ── GU-21: sessionStorage 복원 → Step 2 직행 ────────────────────────
  test("GU-21: sessionStorage에 guest_id·guest_sessions가 있으면 바로 Step 2로 이동한다", async ({
    page,
  }) => {
    await page.goto("/");

    // 이미 인증된 상태 시뮬레이션
    const mockSessions = [
      {
        session_id: SESSION_1_ID,
        content_id: "love-1",
        content_title: "사랑일까,\n집착일까?",
        category: "love",
        created_at: "2026-05-04T10:00:00Z",
        view_state: "장면 2까지 열람",
      },
    ];
    await page.evaluate(
      ({ guestId, sessions }) => {
        sessionStorage.setItem("guest_id", guestId);
        sessionStorage.setItem("guest_sessions", JSON.stringify(sessions));
      },
      { guestId: GUEST_ID, sessions: mockSessions },
    );

    await page.goto("/guest");

    // Step 1 없이 바로 Step 2가 보여야 함
    await expect(page.locator("h2")).toContainText("지난 기록", {
      timeout: 5000,
    });
    await expect(page.locator('input[type="tel"]')).not.toBeVisible();
  });
});
