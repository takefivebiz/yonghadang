"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSceneConfig } from "@/lib/data/scene-configs";
import { ResultScene } from "@/lib/types/result";
import { CONTENTS } from "@/lib/data/contents";
import { CATEGORY_LABELS } from "@/lib/types/content";
import SceneContent from "@/components/result/scene-content";

interface PageProps {
  params: Promise<{ share_id: string }>;
}

interface ShareApiResponse {
  session_id: string;
  content_id: string; // contents.slug (e.g. "love-1")
  free_scenes: ResultScene[];
}

const ShareResultPage = ({ params }: PageProps) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [contentId, setContentId] = useState<string | null>(null);
  // 무료씬만 저장. 유료씬 messages는 절대 state에 넣지 않는다.
  const [freeScenes, setFreeScenes] = useState<ResultScene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sceneRefsMap = useRef<Record<number, HTMLDivElement | null>>({});

  // share는 public teaser이므로 인증 후 돌아올 목적지는 result (canonical viewer).
  const handleNavigateWithRedirect = (targetPath: string) => {
    if (typeof window !== "undefined") {
      const redirectTo = sessionId
        ? `/result/${sessionId}`
        : window.location.href;
      sessionStorage.setItem("redirect_to", redirectTo);
      window.location.href = targetPath;
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const { share_id } = await params;

        const res = await fetch(`/api/share/${share_id}`);

        if (!res.ok) {
          const errData = (await res.json()) as { error?: string };
          setError(errData.error ?? "공유된 결과를 찾을 수 없어");
          setLoading(false);
          return;
        }

        const data = (await res.json()) as ShareApiResponse;

        if (data.free_scenes.length === 0) {
          setError("공유된 흐름을 불러오지 못했어");
          setLoading(false);
          return;
        }

        setSessionId(data.session_id);
        setContentId(data.content_id);
        setFreeScenes(data.free_scenes);
        setLoading(false);
      } catch {
        setError("데이터 로드 중 오류가 발생했어");
        setLoading(false);
      }
    };
    void initData();
  }, [params]);

  useEffect(() => {
    if (freeScenes.length === 0) return;

    const observer = new IntersectionObserver(
      () => {
        // IntersectionObserver for scene tracking (currently unused)
      },
      {
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: "-68px 0px -200px 0px",
      },
    );

    Object.values(sceneRefsMap.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [freeScenes]);

  // ── 로딩 ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p
            className="mb-6 text-[11px] tracking-widest"
            style={{ color: "rgba(143,122,216,0.42)" }}
          >
            공유된 흐름을 불러오고 있어
          </p>
          <div className="mx-auto h-5 w-5 animate-spin rounded-full border border-white/15 border-t-white/50" />
        </div>
      </div>
    );
  }

  // ── 에러 ──────────────────────────────────────────────────────
  if (error || !contentId || freeScenes.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <p className="mb-8 text-sm" style={{ color: "rgba(249,249,229,0.35)" }}>
          {error || "결과를 찾을 수 없어요"}
        </p>
        <Link
          href="/"
          className="text-xs transition-opacity duration-200 opacity-40 hover:opacity-70"
          style={{ color: "rgba(94,153,171,0.9)" }}
        >
          처음으로 돌아가기
        </Link>
      </div>
    );
  }

  // 유료씬 teaser 제목: sceneConfig가 canonical source. messages 없음.
  const sceneConfig = getSceneConfig(contentId);
  const getSceneDisplayTitle = (scene: ResultScene): string =>
    sceneConfig.scenes.find(
      (configScene) => configScene.index === scene.scene_index,
    )?.title ?? scene.scene_title;
  const getSceneSubtitle = (sceneIndex: number): string | undefined =>
    sceneConfig.scenes.find((scene) => scene.index === sceneIndex)?.subtitle;
  const paidSceneConfigs = sceneConfig.scenes.filter(
    (s) => !s.is_free,
  );
  const content = CONTENTS.find((c) => c.id === contentId);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `
          radial-gradient(circle at 18% 12%, rgba(143, 122, 216, 0.12) 0%, rgba(143, 122, 216, 0.045) 22%, transparent 42%),
          radial-gradient(circle at 82% 38%, rgba(158, 138, 201, 0.10) 0%, rgba(158, 138, 201, 0.04) 24%, transparent 46%),
          radial-gradient(circle at 55% 78%, rgba(143, 122, 216, 0.08) 0%, rgba(143, 122, 216, 0.03) 28%, transparent 52%),
          linear-gradient(180deg, #11111B 0%, #151222 42%, #1A1222 72%, #11111B 100%)
        `,
        backgroundAttachment: "fixed",
      }}
    >
      {/* ── 헤더 ──────────────────────────────────────── */}
      <header className="sticky top-0 z-40">
        <div className="h-6" />
      </header>

      {/* ── 메인 콘텐츠 영역 ──────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="w-full max-w-lg mx-auto">
          {/* 콘텐츠 헤더 */}
          {content && (
            <div className="px-5 pt-6 pb-2 space-y-4 mt-10">
              <div
                style={{
                  display: "flex",
                  gap: "2px",
                  marginBottom: "-1px",
                }}
              >
                <div
                  style={{
                    flex: "0 1 auto",
                    height: "34px",
                    background: "rgba(60, 45, 65, 0.30)",
                    borderTop: "1px solid rgba(143, 122, 216, 0.12)",
                    borderRight: "1px solid rgba(143, 122, 216, 0.12)",
                    borderLeft: "1px solid rgba(143, 122, 216, 0.12)",
                    borderBottom: "1px solid rgba(143, 122, 216, 0.12)",
                    borderRadius: "12px 12px 0 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: "14px",
                    paddingRight: "14px",
                    opacity: 0.46,
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "400",
                      color: "rgba(255, 255, 255, 0.48)",
                      letterSpacing: "0.02em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {CATEGORY_LABELS[content.category]}
                  </span>
                </div>
                <div
                  style={{
                    flex: "0 1 auto",
                    height: "34px",
                    background: "rgba(60, 45, 65, 0.36)",
                    borderTop: "1px solid rgba(143, 122, 216, 0.18)",
                    borderRight: "1px solid rgba(143, 122, 216, 0.18)",
                    borderLeft: "1px solid rgba(143, 122, 216, 0.18)",
                    borderBottom: "1px solid rgba(143, 122, 216, 0.18)",
                    borderRadius: "12px 12px 0 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: "14px",
                    paddingRight: "14px",
                    opacity: 0.58,
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "400",
                      color: "rgba(255, 255, 255, 0.55)",
                      letterSpacing: "0.02em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    공개 기록
                  </span>
                </div>
                <div
                  style={{
                    flex: "0 1 auto",
                    height: "34px",
                    background: "rgba(92, 74, 132, 0.34)",
                    borderTop: "1px solid rgba(143, 122, 216, 0.30)",
                    borderRight: "1px solid rgba(143, 122, 216, 0.30)",
                    borderLeft: "1px solid rgba(143, 122, 216, 0.30)",
                    borderBottom: "none",
                    borderRadius: "12px 12px 0 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: "16px",
                    paddingRight: "16px",
                    opacity: 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "rgba(255, 255, 255, 0.92)",
                      letterSpacing: "0.02em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    공유 리포트
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-b-[16px] rounded-tr-[16px] border border-accent/10 bg-white/[0.015] px-4 py-3.5">
                {content.thumbnail_url && (
                  <div className="relative h-15 w-15 flex-shrink-0 overflow-hidden rounded-[10px] bg-white/[0.025] opacity-85">
                    <Image
                      src={content.thumbnail_url}
                      alt={content.title}
                      fill
                      priority
                      className="object-cover object-center"
                    />
                  </div>
                )}

                <div className="min-w-0 space-y-1">
                  <p
                    className="text-[10px] font-medium tracking-[0.16em]"
                    style={{ color: "rgba(143, 122, 216, 0.66)" }}
                  >
                    SHARED REPORT
                  </p>
                  <h1
                    className="text-base font-medium leading-snug"
                    style={{ color: "rgba(249,249,229,0.88)" }}
                  >
                    {content.title}
                  </h1>
                  <p
                    className="line-clamp-1 text-xs"
                    style={{ color: "rgba(249,249,229,0.42)" }}
                  >
                    공개된 기록 일부
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 씬 시작 구분점 */}
          <div className="px-3 py-3 text-center">
            <span
              style={{
                color: "rgba(143, 122, 216, 0.28)",
                fontSize: "16px",
                letterSpacing: "0.7em",
              }}
            >
              ◇
            </span>
          </div>

          {/* 무료씬 렌더링: isCurrent={true}로 result와 opacity 동일 */}
          {freeScenes.map((scene, sceneIdx) => (
            <div
              key={scene.id}
              data-scene-idx={sceneIdx}
              ref={(el) => {
                if (el) sceneRefsMap.current[sceneIdx] = el;
              }}
            >
              <SceneContent
                scene={scene}
                sceneTitle={getSceneDisplayTitle(scene)}
                sceneSubtitle={getSceneSubtitle(scene.scene_index)}
                isUnlocked={true}
                onUnlockScene={() => {}}
                isFirst={sceneIdx === 0}
                isCurrent={true}
              />
            </div>
          ))}

          {/* 잠긴 기록: 제목만 표시. messages 없음. */}
          {paidSceneConfigs.length > 0 && (
            <>
              <div className="px-6 py-5">
                <div
                  className="h-px"
                  style={{ background: "rgba(143,122,216,0.10)" }}
                />
              </div>

              <div className="px-6 py-3">
                <div
                  className="rounded-[14px] px-4 py-4"
                  style={{
                    background: "rgba(143, 122, 216, 0.025)",
                    border: "1px solid rgba(143, 122, 216, 0.08)",
                  }}
                >
                  <p
                    className="mb-4 text-[10px] font-medium tracking-[0.14em]"
                    style={{ color: "rgba(143, 122, 216, 0.46)" }}
                  >
                    잠긴 기록
                  </p>
                  <div className="space-y-3">
                    {paidSceneConfigs.map((sceneConfig) => (
                      <div
                        key={sceneConfig.index}
                        data-testid="share-paid-teaser-item"
                        className="flex items-start gap-3"
                      >
                        <span
                          className="mt-0.5 text-[10px] tracking-widest"
                          style={{ color: "rgba(143, 122, 216, 0.48)" }}
                        >
                          {String(sceneConfig.index).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className="truncate text-[10px] leading-relaxed"
                            style={{ color: "rgba(143, 122, 216, 0.40)" }}
                          >
                            {sceneConfig.title}
                          </p>
                          <p
                            className="mt-0.5 truncate text-xs leading-snug"
                            style={{ color: "rgba(249,249,229,0.34)" }}
                          >
                            {sceneConfig.subtitle ?? sceneConfig.title}
                          </p>
                        </div>
                        <svg
                          className="mt-1 h-3 w-3 flex-shrink-0"
                          style={{ color: "rgba(143, 122, 216, 0.42)" }}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7 10V8a5 5 0 0 1 10 0v2" />
                          <rect x="5" y="10" width="14" height="10" rx="2" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA 섹션 */}
              <div data-testid="share-cta-section" className="px-6 py-5 mb-15">
                <div className="space-y-5 max-w-sm mx-auto">
                  <div>
                    <p
                      className="text-sm leading-relaxed text-center"
                      style={{ color: "rgba(249,249,229,0.68)" }}
                    >
                      이 기록은 여기서부터 잠겨 있어.
                      <br />
                      이어 보려면 로그인이 필요해.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      data-testid="share-cta-login-btn"
                      onClick={() => handleNavigateWithRedirect("/auth")}
                      className="w-full py-3 px-4 rounded-lg text-sm font-medium text-center transition-all duration-200 cursor-pointer"
                      style={{
                        background: "rgba(143,122,216,0.18)",
                        color: "rgba(249,249,229,0.88)",
                        border: "1px solid rgba(143,122,216,0.28)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(143,122,216,0.24)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(143,122,216,0.18)";
                      }}
                    >
                      기록 이어보기
                    </button>

                    <button
                      data-testid="share-cta-guest-btn"
                      onClick={() => handleNavigateWithRedirect("/guest")}
                      className="w-full py-3 px-8 rounded-lg text-sm font-medium text-center transition-all duration-200 cursor-pointer"
                      style={{
                        background: "rgba(143,122,216,0.07)",
                        color: "rgba(249,249,229,0.64)",
                        border: "1px solid rgba(143,122,216,0.16)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(143,122,216,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(143,122,216,0.07)";
                      }}
                    >
                      비회원으로 조회하기
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-5 pt-2">
                    <Link
                      href="/"
                      className="text-xs transition-opacity duration-200 hover:opacity-80"
                      style={{ color: "rgba(249,249,229,0.44)" }}
                    >
                      나도 의뢰하기
                    </Link>
                    <Link
                      href="/"
                      className="text-xs transition-opacity duration-200 hover:opacity-80"
                      style={{ color: "rgba(249,249,229,0.30)" }}
                    >
                      다른 케이스 보기
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="h-20" />
        </div>
      </main>

      {/* TODO: [OG 메타태그] og:title, og:description, og:image 설정 */}
      {/* TODO: [OG 이미지] 동적 OG 이미지 생성 (/api/og 또는 외부 서비스) */}
    </div>
  );
};

export default ShareResultPage;
