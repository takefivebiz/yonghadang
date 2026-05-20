interface GeneratingLoadingProps {
  progress: number;
}

const GeneratingLoading = ({ progress }: GeneratingLoadingProps) => {
  const progressPercent = Math.round(progress);
  const statusText =
    progressPercent < 35
      ? "네가 남긴 이야기들을 읽고 있어"
      : progressPercent < 70
        ? "흩어진 감정 흐름을 모으는 중이야"
        : "의뢰 기록을 차분히 묶는 중이야";

  return (
    <div className="flex min-h-screen w-full max-w-lg flex-col items-center px-6 pt-[18vh] transition-all duration-700">
      <style>{`
        @keyframes memoFloat1 {
          0%, 100% { transform: translate(-4px, 0) rotate(-2deg); opacity: 0.28; }
          50% { transform: translate(2px, -8px) rotate(1deg); opacity: 0.46; }
        }
        @keyframes memoFloat2 {
          0%, 100% { transform: translate(3px, 0) rotate(2deg); opacity: 0.22; }
          50% { transform: translate(-3px, -6px) rotate(-1deg); opacity: 0.40; }
        }
        @keyframes memoFloat3 {
          0%, 100% { transform: translate(0, 2px) rotate(1deg); opacity: 0.18; }
          50% { transform: translate(4px, -5px) rotate(-2deg); opacity: 0.34; }
        }
        @keyframes quietBlink {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.62; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes warmGlow {
          0%, 100% { opacity: 0.22; transform: scale(0.96); }
          50% { opacity: 0.72; transform: scale(1.04); }
        }
      `}</style>

      <div
        className="w-full max-w-[320px] text-center"
        style={{ animation: "fadeIn 600ms ease-out" }}
      >
        <div className="relative mx-auto mb-5 flex h-34 w-72 items-end justify-center">
          <div
            className="relative flex h-28 w-28 items-center justify-center rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(214, 150, 84, 0.18) 0%, rgba(214, 150, 84, 0.07) 48%, transparent 72%)",
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                animation: "warmGlow 5.6s ease-in-out infinite",
                background:
                  "radial-gradient(circle, rgba(214, 150, 84, 0.22) 0%, rgba(214, 150, 84, 0.08) 50%, transparent 74%)",
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
            className="text-sm lg:text-[16px] font-medium"
            style={{
              color: "rgba(249, 249, 229, 0.84)",
              letterSpacing: "-0.01em",
            }}
          >
            의뢰 기록 정리 중 · {progressPercent}%
          </p>
          <p
            className="mt-3 text-xs lg:text-[15px] leading-relaxed"
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

export default GeneratingLoading;
