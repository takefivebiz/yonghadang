# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global-layout.spec.ts >> G: 글로벌 레이아웃 / 네비게이션 >> G-01 ~ G-06: Navbar 렌더링 및 상태별 동작 >> G-01: 홈 진입 시 Navbar 렌더링
- Location: tests/e2e/global-layout.spec.ts:5:5

# Error details

```
Error: page.goto: Could not connect to the server.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('G: 글로벌 레이아웃 / 네비게이션', () => {
  4   |   test.describe('G-01 ~ G-06: Navbar 렌더링 및 상태별 동작', () => {
  5   |     test('G-01: 홈 진입 시 Navbar 렌더링', async ({ page }) => {
> 6   |       await page.goto('/');
      |                  ^ Error: page.goto: Could not connect to the server.
  7   |       
  8   |       await expect(page.getByRole('link', { name: 'VEIL' })).toBeVisible();
  9   |       await expect(page.getByRole('link', { name: '로그인' })).toBeVisible();
  10  |       await expect(page.getByRole('link', { name: '비회원 조회' })).toBeVisible();
  11  |     });
  12  | 
  13  |     test('G-02: 비회원 상태 Navbar 버튼 구성', async ({ page }) => {
  14  |       await page.goto('/');
  15  |       
  16  |       await expect(page.getByRole('link', { name: '로그인' })).toBeVisible();
  17  |       await expect(page.getByRole('link', { name: '비회원 조회' })).toBeVisible();
  18  |       await expect(page.getByRole('link', { name: '마이페이지' })).not.toBeVisible();
  19  |     });
  20  | 
  21  |     test('G-03: 회원 상태 Navbar 버튼 구성', async ({ page }) => {
  22  |       // 회원 상태 localStorage 설정 (context API 사용, goto 후에)
  23  |       await page.goto('/');
  24  |       await page.evaluate(() => {
  25  |         localStorage.setItem('veil_user_id', 'test-user-123');
  26  |       });
  27  |       await page.reload(); // 다시 로드하여 상태 반영
  28  |       
  29  |       await expect(page.getByRole('link', { name: '마이페이지' })).toBeVisible();
  30  |       await expect(page.getByRole('link', { name: '로그인' })).not.toBeVisible();
  31  |       await expect(page.getByRole('link', { name: '비회원 조회' })).not.toBeVisible();
  32  |     });
  33  | 
  34  |     test('G-04: 로고 클릭', async ({ page }) => {
  35  |       await page.goto('/');
  36  |       await page.getByRole('link', { name: 'VEIL' }).click();
  37  |       await expect(page).toHaveURL('/');
  38  |     });
  39  | 
  40  |     test('G-05: 비회원 상태 "조회" 버튼 클릭', async ({ page }) => {
  41  |       await page.goto('/');
  42  |       await page.getByRole('link', { name: '비회원 조회' }).click();
  43  |       await expect(page).toHaveURL('/guest');
  44  |     });
  45  | 
  46  |     test('G-06: 회원 상태 "조회" 버튼 클릭 (마이페이지로 이동)', async ({ page }) => {
  47  |       await page.goto('/');
  48  |       // 회원 상태 설정
  49  |       await page.evaluate(() => {
  50  |         localStorage.setItem('veil_user_id', 'test-user-456');
  51  |       });
  52  |       await page.reload();
  53  |       
  54  |       await page.getByRole('link', { name: '마이페이지' }).click();
  55  |       await expect(page).toHaveURL('/my-page');
  56  |     });
  57  |   });
  58  | 
  59  |   test.describe('G-07 ~ G-10: Footer 렌더링 및 모달 열기', () => {
  60  |     test('G-07: Footer 렌더링', async ({ page }) => {
  61  |       await page.goto('/');
  62  |       const footer = page.locator('footer');
  63  | 
  64  |       // footer 영역에서 요소 찾기 (이용약관·개인정보처리방침은 button)
  65  |       await expect(footer.getByRole('button', { name: /이용약관/ })).toBeVisible();
  66  |       await expect(footer.getByRole('button', { name: /개인정보처리방침/ })).toBeVisible();
  67  |       await expect(footer.getByRole('button', { name: /문의하기/ })).toBeVisible();
  68  |     });
  69  | 
  70  |     test('G-08: Footer 이용약관 클릭', async ({ page }) => {
  71  |       await page.goto('/');
  72  |       const footer = page.locator('footer');
  73  | 
  74  |       await footer.getByRole('button', { name: /이용약관/ }).click();
  75  |       // 모달 열림 확인 (모달 내의 제목으로 확인)
  76  |       await expect(page.locator('h2', { hasText: /이용약관/ })).toBeVisible();
  77  |     });
  78  | 
  79  |     test('G-09: Footer 개인정보처리방침 클릭', async ({ page }) => {
  80  |       await page.goto('/');
  81  |       const footer = page.locator('footer');
  82  | 
  83  |       await footer.getByRole('button', { name: /개인정보처리방침/ }).click();
  84  |       await expect(page.locator('h2', { hasText: /개인정보처리방침/ })).toBeVisible();
  85  |     });
  86  | 
  87  |     test('G-10: Footer 문의하기 클릭', async ({ page }) => {
  88  |       await page.goto('/');
  89  |       const footer = page.locator('footer');
  90  |       
  91  |       await footer.getByRole('button', { name: /문의하기/ }).click();
  92  |       // 모달 내 "자주 묻는 질문" 헤딩으로 확인
  93  |       await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).toBeVisible();
  94  |     });
  95  |   });
  96  | 
  97  |   test.describe('G-11 ~ G-15: 모달 상호작용 및 에지 케이스', () => {
  98  |     test('G-11: 모달 외부 영역 클릭 시 닫힘', async ({ page }) => {
  99  |       await page.goto('/');
  100 |       const footer = page.locator('footer');
  101 |       
  102 |       await footer.getByRole('button', { name: /문의하기/ }).click();
  103 |       await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).toBeVisible();
  104 |       
  105 |       // 모달 overlay 클릭
  106 |       const overlay = page.locator('[data-testid="modal-overlay"]').first();
```