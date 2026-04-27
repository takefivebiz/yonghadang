'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FullReport } from '@/types/report';
import { getMemberProfile } from '@/lib/report-access';
import { listAllOrders } from '@/lib/dummy-orders';
import { DUMMY_REPORTS } from '@/lib/dummy-reports';

type ReportsState =
  | { phase: 'loading' }
  | { phase: 'ready'; reports: FullReport[] };

export const ReportsClient = () => {
  const [state, setState] = useState<ReportsState>({ phase: 'loading' });

  useEffect(() => {
    const profile = getMemberProfile();
    if (!profile) return;

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
              borderColor: 'rgba(230, 230, 250, 0.2)',
              borderTopColor: '#BEAEDB',
            }}
            aria-hidden="true"
          />
          <p className="text-sm" style={{ color: '#D4C5E2' }}>리포트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const { reports } = state;

  if (reports.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4" style={{ color: '#D4C5E2' }}>아직 리포트가 없어요.</p>
        <Link
          href="/analyze"
          className="inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{
            background: "linear-gradient(90deg, #6495ED 0%, #A366FF 100%)",
          }}
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
          className="rounded-2xl border p-5 md:p-6 transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{
            background: "linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))",
            borderColor: "rgba(230, 230, 250, 0.15)",
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* 카테고리 뱃지 */}
              <div className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: "rgba(100, 149, 237, 0.2)",
                  color: '#BEAEDB',
                }}>
                {report.category}
              </div>

              {/* 제목 */}
              <p className="mb-2 font-semibold md:text-lg" style={{ color: '#F0E6FA' }}>
                {report.freeReport?.headline || '분석 리포트'}
              </p>

              {/* 메타 정보 */}
              <div className="flex flex-wrap gap-3 text-xs" style={{ color: '#D4C5E2' }}>
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
                  backgroundColor: "rgba(100, 149, 237, 0.2)",
                  color: '#BEAEDB',
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
};
