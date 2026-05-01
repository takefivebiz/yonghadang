'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Order } from '@/types/order';

type OrdersState =
  | { phase: 'loading' }
  | { phase: 'ready'; orders: Order[] }
  | { phase: 'error'; error: string };

const STATUS_META: Record<string, { label: string; color: string }> = {
  pending: { label: '결제 대기 중', color: '#F7A278' },
  generating: { label: '리포트 생성 중', color: '#C4B5D4' },
  done: { label: '완료', color: '#7B9B6A' },
  error: { label: '오류', color: '#C97B84' },
};

export const OrdersClient = () => {
  const [state, setState] = useState<OrdersState>({ phase: 'loading' });

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // 사용자 정보 조회
        const userResponse = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (!userResponse.ok) {
          setState({ phase: 'error', error: '인증 정보를 조회할 수 없어요' });
          return;
        }

        // TODO: [백엔드 연동] Supabase orders 테이블에서 조회
        // const { data: orders } = await supabase
        //   .from('orders')
        //   .select('*')
        //   .eq('user_id', user.id)
        //   .order('created_at', { ascending: false });
        const myOrders: Order[] = [];

        setState({ phase: 'ready', orders: myOrders });
      } catch (error) {
        console.error('[OrdersClient] 주문 로드 실패:', error);
        setState({ phase: 'error', error: '주문 정보를 불러올 수 없어요' });
      }
    };

    loadOrders();
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
          <p className="text-sm" style={{ color: '#D4C5E2' }}>구매 내역을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (state.phase === 'error') {
    return (
      <div className="text-center">
        <p className="mb-4" style={{ color: '#EF4444' }}>{state.error}</p>
      </div>
    );
  }

  const { orders } = state;

  if (orders.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4" style={{ color: '#D4C5E2' }}>아직 구매한 분석이 없어요.</p>
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
      {orders.map((order) => {
        const statusMeta = STATUS_META[order.status] || STATUS_META.pending;

        return (
          <div
            key={order.id}
            className="rounded-2xl border p-5 md:p-6 transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(75, 0, 130, 0.1))",
              borderColor: "rgba(230, 230, 250, 0.15)",
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* 카테고리 */}
                <p className="mb-2 font-semibold md:text-lg" style={{ color: '#F0E6FA' }}>
                  {order.category}
                </p>

                {/* 메타 정보 */}
                <div className="grid gap-2 text-xs md:grid-cols-3" style={{ color: '#D4C5E2' }}>
                  <div>
                    <span className="block" style={{ color: '#B8A8D8' }}>주문번호</span>
                    <span className="font-mono">{order.id.slice(0, 20)}...</span>
                  </div>
                  <div>
                    <span className="block" style={{ color: '#B8A8D8' }}>결제 금액</span>
                    <span className="font-semibold">{order.amount.toLocaleString('ko-KR')}원</span>
                  </div>
                  <div>
                    <span className="block" style={{ color: '#B8A8D8' }}>결제일</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                </div>
              </div>

              {/* 상태와 링크 */}
              <div className="flex flex-col items-end gap-2">
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: "rgba(100, 149, 237, 0.3)" }}
                >
                  {statusMeta.label}
                </span>
                {order.status === 'done' && (
                  <Link
                    href={`/report/${order.id}`}
                    className="text-xs font-semibold transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
                    style={{ color: '#BEAEDB' }}
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
};
