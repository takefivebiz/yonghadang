"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COLORS } from "@/lib/colors";

/** 관계 유형 정의 */
const RELATIONSHIP_OPTIONS = [
  { label: "썸", icon: "💫" },
  { label: "연애 중", icon: "💑" },
  { label: "이별", icon: "💔" },
  { label: "재회", icon: "🔄" },
  { label: "친구", icon: "👫" },
  { label: "가족", icon: "👨‍👩‍👧‍👦" },
  { label: "직장 동료", icon: "💼" },
  { label: "기타", icon: "❓" },
];

/**
 * CTA 섹션
 * 배경 제거 - 전체 그라데이션과 연결
 */
export const CTASection = () => {
  const router = useRouter();
  const [showRelationships, setShowRelationships] = useState(false);

  const handleSelfAnalysis = () => {
    router.push("/analyze?type=self");
  };

  const handleOtherAnalysis = (relationshipType: string) => {
    router.push(`/analyze?type=other&relationship=${relationshipType}`);
  };

  return (
    <section className="relative overflow-hidden px-4 py-16 md:py-32">
      {/* 배경 장식 - blur 요소 */}
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

      {/* 네온 라인 - 좌측 */}
      <div
        className="pointer-events-none absolute left-0 top-1/3 h-px w-28 opacity-55"
        style={{
          background:
            "linear-gradient(90deg, transparent, #6495ED, transparent)",
          boxShadow: "0 0 18px #6495ED, 0 0 35px rgba(100, 149, 237, 0.5)",
          animation: "neonPulse 3.2s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      {/* 네온 라인 - 우측 */}
      <div
        className="pointer-events-none absolute right-0 top-2/3 h-px w-36 opacity-50"
        style={{
          background:
            "linear-gradient(90deg, transparent, #A366FF, transparent)",
          boxShadow: "0 0 18px #A366FF, 0 0 35px rgba(163, 102, 255, 0.5)",
          animation: "neonPulse 3.8s ease-in-out infinite 0.4s",
        }}
        aria-hidden="true"
      />

      {/* 네온 도트 - 중앙 좌측 */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/2 h-1.5 w-1.5 rounded-full opacity-65"
        style={{
          backgroundColor: "#A366FF",
          boxShadow: "0 0 15px #A366FF, 0 0 30px rgba(163, 102, 255, 0.6)",
          animation: "neonGlow 2.2s ease-in-out infinite",
        }}
        aria-hidden="true"
      />

      {/* 네온 도트 - 중앙 우측 */}
      <div
        className="pointer-events-none absolute right-1/4 top-1/3 h-1 w-1 rounded-full opacity-55"
        style={{
          backgroundColor: "#6495ED",
          boxShadow: "0 0 15px #6495ED, 0 0 30px rgba(100, 149, 237, 0.6)",
          animation: "neonGlow 3.2s ease-in-out infinite 0.9s",
        }}
        aria-hidden="true"
      />

      {/* 네온 대각선 - 우상단 */}
      <svg
        className="pointer-events-none absolute top-1/4 right-1/4 opacity-50"
        width="150"
        height="150"
        viewBox="0 0 150 150"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="150"
          x2="150"
          y2="0"
          stroke="#A366FF"
          strokeWidth="1"
          style={{
            filter: "drop-shadow(0 0 8px #A366FF)",
            animation: "neonDraw 4.5s ease-in-out infinite",
          }}
        />
      </svg>

      <style jsx>{`
        @keyframes neonPulse {
          0%,
          100% {
            opacity: 0.4;
            filter: drop-shadow(0 0 10px currentColor);
          }
          50% {
            opacity: 0.8;
            filter: drop-shadow(0 0 20px currentColor);
          }
        }

        @keyframes neonGlow {
          0%,
          100% {
            opacity: 0.5;
            box-shadow:
              0 0 12px currentColor,
              0 0 25px rgba(100, 149, 237, 0.4);
          }
          50% {
            opacity: 0.9;
            box-shadow:
              0 0 20px currentColor,
              0 0 40px rgba(100, 149, 237, 0.7);
          }
        }

        @keyframes neonDraw {
          0%,
          100% {
            stroke-dashoffset: 0;
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>

      {/* 콘텐츠 */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2
          className="mb-6 text-4xl font-bold md:text-5xl"
          style={{ color: "#F0E6FA" }}
        >
          {showRelationships ? "어떤 관계를 읽어볼까?" : "이제, 직접 확인해봐"}
        </h2>

        <p
          className="mb-10 text-base leading-relaxed md:text-lg whitespace-pre-line"
          style={{ color: "#D4C5E2" }}
        >
          {showRelationships
            ? "상대와의 관계를 선택해줄래."
            : "3분이면 충분해.\n생각보다 많은 게 보일 거야"}
        </p>

        {/* 관계 선택 화면 */}
        {showRelationships ? (
          <div className="space-y-6">
            {/* 관계 유형 그리드 */}
            <div className="grid gap-3 md:gap-4 grid-cols-2 md:grid-cols-4 mb-8">
              {RELATIONSHIP_OPTIONS.map((rel) => (
                <button
                  key={rel.label}
                  onClick={() => handleOtherAnalysis(rel.label)}
                  className="group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 active:scale-[0.95] hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, rgba(163, 102, 255, 0.35) 0%, rgba(163, 102, 255, 0.15) 100%)`,
                    borderLeft: "4px solid #A366FF",
                    backdropFilter: "blur(15px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div className="relative z-10 space-y-2">
                    <div className="text-4xl">{rel.icon}</div>
                    <h3
                      className="text-sm font-bold"
                      style={{ color: "#FFFFFF" }}
                    >
                      {rel.label}
                    </h3>
                  </div>
                </button>
              ))}
            </div>

            {/* 뒤로 가기 버튼 */}
            <button
              onClick={() => setShowRelationships(false)}
              className="text-sm font-medium transition-all duration-300 hover:opacity-100"
              style={{ color: "rgba(230, 230, 250, 0.7)" }}
            >
              ← 돌아가기
            </button>
          </div>
        ) : (
          /* 초기 버튼 선택 */
          <div className="flex flex-col gap-4 md:flex-row md:justify-center items-center">
            {/* 나 버튼 */}
            <button
              onClick={handleSelfAnalysis}
              className="w-[220px] flex flex-col gap-4 gap-4 group relative overflow-hidden rounded-3xl px-8 py-6 text-lg font-bold transition-all duration-300 active:scale-95 hover:shadow-2xl"
              style={{
                background: `linear-gradient(135deg, #7B6A9B55 0%, #7B6A9B25 100%)`,
                borderLeft: "5px solid #7B6A9B",
                backdropFilter: "blur(15px)",
                color: "#FFFFFF",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="flex items-center gap-3 justify-center">
                <span className="text-4xl">🔍</span>
                <span>나</span>
              </div>
              <p
                className="mt-2 text-xs opacity-80"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                나도 몰랐던 내 진짜 마음은?
              </p>
            </button>

            {/* 상대 버튼 */}
            <button
              onClick={() => setShowRelationships(true)}
              className="w-[220px] flex flex-col gap-4 group relative overflow-hidden rounded-3xl px-8 py-6 text-lg font-bold transition-all duration-300 active:scale-95 hover:shadow-2xl"
              style={{
                background: `linear-gradient(135deg, #A366FF55 0%, #A366FF25 100%)`,
                borderLeft: "5px solid #A366FF",
                backdropFilter: "blur(15px)",
                color: "#FFFFFF",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="flex items-center gap-3 justify-center">
                <span className="text-4xl">👤</span>
                <span>상대</span>
              </div>
              <p
                className="mt-2 text-xs opacity-80"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                그 사람은 무슨 생각일까?
              </p>
            </button>
          </div>
        )}

        {/* 부가 텍스트 */}
        {!showRelationships && (
          <p
            className="mt-8 text-xs md:text-sm"
            style={{ color: "rgba(230, 230, 250, 0.6)" }}
          >
            로그인 없이 바로 시작할 수 있어.
          </p>
        )}
      </div>
    </section>
  );
};
