"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSceneConfig } from "@/lib/data/scene-configs";
import { ResultScene } from "@/lib/types/result";
import { AnalyzeAnswers } from "@/lib/types/analyze";
import { CONTENTS } from "@/lib/data/contents";
import SceneContent from "@/components/result/scene-content";

interface PageProps {
  params: Promise<{ share_id: string }>;
}

const ShareResultPage = ({ params }: PageProps) => {
  const [analyzeData, setAnalyzeData] = useState<AnalyzeAnswers | null>(null);
  // 무료씬만 저장. 유료씬 messages는 절대 state에 넣지 않는다.
  const [freeScenes, setFreeScenes] = useState<ResultScene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sceneRefsMap = useRef<Record<number, HTMLDivElement | null>>({});

  // share는 public teaser이므로 인증 후 돌아올 목적지는 result (canonical viewer).
  // share_id = session_id 가정 유지. 향후 share_token 분리 시 수정 필요.
  const handleNavigateWithRedirect = (targetPath: string) => {
    if (typeof window !== "undefined") {
      const redirectTo = analyzeData
        ? `/result/${analyzeData.session_id}`
        : window.location.href;
      sessionStorage.setItem("redirect_to", redirectTo);
      window.location.href = targetPath;
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const param = await params;

        if (typeof window !== "undefined") {
          // TODO: [백엔드 연동] share_id로 결과 데이터 조회 API 호출
          // 현재는 share_id = session_id로 가정하고 localStorage에서 조회
          const stored = localStorage.getItem(
            `veil_analysis_${param.share_id}`,
          );
          if (!stored) {
            setError("공유된 결과를 찾을 수 없어");
            setLoading(false);
            return;
          }
          const data = JSON.parse(stored) as AnalyzeAnswers;
          setAnalyzeData(data);

          // DB 무료씬 조회: is_free === true만 사용. 유료씬 messages는 절대 state에 넣지 않는다.
          // 공유 페이지는 실제 생성 결과만 보여줘야 하므로 mock fallback 없음.
          // fetch 실패 / non-ok / 빈 결과이면 에러 표시.
          let loadedFreeScenes: ResultScene[] = [];
          try {
            const dbRes = await fetch(
              `/api/analyze/${param.share_id}/result-scenes`,
            );
            if (dbRes.ok) {
              const dbData = (await dbRes.json()) as { scenes: ResultScene[] };
              loadedFreeScenes = dbData.scenes.filter((s) => s.is_free);
              console.log(`[share] DB 무료씬 로드: ${loadedFreeScenes.length}개`);
            } else {
              console.warn(`[share] DB scenes non-ok: HTTP ${dbRes.status}`);
            }
          } catch (dbErr) {
            console.warn("[share] DB scenes fetch 실패:", dbErr);
          }

          if (loadedFreeScenes.length === 0) {
            setError("공유된 흐름을 불러오지 못했어");
            setLoading(false);
            return;
          }

          setFreeScenes(loadedFreeScenes);
        }
        setLoading(false);
      } catch {
        setError("데이터 로드 중 오류가 발생했어");
        setLoading(false);
      }
    };
    initData();
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
            style={{ color: "rgba(209,109,172,0.35)" }}
          >
            공유된 흐름을 불러오고 있어
          </p>
          <div className="mx-auto h-5 w-5 animate-spin rounded-full border border-white/15 border-t-white/50" />
        </div>
      </div>
    );
  }

  // ── 에러 ──────────────────────────────────────────────────────
  if (error || !analyzeData || freeScenes.length === 0) {
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

  // 유료씬 teaser 제목 목록: sceneConfig가 canonical source.
  // messages는 포함하지 않는다.
  const paidSceneConfigs = getSceneConfig(analyzeData.content_id).scenes.filter(
    (s) => !s.is_free,
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `
          radial-gradient(circle at 18% 12%, rgba(201, 139, 176, 0.14) 0%, rgba(201, 139, 176, 0.05) 22%, transparent 42%),
          radial-gradient(circle at 82% 38%, rgba(158, 138, 201, 0.10) 0%, rgba(158, 138, 201, 0.04) 24%, transparent 46%),
          radial-gradient(circle at 55% 78%, rgba(201, 139, 176, 0.09) 0%, rgba(201, 139, 176, 0.035) 28%, transparent 52%),
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
          {(() => {
            const content = CONTENTS.find(
              (c) => c.id === analyzeData.content_id,
            );
            return content ? (
              <div className="px-6 py-3 space-y-4">
                {content.thumbnail_url && (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-white/[0.04] shadow-2xl shadow-black/40">
                    <Image
                      src={content.thumbnail_url}
                      alt={content.title}
                      fill
                      priority
                      className="object-cover object-center"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <h1
                    className="text-xl font-medium"
                    style={{ color: "rgba(249,249,229,0.9)" }}
                  >
                    {content.title}
                  </h1>
                  <p
                    className="mb-5 text-sm"
                    style={{ color: "rgba(249,249,229,0.5)" }}
                  >
                    {content.subtitle}
                  </p>
                </div>
              </div>
            ) : null;
          })()}

          {/* 씬 시작 구분점 */}
          <div className="px-3 py-3 text-center">
            <span
              style={{
                color: "rgba(209, 109, 172, 0.25)",
                fontSize: "16px",
                letterSpacing: "0.7em",
              }}
            >
              ◇
            </span>
          </div>

          {/* 무료씬 렌더링: isCurrent={true}로 result와 opacity 동일하게 */}
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
                isUnlocked={true}
                onUnlockScene={() => {}}
                isFirst={sceneIdx === 0}
                isCurrent={true}
              />
            </div>
          ))}

          {/* 유료씬 teaser: 제목만 표시. messages 없음. */}
          {paidSceneConfigs.length > 0 && (
            <>
              <div className="px-6 py-6">
                <div
                  className="h-px"
                  style={{ background: "rgba(201,139,176,0.15)" }}
                />
              </div>

              <div className="px-6 py-5 space-y-4 text-center">
                {paidSceneConfigs.map((sceneConfig, idx) => {
                  const total = paidSceneConfigs.length;
                  const opacity = 0.6 - (idx / total) * 0.45;

                  return (
                    <p
                      key={sceneConfig.index}
                      data-testid="share-paid-teaser-item"
                      className="text-sm cursor-default"
                      style={{
                        color: "rgba(249,249,229,0.6)",
                        opacity: Math.max(opacity, 0.15),
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      {sceneConfig.title}
                    </p>
                  );
                })}
              </div>

              {/* CTA 섹션 */}
              <div data-testid="share-cta-section" className="px-6 py-5 mb-15">
                <div className="space-y-6 max-w-sm mx-auto">
                  <div className="text-center">
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(249,249,229,0.6)" }}
                    >
                      이어서 보려면
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      data-testid="share-cta-login-btn"
                      onClick={() => handleNavigateWithRedirect("/auth")}
                      className="w-full py-3 px-4 rounded-lg text-sm font-medium text-center transition-all duration-200 cursor-pointer"
                      style={{
                        background: "rgba(201,139,176,0.15)",
                        color: "rgba(209,109,172,0.9)",
                        border: "1px solid rgba(201,139,176,0.3)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(201,139,176,0.25)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(201,139,176,0.15)";
                      }}
                    >
                      로그인 하기
                    </button>

                    <button
                      data-testid="share-cta-guest-btn"
                      onClick={() => handleNavigateWithRedirect("/guest")}
                      className="w-full py-3 px-8 rounded-lg text-sm font-medium text-center transition-all duration-200 cursor-pointer"
                      style={{
                        background: "rgba(201,139,176,0.08)",
                        color: "rgba(209,109,172,0.7)",
                        border: "1px solid rgba(201,139,176,0.2)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(201,139,176,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(201,139,176,0.08)";
                      }}
                    >
                      비회원 조회하기
                    </button>
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
