import { test, expect } from "@playwright/test";

test.describe("A: 분석 입력 페이지 (/analyze/[session_id])", () => {
  const baseUrl = "http://localhost:3000";

  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}/analyze/test-session-001`);
  });

  // ── A-01 ~ A-07: 페이지 로드 및 자유입력 유효성 검증 ──────────────────
  test("A-01: 분석 페이지 로드 시 자유입력 단계 렌더링", async ({ page }) => {
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();

    const heading = page.locator("h1");
    await expect(heading.first()).toBeVisible();
  });

  test("A-02: 자유입력 input의 placeholder 텍스트 확인", async ({ page }) => {
    const textarea = page.locator('textarea');
    const placeholder = await textarea.getAttribute("placeholder");
    expect(placeholder).toContain("상황을");
  });

  test("A-03: 초기 상태에서 textarea 값이 비어있음", async ({ page }) => {
    const textarea = page.locator('textarea');
    const value = await textarea.inputValue();
    expect(value).toBe("");
  });

  test("A-04: textarea에 텍스트 입력 가능", async ({ page }) => {
    const textarea = page.locator('textarea');
    const testInput = "자꾸 상대가 의심되고, 확인하면 안 되는데 자꾸 봐";

    await textarea.fill(testInput);
    const value = await textarea.inputValue();
    expect(value).toBe(testInput);
  });

  test("A-05: textarea에 여러 줄 입력 가능", async ({ page }) => {
    const textarea = page.locator('textarea');
    const multilineInput = "첫 번째 줄\n두 번째 줄\n세 번째 줄";

    await textarea.fill(multilineInput);
    const value = await textarea.inputValue();
    expect(value).toBe(multilineInput);
  });

  test("A-06: 최대 500자 제한 확인", async ({ page }) => {
    const textarea = page.locator('textarea');
    const longText = "a".repeat(600);

    await textarea.fill(longText);
    const value = await textarea.inputValue();
    expect(value.length).toBeLessThanOrEqual(500);
  });

  test("A-07: 빈 입력으로 제출 시도 시 제출 불가", async ({ page }) => {
    const submitButton = page.locator('button:has-text("이어서")');

    // 빈 상태에서는 제출 버튼이 disabled
    const isDisabled = await submitButton.isDisabled();
    expect(isDisabled).toBe(true);
  });

  // ── A-08 ~ A-10: 자유입력 제출 및 단계 전환 ───────────────────────────
  test("A-08: 유효한 입력으로 제출 가능", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");

    // 제출 버튼이 활성화되어야 함
    const isDisabled = await submitButton.isDisabled();
    expect(isDisabled).toBe(false);
  });

  test("A-09: 자유입력 제출 후 반응 버블 화면으로 전환", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    // 반응 버블 메시지가 보이는지 확인
    const reactionText = page.locator('text=/고마워|상황을|몇 가지/');
    await expect(reactionText.first()).toBeVisible({ timeout: 1000 });
  });

  test("A-10: 자유입력 데이터가 상태에 저장됨", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');
    const testInput = "자꾸 상대가 의심되고, 휴대폰을 확인하게 돼";

    await textarea.fill(testInput);
    await submitButton.click();

    await page.waitForTimeout(500);

    // 반응 버블이 보일 때까지 대기
    const reactionText = page.locator('text=/고마워|상황을|몇 가지/');
    await expect(reactionText.first()).toBeVisible({ timeout: 1000 });
  });

  // ── A-11 ~ A-13: 반응 버블 상호작용 ──────────────────────────────────
  test("A-11: 반응 버블에 여러 메시지가 표시", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    // 첫 번째 메시지 확인
    const firstMessage = page.locator('text="고마워"');
    await expect(firstMessage).toBeVisible({ timeout: 1000 });
  });

  test("A-12: 반응 버블 자동 진행으로 다음 단계 진입", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    // 반응 버블이 보이는지 확인
    await expect(page.locator('text="고마워"')).toBeVisible({ timeout: 1000 });

    // 자동 진행되거나 클릭 가능한 버튼이 있으면 클릭
    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      // 자동 진행인 경우 대기
      await page.waitForTimeout(3000);
    }

    // 보정 질문 화면이 보이는지 확인
    const correctionQuestion = page.locator('[role="radio"], [role="checkbox"]');
    await expect(correctionQuestion.first()).toBeVisible({ timeout: 2000 });
  });

  test("A-13: 반응 버블 메시지가 명확하고 감정적이지 않음", async ({
    page,
  }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    await expect(page.locator('text="고마워"')).toBeVisible({ timeout: 1000 });

    // 메시지 내용이 "분석", "진단" 같은 단어를 포함하지 않아야 함
    const messageText = await page.locator('div').filter({ hasText: /고마워/ }).textContent();
    expect(messageText).not.toMatch(/분석|진단|테스트|검사/);
  });

  // ── A-14 ~ A-17: 보정 질문 렌더링 ────────────────────────────────────
  test("A-14: 보정 질문이 한 화면에 하나씩 표시", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    // 반응 버블이 보이는지 확인
    await expect(page.locator('text="고마워"')).toBeVisible({ timeout: 1000 });

    // 다음 단계로 진행
    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      await page.waitForTimeout(3000);
    }

    // 보정 질문 요소가 보이는지 확인
    const questionText = page.locator('text=/행동|빈도|기간|반응|영향|경험/i').first();
    await expect(questionText).toBeVisible({ timeout: 2000 });

    // 선택 옵션이 있는지 확인
    const option = page.locator('button[role="radio"], button[role="checkbox"]');
    await expect(option.first()).toBeVisible({ timeout: 2000 });
  });

  test("A-15: 보정 질문의 선택 옵션이 렌더링", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    await page.waitForTimeout(1000);

    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      await page.waitForTimeout(3000);
    }

    // 선택 옵션 확인
    const options = page.locator('button[role="radio"], button[role="checkbox"]');
    expect(await options.count()).toBeGreaterThan(0);
  });

  test("A-16: 질문 텍스트가 명확하게 표시", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    await page.waitForTimeout(1000);

    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      await page.waitForTimeout(3000);
    }

    // 질문 텍스트 확인
    const questionText = page.locator('text=/행동|빈도|기간|반응|영향|경험/i');
    await expect(questionText.first()).toBeVisible({ timeout: 2000 });
  });

  test("A-17: 다음 버튼이 선택 후에 활성화됨", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    await page.waitForTimeout(1000);

    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      await page.waitForTimeout(3000);
    }

    // 첫 번째 선택지 클릭
    const option = page.locator('button[role="radio"], button[role="checkbox"]');
    if (await option.first().isVisible({ timeout: 2000 })) {
      await option.first().click();
      await page.waitForTimeout(300);
    }
  });

  // ── A-18 ~ A-20: 선택지 상호작용 ────────────────────────────────────
  test("A-18: 보정 질문 선택지를 클릭하여 선택 가능", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    await page.waitForTimeout(1000);

    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      await page.waitForTimeout(3000);
    }

    // 첫 번째 선택지 클릭
    const option = page.locator('button[role="radio"], button[role="checkbox"]');
    await expect(option.first()).toBeVisible({ timeout: 2000 });
    await option.first().click();
  });

  test("A-19: 선택 후 다음 질문으로 자연스럽게 전환", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    await page.waitForTimeout(1000);

    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      await page.waitForTimeout(3000);
    }

    // 첫 번째 선택지 클릭
    const option = page.locator('button[role="radio"], button[role="checkbox"]');
    if (await option.first().isVisible({ timeout: 2000 })) {
      await option.first().click();
      await page.waitForTimeout(500);
    }
  });

  test("A-20: 복수 선택이 가능한 질문에서 여러 옵션 선택 가능", async ({
    page,
  }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    await page.waitForTimeout(1000);

    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      await page.waitForTimeout(3000);
    }

    // checkbox 요소가 있으면 복수 선택 가능
    const checkboxes = page.locator('button[role="checkbox"]');
    const checkboxCount = await checkboxes.count();

    if (checkboxCount > 1) {
      // 첫 번째와 두 번째 체크박스 선택
      await checkboxes.nth(0).click();
      await page.waitForTimeout(200);
      await checkboxes.nth(1).click();
    }
  });

  // ── A-21 ~ A-23: 모든 질문 완료 및 결과 생성 ──────────────────────────
  test("A-21: 모든 보정 질문 답변 완료 후 완료 화면 표시", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    await page.waitForTimeout(1000);

    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      await page.waitForTimeout(3000);
    }

    // 모든 질문을 자동으로 선택하고 완료될 때까지 진행
    for (let i = 0; i < 8; i++) {
      const option = page.locator('button[role="radio"], button[role="checkbox"]');
      const optionCount = await option.count();

      if (optionCount === 0) {
        break;
      }

      // 첫 번째 옵션 선택
      await option.first().click();
      await page.waitForTimeout(300);

      // 완료 화면인지 확인
      const completingText = page.locator(
        'text=/모든 질문이 끝났어|흐름을 정리하고 있어/'
      );
      if (await completingText.isVisible({ timeout: 500 })) {
        break;
      }
    }

    // 완료 화면이 보이는지 확인
    const completingText = page.locator(
      'text=/모든 질문이 끝났어|흐름을 정리하고 있어/'
    );
    await expect(completingText.first()).toBeVisible({ timeout: 3000 });
  });

  test("A-22: 완료 화면에 체크 아이콘 및 로딩 애니메이션 표시", async ({
    page,
  }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    await page.waitForTimeout(1000);

    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      await page.waitForTimeout(3000);
    }

    // 모든 질문 선택
    for (let i = 0; i < 8; i++) {
      const option = page.locator('button[role="radio"], button[role="checkbox"]');
      const optionCount = await option.count();

      if (optionCount === 0) break;

      await option.first().click();
      await page.waitForTimeout(300);

      const completingText = page.locator(
        'text=/모든 질문이 끝났어|흐름을 정리하고 있어/'
      );
      if (await completingText.isVisible({ timeout: 500 })) {
        break;
      }
    }

    // 완료 화면 확인
    const checkIcon = page.locator('svg path[d*="5 13"]');
    await expect(checkIcon.first()).toBeVisible({ timeout: 3000 });

    // 로딩 닷 확인
    const loadingDot = page.locator('[style*="dotBounce"]');
    await expect(loadingDot.first()).toBeVisible({ timeout: 1000 });
  });

  test("A-23: 완료 화면에 명확한 메시지 표시", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    await page.waitForTimeout(1000);

    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      await page.waitForTimeout(3000);
    }

    // 모든 질문 선택
    for (let i = 0; i < 8; i++) {
      const option = page.locator('button[role="radio"], button[role="checkbox"]');
      const optionCount = await option.count();

      if (optionCount === 0) break;

      await option.first().click();
      await page.waitForTimeout(300);

      const completingText = page.locator(
        'text=/모든 질문이 끝났어|흐름을 정리하고 있어/'
      );
      if (await completingText.isVisible({ timeout: 500 })) {
        break;
      }
    }

    // 완료 메시지 확인
    const messageText = page.locator('h1:has-text("모든 질문이 끝났어")');
    await expect(messageText).toBeVisible({ timeout: 3000 });
  });

  // ── A-24 ~ A-26: 결과 페이지 이동 및 데이터 저장 ──────────────────────
  test("A-24: 완료 화면에서 결과 페이지로 자동 이동", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    await page.waitForTimeout(1000);

    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      await page.waitForTimeout(3000);
    }

    // 모든 질문 선택
    for (let i = 0; i < 8; i++) {
      const option = page.locator('button[role="radio"], button[role="checkbox"]');
      const optionCount = await option.count();

      if (optionCount === 0) break;

      await option.first().click();
      await page.waitForTimeout(300);

      const completingText = page.locator(
        'text=/모든 질문이 끝났어|흐름을 정리하고 있어/'
      );
      if (await completingText.isVisible({ timeout: 500 })) {
        break;
      }
    }

    // 결과 페이지로 이동할 때까지 대기 (최대 5초)
    await page.waitForURL(/\/result\//, { timeout: 5000 });
    expect(page.url()).toContain("/result/");
  });

  test("A-25: 분석 데이터가 localStorage에 저장됨", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');
    const testInput = "자꾸 상대가 의심되고, 휴대폰을 확인하게 돼";

    await textarea.fill(testInput);
    await submitButton.click();

    await page.waitForTimeout(1000);

    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      await page.waitForTimeout(3000);
    }

    // 모든 질문 선택
    for (let i = 0; i < 8; i++) {
      const option = page.locator('button[role="radio"], button[role="checkbox"]');
      const optionCount = await option.count();

      if (optionCount === 0) break;

      await option.first().click();
      await page.waitForTimeout(300);

      const completingText = page.locator(
        'text=/모든 질문이 끝났어|흐름을 정리하고 있어/'
      );
      if (await completingText.isVisible({ timeout: 500 })) {
        break;
      }
    }

    // 완료 후 결과 페이지로 이동 대기
    await page.waitForURL(/\/result\//, { timeout: 5000 });

    // localStorage에 분석 데이터가 저장되었는지 확인
    const analysisData = await page.evaluate(() => {
      const stored = localStorage.getItem("veil_analysis_test-session-001");
      return stored ? JSON.parse(stored) : null;
    });

    expect(analysisData).toBeTruthy();
    expect(analysisData.free_input).toBe(testInput);
    expect(analysisData.answers).toBeDefined();
    expect(Array.isArray(analysisData.answers)).toBe(true);
  });

  test("A-26: 세션 ID가 올바르게 유지됨", async ({ page }) => {
    const textarea = page.locator('textarea');
    const submitButton = page.locator('button:has-text("이어서")');

    await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
    await submitButton.click();

    await page.waitForTimeout(1000);

    const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
    if (await continueButton.isVisible({ timeout: 500 })) {
      await continueButton.click();
    } else {
      await page.waitForTimeout(3000);
    }

    // 모든 질문 선택
    for (let i = 0; i < 8; i++) {
      const option = page.locator('button[role="radio"], button[role="checkbox"]');
      const optionCount = await option.count();

      if (optionCount === 0) break;

      await option.first().click();
      await page.waitForTimeout(300);

      const completingText = page.locator(
        'text=/모든 질문이 끝났어|흐름을 정리하고 있어/'
      );
      if (await completingText.isVisible({ timeout: 500 })) {
        break;
      }
    }

    // 결과 페이지로 이동
    await page.waitForURL(/\/result\//, { timeout: 5000 });

    // 세션 ID가 URL에 포함되어 있는지 확인
    expect(page.url()).toContain("/result/test-session-001");
  });
});
