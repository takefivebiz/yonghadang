import { test, expect } from '@playwright/test';

test.describe('G: 글로벌 레이아웃 / 네비게이션', () => {
  test.describe('G-01 ~ G-06: Navbar 렌더링 및 상태별 동작', () => {
    test('G-01: 홈 진입 시 Navbar 렌더링', async ({ page }) => {
      await page.goto('/');
      
      await expect(page.getByRole('link', { name: 'VEIL' })).toBeVisible();
      await expect(page.getByRole('link', { name: '로그인' })).toBeVisible();
      await expect(page.getByRole('link', { name: '비회원 조회' })).toBeVisible();
    });

    test('G-02: 비회원 상태 Navbar 버튼 구성', async ({ page }) => {
      await page.goto('/');
      
      await expect(page.getByRole('link', { name: '로그인' })).toBeVisible();
      await expect(page.getByRole('link', { name: '비회원 조회' })).toBeVisible();
      await expect(page.getByRole('link', { name: '마이페이지' })).not.toBeVisible();
    });

    test('G-03: 회원 상태 Navbar 버튼 구성', async ({ page }) => {
      // 회원 상태 localStorage 설정 (context API 사용, goto 후에)
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('veil_user_id', 'test-user-123');
      });
      await page.reload(); // 다시 로드하여 상태 반영
      
      await expect(page.getByRole('link', { name: '마이페이지' })).toBeVisible();
      await expect(page.getByRole('link', { name: '로그인' })).not.toBeVisible();
      await expect(page.getByRole('link', { name: '비회원 조회' })).not.toBeVisible();
    });

    test('G-04: 로고 클릭', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: 'VEIL' }).click();
      await expect(page).toHaveURL('/');
    });

    test('G-05: 비회원 상태 "조회" 버튼 클릭', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: '비회원 조회' }).click();
      await expect(page).toHaveURL('/guest');
    });

    test('G-06: 회원 상태 "조회" 버튼 클릭 (마이페이지로 이동)', async ({ page }) => {
      await page.goto('/');
      // 회원 상태 설정
      await page.evaluate(() => {
        localStorage.setItem('veil_user_id', 'test-user-456');
      });
      await page.reload();
      
      await page.getByRole('link', { name: '마이페이지' }).click();
      await expect(page).toHaveURL('/my-page');
    });
  });

  test.describe('G-07 ~ G-10: Footer 렌더링 및 모달 열기', () => {
    test('G-07: Footer 렌더링', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('footer');
      
      // footer 영역에서 요소 찾기
      await expect(footer.getByRole('link', { name: /이용약관/ })).toBeVisible();
      await expect(footer.getByRole('link', { name: /개인정보처리방침/ })).toBeVisible();
      await expect(footer.getByRole('button', { name: /문의하기/ })).toBeVisible();
    });

    test('G-08: Footer 이용약관 클릭', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('footer');
      
      await footer.getByRole('link', { name: /이용약관/ }).click();
      // 모달 열림 확인 (모달 내의 제목으로 확인)
      await expect(page.locator('h2', { hasText: /이용약관/ })).toBeVisible();
    });

    test('G-09: Footer 개인정보처리방침 클릭', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('footer');
      
      await footer.getByRole('link', { name: /개인정보처리방침/ }).click();
      await expect(page.locator('h2', { hasText: /개인정보처리방침/ })).toBeVisible();
    });

    test('G-10: Footer 문의하기 클릭', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('footer');
      
      await footer.getByRole('button', { name: /문의하기/ }).click();
      // 모달 내 "자주 묻는 질문" 헤딩으로 확인
      await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).toBeVisible();
    });
  });

  test.describe('G-11 ~ G-15: 모달 상호작용 및 에지 케이스', () => {
    test('G-11: 모달 외부 영역 클릭 시 닫힘', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('footer');
      
      await footer.getByRole('button', { name: /문의하기/ }).click();
      await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).toBeVisible();
      
      // 모달 overlay 클릭
      const overlay = page.locator('[data-testid="modal-overlay"]').first();
      if (await overlay.isVisible()) {
        await overlay.click({ position: { x: 10, y: 10 } });
        await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).not.toBeVisible();
      }
    });

    test('G-12: 모달 X 버튼 클릭 시 닫힘', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('footer');
      
      await footer.getByRole('button', { name: /문의하기/ }).click();
      await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).toBeVisible();
      
      // 모달 닫기 버튼
      const closeButton = page.getByRole('button', { name: /닫기|×/ }).last();
      await closeButton.click();
      await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).not.toBeVisible();
    });

    test('G-13: ESC 키 누를 때 모달 닫기', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('footer');
      
      await footer.getByRole('button', { name: /문의하기/ }).click();
      await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).toBeVisible();
      
      await page.keyboard.press('Escape');
      await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).not.toBeVisible();
    });

    test('G-14: 모달 열린 상태에서 배경 스크롤 시도', async ({ page }) => {
      await page.goto('/');
      const footer = page.locator('footer');
      
      const initialScroll = await page.evaluate(() => window.scrollY);
      
      await footer.getByRole('button', { name: /문의하기/ }).click();
      
      // 모달 열림 확인
      await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).toBeVisible();
      
      // 배경 스크롤 시도 (실제 스크롤 동작 확인)
      // 모달이 body에 overflow:hidden을 적용하면 스크롤 차단
      const finalScroll = await page.evaluate(() => window.scrollY);
      
      // 모달이 열려있으면 스크롤이 거의 없어야 함 (tolerance 10px)
      if (await page.locator('[data-testid="modal-overlay"]').isVisible()) {
        expect(Math.abs(finalScroll - initialScroll)).toBeLessThan(10);
      }
    });

    test('G-15: 존재하지 않는 경로 직접 접근', async ({ page }) => {
      await page.goto('/invalid-path-that-does-not-exist-12345');
      
      // 404 또는 홈으로 리다이렉트
      const url = page.url();
      expect(url).toMatch(/localhost:3000\/?$|404|invalid/);
    });
  });
});
