"use client";

import { useState, useEffect } from "react";
import type { AdditionalReading, LoopType, LoopAnswer, LoopMessage } from "@/lib/types/quiz";

interface AdditionalReadingsProps {
  readings: AdditionalReading[];
  /** loopType → 생성 완료된 LoopAnswer 맵 */
  loopAnswers?: Partial<Record<LoopType, LoopAnswer>>;
  /** 현재 생성 중인 loopType (카드에 로딩 상태 표시) */
  loopLoading?: LoopType | null;
  /** 생성 실패한 loopType (재시도 버튼 표시) */
  loopError?: LoopType | null;
  /** 결제·생성 직후 자동 펼칠 loopType */
  activeLoopType?: LoopType | null;
  /** 개별 구매 버튼 클릭 시 호출 (Toss 결제 모달 열기) */
  onPurchaseSingle?: (reading: AdditionalReading) => void;
  /** 생성 실패 후 재시도 (결제 없이 API 재호출) */
  onRetry?: (reading: AdditionalReading) => void;
  // TODO: [결제 연동] 전체 구매 핸들러 추가 (현재 미구현)
}

const PRICE_SINGLE = 900;

const AdditionalReadings = ({
  readings,
  loopAnswers = {},
  loopLoading = null,
  loopError = null,
  activeLoopType = null,
  onPurchaseSingle,
  onRetry,
}: AdditionalReadingsProps) => {
  const [selectedReading, setSelectedReading] =
    useState<AdditionalReading | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [expandedReadingId, setExpandedReadingId] = useState<string | null>(
    null,
  );

  // 결제·생성 완료 후 해당 카드 자동 펼침
  useEffect(() => {
    if (!activeLoopType) return;
    const reading = readings.find((r) => r.loopType === activeLoopType);
    if (reading && loopAnswers[activeLoopType]) {
      setExpandedReadingId(reading.id);
    }
  }, [activeLoopType, readings, loopAnswers]);

  const isUnlocked = (reading: AdditionalReading) =>
    !!loopAnswers[reading.loopType];

  const isLoading = (reading: AdditionalReading) =>
    loopLoading === reading.loopType;

  const hasError = (reading: AdditionalReading) =>
    loopError === reading.loopType;

  const getMessages = (reading: AdditionalReading): LoopMessage[] =>
    loopAnswers[reading.loopType]?.messages ?? [];

  // ── 카드 클릭 ────────────────────────────────────────────────
  const handleCardClick = (reading: AdditionalReading) => {
    if (isLoading(reading)) return; // 생성 중: no-op
    if (isUnlocked(reading)) {
      setExpandedReadingId((prev) =>
        prev === reading.id ? null : reading.id,
      );
    } else if (!hasError(reading)) {
      setSelectedReading(reading);
      setIsBottomSheetOpen(true);
    }
  };

  // ── 바텀시트 닫기 ────────────────────────────────────────────
  const handleCloseSheet = () => {
    setIsBottomSheetOpen(false);
    setTimeout(() => setSelectedReading(null), 350);
  };

  // ── 개별 구매 ────────────────────────────────────────────────
  const handleUnlockSingle = () => {
    if (!selectedReading) return;
    onPurchaseSingle?.(selectedReading);
    handleCloseSheet();
  };

  if (readings.length === 0) return null;

  return (
    <section className="px-5 py-10">
      {/* 애니메이션 */}
      <style>{`
        @keyframes bubble-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bubble-fade { animation: bubble-fade-in 0.35s ease-out forwards; }
        .bubble-fade:nth-child(1) { animation-delay: 0.05s; }
        .bubble-fade:nth-child(2) { animation-delay: 0.10s; }
        .bubble-fade:nth-child(3) { animation-delay: 0.15s; }
        .bubble-fade:nth-child(4) { animation-delay: 0.20s; }
        .bubble-fade:nth-child(5) { animation-delay: 0.25s; }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .spin-slow { animation: spin-slow 1.4s linear infinite; }
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
          const unlocked = isUnlocked(reading);
          const loading = isLoading(reading);
          const error = hasError(reading);
          const isExpanded = expandedReadingId === reading.id && unlocked;
          const messages = getMessages(reading);

          return (
            <div key={reading.id}>
              {/* ── 질문 카드 ───────────────────────────────────────── */}
              <button
                type="button"
                onClick={() => handleCardClick(reading)}
                disabled={loading}
                className="w-full text-left transition-all duration-200"
                style={{
                  background: isExpanded
                    ? "rgba(201, 139, 176, 0.07)"
                    : unlocked
                      ? "rgba(209, 109, 172, 0.10)"
                      : "rgba(255, 255, 255, 0.02)",
                  border: `1px solid ${
                    isExpanded
                      ? "rgba(201, 139, 176, 0.20)"
                      : unlocked
                        ? "rgba(201, 139, 176, 0.22)"
                        : "rgba(255, 255, 255, 0.07)"
                  }`,
                  borderRadius: isExpanded ? "14px 14px 0 0" : "14px",
                  padding: "18px 18px 16px",
                  boxShadow: unlocked
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
                          : unlocked
                            ? "rgba(249, 249, 229, 0.80)"
                            : "rgba(249, 249, 229, 0.55)",
                        whiteSpace: "pre-line",
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

                    {/* 상태 힌트 */}
                    {!unlocked && !loading && !error && (
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

                    {/* 생성 중 */}
                    {loading && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="spin-slow inline-block text-xs"
                          style={{ color: "rgba(201, 139, 176, 0.60)" }}
                        >
                          ◐
                        </span>
                        <p
                          className="text-xs"
                          style={{ color: "rgba(201, 139, 176, 0.55)" }}
                        >
                          생성 중이야...
                        </p>
                      </div>
                    )}

                    {/* 에러 */}
                    {error && !loading && (
                      <div className="flex items-center gap-2">
                        <p
                          className="text-xs"
                          style={{ color: "rgba(220, 100, 100, 0.70)" }}
                        >
                          생성에 실패했어
                        </p>
                        {onRetry && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRetry(reading);
                            }}
                            className="text-xs underline"
                            style={{ color: "rgba(201, 139, 176, 0.65)" }}
                          >
                            다시 시도
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 상태 인디케이터 */}
                  {unlocked && (
                    <span
                      className="flex-shrink-0 mt-0.5"
                      style={{
                        color: "rgba(201, 139, 176, 0.45)",
                        fontSize: "11px",
                        display: "inline-block",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      ↓
                    </span>
                  )}
                  {!unlocked && !loading && !error && (
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

              {/* ── 아코디언 콘텐츠 (unlock 후에만) ──────────────────── */}
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
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={isExpanded ? "bubble-fade" : ""}
                        style={{
                          // punch: 살짝 더 강조된 배경
                          background:
                            msg.type === "punch"
                              ? "rgba(201, 139, 176, 0.10)"
                              : "rgba(255, 255, 255, 0.05)",
                          border:
                            msg.type === "punch"
                              ? "1px solid rgba(201, 139, 176, 0.18)"
                              : "1px solid rgba(255, 255, 255, 0.10)",
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
                            fontWeight: msg.type === "punch" ? 400 : 300,
                            letterSpacing: "-0.02em",
                            whiteSpace: "pre-line",
                          }}
                        >
                          {msg.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 바텀시트 백드롭 ────────────────────────────────────────── */}
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

      {/* ── 바텀시트 ──────────────────────────────────────────────── */}
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
          {/* 선택된 reading 제목 - 메시지 버블 스타일 */}
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
                  className="text-sm font-normal leading-snug mb-1"
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

          {/* TODO: [결제 연동] 전체 구매 (3개 한번에) - 추후 구현 */}
        </div>
      </div>
    </section>
  );
};

export default AdditionalReadings;
