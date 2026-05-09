import { test, expect, Page } from "@playwright/test";

const SESSION_ID = "test-reveal-mvp";
const CONTENT_ID = "love-1";

// Helper: localStorage에 분석 데이터 세팅 후 결과 페이지 이동
const gotoResultWithData = async (
  page: Page,
  sessionId = SESSION_ID,
  contentId = CONTENT_ID,
) => {
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
  await page.goto(`/result/${sessionId}`);
};

test.describe("Body Section Reveal (MVP)", () => {
  test.beforeEach(async ({ page }) => {
    await gotoResultWithData(page);
    await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
  });

  test("Opening message는 초기 로드 시 visible", async ({ page }) => {
    const sceneMessages = page.locator(
      '[data-scene-idx="0"] [data-testid="scene-messages"]'
    );
    await expect(sceneMessages).toBeVisible();
  });

  test("Body section은 초기 data-visible=false, scrollIntoViewIfNeeded 후 true", async ({
    page,
  }) => {
    const bodySection = page.locator(
      '[data-scene-idx="0"] [data-body-section="true"]'
    );
    await expect(bodySection).toHaveAttribute("data-visible", "false");
    await bodySection.scrollIntoViewIfNeeded();
    await expect(bodySection).toHaveAttribute("data-visible", "true");
  });

  test("Locked scene: preview 보임, body-section 없음", async ({
    page,
  }) => {
    await page.locator('[data-scene-idx="2"]').scrollIntoViewIfNeeded();

    const paidScene = page.locator('[data-scene-idx="2"]');
    const preview = paidScene.locator('[data-testid="scene-preview-messages"]');
    const bodySection = paidScene.locator('[data-body-section="true"]');

    await expect(preview).toBeVisible();
    await expect(bodySection).toHaveCount(0);
  });

  test("Locked scene Lock CTA 클릭 가능", async ({ page }) => {
    await page.locator('[data-scene-idx="2"]').scrollIntoViewIfNeeded();

    const lockBtn = page.locator(
      '[data-scene-idx="2"] [data-testid="scene-unlock-btn"]'
    );
    await expect(lockBtn).toBeVisible();
    await expect(lockBtn).toBeEnabled();
  });
});
