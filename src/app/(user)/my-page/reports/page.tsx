'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FullReport } from '@/types/report';
import { getMemberProfile, loginAsMember } from '@/lib/report-access';
import { DUMMY_MEMBER } from '@/lib/dummy-member';
import { listAllOrders } from '@/lib/dummy-orders';
import { DUMMY_REPORTS } from '@/lib/dummy-reports';

type ReportsState =
  | { phase: 'loading' }
  | { phase: 'ready'; reports: FullReport[] };

const CATEGORY_COLOR: Record<string, string> = {
  연애: '#F7A278',
  감정: '#C97B84',
  인간관계: '#C4B5D4',
  '직업/진로': '#7B6A9B',
};

export default function ReportsPage() {
  const [state, setState] = useState<ReportsState>({ phase: 'loading' });

  useEffect(() => {
    let profile = getMemberProfile();

    if (!profile) {
      loginAsMember(DUMMY_MEMBER);
      profile = DUMMY_MEMBER;
    }

    const myOrders = listAllOrders()
      .filter(
        (o) => o.ownerType === 'member' && o.memberId === profile!.memberId,
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    const reports = myOrders
      .map((order) => DUMMY_REPORTS[order.id])
      .filter(Boolean);

    setState({ phase: 'ready', reports });
  }, []);

  if (state.phase === 'loading') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <span
            className="inline-block h-6 w-6 animate-spin rounded-full border-2"
            style={{
              borderColor: 'rgba(74,59,92,0.15)',
              borderTopColor: '#9B88AC',
            }}
            aria-hidden="true"
          />
          <p className="text-sm text-[#4A3B5C]/70">리포트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const { reports } = state;

  if (reports.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4 text-foreground/60">아직 리포트가 없어요.</p>
        <Link
          href="/analyze"
          className="inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: '#2D3250' }}
        >
          지금 시작하기 →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-6">
      {reports.map((report) => (
        <Link
          key={report.sessionId}
          href={`/report/${report.sessionId}`}
          className="rounded-2xl border border-border/30 bg-white p-5 md:p-6 transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* 카테고리 뱃지 */}
              <div className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: `${CATEGORY_COLOR[report.category] || '#C4B5D4'}20`,
                  color: CATEGORY_COLOR[report.category] || '#C4B5D4',
                }}>
                {report.category}
              </div>

              {/* 제목 */}
              <p className="mb-2 font-semibold md:text-lg" style={{ color: '#2D3250' }}>
                {report.freeReport?.headline || '분석 리포트'}
              </p>

              {/* 메타 정보 */}
              <div className="flex flex-wrap gap-3 text-xs text-foreground/60">
                <span>{new Date(report.createdAt).toLocaleDateString('ko-KR')}</span>
                {report.paidQuestions && (
                  <span>
                    구매한 질문: {report.paidQuestions.filter((q) => q.isPurchased).length}개
                  </span>
                )}
              </div>
            </div>

            {/* 상태 배지 */}
            <div className="text-right">
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(196, 181, 212, 0.15)',
                  color: '#C4B5D4',
                }}
              >
                보기 →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
