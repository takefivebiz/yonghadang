# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: category.spec.ts >> C: 카테고리 전체보기 (`/category/[category]`) >> C-01 ~ C-04: 유효한 카테고리 접근 >> C-04: 유효한 카테고리('emotion') 접근
- Location: tests/e2e/category.spec.ts:13:7

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:3000/category/emotion", waiting until "load"

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
  3   | test.describe('C: 카테고리 전체보기 (`/category/[category]`)', () => {
  4   |   test.describe('C-01 ~ C-04: 유효한 카테고리 접근', () => {
  5   |     const categories = [
  6   |       { path: 'love', label: '연애' },
  7   |       { path: 'relationship', label: '인간관계' },
  8   |       { path: 'career', label: '직업·진로' },
  9   |       { path: 'emotion', label: '감정' },
  10  |     ];
  11  | 
  12  |     categories.forEach(({ path, label }, index) => {
  13  |       test(`C-0${index + 1}: 유효한 카테고리('${path}') 접근`, async ({ page }) => {
> 14  |         await page.goto(`/category/${path}`);
      |                    ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  15  |         
  16  |         // h1 (카테고리 페이지 타이틀)로만 확인하여 strict mode 위반 회피
  17  |         await expect(page.locator('h1', { hasText: new RegExp(label) })).toBeVisible();
  18  |         
  19  |         // 콘텐츠 그리드 확인
  20  |         const grid = page.locator('[data-testid="category-grid"]');
  21  |         if (await grid.isVisible()) {
  22  |           const links = grid.locator('a');
  23  |           const count = await links.count();
  24  |           expect(count).toBeGreaterThanOrEqual(0);
  25  |         }
  26  |       });
  27  |     });
  28  |   });
  29  | 
  30  |   test('C-05: 콘텐츠 카드 클릭', async ({ page }) => {
  31  |     await page.goto('/category/love');
  32  |     
  33  |     const grid = page.locator('[data-testid="category-grid"]');
  34  |     if (await grid.isVisible()) {
  35  |       const firstLink = grid.locator('a').first();
  36  |       if (await firstLink.isVisible()) {
  37  |         await firstLink.click();
  38  |         // content ID 형식: love-1, relationship-2 등
  39  |         await expect(page).toHaveURL(/\/content\//);
  40  |       }
  41  |     }
  42  |   });
  43  | 
  44  |   test('C-06: 비활성 콘텐츠 미노출 확인', async ({ page }) => {
  45  |     await page.goto('/category/love');
  46  |     
  47  |     const grid = page.locator('[data-testid="category-grid"]');
  48  |     if (await grid.isVisible()) {
  49  |       const items = grid.locator('li');
  50  |       const count = await items.count();
  51  |       
  52  |       // class 속성이 null일 수 있으니 null-safe 처리
  53  |       for (let i = 0; i < count; i++) {
  54  |         const item = items.nth(i);
  55  |         const className = await item.getAttribute('class');
  56  |         
  57  |         // null 체크
  58  |         if (className !== null) {
  59  |           expect(className).not.toContain('opacity-50');
  60  |           expect(className).not.toContain('disabled');
  61  |         }
  62  |         
  63  |         // 또는 더 확실하게: 모든 아이템이 비활성화되지 않은 상태로 표시되는지 확인
  64  |         const isVisible = await item.isVisible();
  65  |         expect(isVisible).toBe(true);
  66  |       }
  67  |     }
  68  |   });
  69  | 
  70  |   test('C-07: 잘못된 카테고리 직접 접근', async ({ page }) => {
  71  |     await page.goto('/category/invalid-category-xyz-9999');
  72  |     
  73  |     // 404 또는 리다이렉트
  74  |     const url = page.url();
  75  |     expect(url).toMatch(/404|invalid|localhost:3000\/?$/);
  76  |   });
  77  | 
  78  |   test('C-08: 카테고리 내 콘텐츠 0개 처리', async ({ page }) => {
  79  |     await page.goto('/category/love');
  80  |     
  81  |     const grid = page.locator('[data-testid="category-grid"]');
  82  |     const links = grid.locator('a');
  83  |     const count = await links.count();
  84  |     
  85  |     if (count === 0) {
  86  |       // 콘텐츠가 없으면 안내 문구나 grid가 숨겨져야 함
  87  |       const gridVisible = await grid.isVisible();
  88  |       // grid가 표시되지 않거나, 내부에 안내 메시지가 있어야 함
  89  |       if (gridVisible) {
  90  |         const emptyMessage = page.locator('text=/없습니다|준비|아직/');
  91  |         await expect(emptyMessage).toBeVisible({ timeout: 1000 });
  92  |       }
  93  |     }
  94  |   });
  95  | 
  96  |   test('C-09: 데스크톱 2열 레이아웃 확인', async ({ page }) => {
  97  |     await page.setViewportSize({ width: 1440, height: 900 });
  98  |     await page.goto('/category/love');
  99  |     
  100 |     const grid = page.locator('[data-testid="category-grid"]');
  101 |     if (await grid.isVisible()) {
  102 |       const gridTemplateColumns = await grid.evaluate(el => 
  103 |         window.getComputedStyle(el).gridTemplateColumns
  104 |       );
  105 |       
  106 |       // 2열: "1fr 1fr" 또는 "minmax(...) minmax(...)" 등
  107 |       const columns = gridTemplateColumns.split(' ').filter(s => s.trim().length > 0);
  108 |       expect(columns.length).toBeGreaterThanOrEqual(2);
  109 |     }
  110 |   });
  111 | 
  112 |   test('C-10: 모바일 1열 레이아웃 확인', async ({ page }) => {
  113 |     await page.setViewportSize({ width: 375, height: 667 });
  114 |     await page.goto('/category/love');
```