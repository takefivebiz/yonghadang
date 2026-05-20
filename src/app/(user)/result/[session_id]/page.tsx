"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ClipboardList } from "lucide-react";
import { generateMockResultScenes } from "@/lib/data/dummy-result-scenes";
import { INPUT_CONFIGS } from "@/lib/data/input-configs";
import { getSceneConfig } from "@/lib/data/scene-configs";
import { ResultScene } from "@/lib/types/result";
import { AnalyzeAnswers, Answer } from "@/lib/types/analyze";
import { CONTENTS } from "@/lib/data/contents";
import { CATEGORY_LABELS } from "@/lib/types/content";
import { mergeScenes } from "@/lib/utils/merge-scenes";
import { createPaidScenePlaceholders } from "@/lib/utils/create-paid-scene-placeholders";
import { deriveSceneSignals } from "@/lib/signals/derive-scene-signals";
import SceneContent from "@/components/result/scene-content";
import FlowOverview from "@/components/result/flow-overview";
import ProgressIndicator from "@/components/result/progress-indicator";
import PaymentModal from "@/components/modals/payment-modal";
import ResultActions from "@/components/result/result-actions";
import PaidGenerationLoading from "@/components/result/paid-generation-loading";
import { getContentPack } from "@/lib/content-packs";
import { prioritizeAdditionalReadings } from "@/lib/quiz/accumulator";
import { translateStateToSummary } from "@/lib/quiz/translator";
import type {
  AdditionalReading,
  HiddenState,
  LoopType,
  LoopAnswer,
} from "@/lib/types/quiz";
import type {
  ClaudeGeneratedResult,
  LoopReadingSceneInsight,
} from "@/lib/prompts/generate-result";
import AdditionalReadings from "@/components/result/additional-readings";

interface PageProps {
  params: Promise<{ session_id: string }>;
}

const ResultPage = ({ params }: PageProps) => {
  const [analyzeData, setAnalyzeData] = useState<AnalyzeAnswers | null>(null);
  const [scenes, setScenes] = useState<ResultScene[]>([]);
  const [unlockedScenes, setUnlockedScenes] = useState<number[]>([]);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paidGenerationLoading, setPaidGenerationLoading] = useState(false);
  const [isPaidGenerationRecovery, setIsPaidGenerationRecovery] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRecordListOpen, setIsRecordListOpen] = useState(false);
  const [additionalReadings, setAdditionalReadings] = useState<
    AdditionalReading[]
  >([]);
  const [hiddenState, setHiddenState] = useState<HiddenState>({});
  // QA mode: ?qa=1 또는 NEXT_PUBLIC_QA_MODE=true → 결제 없이 전체 씬 확인
  const [isQaMode, setIsQaMode] = useState(false);
  // Loop QA mode: ?qa=1&loop=1 → 추가루프 CTA 표시 및 직접 생성 활성화
  const [isLoopQaMode, setIsLoopQaMode] = useState(false);

  // share_token: ResultActions 공유 URL 생성용. 비동기 조회, 실패 시 null → 버튼 비활성.
  const [shareToken, setShareToken] = useState<string | null>(null);
  // 결제 confirm API 실패 시 에러 메시지. unlock은 차단되고 재시도 안내를 표시한다.
  const [paymentConfirmError, setPaymentConfirmError] = useState<string | null>(
    null,
  );

  // ── Loop Reading 상태 ──────────────────────────────────────────────────
  const [loopAnswers, setLoopAnswers] = useState<
    Partial<Record<LoopType, LoopAnswer>>
  >({});
  const [loopLoading, setLoopLoading] = useState<LoopType | null>(null);
  const [loopError, setLoopError] = useState<LoopType | null>(null);
  // 현재 세션에서 새로 생성 완료된 loop 목록 (badge 표시용).
  // activeLoopType(자동 포커스)과 분리: 생성 완료가 읽기 포커스를 강제하지 않는다.
  const [newlyUnlockedLoops, setNewlyUnlockedLoops] = useState<LoopType[]>([]);
  // loop_all 구매 후 순차 생성 대기 중 상태 (카드에 "구매 완료 · 대기 중" 표시용)
  const [loopAllPurchased, setLoopAllPurchased] = useState(false);
  // loop / loop_all 결제 후 AdditionalReadings 섹션 스크롤 트리거
  const [pendingScrollToLoop, setPendingScrollToLoop] = useState(false);

  const sceneRefsMap = useRef<Record<number, HTMLDivElement | null>>({});
  const flowOverviewRef = useRef<HTMLDivElement | null>(null);
  const loopReadingsRef = useRef<HTMLDivElement | null>(null);
  // 결제 감지 useEffect 더블 실행 방지 (scenes 업데이트로 useEffect 재실행될 수 있음)
  const isProcessingPayment = useRef(false);

  // ── Phase 1: 초기 데이터 및 scene 생성 또는 복원 ──────────────────────────
  // 리다이렉트 후 다시 로드되었을 때, generateCalledRef가 reset되지 않도록
  // localStorage에 scenes를 캐싱하고, 재생성을 방지한다.
  useEffect(() => {
    const initData = async () => {
      try {
        const param = await params;

        if (typeof window === "undefined") return;

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

        // ── contentPack + hiddenState 로드 ──────────────────────────
        const pack = getContentPack(data.content_id);
        const rawHiddenState = localStorage.getItem(
          `veil_hidden_state_${param.session_id}`,
        );
        const hiddenScores: HiddenState = rawHiddenState
          ? (JSON.parse(rawHiddenState) as HiddenState)
          : {};
        setHiddenState(hiddenScores);

        // additionalReadings: hiddenState 기반 우선순위 정렬 후 상위 5개
        if (pack) {
          const prioritized = prioritizeAdditionalReadings(
            hiddenScores,
            pack.additionalReadings,
          );
          setAdditionalReadings(prioritized.slice(0, 5));
        }

        // ── 저장된 loop answers 복원 ────────────────────────────────
        const loopTypes: LoopType[] = ["action", "standard", "evaluate"];
        const savedLoopAnswers: Partial<Record<LoopType, LoopAnswer>> = {};
        for (const lt of loopTypes) {
          const raw = localStorage.getItem(
            `veil_loop_${lt}_${param.session_id}`,
          );
          if (raw) {
            try {
              savedLoopAnswers[lt] = JSON.parse(raw) as LoopAnswer;
            } catch {
              // corrupt data: 무시
            }
          }
        }
        if (Object.keys(savedLoopAnswers).length > 0) {
          setLoopAnswers(savedLoopAnswers);
        }

        // ── 캐시된 scenes 확인 ─────────────────────────────────────────
        // 1. merged all scenes 확인 (결제 후)
        const allScenesKey = `veil_all_scenes_${param.session_id}`;
        const cachedAllScenes = localStorage.getItem(allScenesKey);

        // 2. free scenes만 확인 (초기 결과)
        const freeScenesKey = `veil_free_scenes_${param.session_id}`;
        const cachedFreeScenes = localStorage.getItem(freeScenesKey);

        console.log(
          "[result] cache 확인: allScenes=",
          !!cachedAllScenes,
          "freeScenes=",
          !!cachedFreeScenes,
          "| session=",
          param.session_id,
        );

        let resultScenes: ResultScene[] = [];

        if (cachedAllScenes) {
          // merged all scenes 우선 로드 (결제 후 상태)
          resultScenes = JSON.parse(cachedAllScenes) as ResultScene[];
          console.log(
            "[result] veil_all_scenes_ 로드:",
            resultScenes.length,
            "scenes,",
            "indexes:",
            resultScenes.map(
              (s) => `${s.scene_index}(msg=${s.messages?.length ?? "null"})`,
            ),
          );
        } else if (cachedFreeScenes) {
          // free scenes 로드 (초기 결과)
          resultScenes = JSON.parse(cachedFreeScenes) as ResultScene[];
          console.log(
            "[result] veil_free_scenes_ 로드:",
            resultScenes.length,
            "scenes",
          );
        } else {
          // ── DB fallback ────────────────────────────────────────────────
          // localStorage에 scenes가 없을 때만 시도한다.
          // QA mode는 커밋 A에서 DB 저장을 intentionally skip했으므로 조회도 skip.
          // React state isQaMode는 씬 로드 이후에 설정되므로 window.location.search로 직접 판단.
          const isQaForDbFallback =
            new URLSearchParams(window.location.search).get("qa") === "1" ||
            process.env.NEXT_PUBLIC_QA_MODE === "true";

          let dbFallbackSucceeded = false;

          if (!isQaForDbFallback) {
            try {
              const dbRes = await fetch(
                `/api/analyze/${param.session_id}/result-scenes`,
              );
              if (dbRes.ok) {
                const dbData = (await dbRes.json()) as {
                  scenes: ResultScene[];
                };
                if (dbData.scenes.length > 0) {
                  resultScenes = dbData.scenes;
                  dbFallbackSucceeded = true;
                  console.log(
                    `[result] DB fallback 성공: ${resultScenes.length}개 scenes`,
                  );
                } else {
                  console.log(
                    "[result] DB fallback: 저장된 scenes 없음 → 기존 fallback",
                  );
                }
              } else {
                console.warn(
                  `[result] DB fallback non-ok: HTTP ${dbRes.status} → 기존 fallback`,
                );
              }
            } catch (dbErr) {
              console.warn("[result] DB fallback 실패 → 기존 fallback:", dbErr);
            }
          } else {
            console.log("[result] QA mode — DB fallback skip");
          }

          // ── 캐시 없음: API 시도 → 실패 시 mock fallback ──────────────
          // useMock=true : API key 없이 빠른 개발 확인용. 직접 mock 사용.
          // useMock=false: 실제 API 호출. 실패해도 mock으로 UX 유지 (에러 화면 없음).
          const useMock = process.env.NEXT_PUBLIC_USE_MOCK_RESULT !== "false";
          // DB fallback이 scenes를 채운 경우 아래 기존 fallback은 실행하지 않는다.
          if (!dbFallbackSucceeded) {
            if (useMock) {
              resultScenes = generateMockResultScenes(data.content_id);
            } else {
              try {
                // ── 실제 Claude generate fallback ────────────────────────
                // analyze page가 이미 생성해서 캐시했으면 여기 오지 않는다.
                // 직접 URL 접근이나 analyze 실패 후 재방문 시의 fallback 경로.
                const content = CONTENTS.find((c) => c.id === data.content_id);
                if (!content) {
                  throw new Error(`콘텐츠를 찾을 수 없어: ${data.content_id}`);
                }

                const inputConfig = INPUT_CONFIGS[data.content_id];
                const sceneConfig = getSceneConfig(data.content_id);

                const userAnswers = data.answers
                  .filter(
                    (a: Answer) =>
                      Array.isArray(a.answer_options) &&
                      a.answer_options.length > 0,
                  )
                  .map((a: Answer) => {
                    // V2: step_id 기반으로 step 조회 → option label 추출
                    const step = inputConfig?.steps.find(
                      (s) => s.id === a.step_id,
                    );
                    const labels = (a.answer_options ?? []).map((value) => {
                      if (!step || step.type === "freeText") return value;
                      const option = step.options.find(
                        (o) => o.value === value,
                      );
                      return option?.label ?? value;
                    });
                    return {
                      step_id: a.step_id,
                      question_text: a.question_text,
                      values: a.answer_options ?? [],
                      labels,
                    };
                  });

                const freeSceneIndexes = sceneConfig.scenes
                  .filter((s) => s.is_free)
                  .map((s) => s.index);

                const stateSummary = pack
                  ? translateStateToSummary(hiddenScores, pack.translationRules)
                  : [];

                const res = await fetch(
                  `/api/analyze/${param.session_id}/generate`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      content_title: content.title.replace(/\n/g, " "),
                      category: content.category,
                      user_input: {
                        text: data.free_input,
                        answers: userAnswers,
                      },
                      scene_config: sceneConfig,
                      scene_indexes: freeSceneIndexes,
                      state_summary: stateSummary,
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
                resultScenes = resData.result_scenes;
                localStorage.setItem(
                  freeScenesKey,
                  JSON.stringify(resultScenes),
                );
              } catch (apiErr) {
                // API 실패 → mock으로 UX 유지. 에러 화면 절대 안 뜸.
                console.warn(
                  "[result] fallback generate 실패, mock 사용:",
                  apiErr,
                );
                resultScenes = generateMockResultScenes(data.content_id);
              }
            }
          }
        }

        // ── Paid Scenes Placeholder 추가 ────────────────────────────
        // 무료 scenes 뒤에 유료 scenes placeholder를 추가
        // (아직 generate되지 않은 상태 = messages null, preview_messages로 표시)
        const sceneConfig = getSceneConfig(data.content_id);
        const paidPlaceholders = createPaidScenePlaceholders(
          param.session_id,
          sceneConfig,
        );
        // paidPlaceholders를 first arg로 놓아야 resultScenes(실제 데이터)가 collision 시 우선한다.
        // QA mode나 결제 후 재방문 시 real messages가 placeholder에 덮이는 것을 방지한다.
        const allScenes = mergeScenes(paidPlaceholders, resultScenes);

        setScenes(allScenes);

        // ── QA mode 감지 ─────────────────────────────────────────
        // ?qa=1: 무료 씬만 unlock / ?qa=1&paid=1: 전체 씬 unlock
        // ?qa=1&loop=1: 추가로 추가루프 CTA 표시 및 직접 생성 활성화
        const searchQuery = new URLSearchParams(window.location.search);
        const isQa =
          searchQuery.get("qa") === "1" ||
          process.env.NEXT_PUBLIC_QA_MODE === "true";
        const isPaidQa = isQa && searchQuery.get("paid") === "1";
        const isLoopQa = isQa && searchQuery.get("loop") === "1";
        setIsQaMode(isQa);
        setIsLoopQaMode(isLoopQa);

        console.log(
          "[result] isQaMode=",
          isQa,
          "isPaidQaMode=",
          isPaidQa,
          "isLoopQaMode=",
          isLoopQa,
          "| allScenes:",
          allScenes.length,
          "| paid scenes:",
          allScenes
            .filter((s) => !s.is_free)
            .map(
              (s) => `${s.scene_index}(msg=${s.messages?.length ?? "null"})`,
            ),
        );

        if (isQa) {
          const qaUnlockedIndexes = isPaidQa
            ? allScenes.map((s) => s.scene_index)
            : allScenes.filter((s) => s.is_free).map((s) => s.scene_index);
          console.log(
            "[result] QA mode: unlockedScenes 설정 →",
            qaUnlockedIndexes,
          );
          setUnlockedScenes(qaUnlockedIndexes);
        } else {
          // ── Unlock 상태 복원 ────────────────────────────────────
          // 1. localStorage에서 저장된 unlock 상태 확인
          // 2. 없으면 무료 scene만 unlock (결제 전 상태)
          const unlockedKey = `veil_unlocked_scenes_${param.session_id}`;
          const savedUnlocked = localStorage.getItem(unlockedKey);

          if (savedUnlocked) {
            // 이전에 저장된 unlock 상태 복원
            try {
              const parsedUnlocked = JSON.parse(savedUnlocked) as number[];
              console.log("[restored unlock state]", parsedUnlocked);
              setUnlockedScenes(parsedUnlocked);
            } catch {
              // JSON 파싱 실패 시, 무료 scene만 unlock
              const freeIndices = resultScenes
                .filter((s) => s.is_free)
                .map((s) => s.scene_index);
              setUnlockedScenes(freeIndices);
            }
          } else {
            // 저장된 상태 없음 → 무료 scene만 unlock (결제 전 상태)
            const freeIndices = resultScenes
              .filter((s) => s.is_free)
              .map((s) => s.scene_index);
            setUnlockedScenes(freeIndices);
          }
        }

        setLoading(false);
      } catch (err) {
        // mock fallback 없음: 실제 오류를 그대로 노출
        const message =
          err instanceof Error ? err.message : "데이터 로드 중 오류가 발생했어";
        setError(message);
        setLoading(false);
      }
    };

    initData();
  }, [params]);

  // ── Paid Scenes Generate 함수 ───────────────────────────────────────
  const generatePaidScenes = useCallback(
    async (paidSceneIndexes: number[]) => {
      try {
        if (!analyzeData) throw new Error("분석 데이터가 없어");

        const content = CONTENTS.find((c) => c.id === analyzeData.content_id);
        if (!content)
          throw new Error(`콘텐츠를 찾을 수 없어: ${analyzeData.content_id}`);

        const inputConfig = INPUT_CONFIGS[analyzeData.content_id];
        const sceneConfig = getSceneConfig(analyzeData.content_id);

        // Answer → {values, labels} 변환 (V2: step_id 기반)
        const userAnswers = analyzeData.answers
          .filter(
            (a: Answer) =>
              Array.isArray(a.answer_options) && a.answer_options.length > 0,
          )
          .map((a: Answer) => {
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

        // 무료 scene context 추출 (유료 prompt에 포함할 정보)
        const freeScenes = scenes.filter((s) => s.is_free);
        const lastFreeScene = freeScenes[freeScenes.length - 1];

        if (!lastFreeScene?.messages) {
          throw new Error("무료 scene 메시지를 찾을 수 없어");
        }

        const freeSceneContext = {
          sceneTitle: lastFreeScene.scene_title,
          lastMessages: lastFreeScene.messages.slice(-2), // 마지막 1~2개 메시지
        };

        // hidden state 기반 stateSummary 계산 (Claude 프롬프트 주입용)
        const rawHiddenState =
          typeof window !== "undefined"
            ? localStorage.getItem(
                `veil_hidden_state_${analyzeData.session_id}`,
              )
            : null;
        const hiddenScores: HiddenState = rawHiddenState
          ? (JSON.parse(rawHiddenState) as HiddenState)
          : {};
        const genPack = getContentPack(analyzeData.content_id);
        const stateSummary = genPack
          ? translateStateToSummary(hiddenScores, genPack.translationRules)
          : [];

        // API 호출: paid scenes만 생성 (무료 context 포함)
        const res = await fetch(
          `/api/analyze/${analyzeData.session_id}/generate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content_title: content.title.replace(/\n/g, " "),
              category: content.category,
              user_input: {
                text: analyzeData.free_input,
                answers: userAnswers,
              },
              scene_config: sceneConfig,
              scene_indexes: paidSceneIndexes,
              free_scene_context: freeSceneContext, // 유료 prompt 생성용
              state_summary: stateSummary,
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
          _debug_raw_result?: ClaudeGeneratedResult;
        };

        // scene carry_over를 loop-reading generate의 sceneInsights로 저장
        if (resData._debug_raw_result?.scenes) {
          const newInsights: LoopReadingSceneInsight[] =
            resData._debug_raw_result.scenes
              .filter((s) => s.carry_over)
              .map((s) => ({
                scene_title: s.scene_title,
                key_insight: s.carry_over.key_insight,
                do_not_repeat: s.carry_over.do_not_repeat,
              }));
          if (newInsights.length > 0) {
            const insightKey = `veil_scene_insights_${analyzeData.session_id}`;
            const existingRaw = localStorage.getItem(insightKey);
            const existing: LoopReadingSceneInsight[] = existingRaw
              ? (JSON.parse(existingRaw) as LoopReadingSceneInsight[])
              : [];
            const merged = [
              ...existing.filter(
                (e) =>
                  !newInsights.some((n) => n.scene_title === e.scene_title),
              ),
              ...newInsights,
            ];
            localStorage.setItem(insightKey, JSON.stringify(merged));
          }
        }

        // merge: 기존 scenes + 새로운 paid scenes
        const mergedScenes = mergeScenes(scenes, resData.result_scenes);
        setScenes(mergedScenes);

        // 캐시 저장: merged scenes
        if (typeof window !== "undefined") {
          localStorage.setItem(
            `veil_all_scenes_${analyzeData.session_id}`,
            JSON.stringify(mergedScenes),
          );
        }

        console.log("[paid scenes generated]", paidSceneIndexes, mergedScenes);
      } catch (err) {
        console.error("Paid scenes 생성 실패:", err);
        // TODO: 사용자에게 에러 알림
        // re-throw: 호출 측 .then()이 실행되지 않아야 unlock state가 잘못 저장되지 않음
        throw err;
      }
    },
    [analyzeData, scenes],
  );

  // ── Loop Reading 생성 ──────────────────────────────────────────────────
  // 결제 성공 후 또는 재시도 시 호출. 결제 검증 없이 API를 직접 호출한다.
  const handleLoopUnlock = useCallback(
    async (loopType: LoopType, loopTitle: string, skipScroll = false) => {
      if (!analyzeData) return;
      const sessionId = analyzeData.session_id;

      // 이미 생성된 답변이 있으면 재생성 없이 표시
      const cached = localStorage.getItem(`veil_loop_${loopType}_${sessionId}`);
      if (cached) {
        try {
          const answer = JSON.parse(cached) as LoopAnswer;
          setLoopAnswers((prev) => ({ ...prev, [loopType]: answer }));
          // 캐시 복원은 새 unlock이 아니므로 badge 없이 조용히 반영
          return;
        } catch {
          localStorage.removeItem(`veil_loop_${loopType}_${sessionId}`);
        }
      }

      localStorage.setItem(`veil_payment_pending_loop_${sessionId}`, loopType);
      setLoopLoading(loopType);
      setLoopError(null);

      try {
        const pack = getContentPack(analyzeData.content_id);
        const rawHiddenState = localStorage.getItem(
          `veil_hidden_state_${sessionId}`,
        );
        const hiddenScores: HiddenState = rawHiddenState
          ? (JSON.parse(rawHiddenState) as HiddenState)
          : {};
        const stateSummary = pack
          ? translateStateToSummary(hiddenScores, pack.translationRules)
          : [];

        const rawInsights = localStorage.getItem(
          `veil_scene_insights_${sessionId}`,
        );
        const sceneInsights: LoopReadingSceneInsight[] = rawInsights
          ? (JSON.parse(rawInsights) as LoopReadingSceneInsight[])
          : [];

        const res = await fetch(
          `/api/analyze/${sessionId}/loop-reading/generate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              loopType,
              loopTitle,
              context: {
                freeInput: analyzeData.free_input,
                stateSummary,
                sceneInsights,
              },
            }),
          },
        );

        if (!res.ok) {
          const errData = (await res.json()) as { error?: string };
          throw new Error(
            errData.error ?? `루프 생성 실패 (HTTP ${res.status})`,
          );
        }

        const answer = (await res.json()) as LoopAnswer;
        localStorage.setItem(
          `veil_loop_${loopType}_${sessionId}`,
          JSON.stringify(answer),
        );
        localStorage.removeItem(`veil_payment_pending_loop_${sessionId}`);

        setLoopAnswers((prev) => ({ ...prev, [loopType]: answer }));
        // 자동 포커스 강제 대신: badge만 표시 (사용자가 직접 클릭해서 읽게)
        setNewlyUnlockedLoops((prev) =>
          prev.includes(loopType) ? prev : [...prev, loopType],
        );

        if (!skipScroll) {
          // useEffect + double RAF로 스크롤: React 페인트 이후 실행 보장
          setPendingScrollToLoop(true);
        }
      } catch (err) {
        console.error("[loop-unlock] 생성 실패:", err);
        setLoopError(loopType);
        // pending marker 유지: 다음 방문 시 재시도 가능
      } finally {
        setLoopLoading(null);
      }
    },
    [analyzeData],
  );

  // loop 결제 모달 열기 (비QA mode 전용)
  const handlePurchaseLoop = useCallback((reading: AdditionalReading) => {
    setPaymentModal({
      isOpen: true,
      type: "loop",
      sceneIndex: 0,
      cardTitle: reading.title.replace(/\n/g, " "),
      loopType: reading.loopType,
    });
  }, []);

  // loop 카드 클릭 핸들러
  // loop QA mode: 바텀시트 없이 직접 생성 / 비QA mode: 결제 모달 열기
  const handleLoopCardClick = useCallback(
    (reading: AdditionalReading) => {
      if (isLoopQaMode) {
        void handleLoopUnlock(
          reading.loopType,
          reading.title.replace(/\n/g, " "),
        );
      } else {
        handlePurchaseLoop(reading);
      }
    },
    [isLoopQaMode, handleLoopUnlock, handlePurchaseLoop],
  );

  // "전체 질문 깊게 읽기" 클릭 핸들러
  // loop QA mode: 실제 loop_all 결제 흐름과 동일하게 순차 생성 (스크롤 1회 + loopAllPurchased 배너)
  // 비QA mode: loop_all 결제 모달 열기
  const handlePurchaseAllLoops = useCallback(() => {
    if (isLoopQaMode) {
      const locked = additionalReadings
        .slice(0, 3)
        .filter((r) => !loopAnswers[r.loopType]);
      if (locked.length === 0) return;

      // 실제 loop_all 결제 후 Phase 2 흐름과 동일하게 재현
      setLoopAllPurchased(true);
      setPendingScrollToLoop(true);
      const unlockAllQa = async () => {
        for (const r of locked) {
          // skipScroll=true: 개별 생성마다 스크롤 트리거 방지 (섹션 이동은 위 setPendingScrollToLoop로 1회만)
          await handleLoopUnlock(r.loopType, r.title.replace(/\n/g, " "), true);
        }
        setLoopAllPurchased(false);
      };
      void unlockAllQa();
    } else {
      setPaymentModal({
        isOpen: true,
        type: "loop_all",
        sceneIndex: 0,
        cardTitle: "추천 의뢰 모두 열기",
        loopType: null,
      });
    }
  }, [isLoopQaMode, additionalReadings, loopAnswers, handleLoopUnlock]);

  // loop 생성 재시도 (결제 없이 API 재호출)
  const handleRetryLoopGenerate = useCallback(
    (reading: AdditionalReading) => {
      const loopTitle = reading.title.replace(/\n/g, " ");
      void handleLoopUnlock(reading.loopType, loopTitle);
    },
    [handleLoopUnlock],
  );

  // ── Phase 2: 결제 완료 상태 감지 (Toss redirect param 기반) ──────────────────────────
  // Toss는 successUrl에 paymentKey/orderId/amount를 자동으로 추가함
  // 우리는 _unlock, _payment_type, _scene_index를 통해 unlock 처리를 구분함
  useEffect(() => {
    if (typeof window === "undefined" || !analyzeData) return;

    const searchParams = new URLSearchParams(window.location.search);
    const isUnlock = searchParams.get("_unlock") === "true";
    const hasPaymentKey = searchParams.has("paymentKey"); // Toss가 추가한 파라미터
    const paymentType = searchParams.get("_payment_type");
    const sessionId = analyzeData.session_id;

    // ── Debug log (개발 중 확인용) ──────────────────────────────────────
    if (isUnlock || hasPaymentKey) {
      console.log("[payment detection]", {
        isUnlock,
        hasPaymentKey,
        paymentKey: searchParams.get("paymentKey"),
        orderId: searchParams.get("orderId"),
        amount: searchParams.get("amount"),
        _payment_type: paymentType,
        sessionId,
      });
    }

    if (isUnlock && hasPaymentKey) {
      // 더블 실행 방지
      if (isProcessingPayment.current) return;
      isProcessingPayment.current = true;

      if (paymentType === "loop") {
        // ── Loop unlock flow (개별) ─────────────────────────────────
        const loopTypeParam = searchParams.get("_loop_type") as LoopType | null;
        if (!loopTypeParam) {
          isProcessingPayment.current = false;
          return;
        }
        const reading = additionalReadings.find(
          (r) => r.loopType === loopTypeParam,
        );
        const loopTitle = reading?.title.replace(/\n/g, " ") ?? loopTypeParam;

        // URL 먼저 정리: replaceState를 handleLoopUnlock 전에 호출해
        // 내부 replaceState가 같은 URL에서 실행 → Next.js 스크롤 리셋 방지
        window.history.replaceState({}, "", window.location.pathname);
        handleLoopUnlock(loopTypeParam, loopTitle).finally(() => {
          isProcessingPayment.current = false;
        });
      } else if (paymentType === "loop_all") {
        // ── Loop unlock flow (전체) ─────────────────────────────────
        // URL cleanup: loop_all은 Phase 2에서 한 번만 처리
        window.history.replaceState({}, "", window.location.pathname);
        setLoopAllPurchased(true);
        // "전체 질문을 열었어..." 배너가 렌더된 직후 스크롤 (생성 완료 대기 없음)
        setPendingScrollToLoop(true);
        const unlockAll = async () => {
          for (const r of additionalReadings.slice(0, 3)) {
            // skipScroll=true: 개별 handleLoopUnlock에서 스크롤 트리거 방지
            await handleLoopUnlock(
              r.loopType,
              r.title.replace(/\n/g, " "),
              true,
            );
          }
          setLoopAllPurchased(false);
          isProcessingPayment.current = false;
        };
        void unlockAll();
      } else {
        // ── Scene unlock flow ─────────────────────────────────────────
        const sceneIndex = parseInt(
          searchParams.get("_scene_index") || "0",
          10,
        );
        let paidSceneIndexes: number[] = [];

        if (paymentType === "single" && sceneIndex > 0) {
          paidSceneIndexes = [sceneIndex];
        } else if (paymentType === "all") {
          paidSceneIndexes = scenes
            .filter((s) => !s.is_free)
            .map((s) => s.scene_index);
        }

        const pendingKey = `veil_payment_pending_${sessionId}`;
        const isRecovery = !!localStorage.getItem(pendingKey);
        localStorage.setItem(pendingKey, "1");
        setIsPaidGenerationRecovery(isRecovery);
        setPaidGenerationLoading(true);

        // ── 결제 confirm → DB 저장 후 generatePaidScenes ─────────────
        // phone/pin 존재: 비회원 경로. 없음: 회원 경로 (cookie 세션으로 처리).
        // confirm 실패 시 unlock 중단. sessionStorage 정보는 성공 시에만 삭제.
        const runConfirmAndUnlock = async () => {
          const phone = sessionStorage.getItem("veil_pending_phone");
          const pin = sessionStorage.getItem("veil_pending_pin");

          const isGuestPath = !!phone && !!pin;

          try {
            const confirmRes = await fetch("/api/payments/confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                payment_key: searchParams.get("paymentKey") ?? "",
                order_id: searchParams.get("orderId") ?? "",
                amount: parseInt(searchParams.get("amount") ?? "0", 10),
                session_id: sessionId,
                payment_type: paymentType as "single" | "all",
                ...(paymentType === "single" && sceneIndex > 0
                  ? { scene_index: sceneIndex }
                  : {}),
                ...(isGuestPath ? { guest_phone: phone, guest_pin: pin } : {}),
              }),
            });

            if (!confirmRes.ok) {
              const errData = (await confirmRes.json()) as { error?: string };
              throw new Error(errData.error ?? "결제 확인에 실패했어");
            }

            // 성공 시에만 sessionStorage 정리 (실패 시에는 재시도 가능하도록 유지)
            if (isGuestPath) {
              sessionStorage.removeItem("veil_pending_phone");
              sessionStorage.removeItem("veil_pending_pin");
            }
          } catch (err) {
            const msg =
              err instanceof Error
                ? err.message
                : "결제 확인 중 오류가 발생했어";
            console.error("[payment confirm 실패]", err);
            setPaymentConfirmError(msg);
            setPaidGenerationLoading(false);
            localStorage.removeItem(pendingKey);
            isProcessingPayment.current = false;
            return;
          }

          // ── confirm 성공 → generatePaidScenes ────────────────────
          generatePaidScenes(paidSceneIndexes)
            .then(() => {
              const newUnlocked = [
                ...new Set([...unlockedScenes, ...paidSceneIndexes]),
              ];
              setUnlockedScenes(newUnlocked);
              const nextSceneIdx = scenes.findIndex(
                (s) => s.scene_index === paidSceneIndexes[0],
              );
              if (nextSceneIdx >= 0) {
                setCurrentSceneIndex(nextSceneIdx);
                scrollToSceneTop();
              }

              if (typeof window !== "undefined") {
                localStorage.setItem(
                  `veil_unlocked_scenes_${sessionId}`,
                  JSON.stringify(newUnlocked),
                );
                localStorage.removeItem(pendingKey);
                console.log(
                  "[unlock saved]",
                  `veil_unlocked_scenes_${sessionId}`,
                );
              }

              window.history.replaceState({}, "", window.location.pathname);

              setTimeout(() => {
                if (flowOverviewRef.current) {
                  flowOverviewRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }, 300);
            })
            .catch((err) => {
              console.error("[paid generation failed]", err);
            })
            .finally(() => {
              isProcessingPayment.current = false;
              setPaidGenerationLoading(false);
            });
        };

        void runConfirmAndUnlock();
      }
    } else if (searchParams.get("_payment_failed") === "true") {
      console.log("[payment failed]");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [
    analyzeData,
    scenes,
    unlockedScenes,
    generatePaidScenes,
    additionalReadings,
    handleLoopUnlock,
  ]);

  // 네비게이션 메뉴 열림 상태 감지 (Progress Indicator 숨기기)
  // analyzeData 로드 후 share_token 조회. 실패 시 null 유지 → ResultActions 버튼 비활성.
  useEffect(() => {
    if (!analyzeData) return;
    const fetchShareToken = async () => {
      try {
        const res = await fetch(
          `/api/sessions/${analyzeData.session_id}/share-token`,
        );
        if (res.ok) {
          const data = (await res.json()) as { share_token: string };
          setShareToken(data.share_token);
        }
      } catch {
        // 공유 버튼 비활성으로 처리 (에러 무시)
      }
    };
    void fetchShareToken();
  }, [analyzeData]);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const checkMenuState = () => {
      const isOpen = header.getAttribute("data-mobile-menu-open") === "true";
      setMobileMenuOpen(isOpen);
    };

    checkMenuState();

    const observer = new MutationObserver(checkMenuState);
    observer.observe(header, {
      attributes: true,
      attributeFilter: ["data-mobile-menu-open"],
    });

    return () => observer.disconnect();
  }, []);

  // loop 결제 후 AdditionalReadings 섹션 스크롤
  // useEffect + double RAF: React 페인트 이후 실행 → replaceState/scroll restoration보다 나중에 보장
  useEffect(() => {
    if (!pendingScrollToLoop) return;
    let raf2: number | undefined;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el =
          document.getElementById("loop-readings-section") ??
          loopReadingsRef.current;
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
        setPendingScrollToLoop(false);
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2 !== undefined) cancelAnimationFrame(raf2);
    };
  }, [pendingScrollToLoop]);

  // Scene progression: currentSceneIndex는 scenes 배열 index로만 사용한다.
  useEffect(() => {
    if (scenes.length > 0 && currentSceneIndex > scenes.length - 1) {
      setCurrentSceneIndex(scenes.length - 1);
    }
  }, [scenes, currentSceneIndex]);

  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    type: "single" | "all" | "loop" | "loop_all";
    sceneIndex: number;
    cardTitle: string;
    loopType: LoopType | null;
  }>({
    isOpen: false,
    type: "single",
    sceneIndex: 0,
    cardTitle: "",
    loopType: null,
  });

  const handleOpenPaymentModal = (
    type: "single" | "all",
    sceneIndex?: number,
    cardTitle?: string,
  ) => {
    setPaymentModal({
      isOpen: true,
      type,
      sceneIndex: sceneIndex || 0,
      cardTitle: cardTitle || "",
      loopType: null,
    });
  };

  const handleClosePaymentModal = () => {
    setPaymentModal((prev) => ({ ...prev, isOpen: false }));
  };

  // TODO: [결제 성공] URL 파라미터로 결제 완료 처리 (위의 useEffect 참고)

  const scrollToSceneTop = () => {
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const handleUnlockScene = (sceneIndex: number, cardTitle?: string) => {
    const scene = scenes.find((s) => s.scene_index === sceneIndex);
    if (scene) {
      handleOpenPaymentModal(
        "single",
        sceneIndex,
        cardTitle || getSceneDisplayTitle(scene),
      );
    }
  };

  const handleUnlockAll = () => {
    handleOpenPaymentModal("all");
  };

  const handleRecordListSceneClick = (scene: ResultScene) => {
    const isUnlocked =
      scene.is_free || unlockedScenes.includes(scene.scene_index);

    if (isUnlocked) {
      const sceneIdx = scenes.findIndex(
        (s) => s.scene_index === scene.scene_index,
      );
      if (sceneIdx >= 0) {
        setCurrentSceneIndex(sceneIdx);
        setIsRecordListOpen(false);
        scrollToSceneTop();
      }
      return;
    }

    setIsRecordListOpen(false);
    handleUnlockScene(scene.scene_index, getSceneDisplayTitle(scene));
  };

  const handleUnlockAllFromRecordList = () => {
    setIsRecordListOpen(false);
    handleUnlockAll();
  };

  // ── 로딩 ──────────────────────────────────────────────────────
  // analyze page의 completing stage에서 이미 progress bar를 표시하므로,
  // result page는 로딩 화면 없이 바로 에러나 콘텐츠를 표시한다.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
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

  // 유료씬 전체 구매 완료 여부: AdditionalReadings 노출 gate
  const paidScenes = scenes.filter((s) => !s.is_free);
  const allPaidUnlocked =
    paidScenes.length > 0 &&
    paidScenes.every((s) => unlockedScenes.includes(s.scene_index));
  const activeScene = scenes[currentSceneIndex] ?? scenes[0];
  const displaySceneConfig = analyzeData
    ? getSceneConfig(analyzeData.content_id)
    : null;
  const getSceneDisplayTitle = (scene: ResultScene): string =>
    displaySceneConfig?.scenes.find(
      (configScene) => configScene.index === scene.scene_index,
    )?.title ?? scene.scene_title;
  const getSceneSubtitle = (sceneIndex: number): string | undefined =>
    displaySceneConfig?.scenes.find((scene) => scene.index === sceneIndex)
      ?.subtitle;
  const getSceneSignals = (sceneIndex: number) =>
    analyzeData
      ? deriveSceneSignals({
          contentId: analyzeData.content_id,
          hiddenState,
          sceneIndex,
        })
      : [];
  const activeSceneUnlocked =
    !!activeScene &&
    (activeScene.is_free || unlockedScenes.includes(activeScene.scene_index));
  const canAdvanceScene =
    !!activeScene &&
    activeSceneUnlocked &&
    currentSceneIndex < scenes.length - 1;
  const showAdditionalRequests =
    !!activeScene &&
    activeSceneUnlocked &&
    currentSceneIndex === scenes.length - 1 &&
    (isLoopQaMode || (!isQaMode && allPaidUnlocked));
  const showPaidGenerationLoadingOverride =
    process.env.NEXT_PUBLIC_SHOW_PAID_GENERATION_LOADING === "true";
  const showLoopLoadingOverride =
    process.env.NEXT_PUBLIC_SHOW_LOOP_LOADING === "true";
  const showLoopUnlockedMock =
    process.env.NEXT_PUBLIC_SHOW_LOOP_UNLOCKED_MOCK === "true";
  const loopLoadingOverrideType = additionalReadings.slice(0, 3)[0]?.loopType;
  const loopUnlockedMockReading = additionalReadings.slice(0, 3)[0];
  const loopAnswersForDisplay =
    showLoopUnlockedMock && loopUnlockedMockReading
      ? {
          ...loopAnswers,
          [loopUnlockedMockReading.loopType]: {
            loopType: loopUnlockedMockReading.loopType,
            title: loopUnlockedMockReading.title,
            generatedAt: "2026-01-01T00:00:00.000Z",
            messages: [
              {
                type: "punch",
                text: "아직 끝난 질문은 아니야.",
              },
              {
                type: "ai",
                text: "이 의뢰는 남은 감정의 방향을 다시 확인하기 위한 기록이야. 지금 바로 결론을 내리기보다, 네가 어디에서 계속 멈춰 서는지 먼저 살펴보면 돼.",
              },
            ],
          } satisfies LoopAnswer,
        }
      : loopAnswers;
  const showFlowOverview = false;
  const showProgressIndicator = false;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#1d192b",
      }}
    >
      {/* ── 메인 콘텐츠 영역 ──────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {/* ── Progress Indicator (fixed) ──────────────────────── */}
        {showProgressIndicator && (
          <div
            className="fixed left-0 right-0 top-13 z-40 h-10 flex items-center justify-center"
            style={{
              opacity: mobileMenuOpen ? 0 : 1,
              pointerEvents: mobileMenuOpen ? "none" : "auto",
            }}
          >
            <ProgressIndicator
              scenes={scenes}
              unlockedScenes={unlockedScenes}
              currentSceneIndex={currentSceneIndex}
            />
          </div>
        )}

        <div className="w-full max-w-lg mx-auto">
          {/* 콘텐츠 헤더 */}
          {analyzeData &&
            (() => {
              const content = CONTENTS.find(
                (c) => c.id === analyzeData.content_id,
              );
              return content ? (
                <div
                  className={`px-5 pt-10 ${currentSceneIndex === 0 ? "pb-2 space-y-4" : "pb-0"}`}
                >
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
                        height: "38px",
                        background: "rgba(60, 45, 65, 0.30)",
                        borderTop: "1px solid rgba(143, 122, 216, 0.12)",
                        borderRight: "1px solid rgba(143, 122, 216, 0.12)",
                        borderLeft: "1px solid rgba(143, 122, 216, 0.12)",
                        borderBottom: "1px solid rgba(143, 122, 216, 0.12)",
                        borderRadius: "14px 14px 0 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        opacity: 0.46,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
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
                        height: "38px",
                        background: "rgba(60, 45, 65, 0.36)",
                        borderTop: "1px solid rgba(143, 122, 216, 0.18)",
                        borderRight: "1px solid rgba(143, 122, 216, 0.18)",
                        borderLeft: "1px solid rgba(143, 122, 216, 0.18)",
                        borderBottom: "1px solid rgba(143, 122, 216, 0.18)",
                        borderRadius: "14px 14px 0 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        opacity: 0.58,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "400",
                          color: "rgba(255, 255, 255, 0.55)",
                          letterSpacing: "0.02em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        기록 작성 완료
                      </span>
                    </div>
                    <div
                      style={{
                        flex: "0 1 auto",
                        height: "38px",
                        background: "rgba(92, 74, 132, 0.34)",
                        borderTop: "1px solid rgba(143, 122, 216, 0.30)",
                        borderRight: "1px solid rgba(143, 122, 216, 0.30)",
                        borderLeft: "1px solid rgba(143, 122, 216, 0.30)",
                        borderBottom: "none",
                        borderRadius: "14px 14px 0 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        opacity: 1,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "400",
                          color: "rgba(255, 255, 255, 0.92)",
                          letterSpacing: "0.02em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        결과 리포트
                      </span>
                    </div>
                  </div>

                  {currentSceneIndex === 0 && (
                    <>
                      <div
                        className="rounded-b-[18px] rounded-tr-[18px] px-3 py-2.5 lg:px-5 lg:py-4"
                        style={{
                          background: "rgba(60, 45, 65, 0.3)",
                          border: "1px solid rgba(143, 122, 216, 0.22)",
                        }}
                      >
                        <div className="px-3 py-1.5 lg:px-5 lg:py-3">
                          <div className="mb-2 flex items-center justify-between lg:mb-3">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="flex h-3.5 w-3.5 items-center justify-center"
                                style={{ color: "rgba(143, 122, 216, 0.52)" }}
                              >
                                <ClipboardList size={11} strokeWidth={1.7} />
                              </span>
                              <p
                                className="text-[10px] lg:text-[13px] tracking-[0.12em]"
                                style={{ color: "rgba(143, 122, 216, 0.68)" }}
                              >
                                선택한 의뢰
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 lg:gap-5">
                            {content.thumbnail_url && (
                              <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-[8px] bg-white/[0.025] opacity-85 lg:h-16 lg:w-16">
                                <Image
                                  src={content.thumbnail_url}
                                  alt={content.title}
                                  fill
                                  priority
                                  className="object-cover object-center"
                                />
                              </div>
                            )}

                            <div className="flex min-w-0 flex-1 flex-col justify-center">
                              <h1
                                className="text-[13px] lg:text-[16px] font-normal leading-snug"
                                style={{ color: "rgba(249,249,229,0.76)" }}
                              >
                                {content.title}
                              </h1>
                              <p
                                className="mt-0.5 text-[11px] lg:text-[14px] leading-snug"
                                style={{ color: "rgba(249,249,229,0.36)" }}
                              >
                                {content.subtitle}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {activeScene && (
                        <div
                          key={activeScene.id}
                          data-scene-idx={currentSceneIndex}
                          ref={(el) => {
                            if (el) {
                              sceneRefsMap.current[currentSceneIndex] = el;
                            }
                          }}
                          className="mt-3 rounded-[12px]"
                          style={{
                            background: "rgba(60, 45, 65, 0.3)",
                            border: "1px solid rgba(143, 122, 216, 0.10)",
                          }}
                        >
                          <SceneContent
                            scene={activeScene}
                            sceneTitle={getSceneDisplayTitle(activeScene)}
                            sceneSubtitle={getSceneSubtitle(
                              activeScene.scene_index,
                            )}
                            signals={getSceneSignals(activeScene.scene_index)}
                            isUnlocked={activeSceneUnlocked}
                            onUnlockScene={() =>
                              handleUnlockScene(
                                activeScene.scene_index,
                                getSceneDisplayTitle(activeScene),
                              )
                            }
                            isFirst
                            isCurrent
                            variant="receipt"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : null;
            })()}

          {activeScene && currentSceneIndex !== 0 && (
            <div
              key={activeScene.id}
              data-scene-idx={currentSceneIndex}
              ref={(el) => {
                if (el) {
                  sceneRefsMap.current[currentSceneIndex] = el;
                }
              }}
            >
              <SceneContent
                scene={activeScene}
                sceneTitle={getSceneDisplayTitle(activeScene)}
                sceneSubtitle={getSceneSubtitle(activeScene.scene_index)}
                signals={getSceneSignals(activeScene.scene_index)}
                isUnlocked={activeSceneUnlocked}
                onUnlockScene={() =>
                  handleUnlockScene(
                    activeScene.scene_index,
                    getSceneDisplayTitle(activeScene),
                  )
                }
                isFirst={currentSceneIndex === 0}
                isCurrent
                variant={currentSceneIndex === 0 ? "receipt" : "default"}
              />
            </div>
          )}

          {canAdvanceScene && (
            <div className="px-6 pb-10 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCurrentSceneIndex((prev) =>
                    Math.min(prev + 1, scenes.length - 1),
                  );
                  scrollToSceneTop();
                }}
                className="w-full transition-all duration-200 hover:opacity-90 active:opacity-75"
                style={{
                  background: "rgba(143, 122, 216, 0.24)",
                  border: "1px solid rgba(143, 122, 216, 0.32)",
                  borderRadius: "16px",
                  padding: "16px 18px",
                  color: "rgba(249, 249, 229, 0.90)",
                  boxShadow: "0 10px 28px rgba(20, 16, 32, 0.22)",
                }}
              >
                <span className="text-sm font-semibold tracking-[-0.01em]">
                  다음 기록 열기
                </span>
                <span
                  className="ml-2 text-sm"
                  style={{ color: "rgba(249, 249, 229, 0.56)" }}
                >
                  ›
                </span>
              </button>
            </div>
          )}

          {showFlowOverview && paidSceneCount > 0 && (
            <div ref={flowOverviewRef}>
              <FlowOverview
                scenes={scenes}
                unlockedScenes={unlockedScenes}
                onUnlockAll={handleUnlockAll}
                onUnlockScene={handleUnlockScene}
              />
            </div>
          )}

          {/* 추가 리딩 카드 (loop readings)
              - 일반 mode: 유료씬 전체 구매 완료 시에만 표시
              - ?qa=1: 숨김
              - ?qa=1&loop=1: 표시 (직접 생성) */}
          {(showAdditionalRequests ||
            showLoopLoadingOverride ||
            showLoopUnlockedMock) && (
            <div ref={loopReadingsRef} id="loop-readings-section">
              <AdditionalReadings
                readings={additionalReadings.slice(0, 3)}
                loopAnswers={loopAnswersForDisplay}
                loopLoading={
                  showLoopLoadingOverride && !showLoopUnlockedMock
                    ? (loopLoadingOverrideType ?? loopLoading)
                    : loopLoading
                }
                loopError={loopError}
                newlyUnlockedLoops={
                  showLoopUnlockedMock && loopUnlockedMockReading
                    ? [...newlyUnlockedLoops, loopUnlockedMockReading.loopType]
                    : newlyUnlockedLoops
                }
                loopAllPurchased={loopAllPurchased}
                onPurchaseSingle={handleLoopCardClick}
                onPurchaseAll={handlePurchaseAllLoops}
                onRetry={handleRetryLoopGenerate}
                isQaMode={isLoopQaMode}
              />
            </div>
          )}
        </div>

        {/* 결과 페이지 하단 액션 */}
        <ResultActions
          contentId={analyzeData.content_id}
          shareToken={shareToken}
        />
      </main>

      {!isRecordListOpen && (
        <button
          type="button"
          onClick={() => setIsRecordListOpen(true)}
          className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2.5 text-xs transition-opacity duration-200 hover:opacity-90 active:opacity-75"
          style={{
            background: "rgba(20, 16, 32, 0.82)",
            border: "1px solid rgba(143, 122, 216, 0.18)",
            color: "rgba(249, 249, 229, 0.72)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          <span>기록 목록</span>
          <span style={{ color: "rgba(143, 122, 216, 0.58)" }}>
            {String(activeScene.scene_index).padStart(2, "0")} /{" "}
            {String(scenes.length).padStart(2, "0")}
          </span>
        </button>
      )}

      <div
        className="fixed inset-0 z-50"
        style={{
          background: "rgba(6, 5, 14, 0.44)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          opacity: isRecordListOpen ? 1 : 0,
          pointerEvents: isRecordListOpen ? "auto" : "none",
          transition: "opacity 0.24s ease",
        }}
        onClick={() => setIsRecordListOpen(false)}
      />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md"
        style={{
          transform: isRecordListOpen ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)",
          background: "rgba(17, 14, 28, 0.96)",
          borderTop: "1px solid rgba(143, 122, 216, 0.14)",
          borderRadius: "22px 22px 0 0",
          paddingBottom: "env(safe-area-inset-bottom, 18px)",
        }}
      >
        <div className="flex justify-center pb-2 pt-3">
          <div
            style={{
              width: "36px",
              height: "3px",
              borderRadius: "2px",
              background: "rgba(249, 249, 229, 0.12)",
            }}
          />
        </div>

        <div className="px-5 pb-5 pt-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p
                className="text-[11px] font-medium tracking-[0.14em]"
                style={{ color: "rgba(143, 122, 216, 0.62)" }}
              >
                RESULT REPORT
              </p>
              <p
                className="mt-1 text-sm"
                style={{ color: "rgba(249, 249, 229, 0.82)" }}
              >
                기록 목록
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsRecordListOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs transition-opacity duration-200 hover:opacity-80"
              style={{
                color: "rgba(249, 249, 229, 0.42)",
                background: "rgba(255, 255, 255, 0.035)",
              }}
            >
              ✕
            </button>
          </div>

          <div className="space-y-1">
            {scenes.map((scene, sceneIdx) => {
              const isUnlocked =
                scene.is_free || unlockedScenes.includes(scene.scene_index);
              const isCurrent = sceneIdx === currentSceneIndex;
              const sceneSubtitle = getSceneSubtitle(scene.scene_index);

              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => handleRecordListSceneClick(scene)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-150"
                  style={{
                    background: isCurrent
                      ? "rgba(143, 122, 216, 0.09)"
                      : "transparent",
                    border: isCurrent
                      ? "1px solid rgba(143, 122, 216, 0.12)"
                      : "1px solid transparent",
                  }}
                >
                  <span
                    className="w-6 flex-shrink-0 text-[11px]"
                    style={{
                      color: isCurrent
                        ? "rgba(143, 122, 216, 0.72)"
                        : "rgba(143, 122, 216, 0.42)",
                    }}
                  >
                    {String(scene.scene_index).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className="block truncate text-[10px]"
                      style={{
                        color: isUnlocked
                          ? "rgba(143, 122, 216, 0.54)"
                          : "rgba(143, 122, 216, 0.32)",
                      }}
                    >
                      {getSceneDisplayTitle(scene)}
                    </span>
                    <span
                      className="mt-0.5 block truncate text-xs"
                      style={{
                        color: isUnlocked
                          ? "rgba(249, 249, 229, 0.72)"
                          : "rgba(249, 249, 229, 0.34)",
                      }}
                    >
                      {sceneSubtitle ?? getSceneDisplayTitle(scene)}
                    </span>
                  </span>
                  {!isUnlocked && (
                    <span
                      className="flex-shrink-0 text-[11px]"
                      style={{ color: "rgba(143, 122, 216, 0.44)" }}
                    >
                      잠김
                    </span>
                  )}
                  {isCurrent && (
                    <span
                      className="flex-shrink-0 text-[11px]"
                      style={{ color: "rgba(143, 122, 216, 0.58)" }}
                    >
                      열람 중
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {!allPaidUnlocked && (
            <button
              type="button"
              onClick={handleUnlockAllFromRecordList}
              className="mt-5 w-full rounded-[14px] py-3 text-sm font-medium transition-opacity duration-200 hover:opacity-90 active:opacity-75"
              style={{
                background: "rgba(143, 122, 216, 0.20)",
                border: "1px solid rgba(143, 122, 216, 0.26)",
                color: "rgba(249, 249, 229, 0.88)",
              }}
            >
              전체 기록 열기
            </button>
          )}
        </div>
      </div>

      {/* 결제 confirm 실패 에러 배너
          confirm 실패 시 unlock이 차단되고 재시도 안내를 표시한다.
          "다시 시도" → 페이지 리로드로 URL 파라미터를 유지한 채 Phase 2 재실행. */}
      {paymentConfirmError && (
        <div className="fixed bottom-4 left-0 right-0 z-50 mx-4 max-w-md sm:mx-auto rounded-xl border border-red-500/20 bg-background/95 backdrop-blur-sm p-4 shadow-xl">
          <p className="mb-3 text-sm text-red-400/90">{paymentConfirmError}</p>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 rounded-lg bg-secondary px-3 py-2 text-xs font-medium text-white transition-all hover:bg-secondary/90"
            >
              다시 시도
            </button>
            <button
              onClick={() => setPaymentConfirmError(null)}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-highlight/70 transition-all hover:bg-white/10"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 결제 모달: QA mode이거나 닫혀있을 때 완전 언마운트
          isOpen=false → DOM에서 제거(null 반환이 아님) → Toss SDK 인스턴스 격리
          key → 결제 타입/대상 전환 시 강제 remount → 이전 위젯 상태 오염 차단 */}
      {!isQaMode && paymentModal.isOpen && (
        <PaymentModal
          key={`${paymentModal.type}-${paymentModal.sceneIndex}-${paymentModal.loopType ?? "none"}-${paymentModal.cardTitle ?? ""}`}
          isOpen={paymentModal.isOpen}
          onClose={handleClosePaymentModal}
          paymentType={paymentModal.type}
          sceneIndex={paymentModal.sceneIndex}
          cardTitle={paymentModal.cardTitle}
          loopType={paymentModal.loopType ?? undefined}
        />
      )}

      {/* 유료 씬 생성 로딩 UI */}
      {(paidGenerationLoading || showPaidGenerationLoadingOverride) && (
        <PaidGenerationLoading isRecovery={isPaidGenerationRecovery} />
      )}
    </div>
  );
};

export default ResultPage;
