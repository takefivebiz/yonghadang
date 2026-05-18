"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { generateMockResultScenes } from "@/lib/data/dummy-result-scenes";
import { ResultScene } from "@/lib/types/result";
import { AnalyzeAnswers } from "@/lib/types/analyze";
import { CONTENTS } from "@/lib/data/contents";
import SceneContent from "@/components/result/scene-content";

interface PageProps {
  params: Promise<{ share_id: string }>;
}

const ShareResultPage = ({ params }: PageProps) => {
  const [analyzeData, setAnalyzeData] = useState<AnalyzeAnswers | null>(null);
  const [scenes, setScenes] = useState<ResultScene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sceneRefsMap = useRef<Record<number, HTMLDivElement | null>>({});

  // redirect_to를 sessionStorage에 저장하고 이동
  const handleNavigateWithRedirect = (targetPath: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("redirect_to", window.location.href);
      window.location.href = targetPath;
    }
  };

  // 권한 검증 및 /result로 자동 이동
  useEffect(() => {
    const verifyAccessAndRedirect = async () => {
      if (typeof window !== "undefined" && analyzeData) {
        // TODO: [백엔드 연동] 실제 권한 검증 API 호출
        // POST /api/verify-access 또는 /api/guest/verify

        const userId = localStorage.getItem("veil_user_id");
        const guestId = sessionStorage.getItem("guest_id");

        let hasAccess = false;

        if (userId) {
          // 로그인 사용자: 더미로 권한 있다고 가정
          // 실제로는 백엔드에서 userId와 session_id로 권한 확인
          hasAccess = true;
        } else if (guestId) {
          // 비회원: guest_id가 있으면 권한 있다고 가정
          // 실제로는 백엔드에서 guest_id와 phone, pin으로 권한 확인
          hasAccess = true;
        }

        if (hasAccess) {
          // 권한 있음 → /result로 이동
          window.location.href = `/result/${analyzeData.session_id}`;
        }
        // 권한 없음 → /share에서 계속 표시
      }
    };

    // analyzeData가 로드된 후 권한 검증
    if (analyzeData) {
      verifyAccessAndRedirect();
    }
  }, [analyzeData]);

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

          // DB 무료씬 조회: mock보다 실제 AI 생성 결과 우선.
          // is_free === true 만 사용한다. 유료씬 messages는 절대 노출하지 않는다.
          // 실패하거나 결과가 없으면 기존 mock fallback을 유지한다.
          let freeScenesFromDb: ResultScene[] = [];
          try {
            const dbRes = await fetch(
              `/api/analyze/${param.share_id}/result-scenes`,
            );
            if (dbRes.ok) {
              const dbData = (await dbRes.json()) as { scenes: ResultScene[] };
              freeScenesFromDb = dbData.scenes.filter((s) => s.is_free);
              if (freeScenesFromDb.length > 0) {
                console.log(
                  `[share] DB 무료씬 로드: ${freeScenesFromDb.length}개`,
                );
              } else {
                console.log("[share] DB 무료씬 없음 → mock fallback");
              }
            } else {
              console.warn(
                `[share] DB scenes non-ok: HTTP ${dbRes.status} → mock fallback`,
              );
            }
          } catch (dbErr) {
            console.warn("[share] DB scenes fetch 실패 → mock fallback:", dbErr);
          }

          // DB 무료씬이 있으면 사용.
          // 유료씬은 teaser 제목 표시용으로 mock 구조를 유지한다 (messages는 share 페이지에서 렌더되지 않음).
          // DB 없음/실패 → 전체 mock fallback.
          const mockScenes = generateMockResultScenes(data.content_id);
          const scenesToRender =
            freeScenesFromDb.length > 0
              ? [...freeScenesFromDb, ...mockScenes.filter((s) => !s.is_free)].sort(
                  (a, b) => a.scene_index - b.scene_index,
                )
              : mockScenes;
          setScenes(scenesToRender);

        }
        setLoading(false);
      } catch {
        setError("데이터 로드 중 오류가 발생했어요");
        setLoading(false);
      }
    };
    initData();
  }, [params]);

  // IntersectionObserver로 현재 활성 scene 추적
  useEffect(() => {
    if (scenes.length === 0) return;

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
  }, [scenes]);

  // ── 로딩 ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p
            className="mb-6 text-[11px] tracking-widest uppercase"
            style={{ color: "rgba(209,109,172,0.35)" }}
          >
            reading your energy
          </p>
          <div className="mx-auto h-5 w-5 animate-spin rounded-full border border-white/15 border-t-white/50" />
        </div>
      </div>
    );
  }

  // ── 에러 ──────────────────────────────────────────────────────
  if (error || !analyzeData || scenes.length === 0) {
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
          {analyzeData &&
            (() => {
              const content = CONTENTS.find(
                (c) => c.id === analyzeData.content_id,
              );
              return content ? (
                <div className="px-6 py-3 space-y-4">
                  {/* 썸네일 이미지 */}
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

                  {/* 제목 */}
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

          {/* 무료 Scene 렌더링 */}
          {scenes.map((scene, sceneIdx) => {
            if (!scene.is_free) return null;

            return (
              <div
                key={scene.id}
                data-scene-idx={sceneIdx}
                ref={(el) => {
                  if (el) {
                    sceneRefsMap.current[sceneIdx] = el;
                  }
                }}
              >
                <SceneContent
                  scene={scene}
                  isUnlocked={true}
                  onUnlockScene={() => {}}
                  isFirst={sceneIdx === 0}
                />
              </div>
            );
          })}

          {/* 유료 Scene 미리보기 (제목만 표시) */}
          {scenes.some((s) => !s.is_free) && (
            <>
              {/* 구분선 */}
              <div className="px-6 py-6">
                <div
                  className="h-px"
                  style={{ background: "rgba(201,139,176,0.15)" }}
                />
              </div>

              {/* 유료 Scene 제목 목록 (Fade-out) */}
              <div className="px-6 py-5 space-y-4 text-center">
                {scenes.map((scene, idx) => {
                  if (scene.is_free) return null;

                  const paidScenes = scenes.filter((s) => !s.is_free);
                  const totalPaid = paidScenes.length;
                  // 아래로 갈수록 opacity 감소 (0.6 → 0.15)
                  const opacity = 0.6 - (idx / totalPaid) * 0.45;

                  return (
                    <p
                      key={scene.id}
                      data-testid="share-paid-teaser-item"
                      className="text-sm cursor-default"
                      style={{
                        color: "rgba(249,249,229,0.6)",
                        opacity: Math.max(opacity, 0.15),
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      {scene.scene_title}
                    </p>
                  );
                })}
              </div>

              {/* CTA 섹션 */}
              <div data-testid="share-cta-section" className="px-6 py-5 mb-15">
                <div className="space-y-6 max-w-sm mx-auto">
                  {/* 문구 */}
                  <div className="text-center">
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(249,249,229,0.6)" }}
                    >
                      이어서 보려면
                    </p>
                  </div>

                  {/* CTA 버튼 그룹 */}
                  <div className="space-y-3">
                    {/* 로그인 하기 */}
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

                    {/* 비회원 조회하기 */}
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
