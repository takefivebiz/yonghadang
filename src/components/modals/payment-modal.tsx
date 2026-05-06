'use client';

import { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  paymentType: 'single' | 'all';
  cardTitle?: string;
}

const PaymentModal = ({
  isOpen,
  onClose,
  onComplete,
  paymentType,
  cardTitle,
}: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const isSingle = paymentType === 'single';
  const price = isSingle ? '900' : '2,900';
  const title = isSingle ? `"${cardTitle}" 열기` : '전체 결과 열기';

  const handlePayment = async () => {
    setIsProcessing(true);
    // Mock 결제 처리 (2초 후 완료)
    setTimeout(() => {
      setIsProcessing(false);
      onComplete();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 sm:p-8 border border-white/10">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="mb-6 text-highlight/40 transition-colors hover:text-highlight/70"
        >
          ✕
        </button>

        {/* 결제 정보 */}
        {!isProcessing ? (
          <div>
            <h2 className="mb-2 text-xl font-bold text-highlight sm:text-2xl">
              {title}
            </h2>
            <p className="mb-8 text-sm text-highlight/50">
              {isSingle
                ? '이 카드의 전체 내용을 열어보세요'
                : '모든 유료 카드를 지금 열어보세요'}
            </p>

            {/* 가격 */}
            <div className="mb-8 rounded-xl border border-secondary/30 bg-secondary/10 p-4">
              <p className="mb-2 text-xs font-semibold text-highlight/60">
                결제 금액
              </p>
              <p className="text-2xl font-bold text-secondary">
                {price}
                <span className="text-lg text-highlight/60">원</span>
              </p>
            </div>

            {/* 결제 방법 안내 */}
            <div className="mb-8 rounded-lg bg-white/5 p-4">
              <p className="text-xs text-highlight/50">
                Toss Payments로 결제됩니다
              </p>
            </div>

            {/* 버튼 */}
            <button
              onClick={handlePayment}
              className="w-full rounded-lg bg-secondary px-4 py-3 font-semibold text-white transition-all hover:bg-secondary/90"
            >
              {price}원으로 결제하기
            </button>

            <button
              onClick={onClose}
              className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-semibold text-highlight/70 transition-all hover:bg-white/10"
            >
              취소
            </button>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary" />
            </div>
            <p className="text-sm text-highlight/50">결제를 처리 중이야...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
