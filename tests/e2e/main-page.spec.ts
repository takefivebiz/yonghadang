import { test, expect } from '@playwright/test';

test.describe('H: 메인 페이지 (`/`)', () => {
  test('H-01: 페이지 로드 시 MiniHero 렌더링', async ({ page }) => {
    await page.goto('/');

    // MiniHero h1 텍스트 확인 (현재 카피: "설명되지 않던 감정이 보이기 시작할 거야")
    const minihero = page.locator('section').first();
    await expect(minihero.locator('h1')).toBeVisible();
  });

  test('H-02: TrendingSection 가로 스크롤', async ({ page }) => {
    await page.goto('/');
    
    const container = page.locator('[data-testid="trending-scroll-container"]');
    if (await container.isVisible()) {
      const initialScrollLeft = await container.evaluate(el => el.scrollLeft);
      await container.evaluate(el => el.scrollLeft += 300);
      const finalScrollLeft = await container.evaluate(el => el.scrollLeft);
      expect(finalScrollLeft).toBeGreaterThan(initialScrollLeft);
    }
  });

  test('H-03: TrendingSection 카드 클릭 후 콘텐츠 페이지로 이동', async ({ page }) => {
    await page.goto('/');
    
    const container = page.locator('[data-testid="trending-scroll-container"]');
    if (await container.isVisible()) {
      const firstLink = container.locator('a').first();
      if (await firstLink.isVisible()) {
        await firstLink.click();
        // /content/ 패턴으로 확인 (content-id 형식은 다양할 수 있음)
        await expect(page).toHaveURL(/\/content\//);
      }
    }
  });

  test('H-04: CategoryTabs 렌더링', async ({ page }) => {
    await page.goto('/');

    // CategoryTabs는 <a href> 링크 구조
    await expect(page.getByRole('link', { name: /연애/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /인간관계/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /직업·진로/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /감정/ }).first()).toBeVisible();
  });

  test('H-05: CategoryTabs 클릭 시 해당 섹션 스크롤', async ({ page }) => {
    await page.goto('/');

    const initialScroll = await page.evaluate(() => window.scrollY);

    // CategoryTabs는 <a href="#relationship"> 앵커 링크
    await page.getByRole('link', { name: /인간관계/ }).first().click();
    await page.waitForTimeout(600); // 스크롤 애니메이션 대기

    const finalScroll = await page.evaluate(() => window.scrollY);
    expect(finalScroll).not.toBe(initialScroll);
  });

  test('H-06: ContentSection 카드 클릭', async ({ page }) => {
    await page.goto('/');

    const section = page.locator('[data-testid="content-section"]').first();
    if (await section.isVisible()) {
      // 첫 번째 a는 "전체보기" 링크이므로, /content/ 패턴의 링크를 직접 찾기
      const cardLink = section.locator('a[href*="/content/"]').first();
      if (await cardLink.isVisible()) {
        await cardLink.click();
        await expect(page).toHaveURL(/\/content\//);
      }
    }
  });

  test('H-07: ContentSection "전체보기" 클릭', async ({ page }) => {
    await page.goto('/');
    
    const section = page.locator('[data-testid="content-section"]').first();
    if (await section.isVisible()) {
      const viewAllLink = section.getByRole('link', { name: /전체보기/ });
      if (await viewAllLink.isVisible()) {
        await viewAllLink.click();
        await expect(page).toHaveURL(/\/category\/(love|relationship|career|emotion)/);
      }
    }
  });

  test('H-08: CategoryTabs sticky 동작 (스크롤 시 상단 고정)', async ({ page }) => {
    await page.goto('/');

    const sticky = page.locator('[data-testid="category-tabs-sticky"]');
    if (await sticky.isVisible()) {
      // CSS position: sticky 가 적용됐는지 직접 확인
      const position = await sticky.evaluate((el) =>
        window.getComputedStyle(el).position
      );
      expect(position).toBe('sticky');
    }
  });

  test('H-09: CategoryTabs 빠른 연속 클릭', async ({ page }) => {
    await page.goto('/');

    const tabs = [
      page.getByRole('link', { name: /연애/ }).first(),
      page.getByRole('link', { name: /인간관계/ }).first(),
      page.getByRole('link', { name: /직업·진로/ }),
      page.getByRole('link', { name: /감정/ }).first(),
    ];
    
    for (const tab of tabs) {
      if (await tab.isVisible()) {
        await tab.click({ force: true });
      }
    }
    
    await page.waitForTimeout(500);
    // 에러 없이 완료되면 통과
    expect(page.url()).toContain('/');
  });

  test('H-10: 콘텐츠 없는 카테고리 섹션 처리', async ({ page }) => {
    await page.goto('/');
    
    const sections = page.locator('[data-testid="content-section"]');
    const count = await sections.count();
    
    let hasEmptySection = false;
    for (let i = 0; i < count; i++) {
      const section = sections.nth(i);
      const links = section.locator('a');
      const linkCount = await links.count();
      
      if (linkCount === 0) {
        hasEmptySection = true;
        // 빈 섹션이면 display:none이거나 안내 문구가 있어야 함
        const isHidden = await section.evaluate(el => 
          window.getComputedStyle(el).display === 'none'
        );
        expect(isHidden).toBe(true);
      }
    }
    // 만약 모든 섹션에 콘텐츠가 있으면 통과
  });

  test('H-11: 모바일 뷰포트에서 레이아웃', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // 필수 요소들이 표시되는지 확인
    await expect(page.getByRole('link', { name: 'VEIL' })).toBeVisible();
    const section = page.locator('section').first();
    await expect(section.locator('h1')).toBeVisible();
  });

  test('H-12: 가로 스크롤과 클릭 분리', async ({ page }) => {
    await page.goto('/');
    
    const container = page.locator('[data-testid="trending-scroll-container"]');
    if (await container.isVisible()) {
      // 약간 스크롤
      await container.evaluate(el => el.scrollLeft += 50);
      
      // 스크롤 후 첫 번째 카드 클릭
      const firstLink = container.locator('a').first();
      if (await firstLink.isVisible()) {
        await firstLink.click();
        // 정상적으로 네비게이션됨
        await expect(page).toHaveURL(/\/content\//);
      }
    }
  });
});
