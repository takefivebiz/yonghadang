/**
 * 메인 페이지 상단 히어로 섹션
 * PRD 5.2: 작은 서브텍스트 + 큰 헤드라인 구조
 */
const MiniHero = () => {
  return (
    <section className="px-4 pb-10 pt-14 text-center sm:pb-12 sm:pt-20">
      <p className="text-[10px] tracking-[0.3em] text-highlight/30 sm:text-xs">
        사주 ∙ MBTI처럼 끼워넣은 나 말고,
      </p>
      <h1 className="mt-4 text-2xl font-bold leading-snug tracking-tight text-highlight sm:text-[2.6rem] sm:leading-tight">
        베일에 가려진{" "}
        {/* 네온 글로우 — City Pop 간판 느낌 */}
        <span
          className="text-accent"
          style={{ textShadow: "0 0 24px rgba(209, 109, 172, 0.45)" }}
        >
          진짜 나
        </span>
        를 찾다
      </h1>
      {/* 레트로 구분선: 점 — 선 — 점 */}
      <div className="mx-auto mt-10 flex items-center justify-center gap-3">
        <div className="h-px w-10 bg-surface" />
        <div className="h-1 w-1 rounded-full bg-accent/40" />
        <div className="h-px w-10 bg-surface" />
      </div>
    </section>
  )
}

export default MiniHero
