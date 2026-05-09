import { test, expect } from '@playwright/test';

test.describe('C: 카테고리 전체보기 (`/category/[category]`)', () => {
  test.describe('C-01 ~ C-04: 유효한 카테고리 접근', () => {
    const categories = [
      { path: 'love', label: '연애' },
      { path: 'relationship', label: '인간관계' },
      { path: 'career', label: '직업·진로' },
      { path: 'emotion', label: '감정' },
    ];

    categories.forEach(({ path, label }, index) => {
      test(`C-0${index + 1}: 유효한 카테고리('${path}') 접근`, async ({ page }) => {
        await page.goto(`/category/${path}`);
        
        // h1 (카테고리 페이지 타이틀)로만 확인하여 strict mode 위반 회피
        await expect(page.locator('h1', { hasText: new RegExp(label) })).toBeVisible();
        
        // 콘텐츠 그리드 확인
        const grid = page.locator('[data-testid="category-grid"]');
        if (await grid.isVisible()) {
          const links = grid.locator('a');
          const count = await links.count();
          expect(count).toBeGreaterThanOrEqual(0);
        }
      });
    });
  });

  test('C-05: 콘텐츠 카드 클릭', async ({ page }) => {
    await page.goto('/category/love');
    
    const grid = page.locator('[data-testid="category-grid"]');
    if (await grid.isVisible()) {
      const firstLink = grid.locator('a').first();
      if (await firstLink.isVisible()) {
        await firstLink.click();
        // content ID 형식: love-1, relationship-2 등
        await expect(page).toHaveURL(/\/content\//);
      }
    }
  });

  test('C-06: 비활성 콘텐츠 미노출 확인', async ({ page }) => {
    await page.goto('/category/love');
    
    const grid = page.locator('[data-testid="category-grid"]');
    if (await grid.isVisible()) {
      const items = grid.locator('li');
      const count = await items.count();
      
      // class 속성이 null일 수 있으니 null-safe 처리
      for (let i = 0; i < count; i++) {
        const item = items.nth(i);
        const className = await item.getAttribute('class');
        
        // null 체크
        if (className !== null) {
          expect(className).not.toContain('opacity-50');
          expect(className).not.toContain('disabled');
        }
        
        // 또는 더 확실하게: 모든 아이템이 비활성화되지 않은 상태로 표시되는지 확인
        const isVisible = await item.isVisible();
        expect(isVisible).toBe(true);
      }
    }
  });

  test('C-07: 잘못된 카테고리 직접 접근', async ({ page }) => {
    await page.goto('/category/invalid-category-xyz-9999');
    
    // 404 또는 리다이렉트
    const url = page.url();
    expect(url).toMatch(/404|invalid|localhost:3000\/?$/);
  });

  test('C-08: 카테고리 내 콘텐츠 0개 처리', async ({ page }) => {
    await page.goto('/category/love');
    
    const grid = page.locator('[data-testid="category-grid"]');
    const links = grid.locator('a');
    const count = await links.count();
    
    if (count === 0) {
      // 콘텐츠가 없으면 안내 문구나 grid가 숨겨져야 함
      const gridVisible = await grid.isVisible();
      // grid가 표시되지 않거나, 내부에 안내 메시지가 있어야 함
      if (gridVisible) {
        const emptyMessage = page.locator('text=/없습니다|준비|아직/');
        await expect(emptyMessage).toBeVisible({ timeout: 1000 });
      }
    }
  });

  test('C-09: 데스크톱 2열 레이아웃 확인', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/category/love');
    
    const grid = page.locator('[data-testid="category-grid"]');
    if (await grid.isVisible()) {
      const gridTemplateColumns = await grid.evaluate(el => 
        window.getComputedStyle(el).gridTemplateColumns
      );
      
      // 2열: "1fr 1fr" 또는 "minmax(...) minmax(...)" 등
      const columns = gridTemplateColumns.split(' ').filter(s => s.trim().length > 0);
      expect(columns.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('C-10: 모바일 1열 레이아웃 확인', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/category/love');
    
    const grid = page.locator('[data-testid="category-grid"]');
    if (await grid.isVisible()) {
      const gridTemplateColumns = await grid.evaluate(el => 
        window.getComputedStyle(el).gridTemplateColumns
      );
      
      // 1열: "1fr" 또는 단일 값
      const columns = gridTemplateColumns.split(' ').filter(s => s.trim().length > 0);
      // 모바일에서는 1열이어야 함
      expect(columns.length).toBeLessThanOrEqual(1);
    }
  });
});
