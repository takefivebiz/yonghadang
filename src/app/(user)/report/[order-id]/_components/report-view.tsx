'use client';

import { useState } from 'react';
import { FullReport } from '@/types/report';
import { AnalysisSession } from '@/types/analysis';
import { savePendingOrder } from '@/lib/payment';
import { PendingOrderInput } from '@/types/payment';
import { getPriceForQuantity, getSavingsAmount, isBestDeal } from '@/lib/pricing';
import { PaymentModal } from './payment-modal';

interface ReportViewProps {
  report: FullReport;
  analysisSession?: AnalysisSession | null;
}

/**
 * 리포트 뷰 — PRD 6, 9.3, 9.6
 * - 무료 리포트 표시
 * - 유료 질문 선택 (할인 구조 포함)
 */
export const ReportView = ({ report, analysisSession }: ReportViewProps) => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [pendingOrder, setPendingOrder] = useState<PendingOrderInput | null>(null);
  const { freeReport, paidQuestions, category, createdAt } = report;

  // 분석 타입 정보
  const reportTone = analysisSession?.inferredUserType?.reportTone ?? '균형형';
  const formattedDate = new Date(createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 가격 계산
  const totalPrice = getPriceForQuantity(selectedQuestions.length);
  const savingsAmount = getSavingsAmount(selectedQuestions.length);
  const showSavings = selectedQuestions.length >= 2;
  const showBestDeal = isBestDeal(selectedQuestions.length);

  const toggleQuestion = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id],
    );
  };

  const handlePurchase = () => {
    if (selectedQuestions.length === 0) return;
    const order: PendingOrderInput = {
      sessionId: report.sessionId,
      category,
      paidQuestionIds: selectedQuestions,
      savedAt: Date.now(),
    };
    savePendingOrder(order);
    setPendingOrder(order);
  };

  const handlePaymentSuccess = () => {
    setPendingOrder(null);
    setSelectedQuestions([]);
    // TODO: [백엔드 연동] 결제 완료 후 리포트 데이터 갱신
    window.location.reload();
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
              {freeReport.headline}
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
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 결핍 문장 */}
          <div className="mt-8 rounded-xl border-l-4 border-[#6495ED] bg-blue-500/20 p-4 backdrop-blur-sm" style={{ borderLeftColor: '#6495ED' }}>
            <p className="text-sm font-medium leading-relaxed" style={{ color: '#F5F5F5' }}>
              {freeReport.deficitSentence}
            </p>
          </div>
        </section>
      )}

      {/* 유료 질문 섹션 */}
      {paidQuestions.length > 0 && (
        <section>
          <div className="mb-8">
            <h2 className="text-xl font-bold md:text-2xl" style={{ color: '#F5F5F5' }}>
              더 깊이 알고 싶어?
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#D0D0D0' }}>
              궁금한 질문을 선택해서 심층 분석을 확인해봐.
            </p>
          </div>

          {/* 질문 목록 */}
          <div className="mb-6 space-y-3">
            {paidQuestions.map((pq, idx) => {
              const isSelected = selectedQuestions.includes(pq.id);
              const isPurchased = pq.isPurchased;

              return (
                <div key={pq.id}>
                  <button
                    onClick={() => !isPurchased && toggleQuestion(pq.id)}
                    disabled={isPurchased}
                    className={`group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all backdrop-blur-sm md:p-5 ${
                      isPurchased
                        ? 'cursor-default border-white/10 bg-white/5 opacity-60'
                        : isSelected
                          ? 'border-[#6495ED] bg-blue-500/20'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    {/* 체크박스 */}
                    <span
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                        isPurchased || isSelected ? 'border-[#6495ED] bg-[#6495ED]' : 'border-border/50'
                      }`}
                    >
                      {(isPurchased || isSelected) && <span className="text-white">✓</span>}
                    </span>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-relaxed" style={{ color: '#F5F5F5' }}>
                        {pq.question}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-block rounded-full bg-blue-500/30 px-2.5 py-0.5 text-xs font-semibold text-[#B0D0FF]">
                          {pq.isPurchased ? '✨ 보유 중' : '900원'}
                        </span>
                        {idx === paidQuestions.length - 1 && paidQuestions.length >= 3 && !isPurchased && (
                          <span className="text-[10px] font-semibold text-orange-300">추천 3번째 질문</span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* 구매한 질문의 리포트 */}
                  {isPurchased && pq.report && (
                    <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:p-5">
                      {pq.report.map((section, sIdx) => (
                        <div key={sIdx} className={sIdx > 0 ? 'mt-4' : ''}>
                          <h3 className="text-sm font-semibold" style={{ color: '#E0E0E0' }}>
                            {section.title}
                          </h3>
                          <div className="mt-2 space-y-2">
                            {section.paragraphs.map((para, pIdx) => (
                              <p key={pIdx} className="text-xs leading-relaxed" style={{ color: '#D0D0D0' }}>
                                {para}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 구매 CTA */}
          {selectedQuestions.length > 0 && (
            <div className="sticky bottom-4 left-0 right-0 space-y-2">
              {showBestDeal && (
                <p className="text-center text-xs font-semibold text-orange-600">
                  🔥 가장 많이 선택되는 조합입니다!
                </p>
              )}

              <button
                onClick={handlePurchase}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 md:px-6 md:py-4"
                style={{
                  background: 'linear-gradient(90deg, #6495ED 0%, #A366FF 100%)',
                }}
              >
                <span>
                  {selectedQuestions.length}개 선택
                  {showSavings && <span className="ml-1 text-xs font-normal">· {savingsAmount.toLocaleString()}원 절약</span>}
                </span>
                <span>{totalPrice.toLocaleString()}원</span>
              </button>

              {showSavings && (
                <p className="text-center text-[10px] font-semibold text-[#6495ED]">
                  💜 {savingsAmount.toLocaleString()}원 할인 적용되었습니다
                </p>
              )}
            </div>
          )}

          {/* 질문 개수별 가이드 */}
          {selectedQuestions.length === 0 && paidQuestions.length >= 2 && (
            <div className="rounded-xl border border-white/10 bg-blue-500/20 p-4 text-center text-xs backdrop-blur-sm md:p-5" style={{ color: '#E0E0E0' }}>
              <p>
                <strong>💡 팁:</strong> 2개 이상 선택하면 자동 할인이 적용돼.
                {paidQuestions.length >= 3 && ' 3개 선택 시 600원 절약!'}
              </p>
            </div>
          )}
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
