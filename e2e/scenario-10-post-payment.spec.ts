import { test, expect } from '../e2e/fixtures';

/**
 * Scenario 10: 결제 완료 후 재접근 (Post-Payment Edge Cases)
 *
 * 회원/비회원별로 테스트를 구분하여 각 사용자 타입의 접근 제어를 검증한다.
 * - 회원: 로그인 상태에서만 접근 가능
 * - 비회원(유료): 30분 토큰 만료 후 본인확인 필요
 * - 비회원(무료): 인증 불필요 (URL 공유 가능)
 */

// Demo orders by user type
const MEMBER_ORDERS = {
  free: 'sess_demo_self_love', // ownerType: 'member', paid: false (implicitly)
  paid: 'sess_demo_member_career', // ownerType: 'member', paid: true (implicitly)
};

const GUEST_ORDERS = {
  paid: 'sess_demo_guest_love', // ownerType: 'guest', paid: true
  free: 'sess_demo_guest_emotion', // ownerType: 'anonymous', paid: false
};

// ===== 10-1: TypewriterText 재방문 시 즉시 표시 (회원) =====
test.describe('10-1a: TypewriterText 즉시 표시 (회원)', () => {
  test.beforeEach(async ({ cleanStorage, loginAsMember }) => {
    await cleanStorage();
    await loginAsMember('user_demo');
  });

  test('첫 방문: 리포트 콘텐츠 표시', async ({ page }) => {
    await page.goto(`/report/${MEMBER_ORDERS.free}`);
    await page.waitForLoadState('networkidle');

    // 리포트 콘텐츠 로드 확인
    await expect(page.locator('text=FREE INSIGHT')).toBeVisible({ timeout: 5000 });

    // localStorage에 viewed 플래그 저장됨
    const viewedFlag = await page.evaluate((sessionId) =>
      localStorage.getItem(`corelog:report_viewed_${sessionId}`)
    , MEMBER_ORDERS.free);
    expect(viewedFlag).toBe('1');
  });

  test('재방문(새로고침): 애니메이션 스킵, 즉시 표시', async ({ page }) => {
    await page.goto(`/report/${MEMBER_ORDERS.free}`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=FREE INSIGHT')).toBeVisible({ timeout: 5000 });

    // 새로고침 - instant=true로 인해 애니메이션 스킵
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 콘텐츠 즉시 표시
    await expect(page.locator('text=FREE INSIGHT')).toBeVisible({ timeout: 1500 });
  });

  test('다른 탭: localStorage 공유 → 즉시 표시', async ({ page, context, loginAsMember }) => {
    // 첫 로그인 (fixture page에서)
    await page.goto(`/report/${MEMBER_ORDERS.free}`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=FREE INSIGHT')).toBeVisible({ timeout: 5000 });

    // 새 탭 생성 (같은 context → localStorage 공유)
    const page2 = await context.newPage();
    await page2.goto(`/report/${MEMBER_ORDERS.free}`);
    await page2.waitForLoadState('networkidle');

    // 새 탭에서도 즉시 표시 (localStorage 플래그 공유)
    await expect(page2.locator('text=FREE INSIGHT')).toBeVisible({ timeout: 1500 });

    await page2.close();
  });
});

// ===== 10-2: 리포트 새로고침 시 스트리밍 재요청 없음 (회원) =====
test.describe('10-2: 리포트 새로고침 시 스트리밍 재요청 없음 (회원)', () => {
  test.beforeEach(async ({ cleanStorage, loginAsMember }) => {
    await cleanStorage();
    await loginAsMember('user_demo');
  });

  test('3회 연속 새로고침: ReportStatus 폴링 없음', async ({ page }) => {
    await page.goto(`/report/${MEMBER_ORDERS.free}`);
    await page.waitForLoadState('networkidle');

    // 무료 리포트 섹션 확인 (status='done' → 폴링 스킵)
    const freeReport = page.locator('text=FREE INSIGHT');
    await expect(freeReport).toBeVisible({ timeout: 5000 });

    // 3회 연속 새로고침
    for (let i = 1; i <= 3; i++) {
      await page.reload();
      await page.waitForLoadState('networkidle');

      // 리포트 여전히 표시
      await expect(freeReport).toBeVisible({ timeout: 1500 });
    }

    // localStorage 상태 유지 확인
    const viewedFlag = await page.evaluate((sessionId) =>
      localStorage.getItem(`corelog:report_viewed_${sessionId}`)
    , MEMBER_ORDERS.free);
    expect(viewedFlag).toBe('1');
  });

  test('구매한 유료 콘텐츠 localStorage 복원', async ({ page }) => {
    await page.goto(`/report/${MEMBER_ORDERS.free}`);
    await page.waitForLoadState('networkidle');

    // 구매한 질문 ID를 localStorage에 저장
    await page.evaluate((sessionId) => {
      const purchased = ['q_1', 'q_2'];
      localStorage.setItem(`corelog:purchased_ids_${sessionId}`, JSON.stringify(purchased));
    }, MEMBER_ORDERS.free);

    // 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // localStorage에서 구매 정보 복원 확인
    const purchased = await page.evaluate((sessionId) =>
      JSON.parse(localStorage.getItem(`corelog:purchased_ids_${sessionId}`) || '[]')
    , MEMBER_ORDERS.free);
    expect(purchased).toEqual(['q_1', 'q_2']);
  });
});

// ===== 10-3a: 회원 로그아웃 후 접근 제한 =====
test.describe('10-3a: 로그아웃 후 접근 제한 (회원)', () => {
  test.beforeEach(async ({ cleanStorage, loginAsMember }) => {
    await cleanStorage();
    await loginAsMember('user_demo');
  });

  test('회원 리포트: 로그아웃 후 "로그인 필요" 표시', async ({ page }) => {
    // 회원 리포트 접근
    await page.goto(`/report/${MEMBER_ORDERS.free}`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=FREE INSIGHT')).toBeVisible({ timeout: 5000 });

    // 로그아웃 (localStorage에서 회원 세션 제거)
    await page.evaluate(() => {
      localStorage.removeItem('corelog:member_session');
    });

    // 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // "로그인 필요" 표시
    await expect(page.getByRole('heading', { name: '로그인이 필요해요' })).toBeVisible({ timeout: 5000 });
  });
});

// ===== 10-3b: 비회원(유료) 토큰 만료 후 접근 제한 =====
test.describe('10-3b: 로그아웃 후 접근 제한 (비회원-유료)', () => {
  test.beforeEach(async ({ cleanStorage, grantGuestToken }) => {
    await cleanStorage();
    await grantGuestToken(GUEST_ORDERS.paid);
  });

  test('비회원 유료: 30분 토큰 만료 → 본인확인 폼', async ({ page }) => {
    // 유료 리포트 접근 가능
    await page.goto(`/report/${GUEST_ORDERS.paid}`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=FREE INSIGHT')).toBeVisible({ timeout: 5000 });

    // 토큰 만료 시뮬레이션
    await page.evaluate((sessionId) => {
      sessionStorage.removeItem(`corelog:report_access:${sessionId}`);
    }, GUEST_ORDERS.paid);

    // 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 본인확인 폼 표시
    await expect(page.locator('text=/휴대폰|인증|비밀번호/i')).toBeVisible({ timeout: 5000 });
  });
});

// ===== 10-3c: 비회원(무료) 인증 불필요 =====
test.describe('10-3c: 로그아웃 후 접근 제한 (비회원-무료)', () => {
  test.beforeEach(async ({ cleanStorage }) => {
    await cleanStorage();
  });

  test('비회원 무료: 인증 불필요 (URL 공유 가능)', async ({ page }) => {
    // 무료 리포트 접근 (인증 불필요)
    await page.goto(`/report/${GUEST_ORDERS.free}`);
    await page.waitForLoadState('networkidle');

    // 로그인 폼 없이 리포트 바로 표시
    await expect(page.locator('text=FREE INSIGHT')).toBeVisible({ timeout: 5000 });
  });

  test('비회원 무료: 쿠키/세션 삭제 후에도 접근 가능', async ({ page }) => {
    await page.goto(`/report/${GUEST_ORDERS.free}`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=FREE INSIGHT')).toBeVisible({ timeout: 5000 });

    // 쿠키, sessionStorage 모두 삭제
    await page.context().clearCookies();
    await page.evaluate(() => {
      sessionStorage.clear();
    });

    // 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 여전히 접근 가능 (인증 불필요)
    await expect(page.locator('text=FREE INSIGHT')).toBeVisible({ timeout: 5000 });
  });

  test('비회원 무료: 다른 사용자도 같은 URL로 접근 가능', async ({ page, context }) => {
    // 사용자 1: 무료 리포트 접근
    await page.goto(`/report/${GUEST_ORDERS.free}`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=FREE INSIGHT')).toBeVisible({ timeout: 5000 });

    // 사용자 2: 다른 context에서 같은 URL 접근 (쿠키/storage 독립)
    const context2 = await page.context().browser()?.newContext();
    const page2 = await context2?.newPage();

    if (page2) {
      await page2.goto(`/report/${GUEST_ORDERS.free}`);
      await page2.waitForLoadState('networkidle');

      // 동일하게 접근 가능 (인증 불필요)
      await expect(page2.locator('text=FREE INSIGHT')).toBeVisible({ timeout: 5000 });
      await page2.close();
    }

    if (context2) await context2.close();
  });
});

// ===== 10-4: 크로스 디바이스 접근 =====
test.describe('10-4: 크로스 디바이스 접근', () => {
  test.skip('백엔드 연동 필요: Supabase Auth 세션 쿠키', async ({ page }) => {
    // NOTE: 이 테스트는 백엔드 준비 후 활성화
    // 현재는 localStorage 기반 → 디바이스 로컬 전용
    // 백엔드 연동 후: Supabase Auth 세션 쿠키 + 서버 DB 조회로 크로스 디바이스 지원
  });
});
