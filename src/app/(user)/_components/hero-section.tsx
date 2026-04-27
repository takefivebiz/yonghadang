"use client";

import { useRouter } from "next/navigation";

const AnalysisType = {
  SELF: "self",
  OTHER: "other",
} as const;

export const HeroSection = () => {
  const router = useRouter();

  const handleSelectType = (
    type: (typeof AnalysisType)[keyof typeof AnalysisType],
  ) => {
    router.push(`/analyze?type=${type}`);
  };

  return (
    <section className="relative overflow-hidden px-4 py-12 md:py-24">
      {/* 배경 장식 - blur 요소 */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: "#6495ED", opacity: 0.15 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-40 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#E6E6FA", opacity: 0.08 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 right-1/4 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "#A366FF", opacity: 0.1 }}
        aria-hidden="true"
      />

      {/* 네온 라인 장식 - 좌측 */}
      <div
        className="pointer-events-none absolute left-0 top-1/4 h-px w-32 opacity-60"
        style={{
          background:
            "linear-gradient(90deg, transparent, #6495ED, transparent)",
          boxShadow: "0 0 20px #6495ED, 0 0 40px rgba(100, 149, 237, 0.5)",
          animation: "neonPulse 3s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      {/* 네온 라인 장식 - 우측 */}
      <div
        className="pointer-events-none absolute right-0 top-2/3 h-px w-40 opacity-50"
        style={{
          background:
            "linear-gradient(90deg, transparent, #A366FF, transparent)",
          boxShadow: "0 0 20px #A366FF, 0 0 40px rgba(163, 102, 255, 0.4)",
          animation: "neonPulse 4s ease-in-out infinite 0.5s",
        }}
        aria-hidden="true"
      />

      {/* 네온 도트 - 좌상단 */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/3 h-1.5 w-1.5 rounded-full opacity-70"
        style={{
          backgroundColor: "#6495ED",
          boxShadow: "0 0 15px #6495ED, 0 0 30px rgba(100, 149, 237, 0.6)",
          animation: "neonGlow 2.5s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      {/* 네온 도트 - 우하단 */}
      <div
        className="pointer-events-none absolute right-1/3 bottom-1/4 h-1 w-1 rounded-full opacity-60"
        style={{
          backgroundColor: "#A366FF",
          boxShadow: "0 0 12px #A366FF, 0 0 25px rgba(163, 102, 255, 0.5)",
          animation: "neonGlow 3s ease-in-out infinite 0.8s",
        }}
        aria-hidden="true"
      />

      {/* 네온 대각선 - 상단 */}
      <svg
        className="pointer-events-none absolute top-1/4 right-1/3 opacity-50"
        width="200"
        height="100"
        viewBox="0 0 200 100"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="0"
          x2="200"
          y2="100"
          stroke="#6495ED"
          strokeWidth="1"
          style={{
            filter: "drop-shadow(0 0 8px #6495ED)",
            animation: "neonDraw 4s ease-in-out infinite",
          }}
        />
      </svg>

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

        @keyframes neonDraw {
          0%,
          100% {
            stroke-dashoffset: 0;
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>

      {/* 콘텐츠 */}
      <div className="relative z-10 mx-auto max-w-4xl">
        {/* 1️⃣ 메인 카피 섹션 */}
        <div className="mb-12 text-center md:mb-16">
          <h1
            className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl"
            style={{ color: "#F0E6FA" }}
          >
            사람은,
            <br />
            <span
              className="block"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #68d4ff 40%, #ff65ff 60%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              읽힌다.
            </span>
          </h1>

          <p
            className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed md:text-2xl"
            style={{ color: "#D4C5E2" }}
          >
            나도, 저 사람도, 우리 사이도.
          </p>

          <p
            className="mx-auto max-w-2xl text-lg md:text-xl"
            style={{ color: "#B8A8D8" }}
          >
            궁금했던 것들이
            <br />
            <span
              className="block"
              style={{ color: "#F0E6FA", fontWeight: 600 }}
            >
              이제 보일 거야.
            </span>
          </p>
        </div>

        {/* 2️⃣ 선택 UX 섹션 (핵심) */}
        <div className="mb-16 md:mb-24">
          <p
            className="mb-6 text-center text-sm font-medium md:text-base"
            style={{ color: "#B8A8D8" }}
          >
            지금, 뭐가 제일 궁금해?
          </p>

          <div className="grid gap-4 md:grid-cols-2 md:max-w-2xl md:mx-auto">
            {/* [나] 버튼 */}
            <button
              onClick={() => handleSelectType(AnalysisType.SELF)}
              className="group relative overflow-hidden rounded-2xl px-6 py-8 transition-all duration-300 hover:shadow-2xl md:px-8 md:py-10"
              style={{
                border: "1px solid rgba(230, 230, 250, 0.3)",
                background:
                  "linear-gradient(135deg, rgba(163, 102, 255, 0.15), rgba(100, 149, 237, 0.1))",
              }}
            >
              <div className="relative z-10">
                <div
                  className="mb-3 text-3xl font-bold md:text-4xl"
                  style={{ color: "#E6E6FA" }}
                >
                  [나]
                </div>
                <p
                  className="text-sm font-medium md:text-base"
                  style={{ color: "#D4C5E2" }}
                >
                  나는 왜 이럴까?
                </p>
                <p
                  className="mt-2 text-xs md:text-sm"
                  style={{ color: "#9B8DB8" }}
                >
                  내 진짜 마음은 뭘까?
                </p>
              </div>
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(230, 230, 250, 0.2), rgba(163, 102, 255, 0.1))",
                }}
                aria-hidden="true"
              />
            </button>

            {/* [상대] 버튼 */}
            <button
              onClick={() => handleSelectType(AnalysisType.OTHER)}
              className="group relative overflow-hidden rounded-2xl px-6 py-8 transition-all duration-300 hover:shadow-2xl md:px-8 md:py-10"
              style={{
                border: "1px solid rgba(230, 230, 250, 0.3)",
                background:
                  "linear-gradient(135deg, rgba(163, 102, 255, 0.15), rgba(100, 149, 237, 0.1))",
              }}
            >
              <div className="relative z-10">
                <div
                  className="mb-3 text-3xl font-bold md:text-4xl"
                  style={{ color: "#E6E6FA" }}
                >
                  [상대]
                </div>
                <p
                  className="text-sm font-medium md:text-base"
                  style={{ color: "#D4C5E2" }}
                >
                  그 사람, 무슨 생각일까?
                </p>
                <p
                  className="mt-2 text-xs md:text-sm"
                  style={{ color: "#9B8DB8" }}
                >
                  왜 그러는지 이제 보일 거야
                </p>
              </div>
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(163, 102, 255, 0.2), rgba(100, 149, 237, 0.15))",
                }}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* 신뢰 지표 */}
          <p
            className="mt-8 text-center text-xs md:text-sm"
            style={{ color: "rgba(184, 168, 216, 0.6)" }}
          >
            ✓ 무료 · ✓ 3분 완성 · ✓ 해석형 리포트
          </p>
        </div>
      </div>
    </section>
  );
};
