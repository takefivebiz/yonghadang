# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: guest-page.spec.ts >> GU: 비회원 조회 페이지 (/guest) >> GU-21: sessionStorage에 guest_id·guest_sessions가 있으면 바로 Step 2로 이동한다
- Location: tests/e2e/guest-page.spec.ts:324:3

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
  227 | 
  228 |     // /share/ → /result/ 체인 리다이렉트가 발생하므로 최종 안정 URL까지 대기
  229 |     // sessionStorage는 same-origin 이동 시 유지됨
  230 |     await Promise.all([
  231 |       page.waitForURL(/\/result\//, { timeout: 10000 }),
  232 |       page.locator("text=사랑일까").click(),
  233 |     ]);
  234 | 
  235 |     const guestToken = await page.evaluate(() =>
  236 |       sessionStorage.getItem("guest_token"),
  237 |     );
  238 |     expect(guestToken).toBe(GUEST_ID);
  239 |   });
  240 | 
  241 |   // ── GU-17: redirect_to 없음 → /share/{sessionId}로 이동 ─────────────
  242 |   test("GU-17: redirect_to 없을 때 세션 클릭 시 /share/{sessionId}로 이동한다", async ({
  243 |     page,
  244 |   }) => {
  245 |     await verifyAndReachStep2(page);
  246 | 
  247 |     await Promise.all([
  248 |       page.waitForURL(/\/share\//, { timeout: 8000 }),
  249 |       page.locator("text=사랑일까").click(),
  250 |     ]);
  251 | 
  252 |     expect(page.url()).toContain(`/share/${SESSION_1_ID}`);
  253 |   });
  254 | 
  255 |   // ── GU-18: redirect_to 있음 → redirect_to URL로 이동 ────────────────
  256 |   test("GU-18: sessionStorage에 redirect_to가 있을 때 세션 클릭 시 해당 URL로 이동하고 redirect_to가 삭제된다", async ({
  257 |     page,
  258 |   }) => {
  259 |     await verifyAndReachStep2(page);
  260 | 
  261 |     const REDIRECT_TARGET = `http://localhost:3000/share/${SESSION_1_ID}`;
  262 |     await page.evaluate((url) => {
  263 |       sessionStorage.setItem("redirect_to", url);
  264 |     }, REDIRECT_TARGET);
  265 | 
  266 |     // /share/ 이동 후 guest_id 감지로 /result/까지 체인 리다이렉트 발생
  267 |     // 최종 안정 URL 대기 후 sessionStorage 확인
  268 |     await Promise.all([
  269 |       page.waitForURL(/\/result\//, { timeout: 10000 }),
  270 |       page.locator("text=사랑일까").click(),
  271 |     ]);
  272 | 
  273 |     // redirect_to 삭제 확인 (handleSelectSession에서 removeItem 호출)
  274 |     const remaining = await page.evaluate(() =>
  275 |       sessionStorage.getItem("redirect_to"),
  276 |     );
  277 |     expect(remaining).toBeNull();
  278 |   });
  279 | 
  280 |   // ── GU-19: "다른 콘텐츠 보기" → 홈(/)으로 이동 ─────────────────────
  281 |   test("GU-19: '다른 콘텐츠 보기' 클릭 시 홈(/)으로 이동한다", async ({
  282 |     page,
  283 |   }) => {
  284 |     await verifyAndReachStep2(page);
  285 | 
  286 |     await Promise.all([
  287 |       page.waitForURL(/\/$/, { timeout: 5000 }),
  288 |       page.getByRole("button", { name: "다른 콘텐츠 보기" }).click(),
  289 |     ]);
  290 | 
  291 |     expect(page.url()).toMatch(/localhost:3000\/$/);
  292 |   });
  293 | 
  294 |   // ── GU-20: "로그아웃" → Step 1 복귀 + sessionStorage 삭제 ───────────
  295 |   test("GU-20: '로그아웃' 클릭 시 Step 1로 복귀하고 sessionStorage가 정리된다", async ({
  296 |     page,
  297 |   }) => {
  298 |     await verifyAndReachStep2(page);
  299 | 
  300 |     await page.getByRole("button", { name: "로그아웃" }).click();
  301 | 
  302 |     // 300ms fade 후 Step 1 렌더링 대기
  303 |     await expect(page.locator('input[type="tel"]')).toBeVisible({
  304 |       timeout: 3000,
  305 |     });
  306 | 
  307 |     // sessionStorage 정리 확인
  308 |     const guestId = await page.evaluate(() =>
  309 |       sessionStorage.getItem("guest_id"),
  310 |     );
  311 |     const guestSessions = await page.evaluate(() =>
  312 |       sessionStorage.getItem("guest_sessions"),
  313 |     );
  314 |     const guestToken = await page.evaluate(() =>
  315 |       sessionStorage.getItem("guest_token"),
  316 |     );
  317 | 
  318 |     expect(guestId).toBeNull();
  319 |     expect(guestSessions).toBeNull();
  320 |     expect(guestToken).toBeNull();
  321 |   });
  322 | 
  323 |   // ── GU-21: sessionStorage 복원 → Step 2 직행 ────────────────────────
  324 |   test("GU-21: sessionStorage에 guest_id·guest_sessions가 있으면 바로 Step 2로 이동한다", async ({
  325 |     page,
  326 |   }) => {
> 327 |     await page.goto("/");
      |                ^ Error: page.goto: NS_ERROR_CONNECTION_REFUSED
  328 | 
  329 |     // 이미 인증된 상태 시뮬레이션
  330 |     const mockSessions = [
  331 |       {
  332 |         session_id: SESSION_1_ID,
  333 |         content_id: "love-1",
  334 |         content_title: "사랑일까,\n집착일까?",
  335 |         category: "love",
  336 |         created_at: "2026-05-04T10:00:00Z",
  337 |         view_state: "장면 2까지 열람",
  338 |       },
  339 |     ];
  340 |     await page.evaluate(
  341 |       ({ guestId, sessions }) => {
  342 |         sessionStorage.setItem("guest_id", guestId);
  343 |         sessionStorage.setItem("guest_sessions", JSON.stringify(sessions));
  344 |       },
  345 |       { guestId: GUEST_ID, sessions: mockSessions },
  346 |     );
  347 | 
  348 |     await page.goto("/guest");
  349 | 
  350 |     // Step 1 없이 바로 Step 2가 보여야 함
  351 |     await expect(page.locator("h2")).toContainText("지난 기록", {
  352 |       timeout: 5000,
  353 |     });
  354 |     await expect(page.locator('input[type="tel"]')).not.toBeVisible();
  355 |   });
  356 | });
  357 | 
```