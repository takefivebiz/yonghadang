import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PaymentSuccessClient } from "./_components/payment-success-client";

export const metadata: Metadata = {
  title: "결제 완료 — 용하당",
  description: "결제가 성공적으로 완료되었습니다.",
  robots: { index: false, follow: false },
};

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    paymentKey?: string;
    orderId?: string;
    amount?: string;
    content?: string;
  }>;
}

/**
 * 토스페이먼츠 successUrl 콜백 페이지.
 * 토스는 쿼리로 paymentKey, orderId, amount 를 전달한다.
 *
 * TODO: [백엔드 연동] 쿼리를 받은 직후 POST /api/payments/confirm 호출하여
 *       실제 결제 승인 처리. 승인 성공 시 reports.status=generating 으로 전환되고
 *       /report/[orderId] 로 이동. 현재는 프론트엔드 데모용 화면만 표시.
 */
const PaymentSuccessPage = async ({ searchParams }: PaymentSuccessPageProps) => {
  const { paymentKey, orderId, amount, content } = await searchParams;

  // 필수 파라미터 누락 — 잘못된 접근
  if (!paymentKey || !orderId || !amount) {
    redirect("/");
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #E0F0E8 0%, #F5F0E8 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-lg px-4 py-16">
        <div className="text-center">
          {/* 성공 아이콘 */}
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #C4E8D4, #E8F5E9)",
              boxShadow: "0 8px 32px rgba(76, 175, 80, 0.15)",
            }}
            aria-hidden="true"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2E7D32"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h1 className="font-display mb-2 text-2xl font-bold text-deep-purple md:text-3xl">
            결제가 완료됐어요
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            AI가 당신만의 분석 리포트를 생성하고 있어요
          </p>
        </div>

        {/* 주문 정보 */}
        <div
          className="mb-6 space-y-3 rounded-2xl px-5 py-5"
          style={{
            backgroundColor: "rgba(255,255,255,0.85)",
            border: "1.5px solid rgba(74, 59, 92, 0.1)",
          }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">주문번호</span>
            <span
              className="max-w-[60%] truncate font-mono text-xs text-foreground/70"
              title={orderId}
            >
              {orderId}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">결제 금액</span>
            <span className="font-bold text-deep-purple">
              {Number(amount).toLocaleString("ko-KR")}원
            </span>
          </div>
        </div>

        {/* 결제 승인 진행 상태 (클라이언트) */}
        <PaymentSuccessClient
          paymentKey={paymentKey}
          orderId={orderId}
          amount={amount}
        />

        {/* 이동 버튼 */}
        <div className="mt-8 space-y-3">
          <Link
            href={`/report/${orderId}`}
            className="block w-full rounded-full py-4 text-center text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: "#4A3B5C",
              color: "#F5F0E8",
              boxShadow: "0 4px 24px rgba(74, 59, 92, 0.35)",
            }}
          >
            분석 리포트 보러 가기 ✦
          </Link>
          <Link
            href="/"
            className="block w-full text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            홈으로 돌아가기
          </Link>
        </div>

        {/* 참고 링크 — content 파라미터가 있으면 표시 */}
        {content && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            주문 콘텐츠: <span className="font-medium">{content}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
