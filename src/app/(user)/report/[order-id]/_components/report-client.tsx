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
  // TODO: [기능 확장] 분석 세션 정보는 향후 재분석, 히스토리 추적 등에서 활용 예정
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      <div className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(160deg, #1B003F 0%, #191970 100%)' }}>
        {/* 배경 장식 - blur 요소 */}
        <div
          className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl"
          style={{ backgroundColor: '#6495ED', opacity: 0.15 }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-40 h-80 w-80 rounded-full blur-3xl"
          style={{ backgroundColor: '#E6E6FA', opacity: 0.08 }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/2 right-1/4 h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: '#A366FF', opacity: 0.1 }}
          aria-hidden="true"
        />

        {/* 네온 라인 장식 - 좌측 */}
        <div
          className="pointer-events-none absolute left-0 top-1/4 h-px w-32 opacity-60"
          style={{
            background: 'linear-gradient(90deg, transparent, #6495ED, transparent)',
            boxShadow: '0 0 20px #6495ED, 0 0 40px rgba(100, 149, 237, 0.5)',
          }}
          aria-hidden="true"
        />

        {/* 네온 라인 장식 - 우측 */}
        <div
          className="pointer-events-none absolute right-0 top-2/3 h-px w-40 opacity-50"
          style={{
            background: 'linear-gradient(90deg, transparent, #A366FF, transparent)',
            boxShadow: '0 0 20px #A366FF, 0 0 40px rgba(163, 102, 255, 0.4)',
          }}
          aria-hidden="true"
        />

        {/* 네온 도트 - 좌상단 */}
        <div
          className="pointer-events-none absolute left-1/4 top-1/3 h-1.5 w-1.5 rounded-full opacity-70"
          style={{
            backgroundColor: '#6495ED',
            boxShadow: '0 0 15px #6495ED, 0 0 30px rgba(100, 149, 237, 0.6)',
          }}
          aria-hidden="true"
        />

        {/* 네온 도트 - 우하단 */}
        <div
          className="pointer-events-none absolute bottom-1/4 right-1/3 h-2 w-2 rounded-full opacity-50"
          style={{
            backgroundColor: '#A366FF',
            boxShadow: '0 0 15px #A366FF, 0 0 30px rgba(163, 102, 255, 0.5)',
          }}
          aria-hidden="true"
        />

        {/* 콘텐츠 */}
        <div className="relative z-10">
          <GuestAuthForm
            orderId={order.id}
            onSuccess={() => setView(order.status === 'done' ? 'report' : 'status')}
          />
        </div>
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
    return <ReportView report={report} />;
  }

  return <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #1B003F 0%, #191970 100%)' }} />;
};
