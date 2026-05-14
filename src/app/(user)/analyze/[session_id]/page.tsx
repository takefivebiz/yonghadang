"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TypeAInput from "@/components/analyze/type-a-input";
import CorrectionQuestions from "@/components/analyze/correction-questions";
import ReactionBubble from "@/components/analyze/reaction-bubble";
import GeneratingLoading from "@/components/analyze/generating-loading";
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
    const progressRef = progressIntervalRef.current;
    const fakeProgressRef = fakeProgressIntervalRef.current;
    return () => {
      if (progressRef) {
        clearTimeout(progressRef);
      }
      if (fakeProgressRef) {
        clearInterval(fakeProgressRef);
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
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fakeProgressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const config = getInputConfig(analyzeData.content_id);

  // ── Stage 변경 시 최상단으로 스크롤 ──────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && stage === "reaction_after_free") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [stage]);

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

    // ── Dev mode: 로딩화면 계속 표시 ──────────────────────────────────────
    if (process.env.NEXT_PUBLIC_SHOW_ANALYZE_LOADING === "true") {
      console.log("[DEBUG] NEXT_PUBLIC_SHOW_ANALYZE_LOADING enabled - showing loading screen only");
      setStage("completing");
      setProgress(0);

      // Fake progress 애니메이션
      let fakeProgress = 0;
      fakeProgressIntervalRef.current = setInterval(() => {
        fakeProgress += Math.random() * 0.8 + 0.5;
        if (fakeProgress > 95) fakeProgress = 95;
        setProgress(fakeProgress);
      }, 800);

      return;
    }

    // ── Generate Progress: 즉시 generating 시작 + progress 병렬 진행 ─────────────
    const loadingStartTime = Date.now();
    console.log("[analyze] Loading 시작", new Date(loadingStartTime).toISOString());

    setStage("completing");
    setProgress(0);

    // ✅ 핵심 1: 생성 즉시 호출 (progress 대기 안 함!)
    console.log("[analyze] generateScenes 호출 시작", new Date().toISOString());
    generateScenes(finalData, loadingStartTime);

    // ✅ 핵심 2: 실제 경과 시간에 맞춰 progress 업데이트 (0% → 95%까지)
    const expectedDuration = 3000; // 예상 완료 시간: 3초

    const updateProgress = () => {
      const elapsedTime = Date.now() - loadingStartTime;
      const calculatedProgress = Math.min((elapsedTime / expectedDuration) * 100, 95);
      setProgress(calculatedProgress);

      // 계속해서 progress 업데이트
      progressIntervalRef.current = setTimeout(updateProgress, 100);
    };

    // progress 업데이트 시작
    updateProgress();
  };

  // ── Generate API 호출 및 장면 캐싱 ──────────────────────────────────────
  const generateScenes = async (finalData: AnalyzeAnswers, loadingStartTime: number) => {
    try {
      const generateStartTime = Date.now();
      console.log(
        "[analyze] Generate API 호출 시작",
        new Date(generateStartTime).toISOString(),
        `(Loading 시작 후 ${generateStartTime - loadingStartTime}ms)`,
      );
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
        // 무료 scenes만 생성 (결제 전 빠른 로딩)
        const freeSceneIndexes = sceneConfig.scenes
          .filter((s) => s.is_free)
          .map((s) => s.index);

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
              scene_indexes: freeSceneIndexes,
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

        // free scenes 캐시 저장 (나중에 merge용)
        if (typeof window !== "undefined") {
          localStorage.setItem(
            `veil_free_scenes_${finalData.session_id}`,
            JSON.stringify(resData.result_scenes),
          );
        }
      }

      // ✅ API 응답 완료 로그
      const generateEndTime = Date.now();
      const totalLoadingTime = generateEndTime - loadingStartTime;
      console.log(
        "[analyze] Generate API 응답 완료",
        new Date(generateEndTime).toISOString(),
        {
          apiResponseTime: `${generateEndTime - generateStartTime}ms`,
          totalLoadingTime: `${totalLoadingTime}ms`,
        },
      );

      // Progress를 100%로 설정 (API 완료)
      setProgress(100);

      // 짧은 딜레이 후 result page로 이동
      setTimeout(() => {
        const navigateTime = Date.now();
        console.log(
          "[analyze] Result page 이동",
          new Date(navigateTime).toISOString(),
          `(총 Loading 시간: ${navigateTime - loadingStartTime}ms)`,
        );
        router.push(`/result/${finalData.session_id}`);
      }, 300);
    } catch (err) {
      console.error("Generate 실패:", err);
      // 에러 처리 (현재는 간단히 진행)
      setProgress(100);
      setTimeout(() => {
        router.push(`/result/${finalData.session_id}`);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center">
      {/* 완료 화면: 단서 수렴 로딩 */}
      {stage === "completing" && (
        <GeneratingLoading progress={progress} />
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
