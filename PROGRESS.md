# yonghadang 프로젝트 진행상황

## 프로젝트 정보

- **프로젝트명:** yonghadang (용하당)
- **위치:** `~/Desktop/yonghadang` (`/Users/suyeon/Desktop/yonghadang`)
- **생성일:** 2026-04-15

## 기술 스택

| 항목 | 버전/설정 |
|------|-----------|
| Next.js | 15 (App Router, Turbopack) |
| React | 19 |
| TypeScript | 5.7+ |
| Tailwind CSS | v4 (`@tailwindcss/postcss`) |
| shadcn/ui | new-york 스타일, lucide 아이콘 |
| 경로 alias | `@/*` → `./src/*` |
| 언어 설정 | `lang="ko"` |
| 폰트 | Geist Sans / Geist Mono |

## 생성된 파일 구조

```
yonghadang/
├── package.json            # 의존성 정의
├── next.config.ts          # Next.js 설정
├── tsconfig.json           # TypeScript 설정 (@/* alias)
├── postcss.config.mjs      # Tailwind v4 PostCSS 설정
├── components.json         # shadcn/ui 설정
├── eslint.config.mjs       # ESLint flat config
├── next-env.d.ts           # Next.js 타입 선언
├── .gitignore
├── PROGRESS.md             # 이 파일
└── src/
    ├── app/
    │   ├── globals.css     # Tailwind v4 + shadcn CSS 변수 (라이트/다크)
    │   ├── layout.tsx      # 루트 레이아웃
    │   └── page.tsx        # 메인 페이지 (환영 화면)
    ├── components/
    │   └── ui/             # shadcn 컴포넌트 설치 위치 (비어있음)
    ├── hooks/              # 커스텀 훅 (비어있음)
    └── lib/
        └── utils.ts        # cn() 유틸리티 (clsx + tailwind-merge)
```

## 완료된 작업

- [x] 바탕화면에 yonghadang 폴더 생성
- [x] Context7 MCP로 Next.js / shadcn/ui 최신 문서 참조
- [x] 프로젝트 전체 보일러플레이트 파일 생성
- [x] Tailwind v4 + shadcn/ui CSS 변수 (라이트/다크 테마) 설정
- [x] cn() 유틸리티 함수 작성

## 미완료 작업 (로컬 터미널에서 실행 필요)

```bash
cd ~/Desktop/yonghadang
npm install
npx shadcn@latest init     # components.json 자동 인식됨
npm run dev                 # http://localhost:3000
```

## 다음 단계 제안

- PRD 문서 작성 (현 시점에서는 보류 중)
- 페이지 및 기능 설계
- shadcn/ui 컴포넌트 추가 (`npx shadcn@latest add button` 등)
- 데이터베이스 / 인증 등 백엔드 연동 검토

## 참고

- PRD 문서는 사용자 요청에 따라 아직 생성하지 않음
- 네트워크 제약으로 npm install은 로컬에서 직접 실행 필요
- Claude Code CLI 사용 시 터미널에서 직접 명령 실행 가능
