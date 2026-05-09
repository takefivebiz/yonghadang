# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: content-page.spec.ts >> I: 콘텐츠 진입 (`/content/[id]`) >> I-04: CTA 버튼 빠른 연속 클릭 (중복 방지)
- Location: tests/e2e/content-page.spec.ts:47:3

# Error details

```
Error: page.goto: Could not connect to the server.
Call log:
  - navigating to "http://localhost:3000/content/love-1", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('I: 콘텐츠 진입 (`/content/[id]`)', () => {
  4   |   test('I-01: 유효한 콘텐츠 진입', async ({ page }) => {
  5   |     await page.goto('/content/love-1');
  6   |     
  7   |     // 제목 확인 (main 내의 h2, 큰 텍스트)
  8   |     const heading = page.locator('main h2').first();
  9   |     await expect(heading).toBeVisible();
  10  |     const title = await heading.textContent();
  11  |     expect(title).toBeTruthy();
  12  |     expect(title!.length).toBeGreaterThan(0);
  13  |     
  14  |     // intro text (subtitle) 확인 - main 내에서만
  15  |     const mainContent = page.locator('main');
  16  |     const introText = mainContent.locator('p').nth(0); // main의 첫 번째 p
  17  |     await expect(introText).toBeVisible();
  18  |     
  19  |     // 인사이트 preview 확인
  20  |     const insightSection = page.locator('text=이 흐름 안에서 보이는 것들');
  21  |     await expect(insightSection).toBeVisible();
  22  |     
  23  |     // CTA 버튼 확인
  24  |     const ctaButton = page.getByRole('button', { name: /시작하기/ });
  25  |     await expect(ctaButton).toBeVisible();
  26  |     await expect(ctaButton).toBeEnabled();
  27  |   });
  28  | 
  29  |   test('I-02: CTA 버튼 클릭', async ({ page }) => {
  30  |     await page.goto('/content/love-1');
  31  |     
  32  |     const ctaButton = page.getByRole('button', { name: /시작하기/ });
  33  |     await ctaButton.click();
  34  |     
  35  |     // /analyze/[session_id] 페이지로 이동 (UUID 형식)
  36  |     await expect(page).toHaveURL(/\/analyze\/[a-f0-9\-]{36}/);
  37  |   });
  38  | 
  39  |   test('I-03: 존재하지 않는 콘텐츠 ID 접근', async ({ page }) => {
  40  |     await page.goto('/content/invalid-content-id-99999');
  41  |     
  42  |     // 404 처리
  43  |     const url = page.url();
  44  |     expect(url).toMatch(/404|invalid|localhost:3000\/?$/);
  45  |   });
  46  | 
  47  |   test('I-04: CTA 버튼 빠른 연속 클릭 (중복 방지)', async ({ page }) => {
> 48  |     await page.goto('/content/love-1');
      |                ^ Error: page.goto: Could not connect to the server.
  49  |     
  50  |     const ctaButton = page.getByRole('button', { name: /시작하기/ });
  51  |     
  52  |     // 빠르게 여러 번 클릭
  53  |     await ctaButton.click();
  54  |     await page.waitForTimeout(100); // 매우 짧은 대기
  55  |     
  56  |     // 이미 navigate 중이면 클릭 불가능할 수 있음
  57  |     // 페이지가 이동 중인지 확인
  58  |     await page.waitForTimeout(500);
  59  |     
  60  |     // analyze 페이지에 도달했는지 확인
  61  |     expect(page.url()).toMatch(/\/analyze\/|content\/love-1/);
  62  |   });
  63  | 
  64  |   test('I-05: 페이지 새로고침 시 콘텐츠 유지', async ({ page }) => {
  65  |     await page.goto('/content/love-1');
  66  |     
  67  |     const heading = page.locator('main h2').first();
  68  |     const originalTitle = await heading.textContent();
  69  |     
  70  |     // 페이지 새로고침
  71  |     await page.reload();
  72  |     
  73  |     // 동일한 콘텐츠가 렌더링됨
  74  |     const newTitle = await heading.textContent();
  75  |     expect(newTitle).toBe(originalTitle);
  76  |     
  77  |     // CTA 버튼 여전히 활성화
  78  |     const ctaButton = page.getByRole('button', { name: /시작하기/ });
  79  |     await expect(ctaButton).toBeEnabled();
  80  |   });
  81  | 
  82  |   test('I-06: 메타데이터 SEO 확인', async ({ page }) => {
  83  |     await page.goto('/content/love-1');
  84  |     
  85  |     // title 확인
  86  |     const title = await page.title();
  87  |     expect(title).toContain('VEIL');
  88  |     expect(title.length).toBeGreaterThan(0);
  89  |     
  90  |     // meta description 확인
  91  |     const metaDescription = page.locator('meta[name="description"]');
  92  |     const descriptionContent = await metaDescription.getAttribute('content');
  93  |     expect(descriptionContent).toBeTruthy();
  94  |     expect(descriptionContent!.length).toBeGreaterThan(0);
  95  |   });
  96  | 
  97  |   test('I-07: 뒤로가기 후 재진입', async ({ page }) => {
  98  |     // 직접 콘텐츠 페이지로 접근
  99  |     await page.goto('/content/love-1');
  100 | 
  101 |     const heading = page.locator('main h2').first();
  102 |     const originalTitle = await heading.textContent();
  103 |     expect(originalTitle).toBeTruthy();
  104 | 
  105 |     // 홈으로 이동 후 다시 동일 콘텐츠로 직접 재진입
  106 |     await page.goto('/');
  107 |     await page.goto('/content/love-1');
  108 | 
  109 |     // 동일한 콘텐츠가 로드됨
  110 |     const newTitle = await page.locator('main h2').first().textContent();
  111 |     expect(newTitle).toBe(originalTitle);
  112 | 
  113 |     // CTA 버튼이 활성화 상태 (텍스트: "시작하기 →")
  114 |     const ctaButton = page.getByRole('button', { name: /시작하기/ });
  115 |     await expect(ctaButton).toBeEnabled();
  116 |   });
  117 | });
  118 | 
```