import { Page, expect } from '@playwright/test';

/**
 * 로그인 상태로 설정 (localStorage에 veil_user_id 설정)
 */
export async function setLoggedInState(page: Page) {
  await page.evaluate(() => {
    localStorage.setItem('veil_user_id', 'test-user-123');
  });
}

/**
 * 비로그인 상태로 설정 (localStorage 초기화)
 */
export async function setLoggedOutState(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('veil_user_id');
  });
}

/**
 * 모달이 보이는지 확인
 */
export async function expectModalVisible(page: Page, testId: string) {
  await expect(page.locator(`[data-testid="${testId}"]`)).toBeVisible();
}

/**
 * 모달이 숨겨져 있는지 확인
 */
export async function expectModalHidden(page: Page, testId: string) {
  await expect(page.locator(`[data-testid="${testId}"]`)).not.toBeVisible();
}

/**
 * 버튼이 활성화되어 있는지 확인
 */
export async function expectButtonEnabled(page: Page, text: string) {
  const button = page.getByRole('button', { name: text });
  await expect(button).toBeEnabled();
}

/**
 * 버튼이 비활성화되어 있는지 확인
 */
export async function expectButtonDisabled(page: Page, text: string) {
  const button = page.getByRole('button', { name: text });
  await expect(button).toBeDisabled();
}

/**
 * 링크의 href 확인
 */
export async function expectLinkHref(page: Page, text: string, href: string) {
  const link = page.getByRole('link', { name: text });
  await expect(link).toHaveAttribute('href', href);
}

/**
 * 요소가 화면에 보이는지 확인
 */
export async function expectElementVisible(page: Page, role: string, name: string) {
  await expect(page.getByRole(role as any, { name })).toBeVisible();
}

/**
 * 페이지가 특정 URL로 이동했는지 확인
 */
export async function expectUrlContains(page: Page, path: string) {
  await expect(page).toHaveURL(new RegExp(path));
}
