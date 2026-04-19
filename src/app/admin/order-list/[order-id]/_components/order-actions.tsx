"use client";

import { RefreshCw, RotateCcw } from "lucide-react";

/** 주문 상세 액션 버튼 그룹 (Client Component) */
export const OrderActions = () => {
  return (
    <div className="flex flex-wrap gap-3 border-t border-border pt-6">
      {/* LLM 재생성 */}
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
        onClick={() => {
          // TODO: [백엔드 연동] POST /api/admin/orders/[id]/regenerate 실제 호출로 교체
          alert("AI 해석 재생성 요청이 전송되었습니다.");
        }}
      >
        <RefreshCw size={15} />
        LLM 해석 재생성
      </button>

      {/* 환불 처리 */}
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition-opacity hover:opacity-80"
        onClick={() => {
          // TODO: [백엔드 연동] POST /api/admin/orders/[id]/refund (토스페이먼츠 결제 취소 연동)
          if (confirm("환불 처리를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
            alert("환불 처리가 요청되었습니다.");
          }
        }}
      >
        <RotateCcw size={15} />
        환불 처리
      </button>
    </div>
  );
};
