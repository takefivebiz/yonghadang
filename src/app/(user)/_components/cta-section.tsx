"use client";

import { useRouter } from "next/navigation";

/**
 * CTA 섹션
 * 배경 제거 - 전체 그라데이션과 연결
 */
export const CTASection = () => {
  const router = useRouter();

  const handleStartAnalysis = () => {
    router.push("/analyze?type=self");
  };

  return (
    <section className="relative overflow-hidden px-4 py-16 md:py-32">
      {/* 배경 장식만 */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: "#A366FF", opacity: 0.18 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full blur-3xl"
        style={{ backgroundColor: "#E6E6FA", opacity: 0.1 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: "#6495ED", opacity: 0.12 }}
        aria-hidden="true"
      />

      {/* 콘텐츠 */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2
          className="mb-6 text-4xl font-bold md:text-5xl"
          style={{ color: "#F0E6FA" }}
        >
          사람을 읽어봐
        </h2>

        <p
          className="mb-10 text-base leading-relaxed md:text-lg"
          style={{ color: "#D4C5E2" }}
        >
          3분이면 충분해. 말과 행동 속에 드러난 것들을 보게 될 거야
        </p>

        {/* CTA 버튼 */}
        <button
          onClick={handleStartAnalysis}
          className="inline-block rounded-full px-10 py-4 text-base font-semibold text-white transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 md:text-lg"
          style={{
            background:
              "linear-gradient(90deg, #6495ED 0%, #A366FF 50%, #E6E6FA 100%)",
            boxShadow: "0 0 30px rgba(163, 102, 255, 0.3)",
          }}
        >
          해석 시작하기 →
        </button>

        {/* 부가 텍스트 */}
        <p
          className="mt-6 text-xs md:text-sm"
          style={{ color: "rgba(230, 230, 250, 0.6)" }}
        >
          로그인 없이 바로 시작할 수 있어.
        </p>
      </div>
    </section>
  );
};
