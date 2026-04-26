'use client';

/** 후기 섹션 */
export const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: '내가 미루는 이유가 정확히 뭔지 알게 됐어요. 리포트를 읽으면서 계속 "맞아, 이거야"라고 했어요.',
      author: '김지은',
      category: '연애',
      emoji: '💕',
    },
    {
      quote: '직업 때문에 고민이 많았는데, 내 선택 패턴을 보니 앞으로 뭘 해야 할지 방향이 잡혔어요.',
      author: '박준호',
      category: '진로',
      emoji: '🎯',
    },
    {
      quote: '일반적인 성격 분석인 줄 알았는데, 내 상황을 정확히 읽어서 깜짝 놀랐습니다.',
      author: '이수현',
      category: '감정',
      emoji: '✨',
    },
  ];

  return (
    <section className="px-4 py-12 md:py-32" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="mx-auto max-w-5xl">
        {/* 섹션 제목 */}
        <div className="mb-8 text-center md:mb-16">
          <h2
            className="mb-2 text-2xl font-bold md:mb-4 md:text-4xl"
            style={{ color: '#2D3250' }}
          >
            사람들의 이야기
          </h2>
          <p className="text-xs md:text-base" style={{ color: '#7B6A9B' }}>
            실제로 Corelog를 경험한 사람들의 반응입니다.
          </p>
        </div>

        {/* 후기 카드 */}
        <div className="grid gap-4 md:gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white p-5 md:p-8 shadow-sm transition-all hover:shadow-md"
            >
              {/* 카테고리 배지 */}
              <div className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium md:mb-4 md:text-sm"
                style={{ backgroundColor: 'rgba(196, 181, 212, 0.15)', color: '#C4B5D4' }}>
                {testimonial.emoji} {testimonial.category}
              </div>

              {/* 인용 */}
              <p className="mb-4 text-xs leading-relaxed md:mb-6 md:text-base text-foreground/80">
                "{testimonial.quote}"
              </p>

              {/* 저자 */}
              <p className="text-sm font-semibold md:text-base" style={{ color: '#2D3250' }}>
                {testimonial.author}
              </p>
            </div>
          ))}
        </div>

        {/* 하단 CTA */}
        <div className="mt-8 text-center md:mt-16">
          <p className="mb-3 text-xs md:mb-4 md:text-lg text-foreground/70">
            당신의 이야기도 들려주세요
          </p>
          <a
            href="/analyze"
            className="inline-block rounded-full px-6 py-2.5 text-sm font-semibold md:px-8 md:py-3 md:text-base text-white transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: '#2D3250' }}
          >
            지금 시작하기 →
          </a>
        </div>
      </div>
    </section>
  );
};
