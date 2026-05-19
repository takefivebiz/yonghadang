"use client";

import { useState, useEffect } from "react";

interface PaidGenerationLoadingProps {
  isRecovery?: boolean;
}

const PaidGenerationLoading = ({ isRecovery = false }: PaidGenerationLoadingProps) => {
  const [progress, setProgress] = useState(0);
  const progressPercent = Math.round(progress);
  const statusText = isRecovery
    ? progressPercent < 60
      ? "이어 보던 기록을 다시 정리하고 있어"
      : "기록 흐름을 다시 맞추는 중이야"
    : progressPercent < 35
      ? "조금 더 깊은 흐름을 확인하는 중이야"
      : progressPercent < 70
        ? "다음 기록을 조용히 펼치는 중이야"
        : "잠긴 기록을 열어두는 중이야";

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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden px-6 pt-[18vh] backdrop-blur-sm" style={{ backgroundColor: "rgba(12, 9, 22, 0.82)" }}>
      <style>{`
        @keyframes paidMemoFloat1 {
          0%, 100% { transform: translate(-4px, 0) rotate(-2deg); opacity: 0.30; }
          50% { transform: translate(2px, -8px) rotate(1deg); opacity: 0.48; }
        }
        @keyframes paidMemoFloat2 {
          0%, 100% { transform: translate(3px, 0) rotate(2deg); opacity: 0.24; }
          50% { transform: translate(-3px, -6px) rotate(-1deg); opacity: 0.42; }
        }
        @keyframes paidMemoFloat3 {
          0%, 100% { transform: translate(0, 2px) rotate(1deg); opacity: 0.20; }
          50% { transform: translate(4px, -5px) rotate(-2deg); opacity: 0.36; }
        }
        @keyframes paidQuietBlink {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.62; }
        }
        @keyframes paidFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes paidWarmGlow {
          0%, 100% { opacity: 0.12; transform: scale(0.94); }
          50% { opacity: 0.82; transform: scale(1.08); }
        }
      `}</style>

      <div
        className="w-full max-w-[320px] text-center"
        style={{ animation: "paidFadeIn 600ms ease-out" }}
      >
        <div className="relative mx-auto mb-5 flex h-34 w-72 items-end justify-center">
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(214, 150, 84, 0.08) 0%, rgba(214, 150, 84, 0.03) 48%, transparent 72%)",
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                animation: "paidWarmGlow 5.6s ease-in-out infinite",
                background:
                  "radial-gradient(circle, rgba(214, 150, 84, 0.30) 0%, rgba(214, 150, 84, 0.12) 50%, transparent 74%)",
              }}
            />
            <img
              src="/img/cat2.png"
              alt=""
              className="relative z-10 h-20 w-20 object-contain opacity-85"
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[260px]">
          <p
            className="text-sm font-medium"
            style={{
              color: "rgba(249, 249, 229, 0.84)",
              letterSpacing: "-0.01em",
            }}
          >
            {isRecovery ? "기록 다시 여는 중" : "잠긴 기록을 열고 있어"} · {progressPercent}%
          </p>
          <p
            className="mt-3 text-xs leading-relaxed"
            style={{ color: "rgba(249, 249, 229, 0.44)" }}
          >
            {statusText}
          </p>
          <div
            className="mt-5 h-px w-full overflow-hidden"
            style={{ background: "rgba(143, 122, 216, 0.10)" }}
          >
            <div
              className="h-full"
              style={{
                width: `${progressPercent}%`,
                background: "rgba(143, 122, 216, 0.45)",
                transition: "width 300ms ease-out",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaidGenerationLoading;
