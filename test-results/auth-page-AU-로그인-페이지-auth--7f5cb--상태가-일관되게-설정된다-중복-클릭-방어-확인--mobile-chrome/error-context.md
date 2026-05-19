# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-page.spec.ts >> AU: 로그인 페이지 (/auth) >> AU-10: 버튼 클릭 시 localStorage 상태가 일관되게 설정된다 (중복 클릭 방어 확인)
- Location: tests/e2e/auth-page.spec.ts:214:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 5000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "https://accounts.google.com/v3/signin/identifier?opparams=%253Fredirect_to%253Dhttp%25253A%25252F%25252Flocalhost%25253A3000%25252Fapi%25252Fauth%25252Fcallback%25253Fnext%25253D%2525252F&dsh=S-483586227%3A1779191152466142&client_id=84610654802-v4c4aea2vo8bqojgo0cp0p6nm8tlm3qe.apps.googleusercontent.com&o2v=2&redirect_uri=https%3A%2F%2Fecnoxnbiduwmgzpcfygc.supabase.co%2Fauth%2Fv1%2Fcallback&response_type=code&scope=email+profile&service=lso&state=94e5830e-7592-4e6f-a004-c970604a7b09&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hAONTmREJI7NOoU_cj_uhx8p41g9Z6h1ebb4i8HepYbyLdbpvfoOSWBS47Fcfw8NK9d4PUJ2quePnPRguypSld7lGW5kekGJe68TDMbhYM8uoh87C4Fj9Xqf6jf1HmOD6aF-6IwTGy7c7r2Pnemws7_qtAMzDMZQ35SIH6k2cGHcJ-8BsGFA2SGGKzCOe0oQyEWIvzjriPUcqxny-FXYAFcNy0zCP4kFSBXGFsr5w2Jj4ViBoL2h6iNGUjvGKILom9o0mwouxXQ8jJIuFK15KJFzBHfuzn452goGeOVoU4hHxB9U25YOy5eVsw6uJTaLRS6dr2TKLdcvxBT8WcZr2HYqTKkoYsx-dQ2E_mn1o7HzJ--bZ-ReSdx9sfyRnditYN7Ur9V5qP3MqIllwRshCAu2I85ROopaH7j8_LmjrUZCQRBTZQ68co0ArmqwjEGVaKU7tS3mmAo15fGDJwPxJnLHHsw-D27zwXDch-brWiT8cl7qGx8%26flowName%3DGeneralOAuthFlow%26as%3DS-483586227%253A1779191152466142%26client_id%3D84610654802-v4c4aea2vo8bqojgo0cp0p6nm8tlm3qe.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23&app_domain=https%3A%2F%2Fecnoxnbiduwmgzpcfygc.supabase.co&rart=ANgoxcdROqs6---Qs68fIkT2T2_OaaVbXAgRPcZnYjQ04Bdua7-7gBFheilx1oyRj5hMyWcCvGAPgUJSPXFtR3a0DI9zmglFsp6HIiWzvjy3pThYCDMHHpE"
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
> 235 |     await page.waitForURL(/\/$/, { timeout: 5000 });
      |                ^ TimeoutError: page.waitForURL: Timeout 5000ms exceeded.
  236 | 
  237 |     // localStorage가 의도한 값으로 설정됐는지 확인
  238 |     const userId = await page.evaluate(() =>
  239 |       localStorage.getItem("veil_user_id"),
  240 |     );
  241 |     const provider = await page.evaluate(() =>
  242 |       localStorage.getItem("veil_user_provider"),
  243 |     );
  244 | 
  245 |     expect(userId).toBe("user-1");
  246 |     expect(provider).toBe("google");
  247 | 
  248 |     // ── UX 이슈 메모 ────────────────────────────────────────────────
  249 |     // 현재 버튼에 disabled 처리 및 loading 상태가 없음.
  250 |     // window.location.href = url 이 동기적으로 navigation을 시작하므로
  251 |     // 실질적으로 두 번째 클릭이 처리될 가능성은 낮지만,
  252 |     // 명시적 debounce를 추가하면 더 안전함 (Phase 3-D 이후 개선 권장).
  253 |   });
  254 | });
  255 | 
```