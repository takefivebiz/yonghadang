'use client';

import { PendingOrderInput } from '@/types/payment';

interface OrderSummaryProps {
  pendingOrder: PendingOrderInput;
}

/** 결제 페이지 주문 요약 카드 */
export const OrderSummary = ({ pendingOrder }: OrderSummaryProps) => {
  const { category, paidQuestionIds } = pendingOrder;
  const pricePerQuestion = 4900;
  const total = paidQuestionIds.length * pricePerQuestion;

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        background: "linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))",
        borderColor: "rgba(230, 230, 250, 0.15)",
      }}
    >
      <h2 className="mb-4 text-sm font-semibold" style={{ color: '#F0E6FA' }}>
        주문 요약
      </h2>

      <div className="mb-3 flex items-center justify-between text-sm">
        <span style={{ color: '#D4C5E2' }}>카테고리</span>
        <span className="font-medium" style={{ color: '#F0E6FA' }}>{category}</span>
      </div>

      <div className="mb-3 flex items-center justify-between text-sm">
        <span style={{ color: '#D4C5E2' }}>선택한 질문</span>
        <span className="font-medium" style={{ color: '#F0E6FA' }}>
          {paidQuestionIds.length}개
        </span>
      </div>

      <div
        className="border-t pt-3"
        style={{ borderColor: "rgba(230, 230, 250, 0.1)" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: '#D4C5E2' }}>
            총 결제 금액
          </span>
          <span className="text-lg font-bold" style={{ color: '#F0E6FA' }}>
            {total.toLocaleString('ko-KR')}원
          </span>
        </div>
      </div>
    </div>
  );
};
