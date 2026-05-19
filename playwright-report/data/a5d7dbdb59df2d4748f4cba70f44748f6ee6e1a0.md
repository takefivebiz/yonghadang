# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-page.spec.ts >> AU: 로그인 페이지 (/auth) >> AU-06: sessionStorage에 redirect_to가 있으면 로그인 후 해당 URL로 이동한다
- Location: tests/e2e/auth-page.spec.ts:98:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 5000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "https://accounts.google.com/v3/signin/identifier?opparams=%253Fredirect_to%253Dhttp%25253A%25252F%25252Flocalhost%25253A3000%25252Fapi%25252Fauth%25252Fcallback%25253Fnext%25253Dhttp%2525253A%2525252F%2525252Flocalhost%2525253A3000%2525252Fshare%2525252Ftest-au06-share&dsh=S388721661%3A1779191115459146&client_id=84610654802-v4c4aea2vo8bqojgo0cp0p6nm8tlm3qe.apps.googleusercontent.com&o2v=2&redirect_uri=https%3A%2F%2Fecnoxnbiduwmgzpcfygc.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile&service=lso&state=06d45a23-e05d-4254-b5de-6b27dedb4325&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAPK3pxjm4wzc9aNHL1ema9iwJ31LnGVTDyC3uSFJJIC7rnKa2BOz6n_Oq8E5Z6XnrkxePaQRoAyBWFVl64VNFZog_FY2Qt3kYgHuG1HBPRR0GCx-2URMFW9PJ9XAyyLCdrOvMGsbl4vx8JsrT5VlC_UdUUfVT70_lftkkb4qiwp2URbXqamfCS5ufCiJ8L4pUQAQTyuiGmaI0U9lxP__6v1RG1hl8au71uAhgxdxOZH29iM4tWSbp2pkicfuwygpIMp2GimIiLtvzALyH68qL3IyHx8LKpkyMcbjFAveCYUX9R2etaj8bSQtUgdXFUdqlbCBclmp_jn2rHSTDyw-ct9xn7D_wMabebiGrOPXtMaE8_DPqZ5ZbigXuMTG0pQ11CFs1h_I--sU4kmNeSzdgapF8c7VoSE6NrbJ2kmh4Jvj4i2mF7YE9ksYTzYdVQ_Ql_j1pxWDW43xijpiPOPsm9KQ8YB1XmjYrbSwGSu4QUJZR2ix7k%26flowName%3DGeneralOAuthFlow%26as%3DS388721661%253A1779191115459146%26client_id%3D84610654802-v4c4aea2vo8bqojgo0cp0p6nm8tlm3qe.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fecnoxnbiduwmgzpcfygc.supabase.co&rart=ANgoxcdjMUGK2dQvSBinzVWZ0Fxot45x5Qa7XCoQy1tpO6IUwoX7v_SXc9iRiHgbWL5MOVvFG4qN_WvRAELcLJZTcAECpGBIKv1-b4yHmA1uIyNUCVV_5Uw"
  navigated to "https://accounts.google.com/v3/signin/identifier?opparams=%253Fredirect_to%253Dhttp%25253A%25252F%25252Flocalhost%25253A3000%25252Fapi%25252Fauth%25252Fcallback%25253Fnext%25253Dhttp%2525253A%2525252F%2525252Flocalhost%2525253A3000%2525252Fshare%2525252Ftest-au06-share&dsh=S388721661%3A1779191115459146&client_id=84610654802-v4c4aea2vo8bqojgo0cp0p6nm8tlm3qe.apps.googleusercontent.com&o2v=2&redirect_uri=https%3A%2F%2Fecnoxnbiduwmgzpcfygc.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile&service=lso&state=06d45a23-e05d-4254-b5de-6b27dedb4325&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAPK3pxjm4wzc9aNHL1ema9iwJ31LnGVTDyC3uSFJJIC7rnKa2BOz6n_Oq8E5Z6XnrkxePaQRoAyBWFVl64VNFZog_FY2Qt3kYgHuG1HBPRR0GCx-2URMFW9PJ9XAyyLCdrOvMGsbl4vx8JsrT5VlC_UdUUfVT70_lftkkb4qiwp2URbXqamfCS5ufCiJ8L4pUQAQTyuiGmaI0U9lxP__6v1RG1hl8au71uAhgxdxOZH29iM4tWSbp2pkicfuwygpIMp2GimIiLtvzALyH68qL3IyHx8LKpkyMcbjFAveCYUX9R2etaj8bSQtUgdXFUdqlbCBclmp_jn2rHSTDyw-ct9xn7D_wMabebiGrOPXtMaE8_DPqZ5ZbigXuMTG0pQ11CFs1h_I--sU4kmNeSzdgapF8c7VoSE6NrbJ2kmh4Jvj4i2mF7YE9ksYTzYdVQ_Ql_j1pxWDW43xijpiPOPsm9KQ8YB1XmjYrbSwGSu4QUJZR2ix7k%26flowName%3DGeneralOAuthFlow%26as%3DS388721661%253A1779191115459146%26client_id%3D84610654802-v4c4aea2vo8bqojgo0cp0p6nm8tlm3qe.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fecnoxnbiduwmgzpcfygc.supabase.co&rart=ANgoxcdjMUGK2dQvSBinzVWZ0Fxot45x5Qa7XCoQy1tpO6IUwoX7v_SXc9iRiHgbWL5MOVvFG4qN_WvRAELcLJZTcAECpGBIKv1-b4yHmA1uIyNUCVV_5Uw"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - progressbar [ref=e6]
      - main [ref=e14]:
        - generic [ref=e15]:
          - generic [ref=e18]:
            - img [ref=e20]
            - generic [ref=e25]: Sign in with Google
          - generic [ref=e26]:
            - heading "Sign in" [level=1] [ref=e27]
            - generic [ref=e29]:
              - text: to continue to
              - button "ecnoxnbiduwmgzpcfygc.supabase.co" [ref=e30] [cursor=pointer]
        - generic [ref=e38]:
          - generic [ref=e43]:
            - textbox "Email or phone" [active] [ref=e44]
            - generic: Email or phone
          - button "Forgot email?" [ref=e48] [cursor=pointer]
        - generic [ref=e50]:
          - button "Next" [ref=e54]:
            - generic [ref=e57]: Next
          - button "Create account" [ref=e62]:
            - generic [ref=e65]: Create account
    - contentinfo [ref=e69]:
      - combobox "Change language English (United States)" [ref=e73] [cursor=pointer]:
        - generic:
          - generic: English (United States)
        - generic:
          - img
      - list [ref=e75]:
        - listitem [ref=e76]:
          - link "Help" [ref=e77] [cursor=pointer]:
            - /url: https://support.google.com/accounts?hl=en-US&p=account_iph
        - listitem [ref=e78]:
          - link "Privacy" [ref=e79] [cursor=pointer]:
            - /url: https://accounts.google.com/TOS?loc=KR&hl=en-US&privacy=true
        - listitem [ref=e80]:
          - link "Terms" [ref=e81] [cursor=pointer]:
            - /url: https://accounts.google.com/TOS?loc=KR&hl=en-US
  - iframe [ref=e82]:
    
```

# Test source

```ts
  11  |   await page.goto("/auth");
  12  |   // 버튼 렌더링 완료 대기
  13  |   await expect(
  14  |     page.getByRole("button", { name: /Google로 계속하기/ }),
  15  |   ).toBeVisible({ timeout: 5000 });
  16  | };
  17  | 
  18  | // ─────────────────────────────────────────────────────────────────────────
  19  | test.describe("AU: 로그인 페이지 (/auth)", () => {
  20  |   // ── AU-01: Google 버튼 렌더링 ─────────────────────────────────────────
  21  |   test("AU-01: Google 로그인 버튼이 렌더링된다", async ({ page }) => {
  22  |     await page.goto("/auth");
  23  | 
  24  |     const btn = page.getByRole("button", { name: /Google로 계속하기/ });
  25  |     await expect(btn).toBeVisible();
  26  |     await expect(btn).toBeEnabled();
  27  |   });
  28  | 
  29  |   // ── AU-02: Kakao 버튼 렌더링 ─────────────────────────────────────────
  30  |   test("AU-02: Kakao 로그인 버튼이 렌더링된다", async ({ page }) => {
  31  |     await page.goto("/auth");
  32  | 
  33  |     const btn = page.getByRole("button", { name: /Kakao로 계속하기/ });
  34  |     await expect(btn).toBeVisible();
  35  |     await expect(btn).toBeEnabled();
  36  |   });
  37  | 
  38  |   // ── AU-03: Google 클릭 → localStorage 설정 ────────────────────────────
  39  |   test("AU-03: Google 버튼 클릭 시 veil_user_id·veil_user_provider가 localStorage에 저장된다", async ({
  40  |     page,
  41  |   }) => {
  42  |     await gotoAuth(page);
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
> 111 |       page.waitForURL(/\/share\/test-au06-share/, { timeout: 5000 }),
      |            ^ TimeoutError: page.waitForURL: Timeout 5000ms exceeded.
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
  143 |     await page.goto("/auth");
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
```