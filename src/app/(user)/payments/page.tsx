import { type Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DUMMY_CONTENTS } from "@/lib/dummy-contents";
import { PaymentClient } from "./_components/payment-client";

export const metadata: Metadata = {
  title: "결제하기 — 용하당",
  description: "선택하신 분석 리포트의 결제를 안전하게 진행합니다.",
  openGraph: {
    title: "결제하기 — 용하당",
    description: "토스페이먼츠로 안전하게 결제하세요.",
  },
};

interface PaymentsPageProps {
  searchParams: Promise<{ content?: string }>;
}

/**
 * PRD 6-5. 결제 페이지 (/payments)
 * - 선택한 리포트 요약 (제목, 가격)
 * - 입력 정보 요약 (sessionStorage 기반, 클라이언트에서 hydrate)
 * - 토스페이먼츠 위젯 (회원/비회원 모두 지원)
 * - 비회원 결제 시 전화번호 + 비밀번호 입력 폼
 */
const PaymentsPage = async ({ searchParams }: PaymentsPageProps) => {
  const { content: slug } = await searchParams;

  // 쿼리에 content 가 없으면 홈으로 복귀 (직접 접근 방어)
  if (!slug) redirect("/");

  // TODO: [백엔드 연동] /api/contents/[slug] 실제 호출로 교체
  const content = DUMMY_CONTENTS.find((c) => c.slug === slug) ?? null;
  if (!content) redirect("/");

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      {/* ── 배경 — 파스텔 라벤더 그라디언트 ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #EDE0F8 0%, #F5F0E8 60%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: "#E8D4F0", opacity: 0.35 }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 top-72 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: "#F5D7E8", opacity: 0.3 }}
        aria-hidden="true"
      />

      <div className="relative z-10 px-4 pt-10">
        {/* 뒤로 가기 */}
        <div className="mx-auto mb-6 max-w-lg">
          <Link
            href={`/report/demo-${content.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            이전 단계로
          </Link>
        </div>

        {/* 헤더 */}
        <div className="mx-auto mb-8 max-w-lg text-center">
          <p className="font-display mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Checkout
          </p>
          <h1 className="font-display text-2xl font-bold text-deep-purple md:text-3xl">
            마지막 단계예요
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            결제를 완료하면 AI 분석 리포트가 바로 생성됩니다
          </p>
        </div>

        {/* 결제 위젯 + 요약 (클라이언트 컴포넌트) */}
        <PaymentClient content={content} />
      </div>
    </div>
  );
};

export default PaymentsPage;
