/**
 * 공감 섹션
 * 배경 제거 - 전체 그라데이션과 연결
 */
export const EmpathySection = () => {
  return (
    <section className="relative overflow-hidden px-4 py-16 md:py-24">
      {/* 배경 장식만 */}
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

      {/* 콘텐츠 */}
      <div className="relative z-10 mx-auto max-w-3xl">
        <div className="space-y-8 text-center md:space-y-10">
          {/* 질문들 */}
          <div>
            <p className="text-2xl font-medium leading-relaxed md:text-3xl" style={{ color: "#F0E6FA" }}>
              "왜 그렇게 행동했을까?"
            </p>
          </div>

          <div
            className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            style={{ opacity: 0.4 }}
          />

          <div>
            <p className="text-2xl font-medium leading-relaxed md:text-3xl" style={{ color: "#F0E6FA" }}>
              "우리 사이가 왜 자꾸 이럴까?"
            </p>
          </div>

          <div
            className="h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"
            style={{ opacity: 0.4 }}
          />

          <div>
            <p className="text-2xl font-medium leading-relaxed md:text-3xl" style={{ color: "#F0E6FA" }}>
              "나는 왜 이렇게 생각할까?"
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
