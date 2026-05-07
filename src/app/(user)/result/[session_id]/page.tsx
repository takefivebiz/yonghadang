"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { generateMockResultScenes } from "@/lib/data/dummy-result-scenes";
import { ResultScene } from "@/lib/types/result";
import { AnalyzeAnswers } from "@/lib/types/analyze";
import SceneContent from "@/components/result/scene-content";
import FlowOverview from "@/components/result/flow-overview";
import ProgressIndicator from "@/components/result/progress-indicator";

interface PageProps {
  params: Promise<{ session_id: string }>;
}

const ResultPage = ({ params }: PageProps) => {
  const [analyzeData, setAnalyzeData] = useState<AnalyzeAnswers | null>(null);
  const [scenes, setScenes] = useState<ResultScene[]>([]);
  const [unlockedScenes, setUnlockedScenes] = useState<number[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sceneRefsMap = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const initData = async () => {
      try {
        const param = await params;

        if (typeof window !== "undefined") {
          const stored = localStorage.getItem(
            `veil_analysis_${param.session_id}`,
          );
          if (!stored) {
            setError("결과를 찾을 수 없어");
            setLoading(false);
            return;
          }
          const data = JSON.parse(stored) as AnalyzeAnswers;
          setAnalyzeData(data);
          const mockScenes = generateMockResultScenes(data.content_id);
          setScenes(mockScenes);

          // 무료 scene은 자동 unlock
          const freeIndices = mockScenes
            .filter((s) => s.is_free)
            .map((s) => s.scene_index);
          setUnlockedScenes(freeIndices);
        }
        setLoading(false);
      } catch {
        setError("데이터 로드 중 오류가 발생했어");
        setLoading(false);
      }
    };
    initData();
  }, [params]);

  // IntersectionObserver로 현재 활성 scene 추적
  useEffect(() => {
    if (scenes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxVisibility = 0;
        let activeSceneIdx = 0;

        // 모든 entries를 순회해서 가장 높은 visibility를 가진 scene 찾기
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio;

          // data-index attribute에서 배열 index 읽기
          const dataIndex = (entry.target as HTMLElement).getAttribute(
            "data-scene-idx",
          );
          if (dataIndex === null) return;

          const sceneIdx = parseInt(dataIndex, 10);
          if (sceneIdx < 0 || sceneIdx >= scenes.length) return;

          // 현재 scene의 visibility가 최대값보다 크면 업데이트
          if (ratio > maxVisibility) {
            maxVisibility = ratio;
            activeSceneIdx = sceneIdx;
          }
        });

        // 최소 20% 이상 보이는 scene만 active로 설정
        if (maxVisibility >= 0.2) {
          setCurrentSceneIndex(activeSceneIdx);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: "-68px 0px -200px 0px",
      },
    );

    // 모든 scene ref에 observer 적용
    Object.values(sceneRefsMap.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [scenes]);

  // 마지막 무료 scene의 index 구하기
  const lastFreeSceneIndex = scenes.reduce((max, scene) => {
    if (scene.is_free) return Math.max(max, scene.scene_index);
    return max;
  }, 0);

  const handleUnlockScene = (sceneIndex: number) => {
    // TODO: [결제 구현] 개별 scene 구매 로직
    setUnlockedScenes((prev) => [...new Set([...prev, sceneIndex])]);
  };

  const handleUnlockAll = () => {
    // TODO: [결제 구현] 전체 scene 구매 로직
    const allPaidIndices = scenes
      .filter((s) => !s.is_free)
      .map((s) => s.scene_index);
    setUnlockedScenes((prev) => [...new Set([...prev, ...allPaidIndices])]);
  };

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
          {error || "결과를 찾을 수 없어"}
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

  const paidSceneCount = scenes.filter((s) => !s.is_free).length;

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

      {/* ── Progress Indicator Area ─────────────────── */}
      <div className="sticky top-12 z-40 h-10 flex items-center justify-center">
        <ProgressIndicator
          scenes={scenes}
          unlockedScenes={unlockedScenes}
          currentSceneIndex={currentSceneIndex}
        />
      </div>

      {/* ── 메인 콘텐츠 영역 ──────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">
          {/* 첫 무료 scene 감지 */}
          {(() => {
            const freeScenes = scenes.filter((s) => s.is_free);
            const firstFreeSceneId =
              freeScenes.length > 0 ? freeScenes[0].id : null;

            return (
              <>
                {/* 무료 Scene 렌더링 */}
                {scenes.map((scene, sceneIdx) => {
                  if (!scene.is_free) return null;
                  const isUnlocked = unlockedScenes.includes(scene.scene_index);
                  const isFirst = scene.id === firstFreeSceneId;

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
                        isUnlocked={isUnlocked}
                        onUnlockScene={() =>
                          handleUnlockScene(scene.scene_index)
                        }
                        isFirst={isFirst}
                      />
                    </div>
                  );
                })}

                {/* 무료 Scene 이후 Flow Overview */}
                {paidSceneCount > 0 && (
                  <FlowOverview
                    scenes={scenes}
                    unlockedScenes={unlockedScenes}
                    onUnlockAll={handleUnlockAll}
                  />
                )}

                {/* 유료 Scene 렌더링 */}
                {scenes.map((scene, sceneIdx) => {
                  if (scene.is_free) return null;
                  const isUnlocked = unlockedScenes.includes(scene.scene_index);

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
                        isUnlocked={isUnlocked}
                        onUnlockScene={() =>
                          handleUnlockScene(scene.scene_index)
                        }
                        isFirst={false}
                      />
                    </div>
                  );
                })}
              </>
            );
          })()}

          {/* 페이지 끝 spacing */}
          <div className="h-20" />
        </div>
      </main>
    </div>
  );
};

export default ResultPage;
