import Link from "next/link";

/**
 * 미니 히어로 섹션 — PRD 6-1.1
 * 서비스 한 줄 소개 및 핵심 CTA 제공. full-screen이 아닌 compact 레이아웃.
 */

/** SSR 안전한 결정론적 파티클 위치 */
const PARTICLES = [
  { top: 15, left: 10, size: 3.5, delay: 0, color: "#C4AED8" },
  { top: 20, left: 82, size: 4, delay: 0.8, color: "#E8D4F0" },
  { top: 60, left: 6, size: 3, delay: 1.4, color: "#D4A5A5" },
  { top: 72, left: 88, size: 3.5, delay: 0.5, color: "#C4AED8" },
  { top: 35, left: 95, size: 3, delay: 2.1, color: "#E8D4F0" },
  { top: 85, left: 30, size: 4, delay: 1.0, color: "#D4A5A5" },
  { top: 10, left: 50, size: 3, delay: 1.7, color: "#C4AED8" },
  { top: 80, left: 65, size: 3.5, delay: 0.3, color: "#E8D4F0" },
];

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-4 pb-14 pt-16 md:pb-20 md:pt-24">
      {/* ── 배경 그래디언트 ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 20%, #EDE0F8 0%, #F5F0E8 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── 배경 블롭 ── */}
      <div
        className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "#E8D4F0", opacity: 0.45 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-16 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "#F5D7E8", opacity: 0.4 }}
        aria-hidden="true"
      />

      {/* ── 파티클 ── */}
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
            opacity: 0.55,
            animationDelay: `${p.delay}s`,
            animationDuration: `${2.8 + p.delay * 0.3}s`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* ── 달 장식 ── */}
      <div
        className="animate-float-slow pointer-events-none absolute right-[8%] top-[12%] select-none text-5xl md:text-6xl"
        style={{ opacity: 0.15, animationDuration: "10s" }}
        aria-hidden="true"
      >
        🌙
      </div>

      {/* ── 메인 콘텐츠 ── */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        {/* 서비스 아이콘 */}
        <div
          className="animate-float mb-5 select-none text-5xl md:text-6xl"
          style={{ animationDuration: "6s" }}
          aria-hidden="true"
        >
          🔮
        </div>

        {/* 태그라인 */}
        <p className="font-display mb-3 text-xs uppercase tracking-[0.35em] text-muted-foreground">
          AI Fortune · 용하당
        </p>

        {/* 서비스 한 줄 소개 */}
        <h1 className="font-display mb-4 text-3xl font-bold leading-tight tracking-tight text-deep-purple md:text-5xl">
          당신의 운명을{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #4A3B5C 0%, #9B68B8 55%, #D4A5A5 100%)",
            }}
          >
            AI가 읽다
          </span>
        </h1>

        {/* 부제 */}
        <p className="mb-7 max-w-sm text-base leading-relaxed text-foreground/65 md:text-lg">
          사주 · MBTI · 타로 · 점성술
          <span className="mt-1 block text-sm text-muted-foreground">
            깊고 정확한 AI 해석으로 나를 이해하는 시간
          </span>
        </p>

        {/* 신뢰 지표 */}
        <p className="text-xs" style={{ color: "rgba(155, 136, 172, 0.65)" }}>
          ✓ 3분 내 결과 · ✓ 데이터 기반 분석 · ✓ 10페이지 이상 상세 보고서
        </p>
      </div>
    </section>
  );
};
