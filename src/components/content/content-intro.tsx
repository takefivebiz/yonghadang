"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Content, CATEGORY_LABELS } from "@/lib/types/content";
import { getSceneConfig } from "@/lib/data/scene-configs";

interface ContentIntroProps {
  content: Content;
}

const ContentIntro = ({ content }: ContentIntroProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const isQaMode =
    searchParams.get("qa") === "1" ||
    process.env.NEXT_PUBLIC_QA_MODE === "true";
  const [resumableSessionId, setResumableSessionId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (isQaMode || typeof window === "undefined") return;

    const lastSid = localStorage.getItem(`veil_last_session_${content.id}`);
    if (!lastSid) return;

    const hasAnalysis = Boolean(
      localStorage.getItem(`veil_analysis_${lastSid}`),
    );
    if (hasAnalysis) {
      setResumableSessionId(lastSid);
    }
  }, [content.id, isQaMode]);

  const handleResume = () => {
    if (!resumableSessionId) return;
    router.push(`/analyze/${resumableSessionId}?content_id=${content.id}`);
  };

  const handleStart = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`veil_last_session_${content.id}`);
    }
    setResumableSessionId(null);
    setLoading(true);

    if (isQaMode) {
      const localSessionId = crypto.randomUUID();
      const loopFlag = searchParams.get("loop") === "1" ? "&loop=1" : "";
      router.push(
        `/analyze/${localSessionId}?content_id=${content.id}&qa=1${loopFlag}`,
      );
      return;
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content_id: content.id }),
      });

      if (!res.ok) {
        throw new Error(`세션 생성 실패 (HTTP ${res.status})`);
      }

      const data = (await res.json()) as { session_id: string };
      router.push(`/analyze/${data.session_id}?content_id=${content.id}`);
    } catch (err) {
      console.error("[handleStart] API 실패, fallback UUID 사용:", err);
      const fallbackSessionId = crypto.randomUUID();
      router.push(`/analyze/${fallbackSessionId}?content_id=${content.id}`);
    }
  };

  const MAX_PREVIEW_FLOWS = 4;
  const sceneConfig = getSceneConfig(content.id);
  const previewScenes = sceneConfig.scenes.slice(0, MAX_PREVIEW_FLOWS);
  const remainingCount = sceneConfig.scenes.length - previewScenes.length;

  return (
    <div className="w-full max-w-full relative overflow-x-hidden">
      <main className="relative z-10 w-full flex flex-col justify-between px-4 sm:px-5 py-6 pb-50">
        {/* 폴더 Wrapper */}
        <div className="w-full mx-auto pt-4" style={{ maxWidth: "540px" }}>
          {/* 탭 Row */}
          <div
            style={{
              display: "flex",
              gap: "2px",
              marginBottom: "-1px",
            }}
          >
            {/* 탭 1: 활성 (연애·결혼) */}
            <div
              style={{
                flex: "0 1 auto",
                height: "38px",
                background: "rgba(92, 74, 132, 0.32)",
                borderTop: "1px solid rgba(143, 122, 216, 0.24)",
                borderRight: "1px solid rgba(143, 122, 216, 0.24)",
                borderLeft: "1px solid rgba(143, 122, 216, 0.24)",
                borderBottom: "none",
                borderRadius: "14px 14px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: "20px",
                paddingRight: "20px",
                opacity: 1,
                transition: "all 300ms ease",
              }}
            >
              <span
                className="text-[13px] lg:text-[15px]"
                style={{
                  fontWeight: "400",
                  color: "rgba(255, 255, 255, 0.90)",
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {CATEGORY_LABELS[content.category]}
              </span>
            </div>

            {/* 탭 2: 비활성 (기록 작성 중) */}
            <div
              style={{
                flex: "0 1 auto",
                height: "38px",
                background: "rgba(60, 45, 65, 0.4)",
                borderTop: "1px solid rgba(143, 122, 216, 0.28)",
                borderRight: "1px solid rgba(143, 122, 216, 0.28)",
                borderLeft: "1px solid rgba(143, 122, 216, 0.28)",
                borderBottom: "1px solid rgba(143, 122, 216, 0.28)",
                borderRadius: "14px 14px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: "20px",
                paddingRight: "20px",
                opacity: 0.55,
                transition: "all 300ms ease",
                cursor: "not-allowed",
                pointerEvents: "none",
              }}
            >
              <span
                className="text-[12px] lg:text-[14px]"
                style={{
                  fontWeight: "400",
                  color: "rgba(255, 255, 255, 0.55)",
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                기록 작성 중
              </span>
            </div>

            {/* 탭 3: 비활성 (결과 리포트) */}
            <div
              style={{
                flex: "0 1 auto",
                height: "38px",
                background: "rgba(50, 35, 60, 0.3)",
                borderTop: "1px solid rgba(143, 122, 216, 0.10)",
                borderRight: "1px solid rgba(143, 122, 216, 0.10)",
                borderLeft: "1px solid rgba(143, 122, 216, 0.10)",
                borderBottom: "1px solid rgba(143, 122, 216, 0.10)",
                borderRadius: "14px 14px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: "20px",
                paddingRight: "20px",
                opacity: 0.45,
                transition: "all 300ms ease",
                cursor: "not-allowed",
                pointerEvents: "none",
              }}
            >
              <span
                className="text-[12px] lg:text-[14px]"
                style={{
                  fontWeight: "400",
                  color: "rgba(255, 255, 255, 0.45)",
                  letterSpacing: "0.02em",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                결과 리포트
              </span>
            </div>
          </div>

          {/* 폴더 Body */}
          <div
            className="relative"
            style={{
              background: "rgba(60, 45, 65, 0.3)",
              border: "1px solid rgba(143, 122, 216, 0.22)",
              borderTopLeftRadius: "0",
              borderTopRightRadius: "18px",
              borderBottomLeftRadius: "18px",
              borderBottomRightRadius: "18px",
              overflow: "hidden",
            }}
          >
            {/* 섹션 1: 메인 콘텐츠 — 썸네일 + 제목 + 부제 */}
            <div style={{ padding: "24px 22px 10px 20px" }}>
              <div className="flex gap-4 items-center">
                {/* 썸네일 */}
                <div className="w-24 shrink-0">
                  <div className="relative aspect-square overflow-hidden rounded-lg">
                    {content.thumbnail_url ? (
                      <Image
                        src={content.thumbnail_url}
                        alt={content.title}
                        fill
                        sizes="96px"
                        priority
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-surface/40" />
                    )}
                  </div>
                </div>

                {/* 제목/부제 */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-[16px] lg:text-[20px] font-medium leading-[1.26] text-white/85 mb-1 line-clamp-1">
                    {content.title}
                  </h1>
                  {content.subtitle && (
                    <p className="text-[12px] lg:text-[15px] leading-[1.38] text-white/55 line-clamp-2 text-left">
                      {content.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 섹션 2: 라벨 */}
            <div style={{ padding: "14px 24px 10px 24px" }}>
              <div className="flex items-center gap-3">
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(143, 122, 216, 0.12)",
                  }}
                />
                <span
                  className="text-[11px] font-medium tracking-wider whitespace-nowrap"
                  style={{ color: "rgba(143, 122, 216, 0.4)" }}
                >
                  이 리포트에 포함된 기록
                </span>
                <div
                  style={{
                    flex: 1,
                    height: "1px",
                    background: "rgba(143, 122, 216, 0.12)",
                  }}
                />
              </div>
            </div>

            {/* 섹션 3: 파일 리스트 */}
            <div style={{ padding: "8px 24px 24px 24px" }}>
              <div className="space-y-4">
                {previewScenes.length > 0 && (
                  <div className="space-y-4">
                    {previewScenes.map((scene) => (
                      <div key={scene.index} className="flex flex-col gap-0">
                        <div className="flex gap-2">
                          <svg
                            className="w-3 h-3 shrink-0 self-start mt-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{ color: "rgba(143, 122, 216, 0.45)" }}
                          >
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                            <polyline points="13 2 13 9 20 9" />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] lg:text-[12px] font-medium text-white/45 uppercase tracking-widest">
                              FILE {String(scene.index).padStart(2, "0")}
                              {scene.subtitle && ` ${scene.title}`}
                            </span>
                            <p className="mt-0.5 text-[13px] lg:text-[15px] leading-[1.45] text-white/70">
                              {scene.subtitle ?? scene.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* 잠긴 기록 표시 */}
                    {remainingCount > 0 && (
                      <div className="pt-2 mt-2 ml-5">
                        <div className="flex items-center gap-2">
                          <p
                            className="text-[12px] lg:text-[14px]"
                            style={{ color: "rgba(255, 255, 255, 0.35)" }}
                          >
                            +
                          </p>
                          <span className="text-[12px] lg:text-[14px]">🔒</span>
                          <p
                            className="text-[13px] lg:text-[15px]"
                            style={{ color: "rgba(255, 255, 255, 0.35)" }}
                          >
                            {remainingCount}개의 잠긴 기록
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 섹션 4: CTA 버튼 */}
            <div style={{ padding: "24px 24px 24px 24px" }}>
              {resumableSessionId ? (
                /* 이어하기 가능한 session 존재 → 이어하기 + 새로 시작하기 */
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={handleResume}
                    className="w-full py-4 text-base lg:text-[18px] font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      borderRadius: "12px",
                      background: "rgba(143, 122, 216, 0.1)",
                      border: "1px solid rgba(143, 122, 216, 0.2)",
                      color: "rgba(255, 255, 255, 0.85)",
                      boxShadow:
                        "0 2px 4px rgba(143, 122, 216, 0.12), 0 -1px 2px rgba(255, 255, 255, 0.08) inset",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(143, 122, 216, 0.35)";
                      e.currentTarget.style.background =
                        "rgba(143, 122, 216, 0.13)";
                      e.currentTarget.style.boxShadow =
                        "0 3px 6px rgba(143, 122, 216, 0.15), 0 -1px 2px rgba(255, 255, 255, 0.1) inset";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(143, 122, 216, 0.2)";
                      e.currentTarget.style.background =
                        "rgba(143, 122, 216, 0.1)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 4px rgba(143, 122, 216, 0.12), 0 -1px 2px rgba(255, 255, 255, 0.08) inset";
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 1px 2px rgba(143, 122, 216, 0.08) inset";
                    }}
                  >
                    이어하기
                  </button>
                  <button
                    onClick={handleStart}
                    disabled={loading}
                    className="w-full py-4 text-base lg:text-[18px] font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{
                      borderRadius: "12px",
                      background: "rgba(143, 122, 216, 0.16)",
                      border: "1px solid rgba(143, 122, 216, 0.3)",
                      color: "rgba(255, 255, 255, 0.95)",
                      boxShadow:
                        "0 4px 8px rgba(143, 122, 216, 0.14), 0 -1px 2px rgba(255, 255, 255, 0.08) inset",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.borderColor =
                          "rgba(143, 122, 216, 0.35)";
                        e.currentTarget.style.background =
                          "rgba(143, 122, 216, 0.14)";
                        e.currentTarget.style.boxShadow =
                          "0 3px 6px rgba(143, 122, 216, 0.15), 0 -1px 2px rgba(255, 255, 255, 0.1) inset";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.borderColor =
                          "rgba(143, 122, 216, 0.3)";
                        e.currentTarget.style.background =
                          "rgba(143, 122, 216, 0.16)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 8px rgba(143, 122, 216, 0.14), 0 -1px 2px rgba(255, 255, 255, 0.08) inset";
                      }
                    }}
                    onMouseDown={(e) => {
                      if (!loading) {
                        e.currentTarget.style.boxShadow =
                          "0 1px 2px rgba(143, 122, 216, 0.08) inset";
                      }
                    }}
                  >
                    {loading ? "준비 중..." : "새로 시작하기"}
                  </button>
                </div>
              ) : (
                /* 신규 진입 → 기존 단일 시작하기 버튼 */
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full py-4 text-base lg:text-[18px] font-medium transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    borderRadius: "12px",
                    background: "rgba(143, 122, 216, 0.16)",
                    border: "1px solid rgba(143, 122, 216, 0.3)",
                    color: "rgba(255, 255, 255, 0.95)",
                    boxShadow:
                      "0 4px 8px rgba(143, 122, 216, 0.14), 0 -1px 2px rgba(255, 255, 255, 0.08) inset",
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.borderColor =
                        "rgba(143, 122, 216, 0.35)";
                      e.currentTarget.style.background =
                        "rgba(143, 122, 216, 0.14)";
                      e.currentTarget.style.boxShadow =
                        "0 3px 6px rgba(143, 122, 216, 0.15), 0 -1px 2px rgba(255, 255, 255, 0.1) inset";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.borderColor =
                        "rgba(143, 122, 216, 0.2)";
                      e.currentTarget.style.background =
                        "rgba(143, 122, 216, 0.12)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 4px rgba(143, 122, 216, 0.12), 0 -1px 2px rgba(255, 255, 255, 0.08) inset";
                    }
                  }}
                  onMouseDown={(e) => {
                    if (!loading) {
                      e.currentTarget.style.boxShadow =
                        "0 1px 2px rgba(143, 122, 216, 0.08) inset";
                    }
                  }}
                >
                  {loading ? "준비 중..." : "시작하기 ›"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentIntro;
