import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "결제 실패 — 용하당",
  description: "결제가 완료되지 않았습니다.",
  robots: { index: false, follow: false },
};

interface PaymentFailPageProps {
  searchParams: Promise<{
    code?: string;
    message?: string;
    orderId?: string;
    content?: string;
  }>;
}

/**
 * 토스페이먼츠 failUrl 콜백 페이지.
 * 토스는 쿼리로 code, message, orderId 를 전달한다.
 * PRD 6-5: "결제 실패 시: 입력 정보 유지, 결제 페이지 머무름" — sessionStorage 는 유지.
 *
 * TODO: [백엔드 연동] mount 시 POST /api/payments/fail 호출하여
 *       orders.status=failed + fail_code/fail_message 기록 (idempotent).
 */
const PaymentFailPage = async ({ searchParams }: PaymentFailPageProps) => {
  const { code, message, orderId, content } = await searchParams;

  const retryHref = content
    ? `/payments?content=${content}`
    : "/";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #F8E0E0 0%, #F5F0E8 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-lg px-4 py-16">
        <div className="text-center">
          {/* 실패 아이콘 */}
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #F5D0D0, #FDECEC)",
              boxShadow: "0 8px 32px rgba(200, 80, 80, 0.15)",
            }}
            aria-hidden="true"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C04040"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </div>

          <h1 className="font-display mb-2 text-2xl font-bold text-deep-purple md:text-3xl">
            결제가 완료되지 않았어요
          </h1>
          <p className="mb-10 text-sm text-muted-foreground">
            입력하신 정보는 그대로 남아있어요. 다시 시도해보세요.
          </p>
        </div>

        {/* 실패 사유 */}
        {(code || message) && (
          <div
            className="mb-6 space-y-3 rounded-2xl px-5 py-5 text-sm"
            style={{
              backgroundColor: "rgba(255,255,255,0.85)",
              border: "1.5px solid rgba(74, 59, 92, 0.1)",
            }}
          >
            {message && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  실패 사유
                </p>
                <p className="text-foreground/85">{message}</p>
              </div>
            )}
            {code && (
              <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                <span>에러 코드</span>
                <span className="font-mono">{code}</span>
              </div>
            )}
            {orderId && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>주문번호</span>
                <span
                  className="max-w-[60%] truncate font-mono"
                  title={orderId}
                >
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
            className="block w-full rounded-full py-4 text-center text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: "#4A3B5C",
              color: "#F5F0E8",
              boxShadow: "0 4px 24px rgba(74, 59, 92, 0.35)",
            }}
          >
            다시 결제하기
          </Link>
          <Link
            href="/"
            className="block w-full text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            홈으로 돌아가기
          </Link>
        </div>

        {/* 문의 안내 */}
        <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
          문제가 반복된다면 고객센터로 문의해주세요.
        </p>
      </div>
    </div>
  );
};

export default PaymentFailPage;
