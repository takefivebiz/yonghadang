"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TypeAInput from "@/components/analyze/type-a-input";
import CorrectionQuestions from "@/components/analyze/correction-questions";
import ReactionBubble from "@/components/analyze/reaction-bubble";
import GeneratingLoading from "@/components/analyze/generating-loading";
import { getInputConfig } from "@/lib/data/input-configs";
import { AnalyzeState, Answer, AnalyzeAnswers } from "@/lib/types/analyze";
import { CONTENTS } from "@/lib/data/contents";
import { INPUT_CONFIGS } from "@/lib/data/input-configs";
import { getSceneConfig } from "@/lib/data/scene-configs";
import type { ResultScene } from "@/lib/types/result";
import { getContentPack } from "@/lib/content-packs";
import { accumulateHiddenState } from "@/lib/quiz/accumulator";
import { translateStateToSummary } from "@/lib/quiz/translator";
import { mergeScenes } from "@/lib/utils/merge-scenes";

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
  // params 해석 전 단계: 복원 여부 확인 중 → 기존 UI flash 방지
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    params.then((resolved) => {
      const sid = resolved.session_id;
      setSessionId(sid);
      setAnalyzeData((prev) => ({
        ...prev,
        session_id: sid,
      }));

      if (typeof window === "undefined") {
        setIsRestoring(false);
        return;
      }

      // 1순위: 이미 생성 완료 → result로 replace (뒤로가기 루프 방지)
      const freeScenes = localStorage.getItem(`veil_free_scenes_${sid}`);
      if (freeScenes) {
        const sp = new URLSearchParams(window.location.search);
        const isQa = sp.get("qa") === "1";
        const hasLoop = sp.get("loop") === "1";
        const query = isQa ? `?qa=1${hasLoop ? "&loop=1" : ""}` : "";
        router.replace(`/result/${sid}${query}`);
        // isRestoring 유지 (navigate 완료 전까지 빈 화면 유지)
        return;
      }

      // 2순위: generating 중 이탈 → 데이터 복원 + generateScenes 재호출
      const savedRaw = localStorage.getItem(`veil_analysis_${sid}`);
      if (savedRaw) {
        try {
          const parsed = JSON.parse(savedRaw) as AnalyzeAnswers;
          const restoredData: AnalyzeAnswers = { ...parsed, session_id: sid };

          setAnalyzeData((prev) => ({
            ...prev,
            session_id: sid,
            free_input: restoredData.free_input,
            answers: restoredData.answers,
          }));
          setStage("completing");
          setProgress(0);
          setIsRestoring(false);

          if (!isGeneratingRef.current) {
            isGeneratingRef.current = true;
            const restoreStart = Date.now();
            console.log("[analyze] 세션 복원 → generateScenes 재호출");
            generateScenes(restoredData, restoreStart);

            const updateProgress = () => {
              const elapsed = Date.now() - restoreStart;
              const calc = 95 * (1 - Math.exp((-4 * elapsed) / 12000));
              setProgress(calc);
              progressIntervalRef.current = setTimeout(updateProgress, 100);
            };
            updateProgress();
          }
          return;
        } catch {
          // 파싱 실패 → 신규 진입으로 처리
        }
      }

      // 3순위: 신규 진입
      setIsRestoring(false);
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
  // generateScenes 중복 호출 방지 (복원 경로 + 일반 경로 모두 적용)
  const isGeneratingRef = useRef(false);

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
  const handleCorrectionSubmit = async (answers: Answer[]) => {
    const finalData: AnalyzeAnswers = {
      session_id: analyzeData.session_id,
      content_id: analyzeData.content_id,
      free_input: analyzeData.free_input,
      answers,
      created_at: new Date().toISOString(),
    };

    // window.location.search 직접 사용: useSearchParams()는 Suspense 경계 영향으로
    // ?qa=1이 있어도 빈 값을 반환할 수 있음 (generateScenes와 동일한 패턴).
    const isQaMode =
      (typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("qa") === "1") ||
      process.env.NEXT_PUBLIC_QA_MODE === "true";

    if (typeof window !== "undefined") {
      localStorage.setItem(
        `veil_analysis_${analyzeData.session_id}`,
        JSON.stringify(finalData),
      );
      // QA 세션이 일반 사용자 이어하기에 섞이지 않도록 non-QA mode에서만 기록
      if (!isQaMode) {
        localStorage.setItem(
          `veil_last_session_${analyzeData.content_id}`,
          analyzeData.session_id,
        );
      }
    }

    setAnalyzeData((prev) => ({
      ...prev,
      answers,
    }));

    // ── 로딩 화면 즉시 표시: DB 저장/API 응답 대기 없이 바로 전환 ──────────────
    setStage("completing");
    setProgress(0);
    const loadingStartTime = Date.now();
    console.log("[analyze] Loading 시작", new Date(loadingStartTime).toISOString());

    // fire-and-forget: 저장 실패해도 generateScenes 진행
    if (!isQaMode) {
      void fetch(`/api/analyze/${finalData.session_id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          free_input: finalData.free_input,
          answers: finalData.answers,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errData = (await res.json()) as { error?: string };
            console.error("[answers] DB 저장 실패:", errData.error ?? `HTTP ${res.status}`);
          } else {
            console.log("[answers] session_answers DB 저장 완료");
          }
        })
        .catch((err) => {
          console.error("[answers] DB 저장 중 예외 발생:", err);
        });
    } else {
      console.log("[answers] QA mode — DB 저장 skip");
    }

    // ── Dev mode: fake progress만 돌리고 return ────────────────────────────
    if (process.env.NEXT_PUBLIC_SHOW_ANALYZE_LOADING === "true") {
      console.log("[DEBUG] NEXT_PUBLIC_SHOW_ANALYZE_LOADING enabled - showing loading screen only");

      // Fake progress 애니메이션
      let fakeProgress = 0;
      fakeProgressIntervalRef.current = setInterval(() => {
        fakeProgress += Math.random() * 0.8 + 0.5;
        if (fakeProgress > 95) fakeProgress = 95;
        setProgress(fakeProgress);
      }, 800);

      return;
    }

    // ── Generate: 즉시 호출 ──────────────────────────────────────────────
    // 복원 경로에서 이미 호출 중인 경우 중복 방지
    if (isGeneratingRef.current) return;
    isGeneratingRef.current = true;
    console.log("[analyze] generateScenes 호출 시작", new Date().toISOString());
    generateScenes(finalData, loadingStartTime);

    // ✅ 핵심 2: 지수 감쇠 방식으로 progress 업데이트
    // 선형+하드캡 대신 95%에 점근적으로 수렴 → "95%에서 멈추는 느낌" 없음
    const updateProgress = () => {
      const elapsedTime = Date.now() - loadingStartTime;
      // 12초 기준 지수 감쇠: 초반에 빠르게 올라가고 95% 근처에서 자연히 감속
      const calculatedProgress = 95 * (1 - Math.exp(-4 * elapsedTime / 12000));
      setProgress(calculatedProgress);

      // 계속해서 progress 업데이트
      progressIntervalRef.current = setTimeout(updateProgress, 100);
    };

    // progress 업데이트 시작
    updateProgress();
  };

  // ── Generate API 호출 및 장면 캐싱 ──────────────────────────────────────
  const generateScenes = async (finalData: AnalyzeAnswers, loadingStartTime: number) => {
    // try block 외부에서 선언해야 catch block에서도 참조 가능
    // window.location.search 직접 사용 (result page와 동일한 패턴):
    // useSearchParams() 훅은 Next.js 15 App Router에서 Suspense 경계 / route 전환
    // 영향으로 빈 URLSearchParams를 반환할 수 있음 → ?qa=1이 있어도 감지 실패.
    // 결과적으로 isQaMode=false → 일반 mode 분기 → veil_all_scenes_ 저장 안 됨.
    const isQaMode =
      (typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("qa") === "1") ||
      process.env.NEXT_PUBLIC_QA_MODE === "true";

    // loop=1: result 페이지에 추가루프 CTA를 표시하는 보조 플래그. qa=1과 함께만 유효.
    const hasLoopFlag =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("loop") === "1";

    try {
      const generateStartTime = Date.now();
      console.log(
        "[analyze] Generate API 호출 시작",
        new Date(generateStartTime).toISOString(),
        `(Loading 시작 후 ${generateStartTime - loadingStartTime}ms)`,
      );
      const content = CONTENTS.find((c) => c.id === finalData.content_id);
      if (!content)
        throw new Error(`콘텐츠를 찾을 수 없어: ${finalData.content_id}`);

      const inputConfig = INPUT_CONFIGS[finalData.content_id];
      const sceneConfig = getSceneConfig(finalData.content_id);

      // Answer → {values, labels} 변환 (V2: step_id 기반으로 step 조회)
      const userAnswers = finalData.answers
        .filter(
          (a) => Array.isArray(a.answer_options) && a.answer_options.length > 0,
        )
        .map((a) => {
          // step_id로 step 조회 → singleChoice/multiChoice에서 option label 추출
          const step = inputConfig?.steps.find((s) => s.id === a.step_id);
          const labels = (a.answer_options ?? []).map((value) => {
            if (!step || step.type === "freeText") return value;
            const option = step.options.find((o) => o.value === value);
            return option?.label ?? value;
          });
          return {
            step_id: a.step_id,
            question_text: a.question_text,
            values: a.answer_options ?? [],
            labels,
          };
        });

      // ── Hidden State 계산 ────────────────────────────────────────
      // 사용자가 선택한 모든 option value를 플랫하게 모아 hidden state 점수 계산
      const contentPack = getContentPack(finalData.content_id);
      const selectedValues = finalData.answers.flatMap(
        (a) => a.answer_options ?? [],
      );
      const hiddenScores = contentPack
        ? accumulateHiddenState(selectedValues, contentPack.scoreMap, contentPack.dimensions)
        : {};
      const stateSummary = contentPack
        ? translateStateToSummary(hiddenScores, contentPack.translationRules)
        : [];

      console.log("[analyze] selectedValues:", selectedValues);
      console.log("[analyze] hiddenScores:", hiddenScores);
      console.log("[analyze] stateSummary:", stateSummary);

      // result 페이지에서 additionalReadings 우선순위 계산에 사용
      if (typeof window !== "undefined") {
        localStorage.setItem(
          `veil_hidden_state_${finalData.session_id}`,
          JSON.stringify(hiddenScores),
        );
      }

      if (isQaMode) {
        // ── QA mode: 무료 씬 → 유료 씬 순서로 2-call 생성 ───────────────────
        // 실서비스 흐름(무료 씬만 생성)은 절대 변경하지 않는다.
        console.log("[QA] 2-call generate 시작");
        const freeSceneIndexes = sceneConfig.scenes
          .filter((s) => s.is_free)
          .map((s) => s.index);

        // Call 1: 무료 씬 생성
        const freeRes = await fetch(
          `/api/analyze/${finalData.session_id}/generate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content_title: content.title.replace(/\n/g, " "),
              category: content.category,
              user_input: { text: finalData.free_input, answers: userAnswers },
              scene_config: sceneConfig,
              scene_indexes: freeSceneIndexes,
              state_summary: stateSummary,
              is_qa: true,
            }),
          },
        );
        if (!freeRes.ok) throw new Error(`무료 씬 생성 실패 (HTTP ${freeRes.status})`);
        const freeData = (await freeRes.json()) as { session_id: string; result_scenes: ResultScene[] };
        const freeScenes = freeData.result_scenes;

        console.log(
          "[QA] Call 1 완료. freeScenes:", freeScenes.length,
          "| scene_indexes:", freeScenes.map((s) => s.scene_index),
          "| is_free values:", freeScenes.map((s) => `${s.scene_index}:${s.is_free}`),
          "| messages 존재:", freeScenes.map((s) => `${s.scene_index}:${!!s.messages}`),
        );

        if (typeof window !== "undefined") {
          localStorage.setItem(
            `veil_free_scenes_${finalData.session_id}`,
            JSON.stringify(freeScenes),
          );
        }

        // Call 2: 유료 씬 생성 (무료 씬 context 포함)
        const paidSceneIndexes = sceneConfig.scenes
          .filter((s) => !s.is_free)
          .map((s) => s.index);

        if (paidSceneIndexes.length > 0) {
          // s.is_free는 Claude 응답값이라 undefined일 수 있다.
          // freeScenes 배열은 무료 씬만 생성한 결과이므로 마지막 원소가 마지막 무료 씬이다.
          const lastFreeScene = freeScenes.slice(-1)[0];
          console.log(
            "[QA] lastFreeScene 추출 →",
            lastFreeScene
              ? `scene_index: ${lastFreeScene.scene_index}, messages: ${lastFreeScene.messages?.length ?? "null"}`
              : "없음 (freeScenes 비어있음)",
          );
          if (!lastFreeScene?.messages) throw new Error("무료 씬 context를 추출할 수 없어");

          const freeSceneContext = {
            sceneTitle: lastFreeScene.scene_title,
            lastMessages: lastFreeScene.messages.slice(-2),
          };

          const paidRes = await fetch(
            `/api/analyze/${finalData.session_id}/generate`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                content_title: content.title.replace(/\n/g, " "),
                category: content.category,
                user_input: { text: finalData.free_input, answers: userAnswers },
                scene_config: sceneConfig,
                scene_indexes: paidSceneIndexes,
                free_scene_context: freeSceneContext,
                state_summary: stateSummary,
                is_qa: true,
              }),
            },
          );
          if (!paidRes.ok) throw new Error(`유료 씬 생성 실패 (HTTP ${paidRes.status})`);
          const paidData = (await paidRes.json()) as { session_id: string; result_scenes: ResultScene[] };
          const paidScenes = paidData.result_scenes;

          console.log(
            "[QA] Call 2 완료. paidScenes:", paidScenes.length,
            "| scene_indexes:", paidScenes.map((s) => s.scene_index),
            "| messages 존재:", paidScenes.map((s) => `${s.scene_index}:${!!s.messages}(${s.messages?.length ?? 0}개)`),
          );

          // 무료 + 유료 병합 → veil_all_scenes_ 에 저장
          // result page는 이 키를 먼저 읽고, paid placeholder보다 실제 데이터를 우선 사용한다
          const allScenes = mergeScenes(freeScenes, paidScenes);
          console.log(
            "[QA] mergeScenes 완료. allScenes:", allScenes.length,
            "| indexes:", allScenes.map((s) => `${s.scene_index}(${s.is_free ? "free" : "paid"},msg=${s.messages?.length ?? "null"})`),
          );

          if (typeof window !== "undefined") {
            localStorage.setItem(
              `veil_all_scenes_${finalData.session_id}`,
              JSON.stringify(allScenes),
            );
            console.log(`[QA] veil_all_scenes_${finalData.session_id} 저장 완료`);
          }
        }

        setProgress(100);
        setTimeout(() => {
          const loopSuffix = hasLoopFlag ? "&loop=1" : "";
          console.log(`[QA] result page로 이동 (?qa=1${loopSuffix} 포함)`);
          router.push(`/result/${finalData.session_id}?qa=1${loopSuffix}`);
        }, 300);
      } else {
        // ── 일반 mode: 무료 씬만 생성 (결제 전 빠른 로딩) ──────────────────
        // 항상 실제 API 호출. 실패 시 catch에서 result page로 이동하고,
        // result page는 veil_free_scenes_ 캐시가 없으면 자체 fallback(mock)을 사용한다.
        const freeSceneIndexes = sceneConfig.scenes
          .filter((s) => s.is_free)
          .map((s) => s.index);

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
              state_summary: stateSummary,
              is_qa: false,
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

        // 무료 scenes 캐시 저장 → result page가 veil_free_scenes_ key로 읽는다
        if (typeof window !== "undefined") {
          localStorage.setItem(
            `veil_free_scenes_${finalData.session_id}`,
            JSON.stringify(resData.result_scenes),
          );
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
      }
    } catch (err) {
      console.error("[generate] 실패:", err);
      setProgress(100);
      // QA mode에서 에러가 나도 ?qa=1 유지 → result page가 QA unlock 상태 유지
      // (free scenes는 저장됐을 수 있으므로 unlock 상태로 보여주는 게 낫다)
      setTimeout(() => {
        const qaQuery = isQaMode
          ? `?qa=1${hasLoopFlag ? "&loop=1" : ""}`
          : "";
        router.push(`/result/${finalData.session_id}${qaQuery}`);
      }, 1000);
    }
  };

  // params 해석 완료 전: 어떤 stage도 flash 없이 대기
  if (isRestoring) {
    return <div className="min-h-screen bg-background" />;
  }

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
