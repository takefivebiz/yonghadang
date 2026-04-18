import { type Metadata } from "next";
import { getDummyReport } from "@/lib/dummy-reports";
import { ReportPreview } from "./_components/report-preview";
import { ReportLoader } from "./_components/report-loader";

interface Props {
  params: Promise<{ "order-id": string }>;
}

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { "order-id": orderId } = await params;

  // demo-* 프리뷰는 공개 메타데이터로 SEO 대응
  if (orderId.startsWith("demo-")) {
    const report = getDummyReport(orderId);
    return {
      title: report ? `분석 미리보기 | 용하당` : "분석 결과",
      description: report?.headline,
    };
  }

  // 실제 주문 리포트는 본인만 열람 — 검색엔진 노출 차단
  return {
    title: "분석 결과 | 용하당",
    description: "AI가 생성한 맞춤 분석 리포트",
    robots: { index: false, follow: false },
  };
};

/**
 * PRD 6-6 보고서 확인 페이지 (`/report/[order-id]`).
 *
 * - `demo-{slug}` 접두사: 결제 전 무료 프리뷰 (PRD 6-4 연장).
 *   기본 분석만 공개하고 심화 분석은 블러 + 결제 CTA.
 * - 그 외 실제 주문 ID: 결제 완료된 리포트 전체 공개.
 *   회원/비회원 인증 후 기본 풀이 + 심화 풀이 모두 표시.
 *
 * TODO: [백엔드 연동]
 *   - demo-* 는 클라이언트 네비게이션으로만 진입하므로 유지.
 *   - 실제 주문은 Server Component 에서 세션 + 주문 조회로 전환하고,
 *     ReportLoader 클라이언트 컴포넌트 제거.
 */
const ReportPage = async ({ params }: Props) => {
  const { "order-id": orderId } = await params;

  if (orderId.startsWith("demo-")) {
    return <ReportPreview orderId={orderId} />;
  }

  // localStorage 기반 주문 조회는 클라이언트에서만 가능 → ReportLoader 위임
  return <ReportLoader orderId={orderId} />;
};

export default ReportPage;
