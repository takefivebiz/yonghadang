"use client";

import { useState, useEffect } from "react";
import { FullReport } from "@/types/report";
import { Order } from "@/types/order";
import { savePendingOrder, readPendingOrder } from "@/lib/payment";
import { PendingOrderInput } from "@/types/payment";
import {
  getPriceForQuantity,
  getSavingsAmount,
  isBestDeal,
  getFullBundlePrice,
  PRICE_PER_QUESTION,
} from "@/lib/pricing";
import { getPaidQuestionsForLoop } from "@/lib/actions/order";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { PaymentModal } from "./payment-modal";
import { ChevronDown } from "lucide-react";

interface ReportViewProps {
  report: FullReport & { currentAxis: 1 | 2 | 3 };
  order?: Order;
}

/**
 * 리포트 뷰 — PRD 6, 9.3, 9.6
 * - 무료 리포트 표시
 * - 유료 질문 선택 (할인 구조 포함)
 */
export const ReportView = ({ report, order }: ReportViewProps) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [selectFullBundle, setSelectFullBundle] = useState(false);
  // 탭 재오픈 시 결제 진행 중이던 주문 복원
  const [pendingOrder, setPendingOrder] = useState<PendingOrderInput | null>(
    () => readPendingOrder(),
  );
  /**
   * 이미 열람한 리포트는 TypewriterText 애니메이션 없이 즉시 표시.
   * localStorage 플래그로 판단하여 매 새로고침·재방문 시 재애니메이션 방지.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [instantText, setInstantText] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(`corelog:report_viewed_${report.sessionId}`);
  });

  const {
    freeReport,
    paidQuestions: initialPaidQuestions,
    category,
    createdAt,
  } = report;

  // paidQuestions를 state로 관리 (report 데이터 업데이트 반영용)
  const [paidQuestions, setPaidQuestions] = useState(initialPaidQuestions);
  const [completedPaidQuestions, setCompletedPaidQuestions] = useState<typeof paidQuestions>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [currentLoopDepth, setCurrentLoopDepth] = useState(1);
  const [isLoadingNextLoop, setIsLoadingNextLoop] = useState(false);

  /**
   * 결제 완료된 질문 ID (sessionStorage → localStorage → order 순서로 복원).
   * 탭 닫기·재방문 후에도 localStorage에서 복원되도록 3단 fallback 구조.
   */
  const [localPurchasedIds, setLocalPurchasedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      // 1. sessionStorage 우선 (동일 탭 결제 직후)
      const sessionIds = JSON.parse(
        sessionStorage.getItem(`purchased_${report.sessionId}`) || "[]",
      ) as string[];
      if (sessionIds.length > 0) return sessionIds;

      // 2. localStorage (탭 닫기·새 탭 재방문 시 복원)
      const localIds = JSON.parse(
        localStorage.getItem(`corelog:purchased_ids_${report.sessionId}`) ||
          "[]",
      ) as string[];
      if (localIds.length > 0) return localIds;

      // 3. order.paidQuestionIds fallback (report-client 폴링으로 주입된 경우)
      if (order?.paidQuestionIds && order.paidQuestionIds.length > 0) {
        return order.paidQuestionIds;
      }

      return [];
    } catch {
      return [];
    }
  });

  // 구매 완료된 축 (1-3, sessionStorage + localStorage 병합) — 결제 후 업데이트
  const [purchasedAxes, setPurchasedAxes] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      // sessionStorage 우선, 없으면 localStorage에서 복원 (redirect 후 복구용)
      const sessionAxes = JSON.parse(
        sessionStorage.getItem(`purchased_axes_${report.sessionId}`) || "[]",
      ) as number[];
      if (sessionAxes.length > 0) return sessionAxes;

      const localAxes = JSON.parse(
        localStorage.getItem(`corelog:purchased_axes_${report.sessionId}`) ||
          "[]",
      ) as number[];
      return localAxes;
    } catch {
      return [];
    }
  });

  // 첫 열람 직후 localStorage에 플래그만 저장 → 다음 방문부터 instant=true 적용
  // (현재 세션에는 setInstantText 하지 않아 첫 방문 애니메이션은 유지)
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`corelog:report_viewed_${report.sessionId}`, "1");
    // 의도적으로 마운트 1회만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 결제 후 report 데이터 폴링
  // - status === 'done'이면 폴링 중단
  // - 또는 모든 구매 질문의 report이 생성되면 폴링 중단
  useEffect(() => {
    // 불필요한 polling 방지: 구매한 질문이 없으면 폴링 안 함
    if (localPurchasedIds.length === 0) {
      setIsPolling(false);
      return;
    }

    // 구매한 질문 중 report이 없는 것이 있는지 확인
    const hasUnreportedQuestions = paidQuestions.some(
      (q) => localPurchasedIds.includes(q.id) && !q.report,
    );

    // report이 모두 생겼으면 폴링 중단
    if (!hasUnreportedQuestions) {
      setIsPolling(false);
      return;
    }

    setIsPolling(true);
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/sessions/${report.sessionId}/status`,
        );
        if (!response.ok) {
          console.log(
            "[ReportView] Status API response not ok:",
            response.status,
          );
          return;
        }

        const data = await response.json();
        console.log("[ReportView] Polling response data:", {
          status: data.status,
          hasReportData: !!data.report_data,
        });

        if (!data.report_data) {
          console.log("[ReportView] No report_data in response");
          return;
        }

        // report_data 파싱
        let reportData;
        try {
          reportData = JSON.parse(data.report_data) as {
            paidQuestions?: Array<{
              id: string;
              question: string;
              description: string;
              price: number;
              displayOrder: number;
              axis: 1 | 2 | 3;
              report?: Array<{ title: string; paragraphs: string[] }>;
            }>;
          };
        } catch (parseError) {
          console.error(
            "[ReportView] Failed to parse report_data:",
            parseError,
          );
          return;
        }

        if (
          !reportData.paidQuestions ||
          reportData.paidQuestions.length === 0
        ) {
          console.log("[ReportView] No paidQuestions in reportData");
          return;
        }

        console.log("[ReportView] Updating paidQuestions with reports:", {
          totalQuestions: reportData.paidQuestions.length,
          purchasedIds: localPurchasedIds,
          questionsWithReports: reportData.paidQuestions
            .filter((q) => q.report && q.report.length > 0)
            .map((q) => q.id),
        });

        // paidQuestions 업데이트 + completedPaidQuestions에 누적
        let updateCount = 0;
        const updated = paidQuestions.map((q) => {
          const reportQuestion = reportData.paidQuestions?.find(
            (rq) => rq.id === q.id,
          );
          if (
            reportQuestion?.report &&
            reportQuestion.report.length > 0 &&
            !q.report
          ) {
            console.log(`[ReportView] Updating question ${q.id} with report`);
            updateCount++;
            return { ...q, report: reportQuestion.report };
          }
          return q;
        });

        if (updateCount > 0) {
          console.log(
            `[ReportView] Setting paidQuestions with ${updateCount} new reports`,
          );
          setPaidQuestions(updated);

          // completedPaidQuestions에도 report이 생성된 것들 누적
          const reportedQuestions = updated.filter(
            (q) => localPurchasedIds.includes(q.id) && q.report && q.report.length > 0,
          );
          setCompletedPaidQuestions((prev) => {
            const merged = [...prev];
            reportedQuestions.forEach((newQ) => {
              const exists = merged.some((p) => p.id === newQ.id);
              if (!exists) {
                merged.push(newQ);
              }
            });
            return merged;
          });
        }

        // localPurchasedIds의 모든 질문이 report을 가지고 있으면 폴링 중단
        const allPurchasedReportGenerated = localPurchasedIds.every((qId) => {
          const reportQuestion = reportData.paidQuestions?.find(
            (rq) => rq.id === qId,
          );
          const hasReport =
            reportQuestion?.report && reportQuestion.report.length > 0;
          console.log(`[ReportView] Question ${qId} report status:`, hasReport);
          return hasReport;
        });

        console.log(
          "[ReportView] All purchased reports generated?",
          allPurchasedReportGenerated,
        );

        if (allPurchasedReportGenerated) {
          console.log("[ReportView] All reports generated, stopping polling");
          clearInterval(pollInterval);
          setIsPolling(false);

          // 다음 Loop 질문 로드
          if (currentLoopDepth < 3) {
            setIsLoadingNextLoop(true);
            const nextLoopDepth = currentLoopDepth + 1;
            try {
              const result = await getPaidQuestionsForLoop({
                sessionId: report.sessionId,
                loopDepth: nextLoopDepth,
              });

              if (result.questions && result.questions.length >= 3) {
                console.log(
                  "[ReportView] Loaded next loop questions:",
                  result.questions.length,
                );
                setPaidQuestions(result.questions);
                setCurrentLoopDepth(nextLoopDepth);
                setSelectedQuestions([]);
              }
            } catch (error) {
              console.error("[ReportView] Failed to load next loop questions:", error);
            } finally {
              setIsLoadingNextLoop(false);
            }
          }
        }
      } catch (error) {
        console.error("[ReportView] Failed to fetch report_data:", error);
      }
    }, 2000); // 2초 주기

    return () => clearInterval(pollInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report.sessionId, localPurchasedIds, paidQuestions]);

  // report-client 폴링으로 order.paidQuestionIds가 갱신되면 localPurchasedIds에 병합
  useEffect(() => {
    if (!order?.paidQuestionIds || order.paidQuestionIds.length === 0) return;
    setLocalPurchasedIds((prev) => {
      const merged = [...new Set([...prev, ...order.paidQuestionIds!])];
      // localStorage에도 동기화 (재방문 시 복원용)
      try {
        localStorage.setItem(
          `corelog:purchased_ids_${report.sessionId}`,
          JSON.stringify(merged),
        );
      } catch {
        /* 쿼터 초과 무시 */
      }
      return merged;
    });
  }, [order?.paidQuestionIds, report.sessionId]);

  // 결제 성공 후 purchasedAxes 동기화 (localStorage 변경 감시)
  useEffect(() => {
    const checkPurchasedAxes = () => {
      if (typeof window === "undefined") return;
      try {
        // sessionStorage 확인
        let axes = JSON.parse(
          sessionStorage.getItem(`purchased_axes_${report.sessionId}`) || "[]",
        ) as number[];
        // sessionStorage가 없으면 localStorage에서 복원
        if (axes.length === 0) {
          axes = JSON.parse(
            localStorage.getItem(
              `corelog:purchased_axes_${report.sessionId}`,
            ) || "[]",
          ) as number[];
        }
        setPurchasedAxes(axes);
      } catch {
        // ignore
      }
    };

    checkPurchasedAxes();
    const interval = setInterval(checkPurchasedAxes, 1000);
    return () => clearInterval(interval);
  }, [report.sessionId]);

  // 현재 활성 축: report.currentAxis 사용 (weights 기반 결정)
  // 구매된 축이 많으면 progressively 다음 축으로 이동
  const questionsWithAxis = paidQuestions.map((q) => ({
    ...q,
    axis: q.axis ?? report.currentAxis,
  }));
  const completedQuestionsWithAxis = completedPaidQuestions.map((q) => ({
    ...q,
    axis: q.axis ?? report.currentAxis,
  }));
  const displayAxis =
    purchasedAxes.length >= 3
      ? null
      : purchasedAxes.includes(report.currentAxis)
        ? ((report.currentAxis + 1) as 1 | 2 | 3 | 4)
        : report.currentAxis;
  const currentAxis = (displayAxis && displayAxis <= 3 ? displayAxis : null) as
    | 1
    | 2
    | 3
    | null;

  // 질문 분류: 현재 축의 질문만 표시 (추천 1-3, 아코디언 4-8)
  const availableQuestions = currentAxis
    ? questionsWithAxis.filter((q) => q.axis === currentAxis)
    : [];
  const recommendedQuestions = availableQuestions
    .filter((q) => q.displayOrder >= 1 && q.displayOrder <= 3)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const accordionQuestions = availableQuestions
    .filter((q) => q.displayOrder >= 4 && q.displayOrder <= 8)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const formattedDate = new Date(createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 가격 계산
  const isFullBundleSelected = selectFullBundle;
  const finalSelectedQuestions = isFullBundleSelected
    ? availableQuestions.map((q) => q.id)
    : selectedQuestions;
  const totalPrice = isFullBundleSelected
    ? getFullBundlePrice()
    : getPriceForQuantity(selectedQuestions.length);
  const savingsAmount = isFullBundleSelected
    ? PRICE_PER_QUESTION * availableQuestions.length - getFullBundlePrice()
    : getSavingsAmount(selectedQuestions.length);
  const showSavings = isFullBundleSelected || selectedQuestions.length >= 2;
  const showBestDeal =
    isBestDeal(selectedQuestions.length) && !isFullBundleSelected;

  const toggleQuestion = (id: string) => {
    if (selectFullBundle) return; // 전체 번들 선택 중일 때는 개별 선택 불가
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id],
    );
  };

  const handlePurchase = () => {
    if (finalSelectedQuestions.length === 0) return;
    const order: PendingOrderInput = {
      sessionId: report.sessionId,
      category,
      paidQuestionIds: finalSelectedQuestions,
      isFullBundle: selectFullBundle,
      savedAt: Date.now(),
    };
    savePendingOrder(order);
    setPendingOrder(order);
  };

  const handleFullBundleToggle = () => {
    setSelectFullBundle(!selectFullBundle);
    if (!selectFullBundle) {
      setSelectedQuestions([]); // 전체 번들 선택 시 개별 선택 초기화
    }
  };

  const handlePaymentSuccess = () => {
    if (typeof window === "undefined") return;

    // 구매된 축 기록 (sessionStorage)
    if (currentAxis) {
      const existing = JSON.parse(
        sessionStorage.getItem(`purchased_axes_${report.sessionId}`) || "[]",
      ) as number[];
      const newAxes = [...existing, currentAxis];
      sessionStorage.setItem(
        `purchased_axes_${report.sessionId}`,
        JSON.stringify(newAxes),
      );
      setPurchasedAxes(newAxes);
    }

    // 결제 성공한 질문 IDs를 localPurchasedIds + localStorage에 즉시 반영
    // (payment-modal이 Toss redirect 없이 resolve 되는 경우 sessionStorage만으로 동기화)
    const purchased = pendingOrder?.paidQuestionIds ?? finalSelectedQuestions;
    if (purchased.length > 0) {
      setLocalPurchasedIds((prev) => {
        const merged = [...new Set([...prev, ...purchased])];
        try {
          localStorage.setItem(
            `corelog:purchased_ids_${report.sessionId}`,
            JSON.stringify(merged),
          );
        } catch {
          /* 쿼터 초과 무시 */
        }
        return merged;
      });
    }

    setPendingOrder(null);
    setSelectedQuestions([]);
    setSelectFullBundle(false);
  };

  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
        {/* 헤더 */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{
                background: "linear-gradient(90deg, #6495ED 0%, #A366FF 100%)",
              }}
            >
              {category}
            </span>
            <span className="text-xs" style={{ color: "#E0E0E0" }}>
              {formattedDate} 분석
            </span>
          </div>
        </div>

        {/* 무료 리포트 섹션 */}
        {freeReport && (
          <section className="mb-16">
            {/* 헤드라인 */}
            <div
              className="mb-16 pb-8"
              style={{ borderBottom: "1px solid rgba(230, 230, 250, 0.08)" }}
            >
              <span
                className="inline-block text-xs font-semibold mb-3 opacity-50"
                style={{ color: "#B0B0FF" }}
              >
                분석 결과
              </span>
              <h1
                className="text-3xl md:text-4xl font-bold leading-tight"
                style={{ color: "#F5F5F5" }}
              >
                <TypewriterText
                  text={freeReport.headline}
                  speed={25}
                  instant={instantText}
                />
              </h1>
            </div>

            {/* 섹션들 */}
            <div className="space-y-16">
              {freeReport.sections.map((section, idx) => (
                <article key={idx}>
                  <h2
                    className="mb-5 text-lg font-semibold"
                    style={{ color: "#E8E0F5" }}
                  >
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.paragraphs.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        className="text-base leading-relaxed"
                        style={{ color: "#D4C5E2" }}
                      >
                        <TypewriterText
                          text={para}
                          speed={20}
                          instant={instantText}
                        />
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {/* 결론 & CTA - 질문으로 유도 */}
            <div
              className="mt-16 pt-8"
              style={{ borderTop: "1px solid rgba(230, 230, 250, 0.08)" }}
            >
              <p
                className="text-base leading-relaxed"
                style={{ color: "#E0D5F0", fontStyle: "italic" }}
              >
                <TypewriterText
                  text={freeReport.deficitSentence}
                  speed={25}
                  instant={instantText}
                />
              </p>
            </div>
          </section>
        )}

        {/* 구매 완료된 질문들 — 유료 리포트 콘텐츠 표시 */}
        {completedPaidQuestions.length > 0 && (
            <section className="mb-12 space-y-8">
              {completedQuestionsWithAxis
                .filter(
                  (q) => localPurchasedIds.includes(q.id) || q.isPurchased,
                )
                .map((pq) => {
                  return (
                    <div
                      key={pq.id}
                      className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md md:p-10"
                    >
                      <div className="mb-6">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "#B0B0FF" }}
                        >
                          {pq.question}
                        </span>
                        {pq.report && pq.report.length > 0 ? (
                          <div className="mt-4 space-y-6">
                            {pq.report.map((section, sIdx) => (
                              <article key={sIdx}>
                                <h3
                                  className="mb-3 text-sm font-semibold"
                                  style={{ color: "#E8E0F5" }}
                                >
                                  {section.title}
                                </h3>
                                <div className="space-y-2">
                                  {section.paragraphs.map((para, pIdx) => (
                                    <p
                                      key={pIdx}
                                      className="text-sm leading-relaxed whitespace-pre-wrap"
                                      style={{ color: "#D0D0D0" }}
                                    >
                                      <TypewriterText
                                        text={para}
                                        speed={15}
                                        instant={instantText}
                                      />
                                    </p>
                                  ))}
                                </div>
                              </article>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-4 flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-white/30 animate-pulse" />
                            <p className="text-sm" style={{ color: "#999" }}>
                              이 질문을 더 깊이 보고 있어
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </section>
          )}

        {/* 유료 질문 섹션 — currentAxis 기반으로 표시 */}
        {paidQuestions.length > 0 && report.currentAxis && (
          <section>
            <div className="mb-8">
              <h2
                className="text-xl font-bold md:text-2xl"
                style={{ color: "#F5F5F5" }}
              >
                더 깊이 알고 싶어?
              </h2>
              <p className="mt-2 text-sm" style={{ color: "#D0D0D0" }}>
                궁금한 질문을 선택해서 심층 분석을 확인해봐.
              </p>
            </div>

            {/* 추천 질문 (1-3) — 구매 안 된 것만 표시 */}
            <div className="mb-8 space-y-3">
              {recommendedQuestions
                .filter(
                  (q) => !localPurchasedIds.includes(q.id) && !q.isPurchased,
                )
                .map((pq) => {
                  const isSelected = selectedQuestions.includes(pq.id);

                  return (
                    <div key={pq.id} className="relative">
                      <div className="group">
                        <button
                          onClick={() =>
                            !selectFullBundle && toggleQuestion(pq.id)
                          }
                          disabled={selectFullBundle}
                          className={`peer flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all backdrop-blur-sm md:p-5 ${
                            isSelected
                              ? "border-[#6495ED] bg-blue-500/20"
                              : selectFullBundle
                                ? "cursor-default border-[#6495ED] bg-blue-500/20 opacity-100"
                                : "border-white/10 hover:border-white/20 hover:bg-white/10"
                          }`}
                        >
                          {/* 체크박스 */}
                          <span
                            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                              isSelected || selectFullBundle
                                ? "border-[#6495ED] bg-[#6495ED]"
                                : "border-white/30 hover:border-white/50"
                            }`}
                          >
                            {(isSelected || selectFullBundle) && (
                              <span className="text-white text-xs">✓</span>
                            )}
                          </span>

                          {/* 내용 */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-medium leading-relaxed"
                              style={{ color: "#F5F5F5" }}
                            >
                              {pq.question}
                            </p>
                            <p
                              className="mt-1 text-xs leading-relaxed"
                              style={{ color: "#B8A8D8" }}
                            >
                              {pq.description}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-500/30 text-[#B0D0FF]">
                                900원
                              </span>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* 아코디언: 더 많은 질문 — 구매 안 된 것만 카운트 */}
            {(() => {
              const unPurchasedAccordion = accordionQuestions.filter(
                (q) => !localPurchasedIds.includes(q.id) && !q.isPurchased,
              );
              return unPurchasedAccordion.length > 0 ? (
                <div className="mb-8">
                  <button
                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold transition-all hover:bg-white/10 md:px-5 md:py-5"
                    style={{ color: "#E0E0E0" }}
                  >
                    <span>
                      더 많은 질문 보기 ({unPurchasedAccordion.length}개)
                    </span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform ${isAccordionOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* 아코디언 내용 — 구매 안 된 질문만 표시 */}
                  {isAccordionOpen && (
                    <div className="mt-3 space-y-3">
                      {accordionQuestions
                        .filter(
                          (q) =>
                            !localPurchasedIds.includes(q.id) && !q.isPurchased,
                        )
                        .map((pq) => {
                          const isSelected = selectedQuestions.includes(pq.id);

                          return (
                            <div key={pq.id} className="relative">
                              <div className="group">
                                <button
                                  onClick={() =>
                                    !selectFullBundle && toggleQuestion(pq.id)
                                  }
                                  disabled={selectFullBundle}
                                  className={`peer flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all backdrop-blur-sm md:p-5 ${
                                    isSelected
                                      ? "border-[#6495ED] bg-blue-500/20"
                                      : selectFullBundle
                                        ? "cursor-default border-[#6495ED] bg-blue-500/20 opacity-100"
                                        : "border-white/10 hover:border-white/20 hover:bg-white/10"
                                  }`}
                                >
                                  {/* 체크박스 */}
                                  <span
                                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                                      isSelected || selectFullBundle
                                        ? "border-[#6495ED] bg-[#6495ED]"
                                        : "border-white/30 hover:border-white/50"
                                    }`}
                                  >
                                    {(isSelected || selectFullBundle) && (
                                      <span className="text-white text-xs">
                                        ✓
                                      </span>
                                    )}
                                  </span>

                                  {/* 내용 */}
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="text-sm font-medium leading-relaxed"
                                      style={{ color: "#F5F5F5" }}
                                    >
                                      {pq.question}
                                    </p>
                                    <p
                                      className="mt-1 text-xs leading-relaxed"
                                      style={{ color: "#B8A8D8" }}
                                    >
                                      {pq.description}
                                    </p>
                                    <div className="mt-2 flex items-center gap-2">
                                      <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-500/30 text-[#B0D0FF]">
                                        900원
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              ) : null;
            })()}

            {/* 전체 번들 선택 옵션 — 구매 안 된 질문이 있을 때만 표시 */}
            {recommendedQuestions.filter(
              (q) => !localPurchasedIds.includes(q.id) && !q.isPurchased,
            ).length > 0 && (
              <div className="mb-8">
                <button
                  onClick={handleFullBundleToggle}
                  className={`flex w-full flex-col md:flex-row md:items-center md:justify-between rounded-xl border p-4 text-left transition-all backdrop-blur-sm md:p-5 gap-3 md:gap-0 ${
                    selectFullBundle
                      ? "border-[#A366FF] bg-purple-500/20"
                      : "border-white/10 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* 체크박스 */}
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                        selectFullBundle
                          ? "border-[#A366FF] bg-[#A366FF]"
                          : "border-border/50"
                      }`}
                    >
                      {selectFullBundle && (
                        <span className="text-white">✓</span>
                      )}
                    </span>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#F5F5F5" }}
                      >
                        단계 {currentAxis} 전체 질문 보기
                      </p>
                      <p className="mt-1 text-xs" style={{ color: "#D0D0D0" }}>
                        추천 3개 + 추가 5개 (총 8개 질문)
                      </p>
                    </div>
                  </div>

                  {/* 가격 */}
                  <div className="text-right md:ml-4 md:flex-shrink-0">
                    <p className="text-sm font-bold text-[#A366FF]">
                      ₩{getFullBundlePrice().toLocaleString()}
                    </p>
                    <p className="text-xs text-green-400">
                      약{" "}
                      {(
                        PRICE_PER_QUESTION * 8 -
                        getFullBundlePrice()
                      ).toLocaleString()}
                      원 절약
                    </p>
                  </div>
                </button>
              </div>
            )}

            {/* 구매 CTA */}
            {(selectedQuestions.length > 0 || selectFullBundle) && (
              <div className="sticky bottom-4 left-0 right-0 space-y-2">
                {showBestDeal && !selectFullBundle && (
                  <p className="text-center text-xs font-semibold text-orange-600">
                    🔥 가장 많이 선택되는 조합입니다!
                  </p>
                )}

                {selectFullBundle && (
                  <p className="text-center text-xs font-semibold text-purple-400">
                    ✨ 모든 질문을 한 번에 탐색할 수 있습니다!
                  </p>
                )}

                <button
                  onClick={handlePurchase}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 md:px-6 md:py-4"
                  style={{
                    background: selectFullBundle
                      ? "linear-gradient(90deg, #A366FF 0%, #D4A5FF 100%)"
                      : "linear-gradient(90deg, #6495ED 0%, #A366FF 100%)",
                  }}
                >
                  <span>
                    {selectFullBundle ? (
                      <>전체 보기</>
                    ) : (
                      <>
                        {selectedQuestions.length}개 선택
                        {showSavings && (
                          <span className="ml-1 text-xs font-normal">
                            · {savingsAmount.toLocaleString()}원 절약
                          </span>
                        )}
                      </>
                    )}
                  </span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </button>

                {showSavings && (
                  <p
                    className="text-center text-[10px] font-semibold"
                    style={{ color: selectFullBundle ? "#D4A5FF" : "#6495ED" }}
                  >
                    💜 {savingsAmount.toLocaleString()}원 절약
                  </p>
                )}
              </div>
            )}

            {/* 질문 선택 가이드 */}
            {selectedQuestions.length === 0 && !selectFullBundle && (
              <div
                className="rounded-xl border border-white/10 bg-blue-500/20 p-4 text-center text-xs backdrop-blur-sm md:p-5"
                style={{ color: "#E0E0E0" }}
              >
                <p>
                  <strong>💡 팁:</strong> 질문을 선택하면 할인이 적용돼.
                  {paidQuestions.length >= 3 &&
                    " 또는 전체 질문을 한 번에 봐서 더 절약하기!"}
                </p>
              </div>
            )}
          </section>
        )}

        {/* 모든 확장 리포트 구매 완료 메시지 */}
        {paidQuestions.length > 0 && !currentAxis && (
          <section className="mb-12 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-8 backdrop-blur-md md:p-10">
            <div className="text-center">
              <div className="mb-4 text-4xl">✨</div>
              <h2
                className="mb-3 text-2xl font-bold"
                style={{ color: "#F5F5F5" }}
              >
                모든 심층 분석을 구매했어요
              </h2>
              <p className="text-sm" style={{ color: "#D0D0D0" }}>
                더 이상 추가 확장 리포트는 없습니다. 지금까지의 분석들이 당신의
                선택을 돕길 바랍니다.
              </p>
            </div>
          </section>
        )}
      </div>

      {/* 결제 모달 */}
      {pendingOrder && (
        <PaymentModal
          pendingOrder={pendingOrder}
          onClose={() => setPendingOrder(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};
