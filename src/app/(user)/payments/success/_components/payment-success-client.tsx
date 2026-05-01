'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * 결제 성공 페이지 클라이언트.
 * TODO: [백엔드 연동] 쿼리 파라미터(paymentKey, orderId, amount)로
 * POST /api/payments/confirm 호출 → 리포트 생성 트리거 → session-id 반환
 */
export const PaymentSuccessClient = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);

  const orderId = searchParams.get('orderId');
  // payment-modal에서 전달한 sessionId (리포트로 복귀하기 위한 원본 세션 ID)
  const sessionIdParam = searchParams.get('sessionId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!orderId) {
      router.replace('/');
      return;
    }

    // 동일 success URL 중복 접근 방지 (뒤로가기 후 재접근 시 이미 처리된 결제)
    const processedKey = `payment_processed_${orderId}`;
    const alreadyProcessed = sessionStorage.getItem(processedKey);
    if (alreadyProcessed) {
      // 이미 처리된 결제 — 리포트 페이지로 바로 이동
      const targetSession = sessionIdParam || orderId;
      router.replace(`/report/${targetSession}`);
      return;
    }
    sessionStorage.setItem(processedKey, 'true');

    // 비회원 결제 후 order를 'guest'로 업데이트
    const targetSession = sessionIdParam || orderId;
    const guestCheckoutKey = `guest_checkout_${targetSession}`;
    const guestCheckout = sessionStorage.getItem(guestCheckoutKey);

    if (guestCheckout) {
      try {
        // TODO: [백엔드 연동] 결제 후 order 상태 업데이트 API 호출
        // 현재는 sessionStorage 기반 guest 토큰으로 처리
        sessionStorage.removeItem(guestCheckoutKey);
      } catch (e) {
        console.error('Failed to process guest checkout:', e);
      }
    }

    // TODO: [백엔드 연동] 결제 승인 API 호출 후 session-id 받기
    // 현재는 payment-modal에서 전달한 sessionId 파라미터 우선 사용
    setSessionId(targetSession);
  }, [orderId, sessionIdParam, router]);

  if (!sessionId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
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
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mb-6 text-5xl">✓</div>
      <h1 className="mb-3 text-2xl font-bold" style={{ color: '#F0E6FA' }}>
        결제가 완료됐어요
      </h1>
      <p className="mb-2 text-sm" style={{ color: '#D4C5E2' }}>
        {amount ? `${Number(amount).toLocaleString('ko-KR')}원` : ''}
      </p>
      <p className="mb-8 text-sm" style={{ color: '#D4C5E2' }}>
        AI가 분석을 시작했어요. 리포트 페이지에서 확인하세요.
      </p>

      <Link
        href={`/report/${sessionIdParam || sessionId}`}
        className="inline-flex min-h-[52px] items-center justify-center rounded-xl px-8 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        style={{
          background: "linear-gradient(90deg, #6495ED 0%, #A366FF 100%)",
        }}
      >
        리포트 확인하기
      </Link>
    </div>
  );
};
