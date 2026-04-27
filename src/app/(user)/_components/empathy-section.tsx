"use client";

import { useEffect, useState } from "react";

/**
 * 공감 섹션 - 모바일에서 애니메이션 최적화
 */
export const EmpathySection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [enableAnimations, setEnableAnimations] = useState(true);

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnableAnimations(!mobile && !prefersReducedMotion);
  }, []);

  return (
    <section className="relative overflow-hidden px-4 py-16 md:py-24">
      {/* 배경 장식 - 모바일에서는 비활성화 */}
      {!isMobile && (
        <>
          <div
            className="pointer-events-none absolute left-1/4 top-0 h-80 w-80 rounded-full"
            style={{
              backgroundColor: "#6495ED",
              opacity: 0.06,
              filter: enableAnimations ? 'blur(80px)' : 'blur(40px)'
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-1/3 bottom-0 h-96 w-96 rounded-full"
            style={{
              backgroundColor: "#A366FF",
              opacity: 0.05,
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
            className="pointer-events-none absolute left-0 top-1/3 h-px w-24 opacity-40 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, #A366FF, transparent)",
              boxShadow: "0 0 12px #A366FF",
              animation: "neonPulse 3.5s ease-in-out infinite",
            }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute right-0 top-2/3 h-px w-32 opacity-30 hidden md:block"
            style={{
              background:
                "linear-gradient(90deg, transparent, #6495ED, transparent)",
              boxShadow: "0 0 12px #6495ED",
              animation: "neonPulse 3s ease-in-out infinite 0.7s",
            }}
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute right-1/4 top-1/2 h-1 w-1 rounded-full opacity-40 hidden md:block"
            style={{
              backgroundColor: "#A366FF",
              boxShadow: "0 0 8px #A366FF",
              animation: "neonGlow 2.8s ease-in-out infinite",
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
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="space-y-8 text-center md:space-y-10">
          {/* 질문들 */}
          <div>
            <p
              className="text-2xl font-medium leading-relaxed md:text-3xl"
              style={{ color: "#F0E6FA" }}
            >
              &quot;쟤는 무슨 생각일까?&quot;
            </p>
          </div>

          <div
            className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            style={{ opacity: 0.4 }}
          />

          <div>
            <p
              className="text-2xl font-medium leading-relaxed md:text-3xl"
              style={{ color: "#F0E6FA" }}
            >
              &quot;우리는 왜 자꾸 싸우지?&quot;
            </p>
          </div>

          <div
            className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            style={{ opacity: 0.4 }}
          />

          <div>
            <p
              className="text-2xl font-medium leading-relaxed md:text-3xl"
              style={{ color: "#F0E6FA" }}
            >
              &quot;나는 왜 이럴까?&quot;
            </p>
          </div>

          {/* 본문 */}
          <div className="mt-12 md:mt-16">
            <p
              className="mb-4 text-xl font-medium leading-relaxed md:text-2xl"
              style={{ color: "#D4C5E2" }}
            >
              계속 머릿속에 남던 질문들,
            </p>
            <p
              className="text-xl font-semibold leading-relaxed md:text-2xl"
              style={{ color: "#F0E6FA" }}
            >
              이제 이유가 보일 거야.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
