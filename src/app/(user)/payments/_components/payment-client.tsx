'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { readPendingOrder, clearPendingOrder, generateOrderId } from '@/lib/payment';
import { PendingOrderInput, GuestCheckoutInfo } from '@/types/payment';
import { OrderSummary } from './order-summary';
import { GuestInfoForm } from './guest-info-form';

/**
 * 결제 클라이언트 컴포넌트.
 * - sessionStorage에서 PendingOrderInput 복원
 * - 토스페이먼츠 위젯 마운트 (백엔드 연동 전 시뮬레이션)
 * TODO: [백엔드 연동] 토스페이먼츠 SDK 실제 연동
 */
export const PaymentClient = () => {
  const router = useRouter();
  const [pendingOrder, setPendingOrder] = useState<PendingOrderInput | null>(null);
  const [isLoggedIn] = useState(false); // TODO: [백엔드 연동] Supabase 세션으로 교체
  const [guestInfo, setGuestInfo] = useState<GuestCheckoutInfo>({ phoneNumber: '', password: '' });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const order = readPendingOrder();
    if (!order) {
      router.replace('/');
      return;
    }
    setPendingOrder(order);
  }, [router]);

  const validateGuest = (): boolean => {
    let valid = true;
    const phone = guestInfo.phoneNumber.replace(/\D/g, '');
    if (!/^01[016789]\d{7,8}$/.test(phone)) {
      setPhoneError('올바른 휴대폰번호를 입력해');
      valid = false;
    } else {
      setPhoneError(null);
    }
    if (!/^\d{4}$/.test(guestInfo.password)) {
      setPasswordError('숫자 4자리 비밀번호를 입력해');
      valid = false;
    } else {
      setPasswordError(null);
    }
    return valid;
  };

  const handlePayment = async () => {
    if (!pendingOrder) return;
    if (!isLoggedIn && !validateGuest()) return;

    setIsPaying(true);

    // TODO: [백엔드 연동] 토스페이먼츠 위젯 requestPayment 실제 호출
    const orderId = pendingOrder.orderId ?? generateOrderId();
    await new Promise((r) => setTimeout(r, 1500));

    clearPendingOrder();
    const amount = pendingOrder.paidQuestionIds.length * 4900;
    router.push(
      `/payments/success?orderId=${orderId}&amount=${amount}&paymentKey=test_pk_${Date.now()}`,
    );
  };

  if (!pendingOrder) {
    return (
      <div className="flex justify-center py-20">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2"
          style={{
            borderColor: "rgba(230, 230, 250, 0.2)",
            borderTopColor: "#BEAEDB",
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <OrderSummary pendingOrder={pendingOrder} />

      {/* 비회원 정보 입력 */}
      {!isLoggedIn && (
        <GuestInfoForm
          value={guestInfo}
          onChange={setGuestInfo}
          phoneError={phoneError}
          passwordError={passwordError}
        />
      )}

      {/* 결제 위젯 자리 — 테스트 환경 시뮬레이션 */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "rgba(100, 149, 237, 0.3)",
          background: "rgba(100, 149, 237, 0.08)",
        }}
      >
        <div className="mb-3 inline-flex rounded-lg px-2.5 py-1" style={{ background: "rgba(100, 149, 237, 0.2)" }}>
          <span className="text-xs font-medium" style={{ color: '#6495ED' }}>
            🔄 테스트 환경
          </span>
        </div>
        <p className="text-sm font-semibold" style={{ color: '#E0E0E0' }}>
          토스페이먼츠 결제 위젯
        </p>
        <p className="mt-2 text-xs leading-relaxed" style={{ color: '#B8A8D8' }}>
          실제 결제 기능은 백엔드 연동 후 활성화됩니다. 현재는 테스트 카드로 결제 플로우를 시뮬레이션합니다.
        </p>
        <p className="mt-2 text-xs" style={{ color: '#8A7FA8' }}>
          💳 테스트 카드: 4330-0000-0000-1234 / 25/01 / 123
        </p>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        disabled={isPaying}
        className="flex min-h-[56px] w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
        style={{
          background: "linear-gradient(90deg, #6495ED 0%, #A366FF 100%)",
        }}
      >
        {isPaying ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          `${(pendingOrder.paidQuestionIds.length * 4900).toLocaleString('ko-KR')}원 결제하기`
        )}
      </button>

      <p className="text-center text-xs" style={{ color: '#B8A8D8' }}>
        결제는 토스페이먼츠를 통해 안전하게 처리됩니다
      </p>
    </div>
  );
};
