'use client';

import { useState, useEffect } from 'react';
import { FullReport } from '@/types/report';
import { savePendingOrder, readPendingOrder } from '@/lib/payment';
import { PendingOrderInput } from '@/types/payment';
import { getPriceForQuantity, getSavingsAmount, isBestDeal, getFullBundlePrice, PRICE_PER_QUESTION } from '@/lib/pricing';
import { TypewriterText } from '@/components/ui/typewriter-text';
import { PaymentModal } from './payment-modal';
import { ChevronDown } from 'lucide-react';

interface ReportViewProps {
  report: FullReport;
}

/**
 * 리포트 뷰 — PRD 6, 9.3, 9.6
 * - 무료 리포트 표시
 * - 유료 질문 선택 (할인 구조 포함)
 */
export const ReportView = ({ report }: ReportViewProps) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [selectFullBundle, setSelectFullBundle] = useState(false);
  // 탭 재오픈 시 결제 진행 중이던 주문 복원
  const [pendingOrder, setPendingOrder] = useState<PendingOrderInput | null>(() => readPendingOrder());
  const { freeReport, paidQuestions, category, createdAt } = report;

  // 결제 완료된 질문 ID (sessionStorage 기반, Toss redirect 후에도 유지)
  const [localPurchasedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(sessionStorage.getItem(`purchased_${report.sessionId}`) || '[]') as string[];
    } catch {
      return [];
    }
  });

  // 구매 완료된 축 (1-3, sessionStorage 기반) — 결제 후 업데이트
  const [purchasedAxes, setPurchasedAxes] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(sessionStorage.getItem(`purchased_axes_${report.sessionId}`) || '[]') as number[];
    } catch {
      return [];
    }
  });

  // 결제 성공 후 purchasedAxes 동기화
  useEffect(() => {
    const checkPurchasedAxes = () => {
      if (typeof window === 'undefined') return;
      try {
        const axes = JSON.parse(sessionStorage.getItem(`purchased_axes_${report.sessionId}`) || '[]') as number[];
        setPurchasedAxes(axes);
      } catch {
        // ignore
      }
    };

    checkPurchasedAxes();
  }, [report.sessionId]);

  // 현재 활성 축: 구매된 축이 없으면 1, 있으면 다음 축 표시
  // axis가 정의되지 않은 질문은 축 1로 취급 (기본값)
  const questionsWithAxis = paidQuestions.map(q => ({ ...q, axis: q.axis ?? 1 }));
  const currentAxis = purchasedAxes.length < 3 ? (purchasedAxes.length + 1 as 1 | 2 | 3) : null;

  // 질문 분류: 현재 축의 질문만 표시 (추천 1-3, 아코디언 4-8)
  const availableQuestions = currentAxis ? questionsWithAxis.filter((q) => q.axis === currentAxis) : [];
  const recommendedQuestions = availableQuestions
    .filter((q) => q.displayOrder >= 1 && q.displayOrder <= 3)
    .sort((a, b) => a.displayOrder - b.displayOrder);
  const accordionQuestions = availableQuestions
    .filter((q) => q.displayOrder >= 4 && q.displayOrder <= 8)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const formattedDate = new Date(createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
  const showSavings = (isFullBundleSelected || selectedQuestions.length >= 2);
  const showBestDeal = isBestDeal(selectedQuestions.length) && !isFullBundleSelected;

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
    // 구매된 축 기록 (sessionStorage)
    if (currentAxis && typeof window !== 'undefined') {
      const existing = JSON.parse(sessionStorage.getItem(`purchased_axes_${report.sessionId}`) || '[]') as number[];
      const newAxes = [...existing, currentAxis];
      sessionStorage.setItem(`purchased_axes_${report.sessionId}`, JSON.stringify(newAxes));
      setPurchasedAxes(newAxes);
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
            style={{ background: 'linear-gradient(90deg, #6495ED 0%, #A366FF 100%)' }}
          >
            {category}
          </span>
          <span className="text-xs" style={{ color: '#E0E0E0' }}>{formattedDate} 분석</span>
        </div>
      </div>

      {/* 무료 리포트 섹션 */}
      {freeReport && (
        <section className="mb-12 rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md md:p-10">
          <div className="mb-6">
            <span className="text-xs font-semibold" style={{ color: '#B0B0FF' }}>FREE INSIGHT</span>
            <h1 className="mt-2 text-2xl font-bold leading-relaxed md:text-3xl" style={{ color: '#F5F5F5' }}>
              <TypewriterText text={freeReport.headline} speed={25} />
            </h1>
          </div>

          <div className="space-y-8">
            {freeReport.sections.map((section, idx) => (
              <div key={idx}>
                <h2 className="mb-3 text-base font-semibold" style={{ color: '#E0E0E0' }}>
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.paragraphs.map((para, pIdx) => (
                    <p key={pIdx} className="text-sm leading-relaxed" style={{ color: '#D0D0D0' }}>
                      <TypewriterText text={para} speed={20} />
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 결핍 문장 */}
          <div className="mt-8 rounded-xl border-l-4 border-[#6495ED] bg-blue-500/20 p-4 backdrop-blur-sm" style={{ borderLeftColor: '#6495ED' }}>
            <p className="text-sm font-medium leading-relaxed" style={{ color: '#F5F5F5' }}>
              <TypewriterText text={freeReport.deficitSentence} speed={25} />
            </p>
          </div>
        </section>
      )}

      {/* 구매 완료된 질문들 — 무료리포트 스타일로 표시 */}
      {paidQuestions.length > 0 && questionsWithAxis.filter((q) => localPurchasedIds.includes(q.id) || q.isPurchased).length > 0 && (
        <section className="mb-12 space-y-8">
          {questionsWithAxis
            .filter((q) => localPurchasedIds.includes(q.id) || q.isPurchased)
            .map((pq) => (
              <div key={pq.id} className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-md md:p-10">
                <div className="mb-6">
                  <span className="text-xs font-semibold" style={{ color: '#B0B0FF' }}>{pq.question}</span>
                  {pq.report ? (
                    <div className="mt-4 space-y-8">
                      {pq.report.map((section, idx) => (
                        <div key={idx}>
                          <h2 className="mb-3 text-base font-semibold" style={{ color: '#E0E0E0' }}>
                            {section.title}
                          </h2>
                          <div className="space-y-3">
                            {section.paragraphs.map((para, pIdx) => (
                              <p key={pIdx} className="text-sm leading-relaxed" style={{ color: '#D0D0D0' }}>
                                <TypewriterText text={para} speed={20} />
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-relaxed" style={{ color: '#D0D0D0' }}>
                      {pq.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </section>
      )}

      {/* 유료 질문 섹션 — 구매 가능한 축이 남아있을 때만 표시 */}
      {paidQuestions.length > 0 && currentAxis && (
        <section>
          <div className="mb-8">
            <h2 className="text-xl font-bold md:text-2xl" style={{ color: '#F5F5F5' }}>
              더 깊이 알고 싶어?
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#D0D0D0' }}>
              궁금한 질문을 선택해서 심층 분석을 확인해봐.
            </p>
          </div>

          {/* 추천 질문 (1-3) — 구매 안 된 것만 표시 */}
          <div className="mb-8 space-y-3">
            {recommendedQuestions
              .filter((q) => !localPurchasedIds.includes(q.id) && !q.isPurchased)
              .map((pq) => {
              const isSelected = selectedQuestions.includes(pq.id);

              return (
                <div key={pq.id} className="relative">
                  <div className="group">
                    <button
                      onClick={() => !selectFullBundle && toggleQuestion(pq.id)}
                      disabled={selectFullBundle}
                      className={`peer flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all backdrop-blur-sm md:p-5 ${
                        isSelected
                          ? 'border-[#6495ED] bg-blue-500/20'
                          : selectFullBundle
                            ? 'cursor-default border-[#6495ED] bg-blue-500/20 opacity-100'
                            : 'border-white/10 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      {/* 체크박스 */}
                      <span
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                          isSelected || selectFullBundle
                            ? 'border-[#6495ED] bg-[#6495ED]'
                            : 'border-white/30 hover:border-white/50'
                        }`}
                      >
                        {(isSelected || selectFullBundle) && <span className="text-white text-xs">✓</span>}
                      </span>

                      {/* 내용 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-relaxed" style={{ color: '#F5F5F5' }}>
                          {pq.question}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed" style={{ color: '#B8A8D8' }}>
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
            const unPurchasedAccordion = accordionQuestions.filter((q) => !localPurchasedIds.includes(q.id) && !q.isPurchased);
            return unPurchasedAccordion.length > 0 ? (
              <div className="mb-8">
                <button
                  onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold transition-all hover:bg-white/10 md:px-5 md:py-5"
                  style={{ color: '#E0E0E0' }}
                >
                  <span>더 많은 질문 보기 ({unPurchasedAccordion.length}개)</span>
                <ChevronDown
                  size={20}
                  className={`transition-transform ${isAccordionOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* 아코디언 내용 — 구매 안 된 질문만 표시 */}
              {isAccordionOpen && (
                <div className="mt-3 space-y-3">
                  {accordionQuestions
                    .filter((q) => !localPurchasedIds.includes(q.id) && !q.isPurchased)
                    .map((pq) => {
                    const isSelected = selectedQuestions.includes(pq.id);

                    return (
                      <div key={pq.id} className="relative">
                        <div className="group">
                          <button
                            onClick={() => !selectFullBundle && toggleQuestion(pq.id)}
                            disabled={selectFullBundle}
                            className={`peer flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all backdrop-blur-sm md:p-5 ${
                              isSelected
                                ? 'border-[#6495ED] bg-blue-500/20'
                                : selectFullBundle
                                  ? 'cursor-default border-[#6495ED] bg-blue-500/20 opacity-100'
                                  : 'border-white/10 hover:border-white/20 hover:bg-white/10'
                            }`}
                          >
                            {/* 체크박스 */}
                            <span
                              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                                isSelected || selectFullBundle
                                  ? 'border-[#6495ED] bg-[#6495ED]'
                                  : 'border-white/30 hover:border-white/50'
                              }`}
                            >
                              {(isSelected || selectFullBundle) && <span className="text-white text-xs">✓</span>}
                            </span>

                            {/* 내용 */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-relaxed" style={{ color: '#F5F5F5' }}>
                                {pq.question}
                              </p>
                              <p className="mt-1 text-xs leading-relaxed" style={{ color: '#B8A8D8' }}>
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
          {recommendedQuestions.filter((q) => !localPurchasedIds.includes(q.id) && !q.isPurchased).length > 0 && (
            <div className="mb-8">
              <button
                onClick={handleFullBundleToggle}
                className={`flex w-full flex-col md:flex-row md:items-center md:justify-between rounded-xl border p-4 text-left transition-all backdrop-blur-sm md:p-5 gap-3 md:gap-0 ${
                  selectFullBundle
                    ? 'border-[#A366FF] bg-purple-500/20'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* 체크박스 */}
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                      selectFullBundle ? 'border-[#A366FF] bg-[#A366FF]' : 'border-border/50'
                    }`}
                  >
                    {selectFullBundle && <span className="text-white">✓</span>}
                  </span>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>
                      단계 {currentAxis} 전체 질문 보기
                    </p>
                    <p className="mt-1 text-xs" style={{ color: '#D0D0D0' }}>
                      추천 3개 + 추가 5개 (총 8개 질문)
                    </p>
                  </div>
                </div>

                {/* 가격 */}
                <div className="text-right md:ml-4 md:flex-shrink-0">
                  <p className="text-sm font-bold text-[#A366FF]">₩{getFullBundlePrice().toLocaleString()}</p>
                  <p className="text-xs text-green-400">약 {(PRICE_PER_QUESTION * 8 - getFullBundlePrice()).toLocaleString()}원 절약</p>
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
                    ? 'linear-gradient(90deg, #A366FF 0%, #D4A5FF 100%)'
                    : 'linear-gradient(90deg, #6495ED 0%, #A366FF 100%)',
                }}
              >
                <span>
                  {selectFullBundle ? (
                    <>전체 보기</>
                  ) : (
                    <>
                      {selectedQuestions.length}개 선택
                      {showSavings && <span className="ml-1 text-xs font-normal">· {savingsAmount.toLocaleString()}원 절약</span>}
                    </>
                  )}
                </span>
                <span>{totalPrice.toLocaleString()}원</span>
              </button>

              {showSavings && (
                <p className="text-center text-[10px] font-semibold" style={{ color: selectFullBundle ? '#D4A5FF' : '#6495ED' }}>
                  💜 {savingsAmount.toLocaleString()}원 절약
                </p>
              )}
            </div>
          )}

          {/* 질문 선택 가이드 */}
          {selectedQuestions.length === 0 && !selectFullBundle && (
            <div className="rounded-xl border border-white/10 bg-blue-500/20 p-4 text-center text-xs backdrop-blur-sm md:p-5" style={{ color: '#E0E0E0' }}>
              <p>
                <strong>💡 팁:</strong> 질문을 선택하면 할인이 적용돼.
                {paidQuestions.length >= 3 && ' 또는 전체 질문을 한 번에 봐서 더 절약하기!'}
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
            <h2 className="mb-3 text-2xl font-bold" style={{ color: '#F5F5F5' }}>
              모든 심층 분석을 구매했어요
            </h2>
            <p className="text-sm" style={{ color: '#D0D0D0' }}>
              더 이상 추가 확장 리포트는 없습니다. 지금까지의 분석들이 당신의 선택을 돕길 바랍니다.
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
