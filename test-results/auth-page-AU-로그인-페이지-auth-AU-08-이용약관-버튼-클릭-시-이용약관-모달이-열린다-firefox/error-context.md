# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-page.spec.ts >> AU: 로그인 페이지 (/auth) >> AU-08: '이용약관' 버튼 클릭 시 이용약관 모달이 열린다
- Location: tests/e2e/auth-page.spec.ts:140:3

# Error details

```
Error: page.goto: NS_ERROR_CONNECTION_REFUSED
Call log:
  - navigating to "http://localhost:3000/auth", waiting until "load"

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
  43  | 
  44  |     // 내비게이션이 완료된 후 localStorage 확인
  45  |     await Promise.all([
  46  |       page.waitForURL(/\/$/, { timeout: 5000 }),
  47  |       page.getByRole("button", { name: /Google로 계속하기/ }).click(),
  48  |     ]);
  49  | 
  50  |     const userId = await page.evaluate(() =>
  51  |       localStorage.getItem("veil_user_id"),
  52  |     );
  53  |     const provider = await page.evaluate(() =>
  54  |       localStorage.getItem("veil_user_provider"),
  55  |     );
  56  | 
  57  |     expect(userId).toBe("user-1");
  58  |     expect(provider).toBe("google");
  59  |   });
  60  | 
  61  |   // ── AU-04: Kakao 클릭 → localStorage 설정 ─────────────────────────────
  62  |   test("AU-04: Kakao 버튼 클릭 시 veil_user_id·veil_user_provider가 localStorage에 저장된다", async ({
  63  |     page,
  64  |   }) => {
  65  |     await gotoAuth(page);
  66  | 
  67  |     await Promise.all([
  68  |       page.waitForURL(/\/$/, { timeout: 5000 }),
  69  |       page.getByRole("button", { name: /Kakao로 계속하기/ }).click(),
  70  |     ]);
  71  | 
  72  |     const userId = await page.evaluate(() =>
  73  |       localStorage.getItem("veil_user_id"),
  74  |     );
  75  |     const provider = await page.evaluate(() =>
  76  |       localStorage.getItem("veil_user_provider"),
  77  |     );
  78  | 
  79  |     expect(userId).toBe("user-1");
  80  |     expect(provider).toBe("kakao");
  81  |   });
  82  | 
  83  |   // ── AU-05: redirect_to 없을 때 → "/" 이동 ─────────────────────────────
  84  |   test("AU-05: sessionStorage에 redirect_to 없으면 로그인 후 홈(/)으로 이동한다", async ({
  85  |     page,
  86  |   }) => {
  87  |     await gotoAuth(page); // redirect_to가 없는 상태
  88  | 
  89  |     await Promise.all([
  90  |       page.waitForURL(/\/$/, { timeout: 5000 }),
  91  |       page.getByRole("button", { name: /Google로 계속하기/ }).click(),
  92  |     ]);
  93  | 
  94  |     expect(page.url()).toMatch(/localhost:3000\/$/);
  95  |   });
  96  | 
  97  |   // ── AU-06: redirect_to 있을 때 → redirect_to URL로 이동 ───────────────
  98  |   test("AU-06: sessionStorage에 redirect_to가 있으면 로그인 후 해당 URL로 이동한다", async ({
  99  |     page,
  100 |   }) => {
  101 |     const REDIRECT_TARGET = "http://localhost:3000/share/test-au06-share";
  102 | 
  103 |     await gotoAuth(page);
  104 |     // 로그인 직전 sessionStorage에 redirect_to 설정
  105 |     await page.evaluate((url) => {
  106 |       sessionStorage.setItem("redirect_to", url);
  107 |     }, REDIRECT_TARGET);
  108 | 
  109 |     // /share/test-au06-share 로 이동 시도 (데이터 없어 에러 페이지가 나와도 URL 자체는 맞음)
  110 |     await Promise.all([
  111 |       page.waitForURL(/\/share\/test-au06-share/, { timeout: 5000 }),
  112 |       page.getByRole("button", { name: /Google로 계속하기/ }).click(),
  113 |     ]);
  114 | 
  115 |     expect(page.url()).toContain("/share/test-au06-share");
  116 |   });
  117 | 
  118 |   // ── AU-07: 로그인 후 sessionStorage.redirect_to 삭제 확인 ─────────────
  119 |   test("AU-07: 로그인 완료 후 sessionStorage.redirect_to가 삭제된다", async ({
  120 |     page,
  121 |   }) => {
  122 |     await gotoAuth(page);
  123 |     await page.evaluate(() => {
  124 |       sessionStorage.setItem("redirect_to", "http://localhost:3000/share/au07");
  125 |     });
  126 | 
  127 |     await Promise.all([
  128 |       page.waitForURL(/\/share\/au07/, { timeout: 5000 }),
  129 |       page.getByRole("button", { name: /Google로 계속하기/ }).click(),
  130 |     ]);
  131 | 
  132 |     // 이동된 페이지에서 redirect_to가 삭제됐는지 확인
  133 |     const remaining = await page.evaluate(() =>
  134 |       sessionStorage.getItem("redirect_to"),
  135 |     );
  136 |     expect(remaining).toBeNull();
  137 |   });
  138 | 
  139 |   // ── AU-08: 이용약관 모달 ─────────────────────────────────────────────
  140 |   test("AU-08: '이용약관' 버튼 클릭 시 이용약관 모달이 열린다", async ({
  141 |     page,
  142 |   }) => {
> 143 |     await page.goto("/auth");
      |                ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  144 | 
  145 |     const termsBtn = page.getByTestId("auth-terms-btn");
  146 |     await expect(termsBtn).toBeVisible();
  147 |     await termsBtn.click();
  148 | 
  149 |     // 모달 렌더링 확인
  150 |     await expect(page.locator("[data-testid='terms-modal-overlay']")).toBeVisible({
  151 |       timeout: 3000,
  152 |     });
  153 |     // 모달 제목 확인
  154 |     await expect(page.locator("h2").filter({ hasText: "이용약관" })).toBeVisible();
  155 |   });
  156 | 
  157 |   // ── AU-09: 개인정보처리방침 모달 ─────────────────────────────────────
  158 |   test("AU-09: '개인정보처리방침' 버튼 클릭 시 개인정보처리방침 모달이 열린다", async ({
  159 |     page,
  160 |   }) => {
  161 |     await page.goto("/auth");
  162 | 
  163 |     const privacyBtn = page.getByTestId("auth-privacy-btn");
  164 |     await expect(privacyBtn).toBeVisible();
  165 |     await privacyBtn.click();
  166 | 
  167 |     // 모달 렌더링 확인
  168 |     await expect(page.locator("[data-testid='terms-modal-overlay']")).toBeVisible({
  169 |       timeout: 3000,
  170 |     });
  171 |     // 모달 제목 확인
  172 |     await expect(page.locator("h2").filter({ hasText: "개인정보처리방침" })).toBeVisible();
  173 |   });
  174 | 
  175 |   // ── AU-09.5: 모달 닫기 (ESC 키) ──────────────────────────────────────
  176 |   test("AU-09.5: ESC 키를 눌러 모달을 닫을 수 있다", async ({ page }) => {
  177 |     await page.goto("/auth");
  178 | 
  179 |     const termsBtn = page.getByTestId("auth-terms-btn");
  180 |     await termsBtn.click();
  181 | 
  182 |     // 모달이 열렸는지 확인
  183 |     const modalOverlay = page.locator("[data-testid='terms-modal-overlay']");
  184 |     await expect(modalOverlay).toBeVisible({ timeout: 3000 });
  185 | 
  186 |     // ESC 키 누르기
  187 |     await page.keyboard.press("Escape");
  188 | 
  189 |     // 모달이 닫혔는지 확인
  190 |     await expect(modalOverlay).not.toBeVisible({ timeout: 2000 });
  191 |   });
  192 | 
  193 |   // ── AU-09.6: 모달 닫기 (오버레이 클릭) ───────────────────────────────
  194 |   test("AU-09.6: 오버레이 클릭으로 모달을 닫을 수 있다", async ({ page }) => {
  195 |     await page.goto("/auth");
  196 | 
  197 |     const privacyBtn = page.getByTestId("auth-privacy-btn");
  198 |     await privacyBtn.click();
  199 | 
  200 |     // 모달이 열렸는지 확인
  201 |     const modalOverlay = page.locator("[data-testid='terms-modal-overlay']");
  202 |     await expect(modalOverlay).toBeVisible({ timeout: 3000 });
  203 | 
  204 |     // 오버레이의 배경 영역(즉, modal container가 아닌 바깥쪽) 클릭
  205 |     await modalOverlay.click({ position: { x: 10, y: 10 } });
  206 | 
  207 |     // 모달이 닫혔는지 확인
  208 |     await expect(modalOverlay).not.toBeVisible({ timeout: 2000 });
  209 |   });
  210 | 
  211 |   // ── AU-10: 중복 클릭 방지 ────────────────────────────────────────────
  212 |   // 현재 코드에 명시적 debounce/disabled 처리 없음.
  213 |   // window.location.href 를 mock해 클릭당 navigation 횟수를 측정한다.
  214 |   test("AU-10: 버튼 클릭 시 localStorage 상태가 일관되게 설정된다 (중복 클릭 방어 확인)", async ({
  215 |     page,
  216 |   }) => {
  217 |     await gotoAuth(page);
  218 | 
  219 |     // navigation count를 추적하는 spy 주입
  220 |     await page.evaluate(() => {
  221 |       (window as unknown as Record<string, unknown>)._navCount = 0;
  222 |       // 실제 navigation 대신 카운트만 증가
  223 |       const orig = Object.getOwnPropertyDescriptor(
  224 |         window,
  225 |         "location",
  226 |       );
  227 |       // location은 readonly라 직접 override 불가능 → localStorage 값만 관찰
  228 |     });
  229 | 
  230 |     // 빠르게 두 번 클릭 시도 (두 번째는 navigation 중에 발생)
  231 |     const btn = page.getByRole("button", { name: /Google로 계속하기/ });
  232 |     await btn.click(); // 첫 번째 클릭 → navigation 시작
  233 | 
  234 |     // navigation 완료 대기
  235 |     await page.waitForURL(/\/$/, { timeout: 5000 });
  236 | 
  237 |     // localStorage가 의도한 값으로 설정됐는지 확인
  238 |     const userId = await page.evaluate(() =>
  239 |       localStorage.getItem("veil_user_id"),
  240 |     );
  241 |     const provider = await page.evaluate(() =>
  242 |       localStorage.getItem("veil_user_provider"),
  243 |     );
```