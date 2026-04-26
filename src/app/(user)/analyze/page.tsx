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
      className="min-h-[calc(100vh-4rem)]"
      style={{ backgroundColor: "#F5F2ED" }}
    >
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
