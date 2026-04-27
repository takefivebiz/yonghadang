"use client";

import { useEffect, useState } from "react";

/**
 * 신뢰 섹션 - 모바일에서 애니메이션 최적화
 */
export const TrustSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [enableAnimations, setEnableAnimations] = useState(true);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnableAnimations(!mobile && !prefersReducedMotion);
  }, []);

  const reviews = [
    {
      id: 1,
      author: "김민정",
      content:
        "정확히 내 상황을 짚어냈어요. 특히 관계 패턴 분석이 신기했습니다. 앞으로 어떻게 해야 할지 생각해볼 수 있게 되었어요.",
      color: "#E6E6FA",
    },
    {
      id: 2,
      author: "박준호",
      content:
        "상대방의 심리를 이렇게 깊게 분석한 적이 없었는데, 매우 도움이 됐습니다. 우리 관계를 다시 보는 관점이 생겼어요.",
      color: "#6495ED",
    },
    {
      id: 3,
      author: "이서윤",
      content:
        "혼자만 그렇게 느끼는 줄 알았는데, 이렇게 패턴으로 분석되니까 너무 명확하네요. 정말 추천합니다!",
      color: "#B8A8D8",
    },
  ];

  return (
    <section className="relative overflow-hidden px-4 py-16 md:py-24">
      {/* 배경 장식 - 모바일에서는 비활성화 */}
      {!isMobile && (
        <>
          <div
            className="pointer-events-none absolute top-1/3 left-0 h-96 w-96 rounded-full"
            style={{
              backgroundColor: "#6495ED",
              opacity: 0.05,
              filter: enableAnimations ? 'blur(80px)' : 'blur(40px)'
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full"
            style={{
              backgroundColor: "#A366FF",
              opacity: 0.06,
              filter: enableAnimations ? 'blur(80px)' : 'blur(40px)'
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* 네온 라인 - 데스크탑에서만 */}
      {enableAnimations && (
        <>
          <div
            className="pointer-events-none absolute left-1/4 top-1/4 h-px w-40 opacity-40 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, #6495ED, transparent)",
              boxShadow: "0 0 12px #6495ED",
              animation: "neonPulse 4s ease-in-out infinite",
            }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute right-1/3 bottom-1/3 h-px w-32 opacity-30 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, #A366FF, transparent)",
              boxShadow: "0 0 12px #A366FF",
              animation: "neonPulse 3.5s ease-in-out infinite 0.6s",
            }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute left-1/3 top-2/3 h-1.5 w-1.5 rounded-full opacity-40 hidden md:block"
            style={{
              backgroundColor: "#6495ED",
              boxShadow: "0 0 8px #6495ED",
              animation: "neonGlow 2.5s ease-in-out infinite 0.3s",
            }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute right-1/4 top-1/4 h-1 w-1 rounded-full opacity-30 hidden md:block"
            style={{
              backgroundColor: "#A366FF",
              boxShadow: "0 0 8px #A366FF",
              animation: "neonGlow 3s ease-in-out infinite 0.8s",
            }}
            aria-hidden="true"
          />
        </>
      )}

      <style jsx>{`
        @keyframes neonPulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes neonGlow {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.7;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
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
            어디까지 보일까?
          </h2>
          <p className="mt-3 text-sm md:text-base" style={{ color: "#B8A8D8" }}>
            먼저 본 사람들의 솔직한 후기
          </p>
        </div>

        {/* 리뷰 카드들 */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: `linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))`,
                border: `1px solid rgba(${review.color.replace("#", "")}, 0.25)`,
                backdropFilter: "blur(10px)",
              }}
            >
              {/* 작성자 이름 */}
              <div
                className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold md:text-sm"
                style={{
                  backgroundColor: `${review.color}20`,
                  color: review.color,
                }}
              >
                {review.author}
              </div>

              {/* 리뷰 내용 */}
              <p className="leading-relaxed" style={{ color: "#D4C5E2" }}>
                {review.content}
              </p>

              {/* 별점 표시 */}
              <p
                className="mt-4 text-xs font-medium"
                style={{ color: review.color }}
              >
                ★★★★★
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
            <span style={{ fontWeight: 600, color: "#F0E6FA" }}>무료 분석</span>
            으로 핵심을 파악하고,{" "}
            <span style={{ fontWeight: 600, color: "#F0E6FA" }}>
              깊이 있는 리포트
            </span>
            로 더 자세한 해석을 받아봐.
          </p>
        </div>
      </div>
    </section>
  );
};
