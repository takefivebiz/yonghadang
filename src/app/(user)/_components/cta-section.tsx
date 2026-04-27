"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * CTA 섹션 - 모바일에서 애니메이션 최적화
 */
export const CTASection = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [enableAnimations, setEnableAnimations] = useState(true);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnableAnimations(!mobile && !prefersReducedMotion);
  }, []);

  const handleSelfAnalysis = () => {
    router.push("/analyze?type=self");
  };

  const handleOtherAnalysis = () => {
    router.push("/analyze?type=other");
  };

  return (
    <section className="relative overflow-hidden px-4 py-16 md:py-32">
      {/* 배경 장식 - 모바일에서는 비활성화 */}
      {!isMobile && (
        <>
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full"
            style={{
              backgroundColor: "#A366FF",
              opacity: 0.09,
              filter: enableAnimations ? 'blur(80px)' : 'blur(40px)'
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full"
            style={{
              backgroundColor: "#E6E6FA",
              opacity: 0.05,
              filter: enableAnimations ? 'blur(80px)' : 'blur(40px)'
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{
              backgroundColor: "#6495ED",
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
            className="pointer-events-none absolute left-0 top-1/3 h-px w-28 opacity-40 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, #6495ED, transparent)",
              boxShadow: "0 0 15px #6495ED",
              animation: "neonPulse 3.2s ease-in-out infinite",
            }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute right-0 top-2/3 h-px w-36 opacity-30 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, #A366FF, transparent)",
              boxShadow: "0 0 15px #A366FF",
              animation: "neonPulse 3.8s ease-in-out infinite 0.4s",
            }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute left-1/4 top-1/2 h-1.5 w-1.5 rounded-full opacity-40 hidden md:block"
            style={{
              backgroundColor: "#A366FF",
              boxShadow: "0 0 10px #A366FF",
              animation: "neonGlow 2.2s ease-in-out infinite",
            }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute right-1/4 top-1/3 h-1 w-1 rounded-full opacity-30 hidden md:block"
            style={{
              backgroundColor: "#6495ED",
              boxShadow: "0 0 10px #6495ED",
              animation: "neonGlow 3.2s ease-in-out infinite 0.9s",
            }}
            aria-hidden="true"
          />

          <svg
            className="pointer-events-none absolute top-1/4 right-1/4 opacity-30 hidden md:block"
            width="150"
            height="150"
            viewBox="0 0 150 150"
            aria-hidden="true"
          >
            <line
              x1="0"
              y1="150"
              x2="150"
              y2="0"
              stroke="#A366FF"
              strokeWidth="1"
              style={{
                filter: "drop-shadow(0 0 6px #A366FF)",
                animation: "neonDraw 4.5s ease-in-out infinite",
              }}
            />
          </svg>
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

        @keyframes neonDraw {
          0%,
          100% {
            stroke-dashoffset: 0;
            opacity: 0.2;
          }
          50% {
            opacity: 0.5;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
          }
        }
      `}</style>

      {/* 콘텐츠 */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2
          className="mb-6 text-4xl font-bold md:text-5xl"
          style={{ color: "#F0E6FA" }}
        >
          이제, 직접 확인해봐
        </h2>

        <p
          className="mb-10 text-base leading-relaxed md:text-lg whitespace-pre-line"
          style={{ color: "#D4C5E2" }}
        >
          3분이면 충분해.
          생각보다 많은 게 보일 거야
        </p>

        {/* 초기 버튼 선택 */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-center items-center">
          {/* 나 버튼 */}
          <button
            onClick={handleSelfAnalysis}
            className="w-[220px] flex flex-col gap-4 group relative overflow-hidden rounded-3xl px-8 py-6 text-lg font-bold transition-all duration-300 active:scale-95 hover:shadow-2xl"
            style={{
              background: `linear-gradient(135deg, #7B6A9B55 0%, #7B6A9B25 100%)`,
              borderLeft: "5px solid #7B6A9B",
              backdropFilter: "blur(15px)",
              color: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div className="flex items-center gap-3 justify-center">
              <span className="text-4xl">🔍</span>
              <span>나</span>
            </div>
            <p
              className="mt-2 text-xs opacity-80"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              나도 몰랐던 내 진짜 마음은?
            </p>
          </button>

          {/* 상대 버튼 */}
          <button
            onClick={handleOtherAnalysis}
            className="w-[220px] flex flex-col gap-4 group relative overflow-hidden rounded-3xl px-8 py-6 text-lg font-bold transition-all duration-300 active:scale-95 hover:shadow-2xl"
            style={{
              background: `linear-gradient(135deg, #A366FF55 0%, #A366FF25 100%)`,
              borderLeft: "5px solid #A366FF",
              backdropFilter: "blur(15px)",
              color: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div className="flex items-center gap-3 justify-center">
              <span className="text-4xl">👤</span>
              <span>상대</span>
            </div>
            <p
              className="mt-2 text-xs opacity-80"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              그 사람은 무슨 생각일까?
            </p>
          </button>
        </div>

        {/* 부가 텍스트 */}
        <p
          className="mt-8 text-xs md:text-sm"
          style={{ color: "rgba(230, 230, 250, 0.6)" }}
        >
          로그인 없이 바로 시작할 수 있어.
        </p>
      </div>
    </section>
  );
};
