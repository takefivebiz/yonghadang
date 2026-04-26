'use client';

import { useRouter } from 'next/navigation';

/** PRD 4: Corelog 디자인 — Warm White + Deep Slate + Soft Coral 팔레트 */
const PARTICLES = [
  { top: 12, left: 8,  size: 3.5, delay: 0,   color: '#C4B5D4' },
  { top: 22, left: 80, size: 4,   delay: 0.8,  color: '#F7A278' },
  { top: 58, left: 5,  size: 3,   delay: 1.4,  color: '#C97B84' },
  { top: 75, left: 90, size: 3.5, delay: 0.5,  color: '#C4B5D4' },
  { top: 38, left: 96, size: 3,   delay: 2.1,  color: '#F7A278' },
  { top: 88, left: 28, size: 4,   delay: 1.0,  color: '#C97B84' },
  { top: 8,  left: 52, size: 3,   delay: 1.7,  color: '#C4B5D4' },
  { top: 82, left: 68, size: 3.5, delay: 0.3,  color: '#F7A278' },
];

/** PRD 6-1: 히어로 섹션 — 제목 + CTA */
export const HeroContent = () => {
  const router = useRouter();

  const handleStartReport = () => {
    router.push('/analyze');
  };

  return (
    <section className="relative min-h-[calc(100vh-64px)] overflow-hidden px-4 pb-16 pt-12 md:pb-24 md:pt-20">
      {/* 배경 그래디언트 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 20%, #EDE0F8 0%, #FAF8F5 75%)',
        }}
        aria-hidden="true"
      />

      {/* 배경 블롭 */}
      <div
        className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: '#F7A278', opacity: 0.15 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-16 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: '#C4B5D4', opacity: 0.25 }}
        aria-hidden="true"
      />

      {/* 파티클 */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="animate-pulse absolute rounded-full"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: 0.45,
            animationDelay: `${p.delay}s`,
            animationDuration: `${2.8 + p.delay * 0.3}s`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center justify-center text-center">
        {/* 태그라인 — PRD 6-1 */}
        <p
          className="mb-4 text-xs uppercase tracking-[0.35em]"
          style={{ color: '#C4B5D4' }}
        >
          AI 자기해석 · Corelog
        </p>

        {/* H1 — PRD 6-1 */}
        <h1
          className="mb-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl"
          style={{ color: '#2D3250' }}
        >
          지금 이 상황,
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #2D3250 0%, #7B6A9B 50%, #F7A278 100%)',
            }}
          >
            왜 이렇게 흘러갈까?
          </span>
        </h1>

        {/* 부제 */}
        <p className="mb-3 max-w-sm text-base leading-relaxed text-foreground/65 md:text-lg">
          연애, 감정, 관계, 진로
          <span className="mt-1 block text-sm text-muted-foreground">
            당신을 분석해 하나의 리포트로 만듭니다
          </span>
        </p>

        {/* 신뢰 지표 */}
        <p className="mb-12 text-xs" style={{ color: 'rgba(196, 181, 212, 0.7)' }}>
          ✦ 무료로 시작 · ✦ 3분 완성 · ✦ 해석형 리포트
        </p>

        {/* 리포트 시작 CTA */}
        <button
          onClick={handleStartReport}
          className="rounded-xl px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]"
          style={{ backgroundColor: '#2D3250' }}
        >
          리포트 시작하기
        </button>
      </div>
    </section>
  );
};
