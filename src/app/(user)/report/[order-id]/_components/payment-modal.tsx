'use client';

import { useState, useEffect, useRef } from 'react';
import { PendingOrderInput, GuestCheckoutInfo } from '@/types/payment';
import { generateOrderId, clearPendingOrder } from '@/lib/payment';
import { getPriceForQuantity, getFullBundlePrice } from '@/lib/pricing';
import { isMemberLoggedIn, grantGuestAccess } from '@/lib/report-access';
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
  const isInitializing = useRef(false);

  useEffect(() => {
    setIsLoggedIn(isMemberLoggedIn());
  }, []);

  // 배경 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // 브라우저 뒤로가기 시 결제 모달 닫기 (결제 플로우 안전 취소)
  useEffect(() => {
    window.history.pushState({ modal: 'payment' }, '');
    const onPop = () => { onClose(); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [onClose]);

  // 토스페이먼츠 위젯 초기화 및 금액 업데이트
  useEffect(() => {
    const initWidget = async () => {
      // 이미 초기화 중이면 스킵
      if (isInitializing.current) {
        return;
      }

      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '';
      const totalPrice = pendingOrder.isFullBundle
        ? getFullBundlePrice()
        : getPriceForQuantity(pendingOrder.paidQuestionIds.length);

      if (!widgetContainerRef.current || !clientKey) {
        return;
      }

      // window.TossPayments는 스크립트 태그로 로드됨
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const TossPayments = (window as any).TossPayments;
      if (!TossPayments) {
        console.error('TossPayments SDK가 로드되지 않았습니다');
        setWidgetReady(true);
        return;
      }

      try {
        // 처음 초기화일 때만 렌더링
        if (!widgetRef.current) {
          isInitializing.current = true;

          const tossPayments = TossPayments(clientKey);
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
          isInitializing.current = false;
          setWidgetReady(true);
        } else {
          // 이미 렌더링된 위젯이면 금액만 업데이트
          await widgetRef.current.setAmount({
            currency: 'KRW',
            value: totalPrice,
          });
        }
      } catch (error) {
        console.error('위젯 처리 실패:', error);
        isInitializing.current = false;
        setWidgetReady(true);
      }
    };

    initWidget();

    // cleanup: 언마운트 시만 초기화
    return () => {
      // SDK에 등록된 위젯은 유지하고 DOM만 정리
      setWidgetReady(false);
    };
  }, [isLoggedIn, pendingOrder.paidQuestionIds.length, pendingOrder.isFullBundle]);

  const totalPrice = pendingOrder.isFullBundle
    ? getFullBundlePrice()
    : getPriceForQuantity(pendingOrder.paidQuestionIds.length);

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
    if (!widgetRef.current) return;

    setIsPaying(true);

    // ✅ 비회원 결제 시: 결제 직전에 토큰 발급 (결제 후 본인확인 불필요)
    // 실제 비밀번호 검증은 나중에 토큰 만료 후 본인확인 페이지에서 함
    if (!isLoggedIn) {
      grantGuestAccess(pendingOrder.sessionId);
    }

    try {
      const orderId = pendingOrder.orderId ?? generateOrderId();
      const totalPrice = pendingOrder.isFullBundle
        ? getFullBundlePrice()
        : getPriceForQuantity(pendingOrder.paidQuestionIds.length);

      // 결제 전 기존 값 스냅샷 저장 (실패 시 롤백용)
      const purchasedKey = `purchased_${pendingOrder.sessionId}`;
      const axesKey = `purchased_axes_${pendingOrder.sessionId}`;
      const snapshotItems = sessionStorage.getItem(purchasedKey);
      const snapshotAxes = sessionStorage.getItem(axesKey);

      // 📌 결제 전 구매 정보를 모두 sessionStorage에 저장 (redirect 후 복원)
      const existing = JSON.parse(snapshotItems || '[]') as string[];
      const merged = [...new Set([...existing, ...pendingOrder.paidQuestionIds])];
      sessionStorage.setItem(purchasedKey, JSON.stringify(merged));

      // 📌 구매된 축 저장 (sessionStorage + localStorage 모두 저장)
      // sessionStorage는 redirect 후 초기화될 수 있으므로 localStorage에도 저장
      const existingAxes = JSON.parse(snapshotAxes || '[]') as number[];
      const currentAxis = existingAxes.length < 3 ? (existingAxes.length + 1) : null;
      if (currentAxis) {
        const newAxes = [...new Set([...existingAxes, currentAxis])];
        sessionStorage.setItem(axesKey, JSON.stringify(newAxes));
        // localStorage에도 저장 (redirect 후 복원용)
        const localAxesKey = `corelog:purchased_axes_${pendingOrder.sessionId}`;
        localStorage.setItem(localAxesKey, JSON.stringify(newAxes));
      }

      // 롤백 정보를 sessionStorage에 저장 (redirect 후 결제 실패 시 payment-fail이 복원)
      sessionStorage.setItem(
        `payment_snapshot_${pendingOrder.sessionId}`,
        JSON.stringify({ items: snapshotItems, axes: snapshotAxes })
      );

      // 결제 성공 후 바로 리포트로 복귀 (별도 페이지 거치지 않음)
      const origin = window.location.origin;
      const successUrl = `${origin}/report/${pendingOrder.sessionId}`;
      const failUrl = `${origin}/payments/fail?sessionId=${pendingOrder.sessionId}`;

      // redirect 전에 미리 제거 (Toss 결제 성공 후 새 페이지 로드 시 모달이 다시 열리지 않도록)
      clearPendingOrder();

      // 📌 결제 후 order 업데이트 (비회원은 anonymous 유지, paidQuestionIds만 저장)
      // grantGuestAccess로 30분 토큰 발급했으므로, 결제 직후 본인확인 불필요
      // 토큰 만료 후 재진입 시에만 본인확인 요구
      saveLocalOrder({
        id: pendingOrder.sessionId,
        category: pendingOrder.category,
        amount: totalPrice,
        status: 'done',
        ownerType: isLoggedIn ? 'member' : 'anonymous', // 비회원도 anonymous 유지 (paidQuestionIds로 구분)
        paid: !isLoggedIn, // 비회원 결제만 paid: true
        phoneNumber: isLoggedIn ? undefined : guestInfo.phoneNumber.replace(/\D/g, ''),
        paidQuestionIds: !isLoggedIn ? pendingOrder.paidQuestionIds : undefined, // 비회원 구매 질문 목록 저장
        createdAt: new Date().toISOString(),
      });

      // 토스페이먼츠 결제 요청
      await widgetRef.current.requestPayment({
        orderId,
        orderName: `${pendingOrder.category} 리포트 ${pendingOrder.paidQuestionIds.length}개 질문`,
        customerName: isLoggedIn ? 'Member' : '비회원',
        customerEmail: isLoggedIn ? 'member@example.com' : guestInfo.phoneNumber,
        customerMobilePhone: !isLoggedIn ? guestInfo.phoneNumber.replace(/\D/g, '') : undefined,
        successUrl,
        failUrl,
      });

      // requestPayment가 redirect 없이 resolve된 경우 (로컬 환경) 이미 위에서 처리됨
      onSuccess(orderId);
    } catch (error) {
      console.error('결제 실패:', error);

      // 모달 내 취소/실패(redirect 없이 throw)인 경우 sessionStorage 롤백
      const purchasedKey = `purchased_${pendingOrder.sessionId}`;
      const axesKey = `purchased_axes_${pendingOrder.sessionId}`;
      const snapshotRaw = sessionStorage.getItem(`payment_snapshot_${pendingOrder.sessionId}`);
      if (snapshotRaw) {
        try {
          const { items, axes } = JSON.parse(snapshotRaw) as { items: string | null; axes: string | null };
          if (items === null) {
            sessionStorage.removeItem(purchasedKey);
          } else {
            sessionStorage.setItem(purchasedKey, items);
          }
          if (axes === null) {
            sessionStorage.removeItem(axesKey);
          } else {
            sessionStorage.setItem(axesKey, axes);
          }
        } catch {
          // 롤백 실패 시 무시
        }
        sessionStorage.removeItem(`payment_snapshot_${pendingOrder.sessionId}`);
      }

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
          disabled={!widgetReady || isPaying}
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
