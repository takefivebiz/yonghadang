'use client';

/** 핵심 기능 섹션 */
export const FeaturesSection = () => {
  const features = [
    {
      icon: '🧠',
      title: 'AI가 읽는 선택 구조',
      description:
        '당신의 답변에서 행동 패턴, 가치 기준, 반복되는 구조를 찾아냅니다. 단순 검사가 아닌 해석입니다.',
    },
    {
      icon: '⚡',
      title: '3분 안에 완성',
      description:
        '6가지 핵심 질문만으로 깊이 있는 분석이 가능합니다. 불필요한 시간 낭비는 없습니다.',
    },
    {
      icon: '📊',
      title: '당신만의 리포트',
      description:
        '일반화된 해석이 아닌 당신의 선택 구조 기반 맞춤형 분석. 마치 누군가 당신을 정확히 읽어준 느낌입니다.',
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
            Corelog만의 특징
          </h2>
          <p className="text-xs md:text-base" style={{ color: '#7B6A9B' }}>
            검사처럼 느껴지지 않으면서도 높은 해석 밀도를 가진 분석
          </p>
        </div>

        {/* 기능 카드 */}
        <div className="grid gap-4 md:gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/30 bg-white p-5 md:p-8 transition-all hover:shadow-lg"
            >
              <div className="mb-3 text-3xl md:text-4xl">{feature.icon}</div>
              <h3
                className="mb-2 text-base font-semibold md:mb-3 md:text-lg"
                style={{ color: '#2D3250' }}
              >
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed md:text-sm text-foreground/70">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
