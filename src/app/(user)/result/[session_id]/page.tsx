"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { generateMockResultScenes } from "@/lib/data/dummy-result-scenes";
import { DUMMY_INPUT_CONFIGS } from "@/lib/data/dummy-analyze-config";
import { getSceneConfig } from "@/lib/data/scene-configs";
import { ResultScene } from "@/lib/types/result";
import { AnalyzeAnswers, Answer } from "@/lib/types/analyze";
import { DUMMY_CONTENTS } from "@/lib/data/dummy-contents";
import { mergeScenes } from "@/lib/utils/merge-scenes";
import { createPaidScenePlaceholders } from "@/lib/utils/create-paid-scene-placeholders";
import SceneContent from "@/components/result/scene-content";
import FlowOverview from "@/components/result/flow-overview";
import ProgressIndicator from "@/components/result/progress-indicator";
import PaymentModal from "@/components/modals/payment-modal";
import ResultActions from "@/components/result/result-actions";
import PaidGenerationLoading from "@/components/result/paid-generation-loading";
import { getContentPack } from "@/lib/content-packs";
import { prioritizeAdditionalReadings } from "@/lib/quiz/accumulator";
import { translateStateToSummary } from "@/lib/quiz/translator";
import type { AdditionalReading, HiddenState } from "@/lib/types/quiz";
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
  const [isPaidGenerationRecovery, setIsPaidGenerationRecovery] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [additionalReadings, setAdditionalReadings] = useState<AdditionalReading[]>([]);
  // QA mode: ?qa=1 또는 NEXT_PUBLIC_QA_MODE=true → 결제 없이 전체 씬 확인
  const [isQaMode, setIsQaMode] = useState(false);

  const sceneRefsMap = useRef<Record<number, HTMLDivElement | null>>({});
  const flowOverviewRef = useRef<HTMLDivElement | null>(null);
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
        const rawHiddenState = localStorage.getItem(`veil_hidden_state_${param.session_id}`);
        const hiddenScores: HiddenState = rawHiddenState
          ? (JSON.parse(rawHiddenState) as HiddenState)
          : {};

        // additionalReadings: hiddenState 기반 우선순위 정렬 후 상위 5개
        if (pack) {
          const prioritized = prioritizeAdditionalReadings(hiddenScores, pack.additionalReadings);
          setAdditionalReadings(prioritized.slice(0, 5));
        }

        // ── 캐시된 scenes 확인 ─────────────────────────────────────────
        // 1. merged all scenes 확인 (결제 후)
        const allScenesKey = `veil_all_scenes_${param.session_id}`;
        const cachedAllScenes = localStorage.getItem(allScenesKey);

        // 2. free scenes만 확인 (초기 결과)
        const freeScenesKey = `veil_free_scenes_${param.session_id}`;
        const cachedFreeScenes = localStorage.getItem(freeScenesKey);

        console.log(
          "[result] cache 확인: allScenes=", !!cachedAllScenes,
          "freeScenes=", !!cachedFreeScenes,
          "| session=", param.session_id,
        );

        let resultScenes: ResultScene[];

        if (cachedAllScenes) {
          // merged all scenes 우선 로드 (결제 후 상태)
          resultScenes = JSON.parse(cachedAllScenes) as ResultScene[];
          console.log("[result] veil_all_scenes_ 로드:", resultScenes.length, "scenes,",
            "indexes:", resultScenes.map((s) => `${s.scene_index}(msg=${s.messages?.length ?? "null"})`));
        } else if (cachedFreeScenes) {
          // free scenes 로드 (초기 결과)
          resultScenes = JSON.parse(cachedFreeScenes) as ResultScene[];
          console.log("[result] veil_free_scenes_ 로드:", resultScenes.length, "scenes");
        } else {
          // ── 캐시 없음: API 시도 → 실패 시 mock fallback ──────────────
          // useMock=true : API key 없이 빠른 개발 확인용. 직접 mock 사용.
          // useMock=false: 실제 API 호출. 실패해도 mock으로 UX 유지 (에러 화면 없음).
          const useMock = process.env.NEXT_PUBLIC_USE_MOCK_RESULT !== "false";

          if (useMock) {
            resultScenes = generateMockResultScenes(data.content_id);
          } else {
            try {
              // ── 실제 Claude generate fallback ────────────────────────
              // analyze page가 이미 생성해서 캐시했으면 여기 오지 않는다.
              // 직접 URL 접근이나 analyze 실패 후 재방문 시의 fallback 경로.
              const content = DUMMY_CONTENTS.find(
                (c) => c.id === data.content_id,
              );
              if (!content) {
                throw new Error(`콘텐츠를 찾을 수 없어: ${data.content_id}`);
              }

              const inputConfig = DUMMY_INPUT_CONFIGS[data.content_id];
              const sceneConfig = getSceneConfig(data.content_id);

              const userAnswers = data.answers
                .filter(
                  (a: Answer) =>
                    Array.isArray(a.answer_options) &&
                    a.answer_options.length > 0,
                )
                .map((a: Answer) => {
                  const question = inputConfig?.questions.find(
                    (q) => q.index === a.question_index,
                  );
                  const labels = (a.answer_options ?? []).map((value) => {
                    const option = question?.options.find(
                      (o) => o.value === value,
                    );
                    return option?.label ?? value;
                  });
                  return {
                    question_index: a.question_index,
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
              localStorage.setItem(freeScenesKey, JSON.stringify(resultScenes));
            } catch (apiErr) {
              // API 실패 → mock으로 UX 유지. 에러 화면 절대 안 뜸.
              console.warn("[result] fallback generate 실패, mock 사용:", apiErr);
              resultScenes = generateMockResultScenes(data.content_id);
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
        // ?qa=1 URL 파라미터 또는 NEXT_PUBLIC_QA_MODE=true 환경변수
        // localStorage 상태를 건드리지 않고 메모리에서만 모든 씬 unlock
        const isQa =
          new URLSearchParams(window.location.search).get("qa") === "1" ||
          process.env.NEXT_PUBLIC_QA_MODE === "true";
        setIsQaMode(isQa);

        console.log(
          "[result] isQaMode=", isQa,
          "| allScenes:", allScenes.length,
          "| paid scenes:", allScenes.filter(s => !s.is_free).map(s => `${s.scene_index}(msg=${s.messages?.length ?? "null"})`),
        );

        if (isQa) {
          // QA mode: 결제 없이 전체 씬 확인 (localStorage 기록 없음)
          const allIndexes = allScenes.map((s) => s.scene_index);
          console.log("[result] QA mode: unlockedScenes 전체 설정 →", allIndexes);
          setUnlockedScenes(allIndexes);
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
  const generatePaidScenes = useCallback(async (paidSceneIndexes: number[]) => {
    try {
      if (!analyzeData) throw new Error("분석 데이터가 없어");

      const content = DUMMY_CONTENTS.find(
        (c) => c.id === analyzeData.content_id,
      );
      if (!content)
        throw new Error(`콘텐츠를 찾을 수 없어: ${analyzeData.content_id}`);

      const inputConfig = DUMMY_INPUT_CONFIGS[analyzeData.content_id];
      const sceneConfig = getSceneConfig(analyzeData.content_id);

      // Answer → {values, labels} 변환
      const userAnswers = analyzeData.answers
        .filter(
          (a: Answer) =>
            Array.isArray(a.answer_options) && a.answer_options.length > 0,
        )
        .map((a: Answer) => {
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
          ? localStorage.getItem(`veil_hidden_state_${analyzeData.session_id}`)
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
        throw new Error(errData.error ?? `결과 생성 실패 (HTTP ${res.status})`);
      }

      const resData = (await res.json()) as {
        session_id: string;
        result_scenes: ResultScene[];
      };

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
  }, [analyzeData, scenes]);

  // ── Phase 2: 결제 완료 상태 감지 (Toss redirect param 기반) ──────────────────────────
  // Toss는 successUrl에 paymentKey/orderId/amount를 자동으로 추가함
  // 우리는 _unlock, _payment_type, _scene_index를 통해 unlock 처리를 구분함
  useEffect(() => {
    if (typeof window === "undefined" || !analyzeData) return;

    const searchParams = new URLSearchParams(window.location.search);
    const isUnlock = searchParams.get("_unlock") === "true";
    const hasPaymentKey = searchParams.has("paymentKey"); // Toss가 추가한 파라미터
    const paymentType = searchParams.get("_payment_type");
    const sceneIndex = parseInt(searchParams.get("_scene_index") || "0", 10);
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
        _scene_index: sceneIndex,
        sessionId,
      });
    }

    if (isUnlock && hasPaymentKey) {
      // 더블 실행 방지: scenes 업데이트로 useEffect가 재실행될 수 있음
      if (isProcessingPayment.current) return;
      isProcessingPayment.current = true;

      // Toss 결제 성공 ✓ + 우리의 unlock 플래그 ✓
      // 결제된 scene_indexes 추출
      let paidSceneIndexes: number[] = [];

      if (paymentType === "single" && sceneIndex > 0) {
        paidSceneIndexes = [sceneIndex];
      } else if (paymentType === "all") {
        paidSceneIndexes = scenes
          .filter((s) => !s.is_free)
          .map((s) => s.scene_index);
      }

      // recovery 여부 감지: 이전 시도 마커가 있으면 재방문 복구 케이스
      const pendingKey = `veil_payment_pending_${sessionId}`;
      const isRecovery = !!localStorage.getItem(pendingKey);
      localStorage.setItem(pendingKey, "1");
      setIsPaidGenerationRecovery(isRecovery);

      // loading UI 표시
      setPaidGenerationLoading(true);

      // Paid scenes 생성 (mock placeholder를 실제 generated scenes으로 교체)
      generatePaidScenes(paidSceneIndexes)
        .then(() => {
          // 생성 완료 후에만 unlock 상태 저장 (성공 확인된 경우에만)
          const newUnlocked = [
            ...new Set([...unlockedScenes, ...paidSceneIndexes]),
          ];
          setUnlockedScenes(newUnlocked);

          // localStorage에 unlock 상태 저장 + 마커 제거
          if (typeof window !== "undefined") {
            localStorage.setItem(
              `veil_unlocked_scenes_${sessionId}`,
              JSON.stringify(newUnlocked),
            );
            localStorage.removeItem(pendingKey);
            console.log("[unlock saved]", `veil_unlocked_scenes_${sessionId}`);
          }

          // URL 정리: 성공 후에만 정리 (이탈 후 재방문 시 URL 파라미터로 재시도 가능하게 유지)
          window.history.replaceState({}, "", window.location.pathname);

          // 결제 완료 후 FlowOverview로 스크롤
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
          // URL 정리하지 않음: 재방문 시 URL 파라미터가 남아 자동 재시도됨
          // pendingKey도 유지: 다음 재방문 시 recovery=true로 표시
          // TODO: 사용자에게 에러 알림 (시도 재시도 옵션 제공)
        })
        .finally(() => {
          isProcessingPayment.current = false;
          setPaidGenerationLoading(false);
        });
    } else if (searchParams.get("_payment_failed") === "true") {
      console.log("[payment failed]");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [analyzeData, scenes, unlockedScenes, generatePaidScenes]);

  // 네비게이션 메뉴 열림 상태 감지 (Progress Indicator 숨기기)
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

  // Scroll 기반으로 현재 활성 scene 추적 (viewport center 기준)
  useEffect(() => {
    if (scenes.length === 0) return;

    let rafId: number | null = null;
    let lastSceneIdx = currentSceneIndex;

    const handleScroll = () => {
      // Viewport center 기준 (sticky header 고려)
      const viewportCenter = window.innerHeight * 0.5;
      let closestSceneIdx = 0;
      let closestDistance = Infinity;

      scenes.forEach((_, idx) => {
        const element = sceneRefsMap.current[idx];
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const sceneCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sceneCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSceneIdx = idx;
        }
      });

      // State 변경은 실제로 바뀔 때만
      if (closestSceneIdx !== lastSceneIdx) {
        setCurrentSceneIndex(closestSceneIdx);
        lastSceneIdx = closestSceneIdx;
      }
    };

    // RequestAnimationFrame으로 throttle
    const throttledScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          rafId = null;
        });
      }
    };

    window.addEventListener("scroll", throttledScroll);

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [scenes, currentSceneIndex]);

  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    type: "single" as "single" | "all",
    sceneIndex: 0,
    cardTitle: "",
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
    });
  };

  const handleClosePaymentModal = () => {
    setPaymentModal((prev) => ({ ...prev, isOpen: false }));
  };

  // TODO: [결제 성공] URL 파라미터로 결제 완료 처리 (위의 useEffect 참고)

  const handleUnlockScene = (sceneIndex: number, cardTitle?: string) => {
    const scene = scenes.find((s) => s.scene_index === sceneIndex);
    if (scene) {
      handleOpenPaymentModal(
        "single",
        sceneIndex,
        cardTitle || scene.scene_title,
      );
    }
  };

  const handleUnlockAll = () => {
    handleOpenPaymentModal("all");
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
      {/* ── 메인 콘텐츠 영역 ──────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {/* ── Progress Indicator (fixed) ──────────────────────── */}
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

        <div className="w-full max-w-lg mx-auto">
          {/* 콘텐츠 헤더 */}
          {analyzeData &&
            (() => {
              const content = DUMMY_CONTENTS.find(
                (c) => c.id === analyzeData.content_id,
              );
              return content ? (
                <div className="px-6 py-3 space-y-4 mt-10 flex flex-col items-center text-center">
                  {/* 썸네일 이미지 */}
                  {content.thumbnail_url && (
                    <div className="relative w-65 h-65 overflow-hidden rounded-[14px] bg-white/[0.04] shadow-2xl shadow-black/40">
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

          {/* 첫 무료 scene 감지 */}
          {(() => {
            const freeScenes = scenes.filter((s) => s.is_free);
            const firstFreeSceneId =
              freeScenes.length > 0 ? freeScenes[0].id : null;

            return (
              <>
                {/* 무료 Scene 렌더링 */}
                {/* sceneIdx는 scenes 배열의 실제 index (0, 1, 2, ...)
                    DOM 순서 = scenes 배열 순서 = data-scene-idx 순서
                    IntersectionObserver도 같은 sceneIdx로 currentSceneIndex 추적 */}
                {scenes.map((scene, sceneIdx) => {
                  if (!scene.is_free) return null;
                  const isUnlocked = unlockedScenes.includes(scene.scene_index);
                  const isFirst = scene.id === firstFreeSceneId;
                  const isCurrent = currentSceneIndex === sceneIdx;

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
                          handleUnlockScene(
                            scene.scene_index,
                            scene.scene_title,
                          )
                        }
                        isFirst={isFirst}
                        isCurrent={isCurrent}
                      />
                    </div>
                  );
                })}

                {/* 무료 Scene 이후 Flow Overview */}
                {paidSceneCount > 0 && (
                  <div ref={flowOverviewRef}>
                    <FlowOverview
                      scenes={scenes}
                      unlockedScenes={unlockedScenes}
                      onUnlockAll={handleUnlockAll}
                      onUnlockScene={handleUnlockScene}
                    />
                  </div>
                )}

                {/* 유료 Scene 렌더링 */}
                {/* sceneIdx는 scenes 배열 index 유지
                    무료/유료 섞여 있어도 scenes 배열 순서 기반이므로 안전 */}
                {scenes.map((scene, sceneIdx) => {
                  if (scene.is_free) return null;
                  const isUnlocked = unlockedScenes.includes(scene.scene_index);
                  const isCurrent = currentSceneIndex === sceneIdx;

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
                          handleUnlockScene(
                            scene.scene_index,
                            scene.scene_title,
                          )
                        }
                        isFirst={false}
                        isCurrent={isCurrent}
                      />
                    </div>
                  );
                })}
              </>
            );
          })()}

          {/* 추가 리딩 카드 */}
          {/* TODO: [결제 연동] unlockedReadingIds를 실제 구매 상태(DB/localStorage)로 교체 */}
          <AdditionalReadings
            readings={additionalReadings}
          />
        </div>

        {/* 결과 페이지 하단 액션 */}
        <ResultActions
          sessionId={analyzeData.session_id}
          contentId={analyzeData.content_id}
        />
      </main>

      {/* 결제 모달: QA mode에서는 렌더 자체를 제거 */}
      {!isQaMode && (
        <PaymentModal
          isOpen={paymentModal.isOpen}
          onClose={handleClosePaymentModal}
          paymentType={paymentModal.type}
          sceneIndex={paymentModal.sceneIndex}
          cardTitle={paymentModal.cardTitle}
        />
      )}

      {/* 유료 씬 생성 로딩 UI */}
      {paidGenerationLoading && <PaidGenerationLoading isRecovery={isPaidGenerationRecovery} />}
    </div>
  );
};

export default ResultPage;
