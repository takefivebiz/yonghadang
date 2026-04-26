import { Suspense } from "react";
import { type Metadata } from "next";
import { AnalyzeClient } from "./_components/analyze-client";

export const metadata: Metadata = {
  title: "분석 시작 | Corelog",
  description: "상황을 분석해 하나의 리포트로 만들어줄게.",
  robots: { index: false },
};

const AnalyzePage = () => {
  return (
    <div
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(230, 230, 250, 0.5) 0%, rgba(100, 149, 237, 0.3) 50%, rgba(163, 102, 255, 0.4) 100%)",
      }}
    >
      {/* 배경 장식 - blur 요소 */}
      <div
        className="pointer-events-none absolute left-1/4 top-0 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#6495ED", opacity: 0.15 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-40 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#E6E6FA", opacity: 0.1 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 right-1/4 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "#A366FF", opacity: 0.12 }}
        aria-hidden="true"
      />

      {/* useSearchParams 사용으로 Suspense 필요 */}
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <style>{`
              @keyframes spin-and-pulse {
                0% {
                  transform: rotate(0deg) scale(1);
                }
                50% {
                  transform: rotate(180deg) scale(1.05);
                }
                100% {
                  transform: rotate(360deg) scale(1);
                }
              }
            `}</style>
            <div
              className="h-10 w-10 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: "#2D3250",
                borderRightColor: "#2D3250",
                animation: "spin-and-pulse 1.8s ease-in-out infinite",
              }}
            />
          </div>
        }
      >
        <AnalyzeClient />
      </Suspense>
    </div>
  );
};

export default AnalyzePage;
