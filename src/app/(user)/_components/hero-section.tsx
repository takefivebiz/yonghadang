"use client";

import { useRouter } from "next/navigation";

const AnalysisType = {
  SELF: "self",
  OTHER: "other",
  RELATIONSHIP: "relationship",
} as const;

export const HeroSection = () => {
  const router = useRouter();

  const handleSelectType = (type: (typeof AnalysisType)[keyof typeof AnalysisType]) => {
    router.push(`/analyze?type=${type}`);
  };

  return (
    <section className="relative overflow-hidden px-4 py-12 md:py-24">
      {/* 배경 장식만 - 배경색 제거 */}
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

      {/* 콘텐츠 */}
      <div className="relative z-10 mx-auto max-w-4xl">
        {/* 1️⃣ 메인 카피 섹션 */}
        <div className="mb-12 text-center md:mb-16">
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl" style={{ color: "#F0E6FA" }}>
            사람은,
            <br />
            <span
              className="block"
              style={{
                backgroundImage: "linear-gradient(90deg, #E6E6FA 0%, #6495ED 50%, #A366FF 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              읽힌다.
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed md:text-2xl" style={{ color: "#D4C5E2" }}>
            나도, 저 사람도, 우리 사이도.
          </p>

          <p className="mx-auto max-w-2xl text-lg md:text-xl" style={{ color: "#B8A8D8" }}>
            궁금했던 것들이
            <br />
            <span className="block" style={{ color: "#F0E6FA", fontWeight: 600 }}>
              이제 보일 거야.
            </span>
          </p>
        </div>

        {/* 2️⃣ 선택 UX 섹션 (핵심) */}
        <div className="mb-16 md:mb-24">
          <p className="mb-6 text-center text-sm font-medium md:text-base" style={{ color: "#B8A8D8" }}>
            지금 제일 궁금한 쪽부터
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {/* [나] 버튼 */}
            <button
              onClick={() => handleSelectType(AnalysisType.SELF)}
              className="group relative overflow-hidden rounded-2xl px-6 py-8 transition-all duration-300 hover:shadow-2xl md:px-8 md:py-10"
              style={{
                border: "1px solid rgba(230, 230, 250, 0.3)",
                background: "linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))",
              }}
            >
              <div className="relative z-10">
                <div className="mb-3 text-3xl font-bold md:text-4xl" style={{ color: "#B8A8D8" }}>
                  [나]
                </div>
                <p className="text-sm font-medium md:text-base" style={{ color: "#D4C5E2" }}>
                  나는 어떤 사람일까?
                </p>
                <p className="mt-2 text-xs md:text-sm" style={{ color: "#9B8DB8" }}>
                  내 선택, 패턴, 가치관 읽기
                </p>
              </div>
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(135deg, rgba(230, 230, 250, 0.2), rgba(163, 102, 255, 0.1))",
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
                background: "linear-gradient(135deg, rgba(163, 102, 255, 0.15), rgba(100, 149, 237, 0.1))",
              }}
            >
              <div className="relative z-10">
                <div className="mb-3 text-3xl font-bold md:text-4xl" style={{ color: "#E6E6FA" }}>
                  [상대]
                </div>
                <p className="text-sm font-medium md:text-base" style={{ color: "#D4C5E2" }}>
                  저 사람은 어떤 사람일까?
                </p>
                <p className="mt-2 text-xs md:text-sm" style={{ color: "#9B8DB8" }}>
                  상대의 행동, 생각, 패턴 읽기
                </p>
              </div>
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(135deg, rgba(163, 102, 255, 0.2), rgba(100, 149, 237, 0.15))",
                }}
                aria-hidden="true"
              />
            </button>

            {/* [관계] 버튼 */}
            <button
              onClick={() => handleSelectType(AnalysisType.RELATIONSHIP)}
              className="group relative overflow-hidden rounded-2xl px-6 py-8 transition-all duration-300 hover:shadow-2xl md:px-8 md:py-10"
              style={{
                border: "1px solid rgba(230, 230, 250, 0.3)",
                background: "linear-gradient(135deg, rgba(75, 0, 130, 0.15), rgba(25, 25, 112, 0.1))",
              }}
            >
              <div className="relative z-10">
                <div className="mb-3 text-3xl font-bold md:text-4xl" style={{ color: "#B8A8D8" }}>
                  [관계]
                </div>
                <p className="text-sm font-medium md:text-base" style={{ color: "#D4C5E2" }}>
                  우리 사이는 어떤 관계일까?
                </p>
                <p className="mt-2 text-xs md:text-sm" style={{ color: "#9B8DB8" }}>
                  관계의 반복 구조, 흐름 읽기
                </p>
              </div>
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(135deg, rgba(230, 230, 250, 0.15), rgba(100, 149, 237, 0.1))",
                }}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* 신뢰 지표 */}
          <p className="mt-8 text-center text-xs md:text-sm" style={{ color: "rgba(184, 168, 216, 0.6)" }}>
            ✓ 무료 · ✓ 3분 완성 · ✓ 해석형 리포트
          </p>
        </div>
      </div>
    </section>
  );
};
