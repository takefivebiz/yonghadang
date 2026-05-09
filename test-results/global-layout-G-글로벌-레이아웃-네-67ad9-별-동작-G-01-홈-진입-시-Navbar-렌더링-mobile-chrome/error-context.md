# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: global-layout.spec.ts >> G: 글로벌 레이아웃 / 네비게이션 >> G-01 ~ G-06: Navbar 렌더링 및 상태별 동작 >> G-01: 홈 진입 시 Navbar 렌더링
- Location: tests/e2e/global-layout.spec.ts:5:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: '로그인' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: '로그인' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - navigation [ref=e4]:
        - link "VEIL" [ref=e5] [cursor=pointer]:
          - /url: /
        - button "메뉴 열기" [ref=e6]
    - main [ref=e10]:
      - generic [ref=e11]:
        - heading "설명되지 않던 감정이 보이기 시작할 거야" [level=1] [ref=e13]:
          - text: 설명되지 않던 감정이
          - text: 보이기 시작할 거야
        - generic [ref=e18]:
          - heading "지금 많이 보는" [level=2] [ref=e21]
          - generic [ref=e22]:
            - link [ref=e23] [cursor=pointer]:
              - /url: /content/love-1
              - article [ref=e24]:
                - img "사랑일까, 집착일까?" [ref=e25]
                - generic [ref=e26]: 연애
                - img [ref=e29]
            - link [ref=e31] [cursor=pointer]:
              - /url: /content/rel-1
              - article [ref=e32]:
                - img "왜 나는 항상 관계에서 을이 되는 걸까?" [ref=e33]
                - generic [ref=e34]: 인간관계
                - img [ref=e37]
            - link [ref=e39] [cursor=pointer]:
              - /url: /content/career-2
              - article [ref=e40]:
                - img "퇴사 vs 버티기, 지금 내 상황은?" [ref=e41]
                - generic [ref=e42]: 직업·진로
                - img [ref=e45]
            - link [ref=e47] [cursor=pointer]:
              - /url: /content/emotion-3
              - article [ref=e48]:
                - generic [ref=e53]: 감정
                - img [ref=e56]
        - generic [ref=e62]:
          - link "연애" [ref=e63] [cursor=pointer]:
            - /url: "#love"
          - link "인간관계" [ref=e64] [cursor=pointer]:
            - /url: "#relationship"
          - link "직업·진로" [ref=e65] [cursor=pointer]:
            - /url: "#career"
          - link "감정" [ref=e66] [cursor=pointer]:
            - /url: "#emotion"
        - generic [ref=e67]:
          - generic [ref=e68]:
            - heading "연애" [level=2] [ref=e71]
            - link "전체보기 →" [ref=e72] [cursor=pointer]:
              - /url: /category/love
          - generic [ref=e73]:
            - link [ref=e74] [cursor=pointer]:
              - /url: /content/love-1
              - article [ref=e75]:
                - img "사랑일까, 집착일까?" [ref=e76]
                - img [ref=e79]
            - link [ref=e81] [cursor=pointer]:
              - /url: /content/love-2
              - article [ref=e82]:
                - img "나는 진심일까, 그냥 외로운 걸까?" [ref=e83]
                - img [ref=e86]
            - link [ref=e88] [cursor=pointer]:
              - /url: /content/love-3
              - article [ref=e89]:
                - img "왜 항상 나만 더 좋아하게 될까?" [ref=e90]
                - img [ref=e93]
            - link [ref=e95] [cursor=pointer]:
              - /url: /content/love-4
              - article [ref=e96]:
                - img "왜 항상 썸에서 끝날까?" [ref=e97]
                - img [ref=e100]
            - link [ref=e102] [cursor=pointer]:
              - /url: /content/love-5
              - article [ref=e103]:
                - img "이 사람, 나 좋아하는 거 맞아?" [ref=e104]
                - img [ref=e107]
            - link [ref=e109] [cursor=pointer]:
              - /url: /content/love-6
              - article [ref=e110]:
                - img "헤어지고 싶은 걸까, 그냥 지친걸까?" [ref=e111]
                - img [ref=e114]
        - generic [ref=e116]:
          - generic [ref=e117]:
            - heading "인간관계" [level=2] [ref=e120]
            - link "전체보기 →" [ref=e121] [cursor=pointer]:
              - /url: /category/relationship
          - generic [ref=e122]:
            - link [ref=e123] [cursor=pointer]:
              - /url: /content/rel-1
              - article [ref=e124]:
                - img "왜 나는 항상 관계에서 을이 되는 걸까?" [ref=e125]
                - img [ref=e128]
            - link [ref=e130] [cursor=pointer]:
              - /url: /content/rel-2
              - article [ref=e131]:
                - img "내가 예민한건가?" [ref=e132]
                - img [ref=e135]
            - link [ref=e137] [cursor=pointer]:
              - /url: /content/rel-3
              - article [ref=e138]:
                - img [ref=e145]
            - link [ref=e147] [cursor=pointer]:
              - /url: /content/rel-4
              - article [ref=e148]:
                - img [ref=e155]
            - link [ref=e157] [cursor=pointer]:
              - /url: /content/rel-5
              - article [ref=e158]:
                - img [ref=e165]
            - link [ref=e167] [cursor=pointer]:
              - /url: /content/rel-6
              - article [ref=e168]:
                - img [ref=e175]
        - generic [ref=e177]:
          - generic [ref=e178]:
            - heading "직업·진로" [level=2] [ref=e181]
            - link "전체보기 →" [ref=e182] [cursor=pointer]:
              - /url: /category/career
          - generic [ref=e183]:
            - link [ref=e184] [cursor=pointer]:
              - /url: /content/career-1
              - article [ref=e185]:
                - img "지금 이 일, 나한테 맞는 걸까?" [ref=e186]
                - img [ref=e189]
            - link [ref=e191] [cursor=pointer]:
              - /url: /content/career-2
              - article [ref=e192]:
                - img "퇴사 vs 버티기, 지금 내 상황은?" [ref=e193]
                - img [ref=e196]
            - link [ref=e198] [cursor=pointer]:
              - /url: /content/career-3
              - article [ref=e199]:
                - img [ref=e206]
            - link [ref=e208] [cursor=pointer]:
              - /url: /content/career-4
              - article [ref=e209]:
                - img [ref=e216]
            - link [ref=e218] [cursor=pointer]:
              - /url: /content/career-5
              - article [ref=e219]:
                - img [ref=e226]
        - generic [ref=e228]:
          - generic [ref=e229]:
            - heading "감정" [level=2] [ref=e232]
            - link "전체보기 →" [ref=e233] [cursor=pointer]:
              - /url: /category/emotion
          - generic [ref=e234]:
            - link [ref=e235] [cursor=pointer]:
              - /url: /content/emotion-1
              - article [ref=e236]:
                - img "이유 없이 공허한 이 감정의 정체" [ref=e237]
                - img [ref=e240]
            - link [ref=e242] [cursor=pointer]:
              - /url: /content/emotion-2
              - article [ref=e243]:
                - img "자꾸 남과 비교하는 내가 싫을 때" [ref=e244]
                - img [ref=e247]
            - link [ref=e249] [cursor=pointer]:
              - /url: /content/emotion-3
              - article [ref=e250]:
                - img [ref=e257]
            - link [ref=e259] [cursor=pointer]:
              - /url: /content/emotion-4
              - article [ref=e260]:
                - img [ref=e267]
            - link [ref=e269] [cursor=pointer]:
              - /url: /content/emotion-5
              - article [ref=e270]:
                - img [ref=e277]
    - contentinfo [ref=e279]:
      - generic [ref=e280]:
        - generic [ref=e281]:
          - paragraph [ref=e282]: "VEIL | 대표자: 홍길동"
          - paragraph [ref=e283]: "사업자등록번호 : 00-00-00000"
          - paragraph [ref=e284]: "통신판매업신고: 제2026-서울-0000호"
          - paragraph [ref=e285]: 서울특별시 땡땡구 땡땡동 땡떙로 77
        - generic [ref=e286]:
          - button "이용약관" [ref=e287]
          - button "개인정보처리방침" [ref=e288]
          - button "문의하기" [ref=e289]
        - paragraph [ref=e290]: © 2026 VEIL. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e296] [cursor=pointer]:
    - img [ref=e297]
  - alert [ref=e300]
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
> 9   |       await expect(page.getByRole('link', { name: '로그인' })).toBeVisible();
      |                                                             ^ Error: expect(locator).toBeVisible() failed
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
  107 |       if (await overlay.isVisible()) {
  108 |         await overlay.click({ position: { x: 10, y: 10 } });
  109 |         await expect(page.locator('h3', { hasText: /자주 묻는 질문/ })).not.toBeVisible();
```