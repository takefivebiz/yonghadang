import { type Metadata } from 'next';
import { PaymentClient } from './_components/payment-client';

export const metadata: Metadata = {
  title: '결제하기 | Corelog',
  description: '선택한 분석 리포트 결제를 안전하게 진행합니다.',
};

/**
 * PRD: 결제 페이지 (/payments)
 * - sessionStorage의 PendingOrderInput에서 결제 정보를 읽어 처리
 * - 토스페이먼츠 위젯 + 비회원 정보 입력 폼
 */
const PaymentsPage = () => {
  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: '#FAF8F5' }}>
      <div className="relative z-10 px-4 pt-10">
        {/* 헤더 */}
        <div className="mx-auto mb-8 max-w-lg text-center">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-foreground/50">
            Checkout
          </p>
          <h1 className="text-2xl font-bold md:text-3xl" style={{ color: '#2D3250' }}>
            마지막 단계예요
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            결제를 완료하면 선택한 분석이 바로 시작됩니다
          </p>
        </div>

        <PaymentClient />
      </div>
    </div>
  );
};

export default PaymentsPage;
