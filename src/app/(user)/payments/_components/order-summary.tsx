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
    <div className="rounded-2xl border border-border/50 bg-background p-5">
      <h2 className="mb-4 text-sm font-semibold" style={{ color: '#2D3250' }}>
        주문 요약
      </h2>

      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-foreground/60">카테고리</span>
        <span className="font-medium" style={{ color: '#2D3250' }}>{category}</span>
      </div>

      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-foreground/60">선택한 질문</span>
        <span className="font-medium" style={{ color: '#2D3250' }}>
          {paidQuestionIds.length}개
        </span>
      </div>

      <div className="border-t border-border/40 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: '#2D3250' }}>
            총 결제 금액
          </span>
          <span className="text-lg font-bold" style={{ color: '#2D3250' }}>
            {total.toLocaleString('ko-KR')}원
          </span>
        </div>
      </div>
    </div>
  );
};
