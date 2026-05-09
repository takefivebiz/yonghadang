# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global-layout.spec.ts >> G: 글로벌 레이아웃 / 네비게이션 >> G-01 ~ G-06: Navbar 렌더링 및 상태별 동작 >> G-05: 비회원 상태 "조회" 버튼 클릭
- Location: tests/e2e/global-layout.spec.ts:40:5

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - heading "Unable to connect" [level=1] [ref=e5]
    - paragraph [ref=e6]: Firefox can’t establish a connection to the server at localhost:3000.
    - paragraph
    - list [ref=e8]:
      - listitem [ref=e9]: The site could be temporarily unavailable or too busy. Try again in a few moments.
      - listitem [ref=e10]: If you are unable to load any pages, check your computer’s network connection.
      - listitem [ref=e11]: If your computer or network is protected by a firewall or proxy, make sure that Nightly is permitted to access the web.
      - listitem [ref=e12]: If you are trying to load a local network page, please check that Nightly has been granted Local Network permissions in the macOS Privacy & Security settings.
  - button "Try Again" [active] [ref=e14]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('G: 글로벌 레이아웃 / 네비게이션', () => {
  4   |   test.describe('G-01 ~ G-06: Navbar 렌더링 및 상태별 동작', () => {
  5   |     test('G-01: 홈 진입 시 Navbar 렌더링', async ({ page }) => {
  6   |       await page.goto('/');
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
> 41  |       await page.goto('/');
      |                  ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
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
  107 |       if (await overlay.isVisible()) {
  108 |         await overlay.click({ position: { x: 10, y: 10 } });
  109 |         await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).not.toBeVisible();
  110 |       }
  111 |     });
  112 | 
  113 |     test('G-12: 모달 X 버튼 클릭 시 닫힘', async ({ page }) => {
  114 |       await page.goto('/');
  115 |       const footer = page.locator('footer');
  116 |       
  117 |       await footer.getByRole('button', { name: /문의하기/ }).click();
  118 |       await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).toBeVisible();
  119 |       
  120 |       // 모달 닫기 버튼
  121 |       const closeButton = page.getByRole('button', { name: /닫기|×/ }).last();
  122 |       await closeButton.click();
  123 |       await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).not.toBeVisible();
  124 |     });
  125 | 
  126 |     test('G-13: ESC 키 누를 때 모달 닫기', async ({ page }) => {
  127 |       await page.goto('/');
  128 |       const footer = page.locator('footer');
  129 |       
  130 |       await footer.getByRole('button', { name: /문의하기/ }).click();
  131 |       await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).toBeVisible();
  132 |       
  133 |       await page.keyboard.press('Escape');
  134 |       await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).not.toBeVisible();
  135 |     });
  136 | 
  137 |     test('G-14: 모달 열린 상태에서 배경 스크롤 차단 확인', async ({ page }) => {
  138 |       await page.goto('/');
  139 |       const footer = page.locator('footer');
  140 | 
  141 |       await footer.getByRole('button', { name: /문의하기/ }).click();
```