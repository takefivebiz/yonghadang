'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface PaymentFailClientProps {
  code?: string;
  message?: string;
  orderId?: string;
  content?: string;
}

/**
 * 결제 실패 페이지 클라이언트.
 * - 실패 정보를 localStorage에 기록
 * - 실패 페이지 UI 표시
 *
 * TODO: [백엔드 연동] POST /api/payments/fail 호출하여 orders.status=failed 기록
 */
export const PaymentFailClient = ({
  code,
  message,
  orderId,
  content,
}: PaymentFailClientProps) => {
  useEffect(() => {
    // 실패 정보를 localStorage에 기록 (테스트 데이터 추적용)
    if (typeof window !== 'undefined' && orderId) {
      try {
        const failedPayments = JSON.parse(
          localStorage.getItem('corelog:failed_payments') || '[]'
        ) as Array<{ orderId: string; code?: string; message?: string; timestamp: number }>;

        failedPayments.push({
          orderId,
          code,
          message,
          timestamp: Date.now(),
        });

        // 최근 30개까지만 저장
        const limited = failedPayments.slice(-30);
        localStorage.setItem('corelog:failed_payments', JSON.stringify(limited));
      } catch (err) {
        console.error('[Payment Fail] localStorage 기록 실패', err);
      }
    }
  }, [orderId, code, message]);

  const retryHref = content ? `/payments?content=${content}` : '/';

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 배경 장식 */}
      <div
        className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: '#EF4444', opacity: 0.08 }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-lg px-4 py-16">
        <div className="text-center">
          {/* 실패 아이콘 */}
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
            }}
            aria-hidden="true"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>

          <h1 className="font-display mb-2 text-2xl font-bold md:text-3xl" style={{ color: '#F0E6FA' }}>
            결제가 완료되지 않았어요
          </h1>
          <p className="mb-10 text-sm" style={{ color: '#D4C5E2' }}>
            입력하신 정보는 그대로 남아있어요. 다시 시도해보세요.
          </p>
        </div>

        {/* 실패 사유 */}
        {(code || message) && (
          <div
            className="mb-6 space-y-3 rounded-2xl px-5 py-5 text-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))',
              border: '1.5px solid rgba(230, 230, 250, 0.15)',
            }}
          >
            {message && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: '#B8A8D8' }}>
                  실패 사유
                </p>
                <p style={{ color: '#F0E6FA' }}>{message}</p>
              </div>
            )}
            {code && (
              <div className="flex items-center justify-between pt-2 text-xs" style={{ color: '#D4C5E2' }}>
                <span>에러 코드</span>
                <span className="font-mono">{code}</span>
              </div>
            )}
            {orderId && (
              <div className="flex items-center justify-between text-xs" style={{ color: '#D4C5E2' }}>
                <span>주문번호</span>
                <span className="max-w-[60%] truncate font-mono" title={orderId}>
                  {orderId}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="space-y-3">
          <Link
            href={retryHref}
            className="block w-full rounded-full py-4 text-center text-sm font-semibold transition-all duration-300 hover:scale-[1.02] text-white"
            style={{
              background: 'linear-gradient(90deg, #6495ED 0%, #A366FF 100%)',
            }}
          >
            다시 결제하기
          </Link>
          <Link
            href="/"
            className="block w-full text-center text-xs underline-offset-2 hover:underline"
            style={{ color: '#D4C5E2' }}
          >
            홈으로 돌아가기
          </Link>
        </div>

        {/* 문의 안내 */}
        <p className="mt-8 text-center text-xs leading-relaxed" style={{ color: '#B8A8D8' }}>
          문제가 반복된다면 고객센터로 문의해주세요.
        </p>
      </div>
    </div>
  );
};
