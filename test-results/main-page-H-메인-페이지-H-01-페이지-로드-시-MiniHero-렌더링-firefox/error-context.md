# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: main-page.spec.ts >> H: 메인 페이지 (`/`) >> H-01: 페이지 로드 시 MiniHero 렌더링
- Location: tests/e2e/main-page.spec.ts:4:3

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
  3   | test.describe('H: 메인 페이지 (`/`)', () => {
  4   |   test('H-01: 페이지 로드 시 MiniHero 렌더링', async ({ page }) => {
> 5   |     await page.goto('/');
      |                ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  6   | 
  7   |     // MiniHero h1 텍스트 확인 (현재 카피: "설명되지 않던 감정이 보이기 시작할 거야")
  8   |     const minihero = page.locator('section').first();
  9   |     await expect(minihero.locator('h1')).toBeVisible();
  10  |   });
  11  | 
  12  |   test('H-02: TrendingSection 가로 스크롤', async ({ page }) => {
  13  |     await page.goto('/');
  14  |     
  15  |     const container = page.locator('[data-testid="trending-scroll-container"]');
  16  |     if (await container.isVisible()) {
  17  |       const initialScrollLeft = await container.evaluate(el => el.scrollLeft);
  18  |       await container.evaluate(el => el.scrollLeft += 300);
  19  |       const finalScrollLeft = await container.evaluate(el => el.scrollLeft);
  20  |       expect(finalScrollLeft).toBeGreaterThan(initialScrollLeft);
  21  |     }
  22  |   });
  23  | 
  24  |   test('H-03: TrendingSection 카드 클릭 후 콘텐츠 페이지로 이동', async ({ page }) => {
  25  |     await page.goto('/');
  26  |     
  27  |     const container = page.locator('[data-testid="trending-scroll-container"]');
  28  |     if (await container.isVisible()) {
  29  |       const firstLink = container.locator('a').first();
  30  |       if (await firstLink.isVisible()) {
  31  |         await firstLink.click();
  32  |         // /content/ 패턴으로 확인 (content-id 형식은 다양할 수 있음)
  33  |         await expect(page).toHaveURL(/\/content\//);
  34  |       }
  35  |     }
  36  |   });
  37  | 
  38  |   test('H-04: CategoryTabs 렌더링', async ({ page }) => {
  39  |     await page.goto('/');
  40  | 
  41  |     // CategoryTabs는 <a href> 링크 구조
  42  |     await expect(page.getByRole('link', { name: /연애/ }).first()).toBeVisible();
  43  |     await expect(page.getByRole('link', { name: /인간관계/ }).first()).toBeVisible();
  44  |     await expect(page.getByRole('link', { name: /직업·진로/ })).toBeVisible();
  45  |     await expect(page.getByRole('link', { name: /감정/ }).first()).toBeVisible();
  46  |   });
  47  | 
  48  |   test('H-05: CategoryTabs 클릭 시 해당 섹션 스크롤', async ({ page }) => {
  49  |     await page.goto('/');
  50  | 
  51  |     const initialScroll = await page.evaluate(() => window.scrollY);
  52  | 
  53  |     // CategoryTabs는 <a href="#relationship"> 앵커 링크
  54  |     await page.getByRole('link', { name: /인간관계/ }).first().click();
  55  |     await page.waitForTimeout(600); // 스크롤 애니메이션 대기
  56  | 
  57  |     const finalScroll = await page.evaluate(() => window.scrollY);
  58  |     expect(finalScroll).not.toBe(initialScroll);
  59  |   });
  60  | 
  61  |   test('H-06: ContentSection 카드 클릭', async ({ page }) => {
  62  |     await page.goto('/');
  63  | 
  64  |     const section = page.locator('[data-testid="content-section"]').first();
  65  |     if (await section.isVisible()) {
  66  |       // 첫 번째 a는 "전체보기" 링크이므로, /content/ 패턴의 링크를 직접 찾기
  67  |       const cardLink = section.locator('a[href*="/content/"]').first();
  68  |       if (await cardLink.isVisible()) {
  69  |         await cardLink.click();
  70  |         await expect(page).toHaveURL(/\/content\//);
  71  |       }
  72  |     }
  73  |   });
  74  | 
  75  |   test('H-07: ContentSection "전체보기" 클릭', async ({ page }) => {
  76  |     await page.goto('/');
  77  |     
  78  |     const section = page.locator('[data-testid="content-section"]').first();
  79  |     if (await section.isVisible()) {
  80  |       const viewAllLink = section.getByRole('link', { name: /전체보기/ });
  81  |       if (await viewAllLink.isVisible()) {
  82  |         await viewAllLink.click();
  83  |         await expect(page).toHaveURL(/\/category\/(love|relationship|career|emotion)/);
  84  |       }
  85  |     }
  86  |   });
  87  | 
  88  |   test('H-08: CategoryTabs sticky 동작 (스크롤 시 상단 고정)', async ({ page }) => {
  89  |     await page.goto('/');
  90  | 
  91  |     const sticky = page.locator('[data-testid="category-tabs-sticky"]');
  92  |     if (await sticky.isVisible()) {
  93  |       // CSS position: sticky 가 적용됐는지 직접 확인
  94  |       const position = await sticky.evaluate((el) =>
  95  |         window.getComputedStyle(el).position
  96  |       );
  97  |       expect(position).toBe('sticky');
  98  |     }
  99  |   });
  100 | 
  101 |   test('H-09: CategoryTabs 빠른 연속 클릭', async ({ page }) => {
  102 |     await page.goto('/');
  103 | 
  104 |     const tabs = [
  105 |       page.getByRole('link', { name: /연애/ }).first(),
```