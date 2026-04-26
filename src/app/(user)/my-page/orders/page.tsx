'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order } from '@/types/order';
import { getMemberProfile, loginAsMember } from '@/lib/report-access';
import { DUMMY_MEMBER } from '@/lib/dummy-member';
import { listAllOrders } from '@/lib/dummy-orders';

type OrdersState =
  | { phase: 'loading' }
  | { phase: 'ready'; orders: Order[] };

const STATUS_META: Record<string, { label: string; color: string }> = {
  pending: { label: '결제 대기 중', color: '#F7A278' },
  generating: { label: '리포트 생성 중', color: '#C4B5D4' },
  done: { label: '완료', color: '#7B9B6A' },
  error: { label: '오류', color: '#C97B84' },
};

export default function OrdersPage() {
  const [state, setState] = useState<OrdersState>({ phase: 'loading' });

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

    setState({ phase: 'ready', orders: myOrders });
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
          <p className="text-sm text-[#4A3B5C]/70">구매 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const { orders } = state;

  if (orders.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4 text-foreground/60">아직 구매한 분석이 없어요.</p>
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
      {orders.map((order) => {
        const statusMeta = STATUS_META[order.status] || STATUS_META.pending;

        return (
          <div
            key={order.id}
            className="rounded-2xl border border-border/30 bg-white p-5 md:p-6 transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* 카테고리 */}
                <p className="mb-2 font-semibold md:text-lg" style={{ color: '#2D3250' }}>
                  {order.category}
                </p>

                {/* 메타 정보 */}
                <div className="grid gap-2 text-xs text-foreground/60 md:grid-cols-3">
                  <div>
                    <span className="block text-foreground/40">주문번호</span>
                    <span className="font-mono">{order.id.slice(0, 20)}...</span>
                  </div>
                  <div>
                    <span className="block text-foreground/40">결제 금액</span>
                    <span className="font-semibold text-foreground">{order.amount.toLocaleString('ko-KR')}원</span>
                  </div>
                  <div>
                    <span className="block text-foreground/40">결제일</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
              </div>

              {/* 상태와 링크 */}
              <div className="flex flex-col items-end gap-2">
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: statusMeta.color }}
                >
                  {statusMeta.label}
                </span>
                {order.status === 'done' && (
                  <Link
                    href={`/report/${order.id}`}
                    className="text-xs font-semibold transition-colors hover:text-[#7B6A9B]"
                    style={{ color: '#C4B5D4' }}
                  >
                    리포트 보기 →
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
