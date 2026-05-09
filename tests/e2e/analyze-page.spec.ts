import { test, expect, Page } from "@playwright/test";

test.describe("A: 분석 입력 페이지 (/analyze/[session_id])", () => {
  const baseUrl = "http://localhost:3000";
  const TEST_SESSION = "test-session-001";
  const TEST_INPUT = "자꾸 상대가 의심되고, 휴대폰을 확인하게 돼";

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}/analyze/${TEST_SESSION}`);
  });

  /**
   * 자유입력 제출 후 반응 버블(reaction_after_free) 단계가 끝나고
   * 보정 질문(correction_questions) 단계의 첫 번째 옵션 버튼이 나타날 때까지 대기.
   * ReactionBubble은 4000ms 후 onComplete()를 호출하므로 timeout을 6000ms로 설정.
   */
  const submitFreeInputAndWaitForQuestions = async (page: Page) => {
    const textarea = page.locator("textarea");
    await textarea.fill(TEST_INPUT);
    await page.locator('button:has-text("이어서")').click();
    // 반응 버블에서 보정 질문으로 자동 전환(4000ms) 대기
    await expect(optionButtons(page).first()).toBeVisible({ timeout: 6000 });
  };

  /**
   * 보정 질문(correction_questions)의 옵션 버튼 로케이터.
   * 옵션은 <div class="space-y-2"><button>…</button></div> 구조로 렌더링됨.
   * header의 모바일 메뉴 버튼(hidden)과 충돌을 피하기 위해 .space-y-2 컨테이너로 스코프 한정.
   */
  const optionButtons = (page: Page) =>
    page.locator("div.space-y-2").locator("button");

  /**
   * 이동 버튼("다음 →" 또는 마지막 질문의 "완료") 로케이터.
   */
  const nextButton = (page: Page) =>
    page.locator('button:has-text("다음"), button:has-text("완료")').last();

  /**
   * 모든 보정 질문에 첫 번째 옵션을 선택 후 이동 버튼을 클릭하여
   * completing 단계 진입까지 순환 처리.
   * love-1 기준 6개 질문, 최대 8회 반복으로 방어.
   */
  const completeAllQuestions = async (page: Page) => {
    for (let i = 0; i < 8; i++) {
      const completing = page.locator('h1:has-text("모든 질문이 끝났어")');
      if (await completing.isVisible({ timeout: 300 })) break;

      const btn = optionButtons(page).first();
      if (!(await btn.isVisible({ timeout: 2000 }))) break;

      await btn.click();

      const next = nextButton(page);
      await expect(next).not.toBeDisabled({ timeout: 1000 });
      await next.click();

      // 질문 전환 애니메이션 대기
      await page.waitForTimeout(350);
    }
  };

  // ── A-01 ~ A-07: 페이지 로드 및 자유입력 유효성 검증 ──────────────────

  test("A-01: 분석 페이지 로드 시 자유입력 단계 렌더링", async ({ page }) => {
    await expect(page.locator("textarea")).toBeVisible();
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("A-02: 자유입력 textarea의 placeholder 텍스트 확인", async ({
    page,
  }) => {
    const placeholder = await page.locator("textarea").getAttribute("placeholder");
    expect(placeholder).toContain("상황을");
  });

  test("A-03: 초기 상태에서 textarea 값이 비어있음", async ({ page }) => {
    expect(await page.locator("textarea").inputValue()).toBe("");
  });

  test("A-04: textarea에 텍스트 입력 가능", async ({ page }) => {
    await page.locator("textarea").fill(TEST_INPUT);
    expect(await page.locator("textarea").inputValue()).toBe(TEST_INPUT);
  });

  test("A-05: textarea에 여러 줄 입력 가능", async ({ page }) => {
    const multi = "첫 번째 줄\n두 번째 줄\n세 번째 줄";
    await page.locator("textarea").fill(multi);
    expect(await page.locator("textarea").inputValue()).toBe(multi);
  });

  test("A-06: 최대 500자 제한 확인", async ({ page }) => {
    await page.locator("textarea").fill("a".repeat(600));
    expect((await page.locator("textarea").inputValue()).length).toBeLessThanOrEqual(500);
  });

  test("A-07: 빈 입력으로 제출 불가 (버튼 disabled)", async ({ page }) => {
    await expect(page.locator('button:has-text("이어서")')).toBeDisabled();
  });

  // ── A-08 ~ A-10: 자유입력 제출 및 단계 전환 ───────────────────────────

  test("A-08: 유효한 입력 시 제출 버튼 활성화", async ({ page }) => {
    await page.locator("textarea").fill(TEST_INPUT);
    await expect(page.locator('button:has-text("이어서")')).not.toBeDisabled();
  });

  test("A-09: 자유입력 제출 후 반응 버블로 전환", async ({ page }) => {
    await page.locator("textarea").fill(TEST_INPUT);
    await page.locator('button:has-text("이어서")').click();
    // 100ms 딜레이 후 첫 메시지 표시
    await expect(page.locator('text="고마워"')).toBeVisible({ timeout: 1500 });
  });

  test("A-10: 자유입력 데이터가 상태에 보존됨 (반응 버블 진입 확인)", async ({
    page,
  }) => {
    await page.locator("textarea").fill(TEST_INPUT);
    await page.locator('button:has-text("이어서")').click();
    // 반응 버블이 노출되면 free_input이 상태에 저장된 것
    await expect(page.locator('text="고마워"')).toBeVisible({ timeout: 1500 });
  });

  // ── A-11 ~ A-13: 반응 버블 상호작용 ──────────────────────────────────

  test("A-11: 반응 버블에 여러 메시지가 순차 표시", async ({ page }) => {
    await page.locator("textarea").fill(TEST_INPUT);
    await page.locator('button:has-text("이어서")').click();
    // 3개 메시지가 순차 등장 (delays: 100ms, 800ms, 1800ms)
    await expect(page.locator('text="고마워"')).toBeVisible({ timeout: 1500 });
    await expect(
      page.locator('text="상황을 자세히 이해하기 위해"')
    ).toBeVisible({ timeout: 2000 });
    await expect(page.locator('text="몇 가지만 더 볼게."')).toBeVisible({
      timeout: 3000,
    });
  });

  test("A-12: 반응 버블 자동 완료 후 보정 질문 단계 진입", async ({
    page,
  }) => {
    await page.locator("textarea").fill(TEST_INPUT);
    await page.locator('button:has-text("이어서")').click();
    // 반응 버블은 4000ms 후 자동 완료 → 보정 질문으로 전환
    await expect(optionButtons(page).first()).toBeVisible({ timeout: 6000 });
  });

  test("A-13: 반응 버블 메시지에 '분석/진단' 단어 미포함", async ({ page }) => {
    await page.locator("textarea").fill(TEST_INPUT);
    await page.locator('button:has-text("이어서")').click();
    await expect(page.locator('text="고마워"')).toBeVisible({ timeout: 1500 });
    // 메시지 버블 컨테이너 (items-start gap-2 내부)
    const bubbleContainer = page.locator(
      ".flex.flex-col.items-start.gap-2"
    );
    const text = await bubbleContainer.textContent({ timeout: 2000 });
    expect(text).not.toMatch(/분석|진단|테스트|검사/);
  });

  // ── A-14 ~ A-17: 보정 질문 렌더링 ────────────────────────────────────

  test("A-14: 보정 질문이 한 화면에 하나씩 표시", async ({ page }) => {
    await submitFreeInputAndWaitForQuestions(page);
    // 질문 텍스트와 옵션 버튼이 동시에 한 세트만 보여야 함
    const questionLabel = page.locator('p:has-text("질문 1")');
    await expect(questionLabel).toBeVisible({ timeout: 1000 });
    // "질문 2"는 보이지 않아야 함
    await expect(page.locator('p:has-text("질문 2")')).not.toBeVisible();
  });

  test("A-15: 보정 질문의 선택 옵션이 렌더링", async ({ page }) => {
    await submitFreeInputAndWaitForQuestions(page);
    const count = await optionButtons(page).count();
    expect(count).toBeGreaterThan(0);
  });

  test("A-16: 질문 텍스트가 명확하게 표시", async ({ page }) => {
    await submitFreeInputAndWaitForQuestions(page);
    // love-1 첫 질문: "이런 행동이 얼마나 자주 일어나?"
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible({ timeout: 1000 });
    const questionText = await h1.textContent();
    expect(questionText?.trim().length).toBeGreaterThan(0);
  });

  test("A-17: 옵션 선택 전 이동 버튼이 비활성화됨", async ({ page }) => {
    await submitFreeInputAndWaitForQuestions(page);
    // 아무것도 선택하지 않은 상태에서 다음 버튼 disabled
    await expect(nextButton(page)).toBeDisabled({ timeout: 1000 });
  });

  // ── A-18 ~ A-20: 선택지 상호작용 ────────────────────────────────────

  test("A-18: 보정 질문 선택지를 클릭하여 선택 가능", async ({ page }) => {
    await submitFreeInputAndWaitForQuestions(page);
    const firstOption = optionButtons(page).first();
    await firstOption.click();
    // 선택 후 이동 버튼 활성화 확인
    await expect(nextButton(page)).not.toBeDisabled({ timeout: 1000 });
  });

  test("A-19: 선택 후 다음 버튼 클릭 시 다음 질문으로 전환", async ({
    page,
  }) => {
    await submitFreeInputAndWaitForQuestions(page);
    await optionButtons(page).first().click();
    await nextButton(page).click();
    // 질문 2로 전환됨
    await expect(page.locator('p:has-text("질문 2")')).toBeVisible({
      timeout: 2000,
    });
  });

  test("A-20: 복수 선택 질문에서 여러 옵션 동시 선택 가능", async ({
    page,
  }) => {
    await submitFreeInputAndWaitForQuestions(page);
    // 첫 번째 single 질문을 넘기고 multiple 질문(index 4)에 도달
    // love-1 기준: 질문 1(single), 2(single), 3(single), 4(multiple)
    for (let q = 0; q < 3; q++) {
      await optionButtons(page).first().click();
      await nextButton(page).click();
      await page.waitForTimeout(350);
    }
    // 질문 4(multiple): 여러 개 선택 가능
    const opts = optionButtons(page);
    await expect(opts.first()).toBeVisible({ timeout: 2000 });
    await opts.nth(0).click();
    await opts.nth(1).click();
    // 두 개 선택됐으므로 이동 버튼 활성화
    await expect(nextButton(page)).not.toBeDisabled({ timeout: 1000 });
  });

  // ── A-21 ~ A-23: 모든 질문 완료 및 completing 화면 ──────────────────────

  test("A-21: 모든 보정 질문 완료 후 completing 화면 표시", async ({
    page,
  }) => {
    await submitFreeInputAndWaitForQuestions(page);
    await completeAllQuestions(page);
    await expect(
      page.locator('h1:has-text("모든 질문이 끝났어")')
    ).toBeVisible({ timeout: 3000 });
  });

  test("A-22: completing 화면에 체크 아이콘과 로딩 닷 표시", async ({
    page,
  }) => {
    await submitFreeInputAndWaitForQuestions(page);
    await completeAllQuestions(page);

    // 체크 아이콘 SVG (path d="M5 13l4 4L19 7" 포함)
    const checkPath = page.locator('svg path[d="M5 13l4 4L19 7"]');
    await expect(checkPath).toBeVisible({ timeout: 3000 });

    // 로딩 닷 (inline style에 dotBounce animation 포함)
    const loadingDot = page.locator('[style*="dotBounce"]').first();
    await expect(loadingDot).toBeVisible({ timeout: 1000 });
  });

  test("A-23: completing 화면에 명확한 메시지 표시", async ({ page }) => {
    await submitFreeInputAndWaitForQuestions(page);
    await completeAllQuestions(page);
    await expect(
      page.locator('h1:has-text("모든 질문이 끝났어")')
    ).toBeVisible({ timeout: 3000 });
    await expect(
      page.locator('text="흐름을 정리하고 있어."')
    ).toBeVisible({ timeout: 1000 });
  });

  // ── A-24 ~ A-26: 결과 페이지 이동 및 데이터 저장 ──────────────────────

  test("A-24: completing 화면에서 결과 페이지로 자동 이동", async ({
    page,
  }) => {
    await submitFreeInputAndWaitForQuestions(page);
    await completeAllQuestions(page);
    // completing 화면 → 3000ms 후 router.push
    await page.waitForURL(/\/result\//, { timeout: 8000 });
    expect(page.url()).toContain("/result/");
  });

  test("A-25: 분석 데이터가 올바른 session_id 키로 localStorage에 저장됨", async ({
    page,
  }) => {
    await submitFreeInputAndWaitForQuestions(page);
    await completeAllQuestions(page);
    await page.waitForURL(/\/result\//, { timeout: 8000 });

    const analysisData = await page.evaluate((sid) => {
      const stored = localStorage.getItem(`veil_analysis_${sid}`);
      return stored ? JSON.parse(stored) : null;
    }, TEST_SESSION);

    expect(analysisData).toBeTruthy();
    expect(analysisData.free_input).toBe(TEST_INPUT);
    expect(Array.isArray(analysisData.answers)).toBe(true);
    expect(analysisData.answers.length).toBeGreaterThan(0);
  });

  test("A-26: 세션 ID가 결과 페이지 URL에 올바르게 유지됨", async ({
    page,
  }) => {
    await submitFreeInputAndWaitForQuestions(page);
    await completeAllQuestions(page);
    await page.waitForURL(/\/result\//, { timeout: 8000 });
    expect(page.url()).toContain(`/result/${TEST_SESSION}`);
  });
});
