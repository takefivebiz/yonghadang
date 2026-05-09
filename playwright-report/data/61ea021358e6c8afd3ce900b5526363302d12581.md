# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analyze-page.spec.ts >> A: 분석 입력 페이지 (/analyze/[session_id]) >> A-15: 보정 질문의 선택 옵션이 렌더링
- Location: tests/e2e/analyze-page.spec.ts:186:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - navigation [ref=e4]:
        - link "VEIL" [ref=e5]:
          - /url: /
        - generic [ref=e6]:
          - link "비회원 조회" [ref=e7]:
            - /url: /guest
          - link "로그인" [ref=e9]:
            - /url: /auth
    - main [ref=e10]:
      - generic [ref=e36]:
        - generic [ref=e37]:
          - paragraph [ref=e38]: 질문 1
          - heading "이런 행동이 얼마나 자주 일어나?" [level=1] [ref=e39]
          - paragraph [ref=e40]: 하나를 선택해줘
        - generic [ref=e41]:
          - button "거의 매일" [ref=e42]
          - button "주 3-4회 이상" [ref=e43]
          - button "주 1-2회 정도" [ref=e44]
          - button "가끔씩" [ref=e45]
        - button "다음 →" [disabled] [ref=e47]
    - contentinfo [ref=e48]:
      - generic [ref=e49]:
        - generic [ref=e50]:
          - paragraph [ref=e51]: "VEIL | 대표자: 홍길동"
          - paragraph [ref=e52]: "사업자등록번호 : 00-00-00000"
          - paragraph [ref=e53]: "통신판매업신고: 제2026-서울-0000호"
          - paragraph [ref=e54]: 서울특별시 땡땡구 땡땡동 땡떙로 77
        - generic [ref=e55]:
          - button "이용약관" [ref=e56]
          - button "개인정보처리방침" [ref=e57]
          - button "문의하기" [ref=e58]
        - paragraph [ref=e59]: © 2026 VEIL. All rights reserved.
  - button "Open Next.js Dev Tools" [ref=e65] [cursor=pointer]:
    - img [ref=e66]
  - alert [ref=e71]
```

# Test source

```ts
  104 | 
  105 |   // ── A-11 ~ A-13: 반응 버블 상호작용 ──────────────────────────────────
  106 |   test("A-11: 반응 버블에 여러 메시지가 표시", async ({ page }) => {
  107 |     const textarea = page.locator('textarea');
  108 |     const submitButton = page.locator('button:has-text("이어서")');
  109 | 
  110 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  111 |     await submitButton.click();
  112 | 
  113 |     // 첫 번째 메시지 확인
  114 |     const firstMessage = page.locator('text="고마워"');
  115 |     await expect(firstMessage).toBeVisible({ timeout: 1000 });
  116 |   });
  117 | 
  118 |   test("A-12: 반응 버블 자동 진행으로 다음 단계 진입", async ({ page }) => {
  119 |     const textarea = page.locator('textarea');
  120 |     const submitButton = page.locator('button:has-text("이어서")');
  121 | 
  122 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  123 |     await submitButton.click();
  124 | 
  125 |     // 반응 버블이 보이는지 확인
  126 |     await expect(page.locator('text="고마워"')).toBeVisible({ timeout: 1000 });
  127 | 
  128 |     // 자동 진행되거나 클릭 가능한 버튼이 있으면 클릭
  129 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  130 |     if (await continueButton.isVisible({ timeout: 500 })) {
  131 |       await continueButton.click();
  132 |     } else {
  133 |       // 자동 진행인 경우 대기
  134 |       await page.waitForTimeout(3000);
  135 |     }
  136 | 
  137 |     // 보정 질문 화면이 보이는지 확인
  138 |     const correctionQuestion = page.locator('[role="radio"], [role="checkbox"]');
  139 |     await expect(correctionQuestion.first()).toBeVisible({ timeout: 2000 });
  140 |   });
  141 | 
  142 |   test("A-13: 반응 버블 메시지가 명확하고 감정적이지 않음", async ({
  143 |     page,
  144 |   }) => {
  145 |     const textarea = page.locator('textarea');
  146 |     const submitButton = page.locator('button:has-text("이어서")');
  147 | 
  148 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  149 |     await submitButton.click();
  150 | 
  151 |     await expect(page.locator('text="고마워"')).toBeVisible({ timeout: 1000 });
  152 | 
  153 |     // 메시지 내용이 "분석", "진단" 같은 단어를 포함하지 않아야 함
  154 |     const messageText = await page.locator('div').filter({ hasText: /고마워/ }).textContent();
  155 |     expect(messageText).not.toMatch(/분석|진단|테스트|검사/);
  156 |   });
  157 | 
  158 |   // ── A-14 ~ A-17: 보정 질문 렌더링 ────────────────────────────────────
  159 |   test("A-14: 보정 질문이 한 화면에 하나씩 표시", async ({ page }) => {
  160 |     const textarea = page.locator('textarea');
  161 |     const submitButton = page.locator('button:has-text("이어서")');
  162 | 
  163 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  164 |     await submitButton.click();
  165 | 
  166 |     // 반응 버블이 보이는지 확인
  167 |     await expect(page.locator('text="고마워"')).toBeVisible({ timeout: 1000 });
  168 | 
  169 |     // 다음 단계로 진행
  170 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  171 |     if (await continueButton.isVisible({ timeout: 500 })) {
  172 |       await continueButton.click();
  173 |     } else {
  174 |       await page.waitForTimeout(3000);
  175 |     }
  176 | 
  177 |     // 보정 질문 요소가 보이는지 확인
  178 |     const questionText = page.locator('text=/행동|빈도|기간|반응|영향|경험/i').first();
  179 |     await expect(questionText).toBeVisible({ timeout: 2000 });
  180 | 
  181 |     // 선택 옵션이 있는지 확인
  182 |     const option = page.locator('button[role="radio"], button[role="checkbox"]');
  183 |     await expect(option.first()).toBeVisible({ timeout: 2000 });
  184 |   });
  185 | 
  186 |   test("A-15: 보정 질문의 선택 옵션이 렌더링", async ({ page }) => {
  187 |     const textarea = page.locator('textarea');
  188 |     const submitButton = page.locator('button:has-text("이어서")');
  189 | 
  190 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  191 |     await submitButton.click();
  192 | 
  193 |     await page.waitForTimeout(1000);
  194 | 
  195 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  196 |     if (await continueButton.isVisible({ timeout: 500 })) {
  197 |       await continueButton.click();
  198 |     } else {
  199 |       await page.waitForTimeout(3000);
  200 |     }
  201 | 
  202 |     // 선택 옵션 확인
  203 |     const options = page.locator('button[role="radio"], button[role="checkbox"]');
> 204 |     expect(await options.count()).toBeGreaterThan(0);
      |                                   ^ Error: expect(received).toBeGreaterThan(expected)
  205 |   });
  206 | 
  207 |   test("A-16: 질문 텍스트가 명확하게 표시", async ({ page }) => {
  208 |     const textarea = page.locator('textarea');
  209 |     const submitButton = page.locator('button:has-text("이어서")');
  210 | 
  211 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  212 |     await submitButton.click();
  213 | 
  214 |     await page.waitForTimeout(1000);
  215 | 
  216 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  217 |     if (await continueButton.isVisible({ timeout: 500 })) {
  218 |       await continueButton.click();
  219 |     } else {
  220 |       await page.waitForTimeout(3000);
  221 |     }
  222 | 
  223 |     // 질문 텍스트 확인
  224 |     const questionText = page.locator('text=/행동|빈도|기간|반응|영향|경험/i');
  225 |     await expect(questionText.first()).toBeVisible({ timeout: 2000 });
  226 |   });
  227 | 
  228 |   test("A-17: 다음 버튼이 선택 후에 활성화됨", async ({ page }) => {
  229 |     const textarea = page.locator('textarea');
  230 |     const submitButton = page.locator('button:has-text("이어서")');
  231 | 
  232 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  233 |     await submitButton.click();
  234 | 
  235 |     await page.waitForTimeout(1000);
  236 | 
  237 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  238 |     if (await continueButton.isVisible({ timeout: 500 })) {
  239 |       await continueButton.click();
  240 |     } else {
  241 |       await page.waitForTimeout(3000);
  242 |     }
  243 | 
  244 |     // 첫 번째 선택지 클릭
  245 |     const option = page.locator('button[role="radio"], button[role="checkbox"]');
  246 |     if (await option.first().isVisible({ timeout: 2000 })) {
  247 |       await option.first().click();
  248 |       await page.waitForTimeout(300);
  249 |     }
  250 |   });
  251 | 
  252 |   // ── A-18 ~ A-20: 선택지 상호작용 ────────────────────────────────────
  253 |   test("A-18: 보정 질문 선택지를 클릭하여 선택 가능", async ({ page }) => {
  254 |     const textarea = page.locator('textarea');
  255 |     const submitButton = page.locator('button:has-text("이어서")');
  256 | 
  257 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  258 |     await submitButton.click();
  259 | 
  260 |     await page.waitForTimeout(1000);
  261 | 
  262 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  263 |     if (await continueButton.isVisible({ timeout: 500 })) {
  264 |       await continueButton.click();
  265 |     } else {
  266 |       await page.waitForTimeout(3000);
  267 |     }
  268 | 
  269 |     // 첫 번째 선택지 클릭
  270 |     const option = page.locator('button[role="radio"], button[role="checkbox"]');
  271 |     await expect(option.first()).toBeVisible({ timeout: 2000 });
  272 |     await option.first().click();
  273 |   });
  274 | 
  275 |   test("A-19: 선택 후 다음 질문으로 자연스럽게 전환", async ({ page }) => {
  276 |     const textarea = page.locator('textarea');
  277 |     const submitButton = page.locator('button:has-text("이어서")');
  278 | 
  279 |     await textarea.fill("자꾸 상대가 의심되고, 휴대폰을 확인하게 돼");
  280 |     await submitButton.click();
  281 | 
  282 |     await page.waitForTimeout(1000);
  283 | 
  284 |     const continueButton = page.locator('button').filter({ hasText: /계속|다음/ });
  285 |     if (await continueButton.isVisible({ timeout: 500 })) {
  286 |       await continueButton.click();
  287 |     } else {
  288 |       await page.waitForTimeout(3000);
  289 |     }
  290 | 
  291 |     // 첫 번째 선택지 클릭
  292 |     const option = page.locator('button[role="radio"], button[role="checkbox"]');
  293 |     if (await option.first().isVisible({ timeout: 2000 })) {
  294 |       await option.first().click();
  295 |       await page.waitForTimeout(500);
  296 |     }
  297 |   });
  298 | 
  299 |   test("A-20: 복수 선택이 가능한 질문에서 여러 옵션 선택 가능", async ({
  300 |     page,
  301 |   }) => {
  302 |     const textarea = page.locator('textarea');
  303 |     const submitButton = page.locator('button:has-text("이어서")');
  304 | 
```