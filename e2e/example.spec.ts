import { test, expect } from '@playwright/test';

/**
 * Playwright 설치 확인 용 간단한 예제 테스트
 */

test.describe('Playwright 셋업 확인', () => {
  test('localhost:3000 접근 가능', async ({ page }) => {
    // Note: 개발 서버가 실행 중이어야 함 (npm run dev)
    await page.goto('/');
    await expect(page).toHaveTitle(/Corelog|corelog/i);
  });

  test('리포트 페이지 접근', async ({ page }) => {
    // 비회원 무료 리포트 (인증 불필요)
    await page.goto('/report/sess_demo_guest_emotion');
    await page.waitForLoadState('networkidle');

    // 무료 리포트 섹션이 로드됨
    const freeReport = page.locator('text=FREE INSIGHT');
    await expect(freeReport).toBeVisible({ timeout: 5000 });
  });

  test('Playwright 브라우저 정보', async ({ page, browserName }) => {
    await page.goto('/');

    // 현재 브라우저 정보 출력
    const userAgent = await page.evaluate(() => navigator.userAgent);
    console.log(`✓ ${browserName} - ${userAgent}`);

    expect(browserName).toMatch(/chromium|firefox|webkit/);
  });
});
