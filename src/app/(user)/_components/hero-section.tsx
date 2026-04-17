import Link from 'next/link';

/**
 * 파티클 장식 데이터 — SSR 안전하도록 결정론적 위치 사용
 * 라이트 배경에 맞춰 라벤더/더스티로즈 계열 색상 사용
 */
const PARTICLES = [
  { top: 8,  left: 12, size: 4,   delay: 0,   color: '#C4AED8' },
  { top: 14, left: 78, size: 5,   delay: 0.5, color: '#E8D4F0' },
  { top: 22, left: 45, size: 3,   delay: 1.1, color: '#D4A5A5' },
  { top: 30, left: 90, size: 4.5, delay: 1.5, color: '#C4AED8' },
  { top: 42, left: 8,  size: 3.5, delay: 0.8, color: '#E8D4F0' },
  { top: 55, left: 60, size: 3,   delay: 2.0, color: '#D4A5A5' },
  { top: 63, left: 28, size: 5,   delay: 0.3, color: '#C4AED8' },
  { top: 70, left: 85, size: 3.5, delay: 1.2, color: '#E8D4F0' },
  { top: 80, left: 42, size: 3,   delay: 0.7, color: '#D4A5A5' },
  { top: 88, left: 70, size: 4,   delay: 1.8, color: '#C4AED8' },
  { top: 12, left: 55, size: 3,   delay: 2.5, color: '#E8D4F0' },
  { top: 35, left: 20, size: 3.5, delay: 1.1, color: '#D4A5A5' },
  { top: 50, left: 95, size: 3,   delay: 0.4, color: '#C4AED8' },
  { top: 75, left: 5,  size: 4,   delay: 1.9, color: '#E8D4F0' },
  { top: 92, left: 18, size: 3,   delay: 0.6, color: '#D4A5A5' },
  { top: 18, left: 33, size: 3.5, delay: 2.2, color: '#C4AED8' },
  { top: 60, left: 48, size: 3,   delay: 0.9, color: '#E8D4F0' },
  { top: 5,  left: 65, size: 5,   delay: 1.4, color: '#D4A5A5' },
];

export const HeroSection = () => {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-24">
      {/* ── 배경 — 크림 위 소프트 라벤더 글로우 ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 30%, #EDE0F8 0%, #F5F0E8 65%)',
        }}
        aria-hidden="true"
      />

      {/* ── 배경 블롭 — 라벤더 (우상단) ── */}
      <div
        className="pointer-events-none absolute -right-24 -top-16 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: '#E8D4F0', opacity: 0.5 }}
        aria-hidden="true"
      />

      {/* ── 배경 블롭 — 파스텔 핑크 (좌하단) ── */}
      <div
        className="pointer-events-none absolute -bottom-12 -left-24 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: '#F5D7E8', opacity: 0.45 }}
        aria-hidden="true"
      />

      {/* ── 파티클 (라벤더/더스티로즈 소프트 도트) ── */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: 0.6,
            animationDelay: `${p.delay}s`,
            animationDuration: `${2.5 + p.delay * 0.4}s`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* ── 달 장식 (우상단) ── */}
      <div
        className="animate-float-slow pointer-events-none absolute right-[6%] top-[8%] select-none text-7xl md:text-8xl"
        style={{ opacity: 0.18, animationDuration: '9s' }}
        aria-hidden="true"
      >
        🌙
      </div>

      {/* ── 별 장식 (좌하단) ── */}
      <div
        className="animate-float pointer-events-none absolute bottom-[12%] left-[5%] select-none text-4xl"
        style={{ color: '#9B68B8', opacity: 0.25, animationDuration: '7s', animationDelay: '1.5s' }}
        aria-hidden="true"
      >
        ✦
      </div>

      {/* ── 별 장식 (우하단) ── */}
      <div
        className="animate-float pointer-events-none absolute bottom-[22%] right-[5%] select-none text-2xl"
        style={{ color: '#D4A5A5', opacity: 0.25, animationDuration: '6s', animationDelay: '0.8s' }}
        aria-hidden="true"
      >
        ✧
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* 서비스 아이콘 */}
        <div
          className="animate-float mb-6 select-none text-6xl md:text-7xl"
          style={{ animationDuration: '5s' }}
          aria-hidden="true"
        >
          🔮
        </div>

        {/* 상단 태그라인 */}
        <p className="font-display mb-4 text-xs uppercase tracking-[0.35em] text-muted-foreground md:text-sm">
          AI Fortune · 용하당
        </p>

        {/* 메인 헤딩 */}
        <h1 className="font-display mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          <span className="block text-deep-purple">당신의 운명을</span>
          <span
            className="block bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(90deg, #4A3B5C 0%, #9B68B8 50%, #D4A5A5 100%)',
            }}
          >
            AI가 읽다
          </span>
        </h1>

        {/* 서브 헤딩 */}
        <p className="mb-10 max-w-sm text-lg leading-relaxed text-foreground/70 md:max-w-md">
          사주 · MBTI · 타로 · 점성술
          <span className="mt-1 block text-sm text-muted-foreground">
            깊고 정확한 AI 해석으로 나를 이해하는 시간
          </span>
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="#content"
            className="rounded-full px-8 py-4 text-sm font-semibold transition-all duration-300 hover:scale-105 md:text-base"
            style={{
              backgroundColor: '#F5D7E8',
              color: '#4A3B5C',
              boxShadow: '0 4px 28px rgba(245, 215, 232, 0.9), 0 2px 8px rgba(74, 59, 92, 0.12)',
            }}
          >
            나의 운명 보기
          </Link>
          <Link
            href="/auth"
            className="rounded-full px-8 py-4 text-sm transition-all duration-200 md:text-base"
            style={{
              border: '1.5px solid rgba(74, 59, 92, 0.25)',
              color: '#9B88AC',
            }}
          >
            로그인
          </Link>
        </div>

        {/* 신뢰 지표 */}
        <p className="mt-8 text-xs" style={{ color: 'rgba(155, 136, 172, 0.7)' }}>
          ✓ 3분 내 결과 · ✓ 데이터 기반 분석 · ✓ 10페이지 이상 상세 보고서
        </p>
      </div>

      {/* ── 스크롤 인디케이터 ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        style={{ color: '#9B88AC', opacity: 0.5 }}
        aria-hidden="true"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
};
