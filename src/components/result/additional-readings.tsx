"use client";

import type { AdditionalReading } from "@/lib/types/quiz";

interface AdditionalReadingsProps {
  readings: AdditionalReading[];
}

const AdditionalReadings = ({ readings }: AdditionalReadingsProps) => {
  if (readings.length === 0) return null;

  return (
    <section className="px-5 py-10">
      {/* 섹션 구분 */}
      <div className="mb-8 text-center">
        <span
          style={{
            color: "rgba(209, 109, 172, 0.20)",
            fontSize: "16px",
            letterSpacing: "0.7em",
          }}
        >
          ◇
        </span>
        <p
          className="mt-4 text-xs tracking-wide"
          style={{ color: "rgba(249, 249, 229, 0.30)" }}
        >
          이 흐름에서 더 들어갈 수 있어
        </p>
      </div>

      {/* 카드 목록 */}
      <div className="flex flex-col gap-3">
        {readings.map((reading) => (
          <div
            key={reading.id}
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "14px",
              padding: "18px 18px 16px",
            }}
          >
            {/* 제목 */}
            <p
              className="text-sm font-medium leading-snug mb-1"
              style={{ color: "rgba(249, 249, 229, 0.82)" }}
            >
              {reading.title}
            </p>

            {/* 부제목 */}
            {reading.subtitle && (
              <p
                className="text-xs mb-4 leading-relaxed"
                style={{ color: "rgba(249, 249, 229, 0.36)" }}
              >
                {reading.subtitle}
              </p>
            )}

            {/* CTA 버튼 — 결제 미연결, UI만 표시 */}
            {/* TODO: [결제 연동] onClick에 개별 구매 결제 플로우 연결 */}
            <button
              type="button"
              className="text-xs px-3 py-1.5 rounded-full transition-opacity duration-150 hover:opacity-80 active:opacity-60"
              style={{
                background: "rgba(201, 139, 176, 0.12)",
                border: "1px solid rgba(201, 139, 176, 0.20)",
                color: "rgba(201, 139, 176, 0.85)",
                letterSpacing: "0.01em",
              }}
            >
              이 흐름 더 보기
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdditionalReadings;
