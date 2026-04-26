import { Suspense } from 'react';
import { type Metadata } from 'next';
import { PaymentSuccessClient } from './_components/payment-success-client';

export const metadata: Metadata = {
  title: '결제 완료 | Corelog',
  description: '결제가 성공적으로 완료되었습니다.',
  robots: { index: false, follow: false },
};

/** 토스페이먼츠 successUrl 콜백 페이지 */
const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F5' }}>
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
          </div>
        }
      >
        <PaymentSuccessClient />
      </Suspense>
    </div>
  );
};

export default PaymentSuccessPage;
