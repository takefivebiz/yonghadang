# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: my-page.spec.ts >> M: 마이페이지 (/my-page) >> M-13: '로그아웃' 클릭 시 localStorage가 삭제되고 홈으로 이동한다
- Location: tests/e2e/my-page.spec.ts:204:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 5000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
  navigated to "http://localhost:3000/"
  "networkidle" event fired
============================================================
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - navigation [ref=e4]:
      - link "VEIL" [ref=e5] [cursor=pointer]:
        - /url: /
      - generic [ref=e6]:
        - link "비회원 조회" [ref=e7] [cursor=pointer]:
          - /url: /guest
        - link "로그인" [ref=e9] [cursor=pointer]:
          - /url: /auth
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
```

# Test source

```ts
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
  187 |     await page.goto("/");
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
> 215 |       page.waitForURL(/\/$/, { timeout: 5000 }),
      |            ^ TimeoutError: page.waitForURL: Timeout 5000ms exceeded.
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