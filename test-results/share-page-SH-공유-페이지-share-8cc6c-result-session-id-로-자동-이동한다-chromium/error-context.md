# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: share-page.spec.ts >> SH: 공유 페이지 (/share/[share_id]) >> SH-14: veil_user_id가 있으면 /result/[session_id]로 자동 이동한다
- Location: tests/e2e/share-page.spec.ts:269:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  173 |       page.locator("[data-testid='scene-unlock-btn']"),
  174 |     ).toHaveCount(0);
  175 |   });
  176 | 
  177 |   // ── SH-10: "로그인 하기" → /auth 이동 + redirect_to 저장 ─────────────
  178 |   test("SH-10: '로그인 하기' 클릭 시 /auth로 이동하고 redirect_to가 sessionStorage에 저장된다", async ({
  179 |     page,
  180 |   }) => {
  181 |     await gotoShareWithData(page);
  182 | 
  183 |     const loginBtn = page.locator("[data-testid='share-cta-login-btn']");
  184 |     await loginBtn.scrollIntoViewIfNeeded();
  185 | 
  186 |     // /auth로 이동 감지 (window.location.href 사용으로 full navigation)
  187 |     await Promise.all([
  188 |       page.waitForURL(/\/auth/, { timeout: 5000 }),
  189 |       loginBtn.click(),
  190 |     ]);
  191 | 
  192 |     // sessionStorage.redirect_to에 공유 페이지 URL이 저장되어 있는지 확인
  193 |     const redirectTo = await page.evaluate(() =>
  194 |       sessionStorage.getItem("redirect_to"),
  195 |     );
  196 |     expect(redirectTo).not.toBeNull();
  197 |     expect(redirectTo).toContain(`/share/${SHARE_ID}`);
  198 |   });
  199 | 
  200 |   // ── SH-11: "비회원 조회하기" → /guest 이동 + redirect_to 저장 ─────────
  201 |   test("SH-11: '비회원 조회하기' 클릭 시 /guest로 이동하고 redirect_to가 sessionStorage에 저장된다", async ({
  202 |     page,
  203 |   }) => {
  204 |     await gotoShareWithData(page);
  205 | 
  206 |     const guestBtn = page.locator("[data-testid='share-cta-guest-btn']");
  207 |     await guestBtn.scrollIntoViewIfNeeded();
  208 | 
  209 |     await Promise.all([
  210 |       page.waitForURL(/\/guest/, { timeout: 5000 }),
  211 |       guestBtn.click(),
  212 |     ]);
  213 | 
  214 |     const redirectTo = await page.evaluate(() =>
  215 |       sessionStorage.getItem("redirect_to"),
  216 |     );
  217 |     expect(redirectTo).not.toBeNull();
  218 |     expect(redirectTo).toContain(`/share/${SHARE_ID}`);
  219 |   });
  220 | 
  221 |   // ── SH-12: "이어서 보려면" CTA 문구 표시 ─────────────────────────────
  222 |   test("SH-12: CTA 섹션에 '이어서 보려면' 문구가 표시된다", async ({
  223 |     page,
  224 |   }) => {
  225 |     await gotoShareWithData(page);
  226 | 
  227 |     const ctaSection = page.locator("[data-testid='share-cta-section']");
  228 |     await expect(ctaSection).toBeVisible();
  229 |     await expect(page.locator("text=이어서 보려면")).toBeVisible();
  230 | 
  231 |     // 두 CTA 버튼 모두 보임
  232 |     await expect(
  233 |       page.locator("[data-testid='share-cta-login-btn']"),
  234 |     ).toBeVisible();
  235 |     await expect(
  236 |       page.locator("[data-testid='share-cta-guest-btn']"),
  237 |     ).toBeVisible();
  238 |   });
  239 | 
  240 |   // ── SH-13: 버튼 hover 스타일 변화 ────────────────────────────────────
  241 |   test("SH-13: '로그인 하기' 버튼 hover 시 배경 opacity가 증가한다", async ({
  242 |     page,
  243 |   }) => {
  244 |     await gotoShareWithData(page);
  245 | 
  246 |     const loginBtn = page.locator("[data-testid='share-cta-login-btn']");
  247 |     await loginBtn.scrollIntoViewIfNeeded();
  248 | 
  249 |     // hover 전 배경색
  250 |     const bgBefore = await loginBtn.evaluate(
  251 |       (el) => (el as HTMLElement).style.background,
  252 |     );
  253 | 
  254 |     // hover
  255 |     await loginBtn.hover();
  256 | 
  257 |     // hover 후 배경색
  258 |     const bgAfter = await loginBtn.evaluate(
  259 |       (el) => (el as HTMLElement).style.background,
  260 |     );
  261 | 
  262 |     // 배경색이 변경되었는지 확인
  263 |     expect(bgAfter).not.toBe(bgBefore);
  264 |     // hover 후 더 밝아져야 함 (0.25 > 0.15)
  265 |     expect(bgAfter).toContain("0.25");
  266 |   });
  267 | 
  268 |   // ── SH-14: 로그인 상태(veil_user_id 있음) → /result 자동 이동 ─────────
  269 |   test("SH-14: veil_user_id가 있으면 /result/[session_id]로 자동 이동한다", async ({
  270 |     page,
  271 |   }) => {
  272 |     // 분석 데이터 + 로그인 상태 함께 세팅
> 273 |     await page.goto("/");
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  274 |     await page.evaluate(
  275 |       ({ shareId, contentId }) => {
  276 |         const data = {
  277 |           session_id: shareId,
  278 |           content_id: contentId,
  279 |           free_input: "테스트",
  280 |           answers: [],
  281 |           created_at: new Date().toISOString(),
  282 |         };
  283 |         localStorage.setItem(
  284 |           `veil_analysis_${shareId}`,
  285 |           JSON.stringify(data),
  286 |         );
  287 |         // 로그인 상태 설정
  288 |         localStorage.setItem("veil_user_id", "test-user-sh14");
  289 |       },
  290 |       { shareId: SHARE_ID, contentId: CONTENT_ID },
  291 |     );
  292 | 
  293 |     // 공유 페이지 접근 → /result로 자동 redirect 기대
  294 |     await page.goto(`/share/${SHARE_ID}`);
  295 |     await page.waitForURL(/\/result\//, { timeout: 8000 });
  296 | 
  297 |     expect(page.url()).toContain(`/result/${SHARE_ID}`);
  298 | 
  299 |     // 정리: 이후 테스트에 영향 없도록 user_id 제거
  300 |     await page.evaluate(() => localStorage.removeItem("veil_user_id"));
  301 |   });
  302 | 
  303 |   // ── SH-15: 비회원 인증 상태(guest_id 있음) → /result 자동 이동 ─────────
  304 |   test("SH-15: sessionStorage에 guest_id가 있으면 /result/[session_id]로 자동 이동한다", async ({
  305 |     page,
  306 |   }) => {
  307 |     // 분석 데이터 + 비회원 인증 상태 함께 세팅
  308 |     await page.goto("/");
  309 |     await page.evaluate(
  310 |       ({ shareId, contentId }) => {
  311 |         const data = {
  312 |           session_id: shareId,
  313 |           content_id: contentId,
  314 |           free_input: "테스트",
  315 |           answers: [],
  316 |           created_at: new Date().toISOString(),
  317 |         };
  318 |         localStorage.setItem(
  319 |           `veil_analysis_${shareId}`,
  320 |           JSON.stringify(data),
  321 |         );
  322 |         // 비회원 인증 상태 설정 (sessionStorage)
  323 |         sessionStorage.setItem("guest_id", "test-guest-sh15");
  324 |       },
  325 |       { shareId: SHARE_ID, contentId: CONTENT_ID },
  326 |     );
  327 | 
  328 |     await page.goto(`/share/${SHARE_ID}`);
  329 |     await page.waitForURL(/\/result\//, { timeout: 8000 });
  330 | 
  331 |     expect(page.url()).toContain(`/result/${SHARE_ID}`);
  332 | 
  333 |     // 정리
  334 |     await page.evaluate(() => sessionStorage.removeItem("guest_id"));
  335 |   });
  336 | });
  337 | 
```