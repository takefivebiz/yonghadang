import { test, expect } from '@playwright/test';

test.describe('메인 페이지 - 기본 로드 및 네비게이션', () => {
  test('메인 페이지 로드 및 기본 요소 확인', async ({ page }) => {
    await page.goto('/');

    // 페이지 로드 확인
    await expect(page).toHaveTitle(/VEIL/);

    // 주요 섹션 확인
    await expect(page.locator('section[id="love"]')).toBeVisible();
    await expect(page.locator('section[id="relationship"]')).toBeVisible();
    await expect(page.locator('section[id="career"]')).toBeVisible();
    await expect(page.locator('section[id="emotion"]')).toBeVisible();
  });

  test('overflow-x 없음 - 수평 스크롤 방지', async ({ page }) => {
    await page.goto('/');

    // window width와 body width 비교
    const overflow = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      return scrollWidth > clientWidth;
    });

    expect(overflow).toBe(false);
  });
});

test.describe('하단 CTA 버튼 - Bottom Sheet', () => {
  test('하단 CTA 버튼 클릭 시 bottom sheet 오픈', async ({ page }) => {
    await page.goto('/');

    // CTA 버튼 찾기 및 클릭
    const ctaButton = page.locator('button:has-text("진짜 나를 이해하는 3분")');
    await expect(ctaButton).toBeVisible();
    await ctaButton.click();

    // bottom sheet이 열렸는지 확인
    const sheet = page.locator('div[class*="translate-y-0"][class*="fixed"]');
    await expect(sheet).toBeVisible();

    // bottom sheet 내 텍스트 확인
    await expect(page.locator('text=지금, 어떤 부분이 가장 신경 쓰여')).toBeVisible();
  });

  test('Bottom sheet에서 카테고리 선택 시 /category/[category]로 이동', async ({ page }) => {
    await page.goto('/');

    // CTA 버튼 클릭
    const ctaButton = page.locator('button:has-text("진짜 나를 이해하는 3분")');
    await ctaButton.click();

    // "연애·결혼" 카테고리 선택
    const loveCategory = page.locator('button:has-text("연애·결혼")');
    await expect(loveCategory).toBeVisible();
    await loveCategory.click();

    // 라우팅 확인
    await page.waitForURL(/\/category\/love/);
    expect(page.url()).toContain('/category/love');
  });

  test('Bottom sheet 백드롭 클릭 시 close', async ({ page }) => {
    await page.goto('/');

    // CTA 버튼 클릭하여 sheet 오픈
    const ctaButton = page.locator('button:has-text("진짜 나를 이해하는 3분")');
    await ctaButton.click();

    // sheet이 보이는지 확인
    const sheet = page.locator('div[class*="translate-y-0"][class*="fixed"]');
    await expect(sheet).toBeVisible();

    // 백드롭 클릭
    const backdrop = page.locator('div[class*="bg-black/40"]');
    await backdrop.click();

    // sheet이 닫혔는지 확인 (translate-y-full로 돌아가야 함)
    await expect(sheet).not.toBeVisible({ timeout: 500 });
  });
});

test.describe('콘텐츠 카드 네비게이션', () => {
  test('메인 페이지에서 콘텐츠 카드 클릭 시 /content/[id]로 이동', async ({ page }) => {
    await page.goto('/');

    // 첫 번째 content card 찾기 및 클릭
    const firstCard = page.locator('a[href*="/content/"]').first();
    const cardHref = await firstCard.getAttribute('href');
    expect(cardHref).toMatch(/\/content\/.+/);

    await firstCard.click();

    // 라우팅 확인
    await page.waitForURL(/\/content\/.+/);
    expect(page.url()).toMatch(/\/content\/.+/);
  });

  test('Category 페이지에서 콘텐츠 카드 클릭', async ({ page }) => {
    await page.goto('/category/love');

    // 첫 번째 content card 찾기
    const firstCard = page.locator('a[href*="/content/"]').first();
    const cardHref = await firstCard.getAttribute('href');
    expect(cardHref).toMatch(/\/content\/.+/);

    await firstCard.click();

    // 라우팅 확인
    await page.waitForURL(/\/content\/.+/);
    expect(page.url()).toMatch(/\/content\/.+/);
  });
});

test.describe('Content Intro - 시작하기 버튼', () => {
  test('Content intro에서 "시작하기" 클릭 시 /analyze/[session_id]로 이동', async ({ page }) => {
    // 특정 콘텐츠로 직접 이동
    await page.goto('/content/love-1');

    // "시작하기" 버튼 찾기
    const startButton = page.locator('button:has-text("시작하기")');
    await expect(startButton).toBeVisible();

    const oldUrl = page.url();
    await startButton.click();

    // 라우팅 확인 - /analyze/로 시작하는 URL로 이동해야 함
    await page.waitForURL(/\/analyze\/.+/, { timeout: 5000 });
    const newUrl = page.url();
    expect(newUrl).toMatch(/\/analyze\/.+/);
    expect(newUrl).not.toBe(oldUrl);
  });

  test('시작하기 버튼 클릭 시 페이지 이동', async ({ page }) => {
    await page.goto('/content/love-1');

    const startButton = page.locator('button:has-text("시작하기")');
    await expect(startButton).toBeVisible();

    // 클릭 전 URL
    const initialUrl = page.url();

    // 클릭하여 페이지 이동
    await startButton.click();

    // /analyze로 시작하는 URL로 이동 확인
    await page.waitForURL(/\/analyze\/.+/, { timeout: 5000 });
    const newUrl = page.url();
    expect(newUrl).toMatch(/\/analyze\/.+/);
    expect(newUrl).not.toBe(initialUrl);
  });
});

test.describe('모바일 뷰포트 - iPhone 13', () => {
  test.use({
    viewport: { width: 390, height: 844 },
  });

  test('모바일에서 메인 페이지 로드', async ({ page }) => {
    await page.goto('/');

    // 페이지 로드 확인
    await expect(page).toHaveTitle(/VEIL/);

    // 모바일에서도 섹션 확인
    await expect(page.locator('section[id="love"]')).toBeVisible();
  });

  test('모바일에서 overflow-x 없음', async ({ page }) => {
    await page.goto('/');

    // window width와 body width 비교
    const overflow = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      return scrollWidth > clientWidth;
    });

    expect(overflow).toBe(false);
  });

  test('모바일에서 CTA 버튼 클릭 및 bottom sheet 오픈', async ({ page }) => {
    await page.goto('/');

    // CTA 버튼 찾기
    const ctaButton = page.locator('button:has-text("진짜 나를 이해하는 3분")');
    await expect(ctaButton).toBeVisible();

    // 버튼이 클릭 가능한지 확인
    const isClickable = await ctaButton.isEnabled();
    expect(isClickable).toBe(true);

    // 클릭
    await ctaButton.click();

    // bottom sheet 오픈 확인
    const sheet = page.locator('div[class*="translate-y-0"][class*="fixed"]');
    await expect(sheet).toBeVisible();
  });

  test('모바일에서 bottom sheet 카테고리 선택', async ({ page }) => {
    await page.goto('/');

    // CTA 버튼 클릭
    const ctaButton = page.locator('button:has-text("진짜 나를 이해하는 3분")');
    await ctaButton.click();

    // 카테고리 선택
    const loveCategory = page.locator('button:has-text("연애·결혼")');
    await expect(loveCategory).toBeVisible();
    await loveCategory.click();

    // 라우팅 확인
    await page.waitForURL(/\/category\/love/);
    expect(page.url()).toContain('/category/love');
  });

  test('모바일에서 콘텐츠 카드 클릭', async ({ page }) => {
    await page.goto('/');

    // 첫 번째 content card 찾기
    const firstCard = page.locator('a[href*="/content/"]').first();
    const cardHref = await firstCard.getAttribute('href');
    expect(cardHref).toMatch(/\/content\/.+/);

    await firstCard.click();

    // 라우팅 확인
    await page.waitForURL(/\/content\/.+/);
    expect(page.url()).toMatch(/\/content\/.+/);
  });

  test('모바일 content intro에서 "시작하기" 클릭', async ({ page }) => {
    await page.goto('/content/love-1');

    // "시작하기" 버튼 찾기 및 클릭
    const startButton = page.locator('button:has-text("시작하기")');
    await expect(startButton).toBeVisible();

    await startButton.click();

    // 라우팅 확인
    await page.waitForURL(/\/analyze\/.+/, { timeout: 5000 });
    expect(page.url()).toMatch(/\/analyze\/.+/);
  });

  test('모바일 viewport에서 레이아웃 깨짐 확인 안 함', async ({ page }) => {
    await page.goto('/');

    // 주요 컴포넌트들이 보이는지 확인
    const ctaButton = page.locator('button:has-text("진짜 나를 이해하는 3분")');
    await expect(ctaButton).toBeVisible();

    // CTA 버튼 아래 패딩 확인 (모바일에서 bottom sheet 때문에 pb-28 필요)
    const mainContainer = page.locator('div[class*="pb-28"]');
    await expect(mainContainer).toBeVisible();
  });
});
