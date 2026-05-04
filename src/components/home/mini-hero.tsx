/**
 * 메인 페이지 상단 히어로 섹션
 * PRD 5.2: 작은 서브텍스트 + 큰 헤드라인 구조
 */
const MiniHero = () => {
  return (
    <section className="px-4 pb-10 pt-12 text-center sm:pb-12 sm:pt-16">
      <p className="text-xs tracking-widest text-highlight/40 sm:text-sm">
        사주 ∙ MBTI처럼 끼워넣은 나말고,
      </p>
      <h1 className="mt-3 text-2xl font-bold leading-snug text-highlight sm:text-[2.5rem] sm:leading-tight">
        베일에 가려진{" "}
        <span className="text-accent">진짜 나</span>를 찾다
      </h1>
      <div className="mx-auto mt-8 h-px w-12 bg-surface" />
    </section>
  )
}

export default MiniHero
