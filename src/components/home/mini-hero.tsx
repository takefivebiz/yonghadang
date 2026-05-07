/**
 * 메인 페이지 상단 히어로 섹션
 * PRD 5.2: 작은 서브텍스트 + 큰 헤드라인 구조
 */
const MiniHero = () => {
  return (
    <section className="px-4 pb-14 pt-13 text-center sm:pb-12 sm:pt-20">
      <h1 className="mt-1 text-2xl font-bold leading-snug tracking-tight text-highlight sm:text-[2.6rem] sm:leading-tight">
        {/* 네온 글로우 — City Pop 간판 느낌 */}
        <span
          className="text-accent"
          style={{ textShadow: "0 0 10px rgba(209, 109, 172, 0.324)" }}
        >
          설명되지 않던 감정
        </span>
        이<br />
        보이기 시작할 거야
      </h1>
      {/* 레트로 구분선: 점 — 선 — 점 */}
      <div className="mx-auto mt-6 flex items-center justify-center gap-3">
        <div className="h-px w-10 bg-surface" />
        <div className="h-1 w-1 rounded-full bg-accent/40" />
        <div className="h-px w-10 bg-surface" />
      </div>
    </section>
  );
};

export default MiniHero;
