"use client";

/**
 * 신뢰 섹션
 * 배경 제거 - 전체 그라데이션과 연결
 */
export const TrustSection = () => {
  const samples = [
    {
      id: 1,
      title: "나의 선택 구조",
      content:
        "넌 확신이 없을 때 결정을 미루는 쪽이야. 그리고 그 과정에서 불안감을 느껴.",
      color: "#E6E6FA",
    },
    {
      id: 2,
      title: "상대의 행동 패턴",
      content:
        "그 사람은 자신의 감정을 직접 드러내지 않는 경향이 있어. 대신 행동으로 보여줘.",
      color: "#6495ED",
    },
    {
      id: 3,
      title: "우리 사이의 구조",
      content:
        "너희 사이에서 반복되는 패턴은 '기대와 실망'이야. 한쪽이 먼저 가까워지면, 다른 쪽은 멀어지는 식.",
      color: "#B8A8D8",
    },
  ];

  return (
    <section className="relative overflow-hidden px-4 py-16 md:py-24">
      {/* 배경 장식 - blur 요소 */}
      <div
        className="pointer-events-none absolute top-1/3 left-0 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: "#6495ED", opacity: 0.1 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#A366FF", opacity: 0.12 }}
        aria-hidden="true"
      />

      {/* 네온 라인 - 상단 좌측 */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/4 h-px w-40 opacity-50"
        style={{
          background:
            "linear-gradient(90deg, transparent, #6495ED, transparent)",
          boxShadow: "0 0 15px #6495ED, 0 0 30px rgba(100, 149, 237, 0.4)",
          animation: "neonPulse 4s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      {/* 네온 라인 - 하단 우측 */}
      <div
        className="pointer-events-none absolute right-1/3 bottom-1/3 h-px w-32 opacity-50"
        style={{
          background:
            "linear-gradient(90deg, transparent, #A366FF, transparent)",
          boxShadow: "0 0 15px #A366FF, 0 0 30px rgba(163, 102, 255, 0.4)",
          animation: "neonPulse 3.5s ease-in-out infinite 0.6s",
        }}
        aria-hidden="true"
      />

      {/* 네온 도트 - 좌측 */}
      <div
        className="pointer-events-none absolute left-1/3 top-2/3 h-1.5 w-1.5 rounded-full opacity-60"
        style={{
          backgroundColor: "#6495ED",
          boxShadow: "0 0 12px #6495ED, 0 0 25px rgba(100, 149, 237, 0.5)",
          animation: "neonGlow 2.5s ease-in-out infinite 0.3s",
        }}
        aria-hidden="true"
      />

      {/* 네온 도트 - 우측 */}
      <div
        className="pointer-events-none absolute right-1/4 top-1/4 h-1 w-1 rounded-full opacity-50"
        style={{
          backgroundColor: "#A366FF",
          boxShadow: "0 0 12px #A366FF, 0 0 25px rgba(163, 102, 255, 0.5)",
          animation: "neonGlow 3s ease-in-out infinite 0.8s",
        }}
        aria-hidden="true"
      />

      <style jsx>{`
        @keyframes neonPulse {
          0%,
          100% {
            opacity: 0.4;
            filter: drop-shadow(0 0 10px currentColor);
          }
          50% {
            opacity: 0.8;
            filter: drop-shadow(0 0 20px currentColor);
          }
        }

        @keyframes neonGlow {
          0%,
          100% {
            opacity: 0.5;
            box-shadow:
              0 0 10px currentColor,
              0 0 20px rgba(100, 149, 237, 0.4);
          }
          50% {
            opacity: 0.9;
            box-shadow:
              0 0 20px currentColor,
              0 0 40px rgba(100, 149, 237, 0.7);
          }
        }
      `}</style>

      {/* 콘텐츠 */}
      <div className="relative z-10 mx-auto max-w-5xl">
        {/* 제목 */}
        <div className="mb-12 text-center md:mb-16">
          <h2
            className="text-4xl font-bold md:text-5xl"
            style={{ color: "#F0E6FA" }}
          >
            이렇게까지 보인다
          </h2>
          <p className="mt-3 text-sm md:text-base" style={{ color: "#B8A8D8" }}>
            리포트는 단순한 설명이 아니라, 당신의 구조를 직접 보여줘
          </p>
        </div>

        {/* 샘플 카드들 */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {samples.map((sample) => (
            <div
              key={sample.id}
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: `linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))`,
                border: `1px solid rgba(${sample.color.replace("#", "")}, 0.25)`,
                backdropFilter: "blur(10px)",
              }}
            >
              {/* 제목 */}
              <div
                className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold md:text-sm"
                style={{
                  backgroundColor: `${sample.color}20`,
                  color: sample.color,
                }}
              >
                {sample.title}
              </div>

              {/* 내용 */}
              <p className="leading-relaxed" style={{ color: "#D4C5E2" }}>
                {sample.content}
              </p>

              {/* 더보기 링크 */}
              <p
                className="mt-4 text-xs font-medium"
                style={{ color: sample.color }}
              >
                전체 리포트 보기 →
              </p>
            </div>
          ))}
        </div>

        {/* 추가 설명 */}
        <div
          className="mt-12 rounded-2xl px-6 py-8 md:mt-16 md:px-8 md:py-10"
          style={{
            background:
              "linear-gradient(135deg, rgba(163, 102, 255, 0.15), rgba(100, 149, 237, 0.08))",
            border: "1px solid rgba(230, 230, 250, 0.15)",
          }}
        >
          <p
            className="text-center text-sm leading-relaxed md:text-base"
            style={{ color: "#D4C5E2" }}
          >
            <span style={{ fontWeight: 600, color: "#F0E6FA" }}>
              무료 리포트
            </span>
            로 핵심 구조를 파악하고,{" "}
            <span style={{ fontWeight: 600, color: "#F0E6FA" }}>유료 확장</span>
            으로 더 깊이 있는 해석을 탐색해봐.
          </p>
        </div>
      </div>
    </section>
  );
};
