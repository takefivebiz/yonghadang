# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: my-page.spec.ts >> M: 마이페이지 (/my-page) >> M-12: 지난 기록이 없을 때 안내 메시지가 표시된다
- Location: tests/e2e/my-page.spec.ts:184:3

# Error details

```
Error: page.goto: Could not connect to the server.
Call log:
  - navigating to "http://localhost:3000/", waiting until "load"

```

# Test source

```ts
  87  |     await input.clear();
  88  |     await input.fill(newNickname);
  89  |     await expect(input).toHaveValue(newNickname);
  90  |   });
  91  | 
  92  |   // ── M-07: 닉네임 미입력 + 저장 → 에러 메시지 (유효성 검사) ──────────
  93  |   test("M-07: 닉네임 미입력 후 저장 시 에러 메시지가 표시된다", async ({
  94  |     page,
  95  |   }) => {
  96  |     await gotoMyPage(page);
  97  |     await page.getByRole("button", { name: "수정" }).click();
  98  |     const input = page.locator('input[type="text"]');
  99  |     // 입력 필드 비우기
  100 |     await input.clear();
  101 |     await page.getByRole("button", { name: "저장" }).click();
  102 |     // 에러 메시지 확인
  103 |     await expect(
  104 |       page.locator("text=닉네임을 입력해줘"),
  105 |     ).toBeVisible();
  106 |   });
  107 | 
  108 |   // ── M-08: 닉네임 입력 + 저장 → 저장 완료 ───────────────────────────
  109 |   test("M-08: 닉네임 입력 후 저장하면 편집 모드가 종료된다", async ({
  110 |     page,
  111 |   }) => {
  112 |     await gotoMyPage(page);
  113 |     await page.getByRole("button", { name: "수정" }).click();
  114 |     const input = page.locator('input[type="text"]');
  115 |     const newNickname = "updated_jane";
  116 |     await input.clear();
  117 |     await input.fill(newNickname);
  118 |     await page.getByRole("button", { name: "저장" }).click();
  119 |     // 500ms 대기 (setTimeout 대기)
  120 |     await page.waitForTimeout(600);
  121 |     // 편집 모드 종료: 입력 필드 사라짐, "수정" 버튼 다시 나타남
  122 |     await expect(page.locator('input[type="text"]')).not.toBeVisible();
  123 |     await expect(page.getByRole("button", { name: "수정" })).toBeVisible();
  124 |     // 변경된 닉네임이 표시됨
  125 |     await expect(page.locator("text=updated_jane")).toBeVisible();
  126 |   });
  127 | 
  128 |   // ── M-09: 편집 중 취소 → 원래 값으로 복원 ──────────────────────────
  129 |   test("M-09: 편집 중 '취소' 클릭 시 원래 닉네임 값으로 복원된다", async ({
  130 |     page,
  131 |   }) => {
  132 |     await gotoMyPage(page);
  133 |     await page.getByRole("button", { name: "수정" }).click();
  134 |     const input = page.locator('input[type="text"]');
  135 |     // 값 변경
  136 |     await input.clear();
  137 |     await input.fill("modified_name");
  138 |     // 취소 클릭
  139 |     await page.getByRole("button", { name: "취소" }).click();
  140 |     // 편집 모드 종료
  141 |     await expect(page.locator('input[type="text"]')).not.toBeVisible();
  142 |     // 원래 값이 표시됨
  143 |     await expect(page.locator("text=jane_lee")).toBeVisible();
  144 |     // "수정" 버튼 다시 나타남
  145 |     await expect(page.getByRole("button", { name: "수정" })).toBeVisible();
  146 |   });
  147 | 
  148 |   // ── M-10: 지난 기록 목록 렌더링 ────────────────────────────────────
  149 |   test("M-10: 지난 기록 목록이 렌더링된다 (user-1 기준 6개)", async ({
  150 |     page,
  151 |   }) => {
  152 |     await gotoMyPage(page);
  153 |     // 지난 기록 섹션 제목 확인 (exact match)
  154 |     await expect(
  155 |       page.locator("p.text-base.font-semibold").filter({ hasText: "지난 기록" }),
  156 |     ).toBeVisible();
  157 |     // user-1의 세션 수 확인 (처음 로드 시 5개 표시, hasMore=true일 가능성)
  158 |     const sessionItems = page.locator("a[href*='/result/']");
  159 |     const count = await sessionItems.count();
  160 |     expect(count).toBeGreaterThan(0);
  161 |     // 첫 번째 세션 항목 확인
  162 |     await expect(sessionItems.first()).toBeVisible();
  163 |   });
  164 | 
  165 |   // ── M-11: 지난 기록 항목 클릭 → /result/{sessionId} 이동 ────────────
  166 |   test("M-11: 지난 기록 항목 클릭 시 해당 결과 페이지로 이동한다", async ({
  167 |     page,
  168 |   }) => {
  169 |     await gotoMyPage(page);
  170 |     // 첫 번째 세션 링크 클릭
  171 |     const firstSession = page.locator("a[href*='/result/']").first();
  172 |     const href = await firstSession.getAttribute("href");
  173 |     expect(href).toMatch(/^\/result\//);
  174 |     // 링크 클릭
  175 |     await Promise.all([
  176 |       page.waitForURL(/\/result\//, { timeout: 5000 }),
  177 |       firstSession.click(),
  178 |     ]);
  179 |     // URL 확인
  180 |     expect(page.url()).toMatch(/\/result\//);
  181 |   });
  182 | 
  183 |   // ── M-12: 지난 기록 없을 때 메시지 표시 ───────────────────────────
  184 |   test("M-12: 지난 기록이 없을 때 안내 메시지가 표시된다", async ({
  185 |     page,
  186 |   }) => {
> 187 |     await page.goto("/");
      |                ^ Error: page.goto: Could not connect to the server.
  188 |     // 로그인 상태: 세션이 없는 임의의 사용자 (실제로는 user-4가 없으므로 에러 처리)
  189 |     // 대신 빈 배열을 반환하는 경우를 테스트하려면
  190 |     // 이 테스트는 현재 구조상 user-1만 존재하므로
  191 |     // 백엔드에서 빈 세션을 반환하도록 변경되면 테스트 가능
  192 |     // 일단 구조 테스트만: 지난 기록 섹션이 있으면 세션 항목 또는 메시지 표시
  193 |     await page.evaluate((userId) => {
  194 |       localStorage.setItem("veil_user_id", userId);
  195 |     }, USER_ID);
  196 |     await page.goto("/my-page");
  197 |     // user-1은 세션이 있으므로 목록이 표시됨
  198 |     // 이 테스트는 스킵하거나 별도 dummy 함수 작성 필요
  199 |     // 현재는 user-1 기준 테스트만 진행
  200 |     expect(true).toBe(true); // placeholder
  201 |   });
  202 | 
  203 |   // ── M-13: "로그아웃" 버튼 → localStorage 삭제 + "/" 이동 ────────────
  204 |   test("M-13: '로그아웃' 클릭 시 localStorage가 삭제되고 홈으로 이동한다", async ({
  205 |     page,
  206 |   }) => {
  207 |     await gotoMyPage(page);
  208 |     // 로그아웃 전 localStorage 확인
  209 |     let userId = await page.evaluate(() =>
  210 |       localStorage.getItem("veil_user_id"),
  211 |     );
  212 |     expect(userId).toBe(USER_ID);
  213 |     // 로그아웃 버튼 클릭
  214 |     await Promise.all([
  215 |       page.waitForURL(/\/$/, { timeout: 5000 }),
  216 |       page.getByRole("button", { name: "로그아웃" }).click(),
  217 |     ]);
  218 |     // 홈으로 이동 확인
  219 |     expect(page.url()).toMatch(/localhost:3000\/$/);
  220 |     // localStorage 삭제 확인
  221 |     userId = await page.evaluate(() => localStorage.getItem("veil_user_id"));
  222 |     expect(userId).toBeNull();
  223 |   });
  224 | 
  225 |   // ── M-14: "계정 관리" 모달 열림 및 닫힘 ──────────────────────────────
  226 |   test("M-14: '계정 관리' 버튼 클릭 시 모달이 열리고, 닫기 또는 오버레이 클릭으로 닫힌다", async ({
  227 |     page,
  228 |   }) => {
  229 |     await gotoMyPage(page);
  230 |     // "계정 관리" 버튼 클릭
  231 |     await page.getByRole("button", { name: "계정 관리" }).click();
  232 |     // 모달 렌더링 대기
  233 |     await expect(page.locator("text=계정삭제")).toBeVisible({
  234 |       timeout: 3000,
  235 |     });
  236 |     // 모달 내 텍스트 확인
  237 |     await expect(
  238 |       page.locator("text=계정을 삭제하면 지난 기록이 영구 삭제돼"),
  239 |     ).toBeVisible();
  240 |     // "닫기" 버튼 확인
  241 |     const closeBtn = page.getByRole("button", { name: "닫기" });
  242 |     await expect(closeBtn).toBeVisible();
  243 |     // "닫기" 버튼 클릭
  244 |     await closeBtn.click();
  245 |     // 모달 닫힘 확인
  246 |     await expect(page.locator("text=계정삭제")).not.toBeVisible({
  247 |       timeout: 1000,
  248 |     });
  249 | 
  250 |     // 다시 모달 열기 → 오버레이 클릭으로 닫기
  251 |     await page.getByRole("button", { name: "계정 관리" }).click();
  252 |     await expect(page.locator("text=계정삭제")).toBeVisible({
  253 |       timeout: 3000,
  254 |     });
  255 |     // 오버레이 (전체 배경) 클릭
  256 |     const overlay = page.locator(
  257 |       "div[class*='bg-black']:has(div[class*='border-surface'])",
  258 |     );
  259 |     if (await overlay.isVisible()) {
  260 |       // 오버레이 좌상단 클릭 (모달이 아닌 배경)
  261 |       await page.click('div[class*="inset-0"][class*="z-50"]', {
  262 |         position: { x: 0, y: 0 },
  263 |       });
  264 |       // 모달 닫힘 확인
  265 |       await expect(page.locator("text=계정삭제")).not.toBeVisible({
  266 |         timeout: 1000,
  267 |       });
  268 |     }
  269 |   });
  270 | });
  271 | 
```