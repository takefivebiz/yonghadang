import { test, expect, Page } from "@playwright/test";

// ── 테스트 상수 ────────────────────────────────────────────────────────
const SESSION_ID = "test-result-r01";
const CONTENT_ID = "love-1";

// love-1: scene 1,2 무료 / scene 3,4,5,6 유료 → 총 6개 씬
const FREE_SCENE_COUNT = 2;
const PAID_SCENE_COUNT = 4;
const TOTAL_SCENE_COUNT = FREE_SCENE_COUNT + PAID_SCENE_COUNT;

// ── Helper: localStorage에 분석 데이터 세팅 후 결과 페이지 이동 ──────────
const gotoResultWithData = async (
  page: Page,
  sessionId = SESSION_ID,
  contentId = CONTENT_ID,
  queryString = "",
) => {
  // localStorage는 origin 확립 후에만 쓸 수 있어서 먼저 홈으로 이동
  await page.goto("/");
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    {
      key: `veil_analysis_${sessionId}`,
      value: {
        session_id: sessionId,
        content_id: contentId,
        free_input: "테스트 입력",
        answers: [],
        created_at: new Date().toISOString(),
      },
    },
  );
  await page.goto(`/result/${sessionId}${queryString}`);
};

// ── Helper: 씬 렌더링 대기 (로딩 완료 기준) ──────────────────────────────
const waitForScenes = async (page: Page) => {
  // 첫 번째 씬 제목이 나타날 때까지 대기
  await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
};

// ─────────────────────────────────────────────────────────────────────────
test.describe("R: 결과 페이지 (/result/[session_id])", () => {
  // ── R-01: 로딩 인디케이터 → 씬 렌더링 ───────────────────────────────
  test("R-01: 로딩 완료 후 씬이 렌더링된다", async ({ page }) => {
    await gotoResultWithData(page);
    // 로딩 스피너가 사라지고 콘텐츠가 렌더링되는지 확인
    await expect(page.locator(".animate-spin")).not.toBeVisible({
      timeout: 8000,
    });
    await expect(page.locator("h2").first()).toBeVisible();
  });

  // ── R-02: 유효한 데이터 → 씬 목록 렌더링 ────────────────────────────
  test("R-02: 유효한 localStorage 데이터로 씬이 정상 렌더링된다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    // 총 씬 wrapper 개수 확인 (data-scene-idx 속성)
    const sceneWrappers = page.locator("[data-scene-idx]");
    await expect(sceneWrappers).toHaveCount(TOTAL_SCENE_COUNT);
  });

  // ── R-03: 콘텐츠 제목 표시 ───────────────────────────────────────────
  test("R-03: 콘텐츠 제목(h1)이 표시된다", async ({ page }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    // love-1 제목 확인
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text).toContain("사랑");
  });

  // ── R-04: localStorage 데이터 없음 → 에러 상태 ──────────────────────
  test("R-04: localStorage 데이터 없으면 에러 메시지가 표시된다", async ({
    page,
  }) => {
    // 데이터 없이 바로 결과 페이지 접근
    await page.goto("/result/nonexistent-session-9999");
    await expect(page.locator("text=결과를 찾을 수 없어")).toBeVisible({
      timeout: 8000,
    });
    // 홈으로 돌아가기 링크 확인
    await expect(page.locator("text=처음으로 돌아가기")).toBeVisible();
  });

  // ── R-05: 잘못된 session_id → 에러 상태 ─────────────────────────────
  test("R-05: 다른 session_id의 데이터가 있어도 올바른 키가 없으면 에러", async ({
    page,
  }) => {
    // 다른 session_id로 데이터 저장
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "veil_analysis_other-session",
        JSON.stringify({ session_id: "other-session", content_id: "love-1" }),
      );
    });
    // 다른 session_id로 접근
    await page.goto("/result/wrong-session-id-abc");
    await expect(page.locator("text=결과를 찾을 수 없어")).toBeVisible({
      timeout: 8000,
    });
  });

  // ── R-06: 무료 씬 전체 메시지 노출 ──────────────────────────────────
  test("R-06: 무료 씬은 scene-messages(전체 내용)가 렌더링된다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    // 무료 씬의 scene-messages 확인 (2개 무료 씬)
    const freeMessages = page.locator("[data-testid='scene-messages']");
    await expect(freeMessages).toHaveCount(FREE_SCENE_COUNT);
    await expect(freeMessages.first()).toBeVisible();
  });

  // ── R-07: 무료 씬 배지 표시 ─────────────────────────────────────────
  test("R-07: scene_index !== 2 인 무료 씬에 '무료' 배지가 표시된다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    // love-1: scene_index=1만 "무료" 배지 표시 (scene_index=2는 제외)
    const freeBadge = page.locator("text=무료");
    await expect(freeBadge).toBeVisible();
    // 배지 개수는 1개 (scene_index=2는 배지 없음)
    await expect(freeBadge).toHaveCount(1);
  });

  // ── R-08: 유료 씬 preview 메시지 노출 ───────────────────────────────
  test("R-08: 유료(잠긴) 씬은 preview 메시지가 렌더링된다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    // preview 컨테이너 개수 = 유료 씬 수
    const previewContainers = page.locator(
      "[data-testid='scene-preview-messages']",
    );
    await expect(previewContainers).toHaveCount(PAID_SCENE_COUNT);
    await expect(previewContainers.first()).toBeVisible();
  });

  // ── R-09: 유료 씬 blur/fade 효과 확인 ──────────────────────────────
  test("R-09: 유료 씬 preview 메시지는 blur 스타일이 적용된다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    // 첫 번째 preview 내부의 메시지 div에 blur 스타일 확인
    const previewContainer = page
      .locator("[data-testid='scene-preview-messages']")
      .first();
    // preview 내부의 자식 div (blur가 적용된 메시지 래퍼)
    const blurredMsg = previewContainer.locator("> div").first();
    const style = await blurredMsg.getAttribute("style");
    expect(style).toContain("blur");
  });

  // ── R-10: 유료 씬 lock CTA 버튼 존재 ────────────────────────────────
  test("R-10: 유료(잠긴) 씬에 '이 흐름만 열기' 버튼이 표시된다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    const unlockBtns = page.locator("[data-testid='scene-unlock-btn']");
    await expect(unlockBtns).toHaveCount(PAID_SCENE_COUNT);
    await expect(unlockBtns.first()).toBeVisible();
    // 버튼 내 텍스트 확인
    await expect(page.locator("text=이 흐름만 열기").first()).toBeVisible();
  });

  // ── R-11: ProgressIndicator dot 개수 ────────────────────────────────
  test("R-11: ProgressIndicator에 씬 수만큼 dot이 렌더링된다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    const dots = page.locator("[data-testid='progress-dot']");
    await expect(dots).toHaveCount(TOTAL_SCENE_COUNT);
  });

  // ── R-12: ProgressIndicator 무료/유료 씬 색상 구분 ──────────────────
  test("R-12: 무료 씬 dot은 unlocked, 유료 씬 dot은 locked 상태다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    const dots = page.locator("[data-testid='progress-dot']");
    // 처음 2개(무료): data-unlocked="true"
    await expect(dots.nth(0)).toHaveAttribute("data-unlocked", "true");
    await expect(dots.nth(1)).toHaveAttribute("data-unlocked", "true");
    // 나머지(유료): data-unlocked="false"
    await expect(dots.nth(2)).toHaveAttribute("data-unlocked", "false");
    await expect(dots.nth(3)).toHaveAttribute("data-unlocked", "false");
  });

  // ── R-13: ProgressIndicator 초기 active 씬 ──────────────────────────
  test("R-13: 페이지 로드 시 첫 번째 dot이 active 상태다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    const firstDot = page.locator("[data-testid='progress-dot']").first();
    // currentSceneIndex 초기값 = 0 → 첫 번째 dot active
    await expect(firstDot).toHaveAttribute("data-active", "true");
    // 나머지는 active=false
    const secondDot = page.locator("[data-testid='progress-dot']").nth(1);
    await expect(secondDot).toHaveAttribute("data-active", "false");
  });

  // ── R-14: 무료→FlowOverview→유료 씬 렌더링 순서 ─────────────────────
  test("R-14: FlowOverview는 무료 씬과 유료 씬 사이에 위치한다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    const flowOverview = page.locator("[data-testid='flow-overview']");
    await expect(flowOverview).toBeVisible();

    // DOM 위치 확인: FlowOverview의 y좌표가 무료 씬 마지막보다 낮고 유료 씬 첫 번째보다 낮아야 함
    const sceneWrappers = page.locator("[data-scene-idx]");
    const lastFreeIdx = FREE_SCENE_COUNT - 1; // 1 (idx=1, scene_index=2)
    const firstPaidIdx = FREE_SCENE_COUNT; // 2 (idx=2, scene_index=3)

    const lastFreeBox = await sceneWrappers.nth(lastFreeIdx).boundingBox();
    const overviewBox = await flowOverview.boundingBox();
    const firstPaidBox = await sceneWrappers.nth(firstPaidIdx).boundingBox();

    expect(lastFreeBox).not.toBeNull();
    expect(overviewBox).not.toBeNull();
    expect(firstPaidBox).not.toBeNull();

    // FlowOverview top > 마지막 무료 씬 top
    expect(overviewBox!.y).toBeGreaterThan(lastFreeBox!.y);
    // 첫 유료 씬 top > FlowOverview top
    expect(firstPaidBox!.y).toBeGreaterThan(overviewBox!.y);
  });

  // ── R-15: FlowOverview 씬 목록 렌더링 ────────────────────────────────
  test("R-15: FlowOverview에 전체 씬 제목 목록이 표시된다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    const sceneItems = page.locator("[data-testid='flow-overview-scene-item']");
    await expect(sceneItems).toHaveCount(TOTAL_SCENE_COUNT);

    // FlowOverview 내부에서 씬 제목 확인 (h2와 중복 방지를 위해 스코프 한정)
    const overview = page.locator("[data-testid='flow-overview']");
    await expect(overview.locator("text=감정이 흔들리기 시작한 순간")).toBeVisible();
    await expect(overview.locator("text=반복되는 불안의 패턴")).toBeVisible();
  });

  // ── R-16: FlowOverview 읽은/잠긴 씬 아이콘 구분 ─────────────────────
  test("R-16: FlowOverview에서 무료 씬은 unlocked 아이콘, 유료 씬은 locked 아이콘이 표시된다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    const unlockedIcons = page.locator(
      "[data-testid='flow-overview-unlocked-icon']",
    );
    const lockedIcons = page.locator(
      "[data-testid='flow-overview-locked-icon']",
    );

    await expect(unlockedIcons).toHaveCount(FREE_SCENE_COUNT);
    await expect(lockedIcons).toHaveCount(PAID_SCENE_COUNT);
  });

  // ── R-17a: FlowOverview 잠긴 씬 클릭 → 결제 모달 ────────────────────
  test("R-17a: FlowOverview에서 잠긴 씬 클릭 시 결제 모달이 열린다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    // 잠긴 씬 아이템 (data-unlocked="false") 클릭
    const lockedItem = page
      .locator("[data-testid='flow-overview-scene-item'][data-unlocked='false']")
      .first();
    await expect(lockedItem).toBeVisible();
    await lockedItem.click();

    // 결제 모달이 열리는지 확인
    await expect(page.locator("[data-testid='payment-modal']")).toBeVisible({
      timeout: 3000,
    });
  });

  // ── R-17b: FlowOverview '전체 흐름 열기' 버튼 → 결제 모달 ─────────────
  test("R-17b: '전체 흐름 열기' 버튼 클릭 시 결제 모달이 열린다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    const unlockAllBtn = page.locator(
      "[data-testid='flow-overview-unlock-all-btn']",
    );
    await expect(unlockAllBtn).toBeVisible();
    await unlockAllBtn.click();

    await expect(page.locator("[data-testid='payment-modal']")).toBeVisible({
      timeout: 3000,
    });
  });

  // ── R-17c: 유료 씬 'Lock CTA' 클릭 → 결제 모달 ──────────────────────
  test("R-17c: 유료 씬의 '이 흐름만 열기' 버튼 클릭 시 결제 모달이 열린다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    // 첫 번째 lock CTA 버튼 클릭
    const unlockBtn = page.locator("[data-testid='scene-unlock-btn']").first();
    await expect(unlockBtn).toBeVisible();
    await unlockBtn.scrollIntoViewIfNeeded();
    await unlockBtn.click();

    await expect(page.locator("[data-testid='payment-modal']")).toBeVisible({
      timeout: 3000,
    });
  });

  // ── R-17d: 결제 모달 닫기 ────────────────────────────────────────────
  test("R-17d: 결제 모달의 X 버튼 클릭 시 모달이 닫힌다", async ({ page }) => {
    await gotoResultWithData(page);
    await waitForScenes(page);

    // 모달 열기
    await page
      .locator("[data-testid='flow-overview-unlock-all-btn']")
      .click();
    await expect(page.locator("[data-testid='payment-modal']")).toBeVisible({
      timeout: 3000,
    });

    // X(close) 버튼 클릭
    await page.locator("[data-testid='payment-modal-close-btn']").click();
    await expect(
      page.locator("[data-testid='payment-modal']"),
    ).not.toBeVisible({ timeout: 3000 });
  });

  // ── R-17e: 모든 씬 구매 상태 mock → FlowOverview 상태 확인 ──────────
  test("R-17e: 전체 구매 완료 시 FlowOverview가 '전체 흐름이 열렸어'를 표시한다", async ({
    page,
  }) => {
    // payment_success=true&paymentType=all 쿼리 파라미터로 전체 unlock mock
    await gotoResultWithData(
      page,
      SESSION_ID,
      CONTENT_ID,
      "?payment_success=true&paymentType=all",
    );
    await waitForScenes(page);

    // "전체 흐름 열기" 버튼이 사라지고 완료 메시지가 표시되는지 확인
    await expect(
      page.locator("[data-testid='flow-overview-unlock-all-btn']"),
    ).not.toBeVisible();
    await expect(
      page.locator("text=전체 흐름이 열렸어. 계속 읽어봐"),
    ).toBeVisible();

    // 모든 씬 아이콘이 unlocked 상태인지 확인
    const lockedIcons = page.locator(
      "[data-testid='flow-overview-locked-icon']",
    );
    await expect(lockedIcons).toHaveCount(0);

    const unlockedIcons = page.locator(
      "[data-testid='flow-overview-unlocked-icon']",
    );
    await expect(unlockedIcons).toHaveCount(TOTAL_SCENE_COUNT);
  });
});
