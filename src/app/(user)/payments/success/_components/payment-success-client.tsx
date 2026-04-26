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
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!orderId) {
      router.replace('/');
      return;
    }
    // TODO: [백엔드 연동] 결제 승인 API 호출 후 session-id 받기
    // 현재는 orderId를 session-id로 사용
    setSessionId(orderId);
  }, [orderId, router]);

  if (!sessionId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <div className="mb-6 text-5xl">✓</div>
      <h1 className="mb-3 text-2xl font-bold" style={{ color: '#2D3250' }}>
        결제가 완료됐어요
      </h1>
      <p className="mb-2 text-sm text-foreground/60">
        {amount ? `${Number(amount).toLocaleString('ko-KR')}원` : ''}
      </p>
      <p className="mb-8 text-sm text-foreground/60">
        AI가 분석을 시작했어요. 리포트 페이지에서 확인하세요.
      </p>

      <Link
        href={`/report/${sessionId}`}
        className="inline-flex min-h-[52px] items-center justify-center rounded-xl px-8 text-sm font-semibold text-white transition-opacity hover:opacity-80"
        style={{ backgroundColor: '#2D3250' }}
      >
        리포트 확인하기
      </Link>
    </div>
  );
};
