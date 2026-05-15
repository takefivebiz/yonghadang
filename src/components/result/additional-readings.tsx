"use client";

import { useState } from "react";
import type { AdditionalReading } from "@/lib/types/quiz";

interface AdditionalReadingsProps {
  readings: AdditionalReading[];
  // TODO: [결제 연동] unlockedReadingIds를 실제 구매 상태 기반으로 교체
  unlockedReadingIds?: string[];
}

// ── 더미 루프 콘텐츠 (reading.id별) ──────────────────────────────────
// TODO: [결제 연동] 실제 생성 API(/api/analyze/[session_id]/loop-reading)로 교체
const DUMMY_LOOP_CONTENTS: Record<string, string[]> = {
  default: [
    "너는 지금, 좋아하냐 아니냐보다 그 태도를 이해하고 싶은 거야.",
    "이 사람은 모호하게 두는 게 더 편한 사람이야.",
    "명확한 거절보다 애매한 온기가 더 오래 남거든.",
  ],
  longing: [
    "그리움은 좋았던 순간만 남겨서 보여줘.",
    "그 사람이 보고 싶은 건지, 그 시절의 내가 보고 싶은 건지.",
    "아직 정리가 덜 된 거야.",
  ],
  trust: [
    "제일 힘든 건 상대가 아니라, 믿었던 내 판단이야.",
    "믿었다는 건 열려 있었다는 거야. 잘못이 아니야.",
    "지금은 신뢰를 다시 쌓는 게 목표가 아니어도 괜찮아.",
  ],
};

/** reading.id에 해당하는 더미 콘텐츠를 반환. id가 없으면 trigger_dimension 기반 fallback. */
const getDummyContent = (reading: AdditionalReading): string[] => {
  if (DUMMY_LOOP_CONTENTS[reading.id]) return DUMMY_LOOP_CONTENTS[reading.id];

  const dim = reading.trigger_dimension ?? "";
  if (dim.includes("longing") || dim.includes("그리움"))
    return DUMMY_LOOP_CONTENTS.longing;
  if (dim.includes("trust") || dim.includes("신뢰"))
    return DUMMY_LOOP_CONTENTS.trust;

  return DUMMY_LOOP_CONTENTS.default;
};

// ── 개별/전체 가격 상수 ────────────────────────────────────────────────
const PRICE_SINGLE = 900;
const PRICE_ALL = 2500;
// TODO: [가격 정산] 개별 × 남은개수 - 전체가격 = 할인액 동적 계산 후 UI 반영

const AdditionalReadings = ({
  readings,
  unlockedReadingIds = [],
}: AdditionalReadingsProps) => {
  // 바텀시트에서 선택된 reading
  const [selectedReading, setSelectedReading] =
    useState<AdditionalReading | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // 잠금 해제된 reading id 집합 (더미: prop 초기값 + 클릭 unlock 누적)
  const [unlockedReadings, setUnlockedReadings] = useState<Set<string>>(
    () => new Set(unlockedReadingIds),
  );

  // 현재 펼쳐진 accordion reading id
  const [expandedReadingId, setExpandedReadingId] = useState<string | null>(
    null,
  );

  // 잠긴 reading 수 (전체 열기 가격 표시용)
  const lockedCount = readings.filter(
    (r) => !unlockedReadings.has(r.id),
  ).length;

  // ── 카드 클릭 ─────────────────────────────────────────────────────
  const handleCardClick = (reading: AdditionalReading) => {
    if (unlockedReadings.has(reading.id)) {
      // 이미 열린 경우 → accordion 토글
      setExpandedReadingId((prev) => (prev === reading.id ? null : reading.id));
    } else {
      // 잠긴 경우 → 바텀시트 열기
      setSelectedReading(reading);
      setIsBottomSheetOpen(true);
    }
  };

  // ── 바텀시트 닫기 ─────────────────────────────────────────────────
  const handleCloseSheet = () => {
    setIsBottomSheetOpen(false);
    // 닫힘 애니메이션 후 selectedReading 초기화
    setTimeout(() => setSelectedReading(null), 350);
  };

  // ── 개별 열기 (더미) ─────────────────────────────────────────────
  // TODO: [결제 연동] 실제 PG 결제(Toss) 처리로 교체
  const handleUnlockSingle = () => {
    if (!selectedReading) return;
    const next = new Set(unlockedReadings);
    next.add(selectedReading.id);
    setUnlockedReadings(next);
    setExpandedReadingId(selectedReading.id);
    setIsBottomSheetOpen(false);
    setTimeout(() => setSelectedReading(null), 350);
  };

  // ── 전체 열기 (더미) ─────────────────────────────────────────────
  // TODO: [결제 연동] 실제 PG 결제(Toss) 처리로 교체
  const handleUnlockAll = () => {
    const allIds = new Set(readings.map((r) => r.id));
    setUnlockedReadings(allIds);
    // 선택한 reading을 바로 펼치기
    if (selectedReading) setExpandedReadingId(selectedReading.id);
    setIsBottomSheetOpen(false);
    setTimeout(() => setSelectedReading(null), 350);
  };

  if (readings.length === 0) return null;

  return (
    <section className="px-5 py-10">
      {/* 펼침 애니메이션 스타일 */}
      <style>{`
        @keyframes bubble-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bubble-fade { animation: bubble-fade-in 0.35s ease-out forwards; }
        .bubble-fade:nth-child(1) { animation-delay: 0.05s; }
        .bubble-fade:nth-child(2) { animation-delay: 0.10s; }
        .bubble-fade:nth-child(3) { animation-delay: 0.15s; }
      `}</style>

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
        {readings.map((reading) => {
          const isUnlocked = unlockedReadings.has(reading.id);
          const isExpanded = expandedReadingId === reading.id && isUnlocked;
          const dummyContent = getDummyContent(reading);

          return (
            <div key={reading.id}>
              {/* 질문 카드 */}
              <button
                type="button"
                onClick={() => handleCardClick(reading)}
                className="w-full text-left transition-all duration-200"
                style={{
                  background: isExpanded
                    ? "rgba(201, 139, 176, 0.07)"
                    : isUnlocked
                      ? "rgba(209, 109, 172, 0.10)"
                      : "rgba(255, 255, 255, 0.02)",
                  border: `1px solid ${
                    isExpanded
                      ? "rgba(201, 139, 176, 0.20)"
                      : isUnlocked
                        ? "rgba(201, 139, 176, 0.22)"
                        : "rgba(255, 255, 255, 0.07)"
                  }`,
                  borderRadius: isExpanded ? "14px 14px 0 0" : "14px",
                  padding: "18px 18px 16px",
                  boxShadow: isUnlocked
                    ? "0 4px 16px rgba(201, 139, 176, 0.10)"
                    : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {/* 제목 */}
                    <p
                      className="text-sm font-medium leading-snug mb-1"
                      style={{
                        color: isExpanded
                          ? "rgba(249, 249, 229, 0.92)"
                          : isUnlocked
                            ? "rgba(249, 249, 229, 0.80)"
                            : "rgba(249, 249, 229, 0.55)",
                      }}
                    >
                      {reading.title}
                    </p>

                    {/* 부제목 */}
                    {reading.subtitle && (
                      <p
                        className="text-xs leading-relaxed mb-2"
                        style={{ color: "rgba(249, 249, 229, 0.32)" }}
                      >
                        {reading.subtitle}
                      </p>
                    )}

                    {/* 잠긴 상태 힌트 */}
                    {!isUnlocked && (
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="h-3 w-3"
                          style={{ color: "rgba(201, 139, 176, 0.50)" }}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7 10V8a5 5 0 0 1 10 0v2" />
                          <rect x="5" y="10" width="14" height="10" rx="2" />
                        </svg>
                        <p
                          className="text-xs"
                          style={{ color: "rgba(201, 139, 176, 0.55)" }}
                        >
                          더 깊게 읽기
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 상태 인디케이터 */}
                  {isUnlocked ? (
                    <span
                      className="flex-shrink-0 mt-0.5"
                      style={{
                        color: "rgba(201, 139, 176, 0.45)",
                        fontSize: "11px",
                        display: "inline-block",
                        transform: isExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      ↓
                    </span>
                  ) : (
                    <span
                      className="flex-shrink-0"
                      style={{
                        fontSize: "13px",
                        color: "rgba(201, 139, 176, 0.35)",
                      }}
                    >
                      →
                    </span>
                  )}
                </div>
              </button>

              {/* 아코디언 콘텐츠 (unlock된 경우에만) */}
              <div
                className="overflow-hidden"
                style={{
                  display: "grid",
                  gridTemplateRows: isExpanded ? "1fr" : "0fr",
                  borderRight: isExpanded
                    ? "1px solid rgba(201, 139, 176, 0.12)"
                    : "1px solid transparent",
                  borderBottom: isExpanded
                    ? "1px solid rgba(201, 139, 176, 0.12)"
                    : "1px solid transparent",
                  borderLeft: isExpanded
                    ? "1px solid rgba(201, 139, 176, 0.12)"
                    : "1px solid transparent",
                  borderRadius: "0 0 14px 14px",
                  opacity: isExpanded ? 1 : 0,
                  transition:
                    "grid-template-rows 0.45s ease, opacity 0.35s ease, border 0.1s ease",
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <div
                    className="px-4 pt-6 pb-5 flex flex-col gap-3 items-start"
                    style={{
                      background: isExpanded
                        ? "rgba(209, 109, 172, 0.05)"
                        : "transparent",
                      transition: "background 0.5s ease",
                    }}
                  >
                    {dummyContent.map((text, idx) => (
                      <div
                        key={idx}
                        className={isExpanded ? "bubble-fade" : ""}
                        style={{
                          background: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.10)",
                          borderRadius: "14px 14px 14px 2px",
                          padding: "14px 16px",
                          width: "fit-content",
                          maxWidth: "90%",
                        }}
                      >
                        <p
                          className="text-sm leading-relaxed"
                          style={{
                            color: "rgba(249, 249, 229, 0.78)",
                            fontWeight: 300,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {text}
                        </p>
                      </div>
                    ))}
                    {/* TODO: [결제 연동] 더미 콘텐츠 제거 후 실제 생성 콘텐츠로 교체 */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 바텀시트 백드롭 */}
      <div
        className="fixed inset-0 z-50"
        style={{
          background: "rgba(6, 5, 14, 0.44)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          opacity: isBottomSheetOpen ? 1 : 0,
          pointerEvents: isBottomSheetOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        onClick={handleCloseSheet}
      />

      {/* ── 바텀시트 ──────────────────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md"
        style={{
          transform: isBottomSheetOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)",
          background: "none",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderTop: "1px solid rgba(201, 139, 176, 0.12)",
          borderRadius: "24px 24px 0 0",
          paddingBottom: "env(safe-area-inset-bottom, 20px)",
        }}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-3 pb-2">
          <div
            style={{
              width: "36px",
              height: "3px",
              borderRadius: "2px",
              background: "rgba(255, 255, 255, 0.12)",
            }}
          />
        </div>

        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={handleCloseSheet}
          className="absolute right-4 top-3 flex items-center justify-center"
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            color: "rgba(249, 249, 229, 0.282)",
            fontSize: "12px",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* 콘텐츠 영역 */}
        <div className="px-6 pt-8 pb-8">
          {/* 선택된 reading 제목/부제목 — 메시지 버블 스타일 */}
          {selectedReading && (
            <div className="mb-8 flex justify-end w-full">
              <div
                style={{
                  background: "rgba(80, 140, 170, 0.08)",
                  border: "1px solid rgba(80, 140, 170, 0.12)",
                  borderRadius: "16px 16px 0px 16px",
                  padding: "12px 16px",
                  maxWidth: "75%",
                }}
              >
                <p
                  className="text-sm font-nomal leading-snug mb-1"
                  style={{
                    color: "rgba(249, 249, 229, 0.93)",
                    textShadow: "0 0 20px rgba(201, 139, 176, 0.06)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {selectedReading.title}
                </p>
                {selectedReading.subtitle && (
                  <p
                    className="text-xs leading-snug"
                    style={{ color: "rgba(249, 249, 229, 0.40)" }}
                  >
                    {selectedReading.subtitle}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 개별 열기 버튼 */}
          <button
            type="button"
            onClick={handleUnlockSingle}
            className="flex items-center justify-between mb-3"
            style={{
              width: "100%",
              background: "rgba(201, 139, 176, 0.05)",
              border: "1px solid rgba(201, 139, 176, 0.10)",
              borderRadius: "12px 12px 12px 0px",
              padding: "14px 16px",
              transition: "all 0.15s ease",
            }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: "rgba(249, 249, 229, 0.78)" }}
            >
              이 질문 깊게 읽기
            </span>
            <span
              className="text-xs"
              style={{ color: "rgba(201, 139, 176, 0.45)" }}
            >
              {PRICE_SINGLE.toLocaleString()}원
            </span>
          </button>

          {/* 전체 열기 버튼 (잠긴 항목이 2개 이상일 때만 표시) */}
          {lockedCount >= 2 && (
            <button
              type="button"
              onClick={handleUnlockAll}
              className="flex items-center justify-between"
              style={{
                width: "100%",
                background: "rgba(201, 139, 176, 0.13)",
                border: "1px solid rgba(201, 139, 176, 0.22)",
                borderRadius: "12px 12px 12px 0px",
                padding: "14px 16px",
                transition: "all 0.15s ease",
              }}
            >
              <div className="flex flex-col items-start gap-0.5">
                <span
                  className="text-sm font-medium"
                  style={{ color: "rgba(249, 249, 229, 0.90)" }}
                >
                  모든 질문 한번에 읽기
                </span>
                <span
                  className="text-xs"
                  style={{ color: "rgba(249, 249, 229, 0.45)" }}
                >
                  {lockedCount}개 질문
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                {/* 절약 뱃지 */}
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{
                    background: "rgba(201, 139, 176, 0.15)",
                    color: "rgba(201, 139, 176, 0.75)",
                  }}
                >
                  200원 절약
                </span>
                <span
                  className="text-xs"
                  style={{ color: "rgba(201, 139, 176, 0.65)" }}
                >
                  {PRICE_ALL.toLocaleString()}원
                </span>
              </div>
            </button>
          )}

          {/* 잠긴 항목이 1개뿐일 때 - 전체 열기 불필요하므로 개별만 강조 */}
          {lockedCount === 1 && (
            <p
              className="text-center text-xs mt-3"
              style={{ color: "rgba(249, 249, 229, 0.22)" }}
            >
              마지막 질문이야
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdditionalReadings;
