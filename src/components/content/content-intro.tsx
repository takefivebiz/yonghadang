"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Content, CATEGORY_LABELS } from "@/lib/types/content";

const CATEGORY_CONFIG: Record<Content["category"], { glow: string }> = {
  love: { glow: "from-accent/10" },
  relationship: { glow: "from-secondary/10" },
  career: { glow: "from-highlight/8" },
  emotion: { glow: "from-purple-400/10" },
};

interface ContentIntroProps {
  content: Content;
}

const ContentIntro = ({ content }: ContentIntroProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const config = CATEGORY_CONFIG[content.category];

  const handleStart = async () => {
    setLoading(true);
    const mockSessionId =
      crypto.randomUUID?.() ||
      `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    router.push(`/analyze/${mockSessionId}?content_id=${content.id}`);
  };

  // Flow preview: 최대 4개까지만 노출
  const MAX_PREVIEW_FLOWS = 4;
  const previewFlows = content.insights?.slice(0, MAX_PREVIEW_FLOWS) || [];
  const remainingCount = (content.insights?.length || 0) - previewFlows.length;

  return (
    <div className="w-full max-w-full relative overflow-x-hidden">
      {/* 배경 그래디언트 */}
      <div
        className={`absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-b ${config.glow} via-background/80 to-background`}
      />

      <main className="relative z-10 w-full flex flex-col justify-between px-5 py-8 pb-50">
        {/* 티켓 오브젝트 */}
        <div className="flex-1 flex items-start pt-8">
          {/* Ticket Wrapper with Texture Background */}
          <div
            className="relative w-[100%] max-w-[320px] mx-auto"
            style={{
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {/* 미묘한 Grain Texture — CSS Gradient */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 24%),
                  radial-gradient(circle at 80% 10%, rgba(209,109,172,0.06), transparent 28%),
                  linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))
                `,
              }}
            />
            {/* 상단 Section */}
            <div
              className="relative z-10 px-6 pt-3 pb-6 space-y-4"
              style={{
                border: "1.5px solid rgba(155, 123, 168, 0.4)",
                borderBottom: "none",
                borderRadius: "12px 12px 0 0",
              }}
            >
              {/* VEIL Logo */}
              <div className="text-center mb-4">
                <span
                  className="text-[9px] font-semibold uppercase tracking-[0.25em]"
                  style={{ color: "rgba(155, 123, 168, 0.6)" }}
                >
                  V E I L
                </span>
              </div>

              {/* 상단 Header — 이미지 + 제목/부제 */}
              <div className="flex gap-3 items-start">
                {/* 썸네일 */}
                <div className="w-24 shrink-0">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    {content.thumbnail_url ? (
                      <Image
                        src={content.thumbnail_url}
                        alt={content.title}
                        fill
                        sizes="112px"
                        priority
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-surface/40" />
                    )}
                  </div>
                </div>

                {/* 제목/부제 */}
                <div className="flex-1 pt-0.5">
                  {/* 카테고리 배지 */}
                  <div className="mb-2">
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-white/40">
                      {CATEGORY_LABELS[content.category]}
                    </span>
                  </div>
                  <h1 className="text-[16px] lg:text-[16px] font-medium leading-[1.3] text-white/80 mb-1 line-clamp-1">
                    {content.title}
                  </h1>
                  {content.subtitle && (
                    <p className="text-[12px] lg:text-[12px] leading-[1.4] text-white/55 line-clamp-2 text-left">
                      {content.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 절취선 */}
            <div
              className="relative"
              style={{
                height: "12px",
                display: "flex",
                alignItems: "center",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
            >
              {/* 좌측 Diamond */}
              <div
                style={{
                  position: "absolute",
                  left: "-16px",
                  width: "20px",
                  height: "20px",
                  transform: "rotate(45deg)",
                  border: "1.5px solid rgba(155, 123, 168, 0.4)",
                  borderBottom: "2px solid transparent",
                  borderLeft: "2px solid transparent",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(155, 123, 168, 0.4) 0px, rgba(155, 123, 168, 0.4) 4px, transparent 4px, transparent 10px)",
                  }}
                />
                <span
                  className="text-[7px] font-semibold uppercase tracking-[0.2em] whitespace-nowrap"
                  style={{ color: "rgba(155, 123, 168, 0.6)" }}
                >
                  FLOW PREVIEW
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(155, 123, 168, 0.4) 0px, rgba(155, 123, 168, 0.4) 4px, transparent 4px, transparent 10px)",
                  }}
                />
              </div>

              {/* 우측 Diamond */}
              <div
                style={{
                  position: "absolute",
                  right: "-16px",
                  width: "20px",
                  height: "20px",
                  transform: "rotate(45deg)",
                  border: "1.5px solid rgba(155, 123, 168, 0.4)",
                  borderTop: "2px solid transparent",
                  borderRight: "2px solid transparent",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* 하단 Section */}
            <div
              className="relative z-10 px-6 pt-4 pb-6"
              style={{
                borderLeft: "1.5px solid rgba(155, 123, 168, 0.4)",
                borderRight: "1.5px solid rgba(155, 123, 168, 0.4)",

                borderRadius: "0 0 12px 20px",
              }}
            >
              {/* Teaser — 티켓 정보 영역 */}
              {previewFlows && previewFlows.length > 0 && (
                <div className="space-y-5 pt-4 pb-3">
                  {previewFlows.map((insight, i) => (
                    <div key={i} className="flex flex-col gap-2 pl-2">
                      <span className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.18em]">
                        FLOW {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[13px] lg:text-[13px] leading-[1] text-white/75">
                        {insight}
                      </p>
                    </div>
                  ))}
                  {/* 남은 흐름 표시 */}
                  {remainingCount > 0 && (
                    <p className="pl-2 mt-6 text-[12px] text-white/35">
                      + {remainingCount}개의 흐름이 더 있어
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* CTA 영역 */}
            <div className="w-[100%] max-w-[320px] mx-auto pb-12">
              <button
                onClick={handleStart}
                disabled={loading}
                className="w-full py-6 text-base font-medium transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  borderRadius: "12px",
                  background: loading
                    ? "rgba(255, 255, 255, 0.02)"
                    : "linear-gradient(135deg, rgba(155, 123, 168, 0.233) 0%, rgba(117, 65, 116, 0.841) 100%)",
                  borderTop: loading
                    ? "1.5px dashed rgba(155, 123, 168, 0.15)"
                    : "1.5px dashed rgba(155, 123, 168, 0.4)",
                  borderLeft: loading
                    ? "1.5px solid rgba(155, 123, 168, 0.2)"
                    : "1.5px solid rgba(155, 123, 168, 0.4)",
                  borderRight: loading
                    ? "1.5px solid rgba(155, 123, 168, 0.2)"
                    : "1.5px solid rgba(155, 123, 168, 0.4)",
                  borderBottom: loading
                    ? "1.5px solid rgba(155, 123, 168, 0.2)"
                    : "1.5px solid rgba(155, 123, 168, 0.4)",
                  color: "rgba(255, 255, 255, 0.85)",
                  boxShadow: loading
                    ? "none"
                    : "inset 0 1px 2px rgba(255, 255, 255, 0.05), 0 2px 8px rgba(155, 123, 168, 0.08)",
                }}
              >
                {loading ? "준비 중..." : "시작하기"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentIntro;
