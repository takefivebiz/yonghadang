'use client';

/** 작동 방식 섹션 */
export const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: '6가지 질문에 답변',
      description: '당신의 상황, 감정, 가치, 행동 패턴을 묻는 질문에 답합니다.',
    },
    {
      number: 2,
      title: 'AI가 당신을 분석',
      description: '당신의 답변 조합에서 선택 구조, 패턴, 성향을 추론합니다.',
    },
    {
      number: 3,
      title: '맞춤형 리포트 확인',
      description: '당신만의 이야기로 쓰인 깊이 있는 분석 리포트를 받습니다.',
    },
  ];

  return (
    <section className="px-4 py-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        {/* 섹션 제목 */}
        <div className="mb-8 text-center md:mb-16">
          <h2
            className="mb-2 text-2xl font-bold md:mb-4 md:text-4xl"
            style={{ color: '#2D3250' }}
          >
            이렇게 진행돼요
          </h2>
          <p className="text-xs md:text-base" style={{ color: '#7B6A9B' }}>
            복잡하지 않습니다. 3단계면 충분합니다.
          </p>
        </div>

        {/* 스텝 */}
        <div className="space-y-6 md:space-y-8">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4 md:gap-8">
              {/* 숫자 */}
              <div className="flex-shrink-0">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white md:h-20 md:w-20 md:text-3xl"
                  style={{ backgroundColor: '#2D3250' }}
                >
                  {step.number}
                </div>
                {/* 선 */}
                {idx < steps.length - 1 && (
                  <div
                    className="ml-6 mt-2 h-12 w-0.5 md:ml-10 md:h-20"
                    style={{ backgroundColor: '#C4B5D4' }}
                  />
                )}
              </div>

              {/* 내용 */}
              <div className="flex flex-col justify-center pb-6 md:pb-8">
                <h3
                  className="mb-1 text-base font-bold md:mb-2 md:text-2xl"
                  style={{ color: '#2D3250' }}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-foreground/70 md:text-lg">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
