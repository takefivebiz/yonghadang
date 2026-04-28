'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Order } from '@/types/order';
import { FullReport } from '@/types/report';
import { AnalysisSession } from '@/types/analysis';
import { hasGuestAccess, isMemberLoggedIn, getMemberProfile } from '@/lib/report-access';
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
export const ReportClient = ({ order: initialOrder, report, initialAnalysisSession }: ReportClientProps) => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId') || initialOrder.id;
  const [view, setView] = useState<ViewState>('checking');
  // 비회원 결제 후 order 업데이트 감시
  const [order, setOrder] = useState<Order>(initialOrder);
  // TODO: [기능 확장] 분석 세션 정보는 향후 재분석, 히스토리 추적 등에서 활용 예정
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [analysisSession, setAnalysisSession] = useState<AnalysisSession | null>(initialAnalysisSession ?? null);

  // localStorage의 order 변경 감시 (비회원 결제 후 업데이트)
  useEffect(() => {
    const checkOrderUpdate = () => {
      if (typeof window === 'undefined') return;
      try {
        const stored = localStorage.getItem('corelog:local_orders');
        if (stored) {
          const orders = JSON.parse(stored) as Order[];
          const updated = orders.find(o => o.id === sessionId);
          if (updated) {
            setOrder(updated);
          }
        }
      } catch {
        // ignore
      }
    };

    const interval = setInterval(checkOrderUpdate, 1000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    // 결제 실패 후 복귀 시 토스트 표시
    const failMsg = sessionStorage.getItem(`payment_fail_toast_${order.id}`);
    if (failMsg) {
      sessionStorage.removeItem(`payment_fail_toast_${order.id}`);
      toast.error(failMsg);
    }

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
      order.ownerType === 'anonymous'
        ? true // 비회원 무료리포트는 인증 불필요
        : order.ownerType === 'member'
        // 로그인 여부 + memberId 일치 여부 동시 검증 (타인의 리포트 접근 차단)
        // TODO: [백엔드 연동] 서버에서 Supabase RLS로 소유권 검증
        ? isMemberLoggedIn() && getMemberProfile()?.memberId === order.memberId
        : hasGuestAccess(order.id); // 'guest'는 전화번호+비밀번호 인증 필요

    if (!authed) {
      setView('auth');
      return;
    }

    setView(order.status === 'done' ? 'report' : 'status');
  }, [order, sessionId]);

  if (view === 'auth' && order.ownerType === 'member') {
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
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="mx-auto w-full max-w-md">
            {/* 아이콘 */}
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.2), rgba(163, 102, 255, 0.15))',
                boxShadow: '0 8px 32px rgba(100, 149, 237, 0.15)',
              }}
              aria-hidden="true"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6495ED"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 0 1 10 10v6H2v-6a10 10 0 0 1 10-10Z" />
                <path d="M9 13v4" />
                <path d="M15 13v4" />
                <circle cx="12" cy="18" r="0.5" fill="#6495ED" />
              </svg>
            </div>

            {/* 텍스트 */}
            <div className="text-center">
              <h1 className="mb-2 text-2xl font-bold md:text-3xl" style={{ color: '#F5F5F5' }}>
                로그인이 필요해요
              </h1>
              <p className="mb-8 text-sm leading-relaxed" style={{ color: '#D4C5E2' }}>
                이 리포트는 구매하신 회원만 열람할 수 있어요.
                <br />
                계정에 로그인해서 내 분석 결과를 확인해보세요.
              </p>
            </div>

            {/* 버튼 */}
            <a
              href={`/auth?redirect=/report/${order.id}`}
              className="block w-full rounded-full py-4 text-center text-sm font-semibold transition-all duration-300 hover:scale-[1.02] text-white"
              style={{
                background: 'linear-gradient(90deg, #6495ED 0%, #A366FF 100%)',
              }}
            >
              로그인하러 가기
            </a>

            {/* 추가 안내 */}
            <p className="mt-8 text-center text-xs leading-relaxed" style={{ color: '#B8A8D8' }}>
              계정이 없다면
              <br />
              <a href="/auth" className="underline hover:text-white transition-colors">
                가입하기
              </a>
            </p>
          </div>
        </div>
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
    return <ReportView report={report} order={order} />;
  }

  return <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #1B003F 0%, #191970 100%)' }} />;
};
