import { test, expect, Page } from "@playwright/test";

// ── 상수 ───────────────────────────────────────────────────────────────
const SESSION_ID = "test-payment-r18";
const CONTENT_ID = "love-1";

// love-1: scene 1,2 무료 / scene 3,4,5,6 유료 → 총 6개 씬
const FREE_SCENE_COUNT = 2;
const PAID_SCENE_COUNT = 4;
const TOTAL_SCENE_COUNT = FREE_SCENE_COUNT + PAID_SCENE_COUNT;

// ── Helper: localStorage에 분석 데이터 세팅 후 결과 페이지 이동 ──────────
const gotoResult = async (
  page: Page,
  sessionId = SESSION_ID,
  contentId = CONTENT_ID,
  queryString = "",
) => {
  await page.goto("/");
  await page.evaluate(
    ({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
    {
      key: `veil_analysis_${sessionId}`,
      value: {
        session_id: sessionId,
        content_id: contentId,
        free_input: "결제 테스트 입력",
        answers: [],
        created_at: new Date().toISOString(),
      },
    },
  );
  await page.goto(`/result/${sessionId}${queryString}`);
};

// ── Helper: 씬 렌더링 대기 ───────────────────────────────────────────────
const waitForScenes = async (page: Page) => {
  await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
};

// ── Helper: 개별 Scene 결제 모달 열기 ──────────────────────────────────
const openSingleModal = async (page: Page) => {
  await gotoResult(page);
  await waitForScenes(page);
  const unlockBtn = page.locator("[data-testid='scene-unlock-btn']").first();
  await unlockBtn.scrollIntoViewIfNeeded();
  await unlockBtn.click();
  await expect(page.locator("[data-testid='payment-modal']")).toBeVisible({
    timeout: 5000,
  });
};

// ── Helper: 전체 구매 결제 모달 열기 ───────────────────────────────────
const openAllModal = async (page: Page) => {
  await gotoResult(page);
  await waitForScenes(page);
  const unlockAllBtn = page.locator("[data-testid='flow-overview-unlock-all-btn']");
  await unlockAllBtn.click();
  await expect(page.locator("[data-testid='payment-modal']")).toBeVisible({
    timeout: 5000,
  });
};

// ─────────────────────────────────────────────────────────────────────────
test.describe("R: 결과 페이지 - 결제 모달", () => {
  // ── R-18: 개별 Scene 구매 모달 렌더링 + 제목 표시 ─────────────────────
  test("R-18: 개별 Scene 구매 모달이 열리고 Scene 제목('[title] 열기')이 표시된다", async ({
    page,
  }) => {
    await gotoResult(page);
    await waitForScenes(page);

    // 첫 번째 유료 scene의 제목을 확인하기 위해 h2 목록에서 세 번째(idx=2) 가져오기
    const firstPaidSceneTitle = await page
      .locator("[data-scene-idx='2'] h2")
      .textContent();

    const unlockBtn = page
      .locator("[data-testid='scene-unlock-btn']")
      .first();
    await unlockBtn.scrollIntoViewIfNeeded();
    await unlockBtn.click();

    await expect(page.locator("[data-testid='payment-modal']")).toBeVisible({
      timeout: 5000,
    });

    // 제목 확인: "[씬 제목] 열기" 형식
    const modalTitle = page.locator("[data-testid='payment-modal-title']");
    await expect(modalTitle).toBeVisible({ timeout: 5000 });
    await expect(modalTitle).toContainText("열기");
    // 씬 제목 포함 여부 확인 (첫 유료 씬 제목이 모달 타이틀에 포함됨)
    if (firstPaidSceneTitle) {
      await expect(modalTitle).toContainText(firstPaidSceneTitle.trim());
    }
  });

  // ── R-19: 개별 구매 모달 - 900원 가격 표시 ────────────────────────────
  test("R-19: 개별 Scene 구매 모달에 900원 가격이 표시된다", async ({
    page,
  }) => {
    await openSingleModal(page);

    const priceEl = page.locator("[data-testid='payment-modal-price']");
    await expect(priceEl).toBeVisible({ timeout: 5000 });
    await expect(priceEl).toContainText("900");
  });

  // ── R-20: 개별 구매 모달 - 결제 버튼 렌더링 ──────────────────────────
  test("R-20: 개별 Scene 구매 모달에 '900원 결제하기' 버튼이 렌더링된다 (초기 활성 상태)", async ({
    page,
  }) => {
    await openSingleModal(page);

    const payBtn = page.locator("[data-testid='payment-modal-pay-btn']");
    await expect(payBtn).toBeVisible({ timeout: 5000 });
    await expect(payBtn).toContainText("900");
    await expect(payBtn).toContainText("결제하기");
    // 초기에는 활성 상태 (isProcessing=false)
    await expect(payBtn).not.toBeDisabled();
  });

  // ── R-21: 전체 구매 모달 렌더링 + 제목 ───────────────────────────────
  test("R-21: 전체 구매 모달이 열리고 '전체 흐름 열기' 제목이 표시된다", async ({
    page,
  }) => {
    await openAllModal(page);

    const modalTitle = page.locator("[data-testid='payment-modal-title']");
    await expect(modalTitle).toBeVisible({ timeout: 5000 });
    await expect(modalTitle).toHaveText("전체 흐름 열기");
  });

  // ── R-22: 전체 구매 모달 - 2,900원 가격 표시 ─────────────────────────
  test("R-22: 전체 구매 모달에 2,900원 가격이 표시된다", async ({ page }) => {
    await openAllModal(page);

    const priceEl = page.locator("[data-testid='payment-modal-price']");
    await expect(priceEl).toBeVisible({ timeout: 5000 });
    await expect(priceEl).toContainText("2,900");
  });

  // ── R-23: 취소 버튼 클릭 → 모달 닫힘 ────────────────────────────────
  test("R-23: '취소' 버튼 클릭 시 결제 모달이 닫힌다", async ({ page }) => {
    await openSingleModal(page);

    const cancelBtn = page.locator("[data-testid='payment-modal-cancel-btn']");
    await expect(cancelBtn).toBeVisible({ timeout: 5000 });
    await cancelBtn.click();

    await expect(page.locator("[data-testid='payment-modal']")).not.toBeVisible(
      { timeout: 3000 },
    );
  });

  // ── R-24: 결제 위젯 로드 실패 시 에러 메시지 표시 ────────────────────
  test("R-24: 결제 위젯 로드 실패 시 에러 메시지가 표시된다", async ({
    page,
  }) => {
    // Toss 관련 네트워크 요청을 차단해 위젯 초기화 실패 유발
    await page.route("**/*tosspayments*/**", (route) => route.abort());
    await page.route("**/*tossbank*/**", (route) => route.abort());

    await gotoResult(page);
    await waitForScenes(page);

    const unlockBtn = page
      .locator("[data-testid='scene-unlock-btn']")
      .first();
    await unlockBtn.scrollIntoViewIfNeeded();
    await unlockBtn.click();

    await expect(page.locator("[data-testid='payment-modal']")).toBeVisible({
      timeout: 5000,
    });

    // 위젯 초기화 실패 → 에러 메시지 표시
    const errorMsg = page.locator("[data-testid='payment-modal-error-msg']");
    await expect(errorMsg).toBeVisible({ timeout: 8000 });
    // 에러 닫기 버튼도 표시됨
    await expect(
      page.locator("[data-testid='payment-modal-error-close-btn']"),
    ).toBeVisible();
  });

  // ── R-25: URL 파라미터 결제 성공 (single) → 해당 Scene unlock ─────────
  test("R-25: URL 파라미터 결제 성공(single, sceneIndex=3)으로 해당 Scene이 unlock된다", async ({
    page,
  }) => {
    // sceneIndex=3(첫 번째 유료 씬) 결제 완료 mock
    await gotoResult(
      page,
      SESSION_ID,
      CONTENT_ID,
      "?payment_success=true&paymentType=single&sceneIndex=3&orderId=test-r25",
    );
    await waitForScenes(page);

    // scene-messages 개수: 무료 2 + unlock된 유료 1 = 3
    const sceneMessages = page.locator("[data-testid='scene-messages']");
    await expect(sceneMessages).toHaveCount(FREE_SCENE_COUNT + 1);

    // FlowOverview: unlocked icon = free 2 + paid 1 = 3
    const unlockedIcons = page.locator(
      "[data-testid='flow-overview-unlocked-icon']",
    );
    await expect(unlockedIcons).toHaveCount(FREE_SCENE_COUNT + 1);

    // 나머지 유료 씬의 lock CTA = PAID_SCENE_COUNT - 1 = 3
    const lockBtns = page.locator("[data-testid='scene-unlock-btn']");
    await expect(lockBtns).toHaveCount(PAID_SCENE_COUNT - 1);

    // URL 파라미터 제거 확인
    expect(page.url()).not.toContain("payment_success");
  });

  // ── R-26: URL 파라미터 결제 성공 (all) → 모든 Scene unlock ───────────
  test("R-26: URL 파라미터 결제 성공(all)으로 모든 유료 Scene이 unlock되고 FlowOverview가 완료 상태를 표시한다", async ({
    page,
  }) => {
    // 전체 구매 완료 mock
    await gotoResult(
      page,
      SESSION_ID,
      CONTENT_ID,
      "?payment_success=true&paymentType=all&orderId=test-r26",
    );
    await waitForScenes(page);

    // scene-messages 개수: 전체 씬 수 = TOTAL_SCENE_COUNT
    const sceneMessages = page.locator("[data-testid='scene-messages']");
    await expect(sceneMessages).toHaveCount(TOTAL_SCENE_COUNT);

    // lock CTA 버튼 없음
    const lockBtns = page.locator("[data-testid='scene-unlock-btn']");
    await expect(lockBtns).toHaveCount(0);

    // FlowOverview 완료 메시지
    await expect(
      page.locator("text=전체 흐름이 열렸어. 계속 읽어봐"),
    ).toBeVisible();

    // FlowOverview: locked icon 없음
    const lockedIcons = page.locator(
      "[data-testid='flow-overview-locked-icon']",
    );
    await expect(lockedIcons).toHaveCount(0);

    // FlowOverview: 모든 씬 unlocked icon
    const unlockedIcons = page.locator(
      "[data-testid='flow-overview-unlocked-icon']",
    );
    await expect(unlockedIcons).toHaveCount(TOTAL_SCENE_COUNT);

    // URL 파라미터 제거 확인
    expect(page.url()).not.toContain("payment_success");
  });

  // ── R-27: URL 파라미터 결제 실패 → Scene 잠김 유지 ─────────────────
  test("R-27: URL 파라미터 결제 실패 시 유료 Scene이 잠긴 상태로 유지된다", async ({
    page,
  }) => {
    // 결제 실패 mock
    await gotoResult(
      page,
      SESSION_ID,
      CONTENT_ID,
      "?payment_failed=true",
    );
    await waitForScenes(page);

    // scene-messages 개수: 무료 씬만 = FREE_SCENE_COUNT
    const sceneMessages = page.locator("[data-testid='scene-messages']");
    await expect(sceneMessages).toHaveCount(FREE_SCENE_COUNT);

    // 유료 씬 lock CTA = PAID_SCENE_COUNT
    const lockBtns = page.locator("[data-testid='scene-unlock-btn']");
    await expect(lockBtns).toHaveCount(PAID_SCENE_COUNT);

    // FlowOverview '전체 흐름 열기' 버튼 여전히 존재
    await expect(
      page.locator("[data-testid='flow-overview-unlock-all-btn']"),
    ).toBeVisible();

    // URL 파라미터 제거 확인
    expect(page.url()).not.toContain("payment_failed");
  });

  // ── R-28: unlock된 유료 Scene → 전체 콘텐츠 표시, CTA 없음, unlocked 배지 ──
  test("R-28: unlock된 유료 Scene은 전체 콘텐츠가 표시되고 CTA 버튼이 없으며 'unlocked' 배지가 나타난다", async ({
    page,
  }) => {
    // sceneIndex=3 unlock
    await gotoResult(
      page,
      SESSION_ID,
      CONTENT_ID,
      "?payment_success=true&paymentType=single&sceneIndex=3&orderId=test-r28",
    );
    await waitForScenes(page);

    // unlock된 유료 씬: scene-messages가 표시됨 (무료 2 + 유료 1)
    const sceneMessages = page.locator("[data-testid='scene-messages']");
    await expect(sceneMessages).toHaveCount(FREE_SCENE_COUNT + 1);

    // unlock된 유료 씬의 CTA 버튼 없음 (잠긴 씬 = PAID_SCENE_COUNT - 1)
    const lockBtns = page.locator("[data-testid='scene-unlock-btn']");
    await expect(lockBtns).toHaveCount(PAID_SCENE_COUNT - 1);

    // unlock된 유료 씬에 'unlocked' 배지 표시
    await expect(page.locator("text=unlocked")).toBeVisible();
  });

  // ── R-29: 개별 구매 후 전체 구매 모달 - 차액 없이 2,900원 표시 ─────────
  test("R-29: 개별 Scene 구매 후 전체 구매 모달은 2,900원을 그대로 표시한다 (차액 결제 미지원 현재 구현 기준)", async ({
    page,
  }) => {
    // sceneIndex=3 이미 구매 완료 상태로 진입
    await gotoResult(
      page,
      SESSION_ID,
      CONTENT_ID,
      "?payment_success=true&paymentType=single&sceneIndex=3&orderId=test-r29",
    );
    await waitForScenes(page);

    // 전체 구매 버튼 여전히 표시됨 (일부 유료 씬 미구매 → 버튼 존재)
    const unlockAllBtn = page.locator(
      "[data-testid='flow-overview-unlock-all-btn']",
    );
    await expect(unlockAllBtn).toBeVisible();

    // 전체 구매 모달 열기
    await unlockAllBtn.click();
    await expect(page.locator("[data-testid='payment-modal']")).toBeVisible({
      timeout: 5000,
    });

    // 현재 구현: 차액 없이 2,900원 표시 (개선 여지: 구매한 씬 금액 차감)
    const priceEl = page.locator("[data-testid='payment-modal-price']");
    await expect(priceEl).toBeVisible({ timeout: 5000 });
    await expect(priceEl).toContainText("2,900");

    // 모달 닫기
    await page.locator("[data-testid='payment-modal-close-btn']").click();
    await expect(page.locator("[data-testid='payment-modal']")).not.toBeVisible({
      timeout: 3000,
    });
  });
});
