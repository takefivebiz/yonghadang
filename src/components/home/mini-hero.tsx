import Image from "next/image";

/**
 * 메인 페이지 상단 히어로 섹션
 * 포스터 스타일 히어로
 */
const MiniHero = () => {
  return (
    <section
      className="relative w-full"
      style={{
        height: "93vh",
        minHeight: "720px",
      }}
    >
      <div
        className="relative h-full flex items-center justify-center px-4 sm:px-8"
        style={{
          transform: "translateY(-50px)",
        }}
      >
        {/* 히어로 카드 */}
        <div
          className="relative w-[88vw] max-w-[520px]"
          style={{
            background: "transparent",
          }}
        >
          {/* 이미지 컨테이너 - 아치 모양 */}
          <div
            className="relative w-full h-[72vh] max-h-[760px] overflow-hidden scale-[0.92]"
            style={{
              borderRadius: "120px 120px 0 0",
            }}
          >
            {/* 일러스트 */}
            <Image
              src="/img/main2.png"
              alt="VEIL 메인 일러스트"
              fill
              priority
              quality={95}
              className="object-cover object-center"
              style={{
                opacity: 0.82,
              }}
            />

            {/* 상단 오버레이 */}
            <div
              className="absolute inset-0 flex flex-col items-center text-center px-8"
              style={{
                background:
                  "linear-gradient(180deg, rgba(116, 94, 123, 0.754) 0%, rgba(0,0,0,0) 50%)",
                paddingTop: "62px",
              }}
            >
              <h2
                className="font-hero font-medium leading-[1.35]"
                style={{
                  color: "rgb(228, 217, 229)",
                  fontSize: "clamp(1.4rem, 2.2vw, 1.5rem)",
                  letterSpacing: "-0.03em",
                  textShadow:
                    "0 2px 0px rgba(0, 0, 0, 0.4), 0 0 12px rgba(0, 0, 0, 0.2)",
                }}
              >
                다정하게 듣고,
                <br />
                정확하게 말해줄게
              </h2>

              <p
                className="font-body mt-2"
                style={{
                  color: "rgb(222, 214, 221)",
                  fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.6,
                  textShadow:
                    "0 2px 0px rgba(0, 0, 0, 0.4), 0 0 12px rgba(0, 0, 0, 0.2)",
                }}
              >
                좋은 말보다 필요한 말을.
              </p>
            </div>
          </div>

          {/* 하단 정보 */}
          <div
            className="absolute left-0 right-0 flex flex-col items-center gap-8"
            style={{
              bottom: "-20px",
            }}
          >
            <p
              className="tracking-[0.18em]"
              style={{
                color: "rgb(189, 189, 189)",
                fontSize: "11px",
              }}
            >
              개인화 해석 · 로직 기반 · 3분 완성
            </p>

            <div
              style={{
                animation: "float 2.5s ease-in-out infinite",
                color: "rgba(249,249,229,0.28)",
                fontSize: "22px",
                lineHeight: 1,
              }}
            >
              ↓
            </div>
          </div>
        </div>

        {/* 플로팅 애니메이션 */}
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(8px);
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default MiniHero;
