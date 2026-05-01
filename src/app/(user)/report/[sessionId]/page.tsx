import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AnalysisCategory } from '@/types/analysis';
import { FreeReport } from '@/types/report';
import { ReportClient } from './_components/report-client';
import { ErrorBoundary } from '@/components/ui/error-boundary';

// 데이터베이스 카테고리 (영문) → 프론트엔드 카테고리 (한글) 매핑
const mapDbCategoryToFrontend = (dbCategory: string): AnalysisCategory => {
  const mapping: Record<string, AnalysisCategory> = {
    'love': '연애',
    'emotion': '감정',
    'relationship': '인간관계',
    'career': '직업/진로',
  };
  return mapping[dbCategory] || ('연애' as AnalysisCategory);
};

interface Props {
  params: Promise<{ sessionId: string }>;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { sessionId } = await params;

  try {
    const supabase = await createClient();
    const { data: session } = await supabase
      .from('analysis_sessions')
      .select('category')
      .eq('id', sessionId)
      .single();

    return {
      title: session ? `${session.category} 분석 리포트 | Corelog` : '리포트 | Corelog',
      description: 'AI가 생성한 맞춤 분석 리포트',
      // 개인 데이터 보호 — PRD 5.1.3
      robots: { index: false, follow: false },
    };
  } catch {
    return {
      title: '리포트 | Corelog',
      description: 'AI가 생성한 맞춤 분석 리포트',
      robots: { index: false, follow: false },
    };
  }
};

/**
 * 리포트 페이지 (`/report/[session-id]`) — PRD 5.2
 * - 인증 → 무료 리포트 표시 → 유료 질문 선택
 */
const ReportPage = async ({ params }: Props) => {
  const { sessionId } = await params;

  const supabase = await createClient();

  // 분석 세션 조회
  const { data: session, error: sessionError } = await supabase
    .from('analysis_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (sessionError || !session) {
    notFound();
  }

  // 유료 질문은 report_data에서 가져옴 (report_data에 사전 생성되어 저장됨)

  // report_data에서 무료 리포트 + 유료 질문 파싱
  let freeReport: FreeReport | undefined;
  let paidQuestions: Array<{
    id: string;
    question: string;
    description: string;
    price: number;
    isPurchased: boolean;
    displayOrder: number;
    axis: 1 | 2 | 3;
    report?: Array<{ title: string; paragraphs: string[] }>;
  }> = [];

  if (session.report_data) {
    try {
      const reportData = JSON.parse(session.report_data) as {
        freeReport: any;
        paidQuestions: Array<{ id: string; question: string; description: string; price: number; displayOrder: number }>;
        currentAxis: 1 | 2 | 3;
      };

      // 무료 리포트 파싱
      if (typeof reportData.freeReport === 'string') {
        let reportText = reportData.freeReport;
        const jsonMatch = reportText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          reportText = jsonMatch[1];
        } else {
          reportText = reportText.trim();
        }

        const parsed = JSON.parse(reportText) as {
          headline: string;
          sections: Array<{ title: string; paragraphs: string[] }>;
          deficitSentence: string;
        };

        freeReport = {
          headline: parsed.headline || '분석 완료',
          sections: parsed.sections || [],
          deficitSentence: parsed.deficitSentence || '더 깊이 있는 분석을 원하신다면 유료 질문을 선택해보세요.',
        };
      }

      // 유료 질문 매핑
      paidQuestions = (reportData.paidQuestions || []).map((q: any) => ({
        id: q.id,
        question: q.question,
        description: q.description,
        price: q.price,
        isPurchased: false,
        displayOrder: q.displayOrder,
        axis: reportData.currentAxis,
        report: q.report, // 결제 후 생성된 확장 리포트
      }));
    } catch (error) {
      console.error('[ReportPage] Failed to parse report_data:', error);
    }
  }

  // Fallback: report_data 파싱 실패 시 free_report에서만 파싱
  if (!freeReport && session.free_report) {
    try {
      let reportText = session.free_report;
      const jsonMatch = reportText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        reportText = jsonMatch[1];
      } else {
        reportText = reportText.trim();
      }

      const parsed = JSON.parse(reportText) as {
        headline: string;
        sections: Array<{ title: string; paragraphs: string[] }>;
        deficitSentence: string;
      };

      freeReport = {
        headline: parsed.headline || '분석 완료',
        sections: parsed.sections || [],
        deficitSentence: parsed.deficitSentence || '더 깊이 있는 분석을 원하신다면 유료 질문을 선택해보세요.',
      };
    } catch (error) {
      console.error('[ReportPage] Fallback parse free_report failed:', error);
      freeReport = {
        headline: '분석 완료',
        sections: [
          {
            title: '분석 결과',
            paragraphs: [session.free_report.substring(0, 1000)],
          },
        ],
        deficitSentence: '더 깊이 있는 분석을 원하신다면 유료 질문을 선택해보세요.',
      };
    }
  }

  // report_data에서 currentAxis 추출 (없으면 session.current_axis 사용)
  let currentAxis: 1 | 2 | 3 = (Number(session.current_axis) || 1) as 1 | 2 | 3;
  if (session.report_data) {
    try {
      const reportData = JSON.parse(session.report_data) as { currentAxis?: 1 | 2 | 3 };
      if (reportData.currentAxis) {
        currentAxis = reportData.currentAxis;
      }
    } catch {
      // Fallback to session.current_axis
    }
  }

  // 전체 리포트 객체 구성
  const report = {
    sessionId,
    category: mapDbCategoryToFrontend(session.category),
    status: session.free_report_status === 'completed' ? ('done' as const) : ('generating' as const),
    freeReport,
    paidQuestions,
    currentAxis,
    ownerType: session.user_id ? ('member' as const) : ('guest' as const),
    memberId: session.user_id,
    createdAt: session.created_at,
  };

  // 주문 객체 생성 (Order 인터페이스 준수)
  const order = {
    id: sessionId,
    category: mapDbCategoryToFrontend(session.category),
    amount: 0, // 무료 리포트는 0원
    status: session.free_report_status === 'completed' ? ('done' as const) : ('generating' as const),
    ownerType: session.user_id ? ('member' as const) : ('anonymous' as const),
    memberId: session.user_id,
    createdAt: session.created_at,
  };

  return (
    <ErrorBoundary>
      <ReportClient
        order={order}
        report={report}
        initialAnalysisSession={session}
      />
    </ErrorBoundary>
  );
};

export default ReportPage;
