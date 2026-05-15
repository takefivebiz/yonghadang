"use client";

import { useState, useEffect } from "react";

interface PaidGenerationLoadingProps {
  isRecovery?: boolean;
}

const PaidGenerationLoading = ({ isRecovery = false }: PaidGenerationLoadingProps) => {
  const [progress, setProgress] = useState(0);
  const progressPercent = Math.round(progress);

  // 지수 감쇠 방식: 남은 거리의 일정 비율씩 줄여나가 95%에 점근적으로 수렴.
  // 하드 캡 없이 자연히 감속하므로 "멈춰있는 느낌"이 없다.
  useEffect(() => {
    let fakeProgress = 0;
    const interval = setInterval(() => {
      const remaining = 95 - fakeProgress;
      fakeProgress += remaining * 0.03 + Math.random() * 0.4;
      setProgress(fakeProgress);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden backdrop-blur-sm" style={{ backgroundColor: "rgba(29, 25, 43, 0.7)" }}>
      <style>{`
        @keyframes paidFragment1 {
          0% { transform: translate(100px, -90px); opacity: 0.85; }
          100% { transform: translate(0, 0); opacity: 0; }
        }
        @keyframes paidFragment2 {
          0% { transform: translate(-120px, -70px); opacity: 0.75; }
          100% { transform: translate(0, 0); opacity: 0; }
        }
        @keyframes paidFragment3 {
          0% { transform: translate(110px, 100px); opacity: 0.7; }
          100% { transform: translate(0, 0); opacity: 0; }
        }
        @keyframes paidFragment4 {
          0% { transform: translate(-100px, 95px); opacity: 0.85; }
          100% { transform: translate(0, 0); opacity: 0; }
        }

        .paid-frag { position: absolute; }
        .paid-frag-1 { animation: paidFragment1 3s ease-in infinite; }
        .paid-frag-2 { animation: paidFragment2 3s ease-in infinite; }
        .paid-frag-3 { animation: paidFragment3 3s ease-in infinite; }
        .paid-frag-4 { animation: paidFragment4 3s ease-in infinite; }

        @keyframes paidFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes paidBounce {
          0% { transform: translateY(0); }
          5% { transform: translateY(-6px); }
          10% { transform: translateY(0); }
          15% { transform: translateY(-5px); }
          20% { transform: translateY(0); }
          50%, 100% { transform: translateY(0); }
        }

        @keyframes paidShimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        .paid-status-text {
          background: linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0.5) 100%);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: paidShimmer 5.5s linear infinite;
        }
      `}</style>

      <div
        style={{ animation: "paidFadeIn 600ms ease-out", marginTop: "-300px" }}
      >
        {/* 수렴하는 메시지 조각들 */}
        <div className="relative w-80 h-80 flex items-center justify-center mb-4">
          <div
            className="paid-frag paid-frag-1"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "12px 12px 3px 12px",
              fontSize: "11px",
              color: "rgba(249, 249, 229, 0.7)",
              padding: "6px 12px",
            }}
          >
            ...
          </div>
          <div
            className="paid-frag paid-frag-2"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "12px 12px 3px 12px",
              fontSize: "11px",
              color: "rgba(249, 249, 229, 0.65)",
              padding: "6px 12px",
            }}
          >
            ...
          </div>
          <div
            className="paid-frag paid-frag-3"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "12px 12px 3px 12px",
              fontSize: "14px",
              color: "rgba(249, 249, 229, 0.68)",
              padding: "6px 12px",
            }}
          >
            ...
          </div>
          <div
            className="paid-frag paid-frag-4"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "12px 12px 3px 12px",
              fontSize: "11px",
              color: "rgba(249, 249, 229, 0.72)",
              padding: "6px 12px",
            }}
          >
            ...
          </div>

          {/* 메인 버블 (progress 채우기) */}
          <div
            className="relative flex items-center justify-center"
            style={{
              animation: "paidBounce 4s ease-in-out infinite",
              width: "100px",
              height: "55px",
              background: "rgba(255, 255, 255, 0.09)",
              border: "1px solid rgba(209, 126, 191, 0.55)",
              borderRadius: "25px 25px 25px 4px",
              padding: "16px",
              overflow: "hidden",
              boxShadow:
                "0 0 24px rgba(209, 109, 172, 0.25), inset 0 0 12px rgba(209, 109, 172, 0.18)",
            }}
          >
            {/* 아래에서 위로 채우는 효과 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(209, 109, 172, 0.3), transparent)",
                clipPath: `inset(${Math.max(0, 100 - progressPercent)}% 0 0 0)`,
                transition: "clip-path 300ms ease-out",
                borderRadius: "16px 16px 16px 4px",
                pointerEvents: "none",
              }}
            />
            <div className="relative z-10 text-center">
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "300",
                  color: "rgba(249, 249, 229, 0.92)",
                  letterSpacing: "-0.02em",
                  lineHeight: "1",
                }}
              >
                {progressPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* 상태 문구 */}
        <div className="text-center">
          <p
            className="paid-status-text"
            style={{
              fontSize: "13px",
              fontWeight: "300",
              letterSpacing: "0.04em",
              marginTop: "-135px",
            }}
          >
            {isRecovery
            ? (progressPercent < 50
                ? "결제한 내용을 이어서 불러오는 중..."
                : "거의 다 됐어")
            : (progressPercent < 20
                ? "더 깊은 흐름을 읽는 중..."
                : progressPercent < 40
                  ? "감정의 구조를 분석 중..."
                  : progressPercent < 60
                    ? "통찰을 정리하는 중..."
                    : progressPercent < 80
                      ? "결과를 구성하는 중..."
                      : "거의 다 됐어")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaidGenerationLoading;
