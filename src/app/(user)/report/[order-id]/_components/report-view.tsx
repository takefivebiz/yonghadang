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
 * - 분석 타입별 톤 적용 (인지형/감정형/균형형)
 * - 카테고리별 리포트 구조 다양화
 */
export const ReportView = ({ report, analysisSession }: ReportViewProps) => {
  const router = useRouter();
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const { freeReport, paidQuestions, category, createdAt } = report;

  // PRD 3.7: 추론된 사용자 타입 기반 리포트 톤 적용
  const reportTone = analysisSession?.inferredUserType?.reportTone ?? '균형형';
  const questionStrategy = analysisSession?.inferredUserType?.questionStrategy ?? '구조중심';
  const topTraits = analysisSession?.inferredUserType?.topTraits ?? [];

  const formattedDate = new Date(createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // 분석 타입별 톤 색상 정의
  const toneColors = {
    인지형: {
      headline: '#2D3250', // 진한 보라
      border: '#BEAEDB',
      bg: 'rgba(100, 149, 237, 0.08)',
      accent: '#6495ED',
    },
    감정형: {
      headline: '#C4A69D', // 따뜻한 갈색
      border: '#D4AFA0',
      bg: 'rgba(196, 166, 157, 0.08)',
      accent: '#E8C4B8',
    },
    균형형: {
      headline: '#4A3B5C', // 중간 보라
      border: '#BEAEDB',
      bg: 'rgba(141, 90, 170, 0.08)',
      accent: '#8D5AAA',
    },
  };

  const toneColor = toneColors[reportTone];

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
    <div className="mx-auto w-full max-w-2xl px-4 py-8 md:py-10">
      {/* 헤더: 카테고리 + 톤 뱃지 + 날짜 */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: "linear-gradient(90deg, #6495ED 0%, #A366FF 100%)",
              color: "white",
            }}
          >
            {category}
          </span>
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium"
            style={{
              backgroundColor: toneColor.bg,
              color: toneColor.headline,
              border: `1px solid ${toneColor.border}`,
            }}
          >
            {reportTone}
          </span>
        </div>
        <p className="text-xs" style={{ color: '#9B88AC' }}>
          {formattedDate} 분석
        </p>
      </div>

      {/* 무료 리포트 */}
      {freeReport && (
        <section className="mb-12">
          {/* 헤드라인 — 톤별 다른 스타일 */}
          <div
            className="mb-8 rounded-3xl p-6"
            style={{
              background: toneColor.bg,
              borderLeft: `4px solid ${toneColor.border}`,
            }}
          >
            <h1
              className="text-lg font-bold leading-relaxed"
              style={{ color: toneColor.headline }}
            >
              {freeReport.headline}
            </h1>
          </div>

          {/* 섹션 목록 */}
          <div className="space-y-6">
            {freeReport.sections.map((section, idx) => (
              <div key={idx}>
                <h2
                  className="mb-3 text-sm font-semibold"
                  style={{ color: toneColor.headline }}
                >
                  {section.title}
                </h2>
                <div className="space-y-2.5">
                  {section.paragraphs.map((para, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-sm leading-relaxed"
                      style={{ color: '#4A3B5C' }}
                    >
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
              background: toneColor.bg,
              borderLeft: `3px solid ${toneColor.border}`,
            }}
          >
            <p
              className="text-sm font-medium leading-relaxed"
              style={{ color: toneColor.headline }}
            >
              {freeReport.deficitSentence}
            </p>
          </div>

          {/* 톤 설명 */}
          <div className="mt-6 text-xs" style={{ color: '#9B88AC' }}>
            <p>
              💡 이 분석은 <strong>{reportTone}</strong> 성향을 반영하여 작성되었습니다.
              {reportTone === '인지형' && ' 논리적이고 구조적인 관점에서 상황을 분석했어요.'}
              {reportTone === '감정형' && ' 감정과 심리 중심으로 깊이 있게 분석했어요.'}
              {reportTone === '균형형' && ' 이성과 감정의 균형을 맞춰 분석했어요.'}
            </p>
          </div>
        </section>
      )}

      {/* 유료 질문 목록 */}
      {paidQuestions.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="mb-2 text-base font-semibold" style={{ color: '#2D3250' }}>
              더 깊이 알고 싶어?
            </h2>
            <p className="text-sm" style={{ color: '#9B88AC' }}>
              궁금한 질문을 선택하면 더 심층적인 분석을 볼 수 있어.
              {selectedQuestions.length > 0 && (
                <span style={{ color: toneColor.headline }} className="font-medium">
                  {' '}
                  {selectedQuestions.length}개 선택됨
                </span>
              )}
            </p>
          </div>

          <div className="mb-6 space-y-3">
            {paidQuestions.map((pq) => {
              const isSelected = selectedQuestions.includes(pq.id);
              const isPurchased = pq.isPurchased;

              return (
                <div key={pq.id}>
                  <button
                    onClick={() => !isPurchased && toggleQuestion(pq.id)}
                    disabled={isPurchased}
                    className={`flex w-full items-start gap-3 rounded-2xl border p-5 text-left transition-all ${
                      isPurchased
                        ? 'cursor-default opacity-80'
                        : isSelected
                        ? 'shadow-md'
                        : 'hover:shadow-sm'
                    }`}
                    style={{
                      borderColor: isPurchased
                        ? "rgba(100, 149, 237, 0.1)"
                        : isSelected
                        ? toneColor.border
                        : "rgba(100, 149, 237, 0.2)",
                      background: isPurchased
                        ? "rgba(200, 200, 200, 0.03)"
                        : isSelected
                        ? toneColor.bg
                        : "rgba(100, 149, 237, 0.02)",
                    }}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
                        isPurchased || isSelected ? "text-white" : ""
                      }`}
                      style={{
                        borderColor: isPurchased || isSelected ? toneColor.border : "rgba(100, 149, 237, 0.3)",
                        backgroundColor: isPurchased || isSelected ? toneColor.accent : "transparent",
                      }}
                    >
                      {isPurchased ? '✓' : isSelected ? '✓' : ''}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: '#2D3250' }}>
                        {pq.question}
                      </p>
                      <p className="mt-1 text-xs font-medium" style={{ color: toneColor.headline }}>
                        {isPurchased ? '✨ 구매 완료' : `💜 ${pq.price.toLocaleString('ko-KR')}원`}
                      </p>
                    </div>
                  </button>

                  {/* 구매한 질문의 확장 리포트 */}
                  {isPurchased && pq.report && (
                    <div
                      className="mt-3 rounded-2xl border p-5"
                      style={{
                        borderColor: toneColor.border,
                        background: toneColor.bg,
                      }}
                    >
                      {pq.report.map((section, idx) => (
                        <div key={idx} className={idx > 0 ? 'mt-4' : ''}>
                          <h3
                            className="mb-2 text-sm font-semibold"
                            style={{ color: toneColor.headline }}
                          >
                            {section.title}
                          </h3>
                          {section.paragraphs.map((para, pIdx) => (
                            <p
                              key={pIdx}
                              className="mb-2 text-sm leading-relaxed"
                              style={{ color: '#4A3B5C' }}
                            >
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
            <div className="sticky bottom-4 left-0 right-0">
              <button
                onClick={handlePurchase}
                className="flex min-h-[56px] w-full items-center justify-center rounded-2xl text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90"
                style={{
                  background: `linear-gradient(90deg, ${toneColor.accent} 0%, #A366FF 100%)`,
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
