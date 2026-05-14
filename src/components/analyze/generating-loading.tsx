interface GeneratingLoadingProps {
  progress: number;
}

const GeneratingLoading = ({ progress }: GeneratingLoadingProps) => {
  const progressPercent = Math.round(progress);

  return (
    <div className="flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-6 transition-all duration-700">
      <style>{`
        @keyframes convergeFragment1 {
          0% { transform: translate(100px, -90px); opacity: 0.55; }
          100% { transform: translate(0, 0); opacity: 0; }
        }
        @keyframes convergeFragment2 {
          0% { transform: translate(-120px, -70px); opacity: 0.4; }
          100% { transform: translate(0, 0); opacity: 0; }
        }
        @keyframes convergeFragment3 {
          0% { transform: translate(110px, 100px); opacity: 0.3; }
          100% { transform: translate(0, 0); opacity: 0; }
        }
        @keyframes convergeFragment4 {
          0% { transform: translate(-100px, 95px); opacity: 0.6; }
          100% { transform: translate(0, 0); opacity: 0; }
        }

        .fragment { position: absolute; }
        .fragment-1 { animation: convergeFragment1 3s ease-in infinite; }
        .fragment-2 { animation: convergeFragment2 3s ease-in infinite; }
        .fragment-3 { animation: convergeFragment3 3s ease-in infinite; }
        .fragment-4 { animation: convergeFragment4 3s ease-in infinite; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bouncePattern {
          0% { transform: translateY(0); }
          5% { transform: translateY(-6px); }
          10% { transform: translateY(0); }
          15% { transform: translateY(-5px); }
          20% { transform: translateY(0); }
          50%, 100% { transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        .status-text {
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.6) 30%, rgba(255, 255, 255, 0.2) 60%, rgba(255, 255, 255, 0.2) 100%);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: rgba(249, 249, 229, 0.6);
          animation: shimmer 5.5s linear infinite;
        }
      `}</style>

      <div style={{ animation: "fadeIn 600ms ease-out", marginTop: "-400px" }}>
        {/* 주변 수렴하는 메시지 조각들 */}
        <div className="relative w-80 h-80 flex items-center justify-center mb-4">
          {/* Fragment 1 */}
          <div
            className="fragment fragment-1"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px 12px 3px 12px",
              fontSize: "11px",
              color: "rgba(249, 249, 229, 0.3)",
              padding: "6px 12px",
            }}
          >
            ...
          </div>

          {/* Fragment 2 */}
          <div
            className="fragment fragment-2"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px 12px 3px 12px",
              fontSize: "11px",
              color: "rgba(249, 249, 229, 0.25)",
              padding: "6px 12px",
            }}
          >
            ...
          </div>

          {/* Fragment 3 */}
          <div
            className="fragment fragment-3"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px 12px 3px 12px",
              fontSize: "14px",
              color: "rgba(249, 249, 229, 0.28)",
              padding: "6px 12px",
            }}
          >
            ...
          </div>

          {/* Fragment 4 */}
          <div
            className="fragment fragment-4"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px 12px 3px 12px",
              fontSize: "11px",
              color: "rgba(249, 249, 229, 0.32)",
              padding: "6px 12px",
            }}
          >
            ...
          </div>

          {/* 메인 메시지 버블 (VEIL 스타일, progress 채우기) */}
          <div
            className="relative flex items-center justify-center"
            style={{
              animation: "bouncePattern 4s ease-in-out infinite",
              width: "100px",
              height: "55px",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(209, 126, 191, 0.27)",
              borderRadius: "25px 25px 25px 4px",
              padding: "16px",
              overflow: "hidden",
              boxShadow:
                "0 0 24px rgba(209, 109, 172, 0.12), inset 0 0 12px rgba(209, 109, 172, 0.08)",
            }}
          >
            {/* 채우는 효과 - 아래에서 위로 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(209, 109, 172, 0.15), transparent)",
                clipPath: `inset(${Math.max(0, 100 - progressPercent)}% 0 0 0)`,
                transition: "clip-path 300ms ease-out",
                borderRadius: "16px 16px 16px 4px",
                pointerEvents: "none",
              }}
            />

            {/* 텍스트 */}
            <div className="relative z-10 text-center">
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "300",
                  color: "rgba(249, 249, 229, 0.746)",
                  letterSpacing: "-0.02em",
                  lineHeight: "1",
                }}
              >
                {progressPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* 하단 상태 문구 - 한 줄만 */}
        <div className="text-center">
          <p
            className="status-text"
            style={{
              color: "rgba(249, 249, 229, 0.8)",
              fontSize: "13px",
              fontWeight: "300",
              letterSpacing: "0.04em",
              marginTop: "-135px",
            }}
          >
            {progressPercent < 20
              ? "입력한 정보를 정리 중..."
              : progressPercent < 40
                ? "흐름을 읽는 중..."
                : progressPercent < 60
                  ? "깊이를 더하는 중..."
                  : progressPercent < 80
                    ? "결과를 정리하는 중..."
                    : "거의 다 됐어"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeneratingLoading;
