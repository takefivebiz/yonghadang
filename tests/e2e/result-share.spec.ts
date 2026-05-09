import { test, expect, Page } from "@playwright/test";

// ── 상수 ──────────────────────────────────────────────────────────────
const SESSION_ID = "test-share-session-r30";
const CONTENT_ID = "love-1";

// 실제 base URL은 env에 따라 다를 수 있으므로 패턴 기반으로 검증
// /share/${SESSION_ID} 포함 여부 + /result/ 미포함 여부로 판단
const SHARE_PATH = `/share/${SESSION_ID}`;

// ── Helper: localStorage 세팅 후 결과 페이지 이동 ──────────────────────
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
  // 씬 렌더링 완료 대기
  await expect(page.locator("h2").first()).toBeVisible({ timeout: 8000 });
};

/**
 * window.open을 가로채 호출된 URL을 기록하는 spy를 페이지에 주입.
 * 실제 창이 열리지 않으므로 외부 연결 없이 URL만 검증 가능.
 */
const injectWindowOpenSpy = async (page: Page) => {
  await page.evaluate(() => {
    (window as unknown as Record<string, unknown>)._openedUrls = [];
    window.open = (
      url?: string | URL,
      ...rest: Parameters<typeof window.open>
    ) => {
      (
        (window as unknown as Record<string, unknown>)
          ._openedUrls as string[]
      ).push((url ?? "").toString());
      void rest; // unused
      return null;
    };
  });
};

/** spy가 캡처한 URL 목록 반환 */
const getOpenedUrls = (page: Page): Promise<string[]> =>
  page.evaluate(
    () =>
      (window as unknown as Record<string, unknown>)._openedUrls as string[],
  );

/**
 * navigator.clipboard.writeText 를 mock 처리해 복사된 텍스트를 캡처.
 * 헤드리스 환경에서 clipboard API 권한 없이도 동작함.
 */
const injectClipboardMock = async (page: Page) => {
  await page.evaluate(() => {
    (window as unknown as Record<string, unknown>)._clipboardText = "";
    // clipboard는 getter이므로 defineProperty로 override
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (text: string) => {
          (
            window as unknown as Record<string, unknown>
          )._clipboardText = text;
        },
      },
      configurable: true,
      writable: true,
    });
  });
};

const getClipboardText = (page: Page): Promise<string> =>
  page.evaluate(
    () =>
      (window as unknown as Record<string, unknown>)._clipboardText as string,
  );

// ─────────────────────────────────────────────────────────────────────────
test.describe("R-30~34: 결과 페이지 공유 기능 (/result/[session_id])", () => {
  // ── R-30: 공유 버튼 3개 렌더링 확인 ─────────────────────────────────
  test("R-30: 카카오 / X / 링크복사 공유 버튼이 렌더링된다", async ({
    page,
  }) => {
    await gotoResultWithData(page);

    // 페이지 하단까지 스크롤해 공유 버튼 영역 노출
    await page.locator("[data-testid='share-btn-kakao']").scrollIntoViewIfNeeded();

    await expect(page.locator("[data-testid='share-btn-kakao']")).toBeVisible();
    await expect(page.locator("[data-testid='share-btn-x']")).toBeVisible();
    await expect(page.locator("[data-testid='share-btn-copy']")).toBeVisible();
    await expect(page.locator("[data-testid='other-contents-link']")).toBeVisible();
  });

  // ── R-31: 링크 복사 → 클립보드 URL 확인 + toast 표시 ────────────────
  test("R-31: 링크 복사 버튼 클릭 시 shareUrl이 클립보드에 복사되고 toast가 표시된다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await injectClipboardMock(page);

    const copyBtn = page.locator("[data-testid='share-btn-copy']");
    await copyBtn.scrollIntoViewIfNeeded();
    await copyBtn.click();

    // ── toast 확인 ──────────────────────────────────────────────────
    await expect(page.locator("[data-testid='copy-toast']")).toBeVisible({
      timeout: 3000,
    });
    await expect(page.locator("text=링크가 복사되었어요")).toBeVisible();

    // ── 복사된 URL이 /share/[share_id] 형식인지 확인 ────────────────
    const copied = await getClipboardText(page);
    expect(copied).toContain(SHARE_PATH);
    expect(copied).not.toContain("/result/");
  });

  // ── R-31b: toast가 2초 후 자동으로 사라지는지 확인 ──────────────────
  test("R-31b: 링크 복사 toast는 2초 후 자동으로 사라진다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await injectClipboardMock(page);

    const copyBtn = page.locator("[data-testid='share-btn-copy']");
    await copyBtn.scrollIntoViewIfNeeded();
    await copyBtn.click();

    await expect(page.locator("[data-testid='copy-toast']")).toBeVisible({
      timeout: 3000,
    });
    // 2초 후 toast 사라짐 (2500ms 대기)
    await expect(page.locator("[data-testid='copy-toast']")).not.toBeVisible({
      timeout: 3500,
    });
  });

  // ── R-32: X 공유 버튼 → twitter URL + share URL 포함 확인 ───────────
  test("R-32: X 공유 버튼 클릭 시 twitter intent URL에 shareUrl이 포함된다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await injectWindowOpenSpy(page);

    const xBtn = page.locator("[data-testid='share-btn-x']");
    await xBtn.scrollIntoViewIfNeeded();
    await xBtn.click();

    const urls = await getOpenedUrls(page);
    expect(urls).toHaveLength(1);

    const openedUrl = urls[0];

    // twitter intent 형식 확인
    expect(openedUrl).toContain("twitter.com/intent/tweet");

    // shareUrl이 URL 파라미터에 인코딩되어 포함되는지 확인
    // (base URL은 env에 따라 달라지므로 path 부분만 검증)
    const decodedUrl = decodeURIComponent(openedUrl);
    expect(decodedUrl).toContain(SHARE_PATH);

    // /result/ 경로가 공유 URL에 포함되지 않는지 확인
    expect(decodedUrl).not.toContain(`/result/${SESSION_ID}`);
  });

  // ── R-32b: X 공유 URL이 /share/[share_id] 형식 확인 ─────────────────
  test("R-32b: X 공유 URL의 share_id가 세션 ID와 일치한다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await injectWindowOpenSpy(page);

    await page.locator("[data-testid='share-btn-x']").scrollIntoViewIfNeeded();
    await page.locator("[data-testid='share-btn-x']").click();

    const urls = await getOpenedUrls(page);
    const decodedUrl = decodeURIComponent(urls[0]);

    // /share/${SESSION_ID} 패턴 확인
    expect(decodedUrl).toContain(`/share/${SESSION_ID}`);
  });

  // ── R-33: 카카오 공유 버튼 → shareUrl로 window.open 호출 확인 ────────
  test("R-33: 카카오 공유 버튼 클릭 시 /share/[share_id] URL로 처리된다", async ({
    page,
  }) => {
    await gotoResultWithData(page);
    await injectWindowOpenSpy(page);

    const kakaoBtn = page.locator("[data-testid='share-btn-kakao']");
    await kakaoBtn.scrollIntoViewIfNeeded();
    await kakaoBtn.click();

    const urls = await getOpenedUrls(page);
    expect(urls).toHaveLength(1);

    const openedUrl = urls[0];

    // 카카오는 현재 fallback: window.open(shareUrl) → /share/[share_id] URL이어야 함
    expect(openedUrl).toContain(SHARE_PATH);

    // /result/ 경로를 직접 공유하면 안 됨
    expect(openedUrl).not.toContain(`/result/${SESSION_ID}`);
  });

  // ── R-34: "다른 콘텐츠 보기" 클릭 → 홈(/) 이동 ──────────────────────
  test("R-34: '다른 콘텐츠 보기' 클릭 시 홈 페이지(/)로 이동한다", async ({
    page,
  }) => {
    await gotoResultWithData(page);

    const link = page.locator("[data-testid='other-contents-link']");
    await link.scrollIntoViewIfNeeded();
    await link.click();

    // 홈으로 이동 확인
    await expect(page).toHaveURL(/\/$/, { timeout: 5000 });
  });
});
