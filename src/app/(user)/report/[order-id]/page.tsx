import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOrder } from '@/lib/dummy-orders';
import { getDummyReport, getDummyAnalysisSession } from '@/lib/dummy-reports';
import { ReportClient } from './_components/report-client';
import { ErrorBoundary } from '@/components/ui/error-boundary';

interface Props {
  params: Promise<{ 'order-id': string }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { 'order-id': sessionId } = await params;
  const report = getDummyReport(sessionId);

  return {
    title: report ? `${report.category} 분석 리포트 | Corelog` : '리포트 | Corelog',
    description: report?.freeReport?.headline ?? 'AI가 생성한 맞춤 분석 리포트',
    // 개인 데이터 보호 — PRD 5.1.3
    robots: { index: false, follow: false },
  };
};

/**
 * 리포트 페이지 (`/report/[session-id]`) — PRD 5.2
 * - 인증 → 무료 리포트 표시 → 유료 질문 선택
 * TODO: [백엔드 연동] Server Component에서 Supabase 세션 + DB 조회로 교체
 */
const ReportPage = async ({ params }: Props) => {
  const { 'order-id': sessionId } = await params;

  // TODO: [백엔드 연동] /api/orders/[session-id] 실제 호출로 교체
  const order = getOrder(sessionId);
  if (!order) notFound();

  // TODO: [백엔드 연동] /api/reports/[session-id] 실제 호출로 교체
  const report = getDummyReport(sessionId);
  if (!report) notFound();

  // TODO: [백엔드 연동] /api/analysis/[session-id] 실제 호출로 교체
  const analysisSession = getDummyAnalysisSession(sessionId);

  return (
    <ErrorBoundary>
      <ReportClient order={order} report={report} initialAnalysisSession={analysisSession} />
    </ErrorBoundary>
  );
};

export default ReportPage;
