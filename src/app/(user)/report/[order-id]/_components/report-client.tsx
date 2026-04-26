'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Order } from '@/types/order';
import { FullReport } from '@/types/report';
import { AnalysisSession } from '@/types/analysis';
import { hasGuestAccess, isMemberLoggedIn } from '@/lib/report-access';
import { GuestAuthForm } from './guest-auth-form';
import { ReportView } from './report-view';
import { ReportStatus } from './report-status';

interface ReportClientProps {
  order: Order;
  report: FullReport;
  initialAnalysisSession?: AnalysisSession | null;
}

type ViewState = 'checking' | 'auth' | 'status' | 'report';

/**
 * 리포트 페이지 오케스트레이터 — PRD 5.3, 6
 * - 인증 상태 확인 → 인증 통과 → AI 생성 상태 분기
 * TODO: [백엔드 연동] Server Component에서 Supabase 세션 기반으로 처리
 */
export const ReportClient = ({ order, report, initialAnalysisSession }: ReportClientProps) => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId') || order.id;
  const [view, setView] = useState<ViewState>('checking');
  const [analysisSession, setAnalysisSession] = useState<AnalysisSession | null>(initialAnalysisSession ?? null);

  useEffect(() => {
    // sessionStorage에서 분석 세션 가져오기 (분석 직후 리포트로 이동한 경우)
    const stored = sessionStorage.getItem(`analysis_${sessionId}`);
    if (stored) {
      try {
        const session = JSON.parse(stored) as AnalysisSession;
        setAnalysisSession(session);
      } catch (e) {
        console.error('Failed to parse analysis session:', e);
      }
    }

    const authed =
      order.ownerType === 'member'
        ? isMemberLoggedIn()
        : hasGuestAccess(order.id);

    if (!authed) {
      setView('auth');
      return;
    }

    setView(order.status === 'done' ? 'report' : 'status');
  }, [order, sessionId]);

  if (view === 'auth' && order.ownerType === 'member') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="mb-3 text-2xl font-bold" style={{ color: '#2D3250' }}>
          로그인이 필요해요
        </p>
        <p className="mb-8 text-sm text-foreground/60">
          이 리포트는 구매하신 회원만 열람할 수 있어요.
        </p>
        <a
          href={`/auth?redirect=/report/${order.id}`}
          className="inline-block rounded-xl px-8 py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: '#2D3250' }}
        >
          로그인하러 가기
        </a>
      </div>
    );
  }

  if (view === 'auth') {
    return (
      <div style={{ backgroundColor: '#FAF8F5' }}>
        <GuestAuthForm
          orderId={order.id}
          onSuccess={() => setView(order.status === 'done' ? 'report' : 'status')}
        />
      </div>
    );
  }

  if (view === 'status') {
    return (
      <ReportStatus
        orderId={order.id}
        initialStatus={order.status}
        errorMessage={order.errorMessage}
        onDone={() => setView('report')}
      />
    );
  }

  if (view === 'report') {
    return <ReportView report={report} analysisSession={analysisSession} />;
  }

  return <div className="min-h-screen" style={{ backgroundColor: '#FAF8F5' }} />;
};
