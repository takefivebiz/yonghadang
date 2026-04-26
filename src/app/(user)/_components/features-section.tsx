'use client';

import { COLORS } from '@/lib/colors';

/** 핵심 기능 섹션 */
export const FeaturesSection = () => {
  const features = [
    {
      icon: '🧠',
      title: 'AI가 읽는 선택 구조',
      description:
        '왜 항상 비슷한 상황에서 같은 선택을 할까? 왜 관계에서 같은 패턴이 반복될까? 그 이유를 명확하게 알 수 있어.',
      color: '#7B6A9B',
    },
    {
      icon: '⚡',
      title: '3분 안에 완성',
      description:
        '6개 질문, 3분이면 충분해. 길고 지루한 검사는 없고, 집중력이 필요한 만큼만 시간 써.',
      color: '#F7A278',
    },
    {
      icon: '📊',
      title: '당신만의 리포트',
      description:
        '일반적인 해석이 아니라 "넌 왜 이래"라는 걸 정확히 보여줘. 마치 옆에서 누가 너를 읽어준 기분.',
      color: '#C4B5D4',
    },
  ];

  return (
    <section
      className="px-4 py-12 md:py-32"
      style={{ backgroundColor: COLORS.background.page }}
    >
      <div className="mx-auto max-w-5xl">
        {/* 섹션 제목 */}
        <div className="mb-8 text-center md:mb-16">
          <h2
            className="mb-2 text-2xl font-bold md:mb-4 md:text-4xl"
            style={{ color: COLORS.text.primary }}
          >
            Corelog만의 특징
          </h2>
          <p className="text-xs md:text-base" style={{ color: COLORS.text.muted }}>
            검사처럼 느껴지지 않으면서도 높은 해석 밀도를 가진 분석
          </p>
        </div>

        {/* 기능 카드 */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border p-6 md:p-8 transition-all active:scale-[0.98]"
              style={{
                borderColor: feature.color,
                backgroundColor: COLORS.background.card,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 16px 32px ${feature.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* 배경 그라디언트 */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-5"
                style={{ backgroundColor: feature.color }}
              />

              <div className="relative z-10">
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-3xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="mb-2 text-base font-semibold md:mb-3 md:text-lg"
                  style={{ color: COLORS.text.primary }}
                >
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed md:text-sm" style={{ color: COLORS.text.muted }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
