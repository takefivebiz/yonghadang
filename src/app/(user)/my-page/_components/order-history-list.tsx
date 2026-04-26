import Link from 'next/link';
import { Order, OrderStatus } from '@/types/order';

interface OrderHistoryListProps {
  orders: Order[];
}

const STATUS_META: Record<OrderStatus, { label: string; bg: string; fg: string }> = {
  pending:    { label: '결제 대기', bg: 'rgba(100, 149, 237, 0.15)', fg: '#BEAEDB' },
  generating: { label: '분석 중',  bg: 'rgba(100, 149, 237, 0.15)', fg: '#A366FF' },
  done:       { label: '완료',     bg: 'rgba(163, 102, 255, 0.15)', fg: '#A366FF' },
  error:      { label: '오류',     bg: 'rgba(239, 68, 68, 0.1)', fg: '#EF4444' },
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

/** 마이페이지 분석 내역 리스트 — 각 카드 → /report/[session-id] */
export const OrderHistoryList = ({ orders }: OrderHistoryListProps) => {
  if (orders.length === 0) {
    return (
      <div
        className="rounded-3xl border border-dashed px-6 py-12 text-center"
        style={{
          borderColor: "rgba(230, 230, 250, 0.15)",
          background: "rgba(100, 149, 237, 0.05)",
        }}
      >
        <p className="mb-1 text-base font-semibold" style={{ color: '#F0E6FA' }}>
          아직 분석한 기록이 없어요
        </p>
        <p className="mb-6 text-sm" style={{ color: '#D4C5E2' }}>
          지금 첫 번째 분석을 시작해보세요
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80"
          style={{
            background: "linear-gradient(90deg, #6495ED 0%, #A366FF 100%)",
          }}
        >
          분석 시작하기
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => {
        const meta = STATUS_META[order.status];
        return (
          <li key={order.id}>
            <Link
              href={`/report/${order.id}`}
              className="group flex items-center gap-4 overflow-hidden rounded-2xl border px-4 py-4 transition-all hover:-translate-y-0.5 sm:px-5"
              style={{
                borderColor: "rgba(230, 230, 250, 0.15)",
                background: "linear-gradient(135deg, rgba(100, 149, 237, 0.1), rgba(75, 0, 130, 0.05))",
              }}
            >
              {/* 카테고리 뱃지 */}
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg, #6495ED 0%, #A366FF 100%)",
                  color: "#F0E6FA",
                }}
              >
                {order.category}
              </div>

              {/* 본문 */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={{ backgroundColor: meta.bg, color: meta.fg }}
                  >
                    {meta.label}
                  </span>
                </div>
                <p className="truncate text-sm font-semibold" style={{ color: '#F0E6FA' }}>
                  {order.category} 분석 리포트
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs" style={{ color: '#D4C5E2' }}>
                  <span>{formatDate(order.createdAt)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{order.amount.toLocaleString('ko-KR')}원</span>
                </div>
              </div>

              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
                style={{ color: '#D4C5E2' }}
              >
                →
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
