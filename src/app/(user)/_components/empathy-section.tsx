"use client";

/**
 * 공감 섹션
 * 배경 제거 - 전체 그라데이션과 연결
 */
export const EmpathySection = () => {
  return (
    <section className="relative overflow-hidden px-4 py-16 md:py-24">
      {/* 배경 장식 - blur 요소 */}
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#6495ED", opacity: 0.12 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-1/3 bottom-0 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: "#A366FF", opacity: 0.1 }}
        aria-hidden="true"
      />

      {/* 네온 라인 - 좌측 */}
      <div
        className="pointer-events-none absolute left-0 top-1/3 h-px w-24 opacity-50"
        style={{
          background: "linear-gradient(90deg, transparent, #A366FF, transparent)",
          boxShadow: "0 0 15px #A366FF, 0 0 30px rgba(163, 102, 255, 0.4)",
          animation: "neonPulse 3.5s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      {/* 네온 라인 - 우측 */}
      <div
        className="pointer-events-none absolute right-0 top-2/3 h-px w-32 opacity-50"
        style={{
          background: "linear-gradient(90deg, transparent, #6495ED, transparent)",
          boxShadow: "0 0 15px #6495ED, 0 0 30px rgba(100, 149, 237, 0.4)",
          animation: "neonPulse 3s ease-in-out infinite 0.7s",
        }}
        aria-hidden="true"
      />

      {/* 네온 도트 - 중앙 우측 */}
      <div
        className="pointer-events-none absolute right-1/4 top-1/2 h-1 w-1 rounded-full opacity-60"
        style={{
          backgroundColor: "#A366FF",
          boxShadow: "0 0 12px #A366FF, 0 0 25px rgba(163, 102, 255, 0.5)",
          animation: "neonGlow 2.8s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      <style jsx>{`
        @keyframes neonPulse {
          0%, 100% {
            opacity: 0.4;
            filter: drop-shadow(0 0 10px currentColor);
          }
          50% {
            opacity: 0.8;
            filter: drop-shadow(0 0 20px currentColor);
          }
        }

        @keyframes neonGlow {
          0%, 100% {
            opacity: 0.5;
            box-shadow: 0 0 10px currentColor, 0 0 20px rgba(163, 102, 255, 0.4);
          }
          50% {
            opacity: 0.9;
            box-shadow: 0 0 20px currentColor, 0 0 40px rgba(163, 102, 255, 0.7);
          }
        }
      `}</style>

      {/* 콘텐츠 */}
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="space-y-8 text-center md:space-y-10">
          {/* 질문들 */}
          <div>
            <p className="text-2xl font-medium leading-relaxed md:text-3xl" style={{ color: "#F0E6FA" }}>
              &quot;왜 그렇게 행동했을까?&quot;
            </p>
          </div>

          <div
            className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            style={{ opacity: 0.4 }}
          />

          <div>
            <p className="text-2xl font-medium leading-relaxed md:text-3xl" style={{ color: "#F0E6FA" }}>
              &quot;우리 사이가 왜 자꾸 이럴까?&quot;
            </p>
          </div>

          <div
            className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            style={{ opacity: 0.4 }}
          />

          <div>
            <p className="text-2xl font-medium leading-relaxed md:text-3xl" style={{ color: "#F0E6FA" }}>
              &quot;나는 왜 이렇게 생각할까?&quot;
            </p>
          </div>

          {/* 본문 */}
          <div className="mt-12 md:mt-16">
            <p className="mb-4 text-xl font-medium leading-relaxed md:text-2xl" style={{ color: "#D4C5E2" }}>
              설명 안 되던 것들,
            </p>
            <p className="text-xl font-semibold leading-relaxed md:text-2xl" style={{ color: "#F0E6FA" }}>
              이제 하나로 보일 거야.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
