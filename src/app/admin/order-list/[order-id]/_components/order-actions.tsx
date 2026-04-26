"use client";

import { RefreshCw, RotateCcw } from "lucide-react";

/** 주문 상세 액션 버튼 그룹 (Client Component) */
export const OrderActions = () => {
  return (
    <div className="flex flex-wrap gap-3 pt-6" style={{ borderTop: '1px solid rgba(230, 230, 250, 0.15)' }}>
      {/* LLM 재생성 */}
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
        style={{ background: 'linear-gradient(90deg, #6495ED 0%, #A366FF 100%)', color: '#FFFFFF' }}
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
        className="flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80"
        style={{ borderColor: 'rgba(239, 68, 68, 0.5)', background: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5' }}
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
