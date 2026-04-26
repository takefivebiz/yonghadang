'use client';

import { useState } from 'react';
import { FullReport } from '@/types/report';
import { AnalysisSession } from '@/types/analysis';
import { savePendingOrder } from '@/lib/payment';
import { useRouter } from 'next/navigation';

interface ReportViewProps {
  report: FullReport;
  analysisSession?: AnalysisSession | null;
}

/**
 * 리포트 뷰 — PRD 6: 무료 리포트 + 유료 확장 질문 목록
 */
export const ReportView = ({ report, analysisSession }: ReportViewProps) => {
  const router = useRouter();
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const { freeReport, paidQuestions, category, createdAt } = report;

  // PRD 3.7: 추론된 사용자 타입 기반 리포트 톤 적용
  const reportTone = analysisSession?.inferredUserType?.reportTone ?? '균형형';
  const questionStrategy = analysisSession?.inferredUserType?.questionStrategy ?? '구조중심';
  const topTraits = analysisSession?.inferredUserType?.topTraits ?? [];

  // 디버그: 콘솔에 추론 결과 출력
  if (analysisSession?.inferredUserType) {
    console.log('📊 사용자 타입 추론 결과:', {
      reportTone,
      questionStrategy,
      topTraits,
    });
  }

  const formattedDate = new Date(createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const toggleQuestion = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id],
    );
  };

  const handlePurchase = () => {
    if (selectedQuestions.length === 0) return;
    savePendingOrder({
      sessionId: report.sessionId,
      category,
      paidQuestionIds: selectedQuestions,
    });
    router.push('/payments');
  };

  const totalPrice = selectedQuestions.length * 4900;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* 카테고리 + 날짜 */}
      <div className="mb-6">
        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-medium"
          style={{
            background: "linear-gradient(90deg, #6495ED 0%, #A366FF 100%)",
            color: "white",
          }}
        >
          {category}
        </span>
        <p className="mt-2 text-xs" style={{ color: '#D4C5E2' }}>{formattedDate} 분석</p>
      </div>

      {/* 무료 리포트 */}
      {freeReport && (
        <section className="mb-10">
          <h1 className="mb-6 text-xl font-bold leading-snug" style={{ color: '#F0E6FA' }}>
            {freeReport.headline}
          </h1>

          <div className="space-y-6">
            {freeReport.sections.map((section, idx) => (
              <div key={idx}>
                <h2 className="mb-3 text-sm font-semibold" style={{ color: '#BEAEDB' }}>
                  {section.title}
                </h2>
                <div className="space-y-2">
                  {section.paragraphs.map((para, pIdx) => (
                    <p key={pIdx} className="text-sm leading-relaxed" style={{ color: '#D4C5E2' }}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 결핍 문장 — PRD 3.10.7 */}
          <div
            className="mt-8 rounded-2xl p-5"
            style={{
              background: "linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))",
              borderLeft: "3px solid #BEAEDB",
            }}
          >
            <p className="text-sm font-medium leading-relaxed" style={{ color: '#F0E6FA' }}>
              {freeReport.deficitSentence}
            </p>
          </div>
        </section>
      )}

      {/* 유료 질문 목록 */}
      {paidQuestions.length > 0 && (
        <section>
          <h2 className="mb-4 text-base font-semibold" style={{ color: '#F0E6FA' }}>
            더 깊이 알고 싶어?
          </h2>
          <p className="mb-5 text-sm" style={{ color: '#D4C5E2' }}>
            궁금한 질문을 선택하면 더 심층적인 분석을 볼 수 있어.
          </p>

          <div className="mb-6 space-y-3">
            {paidQuestions.map((pq) => {
              const isSelected = selectedQuestions.includes(pq.id);
              const isPurchased = pq.isPurchased;

              return (
                <div key={pq.id}>
                  <button
                    onClick={() => !isPurchased && toggleQuestion(pq.id)}
                    disabled={isPurchased}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                      isPurchased
                        ? 'cursor-default'
                        : isSelected
                        ? ''
                        : 'hover:border-[#BEAEDB]'
                    }`}
                    style={{
                      borderColor: isPurchased
                        ? "rgba(230, 230, 250, 0.1)"
                        : isSelected
                        ? "#BEAEDB"
                        : "rgba(230, 230, 250, 0.15)",
                      background: isPurchased
                        ? "rgba(100, 149, 237, 0.05)"
                        : isSelected
                        ? "rgba(100, 149, 237, 0.15)"
                        : "transparent",
                    }}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                        isPurchased || isSelected ? "text-white" : ""
                      }`}
                      style={{
                        borderColor: isPurchased || isSelected ? "#BEAEDB" : "rgba(230, 230, 250, 0.2)",
                        backgroundColor: isPurchased || isSelected ? "#BEAEDB" : "transparent",
                      }}
                    >
                      {isPurchased ? '✓' : isSelected ? '✓' : ''}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#F0E6FA' }}>
                        {pq.question}
                      </p>
                      <p className="mt-1 text-xs" style={{ color: '#D4C5E2' }}>
                        {isPurchased ? '구매 완료' : `${pq.price.toLocaleString('ko-KR')}원`}
                      </p>
                    </div>
                  </button>

                  {/* 구매한 질문의 확장 리포트 */}
                  {isPurchased && pq.report && (
                    <div
                      className="mt-2 rounded-2xl border p-4"
                      style={{
                        borderColor: "rgba(230, 230, 250, 0.15)",
                        background: "rgba(100, 149, 237, 0.08)",
                      }}
                    >
                      {pq.report.map((section, idx) => (
                        <div key={idx}>
                          <h3 className="mb-2 text-sm font-semibold" style={{ color: '#BEAEDB' }}>
                            {section.title}
                          </h3>
                          {section.paragraphs.map((para, pIdx) => (
                            <p key={pIdx} className="mb-2 text-sm leading-relaxed" style={{ color: '#D4C5E2' }}>
                              {para}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 선택한 질문 구매 CTA */}
          {selectedQuestions.length > 0 && (
            <div className="sticky bottom-4">
              <button
                onClick={handlePurchase}
                className="flex min-h-[56px] w-full items-center justify-center rounded-2xl text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(90deg, #6495ED 0%, #A366FF 100%)",
                }}
              >
                {selectedQuestions.length}개 선택 · {totalPrice.toLocaleString('ko-KR')}원 구매하기
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
