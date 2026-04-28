# Corelog E2E 테스트

Playwright 기반의 End-to-End 자동화 테스트

## 📋 테스트 파일 구조

```
e2e/
├── example.spec.ts                    # 기본 셋업 확인
├── scenario-10-post-payment.spec.ts   # 시나리오 10: 결제 완료 후 재접근
├── fixtures.ts                        # 공용 테스트 유틸리티
└── README.md                          # 이 파일
```

## 🚀 빠른 시작

### 개발 서버 실행 (필수)

```bash
npm run dev
```

### 테스트 실행

**헤드레스 모드 (자동 실행):**
```bash
npm run test:e2e
```

**대화형 UI 모드 (권장):**
```bash
npm run test:e2e:ui
```

**특정 테스트 파일만:**
```bash
npx playwright test e2e/example.spec.ts
npx playwright test e2e/scenario-10-post-payment.spec.ts
```

**단일 테스트만:**
```bash
npx playwright test -g "TypewriterText 애니메이션"
```

**디버그 모드:**
```bash
npm run test:e2e:debug
```

## 🧪 테스트 항목

### Scenario 10: 결제 완료 후 재접근 (Post-Payment Edge Cases)

#### 10-1: TypewriterText 재방문 시 즉시 표시
- ✅ 첫 방문: 애니메이션 실행
- ✅ 재방문(새로고침): `instant=true` → 즉시 표시
- ✅ 다른 탭: localStorage 공유 → 즉시 표시

#### 10-2: 리포트 새로고침 시 스트리밍 재요청 없음
- ✅ 3회 연속 새로고침: ReportStatus 폴링 없음
- ✅ 유료 콘텐츠 localStorage 복원

#### 10-3: 로그아웃 후 접근 제한
- ✅ 회원 리포트: "로그인 필요" 표시
- ✅ 비회원 유료: 30분 토큰 만료 → 본인확인 폼
- ✅ 비회원 무료: 인증 불필요 (URL 공유 가능)

#### 10-4: 크로스 디바이스 접근
- ⚠️ 백엔드 연동 필요 (Supabase Auth 세션 쿠키)

## 🛠️ Fixtures (공용 유틸리티)

```typescript
import { test } from '../e2e/fixtures';

test('내 테스트', async ({ page, cleanStorage, loginAsMember, grantGuestToken }) => {
  // localStorage 초기화
  await cleanStorage();

  // 회원 로그인
  await loginAsMember('user_demo');

  // 비회원 30분 토큰 발급
  await grantGuestToken('sess_demo_self_love');
});
```

## 📊 리포트 확인

테스트 실행 후:

```bash
npx playwright show-report
```

또는 `playwright-report/` 폴더에서 `index.html` 열기

## 🔍 CI/CD 통합

GitHub Actions 설정은 `.github/workflows/` 참조

```yaml
- name: Run Playwright tests
  run: npm run test:e2e
```

## 💡 팁

### 특정 브라우저만 테스트
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### 비디오/스크린샷 보기
실패한 테스트의 아티팩트는 자동으로 `test-results/` 폴더에 저장됨

### 타임아웃 조정
```typescript
test.setTimeout(60000); // 60초로 설정
```

### 대기 조건 커스터마이징
```typescript
await page.waitForSelector('.report-content', { timeout: 5000 });
await page.waitForLoadState('networkidle');
```

## 📚 참고자료

- [Playwright 공식 문서](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [PRD 12.6 테스트 도구 준비](../docs/PRD.md#126-테스트-도구-준비-test-tooling)

## ⚠️ 알려진 제한

- **백엔드 필요**: 크로스 디바이스 테스트는 Supabase Auth 연동 후 가능
- **토스 결제**: 실제 결제 테스트는 토스 샌드박스 환경 필요
- **세션 관리**: localStorage 기반 테스트는 프론트 단계 특화

## 🔧 Troubleshooting

### "localhost:3000 연결 불가"
→ 개발 서버 실행 확인: `npm run dev`

### "브라우저 설치 안 됨"
→ `npx playwright install` 재실행

### "테스트 자꾸 타임아웃"
→ 네트워크 속도 확인, 타임아웃 값 증가

## 📝 테스트 작성 가이드

새로운 테스트 추가 시:

1. 파일명: `scenario-{num}-{name}.spec.ts`
2. fixtures 활용
3. 명확한 테스트 설명 (`test.describe` + `test`)
4. Arrange-Act-Assert 패턴

```typescript
test('명확한 동작 설명', async ({ page }) => {
  // Arrange: 사전 조건
  await page.goto('/path');
  
  // Act: 작업 수행
  await page.click('button');
  
  // Assert: 결과 확인
  await expect(page.locator('text=Success')).toBeVisible();
});
```
