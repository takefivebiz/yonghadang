import { test as base } from '@playwright/test';

/**
 * Corelog E2E 테스트 공용 Fixtures
 */

interface CorelogFixtures {
  /**
   * localStorage 초기화 (새 방문 시뮬레이션)
   */
  cleanStorage: () => Promise<void>;

  /**
   * 회원 로그인 상태 설정
   */
  loginAsMember: (userId: string) => Promise<void>;

  /**
   * 비회원 게스트 토큰 발급 (30분)
   */
  grantGuestToken: (sessionId: string) => Promise<void>;
}

export const test = base.extend<CorelogFixtures>({
  cleanStorage: async ({ page }, use) => {
    await use(async () => {
      // localStorage 접근 전 페이지 네비게이션 필요
      if (page.url() === 'about:blank') {
        await page.goto('/');
      }
      await page.context().clearCookies();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });
  },

  loginAsMember: async ({ page }, use) => {
    await use(async (userId: string) => {
      // localStorage 접근 전 페이지 네비게이션 필요
      if (page.url() === 'about:blank') {
        await page.goto('/');
      }
      const profile = {
        memberId: userId,
        name: '테스트 사용자',
        email: 'test@corelog.com',
      };
      await page.evaluate((profile) => {
        localStorage.setItem('corelog:member_session', JSON.stringify(profile));
        document.cookie = 'user_session=1; path=/; SameSite=Strict';
      }, profile);
    });
  },

  grantGuestToken: async ({ page }, use) => {
    await use(async (sessionId: string) => {
      // sessionStorage 접근 전 페이지 네비게이션 필요
      if (page.url() === 'about:blank') {
        await page.goto('/');
      }
      const token = {
        orderId: sessionId,
        grantedAt: Date.now(),
      };
      await page.evaluate(({ sessionId, token }) => {
        sessionStorage.setItem(`corelog:report_access:${sessionId}`, JSON.stringify(token));
      }, { sessionId, token });
    });
  },
});

export { expect } from '@playwright/test';
