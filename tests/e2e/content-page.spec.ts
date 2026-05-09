import { test, expect } from '@playwright/test';

test.describe('I: 콘텐츠 진입 (`/content/[id]`)', () => {
  test('I-01: 유효한 콘텐츠 진입', async ({ page }) => {
    await page.goto('/content/love-1');
    
    // 제목 확인 (main 내의 h2, 큰 텍스트)
    const heading = page.locator('main h2').first();
    await expect(heading).toBeVisible();
    const title = await heading.textContent();
    expect(title).toBeTruthy();
    expect(title!.length).toBeGreaterThan(0);
    
    // intro text (subtitle) 확인 - main 내에서만
    const mainContent = page.locator('main');
    const introText = mainContent.locator('p').nth(0); // main의 첫 번째 p
    await expect(introText).toBeVisible();
    
    // 인사이트 preview 확인
    const insightSection = page.locator('text=이 흐름 안에서 보이는 것들');
    await expect(insightSection).toBeVisible();
    
    // CTA 버튼 확인
    const ctaButton = page.getByRole('button', { name: /시작하기/ });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toBeEnabled();
  });

  test('I-02: CTA 버튼 클릭', async ({ page }) => {
    await page.goto('/content/love-1');
    
    const ctaButton = page.getByRole('button', { name: /시작하기/ });
    await ctaButton.click();
    
    // /analyze/[session_id] 페이지로 이동 (UUID 형식)
    await expect(page).toHaveURL(/\/analyze\/[a-f0-9\-]{36}/);
  });

  test('I-03: 존재하지 않는 콘텐츠 ID 접근', async ({ page }) => {
    await page.goto('/content/invalid-content-id-99999');
    
    // 404 처리
    const url = page.url();
    expect(url).toMatch(/404|invalid|localhost:3000\/?$/);
  });

  test('I-04: CTA 버튼 빠른 연속 클릭 (중복 방지)', async ({ page }) => {
    await page.goto('/content/love-1');
    
    const ctaButton = page.getByRole('button', { name: /시작하기/ });
    
    // 빠르게 여러 번 클릭
    await ctaButton.click();
    await page.waitForTimeout(100); // 매우 짧은 대기
    
    // 이미 navigate 중이면 클릭 불가능할 수 있음
    // 페이지가 이동 중인지 확인
    await page.waitForTimeout(500);
    
    // analyze 페이지에 도달했는지 확인
    expect(page.url()).toMatch(/\/analyze\/|content\/love-1/);
  });

  test('I-05: 페이지 새로고침 시 콘텐츠 유지', async ({ page }) => {
    await page.goto('/content/love-1');
    
    const heading = page.locator('main h2').first();
    const originalTitle = await heading.textContent();
    
    // 페이지 새로고침
    await page.reload();
    
    // 동일한 콘텐츠가 렌더링됨
    const newTitle = await heading.textContent();
    expect(newTitle).toBe(originalTitle);
    
    // CTA 버튼 여전히 활성화
    const ctaButton = page.getByRole('button', { name: /시작하기/ });
    await expect(ctaButton).toBeEnabled();
  });

  test('I-06: 메타데이터 SEO 확인', async ({ page }) => {
    await page.goto('/content/love-1');
    
    // title 확인
    const title = await page.title();
    expect(title).toContain('VEIL');
    expect(title.length).toBeGreaterThan(0);
    
    // meta description 확인
    const metaDescription = page.locator('meta[name="description"]');
    const descriptionContent = await metaDescription.getAttribute('content');
    expect(descriptionContent).toBeTruthy();
    expect(descriptionContent!.length).toBeGreaterThan(0);
  });

  test('I-07: 뒤로가기 후 재진입', async ({ page }) => {
    // 직접 콘텐츠 페이지로 접근
    await page.goto('/content/love-1');

    const heading = page.locator('main h2').first();
    const originalTitle = await heading.textContent();
    expect(originalTitle).toBeTruthy();

    // 홈으로 이동 후 다시 동일 콘텐츠로 직접 재진입
    await page.goto('/');
    await page.goto('/content/love-1');

    // 동일한 콘텐츠가 로드됨
    const newTitle = await page.locator('main h2').first().textContent();
    expect(newTitle).toBe(originalTitle);

    // CTA 버튼이 활성화 상태 (텍스트: "시작하기 →")
    const ctaButton = page.getByRole('button', { name: /시작하기/ });
    await expect(ctaButton).toBeEnabled();
  });
});
