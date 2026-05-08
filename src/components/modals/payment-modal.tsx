"use client";

import { useEffect, useState, useRef } from "react";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentKey: string, orderId: string) => Promise<void>;
  paymentType: "single" | "all";
  sceneIndex?: number;
  cardTitle?: string;
}

const PaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  paymentType,
  sceneIndex,
  cardTitle,
}: PaymentModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isSingle = paymentType === "single";
  const amount = isSingle ? 900 : 2900;
  const title = isSingle ? `[${cardTitle}] 열기` : "전체 흐름 열기";
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || "";

  // 위젯 초기화 및 결제 수단 선택 UI 렌더링
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const initWidget = async () => {
      try {
        // clientKey가 설정되지 않았으면 에러
        if (!clientKey) {
          setError("결제 설정이 올바르지 않아요");
          return;
        }

        // 게스트 사용자로 위젯 로드
        const widget = await loadPaymentWidget(clientKey, ANONYMOUS);
        widgetRef.current = widget;

        // 결제 수단 선택 UI 렌더링 (필수)
        await widget.renderPaymentMethods(
          "#payment-methods",
          { value: amount },
          { variantKey: "DEFAULT" },
        );

        setError(null);
      } catch (err) {
        console.error("결제 위젯 초기화 실패:", err);
        setError("결제 위젯 로드에 실패했어요");
      }
    };

    initWidget();
  }, [isOpen, clientKey, amount]);

  const handlePayment = async () => {
    if (!widgetRef.current) {
      setError("결제 위젯이 준비되지 않았어요");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const orderName = isSingle ? `${cardTitle} 열기` : "전체 흐름 열기";

      // 현재 페이지 URL에 쿼리 파라미터 추가 (결제 타입 포함)
      const baseUrl =
        typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
      const successUrl = `${baseUrl}?payment_success=true&paymentType=${paymentType}&sceneIndex=${sceneIndex || 0}&orderId=${orderId}`;
      const failUrl = `${baseUrl}?payment_failed=true`;

      // 결제 요청 (필수: successUrl, failUrl)
      await widgetRef.current.requestPayment({
        orderId,
        orderName,
        customerEmail: "guest@veil.app",
        customerName: "게스트",
        successUrl,
        failUrl,
      });

      // successUrl로 리다이렉트되므로 이 코드는 실행되지 않음
      // 결제 완료 후 페이지 리로드 시 URL 파라미터에서 처리
    } catch (err: any) {
      // 결제 취소 또는 실패 (드물게 발생)
      if (err?.code === "USER_CANCEL") {
        setError("결제가 취소되었어요");
      } else if (err?.code) {
        setError(`결제 오류: ${err.message || err.code}`);
      } else {
        setError("결제 처리 중 오류가 발생했어요");
      }
      console.error("결제 오류:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div
        ref={containerRef}
        className="w-full max-w-md rounded-2xl bg-background border border-white/10 flex flex-col max-h-[90vh]"
      >
        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="mb-6 text-highlight/40 transition-colors hover:text-highlight/70 disabled:opacity-50"
          >
            ✕
          </button>

          {/* 결제 정보 */}
          {!error ? (
            <div>
              <h2 className="mb-2 text-xl font-bold text-highlight sm:text-2xl">
                {title}
              </h2>
              <p className="mb-8 text-sm text-highlight/50">
                {isSingle
                  ? "이어서 읽을 수 있어"
                  : "잠겨있는 모든 흐름을 열 수 있어"}
              </p>

              {/* 가격 */}
              <div className="mb-8 rounded-xl border border-secondary/30 bg-secondary/10 p-4">
                <p className="mb-2 text-xs font-semibold text-highlight/60">
                  결제 금액
                </p>
                <p className="text-sm font-bold text-secondary">
                  {amount.toLocaleString()}
                  <span className="text-sm text-highlight/60">원</span>
                </p>
              </div>

              {/* 결제 수단 선택 UI (Toss 위젯이 렌더링됨) */}
              <div id="payment-methods" className="mb-6" />

              {/* 결제 버튼 */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full text-sm rounded-lg bg-secondary px-4 py-3 font-medium text-white transition-all hover:bg-secondary/90 disabled:opacity-50"
              >
                {amount.toLocaleString()}원 결제하기
              </button>

              {/* 취소 버튼 */}
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="mt-3 w-full text-sm rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-medium text-highlight/70 transition-all hover:bg-white/10 disabled:opacity-50"
              >
                취소
              </button>

              {/* 로딩 상태 */}
              {isProcessing && (
                <div className="mt-4 flex justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-secondary/30 border-t-secondary" />
                </div>
              )}
            </div>
          ) : (
            // 에러 상태
            <div className="text-center py-6">
              <p className="mb-6 text-sm text-red-400">{error}</p>
              <button
                onClick={onClose}
                className="w-full rounded-lg bg-secondary px-4 py-3 font-semibold text-white transition-all hover:bg-secondary/90"
              >
                닫기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
