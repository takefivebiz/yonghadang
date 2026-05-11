/**
 * 메인 페이지 상단 히어로 섹션
 * PRD 5.2: 작은 서브텍스트 + 큰 헤드라인 구조
 */
const MiniHero = () => {
  return (
    <section className="px-4 pb-17 pt-13 text-center sm:pb-12 sm:pt-20">
      <h1
        className="
    mt-1
    text-[1.8rem]
    font-semibold
    leading-[1.28]
    tracking-[-0.03em]
    text-highlight
    sm:text-[2.9rem]
    sm:leading-[1.2]
    font-hero
  "
      >
        <span
          className="text-accent"
          style={{
            textShadow: "0 0 10px rgba(209, 109, 172, 0.22)",
          }}
        >
          진짜 너
        </span>
        를 알고 싶다면
      </h1>

      <p
        className="
    mt-3
    text-[1.08rem]
    font-light
    leading-[1.55]
    tracking-[-0.015em]
    text-highlight/88
    sm:text-[1.45rem]
    sm:leading-[1.5]
    font-hero
  "
      >
        지금, 너만의 이야기를 시작해봐
      </p>

      {/* 서브타이틀 */}
      <p
        className="mt-8 text-[11px] tracking-[0.18em] uppercase"
        style={{
          color: "rgba(249, 249, 229, 0.32)",
        }}
      >
        개인화 해석 · 로직 기반 · 3분 완성
      </p>
      {/* 레트로 구분선: 점 — 선 — 점 */}
      <div className="mx-auto mt-10 flex items-center justify-center gap-3">
        <div className="h-px w-10 bg-surface" />
        <div className="h-1 w-1 rounded-full bg-accent/40" />
        <div className="h-px w-10 bg-surface" />
      </div>
    </section>
  );
};

export default MiniHero;
