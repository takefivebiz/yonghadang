const PaidGenerationLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-hidden">
      <style>{`
        @keyframes fillBubble {
          0% { clip-path: inset(100% 0 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }

        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(255, 200, 200, 0.3), inset 0 0 20px rgba(255, 200, 200, 0.2); }
          50% { box-shadow: 0 0 40px rgba(255, 200, 200, 0.4), inset 0 0 25px rgba(255, 200, 200, 0.3); }
        }

        @keyframes convergeBubble1 {
          0% { transform: translate(120px, -80px); opacity: 0.4; }
          100% { transform: translate(0, 0); opacity: 0; }
        }

        @keyframes convergeBubble2 {
          0% { transform: translate(-140px, -60px); opacity: 0.35; }
          100% { transform: translate(0, 0); opacity: 0; }
        }

        @keyframes convergeBubble3 {
          0% { transform: translate(100px, 100px); opacity: 0.3; }
          100% { transform: translate(0, 0); opacity: 0; }
        }

        @keyframes convergeBubble4 {
          0% { transform: translate(-110px, 90px); opacity: 0.35; }
          100% { transform: translate(0, 0); opacity: 0; }
        }

        @keyframes convergeBubble5 {
          0% { transform: translate(60px, -120px); opacity: 0.25; }
          100% { transform: translate(0, 0); opacity: 0; }
        }

        .main-bubble {
          animation: glowPulse 2s ease-in-out infinite;
        }

        .converge-bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 220, 200, 0.15), rgba(255, 180, 180, 0.05));
        }

        .converge-bubble-1 { animation: convergeBubble1 3s ease-in infinite; }
        .converge-bubble-2 { animation: convergeBubble2 3s ease-in infinite; }
        .converge-bubble-3 { animation: convergeBubble3 3s ease-in infinite; }
        .converge-bubble-4 { animation: convergeBubble4 3s ease-in infinite; }
        .converge-bubble-5 { animation: convergeBubble5 3s ease-in infinite; }
      `}</style>

      {/* 수렴하는 작은 버블들 */}
      <div className="absolute w-20 h-20 converge-bubble converge-bubble-1"></div>
      <div className="absolute w-16 h-16 converge-bubble converge-bubble-2"></div>
      <div className="absolute w-24 h-24 converge-bubble converge-bubble-3"></div>
      <div className="absolute w-14 h-14 converge-bubble converge-bubble-4"></div>
      <div className="absolute w-28 h-28 converge-bubble converge-bubble-5"></div>

      <div className="flex flex-col items-center gap-8">
        {/* 메인 버블 */}
        <div className="relative w-32 h-32">
          <div className="main-bubble absolute inset-0 rounded-full bg-gradient-to-b from-pink-200/40 to-pink-100/20 border border-pink-200/30 transition-all duration-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white/60 text-xs font-light tracking-wide">깊이를 더하는 중</div>
            </div>
          </div>
        </div>

        {/* 텍스트 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/80 text-base font-light">깊은 흐름이 형성되고 있어...</p>
          <p className="text-white/40 text-sm font-light">잠시만 기다려줘</p>
        </div>
      </div>
    </div>
  );
};

export default PaidGenerationLoading;
