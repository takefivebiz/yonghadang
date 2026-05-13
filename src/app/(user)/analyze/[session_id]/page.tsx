"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TypeAInput from "@/components/analyze/type-a-input";
import CorrectionQuestions from "@/components/analyze/correction-questions";
import ReactionBubble from "@/components/analyze/reaction-bubble";
import { getInputConfig } from "@/lib/data/dummy-analyze-config";
import { AnalyzeState, Answer, AnalyzeAnswers } from "@/lib/types/analyze";
import { DUMMY_CONTENTS } from "@/lib/data/dummy-contents";
import { DUMMY_INPUT_CONFIGS } from "@/lib/data/dummy-analyze-config";
import { getSceneConfig } from "@/lib/data/dummy-scene-configs";
import type { ResultScene } from "@/lib/types/result";

interface PageProps {
  params: Promise<{ session_id: string }>;
}

type Stage =
  | "free_input"
  | "reaction_after_free"
  | "correction_questions"
  | "completing";

// ── Debug flag: generate loading 화면만 고정으로 보기 (개발용) ──────────────────
// .env.local에 NEXT_PUBLIC_FORCE_GENERATE_LOADING=true로 설정하면 활성화
// 실제 generate 호출 없이 loading 화면만 표시함
const FORCE_GENERATE_LOADING =
  process.env.NEXT_PUBLIC_FORCE_GENERATE_LOADING === "true";

// ── Loading Bubbles: 결과 생성 흐름의 단계별 버블 메시지 ────────────────────────
const LOADING_BUBBLES = [
  "모든 질문이 끝났어",
  "이제 네 이야기를 정리할게",
  "흐름을 읽는 중",
  "흔들리는 지점을 찾는 중",
  "감정의 결을 읽는 중",
  "결과를 구성하는 중",
  "마지막 흐름을 정리하는 중",
  "곧 결과가 나와",
];

const AnalyzePage = ({ params }: PageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session_id, setSessionId] = useState<string>("mock-session-001");

  useEffect(() => {
    params.then((resolved) => {
      setSessionId(resolved.session_id);
      // analyzeData.session_id도 함께 동기화해야 localStorage 키와 결과 URL이 올바르게 설정됨
      setAnalyzeData((prev) => ({
        ...prev,
        session_id: resolved.session_id,
      }));
    });
  }, [params]);

  // ── Cleanup: timeout 정리 ──────────────────────────────────────
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearTimeout(progressIntervalRef.current);
      }
      if (fakeProgressIntervalRef.current) {
        clearInterval(fakeProgressIntervalRef.current);
      }
    };
  }, []);

  const [stage, setStage] = useState<Stage>("free_input");
  const [analyzeData, setAnalyzeData] = useState<AnalyzeState>({
    session_id,
    content_id: searchParams.get("content_id") || "love-1",
    stage: "free_input",
    free_input: "",
    answers: [],
  });
  const [progress, setProgress] = useState(0);
  const [currentBubbleIndex, setCurrentBubbleIndex] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fakeProgressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const config = getInputConfig(analyzeData.content_id);

  // ── Progress → BubbleIndex 매핑: completing 단계에서 progress에 따라 bubble 자동 진행 ──
  useEffect(() => {
    if (stage !== "completing") return;
    const breakpoints = [0, 10, 25, 40, 55, 70, 85, 96];
    const newIndex = breakpoints.filter((bp) => progress >= bp).length - 1;
    setCurrentBubbleIndex(Math.min(newIndex, LOADING_BUBBLES.length - 1));
  }, [progress, stage]);

  // 자유입력 → reaction_after_free
  const handleFreeInputSubmit = (input: string) => {
    setAnalyzeData((prev) => ({
      ...prev,
      free_input: input,
      stage: "free_input",
    }));
    setStage("reaction_after_free");
  };

  // reaction_after_free → correction_questions
  const handleReactionAfterFreeComplete = () => {
    setStage("correction_questions");
  };

  // correction_questions 완료 → completing
  const handleCorrectionSubmit = (answers: Answer[]) => {
    const finalData: AnalyzeAnswers = {
      session_id: analyzeData.session_id,
      content_id: analyzeData.content_id,
      free_input: analyzeData.free_input,
      answers,
      created_at: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(
        `veil_analysis_${analyzeData.session_id}`,
        JSON.stringify(finalData),
      );
    }

    setAnalyzeData((prev) => ({
      ...prev,
      answers,
    }));

    // ── Debug: generate loading 화면만 고정으로 보기 ──────────────────────────────
    if (FORCE_GENERATE_LOADING) {
      console.log(
        "[DEBUG] FORCE_GENERATE_LOADING enabled - showing loading screen only",
      );
      setStage("completing");
      setProgress(0);
      setCurrentBubbleIndex(0);

      // Fake progress 움직임
      let fakeProgress = 0;
      fakeProgressIntervalRef.current = setInterval(() => {
        fakeProgress += Math.random() * 2.5 + 2.5;
        if (fakeProgress > 95) fakeProgress = 95;
        setProgress(fakeProgress);
      }, 1200);

      return; // 여기서 종료 (실제 flow는 실행하지 않음)
    }

    // ── Generate Progress: 바로 bubble progression 시작 (Phase 1 제거) ────────────
    setStage("completing");
    setProgress(0);
    setCurrentBubbleIndex(0);

    const progressStages = [
      { range: [0, 60], speed: 1200 },
      { range: [60, 85], speed: 1800 },
      { range: [85, 96], speed: 2500 },
      { range: [96, 96], speed: 4000 },
    ];

    let currentProgress = 0;
    let stageIndex = 0;

    const simulateProgress = () => {
      const currentStage = progressStages[stageIndex];
      const { range } = currentStage;

      // 증가량: 단계별로 조정
      let increment = 0;
      if (range[0] < 60) {
        increment = Math.random() * 2.5 + 2.5;
      } else if (range[0] < 85) {
        increment = Math.random() * 1 + 0.5;
      } else {
        increment = Math.random() * 0.5 + 0.2;
      }

      currentProgress += increment;

      if (currentProgress >= range[1]) {
        currentProgress = range[1];
        setProgress(currentProgress);
        stageIndex += 1;
      } else {
        setProgress(currentProgress);
      }

      if (stageIndex < progressStages.length) {
        const nextSpeed = progressStages[stageIndex]?.speed || 2500;
        progressIntervalRef.current = setTimeout(simulateProgress, nextSpeed);
      } else {
        // 96% 도달. 실제 API 완료 대기
        generateScenes(finalData);
      }
    };

    // progress 시뮬레이션 시작
    simulateProgress();
  };

  // ── Generate API 호출 및 장면 캐싱 ──────────────────────────────────────
  const generateScenes = async (finalData: AnalyzeAnswers) => {
    try {
      const content = DUMMY_CONTENTS.find((c) => c.id === finalData.content_id);
      if (!content)
        throw new Error(`콘텐츠를 찾을 수 없어: ${finalData.content_id}`);

      const inputConfig = DUMMY_INPUT_CONFIGS[finalData.content_id];
      const sceneConfig = getSceneConfig(finalData.content_id);

      // Answer → {values, labels} 변환
      const userAnswers = finalData.answers
        .filter(
          (a) => Array.isArray(a.answer_options) && a.answer_options.length > 0,
        )
        .map((a) => {
          const question = inputConfig?.questions.find(
            (q) => q.index === a.question_index,
          );
          const labels = (a.answer_options ?? []).map((value) => {
            const option = question?.options.find((o) => o.value === value);
            return option?.label ?? value;
          });
          return {
            question_index: a.question_index,
            question_text: a.question_text,
            values: a.answer_options ?? [],
            labels,
          };
        });

      // ── Mock / Real 분기 ──────────────────────────────────────────
      const useMock = process.env.NEXT_PUBLIC_USE_MOCK_RESULT !== "false";

      if (!useMock) {
        // 실제 Claude generate 호출
        const res = await fetch(
          `/api/analyze/${finalData.session_id}/generate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content_title: content.title.replace(/\n/g, " "),
              category: content.category,
              user_input: {
                text: finalData.free_input,
                answers: userAnswers,
              },
              scene_config: sceneConfig,
            }),
          },
        );

        if (!res.ok) {
          const errData = (await res.json()) as { error?: string };
          throw new Error(
            errData.error ?? `결과 생성 실패 (HTTP ${res.status})`,
          );
        }

        const resData = (await res.json()) as {
          session_id: string;
          result_scenes: ResultScene[];
        };

        // scenes 캐시 저장 (리다이렉트 후 재생성 방지)
        if (typeof window !== "undefined") {
          localStorage.setItem(
            `veil_result_scenes_${finalData.session_id}`,
            JSON.stringify(resData.result_scenes),
          );
        }
      }

      // API 완료 → progress 100%로 진행
      setProgress(100);

      // 짧은 딜레이 후 result page로 이동
      setTimeout(() => {
        router.push(`/result/${finalData.session_id}`);
      }, 500);
    } catch (err) {
      console.error("Generate 실패:", err);
      // 에러 처리 (현재는 간단히 진행)
      setProgress(100);
      setTimeout(() => {
        router.push(`/result/${finalData.session_id}`);
      }, 1000);
    }
  };

  // ── Bubble Progression Rendering ────────────────────────────────────────────
  // 각 버블의 상태를 currentBubbleIndex 기준으로 계산
  const getBubbleState = (index: number) => {
    const diff = index - currentBubbleIndex;

    if (diff < -2 || diff > 2) return null; // 보이지 않음

    switch (diff) {
      case -2: // 먼 과거
        return {
          status: "past" as const,
          opacity: 0.05,
          scale: 0.90,
          translateY: -12,
          filter: "blur(2px)",
          animation: "none",
        };
      case -1: // 과거
        return {
          status: "past" as const,
          opacity: 0.22,
          scale: 0.94,
          translateY: -6,
          filter: "none",
          animation: "none",
        };
      case 0: // 현재
        return {
          status: "current" as const,
          opacity: 1,
          scale: 1,
          translateY: 0,
          filter: "none",
          animation: "bubblePulse 3s ease-in-out infinite",
        };
      case 1: // 미래
        return {
          status: "future" as const,
          opacity: 0.12,
          scale: 0.94,
          translateY: 8,
          filter: "blur(1px)",
          animation: "none",
        };
      case 2: // 먼 미래
        return {
          status: "future" as const,
          opacity: 0.03,
          scale: 0.90,
          translateY: 16,
          filter: "blur(2px)",
          animation: "none",
        };
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      {/* 완료 화면: Bubble Progression */}
      {stage === "completing" && (
        <div className="flex min-h-screen w-full max-w-lg flex-col items-center justify-start pt-40 px-4 transition-all duration-700">
          <div
            style={{
              animation: "fadeIn 600ms ease-out",
            }}
          >
            {/* 버블 progression: 실제 채팅처럼 올라가는 느낌 */}
            <div className="w-[220px] mx-auto flex flex-col gap-4 mb-10">
              {LOADING_BUBBLES.map((text, index) => {
                const state = getBubbleState(index);
                if (!state) return null;

                const isCurrent = state.status === "current";

                return (
                  <div
                    key={`bubble-${index}`}
                    style={{
                      opacity: state.opacity,
                      transform: `scale(${state.scale}) translateY(${state.translateY}px)`,
                      filter: state.filter,
                      animation: state.animation,
                      transition:
                        "all 1200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    }}
                    className="flex justify-start"
                  >
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.04)",
                        borderRadius: "14px 14px 14px 0px",
                        padding: "12px 16px",
                        border: "1px solid rgba(255, 255, 255, 0.015)",
                        boxShadow: isCurrent
                          ? "0 0 16px rgba(209, 109, 172, 0.12)"
                          : "none",
                      }}
                    >
                      <p
                        className="text-sm"
                        style={{
                          color: "rgba(249, 249, 229, 0.80)",
                          fontSize: "14px",
                          lineHeight: "1.6",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {text}
                        {isCurrent && (
                          <span className="inline-block ml-1">
                            <span
                              style={{
                                animation: "dotPulse 1.4s infinite",
                              }}
                            >
                              .
                            </span>
                            <span
                              style={{
                                animation: "dotPulse 1.4s 0.3s infinite",
                                marginLeft: "1px",
                              }}
                            >
                              .
                            </span>
                            <span
                              style={{
                                animation: "dotPulse 1.4s 0.6s infinite",
                                marginLeft: "1px",
                              }}
                            >
                              .
                            </span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar: 보조 요소 */}
            <div className="w-[200px] mx-auto">
              <div
                className="relative h-0.5 rounded-full overflow-visible"
                style={{ background: "rgba(249, 249, 229, 0.06)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    background: "rgba(209, 109, 172, 0.5)",
                    transitionDuration: progress > 85 ? "2000ms" : "300ms",
                  }}
                />

                {/* Flow point at the end of progress */}
                <div
                  className="absolute top-1/2 rounded-full"
                  style={{
                    width: "5px",
                    height: "5px",
                    left: `${progress}%`,
                    transform: "translate(-50%, -50%)",
                    background: "rgba(209, 109, 172, 0.6)",
                    boxShadow: "0 0 8px rgba(209, 109, 172, 0.15)",
                    animation: "flowPulse 2.5s ease-in-out infinite",
                  }}
                />
              </div>
            </div>
          </div>

          <style>{`
            /* Fade in/out transition */
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            /* 현재 버블: 아주 미세한 pulse (조용한 생명감) */
            @keyframes bubblePulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.9;
              }
            }

            /* 입력 중 표시: dot opacity 순차 변화 (채팅 "입력 중" 느낌) */
            @keyframes dotPulse {
              0%, 100% {
                opacity: 0.4;
              }
              50% {
                opacity: 0.9;
              }
            }

            /* 흐름이 이어지고 있다는 느낌: flow point pulse */
            @keyframes flowPulse {
              0%, 100% {
                opacity: 0.4;
                box-shadow: 0 0 6px rgba(209, 109, 172, 0.1);
              }
              50% {
                opacity: 0.8;
                box-shadow: 0 0 10px rgba(209, 109, 172, 0.2);
              }
            }
          `}</style>
        </div>
      )}

      {/* 입력 단계 */}
      {stage === "free_input" && (
        <TypeAInput config={config} onSubmit={handleFreeInputSubmit} />
      )}

      {/* 자유입력 후 반응 */}
      {stage === "reaction_after_free" && (
        <ReactionBubble
          messages={[
            "고마워",
            "상황을 자세히 이해하기 위해",
            "몇 가지만 더 볼게.",
          ]}
          onComplete={handleReactionAfterFreeComplete}
          completedSteps={1}
        />
      )}

      {/* 선택형 질문들 (reaction 없음, 빠르게) */}
      {stage === "correction_questions" && (
        <CorrectionQuestions
          config={config}
          onSubmit={handleCorrectionSubmit}
        />
      )}
    </div>
  );
};

export default AnalyzePage;
