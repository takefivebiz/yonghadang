'use client';

import { useState, useEffect, useRef } from 'react';
import { PendingOrderInput, GuestCheckoutInfo } from '@/types/payment';
import { generateOrderId, clearPendingOrder } from '@/lib/payment';
import { isMemberLoggedIn } from '@/lib/report-access';
import { saveLocalOrder } from '@/lib/dummy-orders';
import { GuestInfoForm } from '@/app/(user)/payments/_components/guest-info-form';

interface PaymentModalProps {
  pendingOrder: PendingOrderInput;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

/**
 * 리포트 내 결제 모달
 * 리포트 읽기 흐름을 유지하면서 결제 처리
 * 토스페이먼츠 결제 위젯 통합
 */
export const PaymentModal = ({ pendingOrder, onClose, onSuccess }: PaymentModalProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestCheckoutInfo>({ phoneNumber: '', password: '' });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    setIsLoggedIn(isMemberLoggedIn());
  }, []);

  // 배경 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // 토스페이먼츠 위젯 초기화
  useEffect(() => {
    const initWidget = async () => {
      try {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';
        const totalPrice = pendingOrder.paidQuestionIds.length * 900;

        if (!widgetContainerRef.current || !clientKey) return;

        // window.TossPayments는 스크립트 태그로 로드됨
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const TossPayments = (window as any).TossPayments;
        if (!TossPayments) {
          console.error('TossPayments SDK가 로드되지 않았습니다');
          setWidgetReady(true);
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tossPayments = TossPayments(clientKey);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const widgets = tossPayments.widgets({
          customerKey: isLoggedIn ? `member_${Date.now()}` : `guest_${Date.now()}`,
        });

        await widgets.setAmount({
          currency: 'KRW',
          value: totalPrice,
        });

        await widgets.renderPaymentMethods({
          selector: '#payment-widget-container',
          variantKey: 'DEFAULT'
        });

        widgetRef.current = widgets;
        setWidgetReady(true);
      } catch (error) {
        console.error('위젯 초기화 실패:', error);
        setWidgetReady(true);
      }
    };

    initWidget();

    // cleanup: 언마운트 시 위젯 제거
    return () => {
      if (widgetRef.current?.['__paymentMethodWidget__']) {
        try {
          widgetRef.current['__paymentMethodWidget__'].destroy();
        } catch {
          // ignore cleanup errors
        }
      }
      setWidgetReady(false);
    };
  }, [isLoggedIn, pendingOrder]);

  const totalPrice = pendingOrder.paidQuestionIds.length * 900;

  const validateGuest = (): boolean => {
    let valid = true;
    const phone = guestInfo.phoneNumber.replace(/\D/g, '');
    if (!/^01[016789]\d{7,8}$/.test(phone)) {
      setPhoneError('올바른 휴대폰번호를 입력해');
      valid = false;
    } else setPhoneError(null);
    if (!/^\d{4}$/.test(guestInfo.password)) {
      setPasswordError('숫자 4자리 비밀번호를 입력해');
      valid = false;
    } else setPasswordError(null);
    return valid;
  };

  const handlePayment = async () => {
    if (!isLoggedIn && !validateGuest()) return;
    if (!widgetRef.current) {
      console.error('결제 위젯이 초기화되지 않았습니다');
      return;
    }

    setIsPaying(true);

    try {
      const orderId = pendingOrder.orderId ?? generateOrderId();
      const totalPrice = pendingOrder.paidQuestionIds.length * 900;

      // 토스페이먼츠 실제 결제 요청
      await widgetRef.current.requestPayment({
        orderId,
        orderName: `${pendingOrder.category} 리포트 ${pendingOrder.paidQuestionIds.length}개 질문`,
        customerName: isLoggedIn ? 'Member' : '비회원',
        customerEmail: isLoggedIn ? 'member@example.com' : guestInfo.phoneNumber,
        customerMobilePhone: !isLoggedIn ? guestInfo.phoneNumber.replace(/\D/g, '') : undefined,
      });

      // 결제 성공 시 로컬 주문 저장
      saveLocalOrder({
        id: pendingOrder.sessionId,
        category: pendingOrder.category,
        amount: totalPrice,
        status: 'done',
        ownerType: isLoggedIn ? 'member' : 'guest',
        phoneNumber: isLoggedIn ? undefined : guestInfo.phoneNumber.replace(/\D/g, ''),
        createdAt: new Date().toISOString(),
      });

      clearPendingOrder();
      onSuccess(orderId);
    } catch (error) {
      console.error('결제 실패:', error);
      setIsPaying(false);
    }
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 모달 */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-6 py-8 md:bottom-auto md:top-1/2 md:left-1/2 md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:shadow-2xl md:w-full md:max-w-2xl"
        style={{
          background: 'linear-gradient(160deg, #1B003F 0%, #191970 100%)',
          border: '1px solid rgba(230, 230, 250, 0.15)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* 핸들 (모바일) */}
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/20 md:hidden" />

        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: '#F0E6FA' }}>결제하기</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm transition-all hover:bg-white/10"
            style={{ color: '#B8A8D8' }}
          >
            ✕
          </button>
        </div>

        {/* 주문 요약 */}
        <div
          className="mb-5 rounded-2xl p-4"
          style={{
            background: 'rgba(100, 149, 237, 0.12)',
            border: '1px solid rgba(230, 230, 250, 0.12)',
          }}
        >
          <div className="flex justify-between text-sm">
            <span style={{ color: '#B8A8D8' }}>선택한 질문</span>
            <span style={{ color: '#F0E6FA' }}>{pendingOrder.paidQuestionIds.length}개</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-bold">
            <span style={{ color: '#D4C5E2' }}>총 금액</span>
            <span style={{ color: '#F0E6FA' }}>{totalPrice.toLocaleString('ko-KR')}원</span>
          </div>
        </div>

        {/* 비회원 정보 입력 */}
        {!isLoggedIn && (
          <div className="mb-5">
            <GuestInfoForm
              value={guestInfo}
              onChange={setGuestInfo}
              phoneError={phoneError}
              passwordError={passwordError}
            />
          </div>
        )}

        {/* 결제 위젯 */}
        <div className="mb-5">
          {!widgetReady && (
            <div
              className="min-h-[100px] rounded-2xl border border-dashed p-4"
              style={{
                borderColor: 'rgba(230, 230, 250, 0.15)',
                background: 'rgba(100, 149, 237, 0.05)',
              }}
            >
              <p className="text-center text-xs" style={{ color: '#B8A8D8' }}>
                결제 방법을 불러오고 있습니다...
              </p>
            </div>
          )}
          <div
            id="payment-widget-container"
            ref={widgetContainerRef}
            style={{
              display: widgetReady ? 'block' : 'none',
              minHeight: '200px',
            }}
          />
        </div>

        {/* 결제 버튼 */}
        <button
          onClick={handlePayment}
          disabled={isPaying}
          className="flex min-h-[52px] w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(90deg, #6495ED 0%, #A366FF 100%)' }}
        >
          {isPaying ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            `${totalPrice.toLocaleString('ko-KR')}원 결제하기`
          )}
        </button>

        <p className="mt-3 text-center text-xs" style={{ color: '#B8A8D8' }}>
          토스페이먼츠를 통해 안전하게 처리돼
        </p>
      </div>
    </>
  );
};
