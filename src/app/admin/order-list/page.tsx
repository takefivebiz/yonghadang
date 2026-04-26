'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import { DUMMY_ADMIN_ORDERS } from '@/lib/dummy-admin';
import { AdminOrderSummary } from '@/types/admin';
import { AnalysisCategory } from '@/types/analysis';
import { OrderOwnerType, OrderStatus } from '@/types/order';

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const MAP: Record<OrderStatus, { label: string; className: string }> = {
    done:       { label: '완료',   className: 'bg-emerald-100 text-emerald-700' },
    generating: { label: '생성중', className: 'bg-amber-100 text-amber-700' },
    pending:    { label: '대기중', className: 'bg-gray-100 text-gray-600' },
    error:      { label: '오류',   className: 'bg-red-100 text-red-600' },
  };
  const { label, className } = MAP[status];
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>{label}</span>;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
};

const CATEGORIES: AnalysisCategory[] = ['연애', '감정', '인간관계', '직업/진로'];
type OwnerFilter = 'all' | OrderOwnerType;
type CategoryFilter = 'all' | AnalysisCategory;

/**
 * 관리자 주문 내역 리스트.
 * TODO: [백엔드 연동] /api/admin/orders 실제 호출로 교체
 */
const AdminOrderListPage = () => {
  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const orders: AdminOrderSummary[] = DUMMY_ADMIN_ORDERS;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter((o) => {
      if (ownerFilter !== 'all' && o.ownerType !== ownerFilter) return false;
      if (categoryFilter !== 'all' && o.category !== categoryFilter) return false;
      if (q && !o.id.toLowerCase().includes(q) && !o.nickname.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [orders, search, ownerFilter, categoryFilter]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">주문 내역</h1>
        <p className="mt-1 text-sm text-foreground/60">결제 완료된 분석 주문을 조회합니다.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-48 flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            type="text"
            placeholder="주문번호 또는 닉네임 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value as OwnerFilter)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none"
        >
          <option value="all">전체 (회원/비회원)</option>
          <option value="member">회원</option>
          <option value="guest">비회원</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none"
        >
          <option value="all">전체 카테고리</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 border-b border-border bg-background/50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-foreground/50">
          <span>세션 ID / 카테고리</span>
          <span className="hidden sm:block">주문 일시</span>
          <span className="hidden md:block">닉네임</span>
          <span>구분</span>
          <span className="hidden sm:block">금액</span>
          <span>상태</span>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-foreground/50">검색 결과가 없습니다.</p>
        ) : (
          filtered.map((order) => (
            <Link
              key={order.id}
              href={`/admin/order-list/${order.id}`}
              className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] items-center gap-4 border-b border-border/50 px-5 py-4 text-sm last:border-b-0 hover:bg-secondary/30"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{order.category} 분석</p>
                <p className="truncate text-xs text-foreground/50">{order.id}</p>
              </div>
              <span className="hidden whitespace-nowrap text-xs text-foreground/60 sm:block">
                {formatDate(order.createdAt)}
              </span>
              <span className="hidden text-foreground/80 md:block">{order.nickname}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${order.ownerType === 'member' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                {order.ownerType === 'member' ? '회원' : '비회원'}
              </span>
              <span className="hidden whitespace-nowrap font-semibold sm:block">
                {order.amount.toLocaleString()}원
              </span>
              <div className="flex items-center gap-1">
                <StatusBadge status={order.status} />
                <ChevronRight size={14} className="text-foreground/30" />
              </div>
            </Link>
          ))
        )}
      </div>

      <p className="text-right text-xs text-foreground/50">총 {filtered.length}건</p>
    </div>
  );
};

export default AdminOrderListPage;
