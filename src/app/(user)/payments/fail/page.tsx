import { type Metadata } from 'next';
import { PaymentFailClient } from './_components/payment-fail-client';

export const metadata: Metadata = {
  title: '결제 실패 — 코어로그',
  description: '결제가 완료되지 않았습니다.',
  robots: { index: false, follow: false },
};

interface PaymentFailPageProps {
  searchParams: Promise<{
    code?: string;
    message?: string;
    orderId?: string;
    content?: string;
    sessionId?: string;
  }>;
}

/**
 * 토스페이먼츠 failUrl 콜백 페이지.
 * 토스는 쿼리로 code, message, orderId 를 전달한다.
 * PRD 6-5: "결제 실패 시: 입력 정보 유지, 결제 페이지 머무름" — sessionStorage 는 유지.
 *
 * TODO: [백엔드 연동] POST /api/payments/fail 호출하여
 *       orders.status=failed + fail_code/fail_message 기록 (idempotent).
 */
const PaymentFailPage = async ({ searchParams }: PaymentFailPageProps) => {
  const { code, message, orderId, content, sessionId } = await searchParams;

  return <PaymentFailClient code={code} message={message} orderId={orderId} content={content} sessionId={sessionId} />;
};

export default PaymentFailPage;
